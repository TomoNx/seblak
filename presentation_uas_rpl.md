# Presentasi UAS Rekayasa Perangkat Lunak (RPL)
**Aplikasi:** Sistem Point of Sales (POS) & Self-Service Kiosk "Seblak Jeletet Murni"

---

## 📌 Slide 1: Judul & Anggota Kelompok
**Judul Proyek:** Pengembangan Sistem Point of Sales (POS) dan Self-Service Kiosk Terintegrasi Berbasis Web (Studi Kasus: Seblak Jeletet Murni)  
**Anggota Kelompok:**
1. Dhimas
2. Diandra

---

## 📌 Slide 2: Pendahuluan
Bisnis kuliner masa kini, khususnya kedai seblak yang memiliki sistem "prasmanan" atau *custom* pesanan (pemilihan kuah, level pedas, dan berbagai macam topping), seringkali menghadapi kendala jika masih menggunakan pencatatan manual:
- **Antrean Panjang & Kesalahan Pencatatan:** Pelanggan sering salah hitung harga prasmanannya sendiri, atau kasir salah mencatat topping yang diminta.
- **Keterbatasan Layanan:** Saat jam sibuk, kasir kewalahan melayani pencatatan pemesanan sekaligus penghitungan pembayaran secara bersamaan.
- **Manajemen Data yang Buruk:** Sulit untuk merekap laporan penjualan, mengelola ketersediaan topping, dan sering terjadi selisih harga penjualan.

---

## 📌 Slide 3: Tujuan
Untuk mengatasi permasalahan pada pendahuluan, proyek ini memiliki beberapa tujuan utama:
1. **Digitalisasi Pemesanan:** Membangun antarmuka *Self-Service Kiosk* agar pelanggan dapat memesan dan merakit seblaknya sendiri secara mandiri tanpa harus antre menyebutkan pesanan di kasir.
2. **Otomatisasi Kasir:** Membangun *Dashboard Admin/Kasir* yang aman untuk mengelola antrean pesanan, konfirmasi pembayaran, dan sinkronisasi harga secara otomatis.
3. **Integritas Data:** Menjamin ketersediaan data stok topping, histori pesanan, dan menu melalui sistem database terpusat yang aman dari kehilangan data.

---

## 📌 Slide 4: Metode Pengembangan (SDLC Waterfall)
Pengembangan aplikasi ini menggunakan metode terstruktur **SDLC Waterfall** dengan tahapan:
1. **Requirement Analysis:** Spesifikasi fitur *Kiosk* pelanggan dan *Dashboard* Admin (termasuk kebutuhan proteksi PIN).
2. **System Design:** Pembuatan desain UI/UX responsif bergaya *glassmorphism* dan perancangan skema relasional Database MySQL.
3. **Implementation:** *Coding* menggunakan arsitektur *Client-Server* (React.js untuk antarmuka pengguna & Node.js/Express.js untuk logika *Backend* API).
4. **Testing:** Melakukan *Blackbox Testing* terotomatisasi dengan 11 skenario uji coba (100% *Pass*) dan *Zod Validation* untuk menyaring data cacat.
5. **Deployment & Maintenance:** Kompilasi aset program (*build*) dan penyediaan fitur pembersihan/reset database (`npm run db:clear` & `db:seed`) untuk manajemen operasional warung harian.

---

## 📌 Slide 5: Metode Pemodelan Sistem (UML)
Sebagai bagian dari metode perancangan sistem, digunakan pemodelan UML:

**A. Use Case Diagram:**
*   **Pelanggan:** Dapat memilih menu & topping, membuat pesanan melalui Kiosk, serta melihat struk & kode bayar QRIS.
*   **Admin/Kasir:** Dapat melihat antrean pesanan, merubah status pesanan menjadi lunas, mengelola menu, dan melakukan reset database.

**B. Entity Relationship Diagram (ERD):**
Data pesanan disimpan menggunakan skema relasional MySQL untuk mencegah anomali data:
*   Tabel `ORDERS` terhubung secara *One-to-Many* ke `ORDER_ITEMS`.
*   Tabel `ORDER_ITEMS` memiliki rincian topping di tabel `ORDER_ITEM_TOPPINGS`.
*   Tabel `TOPPINGS` memiliki relasi referensi ke tabel `TOPPING_CATEGORIES`.

---

## 📌 Slide 6: Fitur-fitur Utama
Sistem ini terbagi menjadi 2 modul antarmuka utama dengan fitur-fitur unggulan:

**1. Kiosk Pelanggan (Self-Service):**
- **Customisasi Prasmanan Bebas:** Fitur untuk leluasa memilih kuah, tingkat kepedasan (level 0-10), dan merakit puluhan varian topping satuan.
- **Kalkulasi Harga Real-Time:** Total tagihan akan terhitung dan berubah secara otomatis setiap kali pelanggan menambah/mengurangi topping dari keranjang.
- **Struk Digital & Pembayaran:** Menampilkan struk rincian pesanan beserta nomor antrean dan integrasi *mockup* pembayaran QRIS.

**2. Dashboard Admin / Kasir:**
- **Sistem Keamanan PIN:** Akses masuk ke dashboard dan aksi-aksi sensitif (seperti menghapus menu) dilindungi oleh *Admin PIN*.
- **Live Order Queue:** Daftar antrean pesanan masuk yang ter-update secara *real-time*.
- **Manajemen Menu:** Fitur untuk mengelola (mengubah harga, ketersediaan stok, nama) untuk aneka topping, minuman, dan menu paket.
- **Database Tools:** Fitur untuk menghapus seluruh riwayat pesanan ketika warung tutup (Sapu Bersih) agar siap digunakan untuk keesokan harinya.

---

## 📌 Slide 7: Kesimpulan
Aplikasi **Seblak Jeletet Murni** berhasil dibangun sebagai solusi digital terintegrasi yang andal untuk memodernisasi operasional warung seblak. 

Penggunaan metode SDLC Waterfall dan arsitektur *React - Express - MySQL* membuktikan bahwa sistem ini mampu menangani relasi data yang rumit (variasi kuah, level pedas, & hitungan topping satuan) dengan sangat akurat. Hadirnya fungsionalitas Kiosk dan Admin yang telah lulus uji ketat (*Blackbox Testing* 100%) menjadikan aplikasi ini kebal dari *error input*, stabil, aman, dan **sangat layak untuk diimplementasikan** di dunia nyata.

---
**Terima Kasih**
*Ada Pertanyaan?*
