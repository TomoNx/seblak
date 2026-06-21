import { initDb, seedInitialData } from "./server/db/manager.js";

async function run() {
  console.log("Connecting to DB and verifying tables...");
  await initDb();
  
  console.log("Running manual database seeder...");
  await seedInitialData();
  
  console.log("✅ Seeding completed successfully.");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
