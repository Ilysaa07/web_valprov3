"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Search, BookA, ChevronRight } from 'lucide-react';
import glossaryData from '@/lib/glossary.json';

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  // Filter data
  const filteredData = glossaryData.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definisi.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  // Group by First Letter (A, B, C...)
  const groupedData = filteredData.reduce((groups, item) => {
    const letter = item.term.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
    return groups;
  }, {});

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-[#FAFAFA] -z-10"></div>
      
      {/* HERO HEADER */}
      <div className="pt-32 pb-12 px-6 text-center max-w-4xl mx-auto">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <BookA size={16} className="text-[#2a3f9b]" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Glosarium Bisnis</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
           Kamus Istilah <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
             Hukum & Bisnis.
           </span>
         </h1>
         <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto mb-10">
           Pahami istilah-istilah sulit dalam dunia legalitas agar Anda tidak salah langkah dalam mengambil keputusan bisnis.
         </p>

         {/* SEARCH BAR */}
         <div className="relative max-w-lg mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2a3f9b] to-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-full shadow-xl flex items-center p-2 border border-stone-100">
                <Search className="ml-4 text-stone-400" />
                <input 
                    type="text" 
                    placeholder="Cari istilah (misal: Domisili, NIB)..." 
                    className="w-full p-3 bg-transparent outline-none text-stone-700 font-medium"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
         </div>
      </div>

      {/* LIST AREA */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
         {Object.keys(groupedData).length > 0 ? (
            Object.keys(groupedData).sort().map(letter => (
               <div key={letter} className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                     <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2a3f9b] text-white text-2xl font-bold shadow-lg shadow-blue-900/20">
                        {letter}
                     </span>
                     <div className="h-px bg-stone-200 flex-grow"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                     {groupedData[letter].map((item, idx) => (
                        <Link 
                           key={idx} 
                           href={`/kamus/${item.slug}`}
                           className="group bg-white p-6 rounded-2xl border border-stone-100 hover:border-[#2a3f9b]/30 hover:shadow-lg transition-all flex items-center justify-between"
                        >
                           <div>
                              <h3 className="font-bold text-stone-800 text-lg group-hover:text-[#2a3f9b] transition-colors">
                                 {item.term}
                              </h3>
                              <span className="text-xs font-medium text-stone-400 bg-stone-50 px-2 py-1 rounded mt-2 inline-block">
                                 {item.kategori}
                              </span>
                           </div>
                           <ChevronRight className="text-stone-300 group-hover:text-[#2a3f9b] transition-transform group-hover:translate-x-1" />
                        </Link>
                     ))}
                  </div>
               </div>
            ))
         ) : (
            <div className="text-center py-20 opacity-50">
               <p>Istilah tidak ditemukan.</p>
            </div>
         )}
      </div>
    </main>
  );
}