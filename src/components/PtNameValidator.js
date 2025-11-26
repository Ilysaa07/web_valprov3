"use client";
import { useState } from 'react';
import { CheckCircle, XCircle, Search, AlertTriangle, Send, RefreshCcw } from 'lucide-react';

export default function PtNameValidator() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null); // 'success', 'error', 'warning'
  const [message, setMessage] = useState('');

  // Daftar kata asing umum yang sering ditolak Kemenkumham
  // Anda bisa menambahkan kata lain ke daftar ini
 // Daftar kata asing yang sering ditolak Kemenkumham (Diperlengkap)
  const FORBIDDEN_WORDS = [
    // --- Corporate & Legal ---
    "TRADING", "GENERAL", "CONTRACTOR", "SUPPLIER", "SERVICE", "SERVICES",
    "GROUP", "GLOBAL", "INTERNATIONAL", "SOLUTION", "SOLUTIONS", 
    "MANAGEMENT", "HOLDING", "CORP", "CORPORATION", "INC", "LTD", 
    "LIMITED", "INVESTMENT", "FINANCE", "PARTNERS", "ASSOCIATES", 
    "ENTERPRISE", "VENTURES", "ALLIANCE", "UNION", "UNITED", "TRUST", 
    "COMPANY", "INDUSTRIES", "INDUSTRY", "MANUFACTURING",

    // --- Property, Construction & Engineering ---
    "ESTATE", "PROPERTY", "CONSTRUCTION", "CONSULTING", "CONSULTANT",
    "DEVELOPMENT", "DEVELOPER", "REALTY", "RESIDENCE", "LAND", "BUILD",
    "ENGINEERING", "ENGINEER", "ARCHITECT", "ARCHITECTURE", "DESIGN", 
    "INTERIOR", "EXTERIOR", "PROJECT", "INFRASTRUCTURE",

    // --- Technology & Media ---
    "TECHNOLOGY", "DIGITAL", "SYSTEM", "SYSTEMS", "NETWORK", "NETWORKS",
    "DATA", "CYBER", "SOFT", "SOFTWARE", "HARDWARE", "IT", "TECH",
    "MEDIA", "CREATIVE", "STUDIO", "PRODUCTION", "ENTERTAINMENT", 
    "COMMUNICATION", "BROADCAST", "ADVERTISING",

    // --- Trade, Retail & Logistics ---
    "LOGISTICS", "LINES", "WORLD", "ASIA", "PACIFIC", "EURO",
    "IMPORT", "EXPORT", "DISTRIBUTOR", "DISTRIBUTION", "AGENCY", "AGENT",
    "STORE", "SHOP", "MART", "MARKET", "SUPERMARKET", "RETAIL", 
    "WHOLESALE", "TRANSPORT", "CARGO", "FREIGHT", "EXPRESS", "SHIPPING", 
    "DELIVERY", "TRANS",

    // --- Energy & Resources ---
    "ENERGY", "POWER", "MINING", "RESOURCES", "OIL", "GAS", "MARINE", 
    "OCEAN", "SOLAR", "ELECTRIC", "CHEMICAL", "PETRO",

    // --- Lifestyle, Health, F&B ---
    "TRAVEL", "TOUR", "TOURISM", "TRIP", "HOTEL", "VILLA", "RESORT",
    "HEALTH", "CARE", "MEDICAL", "CLINIC", "PHARMA", "PHARMACY",
    "BEAUTY", "SKIN", "SPA", "WELLNESS", "FITNESS", "GYM",
    "FOOD", "BEVERAGE", "CATERING", "RESTAURANT", "CAFE", "COFFEE", "KITCHEN",
    "BAKERY", "FASHION", "APPAREL", "TEXTILE", "CLOTHING", "STYLE",

    // --- Education & Services ---
    "EDUCATION", "ACADEMY", "SCHOOL", "INSTITUTE", "TRAINING", "CENTER",
    "SECURITY", "GUARD", "CLEANING", "LAUNDRY", "AUTO", "GARAGE",

    // --- Agriculture ---
    "AGRO", "FARM", "AGRICULTURE", "PLANTATION", "FISHERY",

    // --- Common Adjectives (Sering diminta ganti ke Bhs Indonesia) ---
    "GOLD", "SILVER", "PLATINUM", "DIAMOND",
    "PRIME", "ELITE", "SMART", "BEST", "TOP", "FIRST", 
    "NEW", "MODERN", "FUTURE", "GREEN", "BLUE", "RED", "BLACK", "WHITE",
    "KING", "QUEEN", "ROYAL", "STAR", "SUN", "MOON", "SKY"
  ];

  const checkName = () => {
    // 1. Bersihkan input (Hapus PT di depan & spasi ganda)
    let cleanName = name.replace(/^(pt\.?\s*|perseroan\s*terbatas\s*)/i, '').trim();
    
    // 2. Cek jika kosong
    if (!cleanName) {
        setResult('error');
        setMessage("Mohon masukkan nama PT yang diinginkan.");
        return;
    }

    const words = cleanName.split(/\s+/);
    const wordCount = words.length;
    const upperName = cleanName.toUpperCase();

    // 3. Cek Angka & Simbol (STRICT: Hanya boleh Huruf A-Z dan Spasi)
    if (/[^a-zA-Z\s]/.test(cleanName)) {
        setResult('error');
        setMessage("Nama PT hanya boleh mengandung Huruf Latin. Angka dan tanda baca (&, -, @) dilarang.");
        return;
    }

    // 4. Cek Jumlah Kata
    if (wordCount < 3) {
        setResult('error');
        setMessage(`Nama PT wajib minimal 3 kata. Nama Anda baru ${wordCount} kata.`);
        return;
    }

    // 5. Cek Kata Asing (Fitur Pengetatan Baru)
    const foundForeign = words.filter(word => FORBIDDEN_WORDS.includes(word.toUpperCase()));
    
    if (foundForeign.length > 0) {
        setResult('warning');
        setMessage(`Terdeteksi kata asing: "${foundForeign.join(', ')}". Sesuai PP 43/2011, nama PT wajib menggunakan Bahasa Indonesia. Ganti dengan padanan (Contoh: 'Trading' ganti 'Perdagangan').`);
        return;
    }

    // 6. Lolos Validasi
    setResult('success');
    setMessage(`"PT ${upperName}" terlihat valid! (3 kata, tanpa simbol, & bahasa Indonesia).`);
  };

  const handleConsult = () => {
    const cleanName = name.replace(/^(pt\.?\s*|perseroan\s*terbatas\s*)/i, '').trim().toUpperCase();
    const text = `Halo Tim Valpro, saya ingin mendaftarkan nama *PT ${cleanName}*. Mohon bantu cek ketersediaan resmi di sistem AHU.`;
    window.open(`https://wa.me/6281399710085?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-stone-200 overflow-hidden font-sans">
      <div className="grid md:grid-cols-12 min-h-[450px]">
        
        {/* KIRI: Input Area */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-8">
           <div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">Cek Aturan Nama PT</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Nama PT wajib terdiri dari <strong>minimal 3 kata</strong> dalam <strong>Bahasa Indonesia</strong>. Sistem kami akan mendeteksi jika ada pelanggaran aturan dasar.
              </p>
           </div>

           <div className="space-y-4">
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest">Masukkan Kandidat Nama</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-stone-400 font-bold text-lg">PT. </span>
                 </div>
                 <input 
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setResult(null); 
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && checkName()}
                    placeholder="Contoh: Sinar Abadi Sentosa"
                    className="w-full pl-14 pr-4 py-5 bg-stone-50 border-2 border-stone-100 rounded-2xl text-xl font-bold text-stone-800 focus:outline-none focus:border-[#2a3f9b] focus:bg-white transition-all placeholder:font-normal placeholder:text-base"
                 />
              </div>
              
              <button 
                onClick={checkName}
                className="w-full py-4 bg-[#2a3f9b] hover:bg-[#1e2f75] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {result ? <RefreshCwIcon /> : <Search size={18} />} 
                {result ? 'Cek Nama Lain' : 'Validasi Nama'}
              </button>
           </div>
        </div>

        {/* KANAN: Result Area */}
        <div className={`md:col-span-5 p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-500 ${
            result === 'success' ? 'bg-green-50 border-l-4 border-green-400' : 
            result === 'error' ? 'bg-red-50 border-l-4 border-red-400' :
            result === 'warning' ? 'bg-amber-50 border-l-4 border-amber-400' :
            'bg-stone-50 border-l border-stone-100'
        }`}>
           
           {/* Pattern Background */}
           <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

           {!result && (
              <div className="opacity-40 space-y-4">
                 <div className="w-20 h-20 mx-auto bg-stone-200 rounded-full flex items-center justify-center animate-pulse">
                    <Search size={36} className="text-stone-400"/>
                 </div>
                 <p className="text-sm text-stone-500 font-medium">Hasil validasi akan muncul di sini</p>
              </div>
           )}

           {/* HASIL: ERROR (Kurang kata / Simbol) */}
           {result === 'error' && (
              <div className="relative z-10 animate-fade-in-up w-full">
                 <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 text-red-500 shadow-sm">
                    <XCircle size={48} />
                 </div>
                 <h4 className="text-xl font-bold text-red-700 mb-2">Ditolak Sistem</h4>
                 <p className="text-red-600 text-sm mb-6 font-medium">
                   {message}
                 </p>
              </div>
           )}

           {/* HASIL: WARNING (Bahasa Inggris/Asing) */}
           {result === 'warning' && (
              <div className="relative z-10 animate-fade-in-up w-full">
                 <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 text-amber-500 shadow-sm">
                    <AlertTriangle size={48} />
                 </div>
                 <h4 className="text-xl font-bold text-amber-700 mb-2">Peringatan Bahasa</h4>
                 <p className="text-amber-700 text-sm mb-6 font-medium leading-relaxed">
                   {message}
                 </p>
                 <p className="text-xs text-stone-400 bg-white/50 p-2 rounded-lg">
                   *Saran: Gunakan Bahasa Indonesia (E.g: "Global"  "Dunia/Semesta")
                 </p>
              </div>
           )}

           {/* HASIL: SUCCESS */}
           {result === 'success' && (
              <div className="relative z-10 animate-fade-in-up w-full">
                 <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm">
                    <CheckCircle size={48} />
                 </div>
                 <h4 className="text-xl font-bold text-green-800 mb-2">Struktur Valid!</h4>
                 <p className="text-green-700 text-sm mb-8 font-medium">
                   {message}
                 </p>
                 
                 <div className="bg-white p-5 rounded-2xl shadow-xl border border-green-100 transform hover:-translate-y-1 transition-transform">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Langkah Terakhir</p>
                    <button 
                      onClick={handleConsult}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                    >
                      <Send size={16} /> Cek Ketersediaan Resmi
                    </button>
                    <p className="text-[10px] text-stone-400 mt-3">
                      *Konsultasikan ke admin untuk cek duplikasi nama di AHU.
                    </p>
                 </div>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}

function RefreshCwIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
    )
}