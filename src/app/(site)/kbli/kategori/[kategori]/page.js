import kbliDataRaw from '@/lib/kbli2020.json';
import { KBLI_CATEGORIES, getCategoryForCode } from '@/lib/kbli-kategori';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, ArrowLeft } from 'lucide-react';
import KbliCard from '@/components/KbliCard';

export async function generateMetadata({ params }) {
  const { kategori } = params || {};

  if (!kategori) {
    return {
      title: 'Kategori KBLI Tidak Ditemukan',
    };
  }

  const categoryCode = kategori.toUpperCase();
  const categoryName = KBLI_CATEGORIES[categoryCode];

  if (!categoryName) {
    return {
      title: 'Kategori KBLI Tidak Ditemukan',
    };
  }

  return {
    title: `KBLI Kategori ${categoryCode}: ${categoryName}`,
    description: `Daftar lengkap KBLI 2020 untuk kategori ${categoryName}.`,
  };
}

export async function generateStaticParams() {
  return Object.keys(KBLI_CATEGORIES).map((code) => ({
    kategori: code,
  }));
}

export default function KategoriPage({ params }) {
  const { kategori } = params || {};

  if (!kategori) {
    notFound();
  }

  const categoryCode = kategori.toUpperCase();
  const categoryName = KBLI_CATEGORIES[categoryCode];

  if (!categoryName) {
    notFound();
  }

  // Adapt the data structure once inside the component to ensure it's defined
  const kbliData = kbliDataRaw.map(item => ({
    kode: item["Kode KBLI"],
    judul: item["KBLI"],
    uraian: item["Deskripsi"],
  }));

  const filteredData = kbliData.filter(item => getCategoryForCode(item.kode) === categoryCode);

  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="pt-32 pb-16 px-6 bg-[#FAFAFA] border-b border-stone-200">
        <div className="max-w-4xl mx-auto">
            <Link href="/kbli" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#2a3f9b] mb-6 text-sm font-medium transition-colors">
                <ArrowLeft size={16} /> Kembali ke Semua Kategori
            </Link>
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white border border-stone-200 rounded-2xl">
                    <span className="text-3xl font-bold text-[#2a3f9b]">{categoryCode}</span>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Kategori KBLI</p>
                    <h1 className="text-3xl font-bold text-stone-900 leading-tight">
                        {categoryName}
                    </h1>
                </div>
            </div>
            <p className="mt-4 text-stone-600">
                Menampilkan {filteredData.length} kode KBLI untuk kategori ini.
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-4">
          {filteredData.map((item) => (
            <KbliCard key={item.kode} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
