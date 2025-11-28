"use client";
import Image from 'next/image';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const BANNER_IMAGES = [
  "/images/logos/bannerclient.png",
  "/images/logos/bannerclient2.png",
  "/images/logos/bannerclient3.png",
  "/images/logos/bannerclient4.png",
  "/images/logos/bannerclient5.png",
];

const BADGES = [
  { name: "OSS Indonesia", src: "/images/logos/oss.png", desc: "NIB Terverifikasi" },
  { name: "Kemenkumham", src: "/images/logos/kemenkumham.png", desc: "AHU Resmi" },
  { name: "LPJK (PUPR)", src: "/images/logos/pupr.jpg", desc: "SBU Konstruksi" },
  { name: "DJK (ESDM)", src: "/images/logos/esdm.png", desc: "SBUJPTL/SBUJPT" },
  { name: "Dirjen Pajak", src: "/images/logos/djp.png", desc: "PKP & KSWP Valid" },
];

export default function ClientMarquee() {
  const marqueeItems = [...BANNER_IMAGES, ...BANNER_IMAGES, ...BANNER_IMAGES, ...BANNER_IMAGES];

  return (
    <section className="relative py-24 bg-stone-50 overflow-hidden font-sans border-t border-stone-200">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
      
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 z-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
             <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white border border-stone-200 rounded-full shadow-sm">
                <ShieldCheck size={14} className="text-[#1e40af]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Legalitas Terjamin
                </span>
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
               Fondasi Bisnis yang <br/>
               <span className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
                 Diakui Negara.
               </span>
             </h2>
          </div>
          <p className="text-stone-500 text-sm md:text-base max-w-md text-right md:text-left leading-relaxed">
            Kami menjamin setiap dokumen yang diterbitkan terdaftar resmi di database kementerian dan instansi terkait.
          </p>
        </div>

        {/* --- PART 1: GOVERNMENT AUTHORITY --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-32">
           {BADGES.map((badge, idx) => (
             <div 
               key={idx} 
               className="group relative bg-white rounded-2xl p-4 border border-stone-100 hover:border-blue-100 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 group-hover:bg-gradient-to-r group-hover:from-[#1e40af] group-hover:to-[#3b82f6] transition-all duration-500"></div>
                <div className="flex flex-col items-center text-center h-full justify-between gap-4 pt-2">
                   <div className="w-16 h-16 relative flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                      <Image
                        src={badge.src}
                        alt={badge.name}
                        width={60} height={60}
                        className="object-contain max-h-12 w-auto"
                      />
                   </div>
                   <div>
                     <h4 className="text-xs font-bold text-stone-700 group-hover:text-[#1e40af] transition-colors mb-1">{badge.name}</h4>
                     <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-50 rounded text-[10px] text-stone-400 group-hover:text-green-600 group-hover:bg-green-50 transition-colors">
                        <CheckCircle2 size={10} /> {badge.desc}
                     </div>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* --- PART 2: LOGO KLIEN (RAPAT & BESAR) --- */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-16">
             <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent"></span>
             <span className="text-xs font-bold text-stone-400 uppercase tracking-widest bg-stone-50 px-4">
               Dipercaya Oleh
             </span>
             <span className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent"></span>
          </div>

          <div className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_5%,_black_95%,transparent_100%)]">
            
            {/* UPDATED GAP: gap-8 (Mobile) & md:gap-16 (Desktop) */}
            <div className="flex w-max items-center gap-8 md:gap-16 animate-scroll py-8">
              {marqueeItems.map((src, idx) => (
                <div 
                  key={idx} 
                  // UKURAN TETAP BESAR: 300px (Mobile) / 500px (Desktop)
                  className="relative w-[300px] h-[150px] md:w-[500px] md:h-[250px] group opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src={src}
                    alt="Client Logo"
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 300px, 500px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}