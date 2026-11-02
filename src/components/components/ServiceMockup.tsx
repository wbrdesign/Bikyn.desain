import React from 'react';
import { Service } from '../types';

interface ServiceMockupProps {
  service: Service;
  className?: string;
  isCompact?: boolean;
}

export const ServiceMockup: React.FC<ServiceMockupProps> = ({ service, className = '', isCompact = false }) => {
  // If user uploaded a custom photo, display it
  if (service.imageUrl && service.imageUrl.trim() !== '') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200/80 ${className}`}>
        <img
          src={service.imageUrl}
          alt={service.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-white backdrop-blur-xs">
          Foto
        </div>
      </div>
    );
  }

  // Otherwise, render styled vector illustration matching screenshot aesthetic (white, orange, black)
  return (
    <div className={`relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-200/90 flex items-center justify-center p-2.5 transition-colors group-hover:border-orange-400 ${className}`}>
      {renderMockupContent(service.svgMockupType, isCompact)}
    </div>
  );
};

function renderMockupContent(type: Service['svgMockupType'], isCompact: boolean) {
  switch (type) {
    case 'document':
      return (
        <div className="w-full max-w-[140px] aspect-[1/1.25] bg-white rounded-md shadow-xs border border-zinc-200 p-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-10 h-1.5 bg-zinc-800 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-5/6 h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-4/5 h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-3/4 h-1 bg-zinc-200 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[8px] text-zinc-400">
            <span className="w-4 h-4 rounded-full border border-orange-500/60 flex items-center justify-center text-[7px] text-orange-600 font-bold">BD</span>
            <span>A4 80gr</span>
          </div>
        </div>
      );

    case 'photocopy':
      return (
        <div className="w-full max-w-[140px] aspect-[1/1.25] bg-white rounded-md shadow-xs border border-zinc-200 p-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-12 h-1.5 bg-zinc-900 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-300 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-300 rounded-full"></div>
            <div className="w-4/5 h-1 bg-zinc-300 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-300 rounded-full"></div>
            <div className="w-2/3 h-1 bg-zinc-300 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[8px] text-zinc-400">
            <span className="w-4 h-4 rounded-full border border-orange-500/60 flex items-center justify-center text-[7px] text-orange-600 font-bold">BD</span>
            <span>F4 70gr</span>
          </div>
        </div>
      );

    case 'laminating':
      return (
        <div className="relative w-full max-w-[140px] aspect-[1/1.25] bg-sky-50/50 rounded-md shadow-xs border border-sky-300/60 p-2 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none"></div>
          <div className="space-y-1.5">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-300 rounded-full"></div>
            <div className="w-5/6 h-1 bg-zinc-300 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-300 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-sky-200 text-[8px] text-sky-700 font-medium">
            <span className="w-4 h-4 rounded-full border border-orange-500 flex items-center justify-center text-[7px] text-orange-600 font-bold">BD</span>
            <span>Glossy Pres</span>
          </div>
        </div>
      );

    case 'typing':
      return (
        <div className="w-full max-w-[140px] aspect-[1/1.25] bg-white rounded-md shadow-xs border border-zinc-200 p-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-8 h-2 bg-orange-600 rounded-xs"></div>
            <div className="w-full h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-full h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-3/4 h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-5/6 h-1 bg-zinc-200 rounded-full"></div>
            <div className="w-2/3 h-1 bg-zinc-200 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[8px] text-zinc-400">
            <span className="w-4 h-4 rounded-full border border-orange-500/60 flex items-center justify-center text-[7px] text-orange-600 font-bold">BD</span>
            <span>Word / PDF</span>
          </div>
        </div>
      );

    case 'banner':
      return (
        <div className="w-full max-w-[160px] aspect-[16/9] bg-zinc-950 rounded-lg p-2.5 flex flex-col justify-between shadow-xs border border-zinc-800 text-center relative">
          <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-zinc-400 border border-zinc-800"></div>
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-zinc-400 border border-zinc-800"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-zinc-400 border border-zinc-800"></div>
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-zinc-400 border border-zinc-800"></div>
          <div className="text-[8px] font-bold text-orange-400 tracking-wider">FLEXI HIGH RESOLUTION</div>
          <div className="text-[11px] font-black text-white tracking-tight uppercase">SPANDUK & BANNER</div>
          <div className="text-[7px] text-zinc-400">OUTDOOR TAHAN HUJAN · BIKYN DESAIN</div>
        </div>
      );

    case 'brochure':
      return (
        <div className="w-full max-w-[140px] aspect-[1/1.25] bg-amber-50 rounded-md shadow-xs border border-amber-200 p-2 flex flex-col justify-between">
          <div className="bg-amber-100/80 rounded p-1 text-center border border-amber-200">
            <span className="text-[8px] font-bold text-amber-900 uppercase tracking-wider">BROSUR FULL COLOR</span>
          </div>
          <div className="space-y-1">
            <div className="w-full h-1 bg-amber-200/80 rounded-full"></div>
            <div className="w-5/6 h-1 bg-amber-200/80 rounded-full"></div>
            <div className="w-3/4 h-1 bg-amber-200/80 rounded-full"></div>
          </div>
          <div className="text-right text-[7px] text-amber-700 font-medium">Art Paper 150gr</div>
        </div>
      );

    case 'menu':
      return (
        <div className="w-full max-w-[140px] aspect-[1/1.25] bg-stone-50 rounded-md shadow-xs border border-stone-200 p-2 flex flex-col justify-between">
          <div className="text-center pb-1 border-b border-stone-200">
            <div className="text-[9px] font-bold text-stone-800 uppercase tracking-tight">DAFTAR MENU</div>
            <div className="text-[7px] text-stone-500 italic">Coffee & Bakery</div>
          </div>
          <div className="space-y-1 text-[8px] text-stone-700">
            <div className="flex justify-between"><span>Espresso</span><span className="font-semibold text-orange-600">15k</span></div>
            <div className="flex justify-between"><span>Latte Art</span><span className="font-semibold text-orange-600">20k</span></div>
            <div className="flex justify-between"><span>Roti Bakar</span><span className="font-semibold text-orange-600">18k</span></div>
          </div>
          <div className="text-center text-[7px] text-stone-400">Laminasi Glossy Awet</div>
        </div>
      );

    case 'sticker':
      return (
        <div className="relative w-full max-w-[140px] aspect-square bg-orange-50/60 rounded-xl p-2 flex items-center justify-center border border-orange-200/60">
          <div className="w-16 h-16 rounded-full bg-zinc-950 border-2 border-dashed border-orange-500 flex flex-col items-center justify-center text-center p-1 shadow-xs">
            <span className="text-[7px] text-orange-400 font-bold uppercase tracking-wider">LABEL</span>
            <span className="text-[8px] text-white font-extrabold uppercase">KEMASAN</span>
            <span className="text-[6px] text-zinc-400">DIE-CUT READY</span>
          </div>
          <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-orange-400/40 rounded-xs rotate-12"></div>
        </div>
      );

    case 'namecard':
      return (
        <div className="w-full max-w-[150px] aspect-[1.75/1] bg-zinc-900 rounded-md shadow-xs border border-zinc-700 p-2 flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-extrabold text-white tracking-wide">BIKYN DESAIN</span>
            <span className="text-[7px] text-orange-400 font-medium">STUDIO CETAK</span>
          </div>
          <div>
            <div className="text-[7px] text-zinc-300 font-medium">Creative Home Printing</div>
            <div className="text-[6px] text-zinc-500">WhatsApp · Online File Service</div>
          </div>
        </div>
      );

    case 'receipt':
      return (
        <div className="w-full max-w-[140px] aspect-[1/1.2] bg-white rounded-md shadow-xs border border-zinc-300 p-2 flex flex-col justify-between font-mono text-[7px]">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-1">
            <span className="font-bold text-zinc-800">NOTA KONTAN</span>
            <span className="text-orange-600 font-semibold">No. 0182</span>
          </div>
          <div className="space-y-0.5 text-zinc-600 text-[6.5px]">
            <div className="flex justify-between"><span>Cetak Stiker</span><span>Rp 40.000</span></div>
            <div className="flex justify-between"><span>Banner 2x1</span><span>Rp 50.000</span></div>
          </div>
          <div className="flex justify-between pt-1 border-t border-dashed border-zinc-300 font-bold text-zinc-900">
            <span className="text-orange-600">LUNAS</span>
            <span>2-Ply NCR</span>
          </div>
        </div>
      );

    case 'pasphoto':
      return (
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-10 h-14 bg-red-600 rounded-xs shadow-xs border border-zinc-200 p-1 flex flex-col items-center justify-end">
            <div className="w-5 h-5 rounded-full bg-zinc-800 mb-0.5"></div>
            <div className="w-7 h-4 bg-zinc-800 rounded-t-md"></div>
          </div>
          <div className="w-10 h-14 bg-blue-600 rounded-xs shadow-xs border border-zinc-200 p-1 flex flex-col items-center justify-end">
            <div className="w-5 h-5 rounded-full bg-zinc-800 mb-0.5"></div>
            <div className="w-7 h-4 bg-zinc-800 rounded-t-md"></div>
          </div>
        </div>
      );

    case 'polaroid':
      return (
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-18 bg-white rounded-xs shadow-xs border border-zinc-200 p-1.5 pb-3 flex flex-col items-center -rotate-6">
            <div className="w-full h-11 bg-zinc-900 rounded-xs flex items-center justify-center text-[7px] text-zinc-400">
              PAS FOTO 4x6
            </div>
            <span className="text-[6px] text-zinc-400 mt-1">BACKGROUND RESMI</span>
          </div>
          <div className="w-14 h-18 bg-white rounded-xs shadow-xs border border-zinc-200 p-1.5 pb-3 flex flex-col items-center rotate-6 -ml-3">
            <div className="w-full h-11 bg-gradient-to-tr from-amber-600 to-orange-400 rounded-xs flex items-center justify-center text-[7px] text-white font-bold">
              ESTETIK
            </div>
            <span className="text-[6px] text-zinc-500 mt-1 font-sans">Sweet Memories · 2026</span>
          </div>
        </div>
      );

    case 'photo2r':
      return (
        <div className="w-full max-w-[130px] aspect-[4/3] bg-white rounded-md shadow-xs border border-zinc-200 p-1.5 flex gap-1 items-center">
          <div className="flex-1 h-full bg-zinc-900 rounded-xs flex items-center justify-center text-[7px] text-zinc-400">2R</div>
          <div className="flex-1 h-full bg-gradient-to-br from-orange-500 to-amber-500 rounded-xs flex items-center justify-center text-[7px] text-white font-bold">4R</div>
          <div className="flex-1 h-full bg-zinc-800 rounded-xs flex items-center justify-center text-[7px] text-zinc-400">10R</div>
        </div>
      );

    case 'invitation':
    case 'blanko':
    case 'birthday':
      return (
        <div className="w-full max-w-[140px] aspect-[1.3/1] bg-amber-50/70 rounded-md shadow-xs border border-amber-200/90 p-2 flex flex-col justify-between text-center">
          <div className="text-[7px] tracking-widest text-amber-800 font-serif uppercase">WALIMATUL URSY</div>
          <div>
            <div className="text-[9px] font-bold text-zinc-800 font-serif">Undangan Khusus</div>
            <div className="w-8 h-0.5 bg-orange-500 mx-auto mt-0.5"></div>
          </div>
          <div className="flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[7px] font-bold flex items-center justify-center">BD</span>
          </div>
        </div>
      );

    case 'certificate':
      return (
        <div className="w-full max-w-[140px] aspect-[1.3/1] bg-white rounded-md shadow-xs border-2 border-orange-500/80 p-2 flex flex-col justify-between text-center relative">
          <div className="text-[8px] font-bold text-zinc-900 tracking-wider uppercase">SERTIFIKAT</div>
          <div className="space-y-1">
            <div className="w-16 h-1 bg-zinc-300 rounded-full mx-auto"></div>
            <div className="w-24 h-1 bg-zinc-200 rounded-full mx-auto"></div>
          </div>
          <div className="flex justify-between items-center px-1">
            <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-500 flex items-center justify-center text-[6px] text-white font-bold">★</div>
            <div className="w-8 h-1 bg-zinc-300 rounded-full"></div>
          </div>
        </div>
      );

    case 'design':
    case 'cv':
    case 'email':
    default:
      return (
        <div className="w-full max-w-[150px] aspect-[1.5/1] bg-zinc-950 rounded-lg p-2.5 flex flex-col justify-between shadow-xs border border-zinc-800 text-left">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-[7px] text-zinc-400 font-mono">VECTOR .AI / .PDF</span>
          </div>
          <div className="h-6 flex items-center justify-center">
            <div className="w-16 h-4 border-t-2 border-orange-500 rounded-t-full"></div>
          </div>
          <div className="flex justify-between text-[7px] text-zinc-400 font-mono">
            <span>ATS / CV / Logo</span>
            <span className="text-orange-400">Siap Cetak</span>
          </div>
        </div>
      );
  }
}
