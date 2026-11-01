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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'services' | 'profile' | 'export'>('services');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const [localConfig, setLocalConfig] = useState<StudioConfig>(studioConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

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
              <p className="text-xs text-zinc-400">
                Ubah foto layanan, harga, teks hero, dan informasi studio secara mudah & cepat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
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
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Kunci CMS (Keluar sesi admin)"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Kunci CMS</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
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
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                : 'hover:text-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4 text-orange-600" />
            <span>Katalog Layanan & Foto ({localServices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                : 'hover:text-zinc-900'
            }`}
          >
            <Globe className="w-4 h-4 text-orange-600" />
            <span>Pengaturan Studio & Teks Hero</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'export'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
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
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
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
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-xs font-semibold'
                          : 'hover:bg-zinc-200/60 text-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-200 shrink-0 border border-white/20">
                          {svc.imageUrl ? (
                            <img src={svc.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold bg-zinc-800 text-white">
                              BD
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <div className="text-xs truncate">{svc.title}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-orange-100' : 'text-zinc-500'}`}>
                            {svc.price} · {svc.category}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(svc.id);
                        }}
                        className={`p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity ${
                          isSelected ? 'text-white hover:bg-orange-600' : 'text-zinc-400 hover:text-rose-600'
                        }`}
                        title="Hapus layanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right form editor for active service */}
            {currentService && (
              <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-5 bg-white">
                {/* PHOTO UPDATE SECTION */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-orange-600" />
                      Update Foto Layanan
                    </span>
                    {currentService.imageUrl && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                        Menggunakan Foto Khusus
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Visual preview */}
                    <div className="w-32 h-24 rounded-xl overflow-hidden shrink-0 border border-zinc-200 bg-white">
                      <ServiceMockup service={currentService} className="w-full h-full" isCompact={true} />
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Foto Baru</span>
                        </button>

                        {currentService.imageUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-lg text-xs font-medium transition-colors"
                          >
                            Pakai Mockup Default
                          </button>
                        )}
                      </div>

                      {/* URL input */}
                      <div>
                        <input
                          type="text"
                          placeholder="Atau tempel Link URL Foto (https://...)"
                          value={currentService.imageUrl || ''}
                          onChange={(e) => handleServiceChange('imageUrl', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800 placeholder:text-zinc-400 focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Judul Layanan</label>
                    <input
                      type="text"
                      value={currentService.title}
                      onChange={(e) => handleServiceChange('title', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Kategori</label>
                    <select
                      value={currentService.category}
                      onChange={(e) => {
                        const val = e.target.value as ServiceCategory;
                        handleServiceChange('category', val);
                        handleServiceChange('categoryLabel', val);
                      }}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Dokumen">Dokumen (Print & Fotokopi)</option>
                      <option value="Promosi">Promosi (Banner, Stiker, Kartu Nama)</option>
                      <option value="Foto">Foto & Polaroid</option>
                      <option value="Undangan">Undangan & Acara</option>
                      <option value="Digital">Digital & Desain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Harga Tampilan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Mulai Rp 500 / lbr"
                      value={currentService.price}
                      onChange={(e) => handleServiceChange('price', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 font-bold text-orange-600 focus:bg-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Minimal Order</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1 lembar / 50 pcs"
                      value={currentService.minOrder}
                      onChange={(e) => handleServiceChange('minOrder', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:bg-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Estimasi Pengerjaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: 10 - 30 menit / 1 - 2 hari"
                      value={currentService.duration}
                      onChange={(e) => handleServiceChange('duration', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:bg-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Varian Kertas (pisahkan koma)</label>
                    <input
                      type="text"
                      placeholder="Contoh: HVS 70gr, HVS 80gr, Art Paper"
                      value={(currentService.paperOptions || []).join(', ')}
                      onChange={(e) =>
                        handleServiceChange(
                          'paperOptions',
                          e.target.value.split(',').map((x) => x.trim()).filter(Boolean)
                        )
                      }
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:bg-white focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-700">Deskripsi Layanan Singkat</label>
                    <button
                      type="button"
                      disabled={isGeneratingAI}
                      onClick={handleGenerateAIDescription}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                      title="AI akan otomatis menyusun deskripsi, estimasi harga, waktu dan spesifikasi"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                      <span>{isGeneratingAI ? 'AI Menyusun Konten...' : 'Buat Konten dengan AI (Free)'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={currentService.description}
                    onChange={(e) => handleServiceChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Spesifikasi Lengkap (1 baris per poin)
                  </label>
                  <textarea
                    rows={3}
                    value={(currentService.specifications || []).join('\n')}
                    onChange={(e) =>
                      handleServiceChange('specifications', e.target.value.split('\n').filter(Boolean))
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Studio Profile & Hero Text */}
        {activeTab === 'profile' && (
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm sm:text-base mb-1">
                Teks Header & Hero Halaman Depan
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Ubah judul besar dan teks sambutan yang muncul pertama kali di website
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Nama Brand / Usaha</label>
                  <input
                    type="text"
                    value={localConfig.brandName}
                    onChange={(e) => setLocalConfig({ ...localConfig, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm font-bold text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Sub-Brand / Tagline Singkat</label>
                  <input
                    type="text"
                    value={localConfig.subBrand}
                    onChange={(e) => setLocalConfig({ ...localConfig, subBrand: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Judul Besar Hero</label>
                  <input
                    type="text"
                    value={localConfig.heroTitle}
                    onChange={(e) => setLocalConfig({ ...localConfig, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm font-extrabold text-zinc-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Deskripsi Hero</label>
                  <textarea
                    rows={2}
                    value={localConfig.heroSubtitle}
                    onChange={(e) => setLocalConfig({ ...localConfig, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm sm:text-base mb-1">
                Kontak WhatsApp & Media Sosial
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Pesan dari kalkulator otomatis dikirim ke nomor WhatsApp ini
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nomor WhatsApp Tujuan (Angka saja, awalan 62)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 6285712345678"
                    value={localConfig.whatsappNumber}
                    onChange={(e) => setLocalConfig({ ...localConfig, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm font-mono font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nomor WhatsApp Tampilan (Format teks)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0857-1234-5678"
                    value={localConfig.whatsappDisplayNumber}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, whatsappDisplayNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm font-medium text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Nama Admin CS</label>
                  <input
                    type="text"
                    value={localConfig.adminName}
                    onChange={(e) => setLocalConfig({ ...localConfig, adminName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Studio</label>
                  <input
                    type="email"
                    value={localConfig.email}
                    onChange={(e) => setLocalConfig({ ...localConfig, email: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Instagram (@username)</label>
                  <input
                    type="text"
                    value={localConfig.instagram}
                    onChange={(e) => setLocalConfig({ ...localConfig, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">TikTok (@username)</label>
                  <input
                    type="text"
                    value={localConfig.tiktok}
                    onChange={(e) => setLocalConfig({ ...localConfig, tiktok: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Alamat Studio / Catatan Pengambilan</label>
                  <input
                    type="text"
                    value={localConfig.address}
                    onChange={(e) => setLocalConfig({ ...localConfig, address: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GitHub & Vercel Sync */}
        {activeTab === 'export' && (
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-orange-950">Dukungan Penuh GitHub & Vercel</h4>
                <p className="text-xs text-orange-800 mt-1 leading-relaxed">
                  Kode dibuat dengan standar modern Vite + React SPA + TypeScript yang 100% kompatibel untuk di-push ke GitHub dan di-deploy ke Vercel tanpa konfigurasi rumit.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Backup Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
                  <Download className="w-4 h-4 text-orange-600" />
                  <span>Download Backup Data (JSON)</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Simpan seluruh data layanan, foto terunggah, dan profil studio ke dalam file JSON di komputer Anda.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File JSON</span>
                </button>
              </div>

              {/* Restore Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
                  <Upload className="w-4 h-4 text-orange-600" />
                  <span>Restore Data dari JSON</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Kembalikan atau import data katalog dari file JSON yang pernah Anda download sebelumnya.
                </p>
                <input
                  type="file"
                  ref={jsonInputRef}
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => jsonInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Pilih File JSON</span>
                </button>
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-zinc-900">Reset ke Katalog Awal (Default)</h5>
                <p className="text-[11px] text-zinc-500">Kembalikan 20 layanan dan profil awal seperti di lampiran.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembalikan semua layanan dan konfigurasi ke bawaan awal?')) {
                    onResetDefaults();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-200 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
