import KbliSearch from "@/components/KbliSearch";
import { BookOpen } from 'lucide-react';

// METADATA SEO PREMIUM
export const metadata = {
  title: 'Cek KBLI 2020 Terbaru & Lengkap (Online) - Valpro Intertech',
  description: 'Database KBLI 2020 terlengkap untuk izin usaha (OSS RBA). Cari kode klasifikasi bisnis Anda dengan mudah, cepat, dan akurat di sini.',
  keywords: ['KBLI 2020', 'Cek KBLI', 'Kode KBLI', 'Klasifikasi Baku Lapangan Usaha Indonesia', 'Izin Usaha', 'OSS'],
  alternates: {
    canonical: '/kbli',
  },
};

export default function KbliPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* Background Decoration */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      {/* HEADER HERO */}
      <div className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto relative z-10">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-8 animate-fade-in-up">
            <BookOpen size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Database Resmi KBLI 2020</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-8 leading-tight">
           Cari Kode Bidang Usaha <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Untuk Izin OSS Anda.
           </span>
         </h1>
         
         <p className="text-lg md:text-xl text-stone-500 leading-relaxed max-w-2xl mx-auto font-light">
           Temukan kode <strong>Klasifikasi Baku Lapangan Usaha Indonesia (KBLI)</strong> yang tepat sebelum mengurus NIB. Kesalahan kode dapat menghambat proses perizinan.
         </p>
      </div>

      {/* SEARCH COMPONENT */}
      <div className="px-6 pb-24">
         <KbliSearch />
      </div>

    </main>
  );
}