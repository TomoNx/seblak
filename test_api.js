/**
 * SeblakPOS Backend API Blackbox Verification Test
 *
 * Menjalankan serangkaian request HTTP ke backend untuk memverifikasi fungsionalitas
 * database MySQL/MariaDB dan skema relasional baru.
 *
 * Cara Menjalankan:
 *   1. Pastikan server MySQL Laragon aktif.
 *   2. Jalankan server dev: `npm run dev` (berjalan di http://localhost:3000)
 *   3. Buka terminal baru dan jalankan: `node test_api.js`
 */

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log("🚀 Memulai Uji Coba Blackbox API Backend SeblakPOS...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(` ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Uji Coba 1: Health Check Endpoint
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.ok && data.status === 'ok', "Endpoint Health check aktif");
  } catch (err) {
    assert(false, `Health check gagal: ${err.message}`);
  }

  // Uji Coba 2: Membaca Seluruh Data Seed Konfigurasi Menu
  let initialData;
  try {
    const res = await fetch(`${BASE_URL}/all-data`);
    initialData = await res.json();
    assert(
      res.ok && 
      Array.isArray(initialData.presets) && 
      initialData.presets.length > 0 &&
      Array.isArray(initialData.toppings) &&
      initialData.toppings.length > 0,
      "Mengambil semua data menu dari seeder database MySQL berhasil"
    );
  } catch (err) {
    assert(false, `Fetch all data gagal: ${err.message}`);
  }

  // Uji Coba 3: Mengunggah Foto Menu (Base64)
  let uploadedUrl;
  try {
    const testBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // 1x1 transparent pixel
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: "blackbox-test.png",
        data: testBase64Image
      })
    });
    const data = await res.json();
    uploadedUrl = data.url;
    assert(res.ok && typeof uploadedUrl === 'string' && uploadedUrl.startsWith('/uploads/'), "API Upload menyimpan gambar lokal dan mengembalikan URL statis");
  } catch (err) {
    assert(false, `API Upload gagal: ${err.message}`);
  }

  // Uji Coba 4: Membuat Pesanan Kustom Baru (Relasional)
  const orderId = `TEST-${Date.now()}`;
  let createdOrder;
  try {
    const newOrder = {
      id: orderId,
      queueNumber: "99",
      customerName: "Tester Blackbox",
      items: [
        {
          name: "Seblak Custom Tester",
          type: "custom",
          brothName: "Kuah Cikur Original (Juara)",
          level: 3,
          pricePerUnit: 15000,
          quantity: 2,
          notes: "Extra pedas",
          toppings: [
            { id: "t_bakso_sapi", name: "Bakso Sapi (3 pcs)", quantity: 2, price: 8000 },
            { id: "t_sosis", name: "Sosis (2 pcs)", quantity: 1, price: 9000 }
          ]
        }
      ],
      totalPrice: 48000,
      paymentMethod: "Tunai",
      status: "pending_payment",
      createdAt: new Date().toISOString()
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    createdOrder = await res.json();
    assert(res.ok && createdOrder.id === orderId, "API Pembuatan Pesanan sukses mencatat data transaksi");
  } catch (err) {
    assert(false, `Membuat pesanan gagal: ${err.message}`);
  }

  // Uji Coba 5: Memverifikasi Pesanan beserta Item dan Toppings dari Database
  try {
    const res = await fetch(`${BASE_URL}/all-data`);
    const allData = await res.json();
    const found = allData.orders.find(o => o.id === orderId);
    assert(
      found !== undefined && 
      found.customerName === "Tester Blackbox" && 
      found.items.length === 1 && 
      found.items[0].toppings.length === 2,
      "Relasi data items dan toppings berhasil disimpan dan digabungkan kembali dari MySQL"
    );
  } catch (err) {
    assert(false, `Verifikasi relasi database gagal: ${err.message}`);
  }

  // Uji Coba 6: Memperbarui Status Pesanan menjadi Lunas (Paid)
  try {
    const updatedOrderPayload = {
      ...createdOrder,
      status: "paid",
      paymentMethod: "QRIS",
      paidAt: new Date().toISOString()
    };
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrderPayload)
    });
    const updatedOrder = await res.json();
    assert(res.ok && updatedOrder.status === 'paid' && updatedOrder.paymentMethod === 'QRIS', "API Update Pesanan (transisi status lunas) berhasil");
  } catch (err) {
    assert(false, `Update pesanan gagal: ${err.message}`);
  }

  // Uji Coba 7: Skenario Negatif (Validasi Input Zod)
  try {
    const invalidOrder = {
      id: `TEST-FAIL-${Date.now()}`,
      queueNumber: "88",
      customerName: "", // Error: Nama kosong tidak diizinkan
      items: [], // Error: Minimal harus memesan 1 item
      totalPrice: 0,
      status: "pending_payment",
      createdAt: new Date().toISOString()
    };
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidOrder)
    });
    const errorData = await res.json();
    assert(res.status === 400 && errorData.error, "Zod input validation memblokir payload tidak valid dengan respons 400 Bad Request");
  } catch (err) {
    assert(false, `Uji coba negatif Zod gagal: ${err.message}`);
  }

  // Uji Coba 8: Penghapusan Pesanan Uji Coba (Clean Up)
  try {
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: 'DELETE'
    });
    assert(res.ok, "API Penghapusan Pesanan untuk pembersihan data berhasil");
  } catch (err) {
    assert(false, `Pembersihan data order uji coba gagal: ${err.message}`);
  }

  // Ringkasan
  console.log("\n==================================================");
  console.log(`📊 RINGKASAN RUNNING TEST:`);
  console.log(`   Berhasil (Passed): ${passed}`);
  console.log(`   Gagal (Failed)   : ${failed}`);
  if (failed === 0) {
    console.log("🏆 SUKSES: Semua fitur API lolos uji coba blackbox relasional!");
  } else {
    console.error("⚠️ PERINGATAN: Ada test case yang gagal. Cek detail di atas.");
  }
  console.log("==================================================");
}

runTests();
