import { getArticles, getCategoryCounts, getFeedStats } from "@/lib/sample-data";

const windowLabel = "Rolling 7 days";

export default function Home() {
  const articles = getArticles("active");
  const stats = getFeedStats(articles);
  const categoryCounts = getCategoryCounts(articles);

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
              <button className="active" type="button">
                7 days
              </button>
              <button type="button">14 days</button>
              <button type="button">Archive</button>
            </div>
          </div>
        </div>

        <section className="metrics" aria-label="Feed summary">
          <div className="metric">
            <span>Active items</span>
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

        <div className="content-grid">
          <section className="feed" aria-label="Articles">
            {articles.map((article) => (
              <article className="article" key={article.url}>
                <div className="article-top">
                  <span className="source">
                    {article.source} · {formatDate(article.publishedAt)}
                  </span>
                  <span className="source">{ageInDays(article.publishedAt)}d ago</span>
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
                      {category.name} · {category.confidence}%
                    </span>
                  ))}
                  <span className="badge">Severity {article.severity}/5</span>
                </div>
              </article>
            ))}
          </section>

          <aside className="panel">
            <h3>Category movement</h3>
            <div className="trend-list">
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
          </aside>
        </div>
      </section>
    </main>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function ageInDays(date: Date) {
  const elapsed = Date.now() - date.getTime();
  return Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)));
}
