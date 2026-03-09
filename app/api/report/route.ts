import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { NextRequest } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/http";
import { createSimplePdfBuffer } from "@/lib/report/pdf";
import { getUserFromRequest } from "@/lib/audit/auth";

const schema = z.object({
  auditId: z.string().uuid(),
  whiteLabel: z.boolean().default(false),
  brandName: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const body = schema.parse(await req.json());
    const supabase = createSupabaseServiceClient();

    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .select("id, user_id, score, grade, niche, industry, result_json, created_at")
      .eq("id", body.auditId)
      .single();

    if (auditError || !audit) {
      return fail("Audit not found", 404);
    }

    if (audit.user_id !== user.id) {
      return fail("Forbidden", 403);
    }

    const summary = audit.result_json?.executiveSummary ?? "Summary unavailable";
    const quickWin = audit.result_json?.quickWin ?? "Quick win unavailable";
    const dimensions = Array.isArray(audit.result_json?.dimensions) ? audit.result_json.dimensions : [];

    const lines = [
      body.whiteLabel && body.brandName ? `${body.brandName} SEO Report` : "SEOX Audit Report",
      `Audit ID: ${audit.id}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Niche: ${audit.niche}`,
      `Industry: ${audit.industry}`,
      `Score: ${audit.score ?? "N/A"} | Grade: ${audit.grade ?? "N/A"}`,
      `Executive Summary: ${summary}`,
      `Fastest Win: ${quickWin}`,
      "Top Dimensions:"
    ];

    for (const dimension of dimensions.slice(0, 6)) {
      lines.push(`- ${dimension.name}: ${dimension.score}/100`);
    }

    const pdfBytes = createSimplePdfBuffer(lines);
    const fileName = `${audit.id}.pdf`;
    const reportsBucket = process.env.SUPABASE_REPORTS_BUCKET;
    let pdfUrl = `/reports/${fileName}`;

    if (reportsBucket) {
      const { error: uploadError } = await supabase.storage
        .from(reportsBucket)
        .upload(fileName, pdfBytes, { contentType: "application/pdf", upsert: true });

      if (uploadError) {
        throw new Error(`Failed to upload report to storage: ${uploadError.message}`);
      }

      const { data: publicData } = supabase.storage.from(reportsBucket).getPublicUrl(fileName);
      pdfUrl = publicData.publicUrl;
    } else {
      const reportsDir = path.join(process.cwd(), "public", "reports");
      await fs.mkdir(reportsDir, { recursive: true });
      const filePath = path.join(reportsDir, fileName);
      await fs.writeFile(filePath, pdfBytes);
    }

    const { error: saveError } = await supabase.from("reports").insert({
      audit_id: audit.id,
      pdf_url: pdfUrl,
      white_label: body.whiteLabel,
      brand_name: body.brandName ?? null
    });

    if (saveError) {
      throw new Error(`Failed to save report metadata: ${saveError.message}`);
    }

    return ok({ reportUrl: pdfUrl });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("Invalid request payload", 422, error.flatten());
    }
    return fail(error instanceof Error ? error.message : "Report generation failed", 500);
  }
}
