"use client";
import Image from 'next/image';
import Link from 'next/link';
import { HeartHandshake, Clock, Award, Users, ShieldCheck, ArrowRight, Zap, CheckCircle2, Activity } from 'lucide-react';

export default function WhyUs() {
  
  return (
    <section id="tentang" className="py-24 bg-[#F8FAFC] font-sans relative overflow-hidden border-b border-stone-200 selection:bg-[#1e40af] selection:text-white">
      
      {/* 1. BACKGROUND ATMOSPHERE (Matching Hero) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af05_1px,transparent_1px),linear-gradient(to_bottom,#1e40af05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute top-[20%] left-[-20%] w-[1000px] h-[1000px] bg-blue-100/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center mb-8">
             <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-100 rounded-full shadow-sm hover:shadow-md transition-all cursor-default">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e40af] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e40af]"></span>
                </div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                  Valpro Standard v2.0
                </span>
             </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-stone-900 leading-[1] tracking-tight mb-6">
            Lebih Dari Sekadar <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] to-[#3b82f6]">
              Mengurus Izin.
            </span>
          </h2>
          
          <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto font-light">
            Kami membangun ekosistem di mana legalitas bukan lagi beban, melainkan aset strategis untuk pertumbuhan bisnis Anda.
          </p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 lg:gap-8 min-h-[600px]">
          
          {/* CARD 1: PENDEKATAN HUMANIS (Large - Top Left) */}
          <div className="md:col-span-2 md:row-span-1 bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(30,64,175,0.1)] transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-8">
              
              {/* Background Blob Animation */}
              <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[80px] group-hover:bg-blue-100/50 transition-colors duration-700"></div>

              <div className="relative z-10 w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center shrink-0 border border-stone-100 group-hover:scale-110 transition-transform duration-500">
                 <HeartHandshake size={40} className="text-[#1e40af]" strokeWidth={1.5} />
              </div>
              
              <div className="relative z-10 max-w-lg">
                 <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-[#1e40af] transition-colors">Consultant-First Approach</h3>
                 <p className="text-stone-500 leading-relaxed text-sm md:text-base">
                   Kami bukan robot birokrasi. Anda mendapatkan <strong>Konsultan Dedikasi</strong> yang memahami konteks bisnis Anda, berbicara bahasa manusia (bukan pasal hukum), dan proaktif memberikan solusi.
                 </p>
              </div>
          </div>

          {/* CARD 2: THE "BLUE OBELISK" (Stats - Tall Right) */}
          <div className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-[#1e40af] to-[#172554] rounded-[2.5rem] p-8 flex flex-col justify-between group relative overflow-hidden text-white shadow-2xl shadow-blue-900/30">
              
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] animate-pulse"></div>

              <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-8">
                    <ShieldCheck size={14} className="text-blue-200" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Jaminan 100%</span>
                 </div>
                 <h3 className="text-3xl lg:text-4xl font-bold leading-[1.1] mb-2">
                    Valid &<br/>Legal.
                 </h3>
                 <p className="text-blue-200/80 text-sm leading-relaxed">
                    Setiap dokumen diverifikasi langsung ke database pemerintah (AHU/OSS).
                 </p>
              </div>

              {/* Live Counter Visual */}
              <div className="relative z-10 mt-10 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                 <div className="flex items-center justify-between mb-4">
                    <Users size={20} className="text-blue-300"/>
                    <Activity size={20} className="text-green-400 animate-pulse"/>
                 </div>
                 <div className="flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tighter">500<span className="text-blue-400">+</span></span>
                 </div>
                 <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-2">Perusahaan Terdaftar</p>
                 
                 {/* Progress Line */}
                 <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-400 rounded-full animate-[shimmer_2s_infinite]"></div>
                 </div>
              </div>
          </div>

          {/* CARD 3: REAL-TIME TRACKER (Bottom Left) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                 </div>
                 <div className="px-2 py-1 bg-stone-50 rounded text-[10px] font-bold text-stone-400 uppercase">Live Tracking</div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Transparansi Total</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">
                Pantau progres dokumen Anda secara <em>real-time</em> via WhatsApp. Tidak ada "menunggu tanpa kabar".
              </p>
              {/* Fake Progress UI */}
              <div className="flex gap-1">
                 <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
                 <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
                 <div className="h-1.5 flex-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-green-500 animate-[shimmer_1.5s_infinite]"></div>
                 </div>
              </div>
          </div>

          {/* CARD 4: REKAM JEJAK (Bottom Center) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <Award size={24} />
                 </div>
                 <div className="px-2 py-1 bg-stone-50 rounded text-[10px] font-bold text-stone-400 uppercase">Expert Team</div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Zero-Error Policy</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Tim ahli kami melakukan <strong>3x Pengecekan</strong> sebelum dokumen diserahkan, meminimalisir risiko kesalahan data di kemudian hari.
              </p>
          </div>

        </div>

        {/* --- SUPERCHARGED CTA (The Portal) --- */}
        <div className="mt-20 relative rounded-[3rem] overflow-hidden bg-[#0A0A0A] shadow-2xl shadow-stone-900/20 group isolate border border-stone-800">
           
           {/* Background FX */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1e40af] rounded-full blur-[150px] opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
           
           <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
              
              <div className="max-w-xl">
                 <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                    Jangan Biarkan Birokrasi <br/> 
                    <span className="text-stone-500">Menghambat Visi Anda.</span>
                 </h3>
                 <p className="text-stone-400 text-lg leading-relaxed">
                    Mulai konsultasi gratis 15 menit. Kami akan memetakan kebutuhan legalitas Anda dan memberikan <em>roadmap</em> yang jelas.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                 <Link 
                    href="https://wa.me/6281399710085" 
                    className="group px-8 py-5 bg-white text-stone-950 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
                 >
                    <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} /> 
                    <span>Chat WhatsApp</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                 </Link>
                 
                 <Link 
                    href="#kontak" 
                    className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
                 >
                    Jadwal Telepon
                 </Link>
              </div>

           </div>
        </div>

        {/* --- FOOTER STRIP --- */}
        <div className="mt-12 pt-8 border-t border-stone-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-stone-500">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <span>Layanan Tersedia di Seluruh Indonesia</span>
           </div>
           
           <div className="flex gap-8">
              <span className="flex items-center gap-2 hover:text-[#1e40af] transition-colors cursor-default">
                 <ShieldCheck size={14} className="text-[#1e40af]"/> Enkripsi Data 256-bit
              </span>
              <span className="flex items-center gap-2 hover:text-[#1e40af] transition-colors cursor-default">
                 <CheckCircle2 size={14} className="text-[#1e40af]"/> Garansi Legalitas
              </span>
           </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}