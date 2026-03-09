const statCards = [
  { label: "Audits This Month", value: "0", note: "Starter: 10/month" },
  { label: "Average Score", value: "--", note: "Run your first audit" },
  { label: "Pattern Coverage", value: "0 industries", note: "Starts after first save" }
];

export default function DashboardOverviewPage() {
  return (
    <>
      <section className="card" style={{ padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Dashboard Overview</h1>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
          Track usage, audit quality, and your SEO/GEO momentum.
        </p>
      </section>
      <section className="grid grid-3">
        {statCards.map((card) => (
          <article key={card.label} className="card" style={{ padding: "1rem" }}>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>{card.label}</p>
            <h2 style={{ margin: "0.45rem 0", fontSize: "1.8rem" }}>{card.value}</h2>
            <p style={{ margin: 0, fontSize: 13 }}>{card.note}</p>
          </article>
        ))}
      </section>
      <section className="card" style={{ padding: "1rem" }}>
        <h2 className="section-title">Recommended next action</h2>
        <p className="section-subtitle">
          Start with one audit using your main revenue page URL. Then compare against 3 local competitors.
        </p>
      </section>
    </>
  );
}
