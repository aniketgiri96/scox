"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authedFetch } from "@/lib/api/auth-fetch";

const plans = [
  { name: "starter", label: "Starter", price: "$29", limit: "10 audits" },
  { name: "pro", label: "Pro", price: "$79", limit: "50 audits" },
  { name: "agency", label: "Agency", price: "$199", limit: "Unlimited" }
] as const;

export default function SettingsPage() {
  const params = useSearchParams();
  const checkoutState = params.get("checkout");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const checkoutNotice = useMemo(() => {
    if (checkoutState === "success") return "Checkout completed. Subscription will sync via webhook shortly.";
    if (checkoutState === "cancelled") return "Checkout was cancelled.";
    return null;
  }, [checkoutState]);

  async function startCheckout(plan: (typeof plans)[number]["name"]) {
    setLoadingPlan(plan);
    setMessage(null);

    try {
      const response = await authedFetch("/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan })
      });
      const payload = (await response.json()) as { checkoutUrl?: string; error?: string };

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Failed to create checkout session");
      }

      window.location.href = payload.checkoutUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    setMessage(null);

    try {
      const response = await authedFetch("/api/billing/portal", { method: "POST" });
      const payload = (await response.json()) as { portalUrl?: string; error?: string };

      if (!response.ok || !payload.portalUrl) {
        throw new Error(payload.error ?? "Failed to open billing portal");
      }

      window.location.href = payload.portalUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <section className="stack" style={{ gap: "1rem" }}>
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Account & Billing</h1>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: 14 }}>
          Checkout and billing portal are now wired to Stripe session endpoints.
        </p>
        {checkoutNotice ? <p style={{ margin: "0.55rem 0 0", color: "var(--success)", fontSize: 14 }}>{checkoutNotice}</p> : null}
        {message ? <p style={{ margin: "0.55rem 0 0", color: "var(--danger)", fontSize: 14 }}>{message}</p> : null}
      </header>

      <div className="grid grid-2">
        {plans.map((plan) => (
          <article key={plan.name} className="card" style={{ padding: "1rem" }}>
            <h3 style={{ margin: 0 }}>{plan.label}</h3>
            <p style={{ margin: "0.35rem 0", fontSize: 14 }}>
              {plan.price}/mo · {plan.limit}
            </p>
            <Button onClick={() => startCheckout(plan.name)} disabled={loadingPlan === plan.name}>
              {loadingPlan === plan.name ? "Opening checkout..." : `Choose ${plan.label}`}
            </Button>
          </article>
        ))}
      </div>

      <section className="card" style={{ padding: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1rem" }}>Manage existing subscription</h2>
        <p style={{ margin: "0.35rem 0 0.75rem", color: "var(--muted)", fontSize: 14 }}>
          Open Stripe billing portal for payment methods, invoices, and cancellations.
        </p>
        <Button variant="secondary" onClick={openPortal} disabled={portalLoading}>
          {portalLoading ? "Opening portal..." : "Open billing portal"}
        </Button>
      </section>
    </section>
  );
}
