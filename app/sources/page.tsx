import sources from "@/config/sources.json";

export default function SourcesPage() {
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
          <a className="active" href="/sources">
            Sources
          </a>
          <a href="/trends">Trends</a>
        </nav>
      </aside>

      <section className="main">
        <div className="header">
          <div>
            <p className="eyebrow">Configured feeds</p>
            <h2>Sources</h2>
          </div>
        </div>

        <section className="feed" aria-label="Sources">
          {sources.sources.map((source) => (
            <article className="article" key={source.url}>
              <div className="article-top">
                <span className="source">{source.type.toUpperCase()}</span>
              </div>
              <h3>
                <a href={source.url} rel="noreferrer" target="_blank">
                  {source.name}
                </a>
              </h3>
              <p>{source.url}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
