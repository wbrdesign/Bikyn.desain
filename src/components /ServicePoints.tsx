import React, { useState } from 'react';
import { Service } from '../types';
import { CheckCircle2, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface ServicePointsProps {
  services: Service[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  onNavigateCatalog: () => void;
}

// Creative soft color palette for each service category
export const CATEGORY_SOFT_STYLES: Record<
  string,
  {
    label: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    activeRing: string;
    activeBg: string;
    iconColor: string;
    priceTag: string;
    titleColor: string;
    filterActive: string;
    filterInactive: string;
  }
> = {
  Dokumen: {
    label: 'Print & Dokumen',
    cardBg: 'bg-sky-50/70',
    cardBorder: 'border-sky-200/80',
    cardHover: 'hover:border-sky-400 hover:bg-sky-50',
    activeRing: 'ring-2 ring-sky-500 border-sky-500',
    activeBg: 'bg-sky-100 text-sky-950 shadow-xs',
    iconColor: 'text-sky-600',
    priceTag: 'bg-sky-100/90 text-sky-800 border-sky-200/80',
    titleColor: 'text-sky-950',
    filterActive: 'bg-sky-600 text-white font-bold shadow-xs',
    filterInactive: 'bg-sky-50 text-sky-800 hover:bg-sky-100/80 border border-sky-200/60',
  },
  Promosi: {
    label: 'Promosi & UMKM',
    cardBg: 'bg-amber-50/70',
    cardBorder: 'border-amber-200/80',
    cardHover: 'hover:border-amber-400 hover:bg-amber-50',
    activeRing: 'ring-2 ring-amber-500 border-amber-500',
    activeBg: 'bg-amber-100 text-amber-950 shadow-xs',
    iconColor: 'text-amber-600',
    priceTag: 'bg-amber-100/90 text-amber-800 border-amber-200/80',
    titleColor: 'text-amber-950',
    filterActive: 'bg-amber-600 text-white font-bold shadow-xs',
    filterInactive: 'bg-amber-50 text-amber-800 hover:bg-amber-100/80 border border-amber-200/60',
  },
  Foto: {
    label: 'Foto & Polaroid',
    cardBg: 'bg-emerald-50/70',
    cardBorder: 'border-emerald-200/80',
    cardHover: 'hover:border-emerald-400 hover:bg-emerald-50',
    activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
    activeBg: 'bg-emerald-100 text-emerald-950 shadow-xs',
    iconColor: 'text-emerald-600',
    priceTag: 'bg-emerald-100/90 text-emerald-800 border-emerald-200/80',
    titleColor: 'text-emerald-950',
    filterActive: 'bg-emerald-600 text-white font-bold shadow-xs',
    filterInactive: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60',
  },
  Undangan: {
    label: 'Undangan & Acara',
    cardBg: 'bg-rose-50/70',
    cardBorder: 'border-rose-200/80',
    cardHover: 'hover:border-rose-400 hover:bg-rose-50',
    activeRing: 'ring-2 ring-rose-500 border-rose-500',
    activeBg: 'bg-rose-100 text-rose-950 shadow-xs',
    iconColor: 'text-rose-600',
    priceTag: 'bg-rose-100/90 text-rose-800 border-rose-200/80',
    titleColor: 'text-rose-950',
    filterActive: 'bg-rose-600 text-white font-bold shadow-xs',
    filterInactive: 'bg-rose-50 text-rose-800 hover:bg-rose-100/80 border border-rose-200/60',
  },
  Digital: {
    label: 'Desain & Digital',
    cardBg: 'bg-violet-50/70',
    cardBorder: 'border-violet-200/80',
    cardHover: 'hover:border-violet-400 hover:bg-violet-50',
    activeRing: 'ring-2 ring-violet-500 border-violet-500',
    activeBg: 'bg-violet-100 text-violet-950 shadow-xs',
    iconColor: 'text-violet-600',
    priceTag: 'bg-violet-100/90 text-violet-800 border-violet-200/80',
    titleColor: 'text-violet-950',
    filterActive: 'bg-violet-600 text-white font-bold shadow-xs',
    filterInactive: 'bg-violet-50 text-violet-800 hover:bg-violet-100/80 border border-violet-200/60',
  },
};

export const ServicePoints: React.FC<ServicePointsProps> = ({
  services,
  selectedServiceId,
  onSelectService,
  onNavigateCatalog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: `Semua (${services.length})` },
    { id: 'Dokumen', label: 'Print Dokumen' },
    { id: 'Promosi', label: 'Promosi UMKM' },
    { id: 'Foto', label: 'Foto & Polaroid' },
    { id: 'Undangan', label: 'Undangan & Acara' },
    { id: 'Digital', label: 'Desain & CV' },
  ];

  const displayedServices =
    selectedCategory === 'all'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const handlePointClick = (serviceId: string) => {
    onSelectService(serviceId);
    const el = document.getElementById('hitung-pesanan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-4 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      <div className="bg-white/95 backdrop-blur-xs rounded-3xl border border-zinc-200/90 shadow-sm p-4 sm:p-6 transition-all">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-zinc-950 tracking-tight">
                  Point Layanan Studio Kreatif
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold border border-orange-200">
                  {services.length} Pilihan
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
                Pilih judul layanan untuk langsung mengisi formulir simulasi pesanan
              </p>
            </div>
          </div>

          {/* Quick link to full catalog - Fresh Creative Orange Accent */}
          <button
            type="button"
            onClick={onNavigateCatalog}
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-sm shadow-orange-500/20 hover:shadow-md cursor-pointer group shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-white" />
            <span>Buka Katalog Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-white" />
          </button>
        </div>

        {/* Quick Category Filter Pills with distinct soft creative tints */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3.5 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const style = CATEGORY_SOFT_STYLES[cat.id];

            let buttonClass = '';
            if (cat.id === 'all') {
              buttonClass = isActive
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700';
            } else if (style) {
              buttonClass = isActive ? style.filterActive : style.filterInactive;
            }

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${buttonClass}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid of Service Points with Trendy Soft Category Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {displayedServices.map((service) => {
            const isSelected = selectedServiceId === service.id;
            const style = CATEGORY_SOFT_STYLES[service.category] || CATEGORY_SOFT_STYLES.Dokumen;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handlePointClick(service.id)}
                className={`group text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                  isSelected
                    ? `${style.activeBg} ${style.activeRing} scale-[1.01]`
                    : `${style.cardBg} ${style.cardBorder} ${style.cardHover} hover:shadow-sm`
                }`}
              >
                {/* Top: Category Check Icon + Service Title */}
                <div className="flex items-start gap-2 w-full">
                  <span
                    className={`mt-0.5 shrink-0 transition-colors ${
                      isSelected ? style.iconColor : `${style.iconColor} opacity-75 group-hover:opacity-100`
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span
                    className={`text-xs font-extrabold tracking-tight line-clamp-1 transition-colors ${
                      isSelected ? 'text-zinc-950 font-black' : style.titleColor
                    }`}
                    title={service.title}
                  >
                    {service.title}
                  </span>
                </div>

                {/* Bottom: Price Tag + Indicator */}
                <div className="flex items-center justify-between w-full pl-6 text-[11px]">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md border text-[11px] ${style.priceTag}`}
                  >
                    {service.price}
                  </span>
                  {isSelected ? (
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-200/90 px-1.5 py-0.5 rounded-md">
                      Dipilih ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-zinc-500 group-hover:text-zinc-900 transition-colors">
                      Pilih →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
