import Link from "next/link";
import { Button } from "@/components/ui/Button";

const metrics = [
  { label: "Audit runtime", value: "~30 sec" },
  { label: "Scoring dimensions", value: "9" },
  { label: "AI visibility layer", value: "Built-in" },
  { label: "Roadmap windows", value: "Week · Month · Quarter" }
];

const howItWorks = [
  {
    step: "01",
    title: "Ingest site data in seconds",
    text: "Paste your URL once. SEOX crawls metadata, headings, schema, links, and content structure automatically."
  },
  {
    step: "02",
    title: "Research what search rewards now",
    text: "Live research updates your audit context so recommendations reflect current SERP and answer-engine behavior."
  },
  {
    step: "03",
    title: "Score technical + content + GEO readiness",
    text: "The engine grades 9 dimensions, including GEO score for ChatGPT, Perplexity, and AI Overviews citation readiness."
  },
  {
    step: "04",
    title: "Ship actions, not generic advice",
    text: "You get prioritized wins, competitor gaps, and a role-aware roadmap that turns into weekly execution."
  }
];

const gameChanging = [
  {
    title: "Built for SEO and GEO together",
    text: "Most tools still optimize only blue links. SEOX prepares your content for both rankings and AI-generated answer citations."
  },
  {
    title: "Compounding industry intelligence",
    text: "Pattern library learning means each audit improves recommendations for the next business in that niche."
  },
  {
    title: "From diagnosis to monetizable deliverables",
    text: "Shareable public pages and downloadable reports help consultants and agencies convert audits into revenue faster."
  }
];

const compareRows = [
  {
    topic: "Audit model",
    legacy: "Static checklist",
    seox: "Live-research + 9-dimension scoring"
  },
  {
    topic: "AI search readiness",
    legacy: "Usually missing",
    seox: "Dedicated GEO score + action plan"
  },
  {
    topic: "Competitor insights",
    legacy: "Surface metrics only",
    seox: "Gap engine + battle plan"
  },
  {
    topic: "Execution output",
    legacy: "Long issue list",
    seox: "Prioritized roadmap by timeline"
  },
  {
    topic: "Agency usability",
    legacy: "Limited client delivery",
    seox: "Public links + white-label reports"
  }
];

const seoImpact = [
  {
    title: "Stronger technical foundation",
    text: "Fix indexability, metadata quality, schema coverage, and crawl signals before they suppress rankings."
  },
  {
    title: "Content that matches intent",
    text: "Align pages with user intent clusters so your content moves from impressions to qualified clicks."
  },
  {
    title: "Faster local and niche wins",
    text: "Competitor gap analysis reveals the quickest high-leverage opportunities for your market."
  },
  {
    title: "Better visibility in AI answers",
    text: "GEO recommendations increase the chance your brand is cited when users ask answer engines for solutions."
  }
];

export default function MarketingPage() {
  return (
    <div className="mk-page">
      <header className="mk-header">
        <div className="mk-header-inner">
          <Link href="/" className="mk-brand">
            SEOX<span>3</span>
          </Link>
          <nav className="mk-nav">
            <a href="#how">How it works</a>
            <a href="#game-changing">Why game-changing</a>
            <a href="#compare">Why best</a>
            <a href="#seo-impact">SEO impact</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="mk-actions">
            <Link href="/login">
              <Button variant="ghost" style={{ color: "#d5ebff", borderColor: "rgba(139, 206, 255, 0.42)" }}>
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button style={{ background: "#17c0cf", borderColor: "#17c0cf", color: "#08101c" }}>Start free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mk-main">
        <section className="mk-hero">
          <p className="mk-eyebrow">THE SEO + GEO DECISION ENGINE</p>
          <h1>Turn every website into a growth roadmap for Google and AI search</h1>
          <p>
            SEOX is a multi-layer SEO platform that audits what matters now, not what worked years ago. It combines technical
            precision, content strategy, and generative-engine visibility into one execution-ready system.
          </p>
          <div className="mk-hero-actions">
            <Link href="/signup">
              <Button>Run your first audit</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">Open dashboard</Button>
            </Link>
          </div>
          <div className="mk-metrics">
            {metrics.map((metric) => (
              <article key={metric.label} className="mk-metric-card">
                <p>{metric.label}</p>
                <h3>{metric.value}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mk-section" id="how">
          <div className="mk-section-head">
            <p>How it works</p>
            <h2>From raw URL to prioritized execution in one workflow</h2>
          </div>
          <div className="mk-how-grid">
            {howItWorks.map((item) => (
              <article key={item.step} className="mk-step-card">
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mk-section" id="game-changing">
          <div className="mk-section-head">
            <p>Why this is game-changing</p>
            <h2>The platform is designed for the next decade of search</h2>
          </div>
          <div className="mk-features">
            {gameChanging.map((feature) => (
              <article key={feature.title} className="mk-feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mk-section" id="compare">
          <div className="mk-section-head">
            <p>Why SEOX is best from others</p>
            <h2>Built for outcomes, not dashboard vanity metrics</h2>
          </div>
          <div className="mk-compare-wrap">
            <div className="mk-compare-head">
              <span>Capability</span>
              <span>Typical tools</span>
              <span>SEOX</span>
            </div>
            {compareRows.map((row) => (
              <div className="mk-compare-row" key={row.topic}>
                <p>{row.topic}</p>
                <p>{row.legacy}</p>
                <p>{row.seox}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mk-section" id="seo-impact">
          <div className="mk-section-head">
            <p>How this helps your SEO</p>
            <h2>Higher visibility, better traffic quality, clearer execution</h2>
          </div>
          <div className="mk-impact-grid">
            {seoImpact.map((item) => (
              <article key={item.title} className="mk-impact-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mk-pricing" id="pricing">
          <div className="mk-price-intro">
            <h2>Plans built for founders, freelancers, and agencies</h2>
            <p>Start free, validate value fast, and scale into recurring client delivery.</p>
          </div>
          <div className="mk-price-grid">
            <article>
              <span>Free</span>
              <h3>$0</h3>
              <p>1 audit · onboarding preview</p>
            </article>
            <article>
              <span>Starter</span>
              <h3>$29</h3>
              <p>10 audits · full 9D + GEO score</p>
            </article>
            <article>
              <span>Pro</span>
              <h3>$79</h3>
              <p>50 audits · reports + crawler</p>
            </article>
            <article>
              <span>Agency</span>
              <h3>$199</h3>
              <p>Unlimited · white-label + team</p>
            </article>
          </div>
        </section>

        <section className="mk-cta">
          <h2>See where your site is leaking rankings and AI visibility</h2>
          <p>Run an audit now and get a roadmap you can execute this week.</p>
          <div className="mk-hero-actions">
            <Link href="/signup">
              <Button>Start free audit</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" style={{ color: "#d5ebff", borderColor: "rgba(139, 206, 255, 0.42)" }}>
                Sign in
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="mk-footer">
        <div className="mk-footer-inner">
          <p>SEOX3 · The operating layer for modern SEO and GEO teams.</p>
          <div>
            <Link href="/login">Login</Link>
            <Link href="/signup">Create account</Link>
            <Link href="/framework">Framework</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
