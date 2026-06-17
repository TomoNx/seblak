/**
 * Configuration & Data API Routes
 */

import { Router } from "express";
import * as configController from "../controllers/configController";

const router = Router();

router.get("/all-data", configController.getAllData);
router.post("/save-config/:key", configController.save);

export default router;
