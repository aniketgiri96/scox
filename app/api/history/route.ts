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
    const { data, error } = await supabase
      .from("audits")
      .select("id, niche, industry, score, grade, created_at, is_public, public_slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to load history: ${error.message}`);
    }

    return ok({ audits: data ?? [] });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "History lookup failed", 500);
  }
}
