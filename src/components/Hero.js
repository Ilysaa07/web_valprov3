"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Check, Building2, FileText, Lock, ScrollText, Stamp, QrCode, Globe, FileBadge, MessageCircle, LayoutGrid, Star, Zap } from 'lucide-react';
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

export default function Hero({ city = null }) {
  const [whatsappNumber, setWhatsappNumber] = useState('6281399710085'); // Default value

  useEffect(() => {
    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.mainNumber || '6281399710085');
    };

    loadWhatsappSettings();
  }, []);

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

            {/* ACTION: PSYCHOLOGICAL BUTTONS */}
            <div className="relative z-40 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
               
               <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Primary CTA: WhatsApp (High Urgency & Trust) */}
                  <Link
                     href={createWhatsAppUrl(whatsappNumber, 'Halo Valpro, saya ingin konsultasi pendirian badan usaha.')}
                     className="group relative overflow-hidden bg-[#1e40af] hover:bg-[#172554] text-white px-8 py-5 rounded-2xl font-bold text-base transition-all shadow-[0_10px_40px_-10px_rgba(30,64,175,0.5)] hover:shadow-[0_20px_60px_-15px_rgba(30,64,175,0.6)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                     {/* Shimmer Effect */}
                     <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

                     <MessageCircle size={24} fill="currentColor" className="text-white/90" />
                     <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] uppercase tracking-wider text-blue-200 font-medium mb-1">Respon Cepat</span>
                        <span>Konsultasi Gratis</span>
                     </div>
                     <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-2" />
                  </Link>

                  {/* Secondary CTA: Services (Exploration) */}
                  <Link 
                     href="#layanan"
                     className="group bg-white hover:bg-slate-50 text-slate-700 px-8 py-5 rounded-2xl font-bold text-base transition-all border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center gap-3"
                  >
                     <LayoutGrid size={22} className="text-slate-400 group-hover:text-[#1e40af] transition-colors" />
                     Lihat Layanan
                  </Link>
               </div>

               {/* Trust Micro-Copy */}
               <div className="flex flex-wrap gap-x-6 gap-y-2 px-2 opacity-90">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                     <Zap size={14} className="text-yellow-500 fill-yellow-500" /> 
                     <span>Admin Online</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                     <Lock size={14} className="text-slate-400" /> 
                     <span>Privasi Dijamin</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                     <div className="flex -space-x-1">
                        <Star size={10} className="text-orange-400 fill-orange-400" />
                        <Star size={10} className="text-orange-400 fill-orange-400" />
                        <Star size={10} className="text-orange-400 fill-orange-400" />
                        <Star size={10} className="text-orange-400 fill-orange-400" />
                        <Star size={10} className="text-orange-400 fill-orange-400" />
                     </div>
                     <span>4.9/5 Rating Klien</span>
                  </div>
               </div>

            </div>

          </div>

          {/* --- RIGHT SECTION: THE REALISTIC DOCUMENT STACK (6 COLS) --- */}
          <div className="lg:col-span-6 relative hidden lg:block h-[800px] perspective-[2500px] -ml-10">
             
             {/* 3D Stack Container */}
             <div className="relative w-full h-full flex items-center justify-center transform-style-3d rotate-x-[8deg] rotate-y-[-12deg] hover:rotate-x-0 hover:rotate-y-0 transition-transform duration-[1.5s] ease-out">
                
                {/* ================= DOCUMENT 3 (BACK): NIB OSS RBA ================= */}
                <div className="absolute w-[520px] h-[720px] bg-white rounded-[2px] shadow-xl border border-slate-300 p-8 flex flex-col animate-[stack-cycle_12s_linear_infinite_8s] opacity-0 z-10 overflow-hidden font-sans text-slate-900">
                   {/* GARUDA HEADER */}
                   <div className="flex flex-col items-center mb-6">
                      <div className="w-16 h-16 mb-2 opacity-90 relative">
                         <Image 
                            src="/garuda.svg" 
                            alt="Garuda Pancasila" 
                            fill
                            className="object-contain"
                         />
                      </div>
                      <h3 className="text-sm font-bold text-center">PEMERINTAH REPUBLIK INDONESIA</h3>
                      <h4 className="text-[10px] font-bold text-center tracking-wider mt-1">PERIZINAN BERUSAHA BERBASIS RISIKO</h4>
                   </div>
                   
                   <div className="text-center mb-6 border-b-2 border-slate-900 pb-4">
                      <h2 className="text-lg font-bold">NOMOR INDUK BERUSAHA (NIB)</h2>
                      <p className="text-base font-mono font-bold mt-2 tracking-widest bg-slate-100 inline-block px-4 py-1">1290000045XXXX</p>
                   </div>

                   {/* OSS Data Table */}
                   <div className="flex-1 text-xs leading-relaxed space-y-4 font-sans">
                      <p className="text-justify">Berdasarkan Undang-Undang Nomor 11 Tahun 2020 tentang Cipta Kerja, Pemerintah Republik Indonesia menerbitkan NIB kepada:</p>
                      <table className="w-full text-xs">
                         <tbody>
                           <tr className="align-top"><td className="py-1 w-32 text-slate-500">Nama Usaha</td><td className="font-bold">: PT MAJU TERUS PANTANG MUNDUR</td></tr>
                           <tr className="align-top"><td className="py-1 text-slate-500">Alamat Kantor</td><td className="font-bold">: Jl. Jend. Sudirman Kav. 52-53, SCBD, Jakarta Selatan</td></tr>
                           <tr className="align-top"><td className="py-1 text-slate-500">NPWP Badan</td><td className="font-bold">: 92.001.450.2-063.000</td></tr>
                           <tr className="align-top"><td className="py-1 text-slate-500">KBLI Utama</td><td className="font-bold">: <span className="bg-green-100 text-green-800 px-1">62019</span> Aktivitas Pemrograman Komputer Lainnya</td></tr>
                           <tr className="align-top"><td className="py-1 text-slate-500">Status Penanaman</td><td className="font-bold">: PMDN (Penanaman Modal Dalam Negeri)</td></tr>
                         </tbody>
                      </table>
                   </div>
                   
                   {/* Footer OSS */}
                   <div className="mt-auto pt-4 flex justify-between items-end">
                      <div className="text-[10px] text-slate-500 max-w-[200px] leading-tight">
                         *Dokumen ini diterbitkan oleh sistem OSS atas nama Menteri/Kepala Lembaga/Kepala Daerah.
                         <br/><span className="text-slate-400 italic">Dicetak tgl: 29 Nov 2025</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <QrCode size={64} className="text-slate-800" />
                         <span className="text-[9px] font-bold">OSS RBA</span>
                      </div>
                   </div>
                </div>

                {/* ================= DOCUMENT 2 (MIDDLE): SK KEMENKUMHAM ================= */}
                <div className="absolute w-[520px] h-[720px] bg-white rounded-[2px] shadow-xl border border-slate-300 p-10 flex flex-col animate-[stack-cycle_12s_linear_infinite_4s] opacity-0 z-20 overflow-hidden font-serif text-slate-900">
                   {/* Background Watermark */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
                      <div className="relative w-64 h-64">
                         <Image 
                            src="/garuda.svg" 
                            alt="Garuda Watermark" 
                            fill
                            className="object-contain grayscale"
                         />
                      </div>
                   </div>

                   {/* Kemenkumham Header */}
                   <div className="text-center mb-6 relative z-10">
                      <div className="w-20 h-20 mx-auto mb-2 relative">
                         <Image 
                            src="/garuda.svg" 
                            alt="Garuda Pancasila" 
                            fill
                            className="object-contain"
                         />
                      </div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-700">Keputusan Menteri Hukum dan Hak Asasi Manusia<br/>Republik Indonesia</h4>
                      <div className="h-[2px] w-full bg-slate-900 mt-4"></div>
                      <div className="h-[1px] w-full bg-slate-900 mt-[2px]"></div>
                   </div>

                   <div className="text-center mb-6 relative z-10">
                      <p className="text-xs font-bold">NOMOR AHU-004521.AH.01.01.TAHUN 2025</p>
                      <p className="text-xs mt-2">TENTANG</p>
                      <p className="text-sm font-bold uppercase mt-1 px-4">PENGESAHAN PENDIRIAN BADAN HUKUM PERSEROAN TERBATAS<br/>PT MAJU TERUS PANTANG MUNDUR</p>
                   </div>
                   
                   <div className="flex-1 text-[11px] text-justify leading-relaxed relative z-10 space-y-3">
                      <p className="text-center font-bold">MENTERI HUKUM DAN HAK ASASI MANUSIA REPUBLIK INDONESIA,</p>
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                         <span className="font-bold">Menimbang:</span>
                         <span>Bahwa berdasarkan Permohonan Notaris, yang diterima tanggal 28 November 2025...</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                         <span className="font-bold">Mengingat:</span>
                         <span>Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas...</span>
                      </div>
                      <div className="text-center font-bold my-2">MEMUTUSKAN:</div>
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                         <span className="font-bold">Menetapkan:</span>
                         <span>KEPUTUSAN MENTERI HUKUM DAN HAM TENTANG PENGESAHAN PENDIRIAN PT MAJU TERUS PANTANG MUNDUR.</span>
                      </div>
                   </div>

                   {/* Footer AHU */}
                   <div className="mt-auto pt-6 relative z-10 flex justify-end text-right">
                      <div>
                         <p className="text-[10px] uppercase font-bold text-slate-500">Ditetapkan di Jakarta, 28 Nov 2025</p>
                         <p className="font-bold text-[10px] mt-2">a.n. MENTERI HUKUM DAN HAM RI<br/>DIREKTUR JENDERAL AHU,</p>
                         <div className="my-2 flex justify-end">
                            <div className="border border-slate-300 p-1 w-20 h-20 flex items-center justify-center bg-slate-50">
                               <QrCode size={50} className="text-slate-400"/>
                            </div>
                         </div> 
                         <p className="font-bold text-xs underline">CAHYO R. MUZHAR, S.H., LL.M.</p>
                         <p className="text-[10px]">NIP. 19690918 199403 1 001</p>
                      </div>
                   </div>
                </div>

                {/* ================= DOCUMENT 1 (FRONT): AKTA NOTARIS ================= */}
                <div className="absolute w-[520px] h-[720px] bg-[#FFFCF5] rounded-[2px] shadow-[0_30px_80px_-20px_rgba(30,64,175,0.3)] border border-slate-300 flex flex-col animate-[stack-cycle_12s_linear_infinite_0s] z-30 overflow-hidden font-serif text-slate-900">
                   {/* Binding Strip (Jilid Merah) */}
                   <div className="absolute left-0 top-0 bottom-0 w-3 bg-red-800 z-20 shadow-md"></div>
                   
                   <div className="p-10 pl-14 flex-1 flex flex-col relative">
                      {/* Old Paper Texture */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
                      
                      {/* Notary Header - Layout Klasik */}
                      <div className="border-b-[4px] border-double border-slate-900 pb-4 mb-6 text-center relative z-10">
                           <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-1">SALINAN</h3>
                           <h1 className="text-2xl font-black text-slate-900 uppercase mt-4">BAPAK CONTOH, S.H., M.Kn.</h1>
                           <p className="text-xs font-bold uppercase mt-1">NOTARIS & PPAT KOTA JAKARTA SELATAN</p>
                           <p className="text-[10px] mt-1 italic">SK Menteri Kehakiman dan HAM RI Nomor: C-123.HT.03.01-Th.2010</p>
                           <p className="text-[10px]">Jl. Jendral Sudirman No. Kav 50, Jakarta Selatan | Telp: (021) 555-0123</p>
                      </div>

                      <div className="flex-1 space-y-6 text-[12px] text-justify leading-loose relative z-10">
                         <div className="text-center py-4">
                            <h2 className="font-bold text-lg underline underline-offset-2">AKTA PENDIRIAN PERSEROAN TERBATAS</h2>
                            <h3 className="font-bold text-base">"PT MAJU TERUS PANTANG MUNDUR"</h3>
                            <p className="font-bold mt-1">Nomor: 05</p>
                         </div>

                         <p>
                            Pada hari ini, <span className="font-bold">Jumat</span>, tanggal <span className="font-bold">28-11-2025</span> (Dua Puluh Delapan November Dua Ribu Dua Puluh Lima).
                         </p>
                         <p>
                            Menghadap kepada saya, <strong className="text-slate-900 uppercase">BAPAK CONTOH, Sarjana Hukum, Magister Kenotariatan</strong>, Notaris berkedudukan di Kota Administrasi Jakarta Selatan, dengan dihadiri oleh saksi-saksi yang saya, Notaris, kenal dan akan disebutkan pada bagian akhir akta ini:
                         </p>
                         <div className="pl-4 border-l-2 border-slate-200">
                            <p>
                               1. Tuan <strong className="uppercase">Nama Pendiri Satu</strong>, lahir di Jakarta... <br/>
                               2. Nyonya <strong className="uppercase">Nama Pendiri Dua</strong>, lahir di Bandung...
                            </p>
                         </div>
                         <p>
                            Para penghadap dikenal oleh saya, Notaris. <br/>
                            Para penghadap bertindak untuk diri sendiri dan menerangkan dengan ini mendirikan Perseroan Terbatas...
                         </p>
                      </div>

                      {/* Stamps & Signatures */}
                      <div className="mt-auto pt-8 flex justify-between items-end relative z-10">
                         {/* Stempel Notaris (SVG Simulation) */}
                         <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-purple-900/60 rounded-full flex items-center justify-center rotate-[-15deg] mix-blend-multiply opacity-80">
                               <div className="text-center">
                                  <div className="w-full h-px bg-purple-900/60 mb-1"></div>
                                  <span className="text-[8px] font-black text-purple-900/80 uppercase leading-tight block px-2">NOTARIS<br/>JAKARTA SELATAN</span>
                                  <div className="w-full h-px bg-purple-900/60 mt-1"></div>
                               </div>
                            </div>
                         </div>
                         
                         <div className="text-center">
                            <p className="text-[10px] mb-8 italic">Diberikan sebagai SALINAN yang sama bunyinya.</p>
                            <p className="font-bold text-xs text-slate-900 border-t border-slate-900 pt-1 px-4">BAPAK CONTOH, S.H., M.Kn.</p>
                         </div>
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
        
        @keyframes shine {
          100% { left: 125%; }
        }
        .group:hover .animate-shine {
          animation: shine 1s;
        }

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