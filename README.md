# Bikyn Desain & Percetakan 🖨️🎨

Website katalog modern untuk studio cetak & desain kreatif rumahan dengan kalkulator rincian pesanan terhubung langsung ke WhatsApp, dilengkapi **CMS (Content Management System)** ringan untuk update foto & konten, serta tata letak responsif dinamis (3 kolom di mobile).

---

## 🎨 Palet Branding

- **Putih Clean** (`#ffffff` & `zinc-50`): Kanvas utama yang bersih, modern, dan rapi.
- **Oranye Enerjik** (`#ea580c` / `#f97316`): Aksen penegas untuk harga, sorotan tombol, dan status aktif.
- **Hitam & Deep Charcoal** (`#09090b` / `#18181b`): Tipografi tajam berkontras tinggi, kartu kontras, dan footer elegan.

---

## 📱 Fitur Utama

1. **3 Kolom Khusus Tampilan Mobile (Mobile-Friendly)**
   - Di smartphone / HP, grid layanan ditata otomatis dalam **3 kolom rapat (`grid-cols-3`)**.
   - Menghindari scroll ke bawah yang terlalu panjang, sehingga pengunjung dapat melihat ragam layanan dengan cepat.
   - Di PC / Desktop, tampil fleksibel 4 hingga 5 kolom sesuai ukuran layar.

2. **Kalkulator & Simulator Pesanan Langsung ke WhatsApp**
   - Pilih layanan dari dropdown atau klik tombol `+ Hitung` pada kartu layanan mana saja.
   - Isi estimasi jumlah/ukuran dan status kesiapan file desain.
   - Pratinjau draf pesan WhatsApp real-time di kotak chat gelap dengan tombol **Salin Teks** dan tombol **Kirim Format Ini ke WhatsApp**.

3. **Agen AI Konsultan Cetak (100% Free / Gratis)**
   - Didukung model **Gemini Flash** berkecepatan tinggi via endpoint server aman (`/api/ai/consult`).
   - Membantu calon pelanggan memilih jenis kertas (misal: perbedaan Art Paper vs Art Carton, vinyl waterproof, NCR), ukuran dokumen/banner, dan rekomendasi hemat.
   - Menghasilkan rekomendasi layanan otomatis yang bisa **langsung diklik** untuk dimasukkan ke formulir WhatsApp.
   - **Fitur AI di CMS:** Admin dapat menekan tombol **"Buat Konten dengan AI"** untuk otomatis menyusun judul, deskripsi persuasif, spesifikasi teknis, dan varian kertas.

4. **Integrasi CMS Ringan (Manajemen Konten & Foto)**
   - Buka via tombol **Admin CMS** di navigasi atas atau floating button di sudut kanan bawah.
   - **Update Foto Layanan:** Bisa upload langsung file foto dari perangkat (otomatis tersimpan) atau masukkan link URL foto.
   - **Edit Data Layanan:** Ubah nama layanan, kategori, harga, minimal order, estimasi waktu, deskripsi, dan pilihan kertas.
   - **Tambah & Hapus Layanan:** Fleksibel menambah promo atau menghapus layanan lama.
   - **Update Profil & Kontak:** Sesuaikan nomor WhatsApp, nama admin, jam operasional, email, dan medsos.
   - **Backup & Restore JSON:** Download file konfigurasi JSON untuk disimpan atau di-commit ke repositori GitHub.

---

## 🚀 Panduan Deploy ke GitHub & Vercel

Proyek ini dibangun menggunakan standar **Vite + React + TypeScript + Tailwind CSS**, siap pakai untuk hosting di Vercel:

### 1. Jalankan di Komputer Lokal
```bash
# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Build untuk produksi
npm run build
```

### 2. Push ke GitHub
```bash
git init
git add .
git commit -m "feat: inisialisasi website bikyn desain"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

### 3. Deploy ke Vercel
1. Masuk ke [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **Add New Project** lalu pilih repositori GitHub proyek ini.
3. Vercel akan otomatis mendeteksi framework **Vite**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. *(Opsional untuk fitur AI Admin Elena)* Di menu **Environment Variables**, tambahkan:
   - Name: `GEMINI_API_KEY`
   - Value: *(API Key Gemini Anda dari Google AI Studio)*
   > **Catatan:** Jika tanpa API Key, Admin Elena tetap bekerja secara cerdas menggunakan basis pengetahuan fallback profil studio resmi yang sudah tertanam di sistem.
5. Klik **Deploy** dan website Anda langsung online dalam hitungan detik!

---

## 📂 Struktur File

```
├── index.html                  # Entry point HTML dengan font Plus Jakarta Sans
├── vercel.json                 # Konfigurasi rewrite SPA untuk Vercel
├── package.json                # Skrip dan dependensi Vite, React, Tailwind, Lucide
├── src/
│   ├── types.ts                # TypeScript interfaces (Service, StudioConfig, dll)
│   ├── data/
│   │   └── defaultData.ts      # 20 data layanan lengkap bawaan sesuai lampiran
│   ├── components/
│   │   ├── Navbar.tsx          # Header 3-zone clean top bar
│   │   ├── ServiceCard.tsx     # Kartu layanan adaptif (3 kolom mobile & multi-kolom PC)
│   │   ├── ServiceMockup.tsx   # Render mockup SVG vektor & penampil foto kustom
│   │   ├── ServiceDetailModal.tsx # Modal rincian spesifikasi lengkap
│   │   ├── WhatsAppCalculator.tsx # Simulasi form pesanan & live WhatsApp preview
│   │   ├── CMSModal.tsx        # Panel CMS untuk edit foto, teks & ekspor JSON
│   │   └── Footer.tsx          # Footer hitam pekat dengan jam buka & kontak
│   ├── App.tsx                 # Komponen utama dengan filter, pencarian, & state
│   ├── index.css               # Setup Tailwind CSS & styling kustom
│   └── main.tsx                # Bootstrap React 19
```
