import { pool, initDb } from "./server/db/manager.js";

async function clearDatabase() {
  console.log("Connecting to database...");
  await initDb(); // Memastikan tabel-tabel ada

  console.log("🗑️  Menghapus SEMUA data dari database...");
  const conn = await pool.getConnection();
  
  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Menghapus isi semua tabel kecuali pengaturan toko (biar PIN Admin nggak hilang)
    await conn.query("TRUNCATE TABLE order_item_toppings");
    await conn.query("TRUNCATE TABLE order_items");
    await conn.query("TRUNCATE TABLE orders");
    await conn.query("TRUNCATE TABLE preset_toppings");
    await conn.query("TRUNCATE TABLE presets");
    await conn.query("TRUNCATE TABLE snacks_drinks");
    await conn.query("TRUNCATE TABLE toppings");
    await conn.query("TRUNCATE TABLE broths");
    await conn.query("TRUNCATE TABLE topping_categories");
    await conn.query("TRUNCATE TABLE menu_categories");
    
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    
    console.log("✅ SUKSES: Semua data menu dan pesanan telah dikosongkan!");
    console.log("Catatan: Pengaturan toko (PIN Admin) tetap dipertahankan agar kamu tetap bisa login.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal menghapus data:", err);
    process.exit(1);
  } finally {
    conn.release();
  }
}

clearDatabase();
