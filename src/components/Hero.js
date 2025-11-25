import Link from 'next/link';
import { ArrowRight, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

// Aksen Warna Utama: #2a3f9b
const BRAND_COLOR = "text-[#2a3f9b]";
const BRAND_BG = "bg-[#2a3f9b]";
const BRAND_BORDER = "border-[#2a3f9b]";

// Logo Klien (Monochrome agar clean)
// Logo Klien dari folder public/images/logos/
const CLIENT_LOGOS = [
  "/images/logos/bannerclient.png",
  "/images/logos/bannerclient2.png",
  "/images/logos/bannerclient3.png",
  "/images/logos/bannerclient4.png",
  "/images/logos/bannerclient5.png",
];

export default function Hero() {
  return (
    <section className="relative pt-32 lg:pt-20 pb-12 bg-white overflow-hidden font-sans">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-[#2a3f9b] opacity-[0.03] blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-[#2a3f9b] opacity-[0.03] blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT: TEXT CONTENT --- */}
          <div className="space-y-8 relative z-10">
            
            {/* Pill Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${BRAND_BG} bg-opacity-10 border border-[#2a3f9b]/20`}>
               <span className={`w-2 h-2 rounded-full ${BRAND_BG}`}></span>
               <span className={`text-xs font-bold text-white uppercase tracking-widest`}>
                 Mitra Legalitas Resmi
               </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.15] tracking-tight">
              Bangun Bisnis.<br />
              <span className={BRAND_COLOR}>Kami Urus Legalitas.</span>
            </h1>

            {/* Subheadline (Humanis: Menggunakan warna Stone agar lembut di mata) */}
            <p className="text-lg text-stone-500 leading-relaxed max-w-lg font-normal">
              Tidak perlu pusing dengan birokrasi. Kami membantu pendirian PT, CV, dan Merek dagang Anda dengan proses yang transparan, cepat, dan sesuai hukum.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* Primary Button dengan warna #2a3f9b */}
              <Link href="https://wa.me/6289518530306" className={`inline-flex items-center justify-center gap-2 px-8 py-4 ${BRAND_BG} text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-xl shadow-[#2a3f9b]/20 hover:shadow-[#2a3f9b]/30 transform hover:-translate-y-1`}>
                Konsultasi Gratis
                <ArrowRight size={18} />
              </Link>
              
              {/* Secondary Button (Clean White) */}
              <Link href="#layanan" className="inline-flex items-center justify-center px-8 py-4 bg-white text-stone-600 border border-stone-200 rounded-full font-medium hover:bg-stone-50 transition-colors">
                Pelajari Layanan
              </Link>
            </div>

            {/* Simple Trust Proof */}
            <div className="flex items-center gap-4 pt-6 text-sm font-medium text-stone-500">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className={BRAND_COLOR} />
                    <span>Terdaftar di OSS</span>
                </div>
                <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className={BRAND_COLOR} />
                    <span>Notaris Terverifikasi</span>
                </div>
            </div>
          </div>

          {/* --- RIGHT: VISUAL IMAGE --- */}
          <div className="relative lg:h-[600px] w-full flex items-center justify-center">
            
            {/* Main Image Frame */}
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[90%] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop" 
                alt="Tim Legal Valpro Intertech" 
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient Halus dari bawah */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a3f9b]/20 to-transparent opacity-60"></div>
            </div>

            {/* Floating Card: Dokumen Sah */}
            {/* Menggunakan aksen border kiri berwarna #2a3f9b */}
            <div className="absolute bottom-12 -left-4 md:-left-10 bg-white p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100 flex items-center gap-4 animate-bounce-slow max-w-[240px] border-l-4 border-l-[#2a3f9b]">
              <div className={`bg-[#2a3f9b]/10 p-3 rounded-full ${BRAND_COLOR}`}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">Dokumen Sah 100%</p>
                <p className="text-xs text-stone-500 mt-0.5">Verifikasi Kemenkumham</p>
              </div>
            </div>

             {/* Dekorasi Garis Melingkar di belakang gambar */}
             <div className={`absolute -z-10 top-1/2 right-0 w-64 h-64 border border-[#2a3f9b]/10 rounded-full translate-x-1/3 -translate-y-1/2`}></div>
             <div className={`absolute -z-10 top-1/2 right-0 w-80 h-80 border border-[#2a3f9b]/5 rounded-full translate-x-1/3 -translate-y-1/2`}></div>
          </div>

        </div>
      </div>

      {/* --- BOTTOM MARQUEE (Clean & Minimalist) --- */}
      <div className="border-t border-stone-100 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-8">
            <p className="text-xs font-bold text-stone-400 whitespace-nowrap uppercase tracking-widest">Dipercaya oleh berbagai perusahaan <br></br> dan brand ternama di Indonesia
</p>
            
            {/* Masking Gradient untuk efek fade di kiri kanan slider */}
            <div className="flex overflow-hidden w-full relative mask-image-gradient">
                 <div className="flex animate-marquee gap-16 items-center">
                {/* Mengulang array logo 2x agar seamless */}
{[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((src, idx) => (
  <div 
    key={idx} 
    className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
  >
<img 
  src={src} 
  alt={`Client Banner ${idx}`} 
  className="h-28 md:h-32 lg:h-36 w-auto object-contain transition-transform duration-300"
  style={{ minWidth: "500px" }} 
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