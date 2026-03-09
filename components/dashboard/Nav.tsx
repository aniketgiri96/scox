import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/audit", label: "New Audit" },
  { href: "/history", label: "History" },
  { href: "/patterns", label: "Patterns" },
  { href: "/settings", label: "Settings" }
];

export function DashboardNav() {
  return (
    <aside
      className="card"
      style={{
        padding: "1rem",
        position: "sticky",
        top: 16,
        alignSelf: "start"
      }}
    >
      <div className="stack" style={{ gap: "0.9rem" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>SEOX</p>
          <p style={{ margin: "0.2rem 0 0", color: "var(--muted)", fontSize: 13 }}>
            SEO + GEO Intelligence
          </p>
        </div>
        <nav className="stack" style={{ gap: "0.45rem" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "0.5rem 0.7rem",
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
