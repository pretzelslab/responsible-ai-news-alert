# Operating Model

## Daily Flow

1. Run ingestion.
2. Deduplicate new articles.
3. Classify against taxonomy rules.
4. Show the latest 7-day feed.
5. Review high-severity or low-confidence items.
6. Run archive job.

## Weekly Flow

1. Review 14-day trends.
2. Check source health.
3. Update keywords and source list.
4. Export or write a short watch brief.

## Weekly Automation

GitHub Actions can run ingestion once a week without requiring Vercel or paid infrastructure. The workflow should stay conservative:

- Run on a weekly schedule.
- Allow manual runs.
- Execute ingestion and archive scripts.
- Commit generated data only after the local storage layer is implemented and intentionally enabled.

## Rolling Windows

- 7 days: default active feed.
- 14 days: zoom view for trend context.
- Older than 14 days: archived by default.

This keeps the UI light while preserving enough recent history for pattern recognition.

## Cost Controls

- Use RSS and public pages first.
- Avoid paid news/search APIs.
- Avoid hosted vector databases.
- Avoid paid LLM calls.
- Keep local SQLite as the default database.
- Treat deployment as optional until the workflow proves useful.
