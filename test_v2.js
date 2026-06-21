/**
 * SeblakPOS Backend API Comprehensive Test v2
 *
 * Menguji SELURUH fitur backend termasuk:
 * - Auth (PIN Admin)
 * - Config & Data Fetch
 * - Upload File
 * - CRUD Pesanan
 * - Zod Validations
 * - Database Reset Protection
 */

const BASE_URL = 'http://localhost:3000/api';
const ADMIN_PIN = '123456';

async function runTestV2() {
  console.log("🚀 Memulai Uji Coba Blackbox API v2 (Comprehensive)...\n");
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

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.ok && data.status === 'ok', "Sistem backend menyala (Health check aktif)");
  } catch (err) { assert(false, `Health check gagal: ${err.message}`); }

  // 2. Autentikasi (Verifikasi PIN)
  try {
    const resFail = await fetch(`${BASE_URL}/auth/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '000000' })
    });
    const authFailData = await resFail.json();
    assert(resFail.ok && authFailData.success === false, "Auth: Menolak PIN Admin yang salah");

    const resSuccess = await fetch(`${BASE_URL}/auth/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: ADMIN_PIN })
    });
    const authData = await resSuccess.json();
    assert(resSuccess.ok && authData.success === true, "Auth: Menerima PIN Admin yang benar");
  } catch (err) { assert(false, `Verifikasi PIN gagal: ${err.message}`); }

  // 3. Fetch All Data & Config
  try {
    const res = await fetch(`${BASE_URL}/all-data`);
    const data = await res.json();
    assert(res.ok && data.settings && data.presets, "Data: Mengambil seluruh menu dan pengaturan toko");
  } catch (err) { assert(false, `Fetch all data gagal: ${err.message}`); }

  // 4. Upload File Base64
  try {
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: "v2-test.png", data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" })
    });
    const data = await res.json();
    assert(res.ok && typeof data.url === 'string', "File: Upload gambar berhasil mengembalikan URL statis");
  } catch (err) { assert(false, `Upload gagal: ${err.message}`); }

  // 5. CRUD: Create Order
  const orderId = `V2-TEST-${Date.now()}`;
  let createdOrder;
  try {
    const newOrder = {
      id: orderId,
      queueNumber: "V2",
      customerName: "Tester V2",
      orderType: "take_away",
      items: [{
        name: "Seblak V2", type: "custom", brothName: "Original", level: 5,
        pricePerUnit: 15000, quantity: 1, notes: "Pedas gila",
        toppings: [{ id: "t_bakso_sapi", name: "Bakso Sapi (3 pcs)", quantity: 7, price: 8000 }]
      }],
      totalPrice: 20000,
      paymentMethod: "Tunai",
      status: "pending_payment",
      createdAt: new Date().toISOString()
    };
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    createdOrder = await res.json();
    assert(res.ok && createdOrder.id === orderId, "Order: Pembuatan pesanan baru (takeaway) sukses tersimpan");
  } catch (err) { assert(false, `Create Order gagal: ${err.message}`); }

  // 6. CRUD: Get Orders
  try {
    const res = await fetch(`${BASE_URL}/orders`);
    const data = await res.json();
    const found = data.find(o => o.id === orderId);
    assert(res.ok && found !== undefined, "Order: Daftar pesanan berhasil dimuat dan pesanan baru ditemukan");
  } catch (err) { assert(false, `Get Orders gagal: ${err.message}`); }

  // 7. CRUD: Update Order (Transisi Status)
  try {
    const updatePayload = { ...createdOrder, status: "paid", paymentMethod: "QRIS", paidAt: new Date().toISOString() };
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const updated = await res.json();
    assert(res.ok && updated.status === 'paid', "Order: Update status pesanan menjadi lunas (paid) berhasil");
  } catch (err) { assert(false, `Update Order gagal: ${err.message}`); }

  // 8. Zod Validation (Negative Test)
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: "INVALID", customerName: "" }) // Sengaja disalahkan formatnya
    });
    assert(res.status === 400, "Validasi: Zod berhasil memblokir input pesanan yang cacat (400 Bad Request)");
  } catch (err) { assert(false, `Validasi Zod gagal: ${err.message}`); }

  // 9. CRUD: Delete Order
  try {
    const res = await fetch(`${BASE_URL}/orders/${orderId}`, { method: 'DELETE' });
    assert(res.ok, "Order: Penghapusan pesanan berhasil dilakukan (Clean up)");
  } catch (err) { assert(false, `Delete Order gagal: ${err.message}`); }

  // 10. Database Reset Proteksi (Tanpa PIN)
  try {
    const res = await fetch(`${BASE_URL}/reset`, { method: 'POST', headers: { 'Content-Type': 'application/json' }});
    assert(res.status === 401, "Sistem: Reset database ditolak jika tanpa header PIN (Proteksi aman)");
  } catch (err) { assert(false, `Reset proteksi gagal: ${err.message}`); }

  // 11. Database Reset (Skenario Penuh)
  try {
    const res = await fetch(`${BASE_URL}/reset`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', 'x-admin-pin': ADMIN_PIN }
    });
    assert(res.ok, "Sistem: Reset database berhasil dilakukan menggunakan PIN yang valid");
  } catch (err) { assert(false, `Reset DB gagal: ${err.message}`); }

  console.log("\n==================================================");
  console.log(`📊 RINGKASAN TEST V2 (ALL FEATURES):`);
  console.log(`   ✅ Lulus (Passed) : ${passed}`);
  console.log(`   ❌ Gagal (Failed) : ${failed}`);
  if (failed === 0) console.log("🏆 SUPER SUKSES: Aplikasi siap untuk UAS! Semua integrasi aman terkendali.");
  console.log("==================================================");
}

runTestV2();
