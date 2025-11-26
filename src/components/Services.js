"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { servicesData } from '@/lib/servicesData';

export default function Services() {
  const [activeTab, setActiveTab] = useState("Semua");
  
  // Warna Brand Utama
  const BRAND_BG = "bg-[#2a3f9b]";
  const BRAND_TEXT = "text-[#2a3f9b]";

  // Ambil Kategori Unik
  const categories = ["Semua", ...new Set(servicesData.map(item => item.category))];

  // Filter Logic
  const filtered = activeTab === "Semua" 
    ? servicesData 
    : servicesData.filter(item => item.category === activeTab);

  return (
    <section 
      id="layanan" 
      className="py-24 bg-white font-sans relative overflow-hidden"
      aria-label="Daftar Layanan Legalitas"
    >
      
      {/* 1. BACKGROUND PERFORMANCE: CSS Only (Ringan) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-stone-50 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER SECTION (SEO Optimized) --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-200">
             <span className={`w-2 h-2 ${BRAND_BG} rounded-full animate-pulse`}></span>
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Solusi Terpadu</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
            Apapun Kebutuhan Legalitasnya, <br/>
            <span className={BRAND_TEXT}>Kami Punya Solusinya.</span>
          </h2>
          
          <p className="text-stone-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Sederhanakan birokrasi bisnis Anda dengan layanan profesional kami. Pilih kategori di bawah untuk memulai.
          </p>
        </div>

        {/* --- FILTER TABS (Sticky UX) --- */}
        <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md py-4 mb-12 flex justify-center rounded-full border border-stone-100 shadow-sm mx-auto max-w-fit px-2 transition-all">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                type="button"
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === cat
                    ? 'bg-[#2a3f9b] text-white shadow-md transform scale-105'
                    : 'bg-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
                aria-label={`Filter layanan kategori ${cat}`}
                aria-pressed={activeTab === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID SERVICES --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filtered.map((item, idx) => (
            <article 
              key={idx}
              className="group flex flex-col bg-white p-8 rounded-[2.5rem] border border-stone-200 hover:border-[#2a3f9b]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Efek Hover Latar Belakang */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* 1. Icon & Category */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-stone-50 text-stone-400 group-hover:bg-[#2a3f9b] group-hover:text-white transition-all duration-500 shadow-sm`}>
                    <div className="w-7 h-7">{item.icon}</div>
                 </div>
                 <span className="px-3 py-1 rounded-lg bg-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-500 border border-stone-200 group-hover:border-[#2a3f9b]/20 transition-colors">
                    {item.category}
                 </span>
              </div>

              {/* 2. Content */}
              <div className="mb-8 relative z-10 flex-grow">
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-[#2a3f9b] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>

              {/* 3. Features List (Clean) */}
              <div className="space-y-3 mb-8 relative z-10">
                {item.features.slice(0, 3).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3 text-sm text-stone-600 font-medium">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* 4. CTA Button */}
              <Link
                 href={`/layanan/${item.slug}`}
                 className="mt-auto w-full py-3.5 rounded-xl border border-stone-200 text-stone-600 font-bold flex items-center justify-center gap-2 group-hover:bg-[#2a3f9b] group-hover:text-white group-hover:border-[#2a3f9b] transition-all duration-300 relative z-10"
                 aria-label={`Lihat detail layanan ${item.title}`}
              >
                Lihat Detail <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>

        {/* --- BOTTOM CTA (High Performance Banner) --- */}
        <div className="relative rounded-[3rem] overflow-hidden bg-[#2a3f9b] shadow-2xl shadow-blue-900/30">
          
          {/* Texture (Menggunakan CSS gradient daripada gambar external untuk speed) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 md:p-16 gap-10 text-center lg:text-left">
            
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Jangan Biarkan Birokrasi <br/> Menghambat Rezeki.
              </h3>
              <p className="text-blue-100 text-lg font-light mb-0">
                Konsultasikan kebutuhan legalitas Anda sekarang. <br className="hidden md:block"/> Gratis diskusi 15 menit pertama bersama ahli kami.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link 
                href="https://wa.me/6289518530306" 
                className="px-8 py-4 bg-white text-[#2a3f9b] rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <MessageCircle size={20} /> Chat WhatsApp
              </Link>
              <Link 
                href="#kontak" 
                className="px-8 py-4 bg-[#2a3f9b] border border-white/30 text-white rounded-full font-semibold hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
              >
                <Phone size={20} /> Jadwal Telepon
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}