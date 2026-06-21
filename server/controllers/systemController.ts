import { Request, Response } from "express";
import * as orderModel from "../models/orderModel";
import * as configModel from "../models/configModel";
import { ALL_SEED_CONFIGS } from "../seed/menu";
import { SEEDED_ORDERS } from "../seed/orders";

export function health(_req: Request, res: Response) {
  res.json({ status: "ok", db: "active" });
}

export async function reset(req: Request, res: Response) {
  try {
    const adminPin = req.headers["x-admin-pin"] as string;
    if (!adminPin) {
      return res.status(401).json({ error: "Unauthorized: Missing Admin PIN header." });
    }
    const isValid = await configModel.verifyAdminPin(adminPin);
    if (!isValid) {
      return res.status(403).json({ error: "Forbidden: Invalid Admin PIN." });
    }

    console.log("Resetting database to seeded defaults...");

    await orderModel.resetOrders();
    await configModel.resetConfigs();

    // Re-seed KV configs
    for (const item of ALL_SEED_CONFIGS) {
      await configModel.saveConfig(item.key, item.defaultVal);
    }

    // Re-seed orders
    for (const order of SEEDED_ORDERS) {
      await orderModel.createOrder(order);
    }

    console.log("Database reset completed.");
    res.json({ success: true, message: "Database reset successfully." });
  } catch (err: any) {
    console.error("Error resetting database:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function verifyPin(req: Request, res: Response) {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ error: "PIN is required." });
    }
    const isValid = await configModel.verifyAdminPin(pin);
    res.json({ success: isValid });
  } catch (err: any) {
    console.error("Error verifying admin PIN:", err);
    res.status(500).json({ error: err.message });
  }
}
