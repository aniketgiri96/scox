import type { AuditDimension } from "@/lib/audit/types";

export function DimensionCard({ dimension }: { dimension: AuditDimension }) {
  return (
    <article className="card" style={{ padding: "1rem" }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>{dimension.name}</h3>
        <span className="badge">{dimension.score}/100</span>
      </div>
      <p style={{ margin: "0.5rem 0", color: "var(--muted)", fontSize: 14 }}>{dimension.summary}</p>
      <p style={{ margin: "0.55rem 0 0.3rem", fontWeight: 600, fontSize: 13 }}>Issues</p>
      <ul style={{ margin: 0, paddingLeft: "1rem" }}>
        {dimension.issues.slice(0, 3).map((issue) => (
          <li key={issue} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
            {issue}
          </li>
        ))}
      </ul>
      <p style={{ margin: "0.55rem 0 0.3rem", fontWeight: 600, fontSize: 13 }}>Actions</p>
      <ul style={{ margin: 0, paddingLeft: "1rem" }}>
        {dimension.actions.slice(0, 3).map((action) => (
          <li key={action} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
            {action}
          </li>
        ))}
      </ul>
    </article>
  );
}
