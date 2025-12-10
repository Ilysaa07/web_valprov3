"use client";
import { useState, useMemo } from 'react';
import { Search, Tag, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import hakiData from '@/lib/haki-classes.json';

export default function TrademarkSearch() {
  const [query, setQuery] = useState("");

  // Filter Logic
  const filteredData = useMemo(() => {
    if (!query) return hakiData;
    const lowerQuery = query.toLowerCase();
    return hakiData.filter(item => 
      item.deskripsi.toLowerCase().includes(lowerQuery) || 
      item.kelas.includes(lowerQuery)
    );
  }, [query]);

  const handleConsult = (item) => {
    const text = `Halo Tim Valpro, saya mau daftar Merek di *Kelas ${item.kelas}* (${item.kategori}). Mohon info biaya dan syaratnya.`;
    window.open(`https://wa.me/6281399710085?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      
      {/* SEARCH BOX */}
      <div className="bg-white p-2 rounded-full shadow-xl border border-stone-100 flex items-center mb-12 relative z-20">
         <div className="pl-4 pr-2 text-stone-400">
            <Search size={24} />
         </div>
         <input 
            type="text"
            className="w-full p-3 text-lg outline-none text-stone-800 placeholder:text-stone-400 bg-transparent"
            placeholder="Cari produk Anda (Contoh: Kopi, Baju, Restoran)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
         />
         <button className="bg-[#2a3f9b] hover:bg-[#1e2f75] text-white px-6 py-3 rounded-full font-bold transition-all hidden md:block">
            Cari Kelas
         </button>
      </div>

      {/* RESULT LIST */}
      <div className="space-y-4">
         {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
               <div 
                 key={idx} 
                 className="group bg-white p-6 rounded-[2rem] border border-stone-200 hover:border-[#2a3f9b] hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center"
               >
                  {/* Class Badge */}
                  <div className="flex-shrink-0 text-center bg-stone-50 p-4 rounded-2xl min-w-[100px] border border-stone-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                     <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">KELAS</p>
                     <p className="text-4xl font-bold text-[#2a3f9b]">{item.kelas}</p>
                     <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-stone-200 text-stone-500 uppercase">
                        {item.kategori}
                     </span>
                  </div>

                  {/* Desc */}
                  <div className="flex-grow">
                     <p className="text-stone-600 text-sm leading-relaxed mb-4">
                        {item.deskripsi}
                     </p>
                     {/* Keywords matching highlight logic could go here */}
                     <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Tag size={14} /> Cocok untuk bisnis terkait
                     </div>
                  </div>

                  {/* CTA */}
                  <button 
                     onClick={() => handleConsult(item)}
                     className="flex-shrink-0 w-full md:w-auto py-3 px-6 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-[#2a3f9b] transition-colors flex items-center justify-center gap-2"
                  >
                     Daftar <ArrowRight size={16} />
                  </button>
               </div>
            ))
         ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-300">
               <HelpCircle size={32} className="mx-auto text-stone-300 mb-3" />
               <p className="text-stone-500">Tidak ditemukan. Coba kata kunci lain (Misal: &quot;Makanan&quot;).</p>
            </div>
         )}
      </div>
      
      {/* INFO BOX */}
      <div className="mt-12 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
         <ShieldCheck className="text-[#2a3f9b] flex-shrink-0 mt-1" size={24} />
         <div>
            <h4 className="font-bold text-[#2a3f9b] text-sm mb-1">Pentingnya Memilih Kelas yang Tepat</h4>
            <p className="text-xs text-blue-800/70 leading-relaxed">
               Merek hanya dilindungi di kelas tempat ia didaftarkan. Jika Anda menjual &quot;Kopi Bubuk&quot; (Kelas 30) dan membuka &quot;Kafe&quot; (Kelas 43), disarankan mendaftar di kedua kelas tersebut untuk perlindungan maksimal.
            </p>
         </div>
      </div>

    </div>
  );
}