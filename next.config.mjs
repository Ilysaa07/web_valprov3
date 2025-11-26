/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Izinkan format AVIF (lebih kecil dari WebP)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  // Minify kode JavaScript agar lebih ringan
  swcMinify: true, 
};

export default nextConfig;