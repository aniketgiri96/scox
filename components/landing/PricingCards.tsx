const tiers = [
  {
    name: "Free",
    price: "$0/mo",
    audits: "1 audit",
    features: ["Basic SEO audit", "Fast onboarding", "Lead capture"]
  },
  {
    name: "Starter",
    price: "$29/mo",
    audits: "10 audits",
    features: ["9-dimension audit", "GEO score", "Competitor gaps"]
  },
  {
    name: "Pro",
    price: "$79/mo",
    audits: "50 audits",
    features: ["Everything in Starter", "PDF reports", "URL crawler"]
  },
  {
    name: "Agency",
    price: "$199/mo",
    audits: "Unlimited",
    features: ["White-label", "Team workflows", "API access"]
  }
];

export function PricingCards() {
  return (
    <section className="stack" style={{ gap: "1rem" }}>
      <div>
        <h2 className="section-title">Pricing Architecture</h2>
        <p className="section-subtitle">Built to convert freelancers and monetize agencies.</p>
      </div>
      <div className="grid grid-2">
        {tiers.map((tier) => (
          <article key={tier.name} className="card" style={{ padding: "1rem" }}>
            <p className="badge">{tier.name}</p>
            <h3 style={{ margin: "0.6rem 0 0.25rem" }}>{tier.price}</h3>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{tier.audits}</p>
            <ul style={{ margin: "0.8rem 0 0", paddingLeft: "1.1rem" }}>
              {tier.features.map((feature) => (
                <li key={feature} style={{ marginBottom: "0.3rem", fontSize: 14 }}>
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
