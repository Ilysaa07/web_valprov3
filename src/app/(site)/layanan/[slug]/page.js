import { servicesData } from '@/lib/servicesData';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MessageCircle, Clock, ShieldCheck, FileText, ChevronRight,
  CheckCircle2, Building2, Users, ArrowRight, Phone, HelpCircle
} from 'lucide-react';
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

// --- FIREBASE SETUP (LOGIKA TETAP) ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

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

// --- METADATA SEO ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return { title: 'Layanan Tidak Ditemukan' };

  return {
    title: `${service.title} - Jasa ${service.category} Profesional | Valpro`,
    description: service.desc,
    keywords: [
      service.title,
      service.category,
      'jasa legalitas',
      'biro jasa',
      'perizinan',
      'pendirian perusahaan',
      'solusi bisnis',
      'pembuatan izin',
      ...(Array.isArray(service.features) ? service.features.map(f => typeof f === 'string' ? f : f.title || f.description || '') : [])
    ],
    alternates: { canonical: `/layanan/${slug}` },
    openGraph: {
      title: `${service.title} - Jasa ${service.category} Profesional`,
      description: service.desc,
      url: `https://valprointertech.com/layanan/${slug}`,
      siteName: 'Valpro Intertech',
      type: 'article',
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      images: [
        {
          url: service.image || '/gedung.png',
          width: 1200,
          height: 630,
          alt: `${service.title} - Jasa ${service.category} Profesional`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} - Jasa ${service.category} Profesional`,
      description: service.desc,
      images: service.image ? [service.image] : ['/gedung.png'],
    },
  };
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  const pricing = await getServicePricing(slug);
  const whatsappSettings = await getWhatsappSettings();

  if (!service) {
    return notFound();
  }

  // Schema Markup
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    provider: {
      '@type': 'Organization',
      name: 'Valpro Intertech',
      url: 'https://valprointertech.com',
      logo: 'https://valprointertech.com/logometa.svg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Raya Gading Tutuka No.175 B, Soreang',
        addressLocality: 'Bandung',
        addressCountry: 'ID'
      }
    },
    areaServed: 'Indonesia',
    category: service.category,
    offers: pricing && pricing.enabled ? {
      '@type': 'Offer',
      price: pricing.price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock'
    } : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://valprointertech.com/layanan/${slug}`
    },
    image: service.image,
    // Add service specific properties
    ...service.duration && { processingTime: service.duration },
    ...service.status && {
      award: {
        '@type': 'Award',
        name: service.status
      }
    }
  };

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://valprointertech.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Layanan',
        item: 'https://valprointertech.com/layanan'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://valprointertech.com/layanan/${slug}`
      }
    ]
  };

  // FAQ Schema for better SEO
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Apa itu layanan ${service.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: service.desc
        }
      },
      {
        '@type': 'Question',
        name: `Berapa biaya untuk layanan ${service.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pricing && pricing.enabled
            ? `Biaya layanan ${service.title} adalah Rp ${pricing.price}. ${pricing.priceDescription || ''} ${pricing.priceNote || ''}`
            : `Harga untuk layanan ${service.title} bersifat custom sesuai kebutuhan spesifik Anda.`
        }
      },
      {
        '@type': 'Question',
        name: `Berapa lama proses pengerjaan ${service.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${service.duration}. Proses akan segera dimulai setelah persyaratan lengkap dan pembayaran konfirmasi.`
        }
      },
      {
        '@type': 'Question',
        name: `Apa saja persyaratan untuk layanan ${service.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Persyaratan lengkap untuk layanan ${service.title} akan dijelaskan secara detail oleh konsultan kami setelah Anda menghubungi tim kami untuk konsultasi awal.`
        }
      }
    ]
  };

  const getWALink = (context = '') => createWhatsAppUrl(
    whatsappSettings.mainNumber || whatsappSettings.secondaryNumber || '6289518530306',
    `${whatsappSettings.messageTemplate || 'Halo Tim Valpro, saya tertarik diskusi mengenai'} : ${service.title} ${context}`
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd, null, 2) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd, null, 2) }}
      />

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 h-[600px] w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-indigo-700 transition">Home</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <Link href="/layanan" className="hover:text-indigo-700 transition">Solusi</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide">{service.category || 'Service'}</span>
        </nav>

        {/* --- HERO SECTION --- */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              {service.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
              {service.desc}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-slate-100 pt-6">
               <div className="flex items-center gap-2">
                 <Building2 size={18} className="text-indigo-600" />
                 <span>Layanan Korporat</span>
               </div>
               <div className="flex items-center gap-2">
                 <Users size={18} className="text-indigo-600" />
                 <span>Tim Ahli Tersertifikasi</span>
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 size={18} className="text-indigo-600" />
                 <span>Jaminan Legalitas</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 1. Overview / Definition */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900">Gambaran Layanan</h2>
              </div>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                {service.definition}
              </div>
            </section>

            {/* 2. Process Timeline (NEW - Corporate Feel) */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                 <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                 <h2 className="text-2xl font-bold text-slate-900">Alur Kerja Profesional</h2>
              </div>
              
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 pb-4">
                {/* Step 1 */}
                <div className="relative pl-8">
                  <span className="absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600 ring-1 ring-slate-200"></span>
                  <h3 className="font-bold text-lg text-slate-900">Konsultasi Awal</h3>
                  <p className="text-slate-600 mt-1">Diskusi kebutuhan spesifik bisnis Anda dengan tim ahli kami.</p>
                </div>
                {/* Step 2 */}
                <div className="relative pl-8">
                  <span className="absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600 ring-1 ring-slate-200"></span>
                  <h3 className="font-bold text-lg text-slate-900">Proses Administrasi & Eksekusi</h3>
                  <p className="text-slate-600 mt-1">Kami menangani seluruh kelengkapan dokumen dan proses teknis.</p>
                </div>
                {/* Step 3 */}
                <div className="relative pl-8">
                  <span className="absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white bg-slate-900 ring-1 ring-slate-200"></span>
                  <h3 className="font-bold text-lg text-slate-900">Penyelesaian & Serah Terima</h3>
                  <p className="text-slate-600 mt-1">Layanan selesai tepat waktu dengan laporan lengkap.</p>
                </div>
              </div>
            </section>

            {/* 3. Features Grid */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900">Fitur & Manfaat Utama</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {service.features?.map((f, i) => (
                  <div key={i} className="group bg-slate-50 p-6 rounded-2xl transition-all hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold text-indigo-600">{i+1}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      {typeof f === 'string' ? f : f.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {typeof f === 'string' ? 'Solusi komprehensif untuk kebutuhan bisnis Anda.' : f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

             {/* 4. CTA Mobile (Only visible on small screens) */}
             <div className="lg:hidden mt-8">
                <Link
                  href={getWALink()}
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg"
                >
                  <MessageCircle size={20} />
                  Hubungi Tim Kami
                </Link>
             </div>
          </div>

          {/* RIGHT SIDEBAR (Sticky) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              
              {/* Humanable Contact Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 p-6 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                
                {/* Pricing / Investment */}
                <div className="mb-6">
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Estimasi Investasi</p>
                  {pricing && pricing.enabled ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium text-slate-500">Rp</span>
                      <span className="text-3xl font-extrabold text-slate-900">{pricing.price}</span>
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-slate-900">Custom Solution</div>
                  )}
                  {pricing?.priceNote && (
                    <p className="text-xs text-slate-400 mt-1 italic">
                      {pricing.priceNote}
                    </p>
                  )}
                  {pricing?.priceDescription && (
                    <p className="text-xs text-slate-500 mt-1">
                      {pricing.priceDescription}
                    </p>
                  )}
                  {!pricing?.priceNote && !pricing?.priceDescription && (
                    <p className="text-xs text-slate-400 mt-1 italic">
                      {service.priceNote || '*Disesuaikan dengan skala kebutuhan'}
                    </p>
                  )}
                </div>

                {/* Team Presence - Human Touch */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700">A</div>
                       <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700">R</div>
                       <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] text-slate-600">+3</div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Tim Legal & Teknis siap membantu.</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    &quot;Kami akan membantu menjelaskan detail teknis dan legalitas layanan ini untuk Anda.&quot;
                  </p>
                </div>

                {/* Primary CTA */}
                <Link
                  href={getWALink()}
                  className="w-full flex items-center justify-center gap-3 bg-[#2a3f9b] hover:bg-[#233582] text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg group"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Diskusi Dengan Pakar</span>
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>Respon rata-rata: &lt; 5 Menit</span>
                </div>
              </div>

              {/* Service Meta Info */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 mb-4 text-sm">Spesifikasi Layanan</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-50">
                    <span className="text-slate-500 flex items-center gap-2">
                        <Clock size={16} /> Durasi
                    </span>
                    <span className="font-semibold text-slate-900">{service.duration}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-50">
                    <span className="text-slate-500 flex items-center gap-2">
                        <ShieldCheck size={16} /> Status
                    </span>
                    <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">{service.status}</span>
                  </div>
                </div>

                {/* Support Link */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                   <Link href="/kontak" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                      <HelpCircle size={16} />
                      <span>Butuh proposal resmi?</span>
                   </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}