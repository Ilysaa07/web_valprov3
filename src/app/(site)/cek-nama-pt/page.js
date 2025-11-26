import PtNameValidator from "@/components/PtNameValidator";
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Cek Aturan Nama PT Online Gratis - Valpro Intertech',
  description: 'Cek kelayakan nama PT Anda sesuai PP 43/2011 (Minimal 3 kata). Alat bantu gratis sebelum pendirian PT di Indonesia.',
};

export default function CheckNamePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* Header */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <ShieldCheck size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Validator Legalitas</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Cek Kelayakan <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Nama PT Anda.
           </span>
         </h1>
         
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
           Pastikan nama perusahaan Anda lolos syarat administratif (Minimal 3 Suku Kata) sebelum mengajukan pendaftaran resmi ke Kemenkumham.
         </p>
      </div>

      {/* Validator Component */}
      <div className="px-6 pb-24">
         <PtNameValidator />
      </div>

    </main>
  );
}