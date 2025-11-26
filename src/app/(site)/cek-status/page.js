import ServiceTracker from "@/components/ServiceTracker";
import { Package } from 'lucide-react';

export const metadata = {
  title: 'Cek Status Berkas Legalitas - Valpro Intertech',
  description: 'Pantau progres pengerjaan dokumen legalitas PT, CV, atau Merek Anda secara real-time dengan nomor invoice.',
};

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <Package size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Tracking System</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Pantau Dokumen <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Secara Real-Time.
           </span>
         </h1>
      </div>

      <div className="px-6 pb-24">
         <ServiceTracker />
      </div>
    </main>
  );
}