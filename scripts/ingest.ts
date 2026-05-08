import crypto from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import sourcesConfig from "../config/sources.json";
import { classifyArticle } from "../lib/classify";
import { readArticles, writeArticles } from "../lib/articles";
import type { Article } from "../lib/article-types";

async function main() {
  const existing = readArticles().map((article) => {
    const classified = classifyArticle({
      summary: article.summary,
      title: article.title
    });

    return {
      ...article,
      categories: classified.categories,
      severity: classified.severity
    };
  });
  const byUrl = new Map(existing.map((article) => [canonicalizeUrl(article.url), article]));
  let added = 0;
  let failed = 0;

  for (const source of sourcesConfig.sources) {
    try {
      const items = await fetchFeed(source.url);

      for (const item of items) {
        const url = canonicalizeUrl(item.url);
        if (!url || byUrl.has(url)) {
          continue;
        }

        const summary = summarize(item.summary);
        const classified = classifyArticle({
          summary,
          title: item.title
        });

        const article: Article = {
          categories: classified.categories,
          id: makeId(url),
          ingestedAt: new Date().toISOString(),
          publishedAt: item.publishedAt,
          severity: classified.severity,
          source: source.name,
          status: "active",
          summary,
          title: item.title,
          url
        };

        byUrl.set(url, article);
        added += 1;
      }
    } catch (error) {
      failed += 1;
      console.error(`Failed to ingest ${source.name}:`, error);
    }
  }

  const articles = Array.from(byUrl.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  writeArticles(articles);

  console.log(`Sources checked: ${sourcesConfig.sources.length}`);
  console.log(`New articles added: ${added}`);
  console.log(`Source failures: ${failed}`);
  console.log(`Stored articles: ${articles.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

type FeedItem = {
  publishedAt: string;
  summary: string;
  title: string;
  url: string;
};

async function fetchFeed(url: string): Promise<FeedItem[]> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "ResponsibleAINewsAlert/0.1 (+https://github.com/pretzelslab/responsible-ai-news-alert)"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const xml = await response.text();
  const parser = new XMLParser({
    attributeNamePrefix: "",
    ignoreAttributes: false,
    parseTagValue: false,
    trimValues: true
  });
  const parsed = parser.parse(xml);

  if (parsed.rss?.channel?.item) {
    return toArray(parsed.rss.channel.item).map(normalizeRssItem).filter(Boolean) as FeedItem[];
  }

  if (parsed.feed?.entry) {
    return toArray(parsed.feed.entry).map(normalizeAtomEntry).filter(Boolean) as FeedItem[];
  }

  return [];
}

function normalizeRssItem(item: Record<string, unknown>): FeedItem | undefined {
  const title = cleanText(String(item.title ?? ""));
  const url = getRssLink(item);
  const rawDate = String(item.pubDate ?? item.published ?? item.updated ?? "");

  if (!title || !url) {
    return undefined;
  }

  return {
    publishedAt: normalizeDate(rawDate),
    summary: cleanText(String(item.description ?? item["content:encoded"] ?? "")),
    title,
    url
  };
}

function normalizeAtomEntry(entry: Record<string, unknown>): FeedItem | undefined {
  const title = cleanText(String(entry.title ?? ""));
  const url = getAtomLink(entry);
  const rawDate = String(entry.published ?? entry.updated ?? "");

  if (!title || !url) {
    return undefined;
  }

  return {
    publishedAt: normalizeDate(rawDate),
    summary: cleanText(String(entry.summary ?? entry.content ?? "")),
    title,
    url
  };
}

function getRssLink(item: Record<string, unknown>) {
  const link = item.link;
  if (typeof link === "string") {
    return link;
  }
  return "";
}

function getAtomLink(entry: Record<string, unknown>) {
  const link = entry.link;

  if (typeof link === "string") {
    return link;
  }

  if (Array.isArray(link)) {
    const alternate = link.find(
      (item) => typeof item === "object" && item && "href" in item && item.rel !== "self"
    );
    return typeof alternate?.href === "string" ? alternate.href : "";
  }

  if (typeof link === "object" && link && "href" in link) {
    return typeof link.href === "string" ? link.href : "";
  }

  return "";
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function cleanText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function summarize(value: string) {
  if (!value) {
    return "No summary was provided by the source feed.";
  }

  return value.length > 360 ? `${value.slice(0, 357).trim()}...` : value;
}

function normalizeDate(value: string) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function canonicalizeUrl(value: string) {
  try {
    const url = new URL(value.trim());
    url.hash = "";
    for (const key of Array.from(url.searchParams.keys())) {
      if (key.toLowerCase().startsWith("utm_")) {
        url.searchParams.delete(key);
      }
    }
    return url.toString();
  } catch {
    return "";
  }
}

function makeId(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}
