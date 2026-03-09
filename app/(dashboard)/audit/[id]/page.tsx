import { notFound } from "next/navigation";
import { AuditResult } from "@/components/audit/AuditResult";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuditDetailsPage({ params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("audits")
      .select("result_json")
      .eq("id", params.id)
      .single();

    if (error || !data?.result_json) {
      notFound();
    }

    return <AuditResult data={data.result_json} />;
  } catch {
    notFound();
  }
}
