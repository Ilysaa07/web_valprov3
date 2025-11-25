"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, MessageCircle, PhoneCall } from 'lucide-react';
// Import data terpusat (Pastikan file ini sudah dibuat di langkah sebelumnya)
import { servicesData } from '@/lib/servicesData';

export default function Services() {
  const [activeTab, setActiveTab] = useState("Semua");
  const BRAND_HEX = "#2a3f9b";

  // 1. Ambil daftar kategori unik dari data secara otomatis
  const categories = ["Semua", ...new Set(servicesData.map(item => item.category))];

  // 2. Logic Filter
  const filtered = activeTab === "Semua" 
    ? servicesData 
    : servicesData.filter(item => item.category === activeTab);

  return (
    <section id="layanan" className="py-24 bg-white font-sans relative overflow-hidden">
      
      {/* Background Ornament (Halus & Humanis) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200">
             <span className="w-2 h-2 bg-[#2a3f9b] rounded-full animate-pulse"></span>
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Layanan Terpadu</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
            Apapun Kebutuhan Legalitasnya, <br/>
            <span style={{ color: BRAND_HEX }}>Solusinya Ada Di Sini.</span>
          </h2>
          <p className="text-stone-500 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Pilih layanan sesuai kebutuhan bisnis Anda. Klik detail untuk informasi lengkap mengenai syarat dan proses.
          </p>
        </div>

        {/* --- TABS FILTER --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === cat
                  ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/10 scale-105'
                  : 'bg-white text-stone-500 border border-stone-200 hover:border-[#2a3f9b] hover:text-[#2a3f9b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- GRID SERVICES --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {filtered.map((item, idx) => (
            <div 
              key={idx}
              className="group flex flex-col bg-white p-8 rounded-[2rem] border border-stone-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(42,63,155,0.08)] hover:-translate-y-1 hover:border-transparent relative overflow-hidden"
            >
              {/* Dekorasi Glow saat Hover */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.bgColor} rounded-full blur-[60px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 -mr-10 -mt-10`}></div>

              {/* 1. Header Kartu: Kategori & Icon */}
              <div className="flex justify-between items-start mb-6 z-10">
                 <div>
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2 ${item.bgColor} ${item.color} bg-opacity-50 border-0`}>
                      {item.category}
                    </span>
                    {/* Menggunakan shortDesc sebagai sub-header */}
                    <p className="text-sm font-medium text-stone-400 italic pr-2">
                      {item.shortDesc}
                    </p>
                 </div>
                 {/* Icon Box */}
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${item.bgColor} ${item.color} bg-opacity-30 border-opacity-30 flex-shrink-0`}>
                    {/* Icon dirender langsung dari data */}
                    <div className="w-7 h-7">{item.icon}</div>
                 </div>
              </div>

              {/* 2. Judul & Deskripsi */}
              <div className="mb-6 z-10 flex-grow">
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-[#2a3f9b] transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed font-normal line-clamp-3">
                  {item.desc}
                </p>
              </div>

              {/* 3. Fitur Preview (Tags) */}
              <div className="flex flex-wrap gap-2 mb-8 z-10">
                {item.features.slice(0, 3).map((feat, fIdx) => (
                  <span key={fIdx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 text-xs font-semibold text-stone-600 border border-stone-100">
                    <Check size={12} className="text-green-500 stroke-[3]" /> {feat}
                  </span>
                ))}
              </div>

              {/* 4. Action Button (Internal Link) */}
              <Link
                 href={`/layanan/${item.slug}`}
                 className="mt-auto w-full py-3.5 rounded-xl border border-stone-200 text-stone-600 font-bold flex items-center justify-center gap-2 group-hover:bg-[#2a3f9b] group-hover:text-white group-hover:border-[#2a3f9b] transition-all duration-300 z-10"
              >
                Lihat Detail <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* --- BOTTOM CTA (Banner Biru Besar) --- */}
        <div className="relative rounded-[3rem] overflow-hidden bg-[#2a3f9b]">
          {/* Background Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-10 text-center md:text-left">
            
            {/* CTA Text */}
            <div className="max-w-2xl text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Jangan Biarkan Birokrasi <br/> Menghambat Rezeki.
              </h3>
              <p className="text-blue-100 text-lg font-light mb-8 md:mb-0">
                Konsultasikan kebutuhan legalitas Anda sekarang. Gratis diskusi 15 menit pertama bersama ahli kami.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Link 
                href="https://wa.me/6289518530306" 
                className="px-8 py-4 bg-white text-[#2a3f9b] rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <MessageCircle size={20} /> Chat WhatsApp
              </Link>
              <Link 
                href="#kontak" 
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <PhoneCall size={20} /> Jadwalkan Telepon
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}