/**
 * MySQL/MariaDB Database Connection Pool Manager
 *
 * Configured dynamically using .env.local variables. Automatically creates the database
 * and relational tables if not present, and seeds the initial POS menu & configurations.
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { 
  SEEDED_TOPPINGS, SEEDED_BROTHS, SEEDED_PRESETS, 
  SEEDED_SNACKS_AND_DRINKS, SEEDED_TOPPING_CATEGORIES, 
  SEEDED_MENU_CATEGORIES, SEEDED_SETTINGS 
} from "../seed/menu";
import { SEEDED_ORDERS } from "../seed/orders";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = parseInt(process.env.DB_PORT || "3306", 10);
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const dbName = process.env.DB_NAME || "seblak";

export let pool: mysql.Pool;

export async function initDb(): Promise<void> {
  console.log("Loading database system...");

  // 1. Auto-create database if not exists
  try {
    const tempConnection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });
    
    console.log(`Connected to MySQL server to check database presence...`);
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await tempConnection.end();
    console.log(`Database "${dbName}" verified/created successfully.`);
  } catch (err: any) {
    console.error("Fatal error: Failed to verify/create database:", err);
    throw err;
  }

  // 2. Initialize pool
  pool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  console.log(`✅ SUCCESS: Connected to MySQL/MariaDB database "${dbName}"`);
  
  // 3. Create tables in proper relational structure
  console.log("Initializing database tables...");
  
  const conn = await pool.getConnection();
  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    await conn.query(`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS topping_categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS broths (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS toppings (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        FOREIGN KEY (category_id) REFERENCES topping_categories(id) ON DELETE RESTRICT
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS presets (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        default_level INT NOT NULL DEFAULT 2,
        default_broth_id VARCHAR(50) NOT NULL,
        image VARCHAR(255),
        is_popular BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (default_broth_id) REFERENCES broths(id) ON DELETE RESTRICT
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS preset_toppings (
        preset_id VARCHAR(50) NOT NULL,
        topping_id VARCHAR(50) NOT NULL,
        PRIMARY KEY (preset_id, topping_id),
        FOREIGN KEY (preset_id) REFERENCES presets(id) ON DELETE CASCADE,
        FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS snacks_drinks (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        is_popular BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE RESTRICT
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS shop_settings (
        id VARCHAR(50) PRIMARY KEY,
        shop_name VARCHAR(100) NOT NULL,
        shop_address TEXT,
        shop_phone VARCHAR(20),
        qris_image TEXT,
        admin_pin VARCHAR(6) NOT NULL DEFAULT '123456'
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        queue_number VARCHAR(10) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(20),
        status VARCHAR(20) NOT NULL DEFAULT 'draft',
        created_at DATETIME NOT NULL,
        paid_at DATETIME,
        completed_at DATETIME
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL,
        broth_name VARCHAR(100),
        level INT,
        price_per_unit DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        notes TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS order_item_toppings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_item_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
      )
    `);

    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
  } finally {
    conn.release();
  }
  
  console.log("Tables created successfully.");

  // Seeding initial data...
  await seedInitialData();
}

async function seedInitialData() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    // 1. Seed topping categories
    const [existingTopCats] = await conn.query("SELECT COUNT(*) as count FROM topping_categories");
    if ((existingTopCats as any)[0].count === 0) {
      console.log("Seeding topping_categories...");
      for (const cat of SEEDED_TOPPING_CATEGORIES) {
        await conn.query("INSERT INTO topping_categories (id, name) VALUES (?, ?)", [cat.id, cat.name]);
      }
    }

    // 2. Seed menu categories
    const [existingMenuCats] = await conn.query("SELECT COUNT(*) as count FROM menu_categories");
    if ((existingMenuCats as any)[0].count === 0) {
      console.log("Seeding menu_categories...");
      for (const cat of SEEDED_MENU_CATEGORIES) {
        await conn.query("INSERT INTO menu_categories (id, name) VALUES (?, ?)", [cat.id, cat.name]);
      }
    }

    // 3. Seed broths
    const [existingBroths] = await conn.query("SELECT COUNT(*) as count FROM broths");
    if ((existingBroths as any)[0].count === 0) {
      console.log("Seeding broths...");
      for (const b of SEEDED_BROTHS) {
        await conn.query("INSERT INTO broths (id, name, description, price) VALUES (?, ?, ?, ?)", [b.id, b.name, b.description, b.price]);
      }
    }

    // 4. Seed toppings
    const [existingToppings] = await conn.query("SELECT COUNT(*) as count FROM toppings");
    if ((existingToppings as any)[0].count === 0) {
      console.log("Seeding toppings...");
      for (const t of SEEDED_TOPPINGS) {
        await conn.query(
          "INSERT INTO toppings (id, name, category_id, price, stock, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [t.id, t.name, t.category, t.price, t.stock, t.description, (t as any).isActive !== false]
        );
      }
    }

    // 5. Seed presets
    const [existingPresets] = await conn.query("SELECT COUNT(*) as count FROM presets");
    if ((existingPresets as any)[0].count === 0) {
      console.log("Seeding presets and preset_toppings...");
      for (const p of SEEDED_PRESETS) {
        await conn.query(
          "INSERT INTO presets (id, name, description, base_price, default_level, default_broth_id, image, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [p.id, p.name, p.description, p.basePrice, p.defaultLevel, p.defaultBroth, p.image, p.isPopular]
        );
        for (const tid of p.defaultToppings) {
          await conn.query("INSERT INTO preset_toppings (preset_id, topping_id) VALUES (?, ?)", [p.id, tid]);
        }
      }
    }

    // 6. Seed snacks_drinks
    const [existingSnacksDrinks] = await conn.query("SELECT COUNT(*) as count FROM snacks_drinks");
    if ((existingSnacksDrinks as any)[0].count === 0) {
      console.log("Seeding snacks_drinks...");
      for (const sd of SEEDED_SNACKS_AND_DRINKS) {
        await conn.query(
          "INSERT INTO snacks_drinks (id, name, category_id, price, description, image, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [sd.id, sd.name, sd.category, sd.price, sd.description, sd.image, sd.isPopular || false]
        );
      }
    }

    // 7. Seed shop_settings
    const [existingSettings] = await conn.query("SELECT COUNT(*) as count FROM shop_settings");
    if ((existingSettings as any)[0].count === 0) {
      console.log("Seeding shop_settings...");
      await conn.query(
        "INSERT INTO shop_settings (id, shop_name, shop_address, shop_phone, qris_image, admin_pin) VALUES (?, ?, ?, ?, ?, ?)",
        ["settings_default", SEEDED_SETTINGS.shopName, SEEDED_SETTINGS.shopAddress, SEEDED_SETTINGS.shopPhone, SEEDED_SETTINGS.qrisImage, SEEDED_SETTINGS.adminPin]
      );
    }

    // 8. Seed default orders
    const [existingOrders] = await conn.query("SELECT COUNT(*) as count FROM orders");
    if ((existingOrders as any)[0].count === 0) {
      console.log("Seeding default historic orders...");
      for (const order of SEEDED_ORDERS) {
        await conn.query(
          "INSERT INTO orders (id, queue_number, customer_name, total_price, payment_method, status, created_at, paid_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            order.id, order.queueNumber, order.customerName, order.totalPrice,
            order.paymentMethod, order.status,
            new Date(order.createdAt),
            order.paidAt ? new Date(order.paidAt) : null,
            order.completedAt ? new Date(order.completedAt) : null
          ]
        );

        for (const item of order.items) {
          const [itemResult] = await conn.query(
            "INSERT INTO order_items (order_id, name, type, broth_name, level, price_per_unit, quantity, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              order.id, item.name, item.type,
              item.brothName || '', item.level || 0,
              item.pricePerUnit, item.quantity, item.notes || ''
            ]
          );
          const orderItemId = (itemResult as any).insertId;

          if (item.toppings && item.toppings.length > 0) {
            for (const t of item.toppings) {
              await conn.query(
                "INSERT INTO order_item_toppings (order_item_id, name, quantity, price) VALUES (?, ?, ?, ?)",
                [orderItemId, t.name, t.quantity, t.price]
              );
            }
          }
        }
      }
    }

    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
  } catch (err) {
    console.error("Error during initial data seeding:", err);
  } finally {
    conn.release();
  }
}
