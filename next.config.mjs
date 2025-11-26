/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Izinkan format modern
    formats: ['image/avif', 'image/webp'],
    
    // DAFTAR DOMAIN YANG DIIZINKAN
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
        hostname: 'images.ctfassets.net', // Untuk Contentful
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  swcMinify: true, 
};

export default nextConfig;