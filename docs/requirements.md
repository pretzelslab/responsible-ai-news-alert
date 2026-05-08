# Requirements

## MVP Goal

Build a lightweight web dashboard that collects public news and analysis signals across selected risk spaces, keeps source links, highlights recent movement, and archives older material without paid infrastructure.

## Risk Categories

1. Data privacy
2. Disinformation
3. Addiction / emotional dependency
4. Bad actors
5. Environmental harm
6. Algorithmic bias
7. Loss of independent thinking
8. Loss of human control
9. AI advancement / changes

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
- Group feed items by parent risk category with expandable sections.
- Use source-provided or extractive summaries in the MVP; do not require paid AI-generated summaries.
- Keep the primary feed body wide; move trend/category movement summaries out of the right rail.
- Track source health so over-reliance on one source, such as EFF, is visible and correctable.

## Classification And Scoring

Classification is rule-based in the MVP.

- Each category has keywords, severity signals, and a priority value.
- Match score = `keyword matches * 10 + severity signal matches * 8 + priority * 4`.
- Match percentage shown in the UI is currently confidence, calculated as `45 + match score`, capped at `95`.
- Primary category is the highest-scoring category.
- Severity is calculated from category count and severity-signal hits, capped at `5`.
- Privacy has a higher priority than algorithmic bias so articles about data practices, tracking, sensitive data, or data sharing are less likely to be incorrectly grouped under algorithmic bias.

These scores are directional triage aids, not ground truth. Analyst review should be used to tune keywords and priorities.

## Source Strategy

The feed should not depend on one source. The initial source set should include:

- Primary regulators and standards bodies.
- Civil society and digital rights groups.
- Specialist accountability journalism.
- AI research and governance institutes.
- Carefully selected advancement/change feeds for model releases, capability shifts, and regulatory changes.

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
