import React, { useState, useEffect } from 'react';
import { Service, StudioConfig, OrderFormState } from '../types';
import { MessageSquare, Send, Copy, Check, FileText, PenTool, Clock, Layers } from 'lucide-react';

interface WhatsAppCalculatorProps {
  services: Service[];
  studioConfig: StudioConfig;
  selectedServiceId: string;
  onSelectServiceId: (id: string) => void;
}

export const WhatsAppCalculator: React.FC<WhatsAppCalculatorProps> = ({
  services,
  studioConfig,
  selectedServiceId,
  onSelectServiceId,
}) => {
  const [formData, setFormData] = useState<OrderFormState>({
    serviceId: selectedServiceId || (services[0]?.id ?? ''),
    customerName: '',
    quantity: '10 lembar / pcs',
    fileStatus: 'siap',
    notes: '',
  });

  const [copied, setCopied] = useState(false);

  // Sync when selectedServiceId prop changes
  useEffect(() => {
    if (selectedServiceId && selectedServiceId !== formData.serviceId) {
      setFormData((prev) => ({
        ...prev,
        serviceId: selectedServiceId,
      }));
    }
  }, [selectedServiceId]);

  const activeService = services.find((s) => s.id === formData.serviceId) || services[0];

  // Generate dynamic WhatsApp message formatted with asterisks for bolding
  const generateMessageText = () => {
    const fileStatusText =
      formData.fileStatus === 'siap'
        ? 'Sudah siap cetak (PDF / Foto / Word)'
        : 'Belum ada file, butuh bantuan desain dari nol';

    const customer = formData.customerName.trim() || '(Nama Pelanggan)';
    const quantity = formData.quantity.trim() || '(Sesuai Kebutuhan)';
    const notesText = formData.notes.trim()
      ? formData.notes.trim()
      : 'Mohon info estimasi biaya dan cara kirim filenya.';

    return `Halo ${studioConfig.brandName}, saya ingin konsultasi / pesan layanan:

*Layanan:* ${activeService?.title || 'Layanan Percetakan'}
*Nama Pemesan:* ${customer}
*Jumlah / Ukuran:* ${quantity}
*Status File Desain:* ${fileStatusText}
*Catatan Tambahan:* ${notesText}

Terima kasih ${studioConfig.brandName}!`;
  };

  const handleCopy = () => {
    const text = generateMessageText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = generateMessageText();
    const cleanPhone = studioConfig.whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="hitung-pesanan" className="pt-2 sm:pt-4 pb-14 sm:pb-20 bg-zinc-50/30 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/90 shadow-sm p-5 sm:p-7 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
              <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-zinc-900 text-base sm:text-lg">Formulir Rincian Pesanan</h3>
                <p className="text-xs text-zinc-500">Sesuaikan pesanan Anda untuk mendapatkan draf pesan instan</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Service Select */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-zinc-800 mb-1.5">
                  Pilih Layanan (Tersedia {services.length} Layanan)
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setFormData((prev) => ({ ...prev, serviceId: newId }));
                    onSelectServiceId(newId);
                  }}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                >
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.title} ({svc.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-800 mb-1.5">
                    Nama Anda / Usaha
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rian / Olshop Dapur Hijau"
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-zinc-800 mb-1.5">
                    Jumlah / Ukuran
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 10 lembar / 2x1 meter"
                    value={formData.quantity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* File status toggle */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-zinc-800 mb-2">
                  Apakah file desain / naskah sudah siap?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, fileStatus: 'siap' }))}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                      formData.fileStatus === 'siap'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-emerald-50/60 hover:border-emerald-200'
                    }`}
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>File Siap (Tinggal Cetak)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, fileStatus: 'bantuan' }))}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                      formData.fileStatus === 'bantuan'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-600 shadow-xs font-bold'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-orange-50/60 hover:border-orange-200'
                    }`}
                  >
                    <PenTool className="w-4 h-4 text-orange-200" />
                    <span>Butuh Bantuan Desain dari Nol</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-zinc-800 mb-1.5">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Kertas tebal glossy, background foto diubah merah, butuh selesai besok siang..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all placeholder:text-zinc-400 resize-none"
                />
              </div>

              {/* Active Service Summary Card */}
              {activeService && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-orange-50/80 border border-orange-200/80 shadow-2xs">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-orange-950 uppercase tracking-wide">
                      Informasi Layanan Terpilih:
                    </span>
                    <span className="text-xs sm:text-sm font-black text-orange-600 bg-white px-2.5 py-0.5 rounded-lg border border-orange-200 shadow-2xs">
                      {activeService.price}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mb-2 leading-relaxed">
                    {activeService.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-600 font-medium border-t border-orange-200/60 pt-2">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                      Min. Order: {activeService.minOrder}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      Estimasi: {activeService.duration}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: WhatsApp Live Message Preview - Trendy Creative Studio Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-zinc-900 to-orange-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-orange-500/30 flex flex-col justify-between h-full relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col flex-1 relative z-10">
              {/* Header inside chat box */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{studioConfig.adminName}</h4>
                    <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Respon Ramah & Cepat
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer border border-white/10 shadow-xs"
                  title="Salin teks pesan"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-orange-300" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>
              </div>

              {/* Chat Message Bubble */}
              <div className="text-[11px] sm:text-xs text-orange-200/90 mb-2 font-medium">
                Pratinjau Pesan yang Akan Terkirim:
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 text-zinc-100 text-xs sm:text-sm font-sans whitespace-pre-wrap leading-relaxed shadow-inner flex-1 min-h-[200px]">
                {generateMessageText()}
              </div>
            </div>

            {/* Send CTA */}
            <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all cursor-pointer group"
              >
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Kirim Format Ini ke WhatsApp</span>
              </button>
              <p className="text-center text-[11px] text-zinc-400 mt-2.5">
                Pesan akan langsung membuka aplikasi WhatsApp di HP atau WhatsApp Web di laptop Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
