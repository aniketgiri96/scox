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

function buildPublicSlug(niche: string, auditId: string): string {
  const base = niche
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return `${base || "audit"}-${auditId.slice(0, 8)}`;
}

export async function publishAudit(userId: string, auditId: string): Promise<{ slug: string }> {
  const supabase = createSupabaseServiceClient();

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("id, niche, user_id")
    .eq("id", auditId)
    .single();

  if (auditError || !audit) {
    throw new Error("Audit not found");
  }

  if (audit.user_id !== userId) {
    throw new Error("Forbidden");
  }

  const slug = buildPublicSlug(audit.niche, audit.id);
  const { error: updateError } = await supabase
    .from("audits")
    .update({ is_public: true, public_slug: slug })
    .eq("id", audit.id);

  if (updateError) {
    throw new Error(`Failed to publish audit: ${updateError.message}`);
  }

  return { slug };
}

export async function unpublishAudit(userId: string, auditId: string): Promise<void> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("audits")
    .select("user_id")
    .eq("id", auditId)
    .single();

  if (error || !data) {
    throw new Error("Audit not found");
  }

  if (data.user_id !== userId) {
    throw new Error("Forbidden");
  }

  const { error: updateError } = await supabase
    .from("audits")
    .update({ is_public: false, public_slug: null })
    .eq("id", auditId);

  if (updateError) {
    throw new Error(`Failed to unpublish audit: ${updateError.message}`);
  }
}
