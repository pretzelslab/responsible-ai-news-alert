import { getArticles } from "@/lib/sample-data";

export default function ArchivePage() {
  const articles = getArticles("archived");

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>Responsible AI News Alert</h1>
          <p>Local-first signal tracking</p>
        </div>
        <nav className="nav" aria-label="Primary">
          <a href="/">Feed</a>
          <a className="active" href="/archive">
            Archive
          </a>
          <a href="/sources">Sources</a>
          <a href="/trends">Trends</a>
        </nav>
      </aside>

      <section className="main">
        <div className="header">
          <div>
            <p className="eyebrow">Older than active window</p>
            <h2>Archive</h2>
          </div>
        </div>

        <section className="feed" aria-label="Archived articles">
          {articles.map((article) => (
            <article className="article" key={article.url}>
              <div className="article-top">
                <span className="source">{article.source}</span>
                <span className="source">Archived</span>
              </div>
              <h3>
                <a href={article.url} rel="noreferrer" target="_blank">
                  {article.title}
                </a>
              </h3>
              <p>{article.summary}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
