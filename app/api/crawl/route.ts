import { z } from "zod";
import { NextRequest } from "next/server";
import { fetchUrlSnapshot } from "@/lib/crawler/fetch-url";
import { fail, ok } from "@/lib/http";
import { getUserFromRequest } from "@/lib/audit/auth";

const crawlSchema = z.object({
  url: z.string().url()
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const body = crawlSchema.parse(await req.json());
    const snapshot = await fetchUrlSnapshot(body.url);
    return ok(snapshot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Crawl failed", 500);
  }
}
