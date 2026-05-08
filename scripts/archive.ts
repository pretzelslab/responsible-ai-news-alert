const ACTIVE_WINDOW_DAYS = 7;
const ZOOM_WINDOW_DAYS = 14;

async function main() {
  console.log(`Default active window: ${ACTIVE_WINDOW_DAYS} days`);
  console.log(`Zoom window: ${ZOOM_WINDOW_DAYS} days`);
  console.log("Archive implementation comes next: mark older items as archived.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
