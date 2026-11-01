import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, services, studioConfig } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    }

    const brandName = studioConfig?.brandName || 'Bikyn Desain';
    const subBrand = studioConfig?.subBrand || 'Percetakan & Desain Rumahan';
    const address = studioConfig?.address || 'Studio Rumahan Bikyn Desain (Menerima Order Online & Siap Kirim / Ambil di Tempat)';
    const hoursWeekday = studioConfig?.hoursWeekday || 'Senin - Sabtu: 08.00 - 21.00 WIB';
    const hoursWeekend = studioConfig?.hoursWeekend || 'Minggu: Konsultasi Online';
    const phone = studioConfig?.whatsappDisplayNumber || studioConfig?.whatsappNumber || '0857-1234-5678';
    const admin = studioConfig?.adminName || 'Admin Bikyn Desain';
    const email = studioConfig?.email || 'otakatikide01@gmail.com';
    const instagram = studioConfig?.instagram || '@bikyndesain';
    const tiktok = studioConfig?.tiktok || '@bikyndesain';

    const servicesListText = Array.isArray(services)
      ? services
          .map(
            (s: any) =>
              `- ID: ${s.id} | ${s.title} (${s.price}) | Kategori: ${s.category} | Min: ${s.minOrder} | Waktu: ${s.duration} | Ket: ${s.description}${s.paperOptions ? ` | Pilihan: ${s.paperOptions.join(', ')}` : ''}`
          )
          .join('\n')
      : '';

    const systemInstruction = `Kamu adalah "Admin Elena", konsultan cetak & desain resmi dari ${brandName} (${subBrand}).
Tugasmu:
1. Menjawab pertanyaan pelanggan seputar profil studio, alamat, kontak WhatsApp, jam operasional, dan info toko berdasarkan DATA PROFIL RESMI di bawah.
2. Membantu pelanggan menentukan jenis kertas/bahan yang tepat (contoh: HVS 70/80gr untuk dokumen arsip/skripsi, Art Paper 120/150gr untuk brosur/flyer, Art Carton 260/310gr untuk kartu nama & cover menu, Flexi 280/380gr untuk spanduk outdoor, Vinyl waterproof untuk stiker frozen food/minuman, Kromo untuk stiker kering, kertas NCR untuk nota tanpa karbon).
3. Menjelaskan perkiraan ukuran (misal Pas Foto 2x3, 3x4, 4x6, Polaroid, Banner 2x1 meter, Brosur A5/A4, Nota 1/4 Folio).
4. Memberikan rekomendasi layanan yang paling cocok dari katalog studio kami.
5. Gaya bicara: Ramah, bersahabat, solutif, ringkas, profesional, berbahasa Indonesia sopan dan antusias. Kenalkan dirimu sebagai Admin Elena jika pelanggan menyapa.
6. PENTING: Jika ada layanan dari katalog yang cocok dengan kebutuhan user, sertakan tag persis seperti ini di akhir jawaban: [REKOMENDASI: id_layanan] (gunakan id_layanan yang sesuai dari daftar di bawah).

DATA PROFIL RESMI STUDIO:
- Nama Brand: ${brandName}
- Tagline: ${subBrand}
- Alamat Studio / Lokasi: ${address}
- Jam Operasional: ${hoursWeekday} | ${hoursWeekend}
- WhatsApp Resmi: ${phone} (Admin: ${admin})
- Email: ${email}
- Instagram: ${instagram}
- TikTok: ${tiktok}

DAFTAR KATALOG LAYANAN STUDIO ${brandName.toUpperCase()}:
${servicesListText}`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'model') {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let replyText = '';
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          replyText = response.text;
          break;
        }
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} returned error, trying fallback...`, modelErr.message || modelErr.status);
      }
    }

    if (!replyText) {
      replyText = getSmartProfileFallback(message, studioConfig, services);
    }

    let recommendedServiceId: string | null = null;
    const match = replyText.match(/\[REKOMENDASI:\s*([a-zA-Z0-9_-]+)\]/i);
    if (match && match[1]) {
      recommendedServiceId = match[1].trim();
    }

    const cleanReply = replyText.replace(/\[REKOMENDASI:\s*([a-zA-Z0-9_-]+)\]/gi, '').trim();

    return res.status(200).json({
      reply: cleanReply,
      recommendedServiceId: recommendedServiceId,
    });
  } catch (error: any) {
    console.error('Error in Vercel API consult:', error);
    const fallback = getSmartProfileFallback(req.body?.message || '', req.body?.studioConfig, req.body?.services);
    let recId: string | null = null;
    const match = fallback.match(/\[REKOMENDASI:\s*([a-zA-Z0-9_-]+)\]/i);
    if (match && match[1]) {
      recId = match[1].trim();
    }
    const cleanFallback = fallback.replace(/\[REKOMENDASI:\s*([a-zA-Z0-9_-]+)\]/gi, '').trim();

    return res.status(200).json({
      reply: cleanFallback,
      recommendedServiceId: recId,
    });
  }
}

function getSmartProfileFallback(query: string, studioConfig: any, _services: any[] = []): string {
  const q = (query || '').toLowerCase();
  const brandName = studioConfig?.brandName || 'Bikyn Desain';
  const address = studioConfig?.address || 'Studio Rumahan Bikyn Desain (Menerima Order Online & Siap Kirim / Ambil di Tempat)';
  const hoursWeekday = studioConfig?.hoursWeekday || 'Senin - Sabtu: 08.00 - 21.00 WIB';
  const hoursWeekend = studioConfig?.hoursWeekend || 'Minggu: Konsultasi Online';
  const phone = studioConfig?.whatsappDisplayNumber || studioConfig?.whatsappNumber || '0857-1234-5678';
  const admin = studioConfig?.adminName || 'Admin Bikyn Desain';

  // Khusus Pertanyaan Logo & Jasa Desain
  if (q.includes('logo') || q.includes('bisa buat logo') || q.includes('bikin logo') || q.includes('desain logo') || q.includes('buat logo')) {
    return `Bisa banget! Di **${brandName}**, kami melayani **Jasa Pembuatan Desain Logo Kustom** untuk UMKM, toko online, produk kuliner, hingga brand pribadi dengan rincian lengkap berikut:\n\n• **Biaya:** Mulai Rp 25.000 / konsep desain\n• **Waktu Pengerjaan:** Cepat, 1 - 2 hari kerja\n• **File yang Anda Dapatkan:** Format lengkap master siap pakai (PNG transparan tanpa background, JPG resolusi tinggi, dan file PDF vector siap cetak)\n• **Fasilitas:** Gratis konsultasi & revisi minor hingga 3x sampai cocok\n• **Keuntungan Lebih:** Desain logo yang sudah jadi bisa langsung sekalian diaplikasikan untuk cetak stiker kemasan, kartu nama, nota toko, atau spanduk banner di studio kami.\n\nSilakan klik tombol di bawah untuk langsung hitung di formulir atau diskusikan konsep logo Anda via WhatsApp! [REKOMENDASI: jasa-pembuatan-desain]`;
  }

  // Khusus Desain Grafis Umum
  if (q.includes('desain') || q.includes('design') || q.includes('grafis')) {
    return `Bisa banget! Kami menyediakan **Jasa Pembuatan Desain Grafis Kustom** (logo, banner, spanduk, brosur, feed/story medsos, label kemasan) mulai **Rp 25.000 / desain** dengan waktu 1 - 2 hari kerja. Sudah termasuk master file resolusi tinggi dan revisi gratis 3x! [REKOMENDASI: jasa-pembuatan-desain]`;
  }

  // Khusus CV Lamaran Kerja
  if (q.includes('cv') || q.includes('curriculum') || q.includes('lamaran kerja') || q.includes('resume')) {
    return `Bisa banget! Kami menyediakan **Jasa Pembuatan CV ATS-Friendly & Creative** mulai **Rp 30.000 / CV** dengan pengerjaan kilat (1 - 24 jam). Format disesuaikan dengan posisi kerja yang Anda tuju agar lolos scan HRD, lengkap dengan file PDF siap kirim dan Word yang bisa diedit. [REKOMENDASI: jasa-pembuatan-cv]`;
  }

  // Khusus Pembuatan Akun Email
  if (q.includes('email') || q.includes('gmail') || q.includes('bikin email')) {
    return `Bisa dibantu! Kami melayani **Jasa Pembuatan Akun Email Resmi / Profesional** mulai **Rp 15.000 / akun** (proses 15 - 30 menit). Sudah disetting keamanan verifikasi 2 langkah dan nama formal siap pakai melamar kerja. [REKOMENDASI: jasa-pembuatan-email]`;
  }

  // Jam Buka / Hari Operasional
  if (q.includes('buka') || q.includes('hari') || q.includes('jam') || q.includes('operasional') || q.includes('jadwal') || q.includes('tutup') || q.includes('kapan')) {
    return `Studio **${brandName}** buka dengan jadwal operasional resmi:\n\n📅 **${hoursWeekday}**\n☕ **${hoursWeekend}**\n\nUntuk konsultasi atau pemesanan online, admin kami siap merespons via WhatsApp di jam operasional tersebut!`;
  }

  // Alamat & Pengambilan
  if (q.includes('alamat') || q.includes('lokasi') || q.includes('tempat') || q.includes('dimana') || q.includes('di mana') || q.includes('posisi') || q.includes('ambil')) {
    return `Studio **${brandName}** berlokasi di:\n\n📍 **${address}**\n\nKami melayani pemesanan online siap antar/kirim, atau Anda dapat mengambil langsung pesanan cetak di studio (pickup).`;
  }

  // Kontak & WhatsApp
  if (q.includes('kontak') || q.includes('wa') || q.includes('whatsapp') || q.includes('nomor') || q.includes('telepon') || q.includes('hp') || q.includes('admin')) {
    return `Kontak resmi **${brandName}**:\n\n📱 **WhatsApp:** ${phone} (${admin})\n📧 **Email:** ${studioConfig?.email || 'otakatikide01@gmail.com'}\n📸 **Instagram:** ${studioConfig?.instagram || '@bikyndesain'}\n\nSilakan klik tombol WhatsApp atau pilih layanan di formulir pemesanan langsung.`;
  }

  // Daftar Menu Cafe
  if (q.includes('menu') || q.includes('kafe') || q.includes('cafe') || q.includes('minyak') || q.includes('air')) {
    return `Untuk cetak **Daftar Menu Cafe / Resto**, kami sangat merekomendasikan bahan **Art Carton 260gr atau 310gr dengan Laminasi Glossy / Doff** (mulai Rp 10.000 / lbr). Bahan ini tahan tumpahan air, anti minyak, dan awet dipegang pelanggan. [REKOMENDASI: cetak-daftar-menu]`;
  }

  // Spanduk Banner
  if (q.includes('banner') || q.includes('spanduk') || q.includes('outdoor')) {
    return `Untuk **Banner / Spanduk Outdoor**, kami menggunakan bahan **Flexi tebal (China 280gr atau Korchin 380gr)** tahan panas dan hujan (mulai Rp 20.000 / m²), sudah lengkap dengan mata ayam (lubang ring besi) di setiap sudut. Pengerjaan 1 - 2 hari kerja. [REKOMENDASI: cetak-banner]`;
  }

  // Stiker Label Kemasan
  if (q.includes('stiker') || q.includes('sticker') || q.includes('label')) {
    return `Untuk **Stiker Label Kemasan**, kami menyediakan stiker **Vinyl Waterproof** (sangat awet untuk minuman dingin & frozen food) serta stiker **Kromo** (ekonomis untuk toples kering), mulai Rp 8.000 / lbr A3+, sudah dipotong kiss-cut tinggal tempel! [REKOMENDASI: cetak-cutting-sticker]`;
  }

  // Pas Foto
  if (q.includes('pas foto') || q.includes('foto') || q.includes('ijazah') || q.includes('nikah') || q.includes('cpns')) {
    return `Untuk **Pas Foto Resmi**, kami melayani ukuran 2x3, 3x4, hingga 4x6 (mulai Rp 10.000 / paket) untuk lamaran kerja, CPNS, buku nikah, dan ijazah. Sudah termasuk ganti background merah/biru dan edit halus. [REKOMENDASI: cetak-pas-foto]`;
  }

  // Nota Custom
  if (q.includes('nota') || q.includes('kwitansi') || q.includes('bon') || q.includes('kasir') || q.includes('ncr')) {
    return `Untuk **Nota Custom**, kami mencetak nota kasir berkop logo toko Anda menggunakan kertas tembus **NCR tanpa karbon hitam** (mulai Rp 85.000 / rim isi 40 buku), tersedia pilihan 1-ply, 2-ply, dan 3-ply lengkap dengan nomorator. [REKOMENDASI: nota-custom]`;
  }

  // Kartu Nama
  if (q.includes('kartu nama') || q.includes('name card')) {
    return `Untuk **Kartu Nama Bisnis**, kami mencetak menggunakan bahan **Art Carton 260gr tebal** (mulai Rp 35.000 / box isi 100 lembar), cetak 1 sisi atau 2 sisi, sudah termasuk kotak mika eksklusif! [REKOMENDASI: kartu-nama]`;
  }

  return `Halo! Di **${brandName}**, kami menyediakan layanan cetak & desain lengkap (print dokumen, fotokopi, laminating, spanduk banner, stiker kemasan, kartu nama, nota, polaroid, undangan, hingga CV dan desain logo profesional).\n\nSilakan pilih layanan di katalog kami atau tanyakan rekomendasi bahan yang Anda butuhkan!`;
}
