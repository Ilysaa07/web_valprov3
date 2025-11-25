import { servicesData } from '@/lib/servicesData';
import Link from 'next/link';
import Image from 'next/image'; // Import Image Component
import { 
  ArrowLeft, CheckCircle2, MessageCircle, Phone, 
  Clock, ShieldCheck, FileText, ChevronRight, HelpCircle, User, Star
} from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return { title: 'Layanan Tidak Ditemukan' };
  
  return {
    title: `${service.title} - Valpro Intertech`,
    description: service.desc,
  };
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) return notFound();
  const BRAND_HEX = "#2a3f9b";

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* 1. HERO BANNER IMAGE (Visual Impact) */}
      <div className="relative w-full h-[400px] lg:h-[500px]">
         {/* Gambar Background */}
         <Image 
            src={service.image} 
            alt={service.title}
            fill
            className="object-cover"
            priority
         />
         {/* Overlay Gelap agar teks terbaca */}
         <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>

         {/* Content di atas Banner */}
         <div className="absolute inset-0 flex items-center">
            <div className="max-w-6xl mx-auto px-6 w-full pt-20">
               
               {/* Breadcrumb Putih */}
               <nav className="flex items-center gap-2 text-xs md:text-sm text-stone-300 mb-6">
                  <Link href="/" className="hover:text-white transition">Home</Link>
                  <ChevronRight size={14} />
                  <span className="text-white font-semibold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/10">
                    {service.category}
                  </span>
               </nav>

               <div className="max-w-3xl">
                 <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                   {service.title}
                 </h1>
                 <p className="text-lg text-stone-200 font-light leading-relaxed max-w-xl">
                   {service.desc}
                 </p>
               </div>
            </div>
         </div>
      </div>

      {/* 2. MAIN CONTENT CONTAINER (Floating Up) */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10 grid lg:grid-cols-12 gap-10 mb-24">
        
        {/* === LEFT COLUMN (8 cols) === */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* OVERVIEW CARD */}
          <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-stone-100 shadow-xl shadow-stone-200/50">
             <div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-100">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.bgColor} ${service.color}`}>
                   <div className="w-8 h-8">{service.icon}</div>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-stone-900">Ringkasan Layanan</h3>
                   <p className="text-stone-500 text-sm">Paket lengkap & terpercaya</p>
                </div>
             </div>

             <h4 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
               <FileText size={18} className="text-[#2a3f9b]"/> Dokumen yang Didapat:
             </h4>
             
             <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 hover:bg-[#2a3f9b]/5 border border-stone-100 transition-colors">
                    <CheckCircle2 size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-stone-700 text-sm">{feat}</span>
                  </div>
                ))}
             </div>
          </section>

          {/* TIMELINE PROCESS */}
          <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-stone-100">
             <h3 className="text-xl font-bold text-stone-900 mb-8">Alur Pengerjaan</h3>
             <div className="relative border-l-2 border-dashed border-stone-200 ml-4 space-y-12">
                {[
                  { title: "Konsultasi Gratis", desc: "Diskusi kebutuhan & cek persyaratan via WhatsApp." },
                  { title: "Pemberkasan", desc: "Pengumpulan data & validasi draft dokumen." },
                  { title: "Proses Instansi", desc: "Pendaftaran ke sistem Kemenkumham/OSS/Dinas." },
                  { title: "Serah Terima", desc: "Dokumen fisik & digital dikirim ke alamat Anda." }
                ].map((step, i) => (
                   <div key={i} className="relative pl-10">
                      <div className="absolute -left-[11px] top-0 w-6 h-6 rounded-full bg-white border-4 border-[#2a3f9b]"></div>
                      <h4 className="font-bold text-stone-900">{step.title}</h4>
                      <p className="text-sm text-stone-500 mt-1">{step.desc}</p>
                   </div>
                ))}
             </div>
          </section>

        </div>

        {/* === RIGHT COLUMN (Sidebar) === */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* CTA CARD - STICKY */}
           <div className="bg-white rounded-[2rem] p-6 border border-stone-200 shadow-xl shadow-blue-900/5 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden border-2 border-white shadow-sm">
                     <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" width={100} height={100} alt="CS" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-stone-400 uppercase">Hubungi Kami</p>
                    <p className="text-sm font-bold text-stone-900">Tim Ahli Valpro</p>
                 </div>
              </div>

              <p className="text-stone-600 text-sm mb-6 italic bg-stone-50 p-3 rounded-xl">
                "Kami siap membantu legalitas {service.title} Anda. Respon cepat di jam kerja."
              </p>

              <div className="space-y-3">
                 <Link 
                   href={`https://wa.me/6289518530306?text=Halo Valpro, saya tertarik dengan ${service.title}`}
                   className="flex items-center justify-center gap-2 w-full py-4 bg-[#2a3f9b] text-white rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
                 >
                   <MessageCircle size={18} /> Chat WhatsApp
                 </Link>
                 <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mt-2">
                    <Clock size={12} /> Rata-rata balasan: 5 Menit
                 </div>
              </div>
           </div>

           {/* TRUST BADGE SIDEBAR */}
           <div className="bg-[#2a3f9b] rounded-[2rem] p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <ShieldCheck className="mx-auto mb-3" size={32} />
              <p className="font-bold text-lg mb-1">100% Aman</p>
              <p className="text-blue-100 text-xs">Pembayaran aman & data perusahaan terjamin kerahasiaannya.</p>
           </div>

        </div>

      </div>
    </main>
  );
}