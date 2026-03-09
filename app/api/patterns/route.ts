import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const supabase = createSupabaseServiceClient();

    const [{ data: patterns, error: patternError }, { data: topIndustries, error: userError }] =
      await Promise.all([
        supabase
          .from("industry_patterns")
          .select("archetype, total_audits, avg_score, common_issues, top_insights, updated_at")
          .order("total_audits", { ascending: false })
          .limit(20),
        supabase
          .from("audits")
          .select("industry")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100)
      ]);

    if (patternError) {
      throw new Error(`Failed to load patterns: ${patternError.message}`);
    }

    if (userError) {
      throw new Error(`Failed to load user industries: ${userError.message}`);
    }

    const byIndustry: Record<string, number> = {};
    for (const row of topIndustries ?? []) {
      const key = row.industry?.toLowerCase?.() ?? "unknown";
      byIndustry[key] = (byIndustry[key] ?? 0) + 1;
    }

    return ok({
      patterns: patterns ?? [],
      userIndustryFrequency: byIndustry
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Pattern lookup failed", 500);
  }
}
