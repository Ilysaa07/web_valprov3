import TrademarkSearch from "@/components/TrademarkSearch";
import { Tag } from 'lucide-react';

export const metadata = {
  title: 'Cek Kelas Merek (HAKI) Online - Valpro Intertech',
  description: 'Cari kelas merek (Nice Classification) yang tepat untuk bisnis Anda. Lindungi brand Anda dengan pendaftaran HAKI yang sesuai kelas.',
};

export default function TrademarkPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* Header Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <Tag size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Klasifikasi Merek (Nice Class)</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Lindungi Brand Anda <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Di Kelas Yang Tepat.
           </span>
         </h1>
         
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
           Salah pilih kelas bisa membuat perlindungan merek tidak berlaku. Gunakan alat ini untuk menemukan klasifikasi yang sesuai dengan produk atau jasa Anda.
         </p>
      </div>

      <div className="px-6 pb-24">
         <TrademarkSearch />
      </div>
      
    </main>
  );
}