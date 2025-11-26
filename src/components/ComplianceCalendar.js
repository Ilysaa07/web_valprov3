"use client";
import { useState } from 'react';
import { Calendar, ChevronRight, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ComplianceCalendar() {
  const today = new Date();
  const currentMonthIndex = today.getMonth(); // 0 = Jan, 11 = Dec
  const currentYear = today.getFullYear();

  // Data Tanggal Penting (Bisa disesuaikan)
  const routineEvents = [
    { day: 10, title: "Batas Setor PPh Karyawan (21)", type: "monthly" },
    { day: 15, title: "Batas Setor PPh Final UMKM (0.5%)", type: "monthly" },
    { day: 20, title: "Batas Lapor PPN (Masa)", type: "monthly" },
  ];

  const specialEvents = {
    0: [{ day: 10, title: "Lapor LKPM Triwulan IV", type: "quarterly" }], // Jan
    2: [{ day: 31, title: "Deadline SPT Tahunan Pribadi", type: "annual", urgent: true }], // Mar
    3: [ // Apr
      { day: 10, title: "Lapor LKPM Triwulan I", type: "quarterly" },
      { day: 30, title: "Deadline SPT Tahunan Badan", type: "annual", urgent: true }
    ],
    6: [{ day: 10, title: "Lapor LKPM Triwulan II", type: "quarterly" }], // Jul
    9: [{ day: 10, title: "Lapor LKPM Triwulan III", type: "quarterly" }], // Oct
  };

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);

  const getEventsForMonth = (monthIndex) => {
    const events = [...routineEvents];
    if (specialEvents[monthIndex]) {
      events.push(...specialEvents[monthIndex]);
    }
    return events.sort((a, b) => a.day - b.day);
  };

  const handleRemind = (eventTitle) => {
    const text = `Halo Admin Valpro, tolong ingatkan & bantu saya untuk urus: *${eventTitle}*.`;
    window.open(`https://wa.me/6281399710085?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-stone-200 overflow-hidden font-sans flex flex-col lg:flex-row">
      
      {/* KIRI: SIDEBAR BULAN */}
      <div className="lg:w-4/12 bg-stone-50 border-r border-stone-200 p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
         <h3 className="font-bold text-stone-900 mb-6 flex items-center gap-2 px-2">
            <Calendar className="text-[#2a3f9b]" /> Tahun {currentYear}
         </h3>
         <div className="space-y-2">
            {months.map((m, idx) => (
               <button
                  key={idx}
                  onClick={() => setSelectedMonth(idx)}
                  className={`w-full text-left px-6 py-4 rounded-xl flex items-center justify-between transition-all ${
                     selectedMonth === idx 
                     ? 'bg-[#2a3f9b] text-white shadow-md font-bold' 
                     : 'hover:bg-white hover:shadow-sm text-stone-600'
                  }`}
               >
                  <span>{m}</span>
                  {idx === currentMonthIndex && (
                     <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Bulan Ini</span>
                  )}
               </button>
            ))}
         </div>
      </div>

      {/* KANAN: DETAIL AGENDA */}
      <div className="lg:w-8/12 p-8 md:p-12 bg-white relative">
         {/* Header Bulan */}
         <div className="flex items-center justify-between mb-10">
            <div>
               <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Agenda Kepatuhan</p>
               <h2 className="text-3xl font-bold text-stone-900">{months[selectedMonth]} {currentYear}</h2>
            </div>
            <div className="hidden md:block">
               {selectedMonth === currentMonthIndex ? (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Sedang Berjalan
                  </span>
               ) : (
                  <span className="px-4 py-2 bg-stone-100 text-stone-500 rounded-full text-xs font-bold">Mendatang</span>
               )}
            </div>
         </div>

         {/* List Event */}
         <div className="space-y-4">
            {getEventsForMonth(selectedMonth).map((evt, idx) => (
               <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center gap-4 ${
                     evt.urgent 
                     ? 'bg-red-50 border-red-100' 
                     : 'bg-white border-stone-100'
                  }`}
               >
                  {/* Tanggal */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center border ${
                     evt.urgent ? 'bg-white border-red-200 text-red-600' : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}>
                     <span className="text-xs font-bold uppercase">TGL</span>
                     <span className="text-2xl font-bold">{evt.day}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                     <div className="flex items-center gap-2 mb-1">
                        {evt.urgent && <AlertCircle size={16} className="text-red-500" />}
                        <h4 className={`font-bold text-lg ${evt.urgent ? 'text-red-700' : 'text-stone-800'}`}>
                           {evt.title}
                        </h4>
                     </div>
                     <p className="text-xs text-stone-500">
                        {evt.type === 'monthly' ? 'Rutin Bulanan' : evt.type === 'annual' ? 'Wajib Tahunan (Penting!)' : 'Laporan Triwulan'}
                     </p>
                  </div>

                  {/* Action */}
                  <button 
                     onClick={() => handleRemind(evt.title)}
                     className="flex-shrink-0 px-5 py-2.5 bg-white border border-stone-200 text-stone-600 text-sm font-bold rounded-xl hover:border-[#2a3f9b] hover:text-[#2a3f9b] transition flex items-center justify-center gap-2"
                  >
                     <Bell size={16} /> Ingatkan Saya
                  </button>
               </div>
            ))}
         </div>

         {/* Footer Note */}
         <div className="mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-start text-sm text-blue-800/80">
            <CheckCircle2 className="shrink-0 mt-0.5 text-[#2a3f9b]" size={18} />
            <p>
               <strong>Tips Valpro:</strong> Telat lapor pajak bisa kena denda mulai Rp100rb hingga Rp1 Juta. 
               Gunakan jasa konsultan pajak kami agar Anda bebas dari sanksi administrasi.
            </p>
         </div>

      </div>

    </div>
  );
}