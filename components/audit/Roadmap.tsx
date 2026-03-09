import type { AuditRoadmap } from "@/lib/audit/types";

export function Roadmap({ roadmap }: { roadmap: AuditRoadmap }) {
  const windows = [
    { label: "Week 1", data: roadmap.week1 },
    { label: "Month 1", data: roadmap.month1 },
    { label: "Quarter 1", data: roadmap.quarter1 }
  ];

  return (
    <section className="card" style={{ padding: "1rem" }}>
      <h3 style={{ margin: 0 }}>Role-aware roadmap</h3>
      <div className="grid grid-3" style={{ marginTop: "0.75rem" }}>
        {windows.map((window) => (
          <article key={window.label} className="card" style={{ padding: "0.8rem" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{window.label}</p>
            <p style={{ margin: "0.3rem 0", fontSize: 13, color: "var(--muted)" }}>{window.data.focus}</p>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              {window.data.actions.map((action) => (
                <li key={action} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
                  {action}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
