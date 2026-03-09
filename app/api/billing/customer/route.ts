import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";
import { ensureStripeCustomerForUser } from "@/lib/stripe/customer";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const customerId = await ensureStripeCustomerForUser(user.id);
    return ok({ customerId });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to create customer", 500);
  }
}
