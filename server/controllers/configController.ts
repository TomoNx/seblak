import { Request, Response } from "express";
import * as orderModel from "../models/orderModel";
import * as configModel from "../models/configModel";
import {
  SEEDED_TOPPINGS, SEEDED_BROTHS, SEEDED_PRESETS,
  SEEDED_SNACKS_AND_DRINKS, SEEDED_TOPPING_CATEGORIES,
  SEEDED_MENU_CATEGORIES, SEEDED_SETTINGS
} from "../seed/menu";

export async function getAllData(_req: Request, res: Response) {
  try {
    const orders = await orderModel.getAllOrders();
    const configMap = await configModel.getAllConfigs();

    res.json({
      orders,
      toppings: configMap['toppings'] || SEEDED_TOPPINGS,
      broths: configMap['broths'] || SEEDED_BROTHS,
      presets: configMap['presets'] || SEEDED_PRESETS,
      snacksAndDrinks: configMap['snacksAndDrinks'] || SEEDED_SNACKS_AND_DRINKS,
      toppingCategories: configMap['toppingCategories'] || SEEDED_TOPPING_CATEGORIES,
      menuCategories: configMap['menuCategories'] || SEEDED_MENU_CATEGORIES,
      settings: configMap['settings'] || SEEDED_SETTINGS
    });
  } catch (err: any) {
    console.error("Error fetching all data:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function save(req: Request, res: Response) {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Missing configuration data." });
    }

    await configModel.saveConfig(key, data);
    res.json({ success: true });
  } catch (err: any) {
    console.error(`Error saving configuration for key ${req.params.key}:`, err);
    res.status(500).json({ error: err.message });
  }
}
