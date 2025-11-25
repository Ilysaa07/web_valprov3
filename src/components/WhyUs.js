"use client";
import { HeartHandshake, Clock, Award, CheckCircle2, Users, Target, Compass } from 'lucide-react';

export default function WhyUs() {
  const BRAND_HEX = "#2a3f9b";

  const features = [
    {
      icon: <HeartHandshake size={28} />,
      title: "Pendekatan Personal & Hangat",
      desc: "Kami tidak menggunakan bahasa hukum yang rumit. Anda akan didampingi layaknya berdiskusi dengan mitra sendiri, santai namun profesional."
    },
    {
      icon: <Clock size={28} />,
      title: "Proses Transparan & Terjadwal",
      desc: "Tidak ada 'biaya siluman' atau penundaan tanpa kabar. Anda akan mendapatkan update status pengerjaan secara berkala."
    },
    {
      icon: <Award size={28} />,
      title: "Rekam Jejak Terbukti",
      desc: "Didukung oleh tim ahli yang telah menangani ratusan kasus legalitas, dari UMKM hingga perusahaan multinasional."
    }
  ];

  const missionPoints = [
    "Memberikan pendampingan yang ramah, cepat tanggap, dan solutif.",
    "Menyediakan layanan legalitas usaha yang profesional dan transparan.",
    "Membantu UMKM hingga perusahaan besar membangun kepercayaan.",
    "Menjadi jembatan antara regulasi dan praktik bisnis yang efisien."
  ];

  return (
    <section id="tentang" className="py-24 bg-stone-50 font-sans relative overflow-hidden">
      
      {/* Background Ornament */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- PART 1: WHY CHOOSE US (Split Layout) --- */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* IMAGE SIDE */}
          <div className="order-2 lg:order-1 relative">
             <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200 border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1573497019-9e6a575881d3?q=80&w=1469&auto=format&fit=crop" 
                  alt="Konsultan Valpro Ramah" 
                  className="w-full h-[500px] object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent"></div>
             </div>

             {/* Floating Badge 1 */}
             <div className="absolute top-10 -left-6 md:-left-10 bg-white p-4 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-4 animate-bounce-slow max-w-[220px]">
                <div className="bg-orange-50 p-3 rounded-full text-orange-600">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Klien Puas</p>
                  <p className="text-xl font-bold text-stone-900">500+ Bisnis</p>
                </div>
             </div>

             {/* Floating Badge 2 */}
             <div className="absolute bottom-10 -right-6 md:-right-10 bg-white p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-l-4 border-stone-100 flex items-start gap-4" style={{ borderLeftColor: BRAND_HEX }}>
                <div className="p-1 bg-green-100 rounded-full text-green-600 mt-1">
                   <CheckCircle2 size={20} />
                </div>
                <div>
                   <p className="text-sm font-bold text-stone-900 mb-1">Respon Cepat</p>
                   <p className="text-xs text-stone-500 max-w-[150px] leading-relaxed">
                     Tim kami selalu siap menjawab pertanyaan Anda.
                   </p>
                </div>
             </div>
          </div>

          {/* TEXT SIDE */}
          <div className="order-1 lg:order-2 space-y-10">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Kenapa Memilih Kami?</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight">
                  Lebih Dari Sekadar Jasa, <br/>
                  <span style={{ color: BRAND_HEX }}>Kami Adalah Partner.</span>
               </h2>
               <p className="text-stone-500 text-lg leading-relaxed">
                  Mengurus legalitas seringkali membingungkan. Di Valpro Intertech, kami mengubah proses tersebut menjadi pengalaman yang <span className="font-semibold text-stone-700">tenang, mudah, dan manusiawi</span>.
               </p>
            </div>

            <div className="space-y-8">
              {features.map((item, idx) => (
                 <div key={idx} className="flex gap-5 group">
                   <div 
                      className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: BRAND_HEX }}
                   >
                      {item.icon}
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-[#2a3f9b] transition-colors">
                          {item.title}
                      </h4>
                      <p className="text-stone-500 text-sm leading-relaxed border-l-2 border-stone-200 pl-4 group-hover:border-[#2a3f9b] transition-colors">
                          {item.desc}
                      </p>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- PART 2: VISI & MISI (Cards Layout) --- */}
        <div className="border-t border-stone-200 pt-16">
           <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* VISI CARD (Tampilan Elegan & Bold) */}
              <div className="bg-[#2a3f9b] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
                 {/* Hiasan background */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-10 transition-opacity"></div>
                 <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                 
                 <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                          <Target size={28} className="text-blue-100" />
                       </div>
                       <h3 className="text-2xl font-bold tracking-wide">Visi Kami</h3>
                    </div>
                    
                    <div className="flex-grow flex items-center">
                       <p className="text-xl md:text-2xl font-medium leading-relaxed text-blue-50">
                         "Menjadi mitra utama layanan legalitas dan perizinan usaha terpercaya di Indonesia yang mendorong pertumbuhan bisnis melalui fondasi hukum yang kuat."
                       </p>
                    </div>
                 </div>
              </div>

              {/* MISI CARD (Tampilan Clean & List) */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-200 shadow-xl shadow-stone-200/50">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                       <Compass size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900">Misi Kami</h3>
                 </div>

                 <ul className="space-y-5">
                    {missionPoints.map((point, idx) => (
                       <li key={idx} className="flex items-start gap-4 group">
                          <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-[#2a3f9b] group-hover:text-white transition-colors duration-300">
                             <span className="text-xs font-bold">{idx + 1}</span>
                          </div>
                          <p className="text-stone-600 font-medium group-hover:text-stone-900 transition-colors">
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