"use client";
import Link from 'next/link';
import Image from 'next/image'; 
import { ArrowRight, ShieldCheck, CheckCircle2, Star } from 'lucide-react';

// --- KONFIGURASI DATA (UBAH DISINI) ---
const BRAND_BG = "bg-[#2a3f9b]";

const BANNER_IMAGES = [
  "/images/logos/bannerclient.png",
  "/images/logos/bannerclient2.png",
  "/images/logos/bannerclient3.png",
  "/images/logos/bannerclient4.png",
  "/images/logos/bannerclient5.png",
];

const SOCIAL_PROOF = [
  { id: 1, src: "https://i.pravatar.cc/100?img=11" },
  { id: 2, src: "https://i.pravatar.cc/100?img=12" },
  { id: 3, src: "https://i.pravatar.cc/100?img=13" },
];

const TESTIMONI = {
  text: "Sangat membantu untuk legalitas perusahaan kami. Timnya responsif dan profesional.",
  name: "Budi Santoso",
  role: "CEO, Tech Startup",
  avatar: "https://i.pravatar.cc/100?img=33"
};

const CHECKLIST = [
  "Resmi Terdaftar Kemenkumham",
  "Proses 100% Online & Transparan",
  "Jaminan Dokumen Asli"
];
// ---------------------------------------

export default function Hero({ city = null }) {
  
  // Logika Judul Dinamis (SEO Lokal)
  const headlineContent = city ? (
    <>
      Jasa Pendirian PT <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
        Terpercaya di {city}.
      </span>
    </>
  ) : (
    <>
      Mitra Strategis <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a3f9b] to-blue-600">
        Legalitas & Perizinan Usaha.
      </span>
    </>
  );

  const subheadlineContent = city 
    ? `Biro jasa resmi untuk pendirian PT, CV, dan NIB khusus wilayah **${city}** dan sekitarnya. Proses cepat, tanpa perlu datang ke kantor kami.`
    : "Layanan pendirian PT, CV, dan sertifikasi usaha yang transparan, cepat, dan sesuai regulasi. Fokus kembangkan bisnis Anda, biarkan kami menangani aspek hukumnya.";

  return (
    <section className="relative pt-32 lg:pt-40 pb-12 bg-[#fafafa] overflow-hidden font-sans">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50/60 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 mb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* --- KIRI: KONTEN UTAMA --- */}
          <div className="space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                 {city ? `Melayani Area ${city}` : "Mitra Legalitas Terpercaya"}
               </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.15] tracking-tight">
              {headlineContent}
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-stone-500 leading-relaxed max-w-lg font-normal">
              {subheadlineContent}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`https://wa.me/6289518530306?text=Halo Valpro, saya butuh bantuan legalitas${city ? ` di ${city}` : ''}.`}
                  className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 ${BRAND_BG} text-white rounded-full font-bold hover:bg-blue-800 transition-all duration-300 shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 hover:-translate-y-1 overflow-hidden`}
                >
                  Konsultasi Gratis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#layanan" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-stone-600 border border-stone-200 rounded-full font-bold hover:bg-stone-50 transition-all"
                >
                  Lihat Paket
                </Link>
              </div>

              {/* Social Proof (Dynamic Data) */}
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {SOCIAL_PROOF.map((avatar) => (
                      <div key={avatar.id} className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-stone-200">
                        <Image src={avatar.src} alt="Klien" width={40} height={40} className="object-cover"/>
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">
                      +500
                    </div>
                 </div>
                 <div className="text-sm">
                    <div className="flex text-amber-400 mb-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                    </div>
                    <p className="text-stone-500 font-medium text-xs">Klien puas & terbantu</p>
                 </div>
              </div>
            </div>

            {/* Checklist (Dynamic Data) */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-stone-500 pt-2 border-t border-stone-100">
                {CHECKLIST.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span>{item}</span>
                   </div>
                ))}
            </div>
          </div>

          {/* --- KANAN: VISUAL --- */}
          <div className="relative w-full flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200 border-8 border-white">
              <Image 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop" 
                alt="Tim Legal Valpro Intertech" 
                fill 
                priority={true} 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a3f9b]/40 to-transparent mix-blend-multiply opacity-60"></div>
            </div>

            {/* Floating Card: Status */}
            <div className="absolute top-10 -left-6 md:-left-12 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4 animate-bounce-slow max-w-[200px]">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-bold uppercase">Status</p>
                <p className="text-sm font-bold text-stone-900">100% Legal</p>
              </div>
            </div>

            {/* Floating Card: Testimoni (Dynamic Data) */}
            <div className="absolute bottom-12 -right-6 md:-right-8 bg-white p-5 rounded-2xl shadow-xl border border-stone-100 max-w-[260px]">
               <div className="flex items-center gap-2 mb-2">
                 <div className="flex text-amber-400">
                   {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                 </div>
                 <span className="text-xs font-bold text-stone-400">Ulasan Google</span>
               </div>
               <p className="text-xs text-stone-600 italic leading-relaxed">"{TESTIMONI.text}"</p>
               <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                  <div className="relative w-6 h-6 rounded-full bg-stone-200 overflow-hidden">
                    <Image src={TESTIMONI.avatar} alt="User" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800">{TESTIMONI.name}</p>
                    <p className="text-[10px] text-stone-400">{TESTIMONI.role}</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- MARQUEE CLIENTS --- */}
      <div className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/4 text-center lg:text-left flex-shrink-0">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Dipercaya Oleh</p>
              <p className="text-lg font-bold text-stone-800 leading-tight">Berbagai Perusahaan Ternama</p>
            </div>
            <div className="lg:w-3/4 w-full overflow-hidden relative mask-image-gradient">
                <div className="flex animate-marquee items-center gap-16">
                    {[...BANNER_IMAGES, ...BANNER_IMAGES].map((src, idx) => (
                      <div key={idx} className="relative flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0 cursor-pointer">
                        <Image 
                          src={src} 
                          alt={`Partner Banner ${idx}`}
                          width={0} height={0} sizes="100vw"
                          className="h-16 md:h-20 w-auto max-w-none object-contain"
                        />
                      </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

    </section>
  );
}