import React from 'react';
import { StudioConfig } from '../types';
import { Layers, Calculator, Sparkles, Home, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  studioConfig: StudioConfig;
  currentView: 'home' | 'catalog';
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onNavigateCalculator: () => void;
  onOpenCMS?: () => void;
  onOpenAIAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  studioConfig,
  currentView,
  onNavigateHome,
  onNavigateCatalog,
  onNavigateCalculator,
  onOpenCMS: _onOpenCMS,
  onOpenAIAssistant,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group text-left cursor-pointer"
          title="Kembali ke Beranda"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center text-white font-black text-sm tracking-tight shadow-xs shadow-orange-500/20 group-hover:scale-105 transition-all">
            <span className="text-white">B</span>
            <span className="text-amber-200">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg text-zinc-950 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
              {studioConfig.brandName}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-normal mt-0.5">
              {studioConfig.subBrand}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-zinc-600">
          <button
            type="button"
            onClick={onNavigateHome}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'home'
                ? 'bg-orange-50 text-orange-950 font-bold border border-orange-200/80 shadow-2xs'
                : 'hover:text-orange-600 hover:bg-orange-50/50'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-orange-600" />
            <span>Beranda</span>
          </button>

          <button
            type="button"
            onClick={onNavigateCatalog}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'catalog'
                ? 'bg-orange-600 text-white font-bold shadow-xs'
                : 'hover:text-orange-600 hover:bg-zinc-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Katalog Layanan</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              currentView === 'catalog' ? 'bg-orange-700 text-orange-100' : 'bg-orange-100 text-orange-700'
            }`}>
              Buka Page
            </span>
          </button>

          <button
            type="button"
            onClick={onNavigateCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:text-orange-600 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-zinc-400" />
            <span>Hitung Pesanan</span>
          </button>

          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 hover:border-orange-300 transition-all whitespace-nowrap shrink-0 text-xs font-bold cursor-pointer"
            title="Konsultasi bahan & ukuran dengan Admin Elena"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            <span>Tanya Admin Elena</span>
            <span className="px-1.5 py-0.2 bg-orange-600 text-white rounded text-[9px] font-black uppercase tracking-wider">Online</span>
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Catalog / Back Button */}
          {currentView === 'catalog' ? (
            <button
              type="button"
              onClick={onNavigateHome}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Katalog</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="md:hidden flex items-center gap-1 p-2 rounded-xl bg-orange-50 text-orange-700 border border-orange-200"
            title="Tanya Admin Elena"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-[10px] font-bold">Elena</span>
          </button>
        </div>
      </div>
    </header>
  );
};
