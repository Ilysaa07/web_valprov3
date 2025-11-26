"use client";
import { useState, useMemo } from 'react';
import { Search, Copy, Check, FileText, AlertCircle, ArrowDown } from 'lucide-react';
// Pastikan path ini sesuai dengan lokasi file json Anda
import kbliData from '@/lib/kbli-full.json'; 

export default function KbliSearch() {
  const [query, setQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(20); // Virtual Pagination

  // Logika Pencarian Cepat (Memoized)
  const filteredData = useMemo(() => {
    if (!query) return kbliData;
    
    const lowerQuery = query.toLowerCase();
    return kbliData.filter(item => 
      item.kode.includes(lowerQuery) || 
      item.judul.toLowerCase().includes(lowerQuery) ||
      item.uraian.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const visibleData = filteredData.slice(0, displayLimit);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      
      {/* --- SEARCH BAR (Sticky & Glassy) --- */}
      <div className="sticky top-28 z-30 mb-12">
        <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2a3f9b] to-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex items-center p-2 border border-stone-200">
                <div className="pl-6 pr-4 text-stone-400">
                    <Search size={24} />
                </div>
                <input 
                    type="text"
                    className="w-full py-4 bg-transparent text-stone-800 text-lg font-medium focus:outline-none placeholder:text-stone-400"
                    placeholder="Ketik kode (4711) atau kata kunci (Misal: Kafe)..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setDisplayLimit(20); // Reset limit saat mengetik
                    }}
                />
                {query && (
                    <button 
                        onClick={() => setQuery('')} 
                        className="mr-2 px-4 py-2 bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-500 rounded-full text-xs font-bold transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
        <p className="text-center text-xs text-stone-500 mt-4 font-medium">
            Menampilkan <span className="text-[#2a3f9b] font-bold">{visibleData.length}</span> dari total {kbliData.length} kode KBLI 2020
        </p>
      </div>

      {/* --- RESULTS LIST --- */}
      <div className="space-y-6">
        {visibleData.length > 0 ? (
            visibleData.map((item, idx) => (
                <div 
                    key={idx} 
                    className="group bg-white rounded-[2.5rem] p-8 border border-stone-200 hover:border-[#2a3f9b] hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden"
                >
                    {/* Background Number Decoration */}
                    <span className="absolute -right-6 -top-6 text-[120px] font-bold text-stone-50 opacity-50 select-none group-hover:text-blue-50/80 transition-colors pointer-events-none">
                        {item.kode.slice(0, 2)}
                    </span>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        
                        {/* Kiri: Kode Box */}
                        <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center md:items-stretch">
                            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 text-center min-w-[140px] group-hover:bg-[#2a3f9b] group-hover:border-[#2a3f9b] transition-colors duration-300">
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1 group-hover:text-blue-200">KODE</p>
                                <p className="text-4xl font-bold text-stone-900 group-hover:text-white tracking-tight">{item.kode}</p>
                            </div>
                            
                            <button 
                                onClick={() => handleCopy(item.kode)}
                                className="mt-3 w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border border-stone-200 text-stone-500 hover:border-[#2a3f9b] hover:text-[#2a3f9b] hover:bg-white transition-all"
                            >
                                {copiedCode === item.kode ? (
                                    <><Check size={14} className="text-green-500"/> Tersalin</>
                                ) : (
                                    <><Copy size={14}/> Salin Kode</>
                                )}
                            </button>
                        </div>

                        {/* Kanan: Konten */}
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-[#2a3f9b] transition-colors leading-snug">
                                {item.judul}
                            </h3>
                            <p className="text-stone-600 text-sm leading-relaxed mb-6">
                                {item.uraian}
                            </p>
                            
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-500 text-xs font-medium">
                                <FileText size={14} />
                                <span>Kategori: {item.kategori || "Umum"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            // Empty State
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-stone-200">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
                    <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Tidak ditemukan</h3>
                <p className="text-stone-500 max-w-md mx-auto">
                    Kami tidak menemukan kode atau uraian yang cocok dengan kata kunci <strong>"{query}"</strong>. Coba gunakan kata yang lebih umum.
                </p>
            </div>
        )}

        {/* Load More Button */}
        {visibleData.length < filteredData.length && (
            <div className="text-center pt-12 pb-20">
                <button 
                    onClick={() => setDisplayLimit(prev => prev + 20)}
                    className="group px-8 py-4 bg-white border-2 border-stone-200 text-stone-600 font-bold rounded-full hover:border-[#2a3f9b] hover:text-[#2a3f9b] transition-all shadow-sm flex items-center gap-2 mx-auto"
                >
                    Tampilkan Lebih Banyak <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform"/>
                </button>
            </div>
        )}
      </div>
    </div>
  );
}