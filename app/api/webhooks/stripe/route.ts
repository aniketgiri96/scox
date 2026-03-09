import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/http";
import { requireEnv } from "@/lib/config";
import { defaultLimitForPlan, resolvePlanFromPriceId } from "@/lib/usage/plans";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return fail("Missing stripe signature", 400);
  }

  const body = await req.text();
  const stripe = getStripeClient();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, requireEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Invalid signature", 400);
  }

  try {
    const supabase = createSupabaseServiceClient();

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
      const priceId = subscription.items.data[0]?.price?.id;
      const plan = resolvePlanFromPriceId(priceId);

      if (customerId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan,
            audits_limit: defaultLimitForPlan(plan),
            stripe_subscription_id: subscription.id
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          throw new Error(`Failed to sync subscription: ${error.message}`);
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;

      if (customerId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: "free",
            audits_limit: 1,
            stripe_subscription_id: null
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          throw new Error(`Failed to downgrade subscription: ${error.message}`);
        }
      }
    }

    return ok({ received: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Webhook processing failed", 500);
  }
}
