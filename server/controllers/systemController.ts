import { Request, Response } from "express";
import * as orderModel from "../models/orderModel";
import * as configModel from "../models/configModel";
import { ALL_SEED_CONFIGS } from "../seed/menu";
import { SEEDED_ORDERS } from "../seed/orders";

export function health(_req: Request, res: Response) {
  res.json({ status: "ok", db: "active" });
}

export async function reset(_req: Request, res: Response) {
  try {
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
