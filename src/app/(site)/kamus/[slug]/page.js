import glossaryData from '@/lib/glossary.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2, BookOpen, MessageCircle } from 'lucide-react';

// SEO Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = glossaryData.find((i) => i.slug === slug);
  if (!item) return { title: 'Istilah Tidak Ditemukan' };

  return {
    title: `Apa itu ${item.term}? Pengertian & Penjelasan Lengkap - Kamus Valpro`,
    description: `Definisi ${item.term} dalam dunia bisnis dan legalitas. ${item.definisi.substring(0, 150)}...`,
  };
}

// Static Generation (Agar loading instan)
export async function generateStaticParams() {
  return glossaryData.map((item) => ({
    slug: item.slug,
  }));
}

export default function GlossaryDetail({ params }) {
  const { slug } = params; // Tidak perlu await di sini untuk versi statis (atau sesuaikan jika async)
  const item = glossaryData.find((i) => i.slug === slug);

  if (!item) return notFound();

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col justify-center items-center py-20 px-6">
      
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-stone-200/50 border border-stone-100 relative overflow-hidden">
         
         {/* Background Blob */}
         <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2a3f9b]/5 rounded-full blur-3xl"></div>

         {/* Navigasi Balik */}
         <Link href="/kamus" className="inline-flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-[#2a3f9b] mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Kembali ke Kamus
         </Link>

         {/* Header */}
         <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-[#2a3f9b] text-xs font-bold uppercase tracking-wider mb-4">
               {item.kategori}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
               {item.term}
            </h1>
         </div>

         {/* Definisi (Main Content) */}
         <div className="prose prose-lg prose-stone max-w-none mb-10">
            <p className="text-xl leading-relaxed font-medium text-stone-600">
               {item.definisi}
            </p>
         </div>

         {/* Call to Action Contextual */}
         <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2a3f9b] shadow-sm shrink-0">
               <BookOpen size={24} />
            </div>
            <div className="text-center md:text-left">
               <h4 className="font-bold text-stone-900 text-lg">Butuh bantuan soal {item.term}?</h4>
               <p className="text-stone-500 text-sm mt-1">Konsultasikan kebutuhan legalitas Anda dengan ahli kami.</p>
            </div>
            <Link 
               href={`https://wa.me/6281399710085?text=Halo, saya mau tanya lebih lanjut soal *${item.term}*`}
               className="md:ml-auto px-6 py-3 bg-[#2a3f9b] hover:bg-[#1e2f75] text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2"
            >
               <MessageCircle size={18} /> Tanya Ahli
            </Link>
         </div>

      </div>
      
    </main>
  );
}