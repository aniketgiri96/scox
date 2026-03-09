"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { authedFetch } from "@/lib/api/auth-fetch";

type Props = {
  auditId: string;
  isPublic: boolean;
  publicSlug: string | null;
};

type PublishPayload = {
  slug: string;
  publicUrl: string;
  badgeEmbed: string;
};

export function AuditActions({ auditId, isPublic: initialPublic, publicSlug: initialSlug }: Props) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [badgeEmbed, setBadgeEmbed] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialSlug) {
      return;
    }

    setPublicUrl(`${window.location.origin}/public/${initialSlug}`);
  }, [initialSlug]);

  async function publish() {
    setLoading("publish");
    setError(null);

    try {
      const response = await authedFetch("/api/audit/share", {
        method: "POST",
        body: JSON.stringify({ auditId })
      });
      const payload = (await response.json()) as PublishPayload & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to publish audit");
      }

      setIsPublic(true);
      setPublicUrl(payload.publicUrl);
      setBadgeEmbed(payload.badgeEmbed);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to publish");
    } finally {
      setLoading(null);
    }
  }

  async function unpublish() {
    setLoading("unpublish");
    setError(null);

    try {
      const response = await authedFetch("/api/audit/share", {
        method: "DELETE",
        body: JSON.stringify({ auditId })
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to unpublish audit");
      }

      setIsPublic(false);
      setPublicUrl(null);
      setBadgeEmbed(null);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to unpublish");
    } finally {
      setLoading(null);
    }
  }

  async function generateReport() {
    setLoading("report");
    setError(null);

    try {
      const response = await authedFetch("/api/report", {
        method: "POST",
        body: JSON.stringify({
          auditId,
          whiteLabel: false
        })
      });
      const payload = (await response.json()) as { reportUrl?: string; error?: string };
      if (!response.ok || !payload.reportUrl) {
        throw new Error(payload.error ?? "Failed to generate report");
      }

      setReportUrl(payload.reportUrl);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Report generation failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="card stack" style={{ padding: "1rem" }}>
      <h2 style={{ margin: 0, fontSize: "1rem" }}>Audit Actions</h2>
      <div className="row" style={{ flexWrap: "wrap" }}>
        {!isPublic ? (
          <Button onClick={publish} disabled={loading !== null}>
            {loading === "publish" ? "Publishing..." : "Publish public link"}
          </Button>
        ) : (
          <Button variant="ghost" onClick={unpublish} disabled={loading !== null}>
            {loading === "unpublish" ? "Removing..." : "Unpublish link"}
          </Button>
        )}
        <Button variant="secondary" onClick={generateReport} disabled={loading !== null}>
          {loading === "report" ? "Generating PDF..." : "Generate PDF report"}
        </Button>
      </div>

      {publicUrl ? (
        <div className="stack" style={{ gap: "0.35rem" }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Public URL</p>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13 }}>
            {publicUrl}
          </a>
          {badgeEmbed ? (
            <>
              <p style={{ margin: "0.35rem 0 0", fontSize: 13, fontWeight: 700 }}>Badge embed snippet</p>
              <pre
                style={{
                  margin: 0,
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.5rem",
                  background: "#f9fbfc",
                  fontSize: 12,
                  whiteSpace: "pre-wrap"
                }}
              >
                {badgeEmbed}
              </pre>
            </>
          ) : null}
        </div>
      ) : null}

      {reportUrl ? (
        <a href={reportUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600 }}>
          Open generated PDF report
        </a>
      ) : null}

      {error ? <p style={{ margin: 0, fontSize: 13, color: "var(--danger)" }}>{error}</p> : null}
    </section>
  );
}
