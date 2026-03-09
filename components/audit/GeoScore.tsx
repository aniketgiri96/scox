import type { GeoScore as GeoScoreType } from "@/lib/audit/types";

export function GeoScore({ score }: { score: GeoScoreType }) {
  return (
    <article className="card" style={{ padding: "1rem" }}>
      <h3 style={{ margin: 0 }}>GEO Score</h3>
      <p style={{ margin: "0.35rem 0", color: "var(--muted)", fontSize: 14 }}>
        Citation readiness in generative engines
      </p>
      <div className="grid grid-2" style={{ marginTop: "0.5rem" }}>
        <div className="card" style={{ padding: "0.7rem" }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Overall</p>
          <p style={{ margin: "0.25rem 0 0", fontSize: 24, fontWeight: 700 }}>{score.overall}</p>
        </div>
        <div className="card" style={{ padding: "0.7rem" }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>ChatGPT</p>
          <p style={{ margin: "0.25rem 0 0", fontSize: 24, fontWeight: 700 }}>{score.chatgpt}</p>
        </div>
        <div className="card" style={{ padding: "0.7rem" }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Perplexity</p>
          <p style={{ margin: "0.25rem 0 0", fontSize: 24, fontWeight: 700 }}>{score.perplexity}</p>
        </div>
        <div className="card" style={{ padding: "0.7rem" }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>AI Overviews</p>
          <p style={{ margin: "0.25rem 0 0", fontSize: 24, fontWeight: 700 }}>{score.aiOverviews}</p>
        </div>
      </div>
      <ul style={{ margin: "0.75rem 0 0", paddingLeft: "1rem" }}>
        {score.reasons.map((reason) => (
          <li key={reason} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
            {reason}
          </li>
        ))}
      </ul>
    </article>
  );
}
