"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { authedFetch } from "@/lib/api/auth-fetch";

type AuditHistoryRow = {
  id: string;
  niche: string;
  industry: string;
  score: number;
  grade: string;
  created_at: string;
  is_public: boolean;
  public_slug: string | null;
};

type HistoryPayload = {
  audits: AuditHistoryRow[];
};

export default function HistoryPage() {
  const [audits, setAudits] = useState<AuditHistoryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await authedFetch("/api/history");
        const payload = (await response.json()) as HistoryPayload & { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load history");
        }

        if (active) {
          setAudits(payload.audits ?? []);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load history");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="card" style={{ padding: "1rem" }}>
      <h1 style={{ margin: 0 }}>Audit History</h1>
      <p style={{ margin: "0.35rem 0 0.8rem", color: "var(--muted)", fontSize: 14 }}>
        Your last 50 audits, scoped to your account.
      </p>

      {loading ? <p style={{ margin: 0, color: "var(--muted)" }}>Loading history...</p> : null}
      {error ? <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p> : null}

      {!loading && !error ? (
        <div className="stack" style={{ gap: "0.6rem" }}>
          {audits.length === 0 ? <p style={{ margin: 0, color: "var(--muted)" }}>No audits yet.</p> : null}
          {audits.map((item) => (
            <article
              key={item.id}
              className="row"
              style={{
                justifyContent: "space-between",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "0.7rem",
                flexWrap: "wrap"
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {item.niche} · {item.industry}
                </p>
                <p style={{ margin: "0.2rem 0 0", color: "var(--muted)", fontSize: 13 }}>
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <div className="row" style={{ flexWrap: "wrap" }}>
                <span className="badge">
                  {item.grade} · {item.score}
                </span>
                {item.is_public && item.public_slug ? (
                  <Link href={`/public/${item.public_slug}` as Route} style={{ fontSize: 13, fontWeight: 600 }}>
                    Public link
                  </Link>
                ) : null}
                <Link href={`/audit/${item.id}`} style={{ fontSize: 14, fontWeight: 600 }}>
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
