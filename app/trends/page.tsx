import { getArticles, getCategoryCounts } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default function TrendsPage() {
  const categoryCounts = getCategoryCounts(getArticles("14"));

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>Responsible AI News Alert</h1>
          <p>Local-first signal tracking</p>
        </div>
        <nav className="nav" aria-label="Primary">
          <a href="/">Feed</a>
          <a href="/archive">Archive</a>
          <a href="/sources">Sources</a>
          <a className="active" href="/trends">
            Trends
          </a>
        </nav>
      </aside>

      <section className="main">
        <div className="header">
          <div>
            <p className="eyebrow">Current active feed</p>
            <h2>Trends</h2>
          </div>
        </div>

        <section className="panel">
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
        </section>
      </section>
    </main>
  );
}
