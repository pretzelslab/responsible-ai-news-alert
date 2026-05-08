import sources from "../config/sources.json";

async function main() {
  console.log(`Configured sources: ${sources.sources.length}`);
  console.log("Ingestion implementation comes next: fetch RSS, normalize, classify, store.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
