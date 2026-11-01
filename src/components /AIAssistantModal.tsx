import React, { useState, useRef, useEffect } from 'react';
import { Service, StudioConfig } from '../types';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendedServiceId?: string | null;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  studioConfig: StudioConfig;
  onSelectServiceForCalculation: (serviceId: string) => void;
}

const DEFAULT_PROMPTS = [
  'Bisa buat desain logo baru?',
  'Kertas apa yang tahan air & minyak untuk daftar menu cafe?',
  'Berapa ukuran pas foto resmi untuk CPNS & buku nikah?',
  'Rekomendasi bahan banner outdoor yang tebal & tahan hujan?',
  'Mau buat stiker label toples kue kering, pakai bahan apa?',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  services,
  studioConfig,
  onSelectServiceForCalculation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Halo! Saya **Admin Elena**, konsultan cetak & desain dari ${studioConfig.brandName}. 👋\n\nBingung memilih jenis kertas, ukuran, atau butuh rekomendasi layanan terbaik untuk kebutuhan Anda? Tanyakan apa saja, saya siap membantu merekomendasikan solusi yang tepat & hemat!`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Endpoint handles both local Express /api/ai/consult and Vercel /api/consult
      const endpoint = '/api/ai/consult';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          studioConfig: studioConfig,
          services: services.map((s) => ({
            id: s.id,
            title: s.title,
            price: s.price,
            category: s.category,
            minOrder: s.minOrder,
            duration: s.duration,
            description: s.description,
            specifications: s.specifications,
            paperOptions: s.paperOptions,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Berikut rekomendasi terbaik untuk kebutuhan Anda.',
        recommendedServiceId: data.recommendedServiceId || null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Failed to call AI consultant:', err);
      // Smart offline fallback reading directly from current studioConfig
      const q = text.toLowerCase();
      let fallbackText = '';
      let recommendedServiceId: string | null = null;

      if (q.includes('logo') || q.includes('bisa buat logo') || q.includes('bikin logo') || q.includes('desain logo') || q.includes('buat logo')) {
        fallbackText = `Bisa banget! Di **${studioConfig.brandName}**, kami melayani **Jasa Pembuatan Desain Logo Kustom** untuk UMKM, toko online, produk kuliner, hingga brand pribadi dengan rincian lengkap berikut:\n\n• **Biaya:** Mulai Rp 25.000 / konsep desain\n• **Waktu Pengerjaan:** Cepat, 1 - 2 hari kerja\n• **File yang Anda Dapatkan:** Format lengkap master siap pakai (PNG transparan tanpa background, JPG resolusi tinggi, dan file PDF vector siap cetak)\n• **Fasilitas:** Gratis konsultasi & revisi minor hingga 3x sampai cocok\n• **Keuntungan Lebih:** Desain logo yang sudah jadi bisa langsung sekalian diaplikasikan untuk cetak stiker kemasan, kartu nama, nota toko, atau spanduk banner di studio kami.\n\nSilakan klik tombol di bawah untuk langsung hitung di formulir atau diskusikan konsep logo Anda via WhatsApp!`;
        recommendedServiceId = 'jasa-pembuatan-desain';
      } else if (q.includes('desain') || q.includes('design') || q.includes('grafis')) {
        fallbackText = `Bisa banget! Kami menyediakan **Jasa Pembuatan Desain Grafis Kustom** (logo, banner, spanduk, brosur, feed/story medsos, label kemasan) mulai **Rp 25.000 / desain** dengan waktu 1 - 2 hari kerja. Sudah termasuk master file resolusi tinggi dan revisi gratis 3x!`;
        recommendedServiceId = 'jasa-pembuatan-desain';
      } else if (q.includes('cv') || q.includes('curriculum') || q.includes('lamaran kerja') || q.includes('resume')) {
        fallbackText = `Bisa banget! Kami menyediakan **Jasa Pembuatan CV ATS-Friendly & Creative** mulai **Rp 30.000 / CV** dengan pengerjaan kilat (1 - 24 jam). Format disesuaikan dengan posisi kerja yang Anda tuju agar lolos scan HRD, lengkap dengan file PDF siap kirim dan Word yang bisa diedit.`;
        recommendedServiceId = 'jasa-pembuatan-cv';
      } else if (q.includes('buka') || q.includes('hari') || q.includes('jam') || q.includes('operasional') || q.includes('jadwal') || q.includes('tutup') || q.includes('kapan')) {
        fallbackText = `Studio **${studioConfig.brandName}** buka dengan jadwal operasional:\n\n📅 **${studioConfig.hoursWeekday}**\n☕ **${studioConfig.hoursWeekend}**\n\nUntuk konsultasi atau pemesanan online, admin kami siap merespons via WhatsApp di jam operasional tersebut!`;
      } else if (q.includes('alamat') || q.includes('lokasi') || q.includes('tempat') || q.includes('dimana') || q.includes('di mana') || q.includes('posisi') || q.includes('ambil')) {
        fallbackText = `Studio **${studioConfig.brandName}** berlokasi di:\n\n📍 **${studioConfig.address}**\n\nKami melayani pemesanan online siap antar/kirim, atau Anda dapat mengambil langsung pesanan cetak di studio (pickup).`;
      } else if (q.includes('kontak') || q.includes('wa') || q.includes('whatsapp') || q.includes('nomor') || q.includes('telepon') || q.includes('admin')) {
        fallbackText = `Kontak resmi **${studioConfig.brandName}**:\n\n📱 **WhatsApp:** ${studioConfig.whatsappDisplayNumber || studioConfig.whatsappNumber} (${studioConfig.adminName})\n📧 **Email:** ${studioConfig.email}\n📸 **Instagram:** ${studioConfig.instagram}`;
      } else {
        fallbackText = `Halo! Di **${studioConfig.brandName}**, kami melayani print dokumen, foto estetik, banner spanduk, stiker kemasan, kartu nama, nota, dan jasa desain grafis.\n\nSilakan pilih layanan di katalog kami atau gunakan formulir pesanan di bawah untuk membuat draf WhatsApp!`;
      }

      const fallbackMessage: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'model',
        text: fallbackText,
        recommendedServiceId: recommendedServiceId,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecommendation = (serviceId: string) => {
    onSelectServiceForCalculation(serviceId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden h-[85vh] max-h-[700px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Creative Studio Gradient */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-orange-400/30 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight">
                  Tanya Admin Elena
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/25">
                  Online · Respon Cepat
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium">
                Konsultan cetak & desain studio {studioConfig.brandName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-50/70">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const matchedService = msg.recommendedServiceId
              ? services.find((s) => s.id === msg.recommendedServiceId)
              : null;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-zinc-900 text-white'
                      : 'bg-orange-500 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[85%] space-y-2.5`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-zinc-950 text-white rounded-tr-xs font-medium'
                        : 'bg-white text-zinc-800 border border-zinc-200/90 shadow-2xs rounded-tl-xs whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Service Card if provided by AI */}
                  {matchedService && (
                    <div className="p-3.5 bg-orange-50/90 border border-orange-200 rounded-2xl shadow-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                          Rekomendasi Layanan Studio:
                        </span>
                        <span className="text-xs font-black text-orange-600 bg-white px-2 py-0.5 rounded border border-orange-200">
                          {matchedService.price}
                        </span>
                      </div>

                      <div className="font-extrabold text-xs sm:text-sm text-zinc-950">
                        {matchedService.title}
                      </div>

                      <p className="text-[11px] text-zinc-600 line-clamp-2">
                        {matchedService.description}
                      </p>

                      <div className="pt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectRecommendation(matchedService.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span>Hitung di Formulir Pesanan</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-zinc-500 ml-2 font-medium">Admin Elena sedang mengetik jawaban...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions (shown if few messages) */}
        {messages.length <= 3 && (
          <div className="px-4 py-2 bg-white border-t border-zinc-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-zinc-400 shrink-0">Coba tanya:</span>
            {DEFAULT_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 bg-zinc-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-transparent rounded-lg text-[11px] text-zinc-700 font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-zinc-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tanya Admin Elena seputar bahan kertas, ukuran, atau jadwal buka..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all disabled:opacity-50 placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-200 text-white disabled:text-zinc-400 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline sm:ml-1.5">Kirim</span>
            </button>
          </form>
          <div className="text-[10px] text-zinc-400 text-center mt-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-500" />
            <span>Ditenagai AI cerdas untuk konsultasi cepat & akurat seputar studio.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
