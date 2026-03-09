"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField, TextareaField } from "@/components/ui/Field";
import { authedFetch } from "@/lib/api/auth-fetch";

type FrameworkResponse = {
  frameworkId: string;
  createdAt: string;
  framework: {
    positioning: string;
    audienceModel: string[];
    pillarPlan: string[];
    contentCadence: string;
    authorityPlan: string[];
    geoPlan: string[];
    kpis: string[];
  };
};

export default function FrameworkPage() {
  const [niche, setNiche] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FrameworkResponse | null>(null);

  async function runFramework(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authedFetch("/api/framework", {
        method: "POST",
        body: JSON.stringify({
          niche,
          industry,
          objective,
          constraints: constraints
            .split("\n")
            .map((value) => value.trim())
            .filter(Boolean)
        })
      });

      const payload = (await response.json()) as FrameworkResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Framework generation failed");
      }

      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Framework generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stack" style={{ gap: "1rem" }}>
      <form className="card stack" style={{ padding: "1rem" }} onSubmit={runFramework}>
        <h1 style={{ margin: 0 }}>Strategy Framework</h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Generate and store a niche-specific SEO/GEO growth framework.
        </p>
        <div className="grid grid-2">
          <InputField label="Niche" value={niche} onChange={(e) => setNiche(e.target.value)} required />
          <InputField label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
        </div>
        <TextareaField
          label="Objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Increase qualified local leads in 90 days"
          required
          style={{ minHeight: 90 }}
        />
        <TextareaField
          label="Constraints (optional, one per line)"
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="Budget under $2,000/month"
          style={{ minHeight: 90 }}
        />
        <Button disabled={loading}>{loading ? "Generating..." : "Generate framework"}</Button>
        {error ? <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p> : null}
      </form>

      {result ? (
        <section className="card stack" style={{ padding: "1rem" }}>
          <p className="badge">Framework #{result.frameworkId.slice(0, 8)}</p>
          <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{result.framework.positioning}</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>Cadence: {result.framework.contentCadence}</p>
          <div className="grid grid-2">
            <article>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>Pillar Plan</p>
              <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1rem" }}>
                {result.framework.pillarPlan.map((item) => (
                  <li key={item} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>GEO Plan</p>
              <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1rem" }}>
                {result.framework.geoPlan.map((item) => (
                  <li key={item} style={{ fontSize: 13, marginBottom: "0.2rem" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  );
}
