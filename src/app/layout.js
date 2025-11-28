import { Inter } from "next/font/google";
import "./globals.css";
import FloatingButtons from "@/components/FloatingButtons";

// Optimasi Font
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Metadata Global (SEO Dasar)
export const metadata = {
  title: {
    default: 'Valpro Intertech | Jasa Legalitas & Perizinan Terpercaya',
    template: '%s | Valpro Intertech', // Judul halaman lain akan otomatis ikut format ini
  },
  description: 'Jasa pendirian PT, CV, sertifikasi ISO, dan SBU Konstruksi terpercaya di Indonesia. Proses cepat, transparan, dan 100% legal.',
  icons: {
    icon: '/logometa.svg', // Gunakan logometa.svg dari folder public
  },
  openGraph: {
    title: 'Valpro Intertech - Solusi Legalitas Usaha',
    description: 'Biro jasa perizinan PT, CV, dan NIB terpercaya dan cepat.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-stone-900 antialiased selection:bg-[#2a3f9b] selection:text-white`}>
        {children}
        <FloatingButtons />
      </body>
    </html>
  );
}