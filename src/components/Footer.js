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
} from "lucide-react";

export default function Footer() {
  const BRAND_HEX_LIGHT = "#4f6bff";

  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.1234567890123!2d107.60000000000001!3d-7.000000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1234567890abcdef%3A0xabcdef1234567890!2sJl.%20Raya%20Gading%20Tutuka%20No.175%20B%2C%20Soreang%2C%20Bandung%2C%20Jawa%20Barat%2040911!5e0!3m2!1sid!2sid!4v1697040000000!5m2!1sid!2sid";

  const trustBadges = [
    { name: "OSS Indonesia (BKPM)", src: "/images/logos/oss.png", w: 100, h: 50 },
    { name: "Kemenkumham RI", src: "/images/logos/kemenkumham.png", w: 50, h: 50 },
    { name: "Kementerian PUPR (LPJK)", src: "/images/logos/pupr.jpg", w: 50, h: 50 },
    { name: "Kementerian ESDM (DJK)", src: "/images/logos/esdm.png", w: 50, h: 50 },
    { name: "Direktorat Jenderal Pajak", src: "/images/logos/djp.png", w: 80, h: 40 },
  ];

  return (
    <footer className="bg-[#0b0b0d] text-stone-400 font-sans relative overflow-hidden border-t border-stone-900">
      {/* Soft Glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#2a3f9b] rounded-full blur-[150px] opacity-[0.05]"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* BRAND + MAP */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <Link
                href="/"
                className="text-3xl font-bold text-white tracking-tight inline-flex items-center gap-2"
              >
                Valpro<span style={{ color: BRAND_HEX_LIGHT }}>Intertech</span>.
              </Link>
              <p className="text-stone-400 text-sm mt-3 leading-relaxed max-w-sm">
                Mitra legalitas modern yang membantu bisnis Anda berkembang
                tanpa hambatan birokrasi. Kami selalu siap mendampingi Anda.
              </p>
            </div>

            {/* MAP CARD */}
            <div className="bg-stone-900/40 p-1.5 rounded-2xl border border-stone-800 hover:border-[#4f6bff]/30 transition-all duration-300">
              <div className="relative w-full h-48 rounded-xl overflow-hidden">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                ></iframe>

                {/* Button */}
                <div className="absolute bottom-3 right-3">
                  <a
                    href="https://goo.gl/maps/placeholder"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-1.5 bg-white text-stone-900 text-xs font-bold rounded-lg shadow-lg hover:bg-blue-50 transition"
                  >
                    <MapPin size={12} className="text-[#2a3f9b]" />
                    Buka Peta
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="p-4 flex items-start gap-3">
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

          {/* NAVIGASI */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">
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
                    className="text-stone-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#4f6bff]"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KONTAK HUMANIS */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase">
              Pusat Bantuan
            </h4>

            <div className="bg-stone-900/60 rounded-2xl p-6 border border-stone-800 shadow-lg shadow-black/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#4f6bff]/10 rounded-full blur-2xl -mr-6 -mt-6"></div>

              {/* CS Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border-2 border-stone-700 overflow-hidden relative bg-stone-800">
                  <div className="w-full h-full flex items-center justify-center bg-stone-700 text-stone-300">
                    <span className="text-xs font-bold">I</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-stone-900 rounded-full"></span>
                </div>

                <div>
                  <p className="text-white font-bold text-sm">
                    Ilyasa — Customer Support
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Ada pertanyaan? Tenang, kami bantu. (09:00–17:00)
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href="https://wa.me/6289518530306"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#2a3f9b] hover:bg-[#324ec9] text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-900/20"
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

              {/* Response Time */}
              <div className="flex items-center justify-center mt-4 text-[11px] text-stone-500 gap-2 bg-stone-900/40 rounded-lg py-1">
                <Clock size={12} /> Respon rata-rata &lt; 5 menit
              </div>
            </div>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-20 pt-10 border-t border-stone-900/50">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-6 text-center">
            Terdaftar Resmi & Terverifikasi Oleh Instansi Pemerintah Indonesia
          </p>

          <div className="flex flex-wrap justify-center items-center gap-10">
            {trustBadges.map((item, idx) => (
              <div key={idx} className="relative group h-10 flex items-center justify-center">
                <Image
                  src={item.src}
                  alt={item.name}
                  width={item.w}
                  height={item.h}
                  className="h-full w-auto object-contain"
                />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mt-10">
            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-stone-500 hover:bg-[#2a3f9b] hover:text-white transition"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#050506] border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600">
          <p>© 2025 PT Valpro Intertech. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-stone-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-stone-400">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-stone-400">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
