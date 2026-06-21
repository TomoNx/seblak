/**
 * SeblakPOS Database Reset Helper
 *
 * Menjalankan request POST ke endpoint /api/reset untuk mengosongkan database
 * dan mengisinya kembali (seeding) dengan konfigurasi menu terbaru.
 *
 * Cara Menjalankan:
 *   1. Pastikan server dev aktif (running `npm start` atau `npm run dev`) di http://localhost:3000
 *   2. Buka terminal baru di folder project
 *   3. Jalankan perintah: node reset_db.js
 */

const BASE_URL = 'http://localhost:3000/api';

async function resetDatabase() {
  console.log("♻️  Memulai proses reset database...");

  try {
    // 1. Cek status health server
    const healthRes = await fetch(`${BASE_URL}/health`);
    if (!healthRes.ok) {
      throw new Error(`Server status: ${healthRes.status}`);
    }
    const healthData = await healthRes.json();
    console.log(`📡 Server status: ${healthData.status} (DB: ${healthData.db})`);

    // 2. Kirim request reset
    console.log("⏳ Mengirim permintaan reset ke backend...");
    const resetRes = await fetch(`${BASE_URL}/reset`, {
      method: 'POST'
    });
    
    const resetData = await resetRes.json();
    if (resetRes.ok && resetData.success) {
      console.log("\n==================================================");
      console.log("🏆 SUKSES: Database berhasil di-reset ke data seed!");
      console.log("   Semua menu baru, topping, & pesanan default telah dimuat.");
      console.log("==================================================");
    } else {
      console.error("\n❌ GAGAL: Server mengembalikan error:", resetData.error || resetData.message);
    }
  } catch (error) {
    console.error("\n❌ KONEKSI GAGAL: Tidak dapat menghubungi server.");
    console.error("   Pastikan server Anda berjalan (npm start atau npm run dev) di port 3000.");
    console.error(`   Error detail: ${error.message}`);
  }
}

resetDatabase();
