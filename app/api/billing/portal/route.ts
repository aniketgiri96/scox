import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";
import { ensureStripeCustomerForUser } from "@/lib/stripe/customer";
import { getStripeClient } from "@/lib/stripe/client";
import { appConfig } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const customerId = await ensureStripeCustomerForUser(user.id);
    const stripe = getStripeClient();

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appConfig.appUrl}/settings`
    });

    return ok({ portalUrl: portal.url });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Portal session failed", 500);
  }
}
