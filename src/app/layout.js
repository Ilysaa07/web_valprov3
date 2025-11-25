import { Inter } from "next/font/google"; // Font Google otomatis dari Next.js
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Menggunakan font Inter agar terlihat modern & clean (Humanis)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Metadata Global (SEO Dasar)
export const metadata = {
  title: {
    default: 'Valpro Intertech | Jasa Legalitas & Perizinan Terpercaya',
    template: '%s | Valpro Intertech', // Judul halaman lain akan mengikuti format ini
  },
  description: 'Jasa pendirian PT, CV, sertifikasi ISO, dan SBU Konstruksi terpercaya di Indonesia. Proses cepat, transparan, dan 100% legal.',
  icons: {
    icon: '/favicon.ico', // Pastikan ada file favicon.ico di folder public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-stone-900 antialiased selection:bg-[#2a3f9b] selection:text-white`}>
        
        {/* 1. NAVBAR (Akan muncul di semua halaman) */}
        <Navbar />

        {/* 2. KONTEN HALAMAN (Berubah-ubah sesuai halaman yang dibuka) */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* 3. FOOTER (Akan muncul di semua halaman) */}
        <Footer />

      </body>
    </html>
  );
}