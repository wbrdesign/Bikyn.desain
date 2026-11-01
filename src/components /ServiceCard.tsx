import React from 'react';
import { Service, StudioConfig } from '../types';
import { ServiceMockup } from './ServiceMockup';
import { MessageCircle, Info, Calculator } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  studioConfig: StudioConfig;
  onOpenDetail: (service: Service) => void;
  onSelectForCalculation: (serviceId: string) => void;
}

const CATEGORY_CARD_STYLES: Record<
  string,
  {
    bgGradient: string;
    border: string;
    hoverBorder: string;
    badge: string;
    priceColor: string;
  }
> = {
  Dokumen: {
    bgGradient: 'bg-gradient-to-b from-sky-50/60 via-white to-sky-50/30',
    border: 'border-sky-200/80',
    hoverBorder: 'hover:border-sky-500 hover:shadow-sky-100/70',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    priceColor: 'text-sky-700',
  },
  Promosi: {
    bgGradient: 'bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30',
    border: 'border-amber-200/80',
    hoverBorder: 'hover:border-amber-500 hover:shadow-amber-100/70',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    priceColor: 'text-amber-700',
  },
  Foto: {
    bgGradient: 'bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30',
    border: 'border-emerald-200/80',
    hoverBorder: 'hover:border-emerald-500 hover:shadow-emerald-100/70',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    priceColor: 'text-emerald-700',
  },
  Undangan: {
    bgGradient: 'bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30',
    border: 'border-rose-200/80',
    hoverBorder: 'hover:border-rose-500 hover:shadow-rose-100/70',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    priceColor: 'text-rose-700',
  },
  Digital: {
    bgGradient: 'bg-gradient-to-b from-violet-50/60 via-white to-violet-50/30',
    border: 'border-violet-200/80',
    hoverBorder: 'hover:border-violet-500 hover:shadow-violet-100/70',
    badge: 'bg-violet-100 text-violet-800 border-violet-200',
    priceColor: 'text-violet-700',
  },
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  studioConfig,
  onOpenDetail,
  onSelectForCalculation,
}) => {
  const style = CATEGORY_CARD_STYLES[service.category] || CATEGORY_CARD_STYLES.Dokumen;

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Halo ${studioConfig.brandName}, saya tertarik untuk memesan atau konsultasi layanan: *${service.title}* (${service.price}). Mohon informasinya. Terima kasih!`;
    const cleanPhone = studioConfig.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetail(service)}
      className={`group relative flex flex-col justify-between ${style.bgGradient} rounded-2xl border ${style.border} ${style.hoverBorder} shadow-2xs hover:shadow-md transition-all duration-200 p-2 sm:p-3.5 cursor-pointer hover:-translate-y-0.5`}
    >
      <div>
        {/* Mockup / Image area */}
        <div className="w-full h-20 sm:h-28 md:h-32 mb-2 sm:mb-3 rounded-xl overflow-hidden bg-white/80 border border-white/80 shadow-2xs">
          <ServiceMockup service={service} className="w-full h-full" isCompact={true} />
        </div>

        {/* Category & Min Order Metadata */}
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] mb-1.5">
          <span className={`font-bold px-1.5 py-0.5 rounded-md border text-[9px] sm:text-[10px] truncate ${style.badge}`}>
            {service.categoryLabel}
          </span>
          <span className="text-[8px] sm:text-[10px] text-zinc-500 font-medium truncate pl-1">
            {service.minOrder}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-zinc-950 text-[11px] sm:text-xs md:text-sm leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-orange-600 transition-colors mb-1 min-h-[26px] sm:min-h-[32px]">
          {service.title}
        </h3>

        {/* Description - Desktop / Tablet only */}
        <p className="hidden md:line-clamp-2 text-xs text-zinc-500 leading-relaxed mb-3">
          {service.description}
        </p>
      </div>

      <div>
        {/* Price & Turnaround duration */}
        <div className="pt-1.5 sm:pt-2 border-t border-zinc-200/70 mb-2 sm:mb-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-1">
          <div className="text-orange-600 font-black text-[11px] sm:text-xs md:text-sm tracking-tight truncate">
            {service.price}
          </div>
          <div className="text-[8px] sm:text-[10px] text-zinc-500 font-medium truncate">
            {service.duration}
          </div>
        </div>

        {/* Action Buttons: 3 items (WA, Info, + Hitung) */}
        <div className="grid grid-cols-3 gap-1 pt-0.5 sm:gap-1.5">
          <button
            type="button"
            onClick={handleQuickWhatsApp}
            title="Chat WhatsApp"
            className="flex items-center justify-center gap-0.5 py-1 sm:py-1.5 px-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] sm:text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span className="truncate">WA</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(service);
            }}
            title="Lihat Detail Spesifikasi"
            className="flex items-center justify-center gap-0.5 py-1 sm:py-1.5 px-1 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/80 rounded-lg text-[9px] sm:text-xs font-semibold transition-colors cursor-pointer"
          >
            <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-600 shrink-0" />
            <span className="truncate">Info</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectForCalculation(service.id);
            }}
            title="Hitung di Formulir Pesanan"
            className="flex items-center justify-center gap-0.5 py-1 sm:py-1.5 px-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[9px] sm:text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Calculator className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white shrink-0" />
            <span className="truncate">+ Hitung</span>
          </button>
        </div>
      </div>
    </div>
  );
};
