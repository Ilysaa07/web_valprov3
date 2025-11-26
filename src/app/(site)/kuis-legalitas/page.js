import BusinessMatcher from "@/components/BusinessMatcher";
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Cek Kecocokan Badan Usaha (PT/CV) - Valpro Intertech',
  description: 'Bingung pilih PT Perorangan, PT Biasa, atau CV? Ikuti kuis 1 menit ini untuk menemukan jenis badan usaha yang paling tepat untuk bisnis Anda.',
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* Header Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-12 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <HelpCircle size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Konsultan Digital</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Pilih PT atau CV? <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Cek Disini.
           </span>
         </h1>
         
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
           Jawab 3 pertanyaan sederhana untuk mengetahui jenis legalitas yang paling menguntungkan dan sesuai dengan model bisnis Anda.
         </p>
      </div>

      <div className="px-6 pb-24">
         <BusinessMatcher />
      </div>

    </main>
  );
}