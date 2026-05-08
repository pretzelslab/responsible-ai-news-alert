export type RiskCategorySlug =
  | "privacy"
  | "disinformation"
  | "addiction_dependency"
  | "bad_actors"
  | "environmental_harm"
  | "bias"
  | "independent_thinking"
  | "human_control"
  | "ai_advancement"
  | "review";

export type ArticleCategory = {
  confidence: number;
  name: string;
  reason: string;
  slug: RiskCategorySlug;
};

export type ArticleStatus = "active" | "archived";

export type Article = {
  archivedAt?: string;
  categories: ArticleCategory[];
  id: string;
  ingestedAt: string;
  publishedAt: string;
  severity: 1 | 2 | 3 | 4 | 5;
  source: string;
  status: ArticleStatus;
  summary: string;
  title: string;
  url: string;
};

export type FeedWindow = "7" | "14" | "archive";
