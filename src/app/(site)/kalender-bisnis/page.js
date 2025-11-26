import ComplianceCalendar from "@/components/ComplianceCalendar";
import { CalendarCheck } from 'lucide-react';

export const metadata = {
  title: 'Kalender Pajak & Kepatuhan Bisnis 2024 - Valpro Intertech',
  description: 'Jadwal lengkap tenggat waktu lapor pajak (SPT/PPN) dan laporan LKPM. Jangan sampai kena denda karena telat lapor.',
};

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <CalendarCheck size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Compliance Calendar</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Jadwal Kepatuhan <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Bisnis & Perpajakan.
           </span>
         </h1>
         
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto">
           Pantau tanggal-tanggal penting agar bisnis Anda tetap aman dari sanksi. Simpan halaman ini atau minta tim kami mengingatkan Anda.
         </p>
      </div>

      <div className="px-6 pb-24">
         <ComplianceCalendar />
      </div>
    </main>
  );
}