import { servicesData } from '@/lib/servicesData';
import { getSortedPostsData } from '@/lib/blog';
import { locations } from '@/lib/locations';
import kbliData from '@/lib/kbli-full.json';

// URL Dasar Website Anda
const BASE_URL = 'https://valprointertech.com';

export default async function sitemap() {
  // Gunakan tanggal tetap untuk konten yang tidak sering berubah
  const lastModifiedDate = new Date('2025-01-01');

  // 1. Ambil Data Blog (Dinamis dari Contentful)
  let blogUrls = [];
  try {
    const posts = await getSortedPostsData();
    if (posts && Array.isArray(posts) && posts.length > 0) {
      blogUrls = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : lastModifiedDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch blog posts for sitemap:', error);
  }

  // 2. Ambil Data Layanan (dari servicesData.js)
  let serviceUrls = [];
  try {
    if (Array.isArray(servicesData)) {
      serviceUrls = servicesData.map((service) => ({
        url: `${BASE_URL}/layanan/${service.slug}`,
        lastModified: lastModifiedDate,
        changeFrequency: 'monthly',
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error('Failed to process services data for sitemap:', error);
  }

  // 3. Ambil Data Lokasi/Area (dari locations.js)
  let locationUrls = [];
  try {
    if (Array.isArray(locations)) {
      locationUrls = locations.map((loc) => ({
        url: `${BASE_URL}/area/${loc.slug}`,
        lastModified: lastModifiedDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to process locations data for sitemap:', error);
  }

  // 4. Ambil Data KBLI (dari kbli-full.json)
  let kbliUrls = [];
  try {
    if (Array.isArray(kbliData)) {
      kbliUrls = kbliData.map((kbli) => ({
        url: `${BASE_URL}/kbli/${kbli.kode}`,
        lastModified: lastModifiedDate,
        changeFrequency: 'yearly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Failed to process KBLI data for sitemap:', error);
  }


  // 5. Halaman Statis Utama (dengan prioritas dan frekuensi yang disesuaikan)
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/kbli`, lastModified: lastModifiedDate, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/cek-merek`, lastModified: lastModifiedDate, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/kalkulator-pajak`, lastModified: lastModifiedDate, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/cek-nama-pt`, lastModified: lastModifiedDate, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/simulasi-biaya`, lastModified: lastModifiedDate, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/buat-surat`, lastModified: lastModifiedDate, priority: 0.7, changeFrequency: 'monthly' },
  ];

  return [
    ...staticRoutes, 
    ...serviceUrls, 
    ...blogUrls, 
    ...locationUrls, 
    ...kbliUrls
  ].filter(Boolean); // Filter out any potential null/undefined entries
}