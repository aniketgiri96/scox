import { z } from "zod";
import { NextRequest } from "next/server";
import { runResearch } from "@/lib/anthropic/client";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";

const schema = z.object({
  niche: z.string().min(2),
  industry: z.string().min(2),
  content: z.string().min(30)
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const body = schema.parse(await req.json());
    const result = await runResearch(body);
    return ok(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Research failed", 500);
  }
}
