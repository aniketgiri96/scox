"use client";

import { useEffect, useState } from "react";
import { authedFetch } from "@/lib/api/auth-fetch";

type PatternRow = {
  archetype: string;
  total_audits: number;
  avg_score: number;
  common_issues: Record<string, number>;
  top_insights: string[];
  updated_at: string;
};

type PatternsPayload = {
  patterns: PatternRow[];
  userIndustryFrequency: Record<string, number>;
};

function topIssue(commonIssues: Record<string, number>) {
  const entries = Object.entries(commonIssues ?? {});
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "No issue trends yet";
}

export default function PatternsPage() {
  const [payload, setPayload] = useState<PatternsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await authedFetch("/api/patterns");
        const data = (await response.json()) as PatternsPayload & { error?: string };
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load patterns");
        }

        if (active) {
          setPayload(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load patterns");
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="stack" style={{ gap: "1rem" }}>
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ margin: 0 }}>Industry Pattern Library</h1>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: 14 }}>
          Shared intelligence from cross-user audits. This is the long-term moat.
        </p>
        {error ? <p style={{ margin: "0.45rem 0 0", color: "var(--danger)" }}>{error}</p> : null}
      </header>

      <section className="card" style={{ padding: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1rem" }}>Your Industry Frequency</h2>
        <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: 13 }}>
          Recent audits by industry in your account.
        </p>
        <div className="row" style={{ marginTop: "0.65rem", flexWrap: "wrap" }}>
          {Object.entries(payload?.userIndustryFrequency ?? {}).length === 0 ? (
            <span style={{ color: "var(--muted)", fontSize: 13 }}>No audit history yet.</span>
          ) : (
            Object.entries(payload?.userIndustryFrequency ?? {})
              .sort((a, b) => b[1] - a[1])
              .map(([industry, count]) => (
                <span key={industry} className="badge">
                  {industry}: {count}
                </span>
              ))
          )}
        </div>
      </section>

      <div className="grid grid-2">
        {(payload?.patterns ?? []).map((pattern) => (
          <article key={pattern.archetype} className="card" style={{ padding: "1rem" }}>
            <p className="badge">{pattern.archetype}</p>
            <h3 style={{ margin: "0.55rem 0 0.25rem" }}>Avg score: {pattern.avg_score}</h3>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
              {pattern.total_audits} audits · Top issue: {topIssue(pattern.common_issues)}
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: 12, color: "var(--muted)" }}>
              Updated: {new Date(pattern.updated_at).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
