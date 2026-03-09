import { z } from "zod";
import { NextRequest } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/http";

const schema = z.object({
  auditId: z.string().uuid(),
  whiteLabel: z.boolean().default(false),
  brandName: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const supabase = createSupabaseServiceClient();

    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .select("id, score, grade, niche, industry, created_at")
      .eq("id", body.auditId)
      .single();

    if (auditError || !audit) {
      return fail("Audit not found", 404);
    }

    const pdfUrl = `/reports/${audit.id}.pdf`;

    const { error: saveError } = await supabase.from("reports").insert({
      audit_id: audit.id,
      pdf_url: pdfUrl,
      white_label: body.whiteLabel,
      brand_name: body.brandName ?? null
    });

    if (saveError) {
      throw new Error(`Failed to save report metadata: ${saveError.message}`);
    }

    return ok({
      reportUrl: pdfUrl,
      message:
        "Report metadata created. Add PDF rendering/storage integration in app/api/report/route.ts for final output."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Report generation failed", 500);
  }
}
