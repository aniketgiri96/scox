import type { CompetitorAnalysis } from "@/lib/audit/types";

export function CompetitorGaps({ data }: { data: CompetitorAnalysis }) {
  return (
    <article className="card" style={{ padding: "1rem" }}>
      <h3 style={{ margin: 0 }}>Competitor Gap Engine</h3>
      <p style={{ margin: "0.35rem 0", color: "var(--muted)", fontSize: 14 }}>{data.summary}</p>
      <div className="grid grid-2" style={{ marginTop: "0.55rem" }}>
        {data.gaps.map((gap) => (
          <div key={gap.competitor} className="card" style={{ padding: "0.8rem" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{gap.competitor}</p>
            <p style={{ margin: "0.45rem 0 0.2rem", fontSize: 13, fontWeight: 600 }}>Opportunities</p>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              {gap.opportunities.map((item) => (
                <li key={item} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p style={{ margin: "0.75rem 0 0.3rem", fontWeight: 700, fontSize: 13 }}>Battle plan</p>
      <ol style={{ margin: 0, paddingLeft: "1.1rem" }}>
        {data.battlePlan.map((step) => (
          <li key={step} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
            {step}
          </li>
        ))}
      </ol>
    </article>
  );
}
