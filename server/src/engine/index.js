import { startServer } from "./server.js";
import { startCoreRuntime } from "./core.js";
import { updateEntitiesToDatabase } from "./core.js";

export async function startEngine() {
  setInterval(async () => {
    await updateEntitiesToDatabase();
  }, 60000); // Save every 60 seconds

  process.on("SIGINT", async () => {
    console.log(
      "Received SIGINT. Saving entities to database before shutdown..."
    );
    await updateEntitiesToDatabase();
    process.exit();
  });

  await startCoreRuntime();

  console.log("Starting server...");
  await startServer();
}
