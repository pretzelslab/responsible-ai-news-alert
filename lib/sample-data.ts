export type RiskCategory = {
  confidence: number;
  name: "Data privacy" | "Disinformation" | "Algorithmic bias";
  slug: "privacy" | "disinformation" | "bias";
};

export type Article = {
  categories: RiskCategory[];
  ingestedAt: Date;
  publishedAt: Date;
  severity: 1 | 2 | 3 | 4 | 5;
  source: string;
  status: "active" | "archived";
  summary: string;
  title: string;
  url: string;
};

const now = new Date();

function daysAgo(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date;
}

export const sampleArticles: Article[] = [
  {
    categories: [{ confidence: 88, name: "Data privacy", slug: "privacy" }],
    ingestedAt: daysAgo(0),
    publishedAt: daysAgo(1),
    severity: 4,
    source: "Sample Regulatory Feed",
    status: "active",
    summary:
      "A regulator announced new scrutiny of biometric data practices, with emphasis on consent, retention, and third-party sharing.",
    title: "Regulator expands review of biometric data collection practices",
    url: "https://example.com/privacy-biometric-review"
  },
  {
    categories: [{ confidence: 82, name: "Disinformation", slug: "disinformation" }],
    ingestedAt: daysAgo(1),
    publishedAt: daysAgo(2),
    severity: 3,
    source: "Sample Integrity Lab",
    status: "active",
    summary:
      "Researchers identified coordinated activity spreading manipulated media around a public policy debate.",
    title: "Coordinated network amplifies manipulated media across platforms",
    url: "https://example.com/coordinated-media-network"
  },
  {
    categories: [
      { confidence: 79, name: "Algorithmic bias", slug: "bias" },
      { confidence: 58, name: "Data privacy", slug: "privacy" }
    ],
    ingestedAt: daysAgo(2),
    publishedAt: daysAgo(4),
    severity: 4,
    source: "Sample Research Digest",
    status: "active",
    summary:
      "An audit found uneven outcomes in automated screening, with privacy questions around retained applicant data.",
    title: "Audit finds disparate outcomes in automated screening workflow",
    url: "https://example.com/automated-screening-audit"
  },
  {
    categories: [{ confidence: 84, name: "Disinformation", slug: "disinformation" }],
    ingestedAt: daysAgo(11),
    publishedAt: daysAgo(12),
    severity: 2,
    source: "Sample News Wire",
    status: "archived",
    summary:
      "A platform removed accounts tied to a small influence campaign after external researchers published indicators.",
    title: "Platform removes accounts linked to influence campaign",
    url: "https://example.com/influence-campaign-archive"
  }
];

export function getArticles(status: Article["status"]) {
  return sampleArticles
    .filter((article) => article.status === status)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function getFeedStats(articles: Article[]) {
  const sources = new Set(articles.map((article) => article.source));
  const newest = articles[0]?.publishedAt ?? now;

  return {
    highSeverity: articles.filter((article) => article.severity >= 4).length,
    newestAgeDays: Math.max(
      0,
      Math.floor((now.getTime() - newest.getTime()) / (1000 * 60 * 60 * 24))
    ),
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
