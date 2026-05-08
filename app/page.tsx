import { ageInDays, getArticles, getCategoryCounts, getFeedStats } from "@/lib/articles";
import type { Article, FeedWindow } from "@/lib/article-types";

export const dynamic = "force-dynamic";

const categoryOrder = [
  "Data privacy",
  "Disinformation",
  "Addiction / emotional dependency",
  "Bad actors",
  "Environmental harm",
  "Algorithmic bias",
  "Loss of independent thinking",
  "Loss of human control",
  "AI advancement / changes",
  "Needs review"
];

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ window?: string }>;
}) {
  const params = await searchParams;
  const feedWindow = normalizeWindow(params.window);
  const articles = getArticles(feedWindow);
  const stats = getFeedStats(articles);
  const categoryCounts = getCategoryCounts(articles);
  const groupedArticles = groupArticlesByPrimaryCategory(articles);
  const windowLabel = feedWindow === "archive" ? "Archive" : `Rolling ${feedWindow} days`;

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>Responsible AI News Alert</h1>
          <p>Local-first signal tracking</p>
        </div>
        <nav className="nav" aria-label="Primary">
          <a className="active" href="/">
            Feed
          </a>
          <a href="/archive">Archive</a>
          <a href="/sources">Sources</a>
          <a href="/trends">Trends</a>
        </nav>
      </aside>

      <section className="main">
        <div className="header">
          <div>
            <p className="eyebrow">{windowLabel}</p>
            <h2>Latest risk signals</h2>
          </div>
          <div className="toolbar" aria-label="Feed controls">
            <div className="segmented">
              <a className={feedWindow === "7" ? "active" : ""} href="/">
                7 days
              </a>
              <a className={feedWindow === "14" ? "active" : ""} href="/?window=14">
                14 days
              </a>
              <a className={feedWindow === "archive" ? "active" : ""} href="/?window=archive">
                Archive
              </a>
            </div>
          </div>
        </div>

        <section className="metrics" aria-label="Feed summary">
          <div className="metric">
            <span>Visible items</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="metric">
            <span>Sources</span>
            <strong>{stats.sources}</strong>
          </div>
          <div className="metric">
            <span>High severity</span>
            <strong>{stats.highSeverity}</strong>
          </div>
          <div className="metric">
            <span>Newest item</span>
            <strong>{stats.newestAgeDays}d</strong>
          </div>
        </section>

        <section className="movement-strip" aria-label="Category movement">
          <div className="movement-header">
            <h3>Category movement</h3>
          </div>
          <div className="movement-list">
            {categoryCounts.map((item) => (
              <div className="trend-row" key={item.name}>
                <div className="trend-meta">
                  <span>{item.name}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="bar" aria-hidden="true">
                  <span style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="feed-layout">
          <section className="feed" aria-label="Articles by risk category">
            {articles.length === 0 ? (
              <article className="article">
                <div className="article-top">
                  <span className="source">No articles yet</span>
                </div>
                <h3>Run ingestion to populate the feed</h3>
                <p>
                  Use <code>npm run ingest</code> and then <code>npm run archive</code> from the
                  project folder.
                </p>
              </article>
            ) : null}

            {groupedArticles.map((group, index) => (
              <details className="category-group" key={group.name} open={index === 0}>
                <summary>
                  <span>{group.name}</span>
                  <strong>{group.articles.length}</strong>
                </summary>
                <div className="group-feed">
                  {group.articles.map((article) => (
                    <article className="article" key={article.url}>
                      <div className="article-top">
                        <span className="source">
                          {article.source} - {formatDate(new Date(article.publishedAt))}
                        </span>
                        <span className="source">
                          {ageInDays(new Date(article.publishedAt))}d ago
                        </span>
                      </div>
                      <h3>
                        <a href={article.url} rel="noreferrer" target="_blank">
                          {article.title}
                        </a>
                      </h3>
                      <p>{article.summary}</p>
                      <div className="badges">
                        {article.categories.map((category) => (
                          <span className={`badge ${category.slug}`} key={category.name}>
                            {category.name} - {category.confidence}%
                          </span>
                        ))}
                        <span className="badge">Severity {article.severity}/5</span>
                      </div>
                      <p className="score-note">{article.categories[0]?.reason}</p>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}

function groupArticlesByPrimaryCategory(articles: Article[]) {
  const groups = new Map<string, Article[]>();

  for (const article of articles) {
    const primaryCategory = article.categories[0]?.name ?? "Needs review";
    groups.set(primaryCategory, [...(groups.get(primaryCategory) ?? []), article]);
  }

  return Array.from(groups.entries())
    .map(([name, groupArticles]) => ({ articles: groupArticles, name }))
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.name);
      const bIndex = categoryOrder.indexOf(b.name);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function normalizeWindow(value: string | undefined): FeedWindow {
  if (value === "14" || value === "archive") {
    return value;
  }

  return "7";
}
