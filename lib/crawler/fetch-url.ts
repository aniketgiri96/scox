import * as cheerio from "cheerio";
import type { CrawlResult } from "@/lib/audit/types";

function parseSchemaTypes($: cheerio.CheerioAPI): string[] {
  return $('script[type="application/ld+json"]')
    .map((_, element) => {
      const raw = $(element).html();
      if (!raw) {
        return null;
      }
      try {
        const parsed = JSON.parse(raw);
        const schemaType = parsed?.["@type"];
        if (Array.isArray(schemaType)) {
          return schemaType.join(", ");
        }
        return schemaType ?? null;
      } catch {
        return null;
      }
    })
    .get()
    .filter(Boolean);
}

export async function fetchUrlSnapshot(url: string): Promise<CrawlResult> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOXBot/1.0)" },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`Failed to crawl URL (${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: $("title").text().trim(),
    metaDescription: $("meta[name='description']").attr("content") ?? "",
    h1: $("h1")
      .map((_, el) => $(el).text().trim())
      .get(),
    h2: $("h2")
      .map((_, el) => $(el).text().trim())
      .get()
      .slice(0, 10),
    bodyText: bodyText.slice(0, 3000),
    wordCount: bodyText.length ? bodyText.split(/\s+/).length : 0,
    hasSchema: $('script[type="application/ld+json"]').length > 0,
    schemaTypes: parseSchemaTypes($),
    internalLinks: $('a[href^="/"]').length,
    externalLinks: $('a[href^="http"]').length,
    images: $("img").length,
    imagesWithAlt: $("img[alt]").length,
    hasCanonical: $("link[rel='canonical']").length > 0,
    metaRobots: $("meta[name='robots']").attr("content") ?? ""
  };
}

export function formatCrawlData(snapshot: CrawlResult): string {
  return [
    `Title: ${snapshot.title}`,
    `Meta Description: ${snapshot.metaDescription}`,
    `H1: ${snapshot.h1.join(" | ")}`,
    `H2: ${snapshot.h2.join(" | ")}`,
    `Word Count: ${snapshot.wordCount}`,
    `Has Schema: ${snapshot.hasSchema}`,
    `Schema Types: ${snapshot.schemaTypes.join(", ")}`,
    `Internal Links: ${snapshot.internalLinks}`,
    `External Links: ${snapshot.externalLinks}`,
    `Images: ${snapshot.images}`,
    `Images with Alt: ${snapshot.imagesWithAlt}`,
    `Has Canonical: ${snapshot.hasCanonical}`,
    `Meta Robots: ${snapshot.metaRobots}`,
    `Body Text: ${snapshot.bodyText}`
  ].join("\n");
}
