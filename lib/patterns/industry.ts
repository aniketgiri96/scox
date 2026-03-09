import type { AuditResult, IndustryPattern } from "@/lib/audit/types";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

function nextAverage(currentAvg: number, currentCount: number, incomingScore: number): number {
  if (currentCount <= 0) {
    return incomingScore;
  }
  return Number(((currentAvg * currentCount + incomingScore) / (currentCount + 1)).toFixed(2));
}

function collectIssueFrequency(audit: AuditResult): Record<string, number> {
  const map: Record<string, number> = {};

  for (const dimension of audit.dimensions) {
    for (const issue of dimension.issues.slice(0, 3)) {
      map[issue] = (map[issue] ?? 0) + 1;
    }
  }

  return map;
}

export async function loadPattern(archetype: string): Promise<IndustryPattern | null> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("industry_patterns")
    .select("*")
    .eq("archetype", archetype.toLowerCase())
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load industry pattern: ${error.message}`);
  }

  return data as IndustryPattern | null;
}

export async function updatePattern(archetype: string, audit: AuditResult): Promise<void> {
  const supabase = createSupabaseServiceClient();
  const normalizedArchetype = archetype.toLowerCase().trim();
  const existing = await loadPattern(normalizedArchetype);

  const incomingIssues = collectIssueFrequency(audit);
  const mergedIssues: Record<string, number> = { ...(existing?.common_issues ?? {}) };
  for (const [issue, count] of Object.entries(incomingIssues)) {
    mergedIssues[issue] = (mergedIssues[issue] ?? 0) + count;
  }

  const topInsights = [audit.quickWin, ...audit.confidenceNotes].slice(0, 8);

  const payload = {
    archetype: normalizedArchetype,
    total_audits: (existing?.total_audits ?? 0) + 1,
    avg_score: nextAverage(existing?.avg_score ?? 0, existing?.total_audits ?? 0, audit.score),
    common_issues: mergedIssues,
    top_insights: topInsights,
    schema_types: ["Organization", "WebPage", "FAQPage"],
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("industry_patterns").upsert(payload, {
    onConflict: "archetype"
  });

  if (error) {
    throw new Error(`Failed to update industry pattern: ${error.message}`);
  }
}
