"use client";
import { useState, useEffect } from 'react';
import { Calculator, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

export default function TaxCalculator() {
  const [omzet, setOmzet] = useState('');
  const [result, setResult] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('6289518530306'); // Default value

  useEffect(() => {
    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.mainNumber || settings.secondaryNumber || '6289518530306');
    };

    loadWhatsappSettings();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const calculateTax = () => {
    const omzetValue = parseInt(omzet.replace(/\D/g, '')); // Hapus karakter non-angka
    if (!omzetValue) return;

    // Rumus PPh Final UMKM 0.5%
    const taxAmount = omzetValue * 0.005; 
    // Rumus Estimasi Laba Bersih (Asumsi margin profit bersih 15% - Opsional)
    const estimatedProfit = omzetValue * 0.15; 

    setResult({
      tax: taxAmount,
      profit: estimatedProfit
    });
  };

  const handleInputChange = (e) => {
    // Format input jadi ribuan saat mengetik
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue === "") {
        setOmzet("");
        setResult(null);
    } else {
        setOmzet(parseInt(rawValue).toLocaleString('id-ID'));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-stone-200 shadow-xl shadow-stone-200/50 overflow-hidden font-sans">
      
      <div className="grid md:grid-cols-2">
        
        {/* LEFT: INPUT */}
        <div className="p-8 md:p-12 space-y-8">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                 <Calculator size={14} className="text-[#2a3f9b]" />
                 <span className="text-xs font-bold text-[#2a3f9b] uppercase tracking-wider">Simulasi Gratis</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Hitung Pajak UMKM</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Gunakan alat ini untuk menghitung estimasi PPh Final 0.5% (PP 23 Tahun 2018) yang harus disetor setiap bulan.
              </p>
           </div>

           <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-700">Masukkan Omzet (Pendapatan Bruto) per Bulan</label>
              <div className="relative group">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">Rp</span>
                 <input 
                    type="text" 
                    value={omzet}
                    onChange={handleInputChange}
                    placeholder="Contoh: 50.000.000"
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-xl text-lg font-bold text-stone-900 focus:outline-none focus:border-[#2a3f9b] focus:bg-white transition-all"
                 />
              </div>
              <button 
                onClick={calculateTax}
                className="w-full py-4 bg-[#2a3f9b] hover:bg-[#1e2f75] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Hitung Sekarang
              </button>
           </div>
        </div>

        {/* RIGHT: RESULT */}
        <div className="bg-stone-900 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
           {/* Decorative Bg */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a3f9b] rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>
           
           {result ? (
             <div className="relative z-10 space-y-8 animate-fade-in-up">
                <div>
                   <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Estimasi Pajak (0.5%)</p>
                   <p className="text-4xl md:text-5xl font-bold text-white">{formatRupiah(result.tax)}</p>
                   <p className="text-stone-400 text-sm mt-2">*Wajib disetor maksimal tanggal 15 bulan berikutnya.</p>
                </div>
                
                <div className="pt-8 border-t border-white/10">
                   <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                         <TrendingUp size={24} className="text-green-400" />
                      </div>
                      <div>
                         <p className="text-stone-300 text-sm font-medium mb-1">Butuh Laporan Pajak?</p>
                         <p className="text-xs text-stone-500 leading-relaxed mb-3">
                           Jangan sampai kena denda karena salah lapor. Kami bantu urus SPT Tahunan Anda.
                         </p>
                         <a href={createWhatsAppUrl(whatsappNumber, 'Halo, saya mau konsultasi pajak UMKM')} className="text-sm font-bold text-[#4f6bff] hover:text-white transition-colors flex items-center gap-1">
                            Konsultasi Pajak <RefreshCw size={14}/>
                         </a>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="relative z-10 text-center opacity-50">
                <DollarSign size={48} className="mx-auto mb-4" />
                <p className="text-sm font-medium">Masukkan omzet Anda di sebelah kiri untuk melihat hasil perhitungan.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}