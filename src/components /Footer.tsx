import React from 'react';
import { StudioConfig } from '../types';
import { MessageCircle, Mail, Instagram, MapPin, Clock, Settings, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  studioConfig: StudioConfig;
  onOpenCMS: () => void;
  serviceCount: number;
  onNavigateCatalog?: () => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  studioConfig,
  onOpenCMS,
  serviceCount,
  onNavigateCatalog,
  onNavigateHome,
}) => {
  const cleanPhone = studioConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white pt-14 pb-10 border-t-4 border-orange-300/40 relative overflow-hidden shadow-2xl">
      {/* Decorative ambient studio glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-white/20">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-5 space-y-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white text-orange-600 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center font-black text-base tracking-tight">
                BD
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight group-hover:text-orange-100 transition-colors">
                  {studioConfig.brandName}
                </span>
                <span className="block text-xs text-orange-100 font-semibold tracking-wide">
                  {studioConfig.subBrand}
                </span>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed max-w-sm font-medium">
              Studio kreatif percetakan & desain grafis rumahan. Melayani print dokumen, foto estetik, media promosi UMKM, undangan hajatan, hingga CV profesional dengan pesanan praktis via WhatsApp.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-orange-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span className="font-semibold">{studioConfig.hoursWeekday}</span>
              </div>
              <div className="flex items-center gap-2 pl-6 text-orange-200">
                <span>{studioConfig.hoursWeekend}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-lg inline-block">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-orange-100 font-medium">
              <li>
                <button
                  type="button"
                  onClick={onNavigateCatalog}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>Katalog {serviceCount} Layanan Lengkap</span>
                </button>
              </li>
              <li>
                <a
                  href="#hitung-pesanan"
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>Simulasi & Rincian Pesanan</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCMS}
                  className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-orange-200" />
                  <span>Kelola Konten & Foto (CMS)</span>
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(studioConfig.brandName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>Konsultasi Khusus / Custom Order</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Social Media */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-lg inline-block">
              Kontak & Media Sosial
            </h4>

            <div className="flex items-start gap-2 text-xs text-orange-100">
              <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>{studioConfig.address}</span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-white pt-2">
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-all text-white font-semibold backdrop-blur-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>WhatsApp: {studioConfig.whatsappDisplayNumber || studioConfig.whatsappNumber}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${studioConfig.email}`}
                  className="flex items-center gap-2 hover:text-orange-200 transition-colors pl-2"
                >
                  <Mail className="w-4 h-4 text-orange-200 shrink-0" />
                  <span>{studioConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${studioConfig.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-orange-200 transition-colors pl-2"
                >
                  <Instagram className="w-4 h-4 text-pink-200 shrink-0" />
                  <span>Instagram: {studioConfig.instagram}</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-orange-100 pl-2">
                  <span className="w-4 text-center font-black text-xs text-white">TT</span>
                  <span>TikTok: {studioConfig.tiktok}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-orange-100">
          <div>
            © {new Date().getFullYear()} {studioConfig.brandName}. Studio Kreatif Cetak & Desain.
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>Creative Studio Theme · Fresh & Vibrant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
