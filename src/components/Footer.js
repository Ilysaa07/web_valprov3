"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const BRAND_HEX_LIGHT = "#4f6bff";

  // GANTI DENGAN LINK EMBED GOOGLE MAPS ASLI
  // Ini adalah link valid untuk area Soreang, Bandung
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.863698428974!2d107.52183957587954!3d-7.025339668822236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68edec63b93023%3A0x68673321e41e6303!2sJl.%20Gading%20Tutuka%2C%20Soreang%2C%20Kec.%20Soreang%2C%20Kabupaten%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1708657289337!5m2!1sid!2sid";

  const trustBadges = [
    { name: "OSS Indonesia (BKPM)", src: "/images/logos/oss.png", w: 100, h: 50 },
    { name: "Kemenkumham RI", src: "/images/logos/kemenkumham.png", w: 50, h: 50 },
    { name: "Kementerian PUPR (LPJK)", src: "/images/logos/pupr.jpg", w: 50, h: 50 },
    { name: "Kementerian ESDM (DJK)", src: "/images/logos/esdm.png", w: 50, h: 50 },
    { name: "Direktorat Jenderal Pajak", src: "/images/logos/djp.png", w: 80, h: 40 },
  ];

  return (
    <footer className="bg-[#0b0b0d] text-stone-400 font-sans relative overflow-hidden border-t border-stone-900">
      
      {/* 1. Ambient Glow */}
      <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[#2a3f9b] rounded-full blur-[180px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* --- COL 1: BRAND & LOCATION --- */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <Link
                href="/"
                className="text-3xl font-bold text-white tracking-tight inline-flex items-center gap-2"
              >
                Valpro<span style={{ color: BRAND_HEX_LIGHT }}>Intertech</span>.
              </Link>
              <p className="text-stone-400 text-sm mt-4 leading-relaxed max-w-sm">
                Mitra legalitas modern yang membantu bisnis Anda berkembang
                tanpa hambatan birokrasi. Resmi, Transparan, dan Terpercaya.
              </p>
            </div>

            {/* MAP CARD (FIXED: Warna Asli & Link Valid) */}
            <div className="bg-stone-900/40 p-2 rounded-2xl border border-stone-800">
              
              {/* Hapus class 'grayscale' agar warna asli keluar */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>

                {/* Button Buka Peta */}
                <div className="absolute bottom-3 right-3">
                  <a
                    href="https://goo.gl/maps/placeholder"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 bg-white text-stone-900 text-[10px] font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
                  >
                    <ExternalLink size={12} className="text-[#2a3f9b]" />
                    Buka Peta
                  </a>
                </div>
              </div>

              <div className="p-4 flex items-start gap-4">
                <div className="p-2 bg-[#2a3f9b]/10 rounded-lg text-[#4f6bff] mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    Kantor Operasional
                  </p>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Jl. Raya Gading Tutuka No.175 B, Soreang,
                    <br /> Bandung, Jawa Barat 40911
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- COL 2: NAVIGASI LAYANAN --- */}
          <div className="lg:col-span-3 lg:pl-6">
            <h4 className="text-white font-bold mb-8 text-xs tracking-[0.2em] uppercase border-b border-stone-800 pb-4 inline-block">
              Layanan Kilat
            </h4>

            <ul className="space-y-4 text-sm">
              {[
                { label: "Pendirian PT Perorangan", url: "/layanan/pendirian-badan-usaha" },
                { label: "SBU Konstruksi", url: "/layanan/sbu-konstruksi" },
                { label: "Izin Edar & Halal", url: "#" },
                { label: "Pendaftaran Merek", url: "#" },
                { label: "Sertifikasi ISO 9001", url: "/layanan/sertifikasi-iso" },
                { label: "Laporan Pajak", url: "/layanan/audit-keuangan" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.url}
                    className="text-stone-400 hover:text-white transition-colors flex items-center gap-3 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-800 group-hover:bg-[#4f6bff] transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- COL 3: PUSAT BANTUAN --- */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white font-bold mb-2 text-xs tracking-[0.2em] uppercase border-b border-stone-800 pb-4 inline-block">
              Pusat Bantuan
            </h4>

            <div className="bg-stone-900/60 rounded-2xl p-6 border border-stone-800 shadow-lg relative overflow-hidden hover:border-stone-700 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#4f6bff]/10 rounded-full blur-2xl -mr-6 -mt-6"></div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full border-2 border-stone-700 overflow-hidden relative bg-stone-800 flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-800 text-stone-300 font-bold text-lg">
                    I
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-stone-900 rounded-full"></span>
                </div>

                <div>
                  <p className="text-white font-bold text-sm">
                    Ilyasa — Support
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Siap membantu Anda (09:00–17:00)
                  </p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <a
                  href="https://wa.me/6289518530306"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#2a3f9b] hover:bg-[#3b5bdb] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
                >
                  <MessageCircle size={16} /> Chat WhatsApp
                </a>

                <a
                  href="mailto:mail@valprointertech.com"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-sm font-medium transition border border-stone-700"
                >
                  <Mail size={16} /> Kirim Email
                </a>
              </div>

              <div className="flex items-center justify-center mt-4 text-[10px] text-stone-500 gap-1.5">
                <Clock size={10} /> Respon rata-rata kurang dari 5 menit
              </div>
            </div>
          </div>
        </div>

        {/* --- TRUST BADGES --- */}
        <div className="mt-20 pt-10 border-t border-stone-900/50 text-center">
          <p className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.2em] mb-8">
            Terdaftar Resmi & Terverifikasi Oleh
          </p>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {trustBadges.map((item, idx) => (
              <div key={idx} className="relative group h-10 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                <Image
                  src={item.src}
                  alt={item.name}
                  width={item.w}
                  height={item.h}
                  className="h-full w-auto object-contain"
                />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <a
              href="https://www.instagram.com/valprointertech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Valpro Intertech"
              className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 hover:bg-[#2a3f9b] hover:text-white hover:border-[#2a3f9b] transition-all duration-300"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/valprointertech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Valpro Intertech"
              className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 hover:bg-[#2a3f9b] hover:text-white hover:border-[#2a3f9b] transition-all duration-300"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/valprointertech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Valpro Intertech"
              className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 hover:bg-[#2a3f9b] hover:text-white hover:border-[#2a3f9b] transition-all duration-300"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#050506] border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600">
          <p>© 2025 PT Valpro Intertech. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-stone-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-stone-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-stone-400 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}