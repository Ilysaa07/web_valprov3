"use client";
import { useState, useEffect } from 'react';
import { Check, Calculator, HelpCircle, Send, ShieldCheck } from 'lucide-react';
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

export default function CostSimulator() {
  // --- DATA HARGA (Bisa diubah sesuai harga asli Valpro) ---
  const baseServices = [
    { 
      id: 'pt_perorangan', 
      label: 'Pendirian PT Perorangan', 
      price: 2900000, 
      desc: 'Cocok untuk UMK (Pendiri Tunggal), tanggung jawab terbatas.',
      features: ['SK Kemenkumham', 'NIB OSS RBA', 'NPWP Badan']
    },
    { 
      id: 'pt_biasa', 
      label: 'Pendirian PT Umum (Biasa)', 
      price: 4500000, 
      desc: 'Standar bisnis profesional, minimal 2 pendiri (Pemegang Saham).',
      features: ['Akta Notaris', 'SK Kemenkumham', 'NIB OSS', 'NPWP & SKT']
    },
    { 
      id: 'cv', 
      label: 'Pendirian CV', 
      price: 3500000, 
      desc: 'Lebih hemat biaya, minimal 2 orang (Persero Aktif & Pasif).',
      features: ['Akta Notaris', 'SK Kemenkumham', 'NIB OSS', 'NPWP']
    },
  ];

  const addons = [
    { id: 'vo', label: 'Sewa Virtual Office (1 Tahun)', price: 3000000 },
    { id: 'pkp', label: 'Pengurusan PKP (Pengusaha Kena Pajak)', price: 1500000 },
    { id: 'merek', label: 'Pendaftaran Merek (HAKI)', price: 2500000 },
    { id: 'oss_priority', label: 'Layanan Prioritas (Express)', price: 1000000 },
  ];
  // ---------------------------------------------------------

  const [selectedBase, setSelectedBase] = useState(baseServices[1]); // Default pilih PT Biasa
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Logic Toggle Addon
  const toggleAddon = (addon) => {
    if (selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Hitung Total
  const totalCost = selectedBase.price + selectedAddons.reduce((acc, curr) => acc + curr.price, 0);

  // Format Rupiah
  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const [whatsappNumber, setWhatsappNumber] = useState('6289518530306'); // Default value

  useEffect(() => {
    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.mainNumber || settings.secondaryNumber || '6289518530306');
    };

    loadWhatsappSettings();
  }, []);

  // Kirim ke WhatsApp
  const handleConsult = () => {
    const addonText = selectedAddons.length > 0 ? ` + Tambahan: ${selectedAddons.map(a => a.label).join(', ')}` : '';

    const message = `Halo Tim Valpro, saya tertarik dengan simulasi biaya di website:

📦 *Paket:* ${selectedBase.label}
➕ *Add-ons:* ${addonText || '-'}

💰 *Estimasi Total:* ${formatRp(totalCost)}

Mohon info kelengkapan syaratnya. Terima kasih.`;

    const whatsappUrl = createWhatsAppUrl(whatsappNumber, message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-stone-200 overflow-hidden font-sans flex flex-col lg:flex-row">
        
        {/* KIRI: AREA PEMILIHAN */}
        <div className="lg:w-7/12 p-8 md:p-12 space-y-10">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                 <Calculator size={16} className="text-[#2a3f9b]" />
                 <span className="text-xs font-bold text-[#2a3f9b] uppercase tracking-wider">Estimasi Transparan</span>
              </div>
              <h3 className="text-3xl font-bold text-stone-900 mb-3">Sesuaikan Kebutuhan</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Pilih jenis badan usaha dan layanan tambahan yang Anda butuhkan. Harga yang tertera adalah estimasi lengkap tanpa biaya tersembunyi.
              </p>
           </div>

           {/* 1. Pilih Badan Usaha */}
           <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Langkah 1: Pilih Badan Usaha</p>
              <div className="space-y-4">
                {baseServices.map((item) => (
                   <div 
                      key={item.id}
                      onClick={() => setSelectedBase(item)}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ${
                         selectedBase.id === item.id 
                         ? 'border-[#2a3f9b] bg-blue-50/30 shadow-md' 
                         : 'border-stone-100 hover:border-blue-200 hover:bg-stone-50'
                      }`}
                   >
                      <div className="flex items-start justify-between mb-2 relative z-10">
                         <div className="flex items-center gap-3">
                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedBase.id === item.id ? 'border-[#2a3f9b]' : 'border-stone-300'}`}>
                                {selectedBase.id === item.id && <div className="w-3 h-3 rounded-full bg-[#2a3f9b]"></div>}
                             </div>
                             <span className={`font-bold text-lg ${selectedBase.id === item.id ? 'text-[#2a3f9b]' : 'text-stone-700'}`}>{item.label}</span>
                         </div>
                         <span className="font-bold text-stone-900">{formatRp(item.price)}</span>
                      </div>
                      <p className="text-sm text-stone-500 ml-9 mb-3">{item.desc}</p>
                      
                      {/* Fitur List Kecil */}
                      <div className="ml-9 flex flex-wrap gap-2">
                        {item.features.map((feat, idx) => (
                            <span key={idx} className="text-[10px] bg-white border border-stone-200 px-2 py-1 rounded-md text-stone-500">{feat}</span>
                        ))}
                      </div>
                   </div>
                ))}
              </div>
           </div>

           {/* 2. Pilih Add-ons */}
           <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Langkah 2: Layanan Tambahan (Opsional)</p>
              <div className="grid sm:grid-cols-2 gap-4">
                 {addons.map((addon) => {
                    const isSelected = selectedAddons.find(a => a.id === addon.id);
                    return (
                       <div 
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${
                             isSelected 
                             ? 'bg-[#2a3f9b] border-[#2a3f9b] text-white shadow-lg shadow-blue-900/20 transform scale-[1.02]' 
                             : 'bg-white border-stone-100 text-stone-600 hover:border-blue-200'
                          }`}
                       >
                          <div className="flex justify-between items-start mb-1">
                             <span className="font-bold text-sm">{addon.label}</span>
                             {isSelected ? <Check size={16} className="text-white" /> : <div className="w-4 h-4 rounded border border-stone-300"></div>}
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-stone-400'}`}>{formatRp(addon.price)}</span>
                       </div>
                    )
                 })}
              </div>
           </div>
        </div>

        {/* KANAN: SUMMARY (Sticky Effect) */}
        <div className="lg:w-5/12 bg-stone-50 border-l border-stone-200 p-8 md:p-12 flex flex-col justify-between relative">
           {/* Background Pattern */}
           <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-[radial-gradient(#2a3f9b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

           <div className="relative z-10">
              <h4 className="text-xl font-bold text-stone-900 mb-8 flex items-center gap-2">
                 <ShieldCheck className="text-[#2a3f9b]"/> Ringkasan Biaya
              </h4>
              
              <div className="space-y-4 mb-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                 <div className="flex justify-between text-sm pb-4 border-b border-stone-100">
                    <div>
                        <span className="block font-bold text-stone-800">{selectedBase.label}</span>
                        <span className="text-xs text-stone-400">Paket Utama</span>
                    </div>
                    <span className="font-bold text-stone-900">{formatRp(selectedBase.price)}</span>
                 </div>
                 
                 {selectedAddons.length > 0 ? (
                     selectedAddons.map((addon, idx) => (
                        <div key={idx} className="flex justify-between text-sm animate-fade-in-up">
                           <span className="text-stone-500">+ {addon.label}</span>
                           <span className="font-medium text-stone-700">{formatRp(addon.price)}</span>
                        </div>
                     ))
                 ) : (
                     <p className="text-xs text-stone-400 italic text-center py-2">Belum ada layanan tambahan dipilih</p>
                 )}
              </div>

              <div className="flex justify-between items-end mb-2 px-2">
                 <span className="text-stone-500 font-bold text-sm">Total Estimasi</span>
                 <span className="text-4xl font-bold text-[#2a3f9b]">{formatRp(totalCost)}</span>
              </div>
              <p className="text-[10px] text-stone-400 px-2 mb-8 text-right">*Harga dapat berubah sewaktu-waktu sesuai kebijakan.</p>

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
                 <HelpCircle size={18} className="text-[#2a3f9b] mt-0.5 shrink-0"/>
                 <p className="text-xs text-stone-600 leading-relaxed">
                   <strong>Butuh penawaran resmi?</strong><br/>
                   Klik tombol di bawah untuk mengirim rincian ini ke WhatsApp kami. Konsultan kami akan memvalidasi data Anda.
                 </p>
              </div>
           </div>

           <button 
              onClick={handleConsult}
              className="mt-8 w-full py-4 bg-[#2a3f9b] hover:bg-[#1e2f75] text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 relative z-10"
           >
              <Send size={18} /> Ambil Penawaran Ini
           </button>
        </div>

    </div>
  );
}