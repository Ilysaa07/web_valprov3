import TaxCalculator from "@/components/TaxCalculator";
import { Calculator } from 'lucide-react';

export const metadata = {
  title: 'Kalkulator Pajak UMKM (PPh Final 0.5%) - Valpro Intertech',
  description: 'Hitung otomatis pajak UMKM Anda. Alat bantu gratis untuk menghitung PPh Final 0.5% sesuai PP 23 Tahun 2018.',
};

export default function TaxPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <Calculator size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Tools Bisnis Gratis</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Hitung Pajak Bisnis <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Tanpa Pusing.
           </span>
         </h1>
         
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
           Khusus untuk UMKM dengan omzet di bawah 4,8 Miliar per tahun. Ketahui kewajiban pajak Anda dalam hitungan detik.
         </p>
      </div>

      <div className="px-6 pb-24">
         <TaxCalculator />
      </div>
    </main>
  );
}