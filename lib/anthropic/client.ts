import { appConfig, requireEnv } from "@/lib/config";
import { parseJsonResponse } from "@/lib/anthropic/parsers";
import {
  AUDIT_SYSTEM_PROMPT,
  COMPETITOR_SYSTEM_PROMPT,
  FRAMEWORK_SYSTEM_PROMPT,
  RESEARCH_SYSTEM_PROMPT
} from "@/lib/anthropic/prompts";
import type {
  AuditResult,
  CompetitorAnalysis,
  FrameworkStrategy,
  ResearchResult
} from "@/lib/audit/types";

type MessagePayload = {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  useWebSearch?: boolean;
};

type AnthropicContentBlock = {
  type: string;
  text?: string;
};

type AnthropicResponse = {
  content?: AnthropicContentBlock[];
  stop_reason?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestAnthropic(payload: Record<string, unknown>): Promise<AnthropicResponse> {
  const apiKey = requireEnv("ANTHROPIC_API_KEY");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic request failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as AnthropicResponse;
}

function extractText(payload: AnthropicResponse): string {
  const text = payload.content
    ?.filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Anthropic response did not include text content");
  }

  return text;
}

async function callAnthropicJson<T>({
  system,
  user,
  temperature = 0,
  maxTokens = 2500,
  useWebSearch = false
}: MessagePayload): Promise<T> {
  let correctionHint = "";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const baseMessage = `${user}${correctionHint}`;
    const messages: Array<Record<string, unknown>> = [{ role: "user", content: baseMessage }];

    for (let turn = 0; turn < 4; turn += 1) {
      const payload: Record<string, unknown> = {
        model: appConfig.anthropicModel,
        system,
        max_tokens: maxTokens,
        temperature,
        messages
      };

      if (useWebSearch) {
        payload.tools = [{ type: "web_search_20250305", name: "web_search" }];
      }

      const response = await requestAnthropic(payload);

      try {
        const text = extractText(response);
        return parseJsonResponse<T>(text);
      } catch (parseError) {
        if (response.stop_reason === "tool_use") {
          messages.push({ role: "assistant", content: response.content ?? [] });
          messages.push({
            role: "user",
            content: "Continue and return final strict JSON now. Do not include markdown."
          });
          continue;
        }

        if (attempt < 2) {
          correctionHint =
            "\n\nYour previous output was not strict JSON. Return ONLY valid JSON that exactly matches the schema.";
          await sleep(300 * (attempt + 1));
          break;
        }

        throw parseError;
      }
    }
  }

  throw new Error("Failed to produce valid JSON from Anthropic after retries");
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
    maxTokens: 1200,
    useWebSearch: true
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
    maxTokens: 1600,
    useWebSearch: true
  });
}

export async function runFrameworkStrategy(input: {
  niche: string;
  industry: string;
  objective: string;
  constraints?: string[];
}): Promise<FrameworkStrategy> {
  const user = JSON.stringify(
    {
      niche: input.niche,
      industry: input.industry,
      objective: input.objective,
      constraints: input.constraints ?? []
    },
    null,
    2
  );

  return callAnthropicJson<FrameworkStrategy>({
    system: FRAMEWORK_SYSTEM_PROMPT,
    user,
    temperature: 0.3,
    maxTokens: 1800
  });
}
