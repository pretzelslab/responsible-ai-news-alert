# Project State

## Project

Responsible AI News Alert

Local repo:

```text
C:\Preeti\AI\News alert
```

GitHub repo:

```text
https://github.com/pretzelslab/responsible-ai-news-alert
```

Current branch:

```text
codex/responsible-ai-news-alert
```

## Working Style

- Plan first before meaningful implementation.
- Ask before larger changes or pushes.
- Keep changes small and reviewable.
- Conserve context: avoid unnecessary browsing, long command output, and large file dumps.
- Summarize results instead of pasting full logs unless needed.
- Warn the user around 70-80% context usage or before a large new feature.
- Preserve durable decisions in repo docs so new chats can resume from files.

## Current App State

- Next.js local-first web app.
- No paid APIs.
- RSS ingestion writes to `data/articles.json`.
- Archive rule:
  - 7-day default feed.
  - 14-day zoom.
  - Older items archived.
- Feed is grouped by expandable risk category.
- Category movement appears above the feed, not in a right rail.
- Summaries are source-provided/extractive, not AI-generated.

## Local Run

Port 3000 may be used by other projects. Prefer 3001:

```powershell
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Then open:

```text
http://localhost:3001
```

## Current Categories

- Data privacy
- Disinformation
- Addiction / emotional dependency
- Bad actors
- Environmental harm
- Algorithmic bias
- Loss of independent thinking
- Loss of human control
- AI advancement / changes
- Needs review

## Known Source Notes

- EFF currently contributes many usable items.
- FTC RSS returned `403` during automated ingestion.
- Source mix was expanded to include CDT, Mozilla Foundation, Google Research Blog, NIST News, AI Now, The Markup, and Tech Policy Press.
- Source health and diversity need a dedicated view or report.

## Current Scoring

- Match score = `keyword matches * 10 + severity signal matches * 8 + category priority * 4`.
- Displayed confidence = `45 + match score`, capped at `95`.
- Primary category = highest-scoring category.
- Severity uses matched category count and severity-signal hits, capped at `5`.
- Scores are triage aids, not ground truth.

## Near-Term Backlog

- Add non-news source types:
  - Articles and essays.
  - Reports/research.
  - Upcoming events/webinars/conferences.
  - Educators/experts.
- Limit results to max 5 per category/source type.
- Add trending companies/tools/entities:
  - Mention count.
  - Source spread.
  - Related risk categories.
- Improve source health reporting.
- Consider local AI summarization later with Ollama, only if useful and feasible.
