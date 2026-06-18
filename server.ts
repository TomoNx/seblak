/**
 * SeblakPOS Server — Entry Point
 *
 * Slim orchestrator that composes the database, API routes, and Vite integration.
 * All business logic is delegated to modular files under server/.
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initDb } from "./server/db/manager";
import orderRoutes from "./server/routes/orders";
import configRoutes from "./server/routes/config";
import systemRoutes from "./server/routes/system";
import uploadRoutes from "./server/routes/upload";

const PORT = 3000;

async function startServer(): Promise<void> {
  await initDb();

  const app = express();
  app.use(express.json({ limit: "20mb" }));

  // --- API Routes ---
  app.use("/api", systemRoutes);
  app.use("/api", configRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api", uploadRoutes);

  // --- Static Uploads ---
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // --- Frontend Serving ---
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite backend server integration in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in Production mode. Serving built static content from dist/ folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SeblakPOS Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Fatal startup error in SeblakPOS Server:", err);
});
