import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";
import { ensureStripeCustomerForUser } from "@/lib/stripe/customer";
import { getStripeClient } from "@/lib/stripe/client";
import { resolvePriceIdFromPlan } from "@/lib/usage/plans";
import { appConfig } from "@/lib/config";

const schema = z.object({
  plan: z.enum(["starter", "pro", "agency"])
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const body = schema.parse(await req.json());
    const priceId = resolvePriceIdFromPlan(body.plan);

    if (!priceId) {
      return fail(`Missing Stripe price id for ${body.plan}`, 500);
    }

    const customerId = await ensureStripeCustomerForUser(user.id);

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appConfig.appUrl}/settings?checkout=success`,
      cancel_url: `${appConfig.appUrl}/settings?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan: body.plan
      }
    });

    return ok({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Checkout failed", 500);
  }
}
