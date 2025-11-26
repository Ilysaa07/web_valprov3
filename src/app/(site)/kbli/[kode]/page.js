import kbliData from '@/lib/kbli-full.json';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

// SEO Metadata Dinamis
export async function generateMetadata({ params }) {
  const { kode } = params;
  const data = kbliData.find((item) => item.kode === kode);
  if (!data) return { title: 'KBLI Tidak Ditemukan' };

  return {
    title: `KBLI ${data.kode}: ${data.judul} - Panduan Izin Usaha`,
    description: `Penjelasan lengkap kode KBLI ${data.kode} (${data.judul}). Uraian kegiatan, kategori, dan persyaratan izin usaha OSS RBA.`,
  };
}

// Generate Static Params (Batasi 100 populer agar build tidak timeout)
// Sisanya akan di-render on-demand (SSR)
export async function generateStaticParams() {
  return kbliData.slice(0, 100).map((item) => ({
    kode: item.kode,
  }));
}

export default function KbliDetailPage({ params }) {
  const { kode } = params;
  const data = kbliData.find((item) => item.kode === kode);

  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
         
         <Link href="/kbli" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#2a3f9b] mb-8 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Kembali ke Pencarian
         </Link>

         <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2a3f9b]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center gap-4 mb-6">
               <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center min-w-[100px]">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">KODE</p>
                  <p className="text-3xl font-bold text-[#2a3f9b]">{data.kode}</p>
               </div>
               <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-xs font-bold text-[#2a3f9b] uppercase tracking-wider">
                  KBLI 2020
               </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-stone-900 mb-6 leading-tight">
              {data.judul}
            </h1>

            <div className="prose prose-stone max-w-none">
               <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                  <BookOpen size={18} className="text-[#2a3f9b]"/> Uraian Kegiatan
               </h3>
               <p className="text-stone-600 leading-relaxed text-base">
                  {data.uraian}
               </p>
               
               {data.kategori && (
                 <div className="mt-6 pt-6 border-t border-stone-100 flex items-center gap-2 text-sm text-stone-500">
                    <Tag size={16} /> 
                    <strong>Kategori:</strong> {data.kategori}
                 </div>
               )}
            </div>

            {/* CTA KONTEKSTUAL */}
            <div className="mt-10 bg-[#2a3f9b] rounded-2xl p-6 text-white text-center">
               <h4 className="font-bold text-lg mb-2">Ingin menggunakan KBLI ini?</h4>
               <p className="text-blue-100 text-sm mb-4">
                 Konsultasikan risiko dan syarat perizinan (NIB) untuk kode {data.kode} ini bersama ahli kami.
               </p>
               <a 
                 href={`https://wa.me/6281399710085?text=Halo, saya mau konsultasi izin usaha untuk KBLI ${data.kode} (${data.judul})`}
                 target="_blank"
                 className="inline-block bg-white text-[#2a3f9b] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition shadow-lg"
               >
                 Konsultasi Izin Usaha
               </a>
            </div>

         </div>
      </div>
    </main>
  );
}