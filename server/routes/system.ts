/**
 * System API Routes (Health check, Database reset)
 */

import { Router } from "express";
import * as systemController from "../controllers/systemController";

const router = Router();

router.get("/health", systemController.health);
router.post("/reset", systemController.reset);
router.post("/auth/verify", systemController.verifyPin);

export default router;
