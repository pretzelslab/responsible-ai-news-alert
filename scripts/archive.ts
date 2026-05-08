import { readArticles, writeArticles } from "../lib/articles";

const ACTIVE_WINDOW_DAYS = 7;
const ZOOM_WINDOW_DAYS = 14;

async function main() {
  const now = Date.now();
  const articles = readArticles();
  let archived = 0;

  const updated = articles.map((article) => {
    if (article.status === "archived") {
      return article;
    }

    const ageDays = Math.floor(
      (now - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (ageDays > ZOOM_WINDOW_DAYS) {
      archived += 1;
      return {
        ...article,
        archivedAt: new Date().toISOString(),
        status: "archived" as const
      };
    }

    return article;
  });

  writeArticles(updated);

  console.log(`Default active window: ${ACTIVE_WINDOW_DAYS} days`);
  console.log(`Zoom window: ${ZOOM_WINDOW_DAYS} days`);
  console.log(`Articles archived: ${archived}`);
  console.log(`Stored articles: ${updated.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
