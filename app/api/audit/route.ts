import { z } from "zod";
import { NextRequest } from "next/server";
import { runAudit, runCompetitorAnalysis, runResearch } from "@/lib/anthropic/client";
import { deriveGrade } from "@/lib/audit/grade";
import { getProfile, getUserFromRequest } from "@/lib/audit/auth";
import { incrementUsage, saveAudit, saveCompetitorAnalysis } from "@/lib/audit/persistence";
import { fetchUrlSnapshot, formatCrawlData } from "@/lib/crawler/fetch-url";
import { fail, ok } from "@/lib/http";
import { loadPattern, updatePattern } from "@/lib/patterns/industry";

const schema = z.object({
  niche: z.string().min(2),
  industry: z.string().min(2),
  content: z.string().min(30).optional(),
  competitors: z.array(z.string().min(2)).optional(),
  url: z.string().url().optional()
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const profile = await getProfile(user.id);
    const limitReached =
      profile.plan !== "agency" && (profile.audits_used ?? 0) >= (profile.audits_limit ?? 1);

    if (limitReached) {
      return fail("limit_reached", 402, {
        audits_used: profile.audits_used,
        audits_limit: profile.audits_limit
      });
    }

    const body = schema.parse(await req.json());

    let finalContent = body.content ?? "";
    if (body.url) {
      const crawled = await fetchUrlSnapshot(body.url);
      finalContent = formatCrawlData(crawled);
    }

    if (!finalContent.trim()) {
      return fail("content or url is required", 422);
    }

    const research = await runResearch({
      niche: body.niche,
      industry: body.industry,
      content: finalContent
    });

    const pattern = await loadPattern(body.industry);

    const audit = await runAudit({
      niche: body.niche,
      industry: body.industry,
      content: finalContent,
      research,
      pattern
    });

    audit.grade = deriveGrade(audit.score);

    if (body.competitors && body.competitors.length > 0) {
      audit.competitorData = await runCompetitorAnalysis({
        niche: body.niche,
        industry: body.industry,
        competitors: body.competitors,
        content: finalContent,
        research
      });
    }

    const saved = await saveAudit({
      userId: user.id,
      niche: body.niche,
      industry: body.industry,
      url: body.url,
      result: audit
    });

    if (audit.competitorData && body.competitors?.length) {
      await saveCompetitorAnalysis(saved.id, audit.competitorData, body.competitors);
    }

    await updatePattern(body.industry, audit);
    await incrementUsage(user.id, saved.id);

    return ok({ auditId: saved.id, ...audit });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Audit failed", 500);
  }
}
