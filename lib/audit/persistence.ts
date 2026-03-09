import type { AuditResult, CompetitorAnalysis } from "@/lib/audit/types";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function saveAudit(input: {
  userId: string;
  niche: string;
  industry: string;
  url?: string;
  result: AuditResult;
}): Promise<{ id: string }> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("audits")
    .insert({
      user_id: input.userId,
      niche: input.niche,
      industry: input.industry,
      url: input.url ?? null,
      score: input.result.score,
      grade: input.result.grade,
      result_json: input.result
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to save audit: ${error.message}`);
  }

  return { id: data.id as string };
}

export async function saveCompetitorAnalysis(
  auditId: string,
  data: CompetitorAnalysis,
  competitors: string[]
): Promise<void> {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("competitor_analyses").insert({
    audit_id: auditId,
    competitors,
    gaps_json: data.gaps,
    battle_plan: data.battlePlan
  });

  if (error) {
    throw new Error(`Failed to save competitor analysis: ${error.message}`);
  }
}

export async function incrementUsage(userId: string, auditId: string, tokensUsed = 0, costUsd = 0): Promise<void> {
  const supabase = createSupabaseServiceClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("audits_used")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw new Error(`Failed to fetch profile usage: ${profileError.message}`);
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ audits_used: (profile.audits_used ?? 0) + 1 })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Failed to increment audits_used: ${updateError.message}`);
  }

  const { error: usageError } = await supabase.from("usage_logs").insert({
    user_id: userId,
    audit_id: auditId,
    tokens_used: tokensUsed,
    cost_usd: costUsd
  });

  if (usageError) {
    throw new Error(`Failed to insert usage log: ${usageError.message}`);
  }
}
