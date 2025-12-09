import { servicesData } from '@/lib/servicesData';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, MessageCircle, Phone,
  Clock, ShieldCheck, FileText, ChevronRight, HelpCircle, Star, Plus
} from 'lucide-react';

// Initialize Firebase for server component with singleton pattern
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize app if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Function to get service pricing from Firestore
async function getServicePricing(slug) {
  try {
    const settingsRef = doc(db, "settings", "service_pricing");
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      const pricingData = settingsDoc.data();
      return pricingData[slug] || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching service pricing:", error);
    return null;
  }
}

// 1. METADATA SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return { title: 'Layanan Tidak Ditemukan' };

  return {
    title: `${service.title} - Layanan Terpercaya - Valpro Intertech`,
    description: service.desc,
    alternates: {
      canonical: `/layanan/${slug}`,
    },
  };
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  const pricing = await getServicePricing(slug);

  if (!service) {
    return notFound();
  }

  const BRAND_HEX = "#2a3f9b";

  // 2. JSON-LD SCHEMA (Structured data for search engines)
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
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd, null, 2)
        }}
      />

      {/* === 1. HERO SECTION (Professional Layout) === */}
      <div style={{paddingTop: '80px'}} className="relative w-full">
         <Image
            src={service.image}
            alt={`Layanan ${service.title}`}
            width={1200}
            height={600}
            className="w-full h-[400px] lg:h-[500px] object-cover brightness-[0.4]"
            priority
         />

         <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent"></div>

         <div className="absolute inset-0 pt-10">
            <div className="max-w-7xl mx-auto px-6 w-full">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Content */}
                  <div className="lg:col-span-2 text-white">
                     {/* Breadcrumb */}
                     <nav className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-stone-200 mb-6">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span>/</span>
                        <Link href="/layanan" className="hover:text-white transition">Layanan</Link>
                        <span>/</span>
                        <span className="text-stone-100">{service.title}</span>
                     </nav>

                     <div className="space-y-6">
                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                          {service.title}
                        </h1>
                        <p className="text-stone-200 text-base leading-relaxed max-w-2xl">
                          {service.desc}
                        </p>

                        <div className="flex flex-wrap gap-3 pt-4">
                           <Link
                             href={`https://wa.me/6289518530306?text=Halo%20Tim%20Valpro,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`}
                             className="group relative overflow-hidden bg-white text-[#2a3f9b] px-6 py-3.5 rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-3"
                           >
                              <MessageCircle size={20} className="text-[#2a3f9b]" />
                              <span>Gratis Konsultasi</span>
                              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                           </Link>

                           <Link
                             href="#fitur"
                             className="px-6 py-3.5 rounded-full text-white font-bold border border-white/30 hover:bg-white/10 transition-all flex items-center gap-3"
                           >
                              <ShieldCheck size={16} className="text-white" />
                              Kenapa Pilih Kami?
                           </Link>
                        </div>
                     </div>
                  </div>

                  {/* Right Sidebar: Service Info Card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 h-fit sticky top-24">
                     <div className="space-y-5">
                        <div className="border-b border-gray-100 pb-5">
                           <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Layanan</h2>
                           <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                 <Clock size={18} className="text-[#2a3f9b]" />
                                 <span className="text-gray-700 text-sm">Durasi: {service.duration}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <FileText size={18} className="text-[#2a3f9b]" />
                                 <span className="text-gray-700 text-sm">Status: {service.status}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <HelpCircle size={18} className="text-[#2a3f9b]" />
                                 <span className="text-gray-700 text-sm">Persyaratan: {service.requirementsCount} Dokumen</span>
                              </div>
                           </div>
                        </div>

                        {pricing && pricing.enabled && (
                           <div className="border-b border-gray-100 pb-5">
                              <h3 className="font-bold text-gray-800 mb-3">Harga Layanan</h3>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-2xl font-bold text-[#2a3f9b]">Rp {pricing.price}</span>
                                 <span className="text-gray-500 text-sm">({pricing.priceNote || service.priceNote})</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">{pricing.priceDescription || service.priceDescription}</p>
                           </div>
                        )}

                        <div className="space-y-3">
                           <h3 className="font-bold text-gray-800 text-sm">Manfaat:</h3>
                           <ul className="space-y-2">
                              {service.benefits?.slice(0, 3)?.map((benefit, idx) => (
                                 <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700 text-sm">{benefit}</span>
                                 </li>
                              ))}
                              {service.benefits && service.benefits.length > 3 && (
                                 <li className="text-[#2a3f9b] text-sm font-medium flex items-center gap-1">
                                    <Plus size={14} className="text-[#2a3f9b]" />
                                    {service.benefits.length - 3} manfaat lainnya
                                 </li>
                              )}
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* === 2. TRUST-BUILDING SECTION === */}
      <div className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-stone-900 mb-4">
                 Kenapa Ribuan Pengusaha <br />
                 <span className="bg-gradient-to-r from-[#2a3f9b] to-blue-600 bg-clip-text text-transparent">Memilih Kami?</span>
               </h2>
               <p className="text-stone-600 leading-relaxed max-w-2xl mx-auto">
                 Pengalaman puluhan tahun, tim ahli bersertifikat, dan sistem terintegrasi memastikan kepuasan dan keamanan legalitas usaha Anda.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
               {service.trustFactors?.map((factor, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                     <div className="w-12 h-12 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] mb-4">
                        <ShieldCheck size={24} className="text-[#2a3f9b]" />
                     </div>
                     <h3 className="font-bold text-gray-800 text-lg mb-2">{factor.title}</h3>
                     <p className="text-gray-600">{factor.desc}</p>
                  </div>
               )) || (
                  <>
                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] mb-4">
                           <Star size={24} className="text-[#2a3f9b]" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Reputasi Terpercaya</h3>
                        <p className="text-gray-600">Penilaian tinggi dari ribuan klien</p>
                     </div>
                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] mb-4">
                           <ShieldCheck size={24} className="text-[#2a3f9b]" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Status Legal Terdaftar</h3>
                        <p className="text-gray-600">Dokumen resmi dan sah</p>
                     </div>
                     <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] mb-4">
                           <Phone size={24} className="text-[#2a3f9b]" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Dukungan 24/7</h3>
                        <p className="text-gray-600">Bimbingan dan bantuan penuh</p>
                     </div>
                  </>
               )}
            </div>

            {/* Visual Proof Section */}
            <div className="mb-12">
               <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Dokumen dan Bukti Layanan</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {service.proofImages?.map((img, idx) => (
                     <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-md">
                        <Image
                           src={img}
                           alt={`Bukti layanan ${service.title}`}
                           width={300}
                           height={300}
                           className="object-cover w-full h-full"
                        />
                     </div>
                  )) || (
                     <>
                        {Array.from({ length: 4 }, (_, idx) => (
                           <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-gray-100">
                              <FileText size={32} className="text-[#2a3f9b]/40" />
                           </div>
                        ))}
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* === 3. FEATURES SECTION === */}
      <div id="fitur" className="py-16 bg-[#FAFAFA]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
               <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a3f9b]/10 border border-[#2a3f9b]/20 mb-4">
                  <ShieldCheck size={16} className="text-[#2a3f9b]" />
                  <span className="text-xs font-bold text-[#2a3f9b] uppercase tracking-wider">RINCIAN LAYANAN</span>
               </span>
               <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">
                 Fitur & <span className="bg-gradient-to-r from-[#2a3f9b] to-blue-600 bg-clip-text text-transparent">Manfaat</span> Layanan Kami
               </h2>
               <p className="text-stone-600 max-w-2xl mx-auto">
                 Paket solusi hukum lengkap mencakup semua tahapan dari persiapan hingga penyerahan.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {service.features?.map((feature, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <div className="w-12 h-12 rounded-lg bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] font-bold mb-4">
                        {idx + 1}
                     </div>
                     <h3 className="text-lg font-bold text-gray-800 mb-2">
                       {typeof feature === 'string' ? feature : feature.title}
                     </h3>
                     <p className="text-gray-600">
                       {typeof feature === 'string' ? feature : feature.desc}
                     </p>
                  </div>
               )) || (
                  <>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] font-bold mb-4">
                           1
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Konsultasi Awal</h3>
                        <p className="text-gray-600">Diskusi mendalam kebutuhan bisnis untuk solusi terbaik.</p>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] font-bold mb-4">
                           2
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Persiapan Dokumen</h3>
                        <p className="text-gray-600">Persiapan dokumen lengkap sesuai dengan persyaratan hukum.</p>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-[#2a3f9b]/10 flex items-center justify-center text-[#2a3f9b] font-bold mb-4">
                           3
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Proses Administrasi</h3>
                        <p className="text-gray-600">Bantuan penuh hingga proses administrasi selesai.</p>
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>

      {/* === 4. CTA SECTION === */}
      <div className="py-16 bg-gradient-to-r from-[#2a3f9b] to-blue-700">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Siap Bawa Bisnis Anda ke Level Berikutnya?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Konsultasikan dengan tim ahli kami. Kami siap memberikan solusi terbaik untuk pertumbuhan bisnis Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link
                 href={`https://wa.me/6289518530306?text=Halo%20Tim%20Valpro,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`}
                 className="bg-white text-[#2a3f9b] px-6 py-3.5 rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
               >
                  <MessageCircle size={18} className="text-[#2a3f9b]" />
                  <span>Konsultasi Gratis</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>

               <Link
                 href="/#tentang"
                 className="px-6 py-3.5 rounded-lg text-white font-bold border border-white/30 hover:bg-white/10 transition-all w-full sm:w-auto"
               >
                  Pelajari Lebih Lanjut
               </Link>
            </div>
         </div>
      </div>
    </main>
  );
}