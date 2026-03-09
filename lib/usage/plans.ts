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
