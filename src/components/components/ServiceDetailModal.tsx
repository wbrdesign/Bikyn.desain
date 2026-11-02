import React from 'react';
import { Service, StudioConfig } from '../types';
import { ServiceMockup } from './ServiceMockup';
import { X, MessageCircle, Calculator, CheckCircle2, Clock, Layers, Sparkles } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  studioConfig: StudioConfig;
  isOpen: boolean;
  onClose: () => void;
  onSelectForCalculation: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  studioConfig,
  isOpen,
  onClose,
  onSelectForCalculation,
}) => {
  if (!isOpen || !service) return null;

  const handleWhatsApp = () => {
    const message = `Halo ${studioConfig.brandName}, saya ingin konsultasi detail untuk layanan *${service.title}* (${service.price}).`;
    const cleanPhone = studioConfig.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCalculate = () => {
    onSelectForCalculation(service.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {service.categoryLabel}
            </span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-500 font-medium">Katalog Layanan Resmi</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top section: Preview + Main Title & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            <div className="sm:col-span-5 h-44 sm:h-48">
              <ServiceMockup service={service} className="w-full h-full shadow-inner" />
            </div>

            <div className="sm:col-span-7 space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight leading-tight">
                {service.title}
              </h2>
              <div className="inline-block px-3 py-1 rounded-xl bg-orange-50 border border-orange-200">
                <span className="text-lg sm:text-xl font-extrabold text-orange-600">
                  {service.price}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2 text-xs text-zinc-600 border-t border-zinc-100">
                <div className="flex items-center gap-1.5 font-medium">
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span>Min: <strong>{service.minOrder}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Proses: <strong>{service.duration}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {service.specifications && service.specifications.length > 0 && (
            <div className="bg-zinc-50 rounded-2xl p-4 sm:p-5 border border-zinc-200/80">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Spesifikasi & Keunggulan Layanan
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-700">
                {service.specifications.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Paper / Material Options */}
          {service.paperOptions && service.paperOptions.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 mb-2">
                Pilihan Bahan / Format Tersedia:
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.paperOptions.map((opt, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 shadow-2xs"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 sm:px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-zinc-600 hover:text-zinc-900 text-xs sm:text-sm font-medium hover:bg-zinc-200/70 transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Hitung di Formulir</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pesan via WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
