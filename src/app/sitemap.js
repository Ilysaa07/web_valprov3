import { servicesData } from "@/lib/servicesData";
import { getSortedPostsData } from "@/lib/blog";
import { locations } from "@/lib/locations";
import kbliData from "@/lib/kbli-full.json";
import glossaryData from "@/lib/glossary.json";
import { KBLI_CATEGORIES } from "@/lib/kbli-kategori";

// URL Dasar Website Anda
const BASE_URL = "https://valprointertech.com";

export default async function sitemap() {
  // Gunakan tanggal sekarang untuk lastModified dinamis
  const currentDate = new Date();

  // 1. Ambil Data Blog (Dinamis dari Contentful)
  let blogUrls = [];
  try {
    const posts = await getSortedPostsData();
    if (posts && Array.isArray(posts) && posts.length > 0) {
      blogUrls = posts.map((post) => {
        let postDate = currentDate;
        if (post.date) {
          const parsedDate = new Date(post.date);
          if (!isNaN(parsedDate.getTime())) {
            postDate = parsedDate;
          }
        }
        return {
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: postDate,
          changeFrequency: "weekly",
          priority: 0.8,
        };
      });
    }
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  // 2. Ambil Data Layanan (dari servicesData.js)
  let serviceUrls = [];
  try {
    if (Array.isArray(servicesData)) {
      serviceUrls = servicesData.map((service) => ({
        url: `${BASE_URL}/layanan/${service.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error("Failed to process services data for sitemap:", error);
  }

  // 3. Ambil Data Lokasi/Area (dari locations.js)
  let locationUrls = [];
  try {
    if (Array.isArray(locations)) {
      locationUrls = locations.map((loc) => ({
        url: `${BASE_URL}/area/${loc.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Failed to process locations data for sitemap:", error);
  }

  // 4. Ambil Data KBLI (dari kbli-full.json)
  let kbliUrls = [];
  try {
    if (Array.isArray(kbliData)) {
      kbliUrls = kbliData.map((kbli) => ({
        url: `${BASE_URL}/kbli/${kbli.kode}`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Failed to process KBLI data for sitemap:", error);
  }

  // 5. Ambil Data Kategori KBLI
  let kbliCategoryUrls = [];
  try {
    const categoryCodes = Object.keys(KBLI_CATEGORIES).map(code => code.toLowerCase());
    kbliCategoryUrls = categoryCodes.map(categoryCode => ({
      url: `${BASE_URL}/kbli/kategori/${categoryCode}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to process KBLI category data for sitemap:", error);
  }

  // 6. Ambil Data Kamus Istilah (dari glossary.json)
  let kamusUrls = [];
  try {
    if (Array.isArray(glossaryData)) {
      kamusUrls = glossaryData.map(glossaryItem => ({
        url: `${BASE_URL}/kamus/${glossaryItem.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Failed to process glossary data for sitemap:", error);
  }

  // 7. Halaman Statis Utama (dengan prioritas dan frekuensi yang disesuaikan)
  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      priority: 1.0,
      changeFrequency: "daily",
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/kbli`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/kbli/kategori`,
      lastModified: currentDate,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/cek-merek`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/kalkulator-pajak`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/cek-nama-pt`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/simulasi-biaya`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/buat-surat`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/cek-status`,
      lastModified: currentDate,
      priority: 0.6,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/kalender-bisnis`,
      lastModified: currentDate,
      priority: 0.6,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/kamus`,
      lastModified: currentDate,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/kuis-legalitas`,
      lastModified: currentDate,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/kamus/terbaru`,
      lastModified: currentDate,
      priority: 0.5,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/kamus/populer`,
      lastModified: currentDate,
      priority: 0.5,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/kontak`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "yearly",
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: currentDate,
      priority: 0.7,
      changeFrequency: "yearly",
    },
    {
      url: `${BASE_URL}/layanan`,
      lastModified: currentDate,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/area`,
      lastModified: currentDate,
      priority: 0.6,
      changeFrequency: "monthly",
    },
  ];

  return [
    ...staticRoutes,
    ...serviceUrls,
    ...blogUrls,
    ...locationUrls,
    ...kbliUrls,
    ...kbliCategoryUrls,
    ...kamusUrls,
  ].filter(Boolean); // Filter out any potential null/undefined entries
}
