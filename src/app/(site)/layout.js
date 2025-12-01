import { Inter } from "next/font/google";
import "../globals.css";

import Navbar from "@/components/Navbar";
import FloatingButtons from "@/components/FloatingButtons";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL('https://valprointertech.com'), 
  title: {
    default: 'Valpro Intertech | Jasa Legalitas & Perizinan Terpercaya',
    template: '%s | Valpro Intertech',
  },
  description: 'Jasa pendirian PT, CV, sertifikasi ISO, dan SBU Konstruksi terpercaya di Indonesia.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body 
        className={`${inter.className} bg-white text-stone-900 antialiased selection:bg-[#2a3f9b] selection:text-white`}
        suppressHydrationWarning={true}
      >
        
        {/* PERBAIKAN: Bungkus semua konten React dalam satu DIV */}
        {/* Ini mencegah bentrok dengan elemen yang diinject Google Translate ke Body */}
        <div className="flex flex-col min-h-screen relative">
          
          <Navbar />
          
          <main className="flex-grow">
             {children}
          </main>
          
          <FloatingButtons />
          
          <Footer />
          
        </div>
        
        {/* Google Translate ditaruh di LUAR wrapper utama, tapi masih di dalam body */}
        <GoogleTranslateScript />
        
      </body>
    </html>
  );
}