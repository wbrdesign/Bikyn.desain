import { Service, StudioConfig } from '../types';

export const DEFAULT_CONFIG: StudioConfig = {
  brandName: 'Bikyn.Desain',
  subBrand: 'Percetakan & Desain Rumahan',
  heroTitle: 'Rumah Kreatif untuk Jasa Desain dan Cetak',
  heroSubtitle: 'Mulai dari kebutuhan tugas harian, media branding usaha UMKM, foto kenangan estetik, undangan acara keluarga, hingga jasa desain grafis dan CV profesional.',
  whatsappNumber: '6285712345678',
  whatsappDisplayNumber: '0857-1234-5678',
  adminName: 'Admin Bikyn Desain',
  email: 'otakatikide01@gmail.com',
  instagram: '@bikyndesain',
  tiktok: '@bikyndesain',
  address: 'Studio Rumahan Bikyn Desain (Menerima Order Online & Siap Kirim / Ambil di Tempat)',
  hoursWeekday: 'Senin - Sabtu: 08.00 - 21.00 WIB',
  hoursWeekend: 'Minggu: Konsultasi Online',
};

export const DEFAULT_SERVICES: Service[] = [
  // --- KATEGORI 1: PRINT & DOKUMEN (4) ---
  {
    id: 'print-hp-warna',
    title: 'PRINT HITAM-PUTIH / WARNA',
    category: 'Dokumen',
    categoryLabel: 'Dokumen',
    minOrder: '1 lembar',
    description: 'Cetak dokumen tugas, skripsi, modul, dan laporan dengan tinta tajam dan anti pudar.',
    price: 'Mulai Rp 500 / lbr',
    priceUnit: 'lbr',
    duration: '10 - 30 menit',
    svgMockupType: 'document',
    specifications: [
      'Pilihan kertas: HVS 70gr, HVS 80gr, Bookpaper, Kertas Buffalo',
      'Format file yang didukung: PDF, DOCX, PPTX, JPG, PNG',
      'Pilihan cetak 1 sisi atau bolak-balik (duplex)',
      'Tinta pigment tajam, tidak luntur bila terkena cipratan air',
      'Bisa dijilid langsung (jilid lakban, spiral kawat, atau softcover)'
    ],
    paperOptions: ['HVS 70gr', 'HVS 80gr', 'HVS 100gr', 'Bookpaper 72gr']
  },
  {
    id: 'fotokopi',
    title: 'FOTOKOPI',
    category: 'Dokumen',
    categoryLabel: 'Dokumen',
    minOrder: '1 lembar',
    description: 'Fotokopi bersih, pekat merata, untuk berkas arsip, KTP, KK, dan buku pelajaran.',
    price: 'Mulai Rp 300 / lbr',
    priceUnit: 'lbr',
    duration: 'Langsung jadi',
    svgMockupType: 'photocopy',
    specifications: [
      'Mesin digital copier kecepatan tinggi & hasil pekat merata',
      'Tersedia fotokopi KTP / SIM 1 lembar isi banyak (multi-up)',
      'Kertas HVS 70gr & 80gr standar instansi / kampus',
      'Bisa fotokopi bolak-balik tanpa tembus pandang',
      'Diskon spesial untuk fotokopi modul dalam jumlah besar'
    ],
    paperOptions: ['HVS 70gr Standar', 'HVS 80gr Tebal']
  },
  {
    id: 'laminating-dokumen',
    title: 'LAMINATING DOKUMEN',
    category: 'Dokumen',
    categoryLabel: 'Dokumen',
    minOrder: '1 lembar',
    description: 'Lapisan plastik laminasi panas tebal melindungi berkas penting dari basah dan debu.',
    price: 'Mulai Rp 3.000 / lbr',
    priceUnit: 'lbr',
    duration: '5 menit / lembar',
    svgMockupType: 'laminating',
    specifications: [
      'Plastik laminating tebal 100 - 150 mikron glossy jernih',
      'Proses pemanasan optimal (anti gelembung & anti kerut)',
      'Ukuran KTP, Kartu Member, A4, F4 hingga A3',
      'Waterproof 100%, melindungi dari rayap dan noda cairan',
      'Dipotong rapi dengan sudut melengkung aman (rounded corner)'
    ],
    paperOptions: ['Ukuran KTP/ID', 'Ukuran A4', 'Ukuran F4/Folio', 'Ukuran A3']
  },
  {
    id: 'jasa-ketik',
    title: 'JASA KETIK',
    category: 'Dokumen',
    categoryLabel: 'Dokumen',
    minOrder: '1 halaman',
    description: 'Pengetikan rapi naskah, makalah, tugas, tabel, skripsi dari foto atau tulisan tangan.',
    price: 'Mulai Rp 3.500 / lbr',
    priceUnit: 'lbr',
    duration: 'Sesuai jumlah halaman',
    svgMockupType: 'typing',
    specifications: [
      'Format standar kampus/kantor (Times New Roman, Arial, Margin 4-4-3-3)',
      'Bisa ketik tabel kompleks, rumus matematika, atau spreadsheet Excel',
      'Koreksi typo dan tanda baca dasar secara teliti',
      'File dikirim via WhatsApp / Email dalam bentuk Word & PDF',
      'Privasi dokumen dijamin aman 100%'
    ],
    paperOptions: ['Format Word (.docx)', 'Format PDF Siap Cetak', 'Paket Print + Jilid']
  },

  // --- KATEGORI 2: PROMOSI & BISNIS UMKM (6) ---
  {
    id: 'cetak-banner',
    title: 'CETAK BANNER',
    category: 'Promosi',
    categoryLabel: 'Promosi',
    minOrder: '1 meter persegi',
    description: 'Banner outdoor / spanduk jualan, warung, seminar, dan acara wisuda bahan tebal.',
    price: 'Mulai Rp 20.000 / m²',
    priceUnit: 'm²',
    duration: '1 - 2 hari kerja',
    svgMockupType: 'banner',
    specifications: [
      'Bahan Flexi China 280gr, Flexi Korchin 380gr tebal, atau Flexi Jerman',
      'Resolusi cetak High-Resolution outdoor tahan panas & hujan',
      'Finishing gratis: Mata ayam (ring besi) di setiap sudut, selongsong, atau lebihan putih',
      'Bisa pesan X-Banner, Y-Banner, atau Roll-Up Banner lengkap dengan stand',
      'Bantuan penyesuaian ukuran gratis bila file sudah ada'
    ],
    paperOptions: ['Flexi Standard 280gr', 'Flexi Medium 340gr', 'Flexi Korchin 380gr (Tebal)']
  },
  {
    id: 'cetak-brosur',
    title: 'CETAK BROSUR',
    category: 'Promosi',
    categoryLabel: 'Promosi',
    minOrder: '50 lembar',
    description: 'Brosur & flyer promosi bisnis, cafe, bimbel, properti dengan warna cerah memikat.',
    price: 'Mulai Rp 800 / lbr',
    priceUnit: 'lbr',
    duration: '1 - 2 hari kerja',
    svgMockupType: 'brochure',
    specifications: [
      'Bahan Art Paper 120gr / 150gr atau HVS 80gr full color',
      'Ukuran A5 (15x21 cm), A4 (21x29.7 cm), atau lipat 3 (trifold)',
      'Warna cerah, cetakan tajam dengan mesin digital printing mutakhir',
      'Pilihan laminasi doff / glossy untuk tampilan ekstra mewah',
      'Cocok untuk dibagikan saat pameran, event, atau promosi ruko'
    ],
    paperOptions: ['Art Paper 120gr', 'Art Paper 150gr', 'HVS 80gr']
  },
  {
    id: 'cetak-daftar-menu',
    title: 'CETAK DAFTAR MENU',
    category: 'Promosi',
    categoryLabel: 'Promosi',
    minOrder: '2 lembar',
    description: 'Buku menu cafe, kedai kopi, dan resto tahan air, anti minyak, dan awet dipegang.',
    price: 'Mulai Rp 10.000 / lbr',
    priceUnit: 'lbr',
    duration: '1 - 3 hari',
    svgMockupType: 'menu',
    specifications: [
      'Bahan Art Carton tebal 260gr / 310gr + Laminasi Hard Doff/Glossy',
      'Tahan tumpahan air, saus, kopi, dan mudah dilap bersih',
      'Pilihan model: Lembaran laminasi, Lipat 2, Lipat 3, atau Jilid Ring Spiral',
      'Bisa dilapisi papan kayu / akrilik (opsional)',
      'Warna makanan & foto menu tampil menggugah selera'
    ],
    paperOptions: ['Art Carton 260gr + Laminasi', 'Art Carton 310gr Hard Press', 'Model Lipat 3 Trifold']
  },
  {
    id: 'cetak-cutting-sticker',
    title: 'CETAK CUTTING STICKER',
    category: 'Promosi',
    categoryLabel: 'Promosi',
    minOrder: '3 lembar A3+',
    description: 'Stiker logo kemasan makanan, botol minuman, toples kue, siap tempel kiss-cut.',
    price: 'Mulai Rp 8.000 / lbr A3+',
    priceUnit: 'lbr A3+',
    duration: '1 - 2 hari',
    svgMockupType: 'sticker',
    specifications: [
      'Pilihan bahan: Stiker Kromo (ekonomis), Vinyl Putih (tahan air & kulkas), Transparan',
      'Sudah dipotong rapi sesuai pola logo (Kiss-Cut tinggal kopek dan tempel)',
      '1 lembar A3+ bisa memuat puluhan hingga ratusan stiker tergantung ukuran',
      'Tinta tahan luntur, aman untuk produk frozen food dan minuman dingin',
      'Bisa laminasi doff / glossy untuk daya tahan ekstra'
    ],
    paperOptions: ['Stiker Kromo (Glossy Kertas)', 'Stiker Vinyl Waterproof', 'Stiker Transparan']
  },
  {
    id: 'kartu-nama',
    title: 'KARTU NAMA',
    category: 'Promosi',
    categoryLabel: 'Promosi',
    minOrder: '1 box (100 pcs)',
    description: 'Kartu nama bisnis & personal elegan, lengkap dengan kotak mika eksklusif.',
    price: 'Mulai Rp 35.000 / box (100 pcs)',
    priceUnit: 'box',
    duration: '1 - 2 hari',
    svgMockupType: 'namecard',
    specifications: [
      'Bahan Art Carton 260gr / 310gr kokoh & tidak mudah melengkung',
      'Ukuran standar 9 x 5.5 cm atau 9 x 5 cm',
      'Cetak 1 sisi atau 2 sisi bolak-balik full color',
      'Termasuk kotak mika bening tebal pelindung kartu nama',
      'Pilihan finishing sudut membulat (rounded corner) atau laminasi doff/glossy'
    ],
    paperOptions: ['Art Carton 260gr (1 Sisi)', 'Art Carton 260gr (2 Sisi)', 'AC 260gr + Laminasi Doff']
  },
  {
    id: 'nota-custom',
    title: 'NOTA CUSTOM',
    category: 'Promosi',
    categoryLabel: 'Promosi',
    minOrder: '1 paket (mulai 10-40 buku)',
    description: 'Nota kasir berkop logo toko Anda, kertas tembus NCR tanpa karbon hitam.',
    price: 'Mulai Rp 85.000 / rim (40 buku)',
    priceUnit: 'rim',
    duration: '3 - 5 hari kerja',
    svgMockupType: 'receipt',
    specifications: [
      'Kertas NCR berkualitas (tulisan otomatis tembus jelas ke rangkap bawah)',
      'Pilihan rangkap: 1 Ply (tanpa rangkap), 2 Ply (2 rangkap), 3 Ply (3 rangkap)',
      'Ukuran: 1/4 Folio (paling populer), 1/3 Folio, atau 1/2 Folio',
      'Dilengkapi nomor urut faktur (numerator) dan perforasi sobekan rapi',
      'Gratis cantumkan logo toko, alamat, kontak WhatsApp, dan rekening bank'
    ],
    paperOptions: ['1 Ply (Isi 100 lembar)', '2 Ply (Top Putih, Bottom Merah/Kuning)', '3 Ply Komplit']
  },

  // --- KATEGORI 3: FOTO & POLAROID (3) ---
  {
    id: 'cetak-pas-foto',
    title: 'CETAK PAS FOTO',
    category: 'Foto',
    categoryLabel: 'Foto',
    minOrder: '1 paket (isi 8-12 foto)',
    description: 'Pas foto resmi kilat ukuran 2x3, 3x4, 4x6 untuk lamaran, CPNS, buku nikah & ijazah.',
    price: 'Mulai Rp 10.000 / paket',
    priceUnit: 'paket',
    duration: '15 - 30 menit',
    svgMockupType: 'pasphoto',
    specifications: [
      'Kertas foto studio silky/doff (tidak lengket dan sesuai standar kedinasan)',
      'Bisa ganti warna background (Merah, Biru, Putih) secara rapi',
      'Bantuan edit wajah halus, cerah alami tanpa mengubah struktur wajah',
      'Bisa ganti pakaian jas / kemeja putih berdasi (opsional)',
      'Sudah dipotong rapi siap pakai'
    ],
    paperOptions: ['Paket 2x3 (12 pcs)', 'Paket 3x4 (10 pcs)', 'Paket 4x6 (8 pcs)', 'Paket Campur Ukuran']
  },
  {
    id: 'polaroid',
    title: 'POLAROID',
    category: 'Foto',
    categoryLabel: 'Foto',
    minOrder: '25 lembar',
    description: 'Cetak foto ala Polaroid estetik rasio klasik, cocok untuk dekorasi kamar & kado.',
    price: 'Mulai Rp 1.000 / foto (Min. 25 pcs)',
    priceUnit: 'foto',
    duration: '1 hari kerja',
    svgMockupType: 'polaroid',
    specifications: [
      'Kertas Art Carton 260gr tebal dengan cetakan anti luntur',
      'Frame putih rasio Polaroid otentik (bisa request border warna atau motif)',
      'Bisa tambah teks caption pendek di bagian bawah foto',
      'Cocok digantung dengan jepitan kayu dan lampu tumblr',
      'Pilihan finishing glossy mengkilap atau doff estetik'
    ],
    paperOptions: ['Paket 25 Foto', 'Paket 50 Foto + Jepitan Kayu', 'Paket 100 Foto Spesial']
  },
  {
    id: 'cetak-foto-2r',
    title: 'CETAK FOTO 2R ++',
    category: 'Foto',
    categoryLabel: 'Foto',
    minOrder: 'Bebas tanpa minimal',
    description: 'Cetak foto berbagai ukuran dari 2R, 3R, 4R, 5R, hingga 10R++ kualitas studio.',
    price: 'Mulai Rp 1.500 / lbr (sesuai ukuran)',
    priceUnit: 'lbr',
    duration: '1 - 2 hari',
    svgMockupType: 'photo2r',
    specifications: [
      'Kertas foto premium lab gloss / luster tebal',
      'Ukuran lengkap: 2R (6x9 cm), 3R (8.9x12.7 cm), 4R (10.2x15.2 cm), 10R (20x25 cm)',
      'Tinta original 6 warna dengan gradasi warna kulit alami',
      'Tahan hingga puluhan tahun bila dipajang dalam pigura',
      'Bisa sekalian pesan bingkai foto minimalis'
    ],
    paperOptions: ['Ukuran 2R Mini', 'Ukuran 3R Standar', 'Ukuran 4R Album', 'Ukuran 10R Bingkai']
  },

  // --- KATEGORI 4: UNDANGAN & ACARA (4) ---
  {
    id: 'undangan-tahlil-walimah',
    title: 'UNDANGAN TAHLIL / WALIMAH',
    category: 'Undangan',
    categoryLabel: 'Undangan',
    minOrder: '50 lembar',
    description: 'Undangan tahlilan, kirim doa, syukuran rumah, dan walimatul khitan/nikah praktis.',
    price: 'Mulai Rp 500 / lbr',
    priceUnit: 'lbr',
    duration: '1 hari kerja',
    svgMockupType: 'invitation',
    specifications: [
      'Kertas HVS 70gr atau 80gr, ukuran 1/2 Folio (F4 potong 2)',
      'Pilihan cetak hitam-putih pekat atau berbingkai warna islami',
      'Sudah dilipat rapi siap sebar',
      'Format teks acara, nama almarhum/keluarga, waktu & tempat tinggal diisi',
      'Proses kilat bisa ditunggu jika naskah sudah siap'
    ],
    paperOptions: ['Kertas HVS 70gr (Hitam Putih)', 'Kertas HVS 80gr (Tinta Hijau/Warna)', 'Kertas Berwarna']
  },
  {
    id: 'undangan-blanko',
    title: 'UNDANGAN BLANKO',
    category: 'Undangan',
    categoryLabel: 'Undangan',
    minOrder: '100 pcs',
    description: 'Undangan pernikahan motif pabrik bertekstur foil emas elegan dengan harga sangat hemat.',
    price: 'Mulai Rp 1.500 / pcs',
    priceUnit: 'pcs',
    duration: '3 - 5 hari kerja',
    svgMockupType: 'blanko',
    specifications: [
      'Bahan karton bermotif pabrikan dengan sentuhan poly emas (foil hotprint)',
      'Tersedia ratusan katalog motif (vintage, floral, modern minimalis, adat)',
      'Sudah termasuk cetak isi teks, denah lokasi, dan barcode Google Maps',
      'Bonus gratis: Plastik OPP pelindung & label stiker nama tamu',
      'Pengerjaan rapi dan teliti bergaransi'
    ],
    paperOptions: ['Motif Minimalis Modern', 'Motif Foil Emas Mewah', 'Motif Floral Rustic']
  },
  {
    id: 'undangan-ultah',
    title: 'UNDANGAN ULTAH',
    category: 'Undangan',
    categoryLabel: 'Undangan',
    minOrder: '30 pcs',
    description: 'Undangan ulang tahun anak dan remaja dengan tema karakter kartun favorit full color.',
    price: 'Mulai Rp 1.500 / pcs',
    priceUnit: 'pcs',
    duration: '1 - 2 hari',
    svgMockupType: 'birthday',
    specifications: [
      'Bahan Art Carton 260gr tebal glossy memikat',
      'Bisa pakai foto anak yang berulang tahun',
      'Tema bebas request: Disney, Superhero, Anime, Dinosaurus, Princess, dll.',
      'Sudah termasuk plastik pembungkus bening',
      'Ukuran praktis 10 x 14 cm pas untuk teman sekolah'
    ],
    paperOptions: ['Tema Karakter Kartun', 'Tema Custom Foto Anak', 'Ukuran 10x14 cm Glossy']
  },
  {
    id: 'cetak-sertifikat-piagam',
    title: 'CETAK SERTIFIKAT / PIAGAM',
    category: 'Undangan',
    categoryLabel: 'Undangan',
    minOrder: '5 lembar',
    description: 'Piagam penghargaan lomba, sertifikat seminar, webinar, pelatihan kertas mewah.',
    price: 'Mulai Rp 4.000 / lbr',
    priceUnit: 'lbr',
    duration: '1 hari kerja',
    svgMockupType: 'certificate',
    specifications: [
      'Bahan kertas mewah: Linen bertekstur serat, Concorde, atau Jasmine glitter mutiara',
      'Ukuran standar A4 (21 x 29.7 cm)',
      'Bisa cetak nama peserta secara otomatis (mail-merge dari data Excel)',
      'Warna cerah, logo instansi tampil tajam dan resmi',
      'Bisa dipadukan dengan map piagam batik / embos (opsional)'
    ],
    paperOptions: ['Kertas Linen Bertekstur', 'Kertas Jasmine Glitter', 'Kertas Concorde Tebal']
  },

  // --- KATEGORI 5: JASA DESAIN & DIGITAL (3) ---
  {
    id: 'jasa-pembuatan-desain',
    title: 'JASA PEMBUATAN DESAIN',
    category: 'Digital',
    categoryLabel: 'Digital',
    minOrder: '1 konsep desain',
    description: 'Desain grafis kustom untuk logo, banner, spanduk, feed medsos, kemasan & brosur.',
    price: 'Mulai Rp 25.000 / desain',
    priceUnit: 'desain',
    duration: '1 - 2 hari kerja',
    svgMockupType: 'design',
    specifications: [
      'Dikerjakan oleh desainer berpengalaman dengan software profesional (AI, CDR, Photoshop)',
      'Mendapatkan file mentah beresolusi tinggi (PDF vector, PNG transparan, JPG)',
      'Revisi minor gratis hingga 3x sampai cocok',
      'Komunikasi konsultasi ramah & responsif via WhatsApp',
      'Bisa langsung sekalian dicetak di studio kami'
    ],
    paperOptions: ['Desain Banner / Spanduk', 'Desain Logo UMKM', 'Desain Label Kemasan', 'Desain Feed / Story Medsos']
  },
  {
    id: 'jasa-pembuatan-cv',
    title: 'JASA PEMBUATAN CV',
    category: 'Digital',
    categoryLabel: 'Digital',
    minOrder: '1 CV',
    description: 'Pembuatan CV ATS-friendly & CV kreatif memikat untuk melamar kerja dan magang.',
    price: 'Mulai Rp 30.000 / CV',
    priceUnit: 'CV',
    duration: '1 - 24 jam',
    svgMockupType: 'cv',
    specifications: [
      'Pilihan gaya: ATS-Friendly (lolos scan sistem rekrutmen) atau Creative Visual',
      'Optimasi kata kunci (keywords) sesuai posisi kerja yang dituju',
      'Termasuk penataan riwayat pendidikan, pengalaman kerja, skill, dan sertifikat',
      'Diberikan format PDF high-quality siap kirim email dan file Word yang dapat diedit',
      'Bonus template surat lamaran kerja (Cover Letter) profesional'
    ],
    paperOptions: ['CV Format ATS Modern', 'CV Desain Kreatif / Visual', 'Paket Lengkap CV + Cover Letter']
  },
  {
    id: 'jasa-pembuatan-email',
    title: 'JASA PEMBUATAN EMAIL',
    category: 'Digital',
    categoryLabel: 'Digital',
    minOrder: '1 akun',
    description: 'Bantuan pendaftaran & konfigurasi akun email Gmail resmi, nama profesional & aman.',
    price: 'Mulai Rp 15.000 / akun',
    priceUnit: 'akun',
    duration: '15 - 30 menit',
    svgMockupType: 'email',
    specifications: [
      'Pembuatan alamat email nama formal/bisnis (bukan nama alay) untuk lamaran kerja',
      'Pengaturan nomor pemulihan & verifikasi 2 langkah agar akun aman dari hack',
      'Konfigurasi foto profil, tanda tangan email otomatis, dan bio singkat',
      'Password diserahkan sepenuhnya ke pemilik dan dipandu login sampai berhasil',
      'Panduan cara kirim email lamaran kerja yang baik dan benar'
    ],
    paperOptions: ['Akun Gmail Baru', 'Pemulihan / Reset Akun', 'Setup Email Profesional']
  }
];
