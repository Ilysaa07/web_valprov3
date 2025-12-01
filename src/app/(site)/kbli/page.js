import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { KBLI_CATEGORIES } from '@/lib/kbli-kategori';
import KbliSearch from "@/components/KbliSearch";

export const metadata = {
  title: 'Cek KBLI 2020 Terbaru & Lengkap (Online) - Valpro Intertech',
  description: 'Database KBLI 2020 terlengkap untuk izin usaha (OSS RBA). Cari kode klasifikasi bisnis Anda dengan mudah, cepat, dan akurat di sini.',
  keywords: ['KBLI 2020', 'Cek KBLI', 'Kode KBLI', 'Klasifikasi Baku Lapangan Usaha Indonesia', 'Izin Usaha', 'OSS'],
  alternates: {
    canonical: '/kbli',
  },
};

export default function KbliPage() {
  const categories = Object.entries(KBLI_CATEGORIES);

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto relative z-10">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-8">
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

      <div className="px-6 pb-12">
         <KbliSearch />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center">Atau Telusuri Berdasarkan Kategori</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(([code, name]) => (
            <Link key={code} href={`/kbli/kategori/${code}`} className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-stone-200 hover:border-[#2a3f9b] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-stone-100 group-hover:bg-[#2a3f9b] rounded-xl transition-colors">
                  <span className="text-xl font-bold text-[#2a3f9b] group-hover:text-white">{code}</span>
                </div>
                <span className="font-semibold text-stone-700 group-hover:text-[#2a3f9b]">{name}</span>
              </div>
              <ChevronRight size={20} className="text-stone-400 group-hover:text-[#2a3f9b] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}