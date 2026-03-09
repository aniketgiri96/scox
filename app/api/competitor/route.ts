import { z } from "zod";
import { NextRequest } from "next/server";
import { runCompetitorAnalysis } from "@/lib/anthropic/client";
import { fail, ok } from "@/lib/http";

const schema = z.object({
  niche: z.string().min(2),
  industry: z.string().min(2),
  content: z.string().min(30),
  competitors: z.array(z.string().min(2)).min(1),
  research: z.object({
    macroTrends: z.array(z.string()),
    serpSignals: z.array(z.string()),
    geoSignals: z.array(z.string()),
    opportunities: z.array(z.string()),
    risks: z.array(z.string())
  })
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const result = await runCompetitorAnalysis(body);
    return ok(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Competitor analysis failed", 500);
  }
}
