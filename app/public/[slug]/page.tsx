import { notFound } from "next/navigation";
import { AuditResult } from "@/components/audit/AuditResult";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PublicAuditPage({ params }: { params: { slug: string } }) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("audits")
    .select("niche, industry, score, grade, result_json, created_at")
    .eq("public_slug", params.slug)
    .eq("is_public", true)
    .single();

  if (error || !data?.result_json) {
    notFound();
  }

  return (
    <main className="stack" style={{ gap: "1rem" }}>
      <section className="card" style={{ padding: "1rem" }}>
        <p className="badge">Public SEOX Audit</p>
        <h1 style={{ margin: "0.45rem 0 0.2rem" }}>
          {data.niche} · {data.industry}
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Generated on {new Date(data.created_at).toLocaleString()}
        </p>
      </section>
      <AuditResult data={data.result_json} />
      <section className="card" style={{ padding: "1rem" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
          Powered by SEOX: 9-dimension SEO + GEO audit intelligence.
        </p>
      </section>
    </main>
  );
}
