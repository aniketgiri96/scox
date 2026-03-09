"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField, TextareaField } from "@/components/ui/Field";
import { AuditResult } from "@/components/audit/AuditResult";
import { AuditActions } from "@/components/audit/AuditActions";
import { authedFetch } from "@/lib/api/auth-fetch";
import type { AuditResult as AuditResultType } from "@/lib/audit/types";
import Link from "next/link";

type AuditApiResponse = AuditResultType & {
  auditId: string;
};

export function AuditForm() {
  const [niche, setNiche] = useState("");
  const [industry, setIndustry] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditApiResponse | null>(null);

  const parsedCompetitors = useMemo(
    () =>
      competitors
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean),
    [competitors]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authedFetch("/api/audit", {
        method: "POST",
        body: JSON.stringify({
          niche,
          industry,
          url: url || undefined,
          content: content || undefined,
          competitors: parsedCompetitors.length ? parsedCompetitors : undefined
        })
      });

      const payload = (await response.json()) as AuditApiResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Audit request failed");
      }

      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Audit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stack" style={{ gap: "1rem" }}>
      <form className="card stack" style={{ padding: "1rem" }} onSubmit={handleSubmit}>
        <h1 style={{ margin: 0 }}>Run New Audit</h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Provide either URL or content. Add competitors for gap analysis.
        </p>
        <div className="grid grid-2">
          <InputField label="Niche" placeholder="Dentist marketing" value={niche} onChange={(e) => setNiche(e.target.value)} required />
          <InputField label="Industry" placeholder="Dental" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
        </div>
        <InputField
          label="Website URL (optional)"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <TextareaField
          label="Content snapshot (optional when URL provided)"
          placeholder="Paste homepage or service-page content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TextareaField
          label="Competitors (one per line, optional)"
          placeholder="https://competitor-one.com\nhttps://competitor-two.com"
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
          style={{ minHeight: 90 }}
        />
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>API endpoint: `POST /api/audit`</span>
          <Button disabled={loading}>{loading ? "Running audit..." : "Run audit"}</Button>
        </div>
        {error ? (
          <p style={{ margin: 0, color: "var(--danger)", fontSize: 14 }}>
            {error}
          </p>
        ) : null}
      </form>

      {result ? (
        <>
          <section className="card row" style={{ padding: "0.8rem", justifyContent: "space-between", flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              Audit saved: <strong>{result.auditId}</strong>
            </p>
            <Link href={`/audit/${result.auditId}`} style={{ fontWeight: 600, fontSize: 14 }}>
              Open detail page
            </Link>
          </section>
          <AuditActions auditId={result.auditId} isPublic={false} publicSlug={null} />
          <AuditResult data={result} />
        </>
      ) : null}
    </div>
  );
}
