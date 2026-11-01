import React, { useState, useEffect, useMemo } from 'react';
import { Service, StudioConfig, ServiceCategory } from './types';
import { DEFAULT_SERVICES, DEFAULT_CONFIG } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { ServiceCard } from './components/ServiceCard';
import { WhatsAppCalculator } from './components/WhatsAppCalculator';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ServicePoints } from './components/ServicePoints';
import { CMSModal } from './components/CMSModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Footer } from './components/Footer';
import {
  Search,
  Settings,
  MessageCircle,
  Sparkles,
  Layers,
  Calculator,
  ArrowLeft,
} from 'lucide-react';

const STORAGE_KEY_SERVICES = 'bikyn_services_v1';
const STORAGE_KEY_CONFIG = 'bikyn_config_v1';

export default function App() {
  // 1. State for services and configuration (with localStorage persistence)
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved services', e);
    }
    return DEFAULT_SERVICES;
  });

  const [studioConfig, setStudioConfig] = useState<StudioConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved config', e);
    }
    return DEFAULT_CONFIG;
  });

  // 2. View state ('home' | 'catalog')
  const [currentView, setCurrentView] = useState<'home' | 'catalog'>(() => {
    return window.location.hash === '#katalog' ? 'catalog' : 'home';
  });

  // Listen to browser hash changes (support browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#katalog') {
        setCurrentView('catalog');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3. Filter & Search states
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 4. Modals & selected items
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [isCMSOpen, setIsCMSOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [selectedCalcServiceId, setSelectedCalcServiceId] = useState<string>(
    services[0]?.id || 'print-hp-warna'
  );

  // Navigation handlers
  const handleNavigateHome = () => {
    setCurrentView('home');
    if (window.location.hash === '#katalog') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCatalog = (category?: string) => {
    if (category) {
      setActiveCategory(category);
    }
    setCurrentView('catalog');
    window.location.hash = 'katalog';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCalculator = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      if (window.location.hash === '#katalog') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
    setTimeout(() => {
      const element = document.getElementById('hitung-pesanan');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  // Sync to local storage
  const handleUpdateServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(newServices));
  };

  const handleUpdateStudioConfig = (newConfig: StudioConfig) => {
    setStudioConfig(newConfig);
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
  };

  const handleResetDefaults = () => {
    setServices(DEFAULT_SERVICES);
    setStudioConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: services.length,
      Dokumen: 0,
      Promosi: 0,
      Foto: 0,
      Undangan: 0,
      Digital: 0,
    };
    services.forEach((s) => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory =
        activeCategory === 'all' ? true : s.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        query === ''
          ? true
          : s.title.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query) ||
            (s.paperOptions && s.paperOptions.some((p) => p.toLowerCase().includes(query)));
      return matchesCategory && matchesQuery;
    });
  }, [services, activeCategory, searchQuery]);

  // Handle calculator selection & smooth scroll (switching to home if in catalog)
  const handleSelectForCalculation = (serviceId: string) => {
    setSelectedCalcServiceId(serviceId);
    if (currentView !== 'home') {
      setCurrentView('home');
      if (window.location.hash === '#katalog') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
    setTimeout(() => {
      const element = document.getElementById('hitung-pesanan');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Category navigation tabs
  const categoryTabs = [
    { id: 'all', label: `Semua Layanan (${categoryCounts.all || 0})` },
    { id: 'Dokumen', label: `Print & Dokumen (${categoryCounts.Dokumen || 0})` },
    { id: 'Promosi', label: `Promosi & Bisnis UMKM (${categoryCounts.Promosi || 0})` },
    { id: 'Foto', label: `Foto & Polaroid (${categoryCounts.Foto || 0})` },
    { id: 'Undangan', label: `Undangan & Acara (${categoryCounts.Undangan || 0})` },
    { id: 'Digital', label: `Jasa Desain & Digital (${categoryCounts.Digital || 0})` },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      {/* 1. Header / Top bar */}
      <Navbar
        studioConfig={studioConfig}
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onNavigateCatalog={() => handleNavigateCatalog()}
        onNavigateCalculator={handleNavigateCalculator}
        onOpenCMS={() => setIsCMSOpen(true)}
        onOpenAIAssistant={() => setIsAIOpen(true)}
      />

      {/* ========================================================
          VIEW A: DEFAULT SIMPLE HOME VIEW (TAMPILAN AWAL LEBIH SIMPLE)
          ======================================================== */}
      {currentView === 'home' && (
        <>
          {/* Hero Section - Fresh Creative Studio Atmosphere */}
          <section className="pt-12 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-b from-orange-100/40 via-amber-50/30 to-white text-center relative overflow-hidden">
            {/* Ambient creative glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-gradient-to-b from-orange-200/30 to-transparent blur-3xl pointer-events-none" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center relative z-10">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200/90 text-orange-950 text-xs font-bold mb-4 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Workshop Cetak & Studio Desain Aktif</span>
                <span className="text-orange-400">•</span>
                <span>Cetak Satuan & Grosir</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.14] text-balance">
                {studioConfig.heroTitle}
              </h1>

              <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-zinc-600 leading-relaxed text-pretty max-w-2xl mx-auto font-medium">
                {studioConfig.heroSubtitle}
              </p>
            </div>
          </section>

          {/* Point-Point Layanan (Judul Layanan) */}
          <ServicePoints
            services={services}
            selectedServiceId={selectedCalcServiceId}
            onSelectService={(id) => setSelectedCalcServiceId(id)}
            onNavigateCatalog={() => handleNavigateCatalog()}
          />

          {/* Interactive WhatsApp Order Calculator Section */}
          <WhatsAppCalculator
            services={services}
            studioConfig={studioConfig}
            selectedServiceId={selectedCalcServiceId}
            onSelectServiceId={(id) => setSelectedCalcServiceId(id)}
          />
        </>
      )}

      {/* ========================================================
          VIEW B: DEDICATED KATALOG LAYANAN PAGE (HALAMAN KHUSUS KATALOG)
          ======================================================== */}
      {currentView === 'catalog' && (
        <main className="flex-1 bg-zinc-50/50 pb-16">
          {/* Header & Back Bar - Creative Studio Gradient */}
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white pt-8 pb-10 border-b border-orange-400/30 shadow-lg relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
              {/* Prominent Back Button & Breadcrumb */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <button
                  type="button"
                  onClick={handleNavigateHome}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer backdrop-blur-xs border border-white/20 shadow-xs group"
                  title="Kembali ke tampilan awal / Beranda"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-white" />
                  <span>Kembali ke Tampilan Awal</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-orange-100 font-medium">
                  <button
                    type="button"
                    onClick={handleNavigateHome}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Beranda
                  </button>
                  <span>/</span>
                  <span className="text-white font-bold">Katalog Layanan</span>
                  <span className="hidden sm:inline text-orange-200">
                    • ({filteredServices.length} dari {services.length} Layanan)
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 text-white border border-white/20 text-[11px] font-black uppercase tracking-wider mb-2 backdrop-blur-xs">
                  <Layers className="w-3.5 h-3.5 text-white" />
                  Katalog Layanan Lengkap Studio
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Katalog Layanan Cetak & Desain
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-orange-100 leading-relaxed max-w-2xl font-medium">
                  Pilih layanan yang Anda butuhkan. Klik kartu layanan untuk melihat spesifikasi detail atau langsung klik &ldquo;Hitung Pesanan&rdquo; untuk simulasi estimasi harga.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky/Fixed Filter Bar & Search */}
          <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                {/* Category buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                  {categoryTabs.map((tab) => {
                    const isActive = activeCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveCategory(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs font-bold'
                            : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search input */}
                <div className="relative w-full lg:w-72 shrink-0">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari layanan (misal: nota, stiker)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 hover:bg-white focus:bg-white border border-zinc-300 focus:border-orange-500 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-zinc-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Services Grid */}
          <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 pt-6">
            {filteredServices.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto bg-white rounded-2xl border border-zinc-200 p-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-zinc-900 text-base">Tidak ada layanan ditemukan</h3>
                <p className="text-xs text-zinc-500 mt-1 mb-5">
                  Coba gunakan kata kunci lain atau pilih kategori &ldquo;Semua Layanan&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    studioConfig={studioConfig}
                    onOpenDetail={(svc) => setDetailService(svc)}
                    onSelectForCalculation={handleSelectForCalculation}
                  />
                ))}
              </div>
            )}

            {/* Bottom Navigation & Back Actions */}
            <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border">
              <button
                type="button"
                onClick={handleNavigateHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
                <span>Kembali ke Tampilan Awal (Default)</span>
              </button>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsAIOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Tanya Admin Elena</span>
                </button>

                <button
                  type="button"
                  onClick={handleNavigateCalculator}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Kalkulator WhatsApp →</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 6. Footer */}
      <Footer
        studioConfig={studioConfig}
        onOpenCMS={() => setIsCMSOpen(true)}
        serviceCount={services.length}
        onNavigateCatalog={() => handleNavigateCatalog()}
        onNavigateHome={handleNavigateHome}
      />

      {/* 7. Service Detail Modal */}
      <ServiceDetailModal
        service={detailService}
        studioConfig={studioConfig}
        isOpen={!!detailService}
        onClose={() => setDetailService(null)}
        onSelectForCalculation={handleSelectForCalculation}
      />

      {/* 8. CMS Management Modal */}
      <CMSModal
        isOpen={isCMSOpen}
        onClose={() => setIsCMSOpen(false)}
        services={services}
        studioConfig={studioConfig}
        onUpdateServices={handleUpdateServices}
        onUpdateStudioConfig={handleUpdateStudioConfig}
        onResetDefaults={handleResetDefaults}
      />

      {/* 9. AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        services={services}
        studioConfig={studioConfig}
        onSelectServiceForCalculation={handleSelectForCalculation}
      />

      {/* 10. Floating Quick Actions (AI Agent, WhatsApp & CMS Quick Access) */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2.5">
        {/* Floating Admin Elena Trigger */}
        <button
          type="button"
          onClick={() => setIsAIOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition-all cursor-pointer backdrop-blur-xs hover:scale-105"
          title="Tanya Admin Elena (Konsultan Cetak)"
        >
          <Sparkles className="w-4 h-4 text-white animate-spin [animation-duration:4s]" />
          <span>Tanya Admin Elena</span>
          <span className="px-1.5 py-0.2 bg-black/30 rounded text-[9px] font-black uppercase">Online</span>
        </button>

        {/* Floating CMS Pill - Creative Studio Gradient */}
        <button
          type="button"
          onClick={() => setIsCMSOpen(true)}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 border border-white/20 transition-all cursor-pointer backdrop-blur-xs hover:scale-105"
          title="Buka panel CMS untuk mengedit foto & konten"
        >
          <Settings className="w-3.5 h-3.5 text-white group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">Kelola Konten (CMS)</span>
          <span className="sm:hidden">CMS</span>
        </button>

        {/* Floating WhatsApp Bubble */}
        <a
          href={`https://wa.me/${studioConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(studioConfig.brandName)},%20saya%20ingin%20tanya-tanya%20layanan%20cetak.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer font-bold text-xs sm:text-sm"
          title="Tanya Admin Langsung via WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden md:inline">Tanya Bikyn Desain? Admin siap bantu</span>
        </a>
      </div>
    </div>
  );
}
