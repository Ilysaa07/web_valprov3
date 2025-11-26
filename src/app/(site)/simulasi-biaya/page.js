import CostSimulator from "@/components/CostSimulator";
import { Calculator } from 'lucide-react';

export const metadata = {
  title: 'Simulasi Biaya Pendirian PT & CV - Valpro Intertech',
  description: 'Hitung estimasi biaya pendirian PT, CV, dan perizinan usaha lainnya secara transparan. Dapatkan penawaran harga terbaik sekarang.',
};

export default function CostSimulatorPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* Header Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <Calculator size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Quotation Generator</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Rencanakan Biaya Legalitas <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Sesuai Budget Anda.
           </span>
         </h1>
         
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
           Transparansi adalah kunci. Gunakan kalkulator interaktif kami untuk mendapatkan gambaran investasi yang dibutuhkan untuk melegalkan bisnis Anda.
         </p>
      </div>

      <div className="px-6 pb-24">
         <CostSimulator />
      </div>
      
    </main>
  );
}