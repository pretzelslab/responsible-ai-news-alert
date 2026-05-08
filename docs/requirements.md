# Requirements

## MVP Goal

Build a lightweight web dashboard that collects public news and analysis signals across selected risk spaces, keeps source links, highlights recent movement, and archives older material without paid infrastructure.

## MVP Categories

1. Data privacy
2. Disinformation
3. Algorithmic bias

## Functional Requirements

- Ingest configured RSS/public sources.
- Store each article with source name, URL, title, published date, ingested date, summary, status, and category labels.
- Show a default rolling 7-day feed.
- Provide a 14-day zoom view.
- Archive items older than the configured active window.
- Preserve archived items for search and trend history.
- Classify articles using transparent keyword and phrase rules.
- Show category badges, confidence, severity, and reason text.
- Provide source links for every item.
- Support adding/removing sources through configuration.
- Run a weekly scheduled ingestion option through GitHub Actions when hosted in GitHub.

## Non-Functional Requirements

- No paid API calls required.
- No paid hosted database required.
- Local-first development.
- GitHub-ready repository structure.
- Low maintenance, with simple scripts for ingestion and archiving.
- Auditable classification decisions.

## Out Of Scope For MVP

- Paid news APIs.
- Paid LLM summaries.
- Social media firehose ingestion.
- Real-time alerting.
- Multi-user permissions.
- Complex forecasting models.
- Fully automated policy recommendations.
