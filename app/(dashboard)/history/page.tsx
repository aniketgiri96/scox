import Link from "next/link";

const placeholders = [
  { id: "sample-audit-1", niche: "Dental", score: 74, grade: "C", date: "2026-03-09" },
  { id: "sample-audit-2", niche: "Legal", score: 81, grade: "B", date: "2026-03-08" }
];

export default function HistoryPage() {
  return (
    <section className="card" style={{ padding: "1rem" }}>
      <h1 style={{ margin: 0 }}>Audit History</h1>
      <p style={{ margin: "0.35rem 0 0.8rem", color: "var(--muted)", fontSize: 14 }}>
        Replace sample rows with live Supabase query filtered by authenticated user.
      </p>
      <div className="stack" style={{ gap: "0.6rem" }}>
        {placeholders.map((item) => (
          <article
            key={item.id}
            className="row"
            style={{ justifyContent: "space-between", border: "1px solid var(--border)", borderRadius: 10, padding: "0.7rem" }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>{item.niche}</p>
              <p style={{ margin: "0.2rem 0 0", color: "var(--muted)", fontSize: 13 }}>{item.date}</p>
            </div>
            <div className="row">
              <span className="badge">
                {item.grade} · {item.score}
              </span>
              <Link href={`/audit/${item.id}`} style={{ fontSize: 14, fontWeight: 600 }}>
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
