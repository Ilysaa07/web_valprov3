import { Inter } from "next/font/google";
import "./globals.css";
import FloatingButtons from "@/components/FloatingButtons";
// Import script translate yang sudah dioptimasi (Lazy Load)
import GoogleTranslateScript from "@/components/GoogleTranslateScript";

// Optimasi Font
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// OPTIMASI 1: Pisahkan Viewport (Standar Next.js 14+)
export const viewport = {
  themeColor: '#1e40af', // Warna browser bar di mobile (sesuai brand)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Metadata Global (SEO Advanced)
export const metadata = {
  // OPTIMASI 2: Metadata Base URL (Wajib untuk SEO Gambar yang valid)
  // Ganti dengan domain asli Anda saat production nanti
  metadataBase: new URL('https://valprointertech.com'), 

  title: {
    default: 'Valpro Intertech | Jasa Legalitas & Perizinan Terpercaya',
    template: '%s | Valpro Intertech',
  },
  description: 'Jasa pendirian PT, CV, sertifikasi ISO, dan SBU Konstruksi terpercaya di Indonesia. Proses cepat, transparan, dan 100% legal.',
  
  // Kata kunci untuk crawler
  keywords: ['jasa legalitas', 'biro jasa pt', 'pendirian cv', 'jasa pengurusan nib', 'sbu konstruksi', 'sertifikasi iso'],
  
  authors: [{ name: 'Valpro Team' }],
  creator: 'Valpro Intertech',
  
  icons: {
    icon: '/logometa.svg',
    apple: '/logometa.svg', // Icon untuk bookmark di iPhone/iPad
  },
  
  // Instruksi Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    title: 'Valpro Intertech - Solusi Legalitas Usaha',
    description: 'Biro jasa perizinan PT, CV, dan NIB terpercaya dan cepat.',
    url: 'https://valprointertech.com',
    siteName: 'Valpro Intertech',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: '/og-image.jpg', // Pastikan nanti Anda punya file ini di public/ untuk thumbnail share WA
        width: 1200,
        height: 630,
        alt: 'Valpro Intertech Banner',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-stone-900 antialiased selection:bg-[#2a3f9b] selection:text-white`}>
        
        {/* 1. Script Google Translate (Diload terakhir secara lazy) */}
        <GoogleTranslateScript />
        
        {/* 2. Konten Utama */}
        {children}
        
        {/* 3. Tombol Melayang (WA/Top) */}
        <FloatingButtons />
        
      </body>
    </html>
  );
}