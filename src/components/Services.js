"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase, ArrowRight, CheckCircle2, Sparkles, PhoneCall,
  Scale, FileText, Building2, HardHat, Zap, ShieldCheck,
  Calculator, Gavel
} from 'lucide-react';
import { servicesData } from '@/lib/servicesData';
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

// OPTIMASI 1: Static Icon Map (Tree Shaking)
// Menggantikan "import * as LucideIcons" yang memuat ribuan icon.
// Hanya icon yang didaftarkan di sini yang akan masuk ke bundle JavaScript.
const ICON_MAP = {
  Briefcase,
  Scale,
  FileText,
  Building2,
  HardHat,
  Zap,
  ShieldCheck,
  Calculator,
  Gavel,
  // Fallback default
  Default: Briefcase 
};

export default function Services() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [whatsappNumber, setWhatsappNumber] = useState('6281399710085'); // Default value

  useEffect(() => {
    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.mainNumber || '6281399710085');
    };

    loadWhatsappSettings();
  }, []);

  // OPTIMASI 2: Memoization Data Kategori
  // Mencegah looping `.map` dan `new Set` dijalankan ulang setiap kali render
  const categories = useMemo(() => {
    return ["Semua", ...new Set(servicesData.map(item => item.category))];
  }, []);

  // OPTIMASI 3: Memoization Filter List
  // Filter hanya berjalan jika `activeTab` benar-benar berubah
  const filtered = useMemo(() => {
    return activeTab === "Semua"
      ? servicesData
      : servicesData.filter(item => item.category === activeTab);
  }, [activeTab]);

  return (
    <section 
      id="layanan" 
      className="py-24 bg-stone-50 font-sans relative overflow-hidden min-h-screen border-b border-stone-200"
    >
      {/* Background Pattern - CSS Only (Lebih ringan daripada memuat gambar eksternal) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af05_1px,transparent_1px),linear-gradient(to_bottom,#1e40af05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Decorative Blob - Added will-change for compositor layer promotion */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none opacity-40 will-change-transform"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 border-b border-stone-200/60 pb-10">
           <div className="max-w-2xl">
              <span className="text-[#1e40af] font-bold tracking-widest text-xs uppercase mb-3 block">
                 Daftar Layanan
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight tracking-tight">
                 Legalitas Terpadu <br/>
                 <span className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
                   Untuk Bisnis Maju.
                 </span>
              </h2>
           </div>
           
           {/* Filter Tabs */}
           <div className="flex flex-wrap gap-2 justify-end">
              {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setActiveTab(cat)}
                   // Menambahkan touch-manipulation untuk respon lebih cepat di mobile
                   className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border touch-manipulation ${
                     activeTab === cat
                       ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white border-transparent shadow-lg shadow-blue-900/20 transform scale-105'
                       : 'bg-white text-stone-500 border-stone-200 hover:border-[#1e40af] hover:text-[#1e40af] hover:shadow-sm'
                   }`}
                 >
                   {cat}
                 </button>
              ))}
           </div>
        </div>

        {/* --- LIST VIEW LAYOUT --- */}
        {/* Content-visibility: auto membantu browser menunda rendering elemen di luar viewport (lazy rendering native) */}
        <div className="flex flex-col gap-5" style={{ contentVisibility: 'auto' }}>
           {filtered.map((item) => {
             // Resolusi Icon yang aman
             const IconComponent = ICON_MAP[item.icon] || ICON_MAP.Default;
             
             return (
               <div 
                  // Gunakan slug atau ID unik sebagai key, index (idx) tidak disarankan untuk list yang bisa di-filter
                  key={item.slug || item.title}
                  className="group relative bg-white rounded-2xl p-6 md:p-8 border border-stone-100 hover:border-blue-100 transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5 overflow-hidden"
               >
                  {/* Hover Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#1e40af] to-[#3b82f6] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                     {/* ICON */}
                     <div className="shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-stone-50 text-[#1e40af] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#1e40af] group-hover:to-[#3b82f6] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-500/30 md:group-hover:scale-110">
                           <IconComponent size={32} strokeWidth={1.5} />
                        </div>
                     </div>

                     {/* CONTENT */}
                     <div className="grow">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-[#1e40af] border border-blue-100">
                             {item.category}
                           </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 group-hover:text-[#1e40af] transition-colors">
                           {item.title}
                        </h3>
                        <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-2xl">
                           {item.desc}
                        </p>
                        
                        {/* OPTIMASI 4: Animasi Reveal yang lebih performant */}
                        {/* Menggunakan max-height untuk transisi CSS murni, menghindari layout thrashing */}
                        <div className="grid grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                           <div className="overflow-hidden">
                              <div className="mt-4 flex flex-wrap gap-4 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                {item.features.slice(0, 3).map((feat, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                     <CheckCircle2 size={14} className="text-green-500" />
                                     {feat}
                                  </div>
                                ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* ACTION */}
                     <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-8 min-w-[140px]">
                        <div className="text-right hidden md:block">
                           <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Estimasi</p>
                           <p className="text-sm font-bold text-stone-900">3-7 Hari Kerja</p>
                        </div>
                        <Link 
                           href={`/layanan/${item.slug}`}
                           className="w-full md:w-auto px-6 py-3 rounded-xl bg-stone-50 text-stone-600 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-[#1e40af] group-hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95"
                        >
                           Detail <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
        
        {/* Empty State */}
        {filtered.length === 0 && (
           <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200 mt-4">
              <p className="text-stone-400 italic">Belum ada layanan yang sesuai filter ini.</p>
           </div>
        )}

        {/* --- SUPERCHARGED CTA SECTION --- */}
        <div className="mt-24 relative rounded-[2.5rem] overflow-hidden bg-[#1e40af] shadow-2xl shadow-blue-900/20 group isolate transform transition-transform hover:scale-[1.01] duration-500">
           
           {/* Background Effects */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] -z-10"></div>
           {/* Mengganti External URL Texture dengan CSS radial noise atau remove texture untuk speed */}
           <div className="absolute inset-0 opacity-20 mix-blend-overlay -z-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
           
           {/* Abstract Glow Blobs */}
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700 -z-10"></div>
           <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-900/30 rounded-full blur-3xl -z-10"></div>

           <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
              
              {/* Left Content */}
              <div className="max-w-xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
                    <Sparkles size={12} className="text-yellow-300" /> 
                    Layanan Khusus
                 </div>
                 <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                    Tidak Menemukan Layanan <br/> yang Anda Cari?
                 </h3>
                 <p className="text-blue-100 text-lg opacity-90 leading-relaxed font-light">
                    Setiap bisnis memiliki keunikan. Tim ahli kami siap mendiskusikan kebutuhan legalitas spesifik Anda.
                    <span className="block mt-2 font-bold text-white">Gratis sesi konsultasi awal 15 menit.</span>
                 </p>
              </div>

              {/* Right Actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                 <Link
                    href={createWhatsAppUrl(whatsappNumber)}
                    className="px-8 py-4 bg-white text-[#1e40af] rounded-full font-bold text-lg hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 hover:bg-stone-50 active:scale-95"
                 >
                    <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={24} height={24} loading="lazy" />
                    Chat WhatsApp
                 </Link>
                 
                 <Link 
                    href="#kontak" 
                    className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 hover:border-white transition-all flex items-center justify-center gap-3 active:scale-95"
                 >
                    <PhoneCall size={20} /> 
                    Jadwal Telepon
                 </Link>
              </div>

           </div>
        </div>

      </div>
    </section>
  );
}