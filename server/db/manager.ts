/**
 * Dual-Mode Database Manager (SQLite / JSON-File Fallback)
 *
 * Provides a unified async interface for database operations that works
 * with SQLite when available, falling back to a JSON file for environments
 * where SQLite native bindings aren't supported (e.g. Cloud Run sandbox).
 */

import path from "path";
import fs from "fs";
import { ALL_SEED_CONFIGS } from "../seed/menu";
import { SEEDED_ORDERS } from "../seed/orders";

// --- Types ---

interface DbRunResult {
  id: number | string;
  changes: number;
}

interface JsonDbData {
  orders: Record<string, unknown>[];
  kv_store: Record<string, string>;
}

// --- Module State ---

let useSQLite = false;
let db: any = null;

const JSON_DB_FILE = path.resolve(process.cwd(), "seblak_db.json");

let jsonDbState: JsonDbData = {
  orders: [],
  kv_store: {}
};

// --- JSON DB Helpers ---

function loadJsonDb(): void {
  try {
    if (fs.existsSync(JSON_DB_FILE)) {
      const content = fs.readFileSync(JSON_DB_FILE, "utf-8");
      jsonDbState = JSON.parse(content);
    } else {
      saveJsonDb();
    }
  } catch (err) {
    console.error("Failed to load JSON file database fallback:", err);
  }
}

function saveJsonDb(): void {
  try {
    fs.writeFileSync(JSON_DB_FILE, JSON.stringify(jsonDbState, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save JSON file database fallback:", err);
  }
}

// --- Dual-Mode Query Functions ---

export const dbRun = (sql: string, params: (string | number | null)[] = []): Promise<DbRunResult> => {
  if (useSQLite && db) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  // JSON Fallback logic
  loadJsonDb();
  const sqlNorm = sql.trim().replace(/\s+/g, ' ');

  if (sqlNorm.includes("CREATE TABLE")) {
    return Promise.resolve({ id: 0, changes: 0 });
  }

  if (sqlNorm.includes("DELETE FROM orders")) {
    if (sqlNorm.includes("WHERE id = ?")) {
      jsonDbState.orders = jsonDbState.orders.filter(o => (o as any).id !== params[0]);
    } else {
      jsonDbState.orders = [];
    }
    saveJsonDb();
    return Promise.resolve({ id: 0, changes: 1 });
  }

  if (sqlNorm.includes("DELETE FROM kv_store")) {
    jsonDbState.kv_store = {};
    saveJsonDb();
    return Promise.resolve({ id: 0, changes: 1 });
  }

  if (sqlNorm.includes("INSERT INTO kv_store") || sqlNorm.includes("ON CONFLICT")) {
    const key = params[0] as string;
    const value = params[1] as string;
    jsonDbState.kv_store[key] = value;
    saveJsonDb();
    return Promise.resolve({ id: 1, changes: 1 });
  }

  if (sqlNorm.includes("INSERT INTO orders")) {
    const newOrder = {
      id: params[0], queueNumber: params[1], customerName: params[2],
      items: params[3], totalPrice: params[4], paymentMethod: params[5],
      status: params[6], createdAt: params[7], paidAt: params[8], completedAt: params[9]
    };
    jsonDbState.orders = jsonDbState.orders.filter(o => (o as any).id !== newOrder.id);
    jsonDbState.orders.push(newOrder);
    saveJsonDb();
    return Promise.resolve({ id: newOrder.id as string | number, changes: 1 });
  }

  if (sqlNorm.includes("UPDATE orders")) {
    const idVal = params[9];
    const idx = jsonDbState.orders.findIndex(o => (o as any).id === idVal);
    if (idx !== -1) {
      jsonDbState.orders[idx] = {
        id: idVal, queueNumber: params[0], customerName: params[1],
        items: params[2], totalPrice: params[3], paymentMethod: params[4],
        status: params[5], createdAt: params[6], paidAt: params[7], completedAt: params[8]
      };
      saveJsonDb();
    }
    return Promise.resolve({ id: idVal as string | number, changes: 1 });
  }

  return Promise.resolve({ id: 1, changes: 1 });
};

export const dbAll = (sql: string, _params: (string | number | null)[] = []): Promise<Record<string, unknown>[]> => {
  if (useSQLite && db) {
    return new Promise((resolve, reject) => {
      db.all(sql, _params, (err: Error | null, rows: Record<string, unknown>[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  loadJsonDb();
  const sqlNorm = sql.trim().replace(/\s+/g, ' ');

  if (sqlNorm.includes("SELECT * FROM orders")) {
    const sorted = [...jsonDbState.orders].sort((a, b) =>
      String((b as any).createdAt).localeCompare(String((a as any).createdAt))
    );
    return Promise.resolve(sorted);
  }

  if (sqlNorm.includes("SELECT * FROM kv_store")) {
    const list = Object.entries(jsonDbState.kv_store).map(([key, value]) => ({ key, value }));
    return Promise.resolve(list);
  }

  return Promise.resolve([]);
};

export const dbGet = (sql: string, params: (string | number | null)[] = []): Promise<Record<string, unknown> | undefined> => {
  if (useSQLite && db) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err: Error | null, row: Record<string, unknown>) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  loadJsonDb();
  const sqlNorm = sql.trim().replace(/\s+/g, ' ');

  if (sqlNorm.includes("SELECT value FROM kv_store WHERE key = ?")) {
    const key = params[0] as string;
    const val = jsonDbState.kv_store[key];
    return Promise.resolve(val ? { value: val } : undefined);
  }

  if (sqlNorm.includes("SELECT COUNT(*)")) {
    return Promise.resolve({ count: jsonDbState.orders.length });
  }

  if (sqlNorm.includes("SELECT id FROM orders WHERE id = ?")) {
    const found = jsonDbState.orders.find(o => (o as any).id === params[0]);
    return Promise.resolve(found ? { id: (found as any).id } : undefined);
  }

  return Promise.resolve(undefined);
};

// --- Database Initialization ---

export async function initDb(): Promise<void> {
  console.log("Loading database system...");

  try {
    const sqliteModule = await import("sqlite3");
    const SqliteClass = (sqliteModule as any).default?.Database || (sqliteModule as any).Database;

    if (SqliteClass) {
      const dbFile = path.resolve(process.cwd(), "seblak.db");
      db = new SqliteClass(dbFile);
      useSQLite = true;
      console.log(`✅ SUCCESS: Connected to SQLite database file at ${dbFile}`);
    }
  } catch {
    console.warn(`\n⚠️ INFO: Gagal memuat library 'sqlite3' (ketidakcocokan GLIBC di Cloud Run Sandbox).`);
    console.warn(`👉 SEBLAK-POS OTOMATIS BERPINDAH KE DATABASE FILE-JSON (${JSON_DB_FILE}) YANG 100% AMAN.`);
    console.warn(`👉 Ketiadaan SQLite di cloud ini NORMAL! Saat dijalankan di laptop/PC Anda, SQLite otomatis aktif.\n`);
    useSQLite = false;
  }

  console.log("Initializing database tables...");

  await dbRun(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      queueNumber TEXT NOT NULL,
      customerName TEXT NOT NULL,
      items TEXT NOT NULL,
      totalPrice REAL NOT NULL,
      paymentMethod TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      paidAt TEXT,
      completedAt TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  console.log("Tables created successfully.");

  // Seed KV configs if empty
  for (const item of ALL_SEED_CONFIGS) {
    const row = await dbGet(`SELECT value FROM kv_store WHERE key = ?`, [item.key]);
    if (!row) {
      console.log(`Seeding database configurations: ${item.key}...`);
      await dbRun(
        `INSERT INTO kv_store (key, value) VALUES (?, ?)`,
        [item.key, JSON.stringify(item.defaultVal)]
      );
    }
  }

  // Seed default orders if empty
  const orderCount = await dbGet(`SELECT COUNT(*) as count FROM orders`);
  if ((orderCount as any)?.count === 0) {
    console.log("Seeding default historic orders...");
    for (const order of SEEDED_ORDERS) {
      await dbRun(
        `INSERT INTO orders (id, queueNumber, customerName, items, totalPrice, paymentMethod, status, createdAt, paidAt, completedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id, order.queueNumber, order.customerName,
          JSON.stringify(order.items), order.totalPrice,
          order.paymentMethod, order.status, order.createdAt,
          order.paidAt || null, order.completedAt || null
        ]
      );
    }
  }

  console.log("Database successfully seeded & ready!");
}
