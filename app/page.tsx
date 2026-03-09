import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PricingCards } from "@/components/landing/PricingCards";

export default function LandingPage() {
  return (
    <main className="stack" style={{ gap: "1.5rem" }}>
      <section className="card" style={{ padding: "1.2rem" }}>
        <p className="badge">SEOX³ Build</p>
        <h1 style={{ margin: "0.75rem 0 0.4rem", fontSize: "2rem" }}>
          The SEO platform that audits for Google and AI engines
        </h1>
        <p style={{ margin: 0, maxWidth: 760, color: "var(--muted)" }}>
          Run 9-dimension SEO + GEO audits, benchmark against competitors, and generate role-aware roadmaps.
          Powered by live research and a compounding industry pattern library.
        </p>
        <div className="row" style={{ marginTop: "1rem", flexWrap: "wrap" }}>
          <Link href="/signup">
            <Button>Create account</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Sign in</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Open dashboard</Button>
          </Link>
        </div>
      </section>
      <section className="grid grid-3">
        <article className="card" style={{ padding: "1rem" }}>
          <h3 style={{ margin: 0 }}>Live Intelligence</h3>
          <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: 14 }}>
            Every audit can include fresh industry context to avoid stale rules.
          </p>
        </article>
        <article className="card" style={{ padding: "1rem" }}>
          <h3 style={{ margin: 0 }}>GEO Score</h3>
          <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: 14 }}>
            Track citation readiness for ChatGPT, Perplexity, and AI Overviews.
          </p>
        </article>
        <article className="card" style={{ padding: "1rem" }}>
          <h3 style={{ margin: 0 }}>Compounding Patterns</h3>
          <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: 14 }}>
            Shared insights become a data flywheel across every niche.
          </p>
        </article>
      </section>
      <PricingCards />
    </main>
  );
}
