# Evaluation Framework

## Goals

The system should be useful, trustworthy, and low-noise. Evals focus on source freshness, classification quality, ranking usefulness, and summary faithfulness.

## Metrics

### Ingestion

- Fetch success rate
- Duplicate rate
- Time from publication to ingestion
- Source coverage by category
- Broken link rate

### Classification

- Precision per category
- Recall per category
- Multi-label accuracy
- False positive rate
- Explanation usefulness

### Feed Quality

- Percentage of relevant items in the 7-day feed
- Percentage of stale items incorrectly left active
- Number of important items missed
- Source diversity

### Archive Quality

- Items older than the active window are archived.
- Links and metadata remain intact.
- Archived items remain searchable.

## Test Set

Start with a hand-labeled CSV or JSON file of 90 articles:

- 30 data privacy
- 30 disinformation
- 30 algorithmic bias

Include ambiguous and overlapping examples, such as privacy-related election manipulation or biased moderation systems.

## Review Loop

Each article should allow a human reviewer to mark:

- Correct category
- Incorrect category
- Missing category
- Low quality source
- Duplicate
- Needs follow-up

These labels become the foundation for improving rules.
