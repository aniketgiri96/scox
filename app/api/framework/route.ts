import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";
import { runFrameworkStrategy } from "@/lib/anthropic/client";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  niche: z.string().min(2),
  industry: z.string().min(2),
  objective: z.string().min(8),
  constraints: z.array(z.string()).optional()
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const body = schema.parse(await req.json());
    const framework = await runFrameworkStrategy(body);

    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("frameworks")
      .insert({
        user_id: user.id,
        niche: body.niche,
        industry: body.industry,
        objective: body.objective,
        strategy_json: framework
      })
      .select("id, created_at")
      .single();

    if (error) {
      throw new Error(`Failed to save framework: ${error.message}`);
    }

    return ok({ frameworkId: data.id, createdAt: data.created_at, framework });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Framework generation failed", 500);
  }
}
