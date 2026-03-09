"use client";

import { useEffect, useMemo, useState } from "react";
import { authedFetch } from "@/lib/api/auth-fetch";

type UsagePayload = {
  plan: string;
  auditsUsed: number;
  auditsLimit: number;
  last30Days: {
    tokensUsed: number;
    costUsd: number;
  };
};

export default function DashboardOverviewPage() {
  const [usage, setUsage] = useState<UsagePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await authedFetch("/api/usage");
        const payload = (await response.json()) as UsagePayload & { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load usage");
        }
        if (active) {
          setUsage(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load usage");
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    if (!usage) {
      return [
        { label: "Audits This Month", value: "...", note: "Loading" },
        { label: "Plan", value: "...", note: "Loading" },
        { label: "AI Cost (30d)", value: "...", note: "Loading" }
      ];
    }

    const limitLabel = usage.auditsLimit >= 999999 ? "Unlimited" : `${usage.auditsLimit}`;

    return [
      {
        label: "Audits This Month",
        value: `${usage.auditsUsed}`,
        note: `Limit: ${limitLabel}`
      },
      {
        label: "Plan",
        value: usage.plan.toUpperCase(),
        note: `${usage.last30Days.tokensUsed.toLocaleString()} tokens in last 30d`
      },
      {
        label: "AI Cost (30d)",
        value: `$${usage.last30Days.costUsd.toFixed(2)}`,
        note: "Tracked via usage_logs"
      }
    ];
  }, [usage]);

  return (
    <>
      <section className="card" style={{ padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Dashboard Overview</h1>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
          Track usage, audit quality, and SEO/GEO momentum.
        </p>
        {error ? (
          <p style={{ margin: "0.55rem 0 0", color: "var(--danger)", fontSize: 14 }}>{error}</p>
        ) : null}
      </section>

      <section className="grid grid-3">
        {stats.map((card) => (
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
          Run one fresh audit with URL crawl, publish a public share page, then send PDF report to a prospect.
        </p>
      </section>
    </>
  );
}
