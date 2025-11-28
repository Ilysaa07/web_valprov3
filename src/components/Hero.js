"use client";
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Check, Building2, FileText, ChevronDown, Lock, ScrollText, Stamp, QrCode, Globe, Scale, FileBadge } from 'lucide-react';

export default function Hero({ city = null }) {
  
  return (
    <section className="relative bg-[#F8FAFC] overflow-hidden font-sans min-h-screen flex items-center border-b border-slate-200 selection:bg-[#1e40af] selection:text-white">
      
      {/* 1. BACKGROUND: SUBTLE & CLEAN */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-slate-50">
         {/* Fine Blueprint Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af05_1px,transparent_1px),linear-gradient(to_bottom,#1e40af05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         {/* Soft ambient light top right */}
         <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-white rounded-full blur-[150px] opacity-70"></div>
      </div>

      <div className="max-w-[95rem] mx-auto px-6 relative z-20 w-full pt-20 pb-10">
        
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* --- LEFT SECTION: PROFESSIONAL AUTHORITY (6 COLS) --- */}
          <div className="lg:col-span-6 relative z-30 pl-4">
            
            {/* Official Partner Badge */}
            <div className="inline-flex items-center gap-3 mb-10 animate-in fade-in slide-in-from-left-10 duration-700 group cursor-default">
               <div className="px-4 py-1.5 bg-white border-2 border-blue-100 rounded-full shadow-sm flex items-center gap-3">
                  <ShieldCheck size={16} className="text-[#1e40af]" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                     Otoritas Legalitas Terpercaya
                  </span>
               </div>
            </div>

            {/* TYPOGRAPHY */}
            <div className="relative z-10 mb-10">
               <h1 className="text-[4rem] sm:text-[5.5rem] lg:text-[6rem] font-extrabold leading-[1] tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
                 {city ? (
                   <>
                     LEGALITAS USAHA <br/>
                     <span className="text-[#1e40af]">
                       DI KOTA {city?.toUpperCase()}.
                     </span>
                   </>
                 ) : (
                   <>
                     FONDASI HUKUM <br/>
                     <span className="text-[#1e40af]">
                       BISNIS PROFESIONAL.
                     </span>
                   </>
                 )}
               </h1>
            </div>
            
            <p className="text-xl text-slate-600 font-medium max-w-xl leading-relaxed mb-12 border-l-4 border-[#1e40af] pl-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
               Penerbitan dokumen badan usaha melalui jalur resmi pemerintah. Kami menjamin keabsahan Akta, SK Kemenkumham, dan NIB Anda. <span className="text-slate-900 font-bold">Resmi & Berkekuatan Hukum Tetap.</span>
            </p>

            {/* "REGISTRY STYLE" SEARCH INPUT */}
            <div className="relative group max-w-xl animate-in zoom-in-95 duration-1000 delay-300 z-40">
               <div className="relative flex items-center bg-white rounded-xl p-1.5 border-2 border-slate-200 shadow-xl shadow-blue-900/5 focus-within:border-[#1e40af] focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                  
                  {/* Dropdown Simulation */}
                  <div className="hidden sm:flex items-center gap-2 px-6 border-r-2 border-slate-200 text-slate-700 font-bold text-sm bg-slate-50 rounded-lg h-full py-4 mr-2 cursor-pointer hover:bg-slate-100">
                     PT <ChevronDown size={14} strokeWidth={3}/>
                  </div>

                  <div className="flex-1 relative z-10 pl-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Pengecekan Nama Perseroan Terbatas</label>
                     <input 
                        type="text" 
                        placeholder="Ketik Nama PT..." 
                        className="w-full bg-transparent text-slate-900 text-xl font-bold placeholder:text-slate-300 focus:outline-none tracking-tight font-sans uppercase"
                     />
                  </div>
                  <Link 
                     href={`https://wa.me/6281399710085`}
                     className="shrink-0 bg-[#1e40af] hover:bg-[#172554] text-white px-8 py-5 rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-md relative z-10 active:scale-95"
                  >
                     <Search size={18} strokeWidth={3} /> VALIDASI NAMA
                  </Link>
               </div>
               
               {/* Trust Indicators */}
               <div className="flex gap-8 mt-5 px-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                     <Check size={14} className="text-green-600" strokeWidth={3} /> Sinkronisasi AHU Online
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                     <Lock size={14} className="text-blue-600" /> Standar Keamanan Data
                  </div>
               </div>
            </div>

          </div>

          {/* --- RIGHT SECTION: THE REALISTIC DOCUMENT STACK (6 COLS) --- */}
          <div className="lg:col-span-6 relative hidden lg:block h-[800px] perspective-[2500px] -ml-10">
             
             {/* 3D Stack Container */}
             <div className="relative w-full h-full flex items-center justify-center transform-style-3d rotate-x-[8deg] rotate-y-[-12deg] hover:rotate-x-0 hover:rotate-y-0 transition-transform duration-[1.5s] ease-out">
                
                {/* ================= DOCUMENT 3 (BACK): NIB OSS RBA ================= */}
                <div className="absolute w-[520px] h-[700px] bg-white rounded-[2px] shadow-xl border border-slate-300 p-8 flex flex-col animate-[stack-cycle_12s_linear_infinite_8s] opacity-0 z-10 overflow-hidden font-serif text-slate-900">
                   {/* Modern OSS Header */}
                   <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                      <div className="flex gap-3 items-center">
                         {/* Simulated OSS Logo */}
                         <div className="p-2 bg-[#1e40af] text-white rounded"><Globe size={24}/></div>
                         <div>
                            <h3 className="text-lg font-bold font-sans">PEMERINTAH REPUBLIK INDONESIA</h3>
                            <p className="text-xs font-sans">LEMBAGA PENGELOLA DAN PENYELENGGARA OSS</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="text-center mb-6">
                      <h2 className="text-xl font-bold underline underline-offset-4">NOMOR INDUK BERUSAHA (NIB)</h2>
                      <p className="text-sm mt-2">1290000045XXXX</p>
                   </div>

                   {/* Data Table Simulation */}
                   <div className="flex-1 text-sm leading-relaxed space-y-4">
                      <p>Berdasarkan ketentuan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 tentang Cipta Kerja, Lembaga OSS menerbitkan NIB kepada:</p>
                      <table className="w-full text-sm">
                         <tbody>
                           <tr><td className="font-bold py-1 w-40">Nama Perusahaan</td><td>: PT MAJU TERUS PANTANG MUNDUR</td></tr>
                           <tr><td className="font-bold py-1">NPWP Badan</td><td>: 92.001.450.2-XXX.000</td></tr>
                           <tr><td className="font-bold py-1">Alamat</td><td>: Jl. Jend. Sudirman Kav. 52-53...</td></tr>
                           <tr><td className="font-bold py-1 align-top">KBLI Utama</td><td>: 62019 - Aktivitas Pemrograman Komputer Lainnya</td></tr>
                         </tbody>
                      </table>
                   </div>
                   
                   {/* Footer QR */}
                   <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-end">
                      <div className="text-xs text-slate-500 max-w-[250px]">
                         *Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat elektronik yang diterbitkan oleh BSrE.
                      </div>
                      <QrCode size={80} className="text-slate-900" />
                   </div>
                </div>

                {/* ================= DOCUMENT 2 (MIDDLE): SK KEMENKUMHAM ================= */}
                <div className="absolute w-[520px] h-[700px] bg-white rounded-[2px] shadow-xl border border-slate-300 p-10 flex flex-col animate-[stack-cycle_12s_linear_infinite_4s] opacity-0 z-20 overflow-hidden font-serif text-slate-900">
                   {/* Garuda Watermark subtle */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                      <Building2 size={400} />
                   </div>

                   {/* Ministry Header */}
                   <div className="text-center mb-8 relative z-10">
                      <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center relative">
                        {/* Silhouette Garuda */}
                        <Building2 size={40} className="text-slate-400" /> 
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-600">Kementerian Hukum dan Hak Asasi Manusia<br/>Republik Indonesia</h4>
                      <div className="h-1 w-full border-b-2 border-double border-slate-800 mt-4"></div>
                   </div>

                   <div className="text-center mb-6 relative z-10">
                      <h3 className="text-lg font-bold">KEPUTUSAN MENTERI HUKUM DAN HAK ASASI MANUSIA REPUBLIK INDONESIA</h3>
                      <p className="text-sm font-bold mt-1">NOMOR AHU-004521.AH.01.01.TAHUN 2025</p>
                      <p className="text-sm mt-4">TENTANG</p>
                      <p className="text-sm font-bold uppercase mt-1">PENGESAHAN PENDIRIAN BADAN HUKUM PERSEROAN TERBATAS<br/>PT MAJU TERUS PANTANG MUNDUR</p>
                   </div>
                   
                   <div className="flex-1 text-sm text-justify leading-relaxed relative z-10">
                      <p><strong>MEMUTUSKAN:</strong></p>
                      <div className="mt-2 space-y-4">
                         <p><strong>Menetapkan:</strong> KEPUTUSAN MENTERI HUKUM DAN HAK ASASI MANUSIA TENTANG PENGESAHAN PENDIRIAN BADAN HUKUM PERSEROAN TERBATAS PT MAJU TERUS PANTANG MUNDUR.</p>
                         <p><strong>KESATU:</strong> Mengesahkan pendirian badan hukum PT MAJU TERUS PANTANG MUNDUR yang berkedudukan di JAKARTA SELATAN, sebagaimana dimuat dalam Akta Notaris...</p>
                      </div>
                   </div>

                   {/* Electronic Signature Footer */}
                   <div className="mt-auto pt-6 relative z-10 flex justify-end text-right">
                      <div>
                         <p className="text-xs uppercase font-bold text-slate-500">Ditetapkan di Jakarta</p>
                         <p className="text-xs uppercase font-bold text-slate-500 mb-4">Pada Tanggal 28 November 2025</p>
                         <p className="font-bold">a.n. MENTERI HUKUM DAN HAK ASASI MANUSIA<br/>REPUBLIK INDONESIA</p>
                         <p className="font-bold mt-1">DIREKTUR JENDERAL ADMINISTRASI HUKUM UMUM,</p>
                         <div className="my-4 flex justify-end"><FileBadge size={40} className="text-slate-300"/></div> {/* Barcode sim */}
                         <p className="font-bold underline">CAHYO R. MUZHAR, S.H., LL.M.</p>
                         <p>NIP. 19690918 199403 1 001</p>
                      </div>
                   </div>
                </div>

                {/* ================= DOCUMENT 1 (FRONT): AKTA NOTARIS ================= */}
                <div className="absolute w-[520px] h-[700px] bg-[#fffefa] rounded-[2px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)] border border-slate-400 p-12 flex flex-col animate-[stack-cycle_12s_linear_infinite_0s] z-30 overflow-hidden font-serif text-slate-900">
                   {/* Paper Texture Overlay */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
                   
                   {/* Notary Header */}
                   <div className="border-b-[3px] border-double border-slate-900 pb-6 mb-8 text-center relative z-10">
                        <h3 className="text-2xl font-black tracking-wider uppercase mb-2">SALINAN</h3>
                        <h2 className="text-xl font-bold uppercase">KANTOR NOTARIS & PPAT</h2>
                        <h1 className="text-3xl font-black text-[#1e40af] uppercase mt-2">BAPAK CONTOH, S.H., M.Kn.</h1>
                        <p className="text-sm font-bold uppercase mt-1">SK Menteri Kehakiman dan HAM RI No. C-123.HT.03.01-Th.2010</p>
                        <p className="text-sm mt-2 italic">Jl. Jendral Sudirman No. Kav 50, Jakarta Selatan</p>
                   </div>

                   <div className="flex-1 space-y-6 text-[15px] text-justify leading-loose relative z-10">
                      <p className="text-center font-bold uppercase underline underline-offset-4 mb-8">AKTA PENDIRIAN PERSEROAN TERBATAS<br/>"PT MAJU TERUS PANTANG MUNDUR"</p>
                      <p>
                         Pada hari ini, <span className="font-bold">Jumat</span>, tanggal <span className="font-bold">28-11-2025</span> (Dua Puluh Delapan November Dua Ribu Dua Puluh Lima).
                      </p>
                      <p>
                         Berhadapan dengan saya, <strong className="text-[#1e40af]">BAPAK CONTOH, Sarjana Hukum, Magister Kenotariatan</strong>, Notaris berkedudukan di Kota Administrasi Jakarta Selatan, dengan dihadiri oleh saksi-saksi yang saya, Notaris, kenal dan akan disebutkan pada bagian akhir akta ini:
                      </p>
                      <p>
                         1. Tuan <strong className="uppercase">Nama Pendiri Satu</strong>, lahir di Jakarta, pada tanggal... <br/>
                         2. Nyonya <strong className="uppercase">Nama Pendiri Dua</strong>, lahir di Bandung, pada tanggal...
                      </p>
                   </div>

                   {/* Seals & Signatures - Wet Stamp Simulation */}
                   <div className="mt-auto pt-10 flex justify-between items-end relative z-10">
                      <div className="relative">
                         <div className="w-28 h-28 border-4 border-blue-900/60 rounded-full flex items-center justify-center rotate-[-15deg] absolute -top-10 -left-2 mix-blend-multiply">
                            <div className="text-center">
                               <Stamp size={32} className="text-blue-900/60 mx-auto mb-1" />
                               <span className="text-[8px] font-black text-blue-900/70 uppercase leading-tight block">Notaris<br/>Kota Jakarta Selatan</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-center relative z-10 pl-20">
                         <p className="text-sm mb-16">Diberikan sebagai SALINAN yang sama bunyinya.</p>
                         <p className="font-bold text-slate-900 border-t border-slate-800 pt-2 px-4">BAPAK CONTOH, S.H., M.Kn.</p>
                      </div>
                   </div>

                </div>

             </div>
          </div>

        </div>
      </div>

      {/* CUSTOM CSS & ANIMATIONS */}
      <style jsx>{`
        .transform-style-3d { transform-style: preserve-3d; }
        .font-cursive { font-family: 'Brush Script MT', cursive; }

        /* The Infinite Shuffle Animation */
        @keyframes stack-cycle {
          /* Front (Hold) */
          0%, 30% { 
            transform: translateZ(0px) translateY(0px) rotate(0deg); 
            z-index: 30; 
            opacity: 1; 
          }
          /* Fly out to back */
          33% { 
            transform: translateZ(-100px) translateY(-50px) translateX(20px) rotate(5deg); 
            z-index: 5; 
            opacity: 0.5;
          }
          /* Back position (hidden shuffle) */
          33.1% { 
             transform: translateZ(-60px) translateY(20px) rotate(-3deg);
             z-index: 10;
             opacity: 0;
          }
          /* Back position (appear) */
          36%, 63% {
             transform: translateZ(-40px) translateY(20px) rotate(-2deg);
             z-index: 10;
             opacity: 1;
          }
          /* Middle position */
          66%, 96% {
             transform: translateZ(-20px) translateY(10px) rotate(-1deg);
             z-index: 20;
             opacity: 1;
          }
          /* Return to Front */
          100% {
             transform: translateZ(0px) translateY(0px) rotate(0deg);
             z-index: 30;
             opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}