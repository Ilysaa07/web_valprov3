import { servicesData } from '@/lib/servicesData';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  MessageCircle, Clock, ShieldCheck, FileText, ChevronRight,
  CheckCircle2
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
  <main className="min-h-screen bg-[#f8fafc] font-sans text-gray-900">
    {/* SEO Schema */}
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2)
      }}
    />

    {/* Breadcrumb */}
    <div className="bg-white/70 backdrop-blur border-b border-gray-200/60 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <nav className="text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#2a3f9b] transition">Beranda</Link>
          <ChevronRight size={14} />
          <Link href="/layanan" className="hover:text-[#2a3f9b] transition">Layanan</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{service.title}</span>
        </nav>
      </div>
    </div>

    {/* Hero Section */}
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a3f9b]/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-3 gap-12 items-start relative z-10">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {service.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            {service.desc}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={`https://wa.me/6289518530306?text=Halo%20Tim%20Valpro,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`}
              className="group inline-flex items-center gap-2 bg-[#2a3f9b] text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-[#2a3f9b]/30 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <MessageCircle size={18} />
              Konsultasi Gratis
              <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Floating Info Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#2a3f9b]/10 blur-2xl rounded-3xl" />
          <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-xl">

            <h2 className="text-lg font-bold mb-6">Informasi Layanan</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center">
                  <Clock size={18} className="text-[#2a3f9b]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Durasi</p>
                  <p className="font-medium">{service.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center">
                  <FileText size={18} className="text-[#2a3f9b]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Status</p>
                  <p className="font-medium">{service.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-[#2a3f9b]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Persyaratan</p>
                  <p className="font-medium">
                    {service.requirementsCount} Dokumen
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            {pricing && pricing.enabled && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Harga Layanan</p>
                <div className="text-3xl font-bold text-[#2a3f9b]">
                  Rp {pricing.price}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {pricing.priceNote || service.priceNote}
                </p>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="font-semibold mb-3">Keunggulan</p>
                <ul className="space-y-2">
                  {service.benefits.slice(0, 3)?.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Fitur & Manfaat
          </h2>
          <p className="text-gray-500">
            Solusi menyeluruh dari awal hingga akhir proses legalitas Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {service.features?.map((f, i) => (
            <div
              key={i}
              className="group bg-gray-50/80 rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2a3f9b] text-white font-bold flex items-center justify-center mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2">
                {typeof f === 'string' ? f : f.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {typeof f === 'string' ? f : f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Trust Factors */}
    {service.trustFactors?.length > 0 && (
      <section className="py-20 bg-[#f3f4f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Mengapa Memilih Kami
            </h2>
            <p className="text-gray-500">
              Jaminan kualitas dan pengalaman profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {service.trustFactors?.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2a3f9b]/10 flex items-center justify-center mb-4">
                  <ShieldCheck size={20} className="text-[#2a3f9b]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t.title}</h3>
                <p className="text-gray-600 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Final CTA */}
    <section className="py-20 bg-gradient-to-br from-[#2a3f9b] to-[#1e3a8a]">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-white mb-4">
          Mulai Proses Legalitas Anda Hari Ini
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Konsultasi gratis tanpa biaya, tim profesional siap membantu Anda.
        </p>
        <Link
          href={`https://wa.me/6289518530306?text=Halo%20Tim%20Valpro,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`}
          className="inline-flex items-center gap-3 bg-white text-[#2a3f9b] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.03] transition"
        >
          <MessageCircle size={22} />
          Hubungi Kami Sekarang
        </Link>
      </div>
    </section>
  </main>
);
}