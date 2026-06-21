import { pool } from "../db/manager";

export async function getConfig(key: string): Promise<any | null> {
  if (key === "toppings") {
    const [rows] = await pool.query(
      "SELECT id, name, category_id AS category, price, stock, description, is_active AS isActive FROM toppings"
    );
    return (rows as any[]).map(r => ({ 
      ...r, 
      price: parseFloat(r.price),
      isActive: r.isActive === 1 
    }));
  }

  if (key === "broths") {
    const [rows] = await pool.query(
      "SELECT id, name, description, price FROM broths"
    );
    return (rows as any[]).map(r => ({
      ...r,
      price: parseFloat(r.price)
    }));
  }

  if (key === "presets") {
    const [presetRows] = await pool.query(
      "SELECT id, name, description, base_price AS basePrice, default_level AS defaultLevel, default_broth_id AS defaultBroth, image, is_popular AS isPopular FROM presets"
    );
    const presets = presetRows as any[];
    if (presets.length === 0) return [];

    const [presetToppingRows] = await pool.query("SELECT preset_id, topping_id FROM preset_toppings");
    const pToppings = presetToppingRows as any[];

    return presets.map(p => ({
      ...p,
      basePrice: parseFloat(p.basePrice),
      isPopular: p.isPopular === 1,
      defaultToppings: pToppings.filter(pt => pt.preset_id === p.id).map(pt => pt.topping_id)
    }));
  }

  if (key === "snacksAndDrinks") {
    const [rows] = await pool.query(
      "SELECT id, name, category_id AS category, price, description, image, is_popular AS isPopular FROM snacks_drinks"
    );
    return (rows as any[]).map(r => ({ 
      ...r, 
      price: parseFloat(r.price),
      isPopular: r.isPopular === 1 
    }));
  }

  if (key === "toppingCategories") {
    const [rows] = await pool.query("SELECT id, name FROM topping_categories");
    return rows;
  }

  if (key === "menuCategories") {
    const [rows] = await pool.query("SELECT id, name FROM menu_categories");
    return rows;
  }

  if (key === "settings") {
    const [rows] = await pool.query(
      "SELECT shop_name AS shopName, shop_address AS shopAddress, shop_phone AS shopPhone, qris_image AS qrisImage FROM shop_settings WHERE id = 'settings_default'"
    );
    const settingsRows = rows as any[];
    if (settingsRows.length > 0) {
      return {
        ...settingsRows[0],
        adminPin: "••••••"
      };
    }
    return null;
  }

  return null;
}

export async function verifyAdminPin(pin: string): Promise<boolean> {
  const [rows] = await pool.query("SELECT admin_pin FROM shop_settings WHERE id = 'settings_default'");
  const settings = rows as any[];
  const correctPin = settings.length > 0 ? settings[0].admin_pin : "123456";
  return pin === correctPin;
}

export async function getAllConfigs(): Promise<Record<string, any>> {
  const toppings = await getConfig("toppings") || [];
  const broths = await getConfig("broths") || [];
  const presets = await getConfig("presets") || [];
  const snacksAndDrinks = await getConfig("snacksAndDrinks") || [];
  const toppingCategories = await getConfig("toppingCategories") || [];
  const menuCategories = await getConfig("menuCategories") || [];
  const settings = await getConfig("settings") || {};

  return {
    toppings,
    broths,
    presets,
    snacksAndDrinks,
    toppingCategories,
    menuCategories,
    settings
  };
}

export async function saveConfig(key: string, data: any): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (key === "toppings") {
      await conn.query("DELETE FROM toppings");
      for (const t of data) {
        await conn.query(
          "INSERT INTO toppings (id, name, category_id, price, stock, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [t.id, t.name, t.category, t.price, t.stock || 0, t.description || "", t.isActive !== false]
        );
      }
    } 
    else if (key === "broths") {
      await conn.query("DELETE FROM broths");
      for (const b of data) {
        await conn.query(
          "INSERT INTO broths (id, name, description, price) VALUES (?, ?, ?, ?)",
          [b.id, b.name, b.description || "", b.price]
        );
      }
    } 
    else if (key === "presets") {
      await conn.query("DELETE FROM preset_toppings");
      await conn.query("DELETE FROM presets");
      for (const p of data) {
        await conn.query(
          "INSERT INTO presets (id, name, description, base_price, default_level, default_broth_id, image, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [p.id, p.name, p.description || "", p.basePrice, p.defaultLevel || 2, p.defaultBroth, p.image || "", p.isPopular === true]
        );
        if (p.defaultToppings && p.defaultToppings.length > 0) {
          for (const tid of p.defaultToppings) {
            await conn.query("INSERT INTO preset_toppings (preset_id, topping_id) VALUES (?, ?)", [p.id, tid]);
          }
        }
      }
    } 
    else if (key === "snacksAndDrinks") {
      await conn.query("DELETE FROM snacks_drinks");
      for (const sd of data) {
        await conn.query(
          "INSERT INTO snacks_drinks (id, name, category_id, price, description, image, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [sd.id, sd.name, sd.category, sd.price, sd.description || "", sd.image || "", sd.isPopular === true]
        );
      }
    } 
    else if (key === "toppingCategories") {
      await conn.query("DELETE FROM topping_categories");
      for (const tc of data) {
        await conn.query("INSERT INTO topping_categories (id, name) VALUES (?, ?)", [tc.id, tc.name]);
      }
    } 
    else if (key === "menuCategories") {
      await conn.query("DELETE FROM menu_categories");
      for (const mc of data) {
        await conn.query("INSERT INTO menu_categories (id, name) VALUES (?, ?)", [mc.id, mc.name]);
      }
    } 
    else if (key === "settings") {
      let pinToSave = data.adminPin;
      if (!pinToSave || pinToSave === '••••••') {
        const [current] = await conn.query("SELECT admin_pin FROM shop_settings WHERE id = 'settings_default'");
        const rows = current as any[];
        pinToSave = rows.length > 0 ? rows[0].admin_pin : "123456";
      }

      await conn.query(
        `INSERT INTO shop_settings (id, shop_name, shop_address, shop_phone, qris_image, admin_pin)
         VALUES ('settings_default', ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           shop_name = VALUES(shop_name),
           shop_address = VALUES(shop_address),
           shop_phone = VALUES(shop_phone),
           qris_image = VALUES(qris_image),
           admin_pin = ?`,
        [
          data.shopName, 
          data.shopAddress || null, 
          data.shopPhone || null, 
          data.qrisImage || null, 
          pinToSave,
          pinToSave
        ]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function resetConfigs(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    
    await conn.query("DELETE FROM preset_toppings");
    await conn.query("DELETE FROM presets");
    await conn.query("DELETE FROM toppings");
    await conn.query("DELETE FROM broths");
    await conn.query("DELETE FROM snacks_drinks");
    await conn.query("DELETE FROM menu_categories");
    await conn.query("DELETE FROM topping_categories");
    await conn.query("DELETE FROM shop_settings");
    
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
