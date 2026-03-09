import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest, getProfile } from "@/lib/audit/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const [profile, usageWindow] = await Promise.all([
      getProfile(user.id),
      createSupabaseServiceClient()
        .from("usage_logs")
        .select("tokens_used, cost_usd, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200)
    ]);

    if (usageWindow.error) {
      throw new Error(`Failed to load usage logs: ${usageWindow.error.message}`);
    }

    let tokens = 0;
    let cost = 0;
    const now = Date.now();
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    for (const row of usageWindow.data ?? []) {
      const created = row.created_at ? new Date(row.created_at).getTime() : 0;
      if (created >= monthAgo) {
        tokens += row.tokens_used ?? 0;
        cost += Number(row.cost_usd ?? 0);
      }
    }

    return ok({
      plan: profile.plan,
      auditsUsed: profile.audits_used,
      auditsLimit: profile.audits_limit,
      last30Days: {
        tokensUsed: tokens,
        costUsd: Number(cost.toFixed(4))
      }
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Usage lookup failed", 500);
  }
}
