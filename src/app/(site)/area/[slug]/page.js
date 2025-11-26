import { locations } from '@/lib/servicesData'; // Asumsi locations disimpan di sini atau buat file baru
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import { notFound } from 'next/navigation';
import { locations as cities } from '@/lib/locations'; // Import data lokasi langkah 1

// 1. GENERATE STATIC PARAMS (Agar loading instan & di-index Google)
export async function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

// 2. SEO METADATA DINAMIS
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);
  
  if (!city) return { title: 'Halaman Tidak Ditemukan' };

  return {
    title: `Jasa Pendirian PT & CV di ${city.name} - Resmi & Cepat`,
    description: `Biro jasa legalitas terpercaya di ${city.name}, Jawa Barat. Melayani pendirian PT, CV, NIB, dan SBU Konstruksi khusus wilayah ${city.name} dan sekitarnya. Konsultasi Gratis.`,
    keywords: [`jasa pt ${city.name}`, `biro jasa ${city.name}`, `notaris ${city.name}`, `izin usaha ${city.name}`],
    alternates: {
      canonical: `/area/${slug}`,
    },
  };
}

// 3. HALAMAN UTAMA
export default async function LocalPage({ params }) {
  const { slug } = await params;
  const city = cities.find((c) => c.slug === slug);

  if (!city) return notFound();

  // JSON-LD SCHEMA (Sangat Penting untuk Google Maps SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Valpro Intertech ${city.name}`,
    image: 'https://valprointertech.com/logo.png',
    description: `Layanan legalitas usaha dan perizinan di ${city.name}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: 'Jawa Barat',
      addressCountry: 'ID'
    },
    areaServed: {
      '@type': 'City',
      name: city.name
    },
    url: `https://valprointertech.com/area/${slug}`,
    telephone: '+6281234567890',
    priceRange: '$$'
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Khusus Kota Tersebut */}
      <Hero city={city.name} />
      
      {/* Konten Penjelas SEO Lokal */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
                Melayani Pengusaha di {city.name}
            </h2>
            <p className="text-stone-600 leading-relaxed">
                Apakah Anda berdomisili di <strong>{city.name}</strong> dan ingin melegalkan usaha? 
                Valpro Intertech hadir lebih dekat dengan Anda. Kami memahami regulasi lokal di wilayah 
                {city.name} dan siap membantu pengurusan izin hingga tuntas tanpa Anda harus keluar rumah.
                Tim kami siap jemput bola untuk area {city.name} dan sekitarnya.
            </p>
        </div>
      </section>

      {/* Komponen Standar */}
      <Services />
      <WhyUs />

    </main>
  );
}