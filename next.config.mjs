/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Mengaktifkan Strict Mode untuk deteksi bug lebih dini
  reactStrictMode: true,

  // 2. Optimasi Gambar
  images: {
    // Prioritaskan AVIF (kompresi lebih baik dari WebP)
    formats: ['image/avif', 'image/webp'],
    
    // Cache gambar remote minimal 60 detik untuk mengurangi beban server
    minimumCacheTTL: 60,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },

  // 3. Header Keamanan (PENTING UNTUK SKOR "BEST PRACTICES" & SEO)
  async headers() {
    return [
      {
        // Terapkan header ini ke semua rute
        source: '/:path*',
        headers: [
          {
            // Mencegah serangan XSS
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Mencegah clickjacking (website Anda di-embed di iframe orang lain)
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Mencegah browser menebak tipe MIME (Security risk)
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Mempercepat resolusi DNS link eksternal
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            // Memaksa HTTPS (HSTS) - Penting untuk keamanan jangka panjang
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Mengontrol informasi referrer untuk privasi user
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            // Membatasi akses fitur browser (Kamera/Mic/Lokasi) jika tidak dipakai
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;