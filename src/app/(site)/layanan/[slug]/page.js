import { servicesData } from '@/lib/servicesData';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle2, MessageCircle, Phone, 
  Clock, ShieldCheck, FileText, ChevronRight, HelpCircle, Star
} from 'lucide-react';

// 1. METADATA SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return { title: 'Layanan Tidak Ditemukan' };
  
  return {
    title: `${service.title} Terpercaya - Valpro Intertech`,
    description: service.desc,
    alternates: {
      canonical: `/layanan/${slug}`,
    },
  };
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) return notFound();

  const BRAND_HEX = "#2a3f9b";

  // 2. JSON-LD SCHEMA (Agar muncul cantik di Google Search)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    provider: {
      '@type': 'Organization',
      name: 'Valpro Intertech',
      url: 'https://valprointertech.com'
    },
    areaServed: 'Indonesia',
    category: service.category,
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION (Immersive & Trustworthy) === */}
      <div className="relative w-full h-[500px] lg:h-[600px]">
         <Image 
            src={service.image} 
            alt={`Layanan ${service.title}`}
            fill
            className="object-cover brightness-[0.35]" // Gelapkan agar teks putih terbaca jelas
            priority
            sizes="100vw"
         />
         
         <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent"></div>

         <div className="absolute inset-0 flex items-center pb-20">
            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
               
               {/* Left: Text */}
               <div className="text-white space-y-6">
                  {/* Breadcrumb Glass */}
                  <nav className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-stone-200 mb-4">
                     <Link href="/" className="hover:text-white transition">Home</Link>
                     <ChevronRight size={12} />
                     <Link href="/#layanan" className="hover:text-white transition">Layanan</Link>
                     <ChevronRight size={12} />
                     <span className="text-white">{service.category}</span>
                  </nav>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                    {service.title}
                  </h1>
                  
                  <p className="text-lg text-stone-200 font-light leading-relaxed max-w-xl drop-shadow-md">
                    {service.desc}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                     <div className="flex items-center gap-2 text-sm font-medium bg-green-500/20 backdrop-blur-md border border-green-500/30 px-3 py-1.5 rounded-lg text-green-100">
                        <CheckCircle2 size={16} className="text-green-400" /> Resmi & Legal
                     </div>
                     <div className="flex items-center gap-2 text-sm font-medium bg-blue-500/20 backdrop-blur-md border border-blue-500/30 px-3 py-1.5 rounded-lg text-blue-100">
                        <Clock size={16} className="text-blue-400" /> Proses Cepat
                     </div>
                  </div>
               </div>

               {/* Right: Empty for visual balance on desktop */}
               <div className="hidden lg:block"></div>
            </div>
         </div>
      </div>

      {/* === 2. MAIN CONTENT (Floating Card Style) === */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* --- LEFT COLUMN (Content) --- */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* CARD 1: WHAT YOU GET (Main Value) */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-stone-200/50 border border-stone-100">
               <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
                  <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b]">
                      <FileText size={20} />
                    </span>
                    Paket Dokumen Lengkap
                  </h2>
                  <div className={`hidden md:flex px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${service.bgColor} ${service.color}`}>
                    {service.category}
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="group flex items-start gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-[#2a3f9b]/30 hover:bg-blue-50/30 transition-all duration-300">
                      <div className="mt-0.5 p-1 rounded-full bg-green-100 text-green-600 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                      <span className="font-medium text-stone-700 text-sm leading-relaxed">{feat}</span>
                    </div>
                  ))}
               </div>
            </section>

            {/* CARD 2: TIMELINE (Visual Process) */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-stone-200">
               <h2 className="text-2xl font-bold text-stone-900 mb-10">Bagaimana Prosesnya?</h2>
               
               <div className="relative border-l-2 border-stone-200 ml-4 space-y-10 pb-2">
                  {[
                    { title: "Konsultasi & Deal", desc: "Diskusi kebutuhan via WhatsApp, cek nama PT, dan kesepakatan harga." },
                    { title: "Pemberkasan", desc: "Kirim foto KTP/NPWP. Tim kami menyusun draft akta untuk direview." },
                    { title: "Tanda Tangan & Proses", desc: "Tanda tangan minuta akta. Proses Notaris & Kemenkumham berjalan." },
                    { title: "Dokumen Terbit", desc: "SK Kemenkumham, NIB, dan NPWP terbit. Softcopy dikirim, hardcopy menyusul." }
                  ].map((step, i) => (
                     <div key={i} className="relative pl-10 group">
                        <span className="absolute -left-[13px] top-0 w-7 h-7 rounded-full bg-stone-100 border-4 border-white text-[#2a3f9b] flex items-center justify-center text-xs font-bold shadow-sm group-hover:bg-[#2a3f9b] group-hover:text-white transition-colors">
                          {i + 1}
                        </span>
                        <h4 className="font-bold text-stone-900 group-hover:text-[#2a3f9b] transition-colors">{step.title}</h4>
                        <p className="text-sm text-stone-500 mt-1 leading-relaxed">{step.desc}</p>
                     </div>
                  ))}
               </div>
            </section>

            {/* CARD 3: FAQ (Objection Handling) */}
            <section className="space-y-6">
               <h2 className="text-xl font-bold text-stone-900 px-2">Pertanyaan Umum</h2>
               <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100 space-y-6">
                  <div className="flex gap-4">
                     <HelpCircle className="text-stone-400 flex-shrink-0" />
                     <div>
                        <h4 className="font-bold text-stone-800 text-sm">Apakah perlu datang ke kantor?</h4>
                        <p className="text-sm text-stone-500 mt-2 leading-relaxed">Tidak wajib. 90% proses bisa dilakukan secara online/digital. Dokumen fisik bisa dikirim via kurir.</p>
                     </div>
                  </div>
                  <div className="w-full h-px bg-stone-200"></div>
                  <div className="flex gap-4">
                     <HelpCircle className="text-stone-400 flex-shrink-0" />
                     <div>
                        <h4 className="font-bold text-stone-800 text-sm">Berapa lama masa berlakunya?</h4>
                        <p className="text-sm text-stone-500 mt-2 leading-relaxed">Untuk PT/CV berlaku selamanya selama perusahaan aktif lapor pajak. Sertifikasi lain menyesuaikan regulasi.</p>
                     </div>
                  </div>
               </div>
            </section>

          </div>

          {/* --- RIGHT COLUMN (Sticky Sidebar) --- */}
          <div className="lg:col-span-4 relative">
             <div className="sticky top-32 space-y-6">
                
                {/* 1. CTA CARD UTAMA */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-blue-900/10 border border-stone-100 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-[#2a3f9b]"></div>
                   
                   {/* Profile Header */}
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full border-2 border-stone-100 overflow-hidden relative">
                         <Image src="https://i.pravatar.cc/150?u=admin" alt="Support" width={56} height={56} />
                         <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                      </div>
                      <div>
                         <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Konsultan Anda</p>
                         <p className="font-bold text-stone-900 text-lg">Tim Valpro</p>
                      </div>
                   </div>

                   <p className="text-stone-600 text-sm mb-6 leading-relaxed bg-stone-50 p-4 rounded-2xl rounded-tl-none">
                     "Halo! Tertarik dengan <b>{service.title}</b>? Yuk diskusi dulu (Gratis), saya bantu hitungkan biayanya."
                   </p>

                   <div className="space-y-3">
                      <Link 
                        href={`https://wa.me/6289518530306?text=Halo Tim Valpro, saya ingin konsultasi tentang ${service.title}`}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#2a3f9b] hover:bg-[#1e2f75] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-1"
                      >
                        <MessageCircle size={18} /> Konsultasi WA
                      </Link>
                      
                      <Link 
                        href="tel:+6289518530306"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-stone-100 hover:border-stone-300 text-stone-600 rounded-xl font-bold transition-colors"
                      >
                        <Phone size={18} /> Telepon
                      </Link>
                   </div>

                   <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-stone-400 font-medium">
                      <Clock size={12} /> Respon cepat di jam kerja (09-17)
                   </div>
                </div>

                {/* 2. TRUST BADGE SIDEBAR */}
                <div className="bg-[#2a3f9b] rounded-[2.5rem] p-8 text-white text-center relative overflow-hidden shadow-lg">
                   {/* Decorative */}
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                   <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
                   
                   <div className="relative z-10">
                      <ShieldCheck className="mx-auto mb-4 text-blue-200" size={36} />
                      <h4 className="font-bold text-lg mb-1">Garansi 100%</h4>
                      <p className="text-blue-100 text-xs leading-relaxed opacity-90">
                        Kami menjamin keaslian dokumen. Jika tidak terbit, uang kembali utuh.
                      </p>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </main>
  );
}