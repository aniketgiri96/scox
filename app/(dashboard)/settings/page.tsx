const plans = [
  { name: "Free", price: "$0", limit: "1 audit" },
  { name: "Starter", price: "$29", limit: "10 audits" },
  { name: "Pro", price: "$79", limit: "50 audits" },
  { name: "Agency", price: "$199", limit: "Unlimited" }
];

export default function SettingsPage() {
  return (
    <section className="stack" style={{ gap: "1rem" }}>
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Account & Billing</h1>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: 14 }}>
          Stripe webhook updates `profiles.plan` and `profiles.audits_limit` automatically.
        </p>
      </header>
      <div className="grid grid-2">
        {plans.map((plan) => (
          <article key={plan.name} className="card" style={{ padding: "1rem" }}>
            <h3 style={{ margin: 0 }}>{plan.name}</h3>
            <p style={{ margin: "0.35rem 0", fontSize: 14 }}>
              {plan.price}/mo · {plan.limit}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
