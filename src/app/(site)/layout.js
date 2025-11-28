import { Inter } from "next/font/google";
import "../globals.css"; // Pastikan CSS global diimport
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Menggunakan font Inter agar terlihat modern & clean (Humanis)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Metadata Global (SEO Dasar)
export const metadata = {
  title: {
    default: 'Valpro Intertech | Jasa Legalitas & Perizinan Terpercaya',
    template: '%s | Valpro Intertech',
  },
  description: 'Jasa pendirian PT, CV, sertifikasi ISO, dan SBU Konstruksi terpercaya di Indonesia. Proses cepat, transparan, dan 100% legal.',
  icons: {
    icon: '/logometa.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-stone-900 antialiased selection:bg-[#2a3f9b] selection:text-white`}>
        
        {/* 1. NAVBAR */}
        <Navbar />

        {/* 2. KONTEN HALAMAN */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* 3. FOOTER */}
        <Footer />

      </body>
    </html>
  );
}