import { getStripeClient } from "@/lib/stripe/client";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function ensureStripeCustomerForUser(userId: string): Promise<string> {
  const supabase = createSupabaseServiceClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("email, full_name, stripe_customer_id")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw new Error(`Profile lookup failed: ${error?.message ?? "profile missing"}`);
  }

  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email: profile.email,
    name: profile.full_name || undefined,
    metadata: {
      supabase_user_id: userId
    }
  });

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Failed to save stripe customer id: ${updateError.message}`);
  }

  return customer.id;
}
