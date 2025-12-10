"use client";
import { useState, useMemo } from 'react';
import { Search, Copy, Check, FileText, AlertCircle, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import kbliDataRaw from '@/lib/kbli2020.json'; 
import { getCategoryForCode, KBLI_CATEGORIES } from '@/lib/kbli-kategori';

// Adapt the data structure
const kbliData = kbliDataRaw.map(item => ({
  kode: item["Kode KBLI"],
  judul: item["KBLI"],
  uraian: item["Deskripsi"],
}));

export default function KbliSearch() {
  const [query, setQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(20);

  const filteredData = useMemo(() => {
    if (!query) return []; // Return empty array if no query
    
    const lowerQuery = query.toLowerCase();
    return kbliData.filter(item => 
      item.kode.includes(lowerQuery) || 
      item.judul.toLowerCase().includes(lowerQuery) ||
      (item.uraian && item.uraian.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  const visibleData = filteredData.slice(0, displayLimit);

  const handleCopy = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      
      <div className="sticky top-28 z-30 mb-12">
        <div className="relative group">
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
                        setDisplayLimit(20);
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
        {query && (
            <p className="text-center text-xs text-stone-500 mt-4 font-medium">
                Hasil pencarian untuk <span className="text-[#2a3f9b] font-bold">&quot;{query}&quot;</span>. Menampilkan <span className="text-[#2a3f9b] font-bold">{visibleData.length}</span> dari {filteredData.length} hasil.
            </p>
        )}
      </div>

      <div className="space-y-6">
        {query && visibleData.length > 0 ? (
            visibleData.map((item, idx) => {
                const categoryCode = getCategoryForCode(item.kode);
                const categoryName = categoryCode ? KBLI_CATEGORIES[categoryCode] : "Tidak Diketahui";
                return (
                    <Link href={`/kbli/${item.kode}`} key={idx} className="block group bg-white rounded-2xl p-8 border border-stone-200 hover:border-[#2a3f9b] hover:shadow-lg transition-all duration-300 relative">
                        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-grow">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-xl font-bold text-[#2a3f9b]">{item.kode}</span>
                                    {categoryCode && (
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2a3f9b] text-xs font-bold">{categoryCode}: {categoryName}</span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-stone-900 mb-3 group-hover:text-blue-700">
                                    {item.judul}
                                </h3>
                                <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                                    {item.uraian}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                 <button 
                                    onClick={(e) => handleCopy(e, item.kode)}
                                    className="py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border border-stone-200 text-stone-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                                >
                                    {copiedCode === item.kode ? (
                                        <><Check size={14} className="text-green-500"/> Tersalin</>
                                    ) : (
                                        <><Copy size={14}/> Salin Kode</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </Link>
                )
            })
        ) : (
             query && (
                <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-stone-200">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Tidak Ditemukan</h3>
                    <p className="text-stone-500 max-w-md mx-auto text-sm">
                        Kami tidak menemukan kode atau uraian yang cocok dengan kata kunci <strong>&quot;{query}&quot;</strong>. Coba gunakan kata yang lebih umum.
                    </p>
                </div>
            )
        )}

        {visibleData.length < filteredData.length && (
            <div className="text-center pt-12">
                <button 
                    onClick={() => setDisplayLimit(prev => prev + 20)}
                    className="group px-6 py-3 bg-white border-2 border-stone-200 text-stone-600 font-bold rounded-full hover:border-[#2a3f9b] hover:text-[#2a3f9b] transition-all shadow-sm flex items-center gap-2 mx-auto text-sm"
                >
                    Tampilkan Lebih Banyak <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform"/>
                </button>
            </div>
        )}
      </div>
    </div>
  );
}