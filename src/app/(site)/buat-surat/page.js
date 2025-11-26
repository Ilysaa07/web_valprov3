import DocGenerator from "@/components/DocGenerator";
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Buat Surat Perjanjian (MoU) Online Gratis - Valpro Intertech',
  description: 'Generator otomatis surat perjanjian kerjasama (MoU) dan kontrak bisnis sederhana. Gratis, cepat, dan langsung jadi.',
};

export default function DocPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <FileText size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Generator Dokumen</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Buat Draf Kontrak <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Dalam Hitungan Detik.
           </span>
         </h1>
         
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
           Alat bantu gratis untuk membuat draf awal Nota Kesepahaman (MoU). <br/>
           <span className="text-xs italic text-red-400">*Catatan: Ini adalah draf dasar. Untuk kontrak bernilai tinggi, selalu konsultasikan dengan ahli hukum kami.</span>
         </p>
      </div>

      <div className="px-6 pb-24">
         <DocGenerator />
      </div>
    </main>
  );
}