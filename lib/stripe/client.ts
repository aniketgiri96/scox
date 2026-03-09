import Stripe from "stripe";
import { requireEnv } from "@/lib/config";

let cachedStripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!cachedStripe) {
    cachedStripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  }
  return cachedStripe;
}
