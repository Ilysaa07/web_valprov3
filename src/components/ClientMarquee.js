import Image from 'next/image';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

// DATA STATIC
const BANNER_IMAGES = [
  "/images/logos/bannerclient.png",
  "/images/logos/bannerclient2.png",
  "/images/logos/bannerclient3.png",
  "/images/logos/bannerclient4.png",
  "/images/logos/bannerclient5.png",
];

const BADGES = [
  { name: "OSS Indonesia", src: "/images/logos/oss.png", desc: "NIB Terverifikasi" },
  { name: "Kemenkumham", src: "/images/logos/kemenkumham.png", desc: "AHU Resmi" },
  { name: "LPJK (PUPR)", src: "/images/logos/pupr.jpg", desc: "SBU Konstruksi" },
  { name: "DJK (ESDM)", src: "/images/logos/esdm.png", desc: "SBUJPTL/SBUJOTS" },
  { name: "Dirjen Pajak", src: "/images/logos/djp.png", desc: "PKP & KSWP Valid" },
];

const MARQUEE_ITEMS = [...BANNER_IMAGES, ...BANNER_IMAGES, ...BANNER_IMAGES];

export default function ClientMarquee() {
  return (
    <section className="relative py-32 bg-white overflow-hidden font-sans">
      
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-scroll-left {
          animation: scrollLeft 50s linear infinite;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 z-10">

        {/* HEADER - Split Layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6 text-blue-600">
              <ShieldCheck size={20} strokeWidth={2.5} />
              <span className="text-sm font-bold uppercase tracking-wider">Legalitas Terjamin</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Terdaftar Resmi
              <br/>
              <span className="text-blue-600">Negara</span>
            </h2>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Setiap dokumen dapat diverifikasi langsung di database kementerian dan instansi pemerintah terkait.
            </p>
          </div>

          {/* Right - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-8 bg-slate-50 rounded-3xl">
              <div className="text-5xl font-black text-blue-600 mb-2">500+</div>
              <div className="text-sm font-semibold text-slate-600">Klien Terpercaya</div>
            </div>
            <div className="text-center p-8 bg-slate-50 rounded-3xl">
              <div className="text-5xl font-black text-blue-600 mb-2">100%</div>
              <div className="text-sm font-semibold text-slate-600">Terverifikasi</div>
            </div>
          </div>
        </div>

        {/* BADGES - Bento Grid Layout */}
        <div className="mb-32">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 auto-rows-fr">
            
            {/* Badge 1 - Large */}
            <div className="col-span-4 md:col-span-3 md:row-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="h-full flex flex-col justify-between">
                <div className="w-20 h-20 relative mb-6">
                  <Image
                    src={BADGES[0].src}
                    alt={BADGES[0].name}
                    width={80}
                    height={80}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{BADGES[0].name}</h4>
                  <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>{BADGES[0].desc}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge 2 - Medium */}
            <div className="col-span-2 md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={BADGES[1].src}
                    alt={BADGES[1].name}
                    width={64}
                    height={64}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{BADGES[1].name}</h4>
                  <div className="text-xs text-slate-500">{BADGES[1].desc}</div>
                </div>
              </div>
            </div>

            {/* Badge 3 - Medium */}
            <div className="col-span-2 md:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={BADGES[2].src}
                    alt={BADGES[2].name}
                    width={64}
                    height={64}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{BADGES[2].name}</h4>
                  <div className="text-xs text-slate-500">{BADGES[2].desc}</div>
                </div>
              </div>
            </div>

            {/* Badge 4 - Medium */}
            <div className="col-span-2 md:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={BADGES[3].src}
                    alt={BADGES[3].name}
                    width={64}
                    height={64}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{BADGES[3].name}</h4>
                  <div className="text-xs text-slate-500">{BADGES[3].desc}</div>
                </div>
              </div>
            </div>

            {/* Badge 5 - Highlight */}
            <div className="col-span-4 md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 shadow-lg">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl p-3 relative">
                  <Image
                    src={BADGES[4].src}
                    alt={BADGES[4].name}
                    width={64}
                    height={64}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{BADGES[4].name}</h4>
                  <div className="text-xs text-blue-100">{BADGES[4].desc}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CLIENT LOGOS - Minimal Scroll */}
        <div className="relative">
          
          {/* Simple Header */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Dipercaya 500+ Perusahaan</h3>
            <p className="text-sm text-slate-500">Dari berbagai sektor industri</p>
          </div>

          {/* Clean Marquee */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <div className="overflow-hidden py-8">
              <div className="flex w-max gap-16 animate-scroll-left">
                {MARQUEE_ITEMS.map((src, idx) => (
                  <div 
                    key={`${src}-${idx}`}
                    className="relative w-[360px] h-[180px] md:w-[480px] md:h-[240px] flex-shrink-0"
                  >
                    <div className="w-full h-full bg-slate-50 rounded-2xl p-8 flex items-center justify-center">
                      <Image
                        src={src}
                        alt="Client Logo"
                        fill
                        className="object-contain p-4 opacity-60"
                        sizes="(max-width: 768px) 360px, 480px"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Badge Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold text-slate-700">
                Dapat diverifikasi di website resmi instansi terkait
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}