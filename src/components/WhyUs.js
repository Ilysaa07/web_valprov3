"use client";
import Image from 'next/image';
import { HeartHandshake, Clock, Award, CheckCircle2, Users, Target, Compass } from 'lucide-react';

export default function WhyUs() {
  const BRAND_HEX = "#2a3f9b";

  const features = [
    {
      icon: <HeartHandshake size={28} />,
      title: "Pendekatan Personal",
      desc: "Tanpa bahasa hukum yang kaku. Kami mendampingi Anda layaknya mitra bisnis, santai namun tetap profesional dan solutif."
    },
    {
      icon: <Clock size={28} />,
      title: "Transparan & Terjadwal",
      desc: "Update status real-time. Anda akan tahu persis sampai mana proses dokumen Anda berjalan tanpa perlu mengejar-ngejar kami."
    },
    {
      icon: <Award size={28} />,
      title: "Rekam Jejak Terbukti",
      desc: "Didukung tim ahli yang telah menangani ratusan perizinan, dari UMKM lokal hingga perusahaan multinasional."
    }
  ];

  const missionPoints = [
    "Memberikan pendampingan hukum yang ramah dan cepat tanggap.",
    "Menyediakan layanan legalitas yang 100% transparan dan sah.",
    "Membantu UMKM hingga korporasi membangun fondasi kepercayaan.",
    "Menjadi jembatan efisiensi antara regulasi negara dan praktik bisnis."
  ];

  return (
    <section id="tentang" className="py-24 bg-stone-50 font-sans relative overflow-hidden">
      
      {/* Background Ornament (Subtle) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[100px] opacity-60 -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- PART 1: WHY CHOOSE US --- */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          
          {/* IMAGE SIDE */}
          <div className="order-2 lg:order-1 relative">
             {/* Main Image Container */}
             <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200 border-8 border-white aspect-[4/5]">
                <Image 
                  src="https://images.unsplash.com/photo-1573497019-9e6a575881d3?q=80&w=1469&auto=format&fit=crop" 
                  alt="Konsultan Valpro Ramah" 
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-1000"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
             </div>

             {/* Floating Badge 1: Social Proof */}
             <div className="absolute top-12 -left-6 md:-left-12 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4 animate-bounce-slow max-w-[240px]">
                <div className="bg-orange-50 p-3 rounded-full text-orange-600">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Kepercayaan</p>
                  <p className="text-lg font-bold text-stone-900">500+ Klien Puas</p>
                </div>
             </div>

             {/* Floating Badge 2: Service Quality */}
             <div className="absolute bottom-12 -right-6 md:-right-12 bg-white p-5 rounded-2xl shadow-xl border-l-4 border-stone-100 flex items-start gap-4 max-w-[260px]" style={{ borderLeftColor: BRAND_HEX }}>
                <div className="p-1.5 bg-green-100 rounded-full text-green-600 mt-1">
                   <CheckCircle2 size={18} />
                </div>
                <div>
                   <p className="text-sm font-bold text-stone-900 mb-1">Responsif & Cepat</p>
                   <p className="text-xs text-stone-500 leading-relaxed">
                     Tim support siap menjawab kendala Anda kapan saja.
                   </p>
                </div>
             </div>
          </div>

          {/* TEXT SIDE */}
          <div className="order-1 lg:order-2 space-y-10">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm">
                  <span className={`w-2 h-2 rounded-full bg-[#2a3f9b]`}></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Nilai Lebih Kami</span>
               </div>
               
               <h2 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
                  Lebih Dari Sekadar Jasa, <br/>
                  <span style={{ color: BRAND_HEX }}>Kami Adalah Partner.</span>
               </h2>
               
               <p className="text-stone-500 text-lg leading-relaxed">
                  Di Valpro, kami tidak hanya mengurus dokumen. Kami memastikan bisnis Anda memiliki fondasi hukum yang kuat untuk bertumbuh besar tanpa rasa was-was.
               </p>
            </div>

            <div className="space-y-6">
              {features.map((item, idx) => (
                 <div key={idx} className="flex gap-6 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-stone-100 group">
                   <div 
                      className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 group-hover:bg-[#2a3f9b] group-hover:text-white transition-colors duration-300"
                      style={{ color: BRAND_HEX }}
                   >
                      {item.icon}
                   </div>
                   <div>
                      <h4 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-[#2a3f9b] transition-colors">
                          {item.title}
                      </h4>
                      <p className="text-stone-500 text-sm leading-relaxed">
                          {item.desc}
                      </p>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- PART 2: VISI & MISI (Bento Grid Layout) --- */}
        <div className="border-t border-stone-200 pt-20">
           <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              
              {/* VISI CARD (High Impact) */}
              <div className="bg-[#2a3f9b] rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                 {/* Decorative Gradients */}
                 <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:opacity-10 transition-opacity duration-700"></div>
                 <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
                 
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                          <Target size={32} className="text-blue-50" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Tujuan Utama</p>
                          <h3 className="text-3xl font-bold tracking-wide">Visi Kami</h3>
                       </div>
                    </div>
                    
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-blue-50">
                      "Menjadi mitra layanan legalitas #1 di Indonesia yang mendorong pertumbuhan ekonomi melalui kepatuhan hukum yang mudah dan terjangkau."
                    </p>
                 </div>
              </div>

              {/* MISI CARD (Clean List) */}
              <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-stone-100 shadow-xl shadow-stone-200/40 flex flex-col justify-center">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100">
                       <Compass size={32} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Langkah Nyata</p>
                       <h3 className="text-3xl font-bold text-stone-900">Misi Kami</h3>
                    </div>
                 </div>

                 <ul className="space-y-6">
                    {missionPoints.map((point, idx) => (
                       <li key={idx} className="flex items-start gap-5 group">
                          <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:bg-[#2a3f9b] group-hover:border-[#2a3f9b] group-hover:text-white transition-all duration-300">
                             <span className="text-xs font-bold font-mono">0{idx + 1}</span>
                          </div>
                          <p className="text-stone-600 font-medium group-hover:text-stone-900 transition-colors text-lg leading-snug">
                            {point}
                          </p>
                       </li>
                    ))}
                 </ul>
              </div>

           </div>
        </div>

      </div>
    </section>
  );
}