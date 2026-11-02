import React, { useState, useRef } from 'react';
import { Service, StudioConfig, ServiceCategory } from '../types';
import { ServiceMockup } from './ServiceMockup';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Save,
  Download,
  RotateCcw,
  Sparkles,
  Settings,
  Layers,
  Image as ImageIcon,
  Check,
  Globe,
  FileCode,
  AlertCircle,
  Lock,
  ShieldCheck,
  KeyRound,
  LogOut,
} from 'lucide-react';

interface CMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  studioConfig: StudioConfig;
  onUpdateServices: (services: Service[]) => void;
  onUpdateStudioConfig: (config: StudioConfig) => void;
  onResetDefaults: () => void;
}

export const CMSModal: React.FC<CMSModalProps> = ({
  isOpen,
  onClose,
  services,
  studioConfig,
  onUpdateServices,
  onUpdateStudioConfig,
  onResetDefaults,
}) => {
  // Semua state React diletakkan di paling atas (Rules of Hooks)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'services' | 'profile' | 'export'>('services');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const [localConfig, setLocalConfig] = useState<StudioConfig>(studioConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Bismillah1234') {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Kata sandi salah. Silakan coba lagi.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError('');
  };

  // If not authenticated, render secure password prompt
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-orange-500 flex items-center justify-center mb-4 shadow-lg border border-zinc-800">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-zinc-950 tracking-tight">
              Akses Terproteksi CMS
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 max-w-xs leading-relaxed">
              Masukkan kata sandi otentikasi administrator untuk mengelola konten dan foto studio.
            </p>

            <form onSubmit={handleAuthSubmit} className="w-full mt-6 space-y-4">
              <div>
                <label className="block text-left text-xs font-semibold text-zinc-700 mb-1.5">
                  Kata Sandi Administrator
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    autoFocus
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 focus:border-orange-500 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 transition-all tracking-widest placeholder:tracking-normal placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer group"
              >
                <ShieldCheck className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Masuk ke CMS</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-100 w-full flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <Lock className="w-3 h-3 text-orange-500" />
              <span>Area terbatas khusus pemilik & pengelola website</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateAIDescription = async () => {
    if (!currentService || !currentService.title) {
      alert('Isi judul layanan terlebih dahulu sebelum membuat deskripsi AI.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentService.title,
          category: currentService.category,
        }),
      });

      if (!res.ok) throw new Error('Gagal menghubungi AI');
      const data = await res.json();

      if (data.description) handleServiceChange('description', data.description);
      if (data.price) handleServiceChange('price', data.price);
      if (data.duration) handleServiceChange('duration', data.duration);
      if (data.minOrder) handleServiceChange('minOrder', data.minOrder);
      if (data.specifications && Array.isArray(data.specifications)) {
        handleServiceChange('specifications', data.specifications);
      }
      if (data.paperOptions && Array.isArray(data.paperOptions)) {
        handleServiceChange('paperOptions', data.paperOptions);
      }
      alert('Konten layanan berhasil dibuatkan oleh Agen AI!');
    } catch (e: any) {
      console.error(e);
      alert('Gagal membuat konten AI. Pastikan server aktif.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const currentService = localServices.find((s) => s.id === selectedServiceId) || localServices[0];

  const handleServiceChange = (field: keyof Service, value: any) => {
    if (!currentService) return;
    setLocalServices((prev) =>
      prev.map((s) => (s.id === currentService.id ? { ...s, [field]: value } : s))
    );
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentService) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 3MB untuk performa optimal.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleServiceChange('imageUrl', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    handleServiceChange('imageUrl', '');
  };

  const handleAddNewService = () => {
    const newId = `layanan-${Date.now()}`;
    const newSvc: Service = {
      id: newId,
      title: 'LAYANAN BARU',
      category: 'Dokumen',
      categoryLabel: 'Dokumen',
      minOrder: '1 pcs',
      description: 'Deskripsi lengkap layanan cetak / desain baru di studio Anda.',
      price: 'Mulai Rp 10.000',
      priceUnit: 'pcs',
      duration: '1 hari kerja',
      svgMockupType: 'document',
      specifications: ['Kualitas cetak terjamin', 'Pengerjaan cepat'],
      paperOptions: ['Standar'],
    };

    setLocalServices((prev) => [newSvc, ...prev]);
    setSelectedServiceId(newId);
  };

  const handleDeleteService = (id: string) => {
    if (localServices.length <= 1) {
      alert('Minimal harus ada 1 layanan tersisa.');
      return;
    }
    if (confirm('Yakin ingin menghapus layanan ini dari katalog?')) {
      const filtered = localServices.filter((s) => s.id !== id);
      setLocalServices(filtered);
      if (selectedServiceId === id) {
        setSelectedServiceId(filtered[0]?.id || '');
      }
    }
  };

  const handleSaveAll = () => {
    onUpdateServices(localServices);
    onUpdateStudioConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const payload = {
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      studioConfig: localConfig,
      services: localServices,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bikyn-desain-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.services && parsed.studioConfig) {
          setLocalServices(parsed.services);
          setLocalConfig(parsed.studioConfig);
          onUpdateServices(parsed.services);
          onUpdateStudioConfig(parsed.studioConfig);
          alert('Data berhasil di-import dari file JSON!');
        } else {
          alert('Format file JSON tidak sesuai struktur.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan file valid.');
      }
    };
    reader.readAsText(file);
  };

  const filteredServices = localServices.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-orange-400/30 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  CMS Manajemen Konten & Foto
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/30 text-orange-400 border border-orange-500/40">
                  GitHub & Vercel Ready
                </span>
              </div>
              <p className="text-xs text-orange-100">
                Ubah foto layanan, harga, teks hero, dan informasi studio secara mudah & cepat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer backdrop-blur-xs border border-white/20"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Kunci CMS (Keluar sesi admin)"
            >
              <LogOut className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Kunci CMS</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-7 py-2.5 bg-zinc-100 border-b border-zinc-200 text-xs sm:text-sm font-semibold text-zinc-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 font-bold'
                : 'hover:text-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4 text-orange-600" />
            <span>Katalog Layanan & Foto ({localServices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 font-bold'
                : 'hover:text-zinc-900'
            }`}
          >
            <Globe className="w-4 h-4 text-orange-600" />
            <span>Pengaturan Studio & Teks Hero</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'export'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 font-bold'
                : 'hover:text-zinc-900'
            }`}
          >
            <FileCode className="w-4 h-4 text-orange-600" />
            <span>Backup & Panduan GitHub / Vercel</span>
          </button>
        </div>

        {/* Tab 1: Services & Photo Manager */}
        {activeTab === 'services' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
            {/* Left list of services */}
            <div className="md:col-span-5 border-r border-zinc-200 flex flex-col h-full bg-zinc-50/70 overflow-hidden">
              <div className="p-3 border-b border-zinc-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    placeholder="Cari layanan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewService}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer"
                    title="Tambah layanan baru"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-zinc-200/60 p-2 space-y-1">
                {filteredServices.map((svc) => {
                  const isSelected = svc.id === currentService?.id;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-orange-50 border border-orange-200 shadow-xs'
                          : 'hover:bg-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-zinc-200 bg-white flex items-center justify-center">
                          {svc.imageUrl ? (
                            <img
                              src={svc.imageUrl}
                              alt={svc.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ServiceMockup type={svc.svgMockupType} className="w-full h-full p-1" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">{svc.title}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <span className="font-semibold text-orange-600">{svc.price}</span>
                            <span>•</span>
                            <span className="truncate">{svc.category}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                        {svc.imageUrl ? '📷 Foto' : '🎨 Vektor'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Editor Form */}
            <div className="md:col-span-7 flex flex-col h-full overflow-y-auto p-4 sm:p-6 bg-white space-y-5">
              {currentService ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div>
                      <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                        Edit Layanan ID: {currentService.id}
                      </span>
                      <h3 className="text-base font-extrabold text-zinc-900">
                        {currentService.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(currentService.id)}
                      className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Layanan</span>
                    </button>
                  </div>

                  {/* Section Foto Layanan */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                    <label className="block text-xs font-bold text-zinc-900">
                      Foto Sampel Hasil Cetak / Desain
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-zinc-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative group">
                        {currentService.imageUrl ? (
                          <img
                            src={currentService.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-2 w-full h-full flex flex-col items-center justify-center text-zinc-400 text-center">
                            <ServiceMockup
                              type={currentService.svgMockupType}
                              className="w-12 h-12 mb-1"
                            />
                            <span className="text-[9px]">Ilustrasi Default</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Foto dari Galeri</span>
                          </button>

                          {currentService.imageUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="px-3 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Gunakan Ilustrasi Bawaan
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-normal">
                          Format JPG / PNG / WEBP maks 3MB. Foto langsung disimpan di memori browser dan tersimpan otomatis.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form detail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Nama / Judul Layanan
                      </label>
                      <input
                        type="text"
                        value={currentService.title}
                        onChange={(e) => handleServiceChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Kategori Layanan
                      </label>
                      <select
                        value={currentService.category}
                        onChange={(e) => {
                          const val = e.target.value as ServiceCategory;
                          handleServiceChange('category', val);
                          handleServiceChange('categoryLabel', val);
                        }}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Dokumen">Print & Dokumen</option>
                        <option value="Promosi">Promosi & Bisnis UMKM</option>
                        <option value="Foto">Foto & Polaroid</option>
                        <option value="Undangan">Undangan & Acara</option>
                        <option value="Digital">Jasa Desain & Digital</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Label Harga Katalog
                      </label>
                      <input
                        type="text"
                        value={currentService.price}
                        onChange={(e) => handleServiceChange('price', e.target.value)}
                        placeholder="Mulai Rp 500 / lembar"
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Estimasi Pengerjaan
                      </label>
                      <input
                        type="text"
                        value={currentService.duration}
                        onChange={(e) => handleServiceChange('duration', e.target.value)}
                        placeholder="1-2 jam / 1 hari"
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Minimal Pemesanan
                      </label>
                      <input
                        type="text"
                        value={currentService.minOrder}
                        onChange={(e) => handleServiceChange('minOrder', e.target.value)}
                        placeholder="1 lembar / 1 pcs"
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-zinc-700">
                          Deskripsi Lengkap
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateAIDescription}
                          disabled={isGeneratingAI}
                          className="flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3 text-orange-500" />
                          <span>{isGeneratingAI ? 'AI Menyusun Konten...' : 'Buat Konten dengan AI (Free)'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={currentService.description}
                        onChange={(e) => handleServiceChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-zinc-400 text-sm">
                  Pilih layanan di daftar kiri untuk mulai mengedit.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Profile & Hero */}
        {activeTab === 'profile' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 max-w-3xl space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider pb-2 border-b border-zinc-200">
              Identitas & Kontak Studio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nama Brand Studio
                </label>
                <input
                  type="text"
                  value={localConfig.brandName}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, brandName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nomor WhatsApp Pemesanan
                </label>
                <input
                  type="text"
                  value={localConfig.whatsappNumber}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, whatsappNumber: e.target.value })
                  }
                  placeholder="6281234567890"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Judul Utama Hero (Header Besar)
                </label>
                <input
                  type="text"
                  value={localConfig.heroTitle}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, heroTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Sub-Judul Hero
                </label>
                <textarea
                  rows={2}
                  value={localConfig.heroSubtitle}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, heroSubtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Alamat / Wilayah Layanan Studio
                </label>
                <input
                  type="text"
                  value={localConfig.address}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Backup & Export */}
        {activeTab === 'export' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 max-w-3xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                Backup & Sinkronisasi Data
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Data disimpan di memori browser. Anda bisa mengekspor file cadangan agar data tidak hilang saat membersihkan riwayat browser.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold text-zinc-900">Download Cadangan (Export JSON)</h4>
              <p className="text-xs text-zinc-500">
                Simpan semua daftar layanan, harga, foto, dan profil ke satu file JSON.
              </p>
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File Cadangan (JSON)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold text-zinc-900">Pulihkan Data (Import JSON)</h4>
              <p className="text-xs text-zinc-500">
                Pulihkan data dari file cadangan yang telah Anda unduh sebelumnya.
              </p>
              <input
                type="file"
                ref={jsonInputRef}
                onChange={handleImportJSON}
                accept=".json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => jsonInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih File Backup JSON</span>
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembalikan semua layanan dan profil ke pengaturan awal bawaan?')) {
                    onResetDefaults();
                    alert('Data berhasil di-reset ke bawaan awal!');
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Pengaturan Awal (Default Pabrik)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
