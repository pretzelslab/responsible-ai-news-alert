# Responsible AI News Alert

A lightweight, local-first intelligence dashboard for tracking public signals across AI and society risk areas.

The MVP is designed to avoid paid APIs, hosted databases, and subscription-only infrastructure. It starts with RSS/public web sources, rule-based classification, a local SQLite database, and a small web UI.

## Initial Scope

- Data privacy
- Disinformation
- Algorithmic bias

Later categories:

- Addiction / emotional dependency
- Bad actors
- Environmental harm
- Loss of independent thinking
- Loss of human control

## Core Principles

- Every article keeps its original source link.
- Default feed shows a rolling 7-day window.
- A 14-day zoom view is available for short-term trend context.
- Older items move to archive status but remain searchable.
- No paid API calls are required for the MVP.
- Classification is auditable and rule-based before adding any optional local AI.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Planned Commands

```bash
npm run ingest
npm run archive
npm run dev
```

The ingestion and archive scripts are scaffolded as the next implementation step.

## Source Stance

Start with sources that are public, durable, and useful for responsible AI monitoring:

- Regulators and public agencies for enforcement, rulemaking, and policy movement.
- Civil society groups for privacy, surveillance, rights, and platform accountability.
- Specialist technology accountability journalism for investigations and trend signals.
- Research institutes and policy analysis groups for slower but higher-context analysis.

Avoid low-quality sources in the MVP:

- Paywalled feeds that cannot be reliably archived.
- Unmoderated social feeds.
- SEO farms and repost aggregators.
- Sources without stable URLs or publication dates.

## Documentation

- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Evaluation Framework](docs/eval-framework.md)
- [Operating Model](docs/operating-model.md)
