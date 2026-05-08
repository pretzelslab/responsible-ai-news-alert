import taxonomy from "../config/taxonomy.json";
import type { ArticleCategory } from "./article-types";

type TaxonomyCategory = {
  keywords: string[];
  name: string;
  severitySignals: string[];
  slug: ArticleCategory["slug"];
};

const categories = taxonomy.categories as TaxonomyCategory[];

export function classifyArticle(input: {
  summary: string;
  title: string;
}): {
  categories: ArticleCategory[];
  severity: 1 | 2 | 3 | 4 | 5;
} {
  const text = `${input.title} ${input.summary}`.toLowerCase();
  const matches = categories
    .map((category) => {
      const keywordMatches = category.keywords.filter((keyword) =>
        text.includes(keyword.toLowerCase())
      );
      const severityMatches = category.severitySignals.filter((signal) =>
        text.includes(signal.toLowerCase())
      );

      return {
        category,
        keywordMatches,
        severityMatches
      };
    })
    .filter((match) => match.keywordMatches.length > 0)
    .map((match) => ({
      confidence: Math.min(95, 55 + match.keywordMatches.length * 10),
      name: match.category.name,
      reason: `Matched: ${match.keywordMatches.slice(0, 4).join(", ")}`,
      severityBoost: match.severityMatches.length,
      slug: match.category.slug
    }));

  const classified =
    matches.length > 0
      ? matches
      : [
          {
            confidence: 35,
            name: "Needs review",
            reason: "No taxonomy keyword matched; retained for analyst review.",
            severityBoost: 0,
            slug: "privacy" as const
          }
        ];

  const severity = Math.min(
    5,
    Math.max(1, 2 + classified.length - 1 + Math.max(...classified.map((item) => item.severityBoost)))
  ) as 1 | 2 | 3 | 4 | 5;

  return {
    categories: classified.map(({ severityBoost: _severityBoost, ...category }) => category),
    severity
  };
}
