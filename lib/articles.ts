import fs from "node:fs";
import path from "node:path";
import type { Article, ArticleStatus, FeedWindow } from "./article-types";

const dataDir = path.join(process.cwd(), "data");
const articlesPath = path.join(dataDir, "articles.json");

export function readArticles(): Article[] {
  if (!fs.existsSync(articlesPath)) {
    return [];
  }

  const raw = fs.readFileSync(articlesPath, "utf8");
  if (!raw.trim()) {
    return [];
  }

  return JSON.parse(raw) as Article[];
}

export function writeArticles(articles: Article[]) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(`${articlesPath}.tmp`, `${JSON.stringify(articles, null, 2)}\n`);
  fs.renameSync(`${articlesPath}.tmp`, articlesPath);
}

export function getArticles(window: FeedWindow): Article[] {
  const articles = readArticles();
  const now = Date.now();

  return articles
    .filter((article) => {
      if (window === "archive") {
        return article.status === "archived";
      }

      if (article.status !== "active") {
        return false;
      }

      const days = Number(window);
      const published = new Date(article.publishedAt).getTime();
      const ageDays = Math.floor((now - published) / (1000 * 60 * 60 * 24));
      return ageDays <= days;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeedStats(articles: Article[]) {
  const sources = new Set(articles.map((article) => article.source));
  const newest = articles[0]?.publishedAt;

  return {
    highSeverity: articles.filter((article) => article.severity >= 4).length,
    newestAgeDays: newest ? ageInDays(new Date(newest)) : 0,
    sources: sources.size,
    total: articles.length
  };
}

export function getCategoryCounts(articles: Article[]) {
  const counts = new Map<string, number>();

  for (const article of articles) {
    for (const category of article.categories) {
      counts.set(category.name, (counts.get(category.name) ?? 0) + 1);
    }
  }

  const max = Math.max(...counts.values(), 1);

  return Array.from(counts.entries()).map(([name, count]) => ({
    count,
    name,
    percent: Math.round((count / max) * 100)
  }));
}

export function normalizeStatus(value: string | undefined): ArticleStatus {
  return value === "archived" ? "archived" : "active";
}

export function ageInDays(date: Date) {
  const elapsed = Date.now() - date.getTime();
  return Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)));
}
