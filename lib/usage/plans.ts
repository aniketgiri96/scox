export type PlanName = "free" | "starter" | "pro" | "agency";

export const planAuditLimits: Record<PlanName, number> = {
  free: 1,
  starter: 10,
  pro: 50,
  agency: Number.MAX_SAFE_INTEGER
};

export function defaultLimitForPlan(plan: string): number {
  const normalized = plan.toLowerCase() as PlanName;
  return planAuditLimits[normalized] ?? planAuditLimits.free;
}

export function resolvePlanFromPriceId(priceId?: string | null): PlanName {
  if (!priceId) return "free";

  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) return "agency";
  return "free";
}

export function resolvePriceIdFromPlan(plan: PlanName): string | null {
  if (plan === "starter") return process.env.STRIPE_STARTER_PRICE_ID ?? null;
  if (plan === "pro") return process.env.STRIPE_PRO_PRICE_ID ?? null;
  if (plan === "agency") return process.env.STRIPE_AGENCY_PRICE_ID ?? null;
  return null;
}
