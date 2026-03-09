import type { AuditResult as AuditResultType } from "@/lib/audit/types";
import { DimensionCard } from "@/components/audit/DimensionCard";
import { GeoScore } from "@/components/audit/GeoScore";
import { CompetitorGaps } from "@/components/audit/CompetitorGaps";
import { Roadmap } from "@/components/audit/Roadmap";

export function AuditResult({ data }: { data: AuditResultType }) {
  return (
    <div className="stack" style={{ gap: "1rem" }}>
      <section className="card" style={{ padding: "1rem" }}>
        <p className="badge">Grade {data.grade}</p>
        <h2 style={{ margin: "0.45rem 0", fontSize: "1.8rem" }}>Score: {data.score}/100</h2>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{data.executiveSummary}</p>
        <p style={{ margin: "0.7rem 0 0", fontWeight: 600 }}>Fastest win: {data.quickWin}</p>
      </section>
      <GeoScore score={data.geoScore} />
      <section className="grid grid-2">
        {data.dimensions.map((dimension) => (
          <DimensionCard key={dimension.name} dimension={dimension} />
        ))}
      </section>
      <Roadmap roadmap={data.roadmap} />
      {data.competitorData ? <CompetitorGaps data={data.competitorData} /> : null}
    </div>
  );
}
