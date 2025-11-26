"use client";
import { useState } from 'react';
import { ArrowRight, CheckCircle2, RefreshCcw, HelpCircle, User, Users, Shield, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function BusinessMatcher() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // LOGIKA PERTANYAAN (Decision Tree)
  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Logika Penentuan
    if (questionId === 'founder') {
        if (value === '1') {
            finishQuiz({
                type: 'PT Perorangan',
                desc: 'Solusi tepat untuk pengusaha tunggal (UMK). Tanggung jawab terbatas, harta pribadi aman, dan terlihat profesional.',
                url: '/layanan/pendirian-badan-usaha', // Ganti sesuai slug layanan
                tags: ['1 Pendiri', 'UMK Only', 'Harta Terpisah']
            });
        } else {
            setStep(2); // Lanjut ke pertanyaan 2
        }
    } 
    else if (questionId === 'protection') {
        if (value === 'high') {
             finishQuiz({
                type: 'PT Umum (Perseroan Terbatas)',
                desc: 'Standar emas dunia bisnis. Harta pribadi 100% terpisah dari utang perusahaan. Cocok untuk bisnis yang berisiko tinggi atau ingin cari investor.',
                url: '/layanan/pendirian-badan-usaha',
                tags: ['Min. 2 Pendiri', 'Saham', 'Harta Terpisah']
            });
        } else {
            setStep(3); // Lanjut ke pertanyaan budget
        }
    }
    else if (questionId === 'budget') {
        if (value === 'low') {
             finishQuiz({
                type: 'CV (Persekutuan Komanditer)',
                desc: 'Badan usaha yang lebih hemat biaya dan simpel secara administrasi. Cocok untuk bisnis keluarga atau kemitraan skala kecil-menengah.',
                url: '/layanan/pendirian-badan-usaha',
                tags: ['Min. 2 Pendiri', 'Lebih Murah', 'Tanggung Jawab Sekutu']
            });
        } else {
             finishQuiz({
                type: 'PT Umum (Perseroan Terbatas)',
                desc: 'Meskipun budget lebih tinggi, PT memberikan kredibilitas lebih tinggi di mata bank dan vendor besar dibandingkan CV.',
                url: '/layanan/pendirian-badan-usaha',
                tags: ['Min. 2 Pendiri', 'Bonafide', 'Akses Modal Luas']
            });
        }
    }
  };

  const finishQuiz = (resultData) => {
    setResult(resultData);
    setStep(4); // Step 4 adalah Result Screen
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-stone-200 overflow-hidden relative min-h-[450px] flex flex-col justify-center">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a3f9b]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">
            
            {/* --- STEP 1: JUMLAH PENDIRI --- */}
            {step === 1 && (
                <div className="animate-fade-in-up space-y-8">
                    <div className="text-center">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block">Pertanyaan 1 dari 3</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
                            Berapa orang yang akan menjadi pendiri/pemilik bisnis ini?
                        </h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleAnswer('founder', '1')}
                            className="group p-6 rounded-2xl border-2 border-stone-100 hover:border-[#2a3f9b] hover:bg-blue-50 transition-all text-left flex flex-col gap-4"
                        >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-stone-400 group-hover:text-[#2a3f9b]">
                                <User size={24} />
                            </div>
                            <div>
                                <span className="block font-bold text-lg text-stone-800 group-hover:text-[#2a3f9b]">Hanya Saya (1 Orang)</span>
                                <span className="text-sm text-stone-500">Saya pemilik tunggal (Single Fighter).</span>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleAnswer('founder', 'more')}
                            className="group p-6 rounded-2xl border-2 border-stone-100 hover:border-[#2a3f9b] hover:bg-blue-50 transition-all text-left flex flex-col gap-4"
                        >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-stone-400 group-hover:text-[#2a3f9b]">
                                <Users size={24} />
                            </div>
                            <div>
                                <span className="block font-bold text-lg text-stone-800 group-hover:text-[#2a3f9b]">2 Orang atau Lebih</span>
                                <span className="text-sm text-stone-500">Ada partner/mitra bisnis lain.</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* --- STEP 2: PEMISAHAN HARTA (RISIKO) --- */}
            {step === 2 && (
                <div className="animate-fade-in-up space-y-8">
                    <div className="text-center">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block">Pertanyaan 2 dari 3</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
                            Seberapa penting keamanan harta pribadi Anda dari risiko bisnis?
                        </h3>
                    </div>
                    
                    <div className="grid gap-4">
                        <button 
                            onClick={() => handleAnswer('protection', 'high')}
                            className="group p-5 rounded-2xl border-2 border-stone-100 hover:border-[#2a3f9b] hover:bg-blue-50 transition-all text-left flex items-center gap-6"
                        >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-stone-400 group-hover:text-[#2a3f9b] shrink-0">
                                <Shield size={24} />
                            </div>
                            <div>
                                <span className="block font-bold text-lg text-stone-800 group-hover:text-[#2a3f9b]">Sangat Penting (Harta Harus Pisah)</span>
                                <span className="text-sm text-stone-500">Jika bisnis rugi/bangkrut, aset pribadi (rumah/mobil) tidak boleh disita.</span>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleAnswer('protection', 'medium')}
                            className="group p-5 rounded-2xl border-2 border-stone-100 hover:border-[#2a3f9b] hover:bg-blue-50 transition-all text-left flex items-center gap-6"
                        >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-stone-400 group-hover:text-[#2a3f9b] shrink-0">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <span className="block font-bold text-lg text-stone-800 group-hover:text-[#2a3f9b]">Fleksibel (Campur Tidak Masalah)</span>
                                <span className="text-sm text-stone-500">Saya lebih mementingkan kemudahan, risiko bisnis saya rendah.</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* --- STEP 3: BUDGET (Untuk CV vs PT) --- */}
            {step === 3 && (
                <div className="animate-fade-in-up space-y-8">
                    <div className="text-center">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 block">Pertanyaan Terakhir</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
                            Apa prioritas utama Anda saat ini?
                        </h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleAnswer('budget', 'low')}
                            className="group p-6 rounded-2xl border-2 border-stone-100 hover:border-[#2a3f9b] hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="block font-bold text-xl text-stone-800 group-hover:text-[#2a3f9b] mb-2">Hemat Biaya</span>
                            <span className="text-sm text-stone-500">Saya ingin biaya pendirian semurah mungkin.</span>
                        </button>

                        <button 
                            onClick={() => handleAnswer('budget', 'high')}
                            className="group p-6 rounded-2xl border-2 border-stone-100 hover:border-[#2a3f9b] hover:bg-blue-50 transition-all text-center"
                        >
                            <span className="block font-bold text-xl text-stone-800 group-hover:text-[#2a3f9b] mb-2">Bonafiditas</span>
                            <span className="text-sm text-stone-500">Saya ingin perusahaan terlihat bergengsi & profesional (PT).</span>
                        </button>
                    </div>
                </div>
            )}

            {/* --- STEP 4: RESULT --- */}
            {step === 4 && result && (
                <div className="animate-fade-in-up text-center space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-6">
                            <CheckCircle2 size={16} /> Rekomendasi Kami
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#2a3f9b] mb-4">
                            {result.type}
                        </h2>
                        <p className="text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
                            {result.desc}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {result.tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-500 border border-stone-200">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <Link 
                            href={result.url}
                            className="px-8 py-4 bg-[#2a3f9b] text-white rounded-full font-bold shadow-xl hover:bg-[#1e2f75] transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                        >
                            Lihat Paket & Harga <ArrowRight size={18} />
                        </Link>
                        <button 
                            onClick={resetQuiz}
                            className="px-8 py-4 bg-white text-stone-500 border-2 border-stone-200 rounded-full font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={18} /> Ulangi Quiz
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}