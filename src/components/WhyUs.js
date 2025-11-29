import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartHandshake, Clock, Award, Users, ShieldCheck, 
  ArrowRight, CheckCircle2, BarChart3, Phone 
} from 'lucide-react';

// Karena ini Server Component, kita tidak perlu "useMemo" atau state.
// React akan merender ini menjadi HTML statis di server.

export default function WhyUs() {
  return (
    <section 
      id="tentang" 
      // content-visibility: auto menunda rendering browser sampai elemen masuk viewport
      className="py-24 bg-[#F8FAFC] font-sans relative overflow-hidden border-b border-stone-200 selection:bg-[#1e40af] selection:text-white"
      style={{ contentVisibility: 'auto' }} 
    >
      
      {/* 1. OPTIMIZED BACKGROUND (CSS Paint API Friendly) */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
         {/* Simple Grid using CSS patterns */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af08_1px,transparent_1px),linear-gradient(to_bottom,#1e40af08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         {/* Radial Gradient menggantikan Blur Filter yang berat */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 to-transparent opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center mb-8">
             <div className="flex items-center gap-2.5 px-5 py-2 bg-white border border-blue-100 rounded-full shadow-sm cursor-default transition-transform hover:scale-105">
                <div className="h-2 w-2 rounded-full bg-[#1e40af]"></div>
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-widest">
                  Valpro Standard
                </span>
             </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-stone-900 leading-[1.05] tracking-tight mb-6">
            Lebih Dari Sekadar <br/>
            <span className="text-[#1e40af]">
              Mengurus Izin.
            </span>
          </h2>
          
          <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Kami membangun ekosistem di mana legalitas bukan lagi beban administrasi, melainkan aset strategis untuk pertumbuhan bisnis Anda.
          </p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 lg:gap-8">
          
          {/* CARD 1: PENDEKATAN HUMANIS */}
          <div className="md:col-span-2 md:row-span-1 bg-white rounded-[2rem] p-8 md:p-10 border border-stone-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 to-transparent opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-stone-100 group-hover:scale-110 transition-transform duration-300">
                 <HeartHandshake size={36} className="text-[#1e40af]" strokeWidth={1.5} />
              </div>
              
              <div className="relative z-10 max-w-lg">
                 <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-[#1e40af] transition-colors">Consultant-First Approach</h3>
                 <p className="text-stone-600 leading-relaxed text-sm md:text-[15px]">
                   Anda mendapatkan <strong>Konsultan Dedikasi</strong> yang memahami konteks bisnis. Kami berbicara bahasa solusi, bukan sekadar bahasa pasal hukum yang kaku.
                 </p>
              </div>
          </div>

          {/* CARD 2: THE "BLUE OBELISK" (Stats) */}
          <div className="md:col-span-1 md:row-span-2 bg-[#1e40af] rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden text-white shadow-xl shadow-blue-900/10 border border-blue-800/50 group">
              
              <div className="absolute inset-0 bg-gradient-to-b from-[#1e40af] to-[#172554]"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 to-transparent"></div>

              <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-8 backdrop-blur-[2px]">
                    <ShieldCheck size={14} className="text-blue-200" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Jaminan 100%</span>
                 </div>
                 <h3 className="text-3xl lg:text-4xl font-extrabold leading-[1.1] mb-3 tracking-tight">
                   Valid &<br/>Legal.
                 </h3>
                 <p className="text-blue-100 text-sm leading-relaxed font-medium">
                   Setiap dokumen terverifikasi langsung ke database pemerintah (AHU/OSS).
                 </p>
              </div>

              {/* Data Visual */}
              <div className="relative z-10 mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-white/10 transition-colors">
                 <div className="flex items-center justify-between mb-4">
                    <Users size={20} className="text-blue-300"/>
                    <BarChart3 size={20} className="text-blue-300/80"/>
                 </div>
                 <div className="flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tighter">500<span className="text-blue-400">+</span></span>
                 </div>
                 <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-2">Perusahaan Terdaftar</p>
                 
                 <div className="w-full h-1.5 bg-blue-950/30 rounded-full mt-5 overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-400 rounded-full"></div>
                 </div>
              </div>
          </div>

          {/* CARD 3: UPDATE BERKALA */}
          <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100/50 group-hover:rotate-12 transition-transform">
                    <Clock size={24} strokeWidth={1.5} />
                 </div>
                 <div className="px-2.5 py-1 bg-stone-50 rounded-lg text-[10px] font-bold text-stone-500 uppercase border border-stone-100">Proaktif</div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">Update Status Berkala</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-5">
                Tak perlu khawatir tanpa kabar. Admin kami akan mengirimkan laporan progress dokumen Anda secara rutin.
              </p>
              <div className="flex gap-1.5">
                 <div className="h-1.5 flex-1 bg-green-500 rounded-full animate-pulse"></div>
                 <div className="h-1.5 flex-1 bg-green-500 rounded-full animate-pulse delay-75"></div>
                 <div className="h-1.5 flex-1 bg-stone-100 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-stone-200 w-1/2 rounded-full"></div>
                 </div>
              </div>
          </div>

          {/* CARD 4: REKAM JEJAK */}
          <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100/50 group-hover:-rotate-12 transition-transform">
                    <Award size={24} strokeWidth={1.5} />
                 </div>
                 <div className="px-2.5 py-1 bg-stone-50 rounded-lg text-[10px] font-bold text-stone-500 uppercase border border-stone-100">Akurasi</div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-emerald-600 transition-colors">Zero-Error Policy</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Protokol <strong>3x Pengecekan</strong> oleh tim ahli senior sebelum submisi, meminimalisir risiko revisi di kemudian hari.
              </p>
          </div>

        </div>

        {/* --- CTA (Server Rendered) --- */}
        <div className="mt-20 relative rounded-[3rem] overflow-hidden bg-[#0A0A0A] shadow-xl group isolate border border-stone-800">
           
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none"></div>
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#1e40af]/30 to-transparent pointer-events-none"></div>
           
           <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
              
              <div className="max-w-xl">
                 <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                   Jangan Biarkan Birokrasi <br/> 
                   <span className="text-stone-400">Menghambat Visi Anda.</span>
                 </h3>
                 <p className="text-stone-300 text-lg leading-relaxed font-medium">
                   Mulai dengan konsultasi strategis. Kami petakan kebutuhan legalitas Anda dan berikan <em>roadmap</em> yang jelas.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                 <Link 
                     href="https://wa.me/6281399710085" 
                     className="group px-8 py-4 bg-white text-stone-950 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow hover:bg-blue-50 active:scale-95"
                  >
                     <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} /> 
                     <span>Chat WhatsApp</span>
                     <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform"/>
                 </Link>
                 
                 <Link 
                    href="#kontak" 
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-95"
                 >
                    <Phone size={18}/>
                    Jadwal Telepon
                 </Link>
              </div>

           </div>
        </div>

        {/* --- FOOTER STRIP --- */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-semibold text-stone-500 uppercase tracking-wider">
           <div className="flex items-center gap-2.5">
             <div className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse"></div>
             <span>Nasional & Terintegrasi</span>
           </div>
           
           <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <span className="flex items-center gap-2 cursor-default hover:text-stone-700 transition-colors">
                 <ShieldCheck size={14} className="text-stone-400"/> Standar ISO 27001 (Data Security)
              </span>
              <span className="flex items-center gap-2 cursor-default hover:text-stone-700 transition-colors">
                 <CheckCircle2 size={14} className="text-stone-400"/> Garansi Keabsahan Dokumen
              </span>
           </div>
        </div>

      </div>
    </section>
  );
}