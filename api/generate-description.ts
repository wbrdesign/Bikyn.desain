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
    const { title, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Judul layanan diperlukan.' });
    }

    const prompt = `Sebagai copywriter percetakan & desain profesional, buatkan draf konten untuk layanan baru:
Judul Layanan: "${title}"
Kategori: "${category || 'Percetakan'}"

Berikan output dalam format JSON persis seperti ini:
{
  "description": "Deskripsi singkat yang menjual (maksimal 2 kalimat, menarik bagi UMKM/pelajar)",
  "price": "Mulai Rp ... (estimasi wajar percetakan)",
  "duration": "Estimasi waktu (misal: 1 - 2 hari / 15-30 menit)",
  "minOrder": "Minimal order yang wajar (misal: 1 pcs / 10 lembar)",
  "specifications": [
    "Poin keunggulan 1",
    "Poin keunggulan 2",
    "Poin keunggulan 3",
    "Poin keunggulan 4"
  ],
  "paperOptions": ["Pilihan 1", "Pilihan 2", "Pilihan 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in Vercel API generate-description:', error);
    // Graceful fallback dummy if AI key is missing or error
    return res.status(200).json({
      description: `Layanan ${req.body?.title || 'percetakan'} berkualitas dengan proses cepat, rapi, dan hasil tajam.`,
      price: 'Mulai Rp 10.000',
      duration: '1 - 2 Hari Kerja',
      minOrder: '1 pcs / paket',
      specifications: [
        'Hasil cetak tajam & warna akurat',
        'Bahan premium berkualitas',
        'Bisa custom ukuran & desain',
        'Pengerjaan rapi & cepat',
      ],
      paperOptions: ['Standar', 'Tebal / Premium', 'Laminasi Glossy / Doff'],
    });
  }
}
