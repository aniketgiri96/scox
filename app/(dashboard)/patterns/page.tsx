const samplePatterns = [
  {
    archetype: "dentist",
    avgScore: 69,
    totalAudits: 12,
    topIssue: "Thin service pages"
  },
  {
    archetype: "lawyer",
    avgScore: 73,
    totalAudits: 9,
    topIssue: "Weak local schema coverage"
  }
];

export default function PatternsPage() {
  return (
    <section className="stack" style={{ gap: "1rem" }}>
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Industry Pattern Library</h1>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: 14 }}>
          Shared intelligence from cross-user audits. This is the long-term moat.
        </p>
      </header>
      <div className="grid grid-2">
        {samplePatterns.map((pattern) => (
          <article key={pattern.archetype} className="card" style={{ padding: "1rem" }}>
            <p className="badge">{pattern.archetype}</p>
            <h3 style={{ margin: "0.55rem 0 0.25rem" }}>Avg score: {pattern.avgScore}</h3>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
              {pattern.totalAudits} audits · Top issue: {pattern.topIssue}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
