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
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

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
  const whatsappSettings = await getWhatsappSettings(); // Get WhatsApp settings from dashboard

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
              href={createWhatsAppUrl(
                whatsappSettings.mainNumber || whatsappSettings.secondaryNumber || '6289518530306',
                `${whatsappSettings.messageTemplate || 'Halo, saya ingin bertanya tentang layanan Valpro...'} - ${service.title}`
              )}
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

    {/* Definition */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#2a3f9b] mb-4">Definisi Layanan</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {service.definition}
          </p>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#2a3f9b] mb-3">
            Fitur & Manfaat
          </h2>
          <p className="text-gray-600">
            Solusi menyeluruh dari awal hingga akhir proses legalitas Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {service.features?.map((f, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-[#2a3f9b] text-white font-bold flex items-center justify-center text-xl mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">
                {typeof f === 'string' ? f : f.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {typeof f === 'string' ? f : f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Requirements & Benefits */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Requirements */}
          <div>
            <h2 className="text-3xl font-bold text-[#2a3f9b] mb-6">Persyaratan Dokumen</h2>
            <div className="space-y-4">
              {[...Array(service.requirementsCount)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#2a3f9b] text-white flex items-center justify-center text-sm mt-0.5 flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-gray-700">Dokumen Persyaratan #{i + 1}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 font-medium">*Proses pengurusan akan lebih cepat jika semua dokumen persyaratan lengkap</p>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-3xl font-bold text-[#2a3f9b] mb-6">Keunggulan Layanan</h2>
            <div className="space-y-4">
              {service.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Proof Images */}
    {service.proofImages && service.proofImages.length > 0 && (
      <section className="py-20 bg-[#f3f4f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2a3f9b] mb-3">
              Dokumen & Bukti
            </h2>
            <p className="text-gray-600">
              Contoh dokumen dan bukti hasil layanan kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.proofImages.slice(0, 4).map((image, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image
                  src={image}
                  alt={`Dokumen bukti layanan ${service.title} - ${i + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm">Dokumen #{i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Trust Factors */}
    {service.trustFactors?.length > 0 && (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2a3f9b] mb-3">
              Alasan Memilih Kami
            </h2>
            <p className="text-gray-600">
              Jaminan kualitas dan pengalaman profesional dalam setiap layanan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {service.trustFactors?.map((t, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-[#2a3f9b] text-white flex items-center justify-center mb-4">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">{t.title}</h3>
                <p className="text-gray-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* FAQ Section */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2a3f9b] mb-12 text-center">Pertanyaan Umum</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/50">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Berapa lama proses pengerjaan layanan ini?</h3>
              <p className="text-gray-600">{service.duration}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/50">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Apa saja dokumen yang perlu disiapkan?</h3>
              <p className="text-gray-600">Dokumen persyaratan sejumlah {service.requirementsCount} item perlu disiapkan untuk mempercepat proses pengerjaan.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/50">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Apakah layanan ini bergaransi?</h3>
              <p className="text-gray-600">Ya, semua layanan kami dilengkapi dengan jaminan kepuasan pelanggan dan dukungan purna jual selama proses.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-20 bg-gradient-to-br from-[#2a3f9b] to-[#1e3a8a]">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-white mb-4">
          Siap Memulai Proses Legalitas Anda?
        </h2>
        <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
          Konsultasi gratis tanpa biaya, tim profesional siap membantu Anda sekarang.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={createWhatsAppUrl(
              whatsappSettings.mainNumber || whatsappSettings.secondaryNumber || '6289518530306',
              `${whatsappSettings.messageTemplate || 'Halo, saya ingin bertanya tentang layanan Valpro...'} - ${service.title}`
            )}
            className="inline-flex items-center gap-3 bg-white text-[#2a3f9b] px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-[1.03] transition"
          >
            <MessageCircle size={20} />
            Konsultasi Sekarang
          </Link>

          <div className="flex items-center gap-2 text-white/80">
            <Clock size={20} />
            <span>Respons cepat dalam 1 menit</span>
          </div>
        </div>
      </div>
    </section>
  </main>
);
}