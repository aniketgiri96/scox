import { appConfig, requireEnv } from "@/lib/config";
import { parseJsonResponse } from "@/lib/anthropic/parsers";
import {
  AUDIT_SYSTEM_PROMPT,
  COMPETITOR_SYSTEM_PROMPT,
  RESEARCH_SYSTEM_PROMPT
} from "@/lib/anthropic/prompts";
import type { AuditResult, CompetitorAnalysis, ResearchResult } from "@/lib/audit/types";

type MessagePayload = {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
};

type AnthropicTextBlock = {
  type: "text";
  text: string;
};

type AnthropicResponse = {
  content?: AnthropicTextBlock[];
};

async function callAnthropicJson<T>({
  system,
  user,
  temperature = 0,
  maxTokens = 2500
}: MessagePayload): Promise<T> {
  const apiKey = requireEnv("ANTHROPIC_API_KEY");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: appConfig.anthropicModel,
      system,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: "user", content: user }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic request failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as AnthropicResponse;
  const text = payload.content?.find((block) => block.type === "text")?.text;
  if (!text) {
    throw new Error("Anthropic response did not include text content");
  }

  return parseJsonResponse<T>(text);
}

export async function runResearch(input: {
  niche: string;
  industry: string;
  content: string;
}): Promise<ResearchResult> {
  const user = JSON.stringify(
    {
      niche: input.niche,
      industry: input.industry,
      contentSample: input.content.slice(0, 2200),
      instruction:
        "Research current SEO and GEO patterns for this niche. Prioritize recent directional changes and practical signals."
    },
    null,
    2
  );

  return callAnthropicJson<ResearchResult>({
    system: RESEARCH_SYSTEM_PROMPT,
    user,
    temperature: 0,
    maxTokens: 1200
  });
}

export async function runAudit(input: {
  niche: string;
  industry: string;
  content: string;
  research: ResearchResult;
  pattern: unknown;
}): Promise<AuditResult> {
  const user = JSON.stringify(
    {
      niche: input.niche,
      industry: input.industry,
      contentSample: input.content.slice(0, 4500),
      research: input.research,
      industryPattern: input.pattern
    },
    null,
    2
  );

  return callAnthropicJson<AuditResult>({
    system: AUDIT_SYSTEM_PROMPT,
    user,
    temperature: 0,
    maxTokens: 3500
  });
}

export async function runCompetitorAnalysis(input: {
  niche: string;
  industry: string;
  content: string;
  competitors: string[];
  research: ResearchResult;
}): Promise<CompetitorAnalysis> {
  const user = JSON.stringify(
    {
      niche: input.niche,
      industry: input.industry,
      competitors: input.competitors,
      contentSample: input.content.slice(0, 3000),
      research: input.research
    },
    null,
    2
  );

  return callAnthropicJson<CompetitorAnalysis>({
    system: COMPETITOR_SYSTEM_PROMPT,
    user,
    temperature: 0,
    maxTokens: 1600
  });
}
