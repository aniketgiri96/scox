import { notFound } from "next/navigation";
import { AuditResult } from "@/components/audit/AuditResult";
import { AuditActions } from "@/components/audit/AuditActions";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuditDetailsPage({ params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("audits")
      .select("id, result_json, is_public, public_slug")
      .eq("id", params.id)
      .single();

    if (error || !data?.result_json) {
      notFound();
    }

    return (
      <div className="stack" style={{ gap: "1rem" }}>
        <AuditActions auditId={data.id} isPublic={data.is_public} publicSlug={data.public_slug} />
        <AuditResult data={data.result_json} />
      </div>
    );
  } catch {
    notFound();
  }
}
