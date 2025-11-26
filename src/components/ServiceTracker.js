"use client";
import { useState } from 'react';
import { Search, CheckCircle, Clock, Package, AlertCircle } from 'lucide-react';
import trackingData from '@/lib/trackingData.json'; // Import data

export default function ServiceTracker() {
  const [invoice, setInvoice] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    setError(false);
    setResult(null);

    // Cari data yang ID-nya cocok (case insensitive)
    const found = trackingData.find(item => item.id.toLowerCase() === invoice.trim().toLowerCase());

    if (found) {
      setResult(found);
    } else {
      setError(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      
      {/* SEARCH BOX */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-200 text-center relative z-10">
         <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#2a3f9b]">
            <Package size={32} />
         </div>
         <h2 className="text-2xl font-bold text-stone-900 mb-3">Lacak Status Layanan</h2>
         <p className="text-stone-500 mb-8">Masukkan Nomor Invoice Anda (Contoh: INV-2024001) untuk melihat progres pengerjaan dokumen.</p>

         <form onSubmit={handleTrack} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
               type="text" 
               placeholder="Nomor Invoice..." 
               value={invoice}
               onChange={(e) => setInvoice(e.target.value)}
               className="flex-grow px-6 py-3 rounded-full border-2 border-stone-200 focus:border-[#2a3f9b] outline-none text-stone-800 font-bold uppercase text-center sm:text-left transition-colors"
            />
            <button type="submit" className="px-8 py-3 bg-[#2a3f9b] hover:bg-[#1e2f75] text-white rounded-full font-bold shadow-lg transition-all active:scale-95">
               Lacak
            </button>
         </form>

         {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 text-sm font-medium animate-fade-in-up">
               <AlertCircle size={18} /> Data tidak ditemukan. Mohon cek kembali nomor invoice Anda.
            </div>
         )}
      </div>

      {/* RESULT SECTION */}
      {result && (
         <div className="mt-8 bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden shadow-lg animate-fade-in-up">
            
            {/* Header Result */}
            <div className="bg-stone-50 p-6 md:p-8 border-b border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Nama Klien</p>
                  <h3 className="text-xl font-bold text-stone-900">{result.clientName}</h3>
                  <p className="text-sm text-stone-500 mt-1">{result.service}</p>
               </div>
               <div className="text-left md:text-right">
                   <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Status Terkini</p>
                   <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-[#2a3f9b] rounded-full text-sm font-bold">
                      <Clock size={14} className="animate-pulse" /> {result.status}
                   </span>
               </div>
            </div>

            {/* Timeline */}
            <div className="p-8 md:p-10">
               <div className="relative space-y-0">
                  {/* Garis Vertikal */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-stone-200"></div>

                  {result.history.map((step, idx) => (
                     <div key={idx} className="relative flex gap-6 pb-8 last:pb-0 group">
                        {/* Dot Indikator */}
                        <div className={`relative z-10 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm ${step.done ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                           {step.done ? <CheckCircle size={20} /> : <span className="w-3 h-3 bg-stone-400 rounded-full"></span>}
                        </div>
                        
                        {/* Text Content */}
                        <div className={`flex-grow pt-1 ${step.done ? 'opacity-100' : 'opacity-50'}`}>
                           <h4 className="font-bold text-stone-900 text-lg">{step.step}</h4>
                           <p className="text-sm text-stone-500 font-mono mt-1">{step.date}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Footer Result */}
            <div className="bg-stone-50 p-4 text-center border-t border-stone-100">
               <p className="text-xs text-stone-400">Terakhir diperbarui: <strong>{result.lastUpdate}</strong></p>
            </div>
         </div>
      )}

    </div>
  );
}