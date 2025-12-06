"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

export default function Footer() {
  const [whatsappNumber, setWhatsappNumber] = useState('6289518530306'); // Default value

  useEffect(() => {
    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.secondaryNumber || settings.mainNumber || '6289518530306');
    };

    loadWhatsappSettings();
  }, []);
  // GANTI DENGAN LINK EMBED GOOGLE MAPS ASLI
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.863698428974!2d107.52183957587954!3d-7.025339668822236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68edec63b93023%3A0x68673321e41e6303!2sJl.%20Gading%20Tutuka%2C%20Soreang%2C%20Kec.%20Soreang%2C%20Kabupaten%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1708657289337!5m2!1sid!2sid";

  const trustBadges = [
    { name: "OSS Indonesia", src: "/images/logos/oss.png" },
    { name: "Kemenkumham", src: "/images/logos/kemenkumham.png" },
    { name: "Kementerian PUPR", src: "/images/logos/pupr.jpg" },
    { name: "Kementerian ESDM", src: "/images/logos/esdm.png" },
    { name: "Dirjen Pajak", src: "/images/logos/djp.png" },
  ];

  const serviceLinks = [
    { label: "Pendirian PT Perorangan", url: "/layanan/pendirian-badan-usaha" },
    { label: "SBU Konstruksi", url: "/layanan/sbu-konstruksi" },
    { label: "Izin Edar & Halal", url: "#" },
    { label: "Pendaftaran Merek", url: "#" },
    { label: "Sertifikasi ISO 9001", url: "/layanan/sertifikasi-iso" },
    { label: "Laporan Pajak", url: "/layanan/audit-keuangan" },
  ];

  return (
    <footer className="bg-[#09090b] text-stone-400 font-sans relative overflow-hidden border-t border-stone-900/50">
      
      {/* 1. BACKGROUND TEXTURE (Grid Pattern) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
      
      {/* 2. AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1e40af] rounded-full blur-[200px] opacity-[0.08] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        
        {/* --- TOP SECTION: MAIN GRID --- */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-20 border-b border-stone-800/50 pb-16">
          
          {/* COL 1: BRAND IDENTITY (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="text-3xl font-bold text-white tracking-tight inline-flex items-center gap-2 mb-6">
                Valpro<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] to-[#3b82f6]">Intertech</span>.
              </Link>
              <p className="text-stone-400 text-sm leading-relaxed max-w-sm mb-8">
                Mitra legalitas modern yang membantu bisnis Anda berkembang tanpa hambatan birokrasi. Resmi, Transparan, dan Terpercaya.
              </p>
              
              <div className="flex gap-4">
                 {[
                   { icon: Instagram, url: "https://www.instagram.com/valprointertech" },
                   { icon: Facebook, url: "https://www.facebook.com/valprointertech" },
                   { icon: Linkedin, url: "https://www.linkedin.com/company/valprointertech" }
                 ].map((social, i) => (
                   <a key={i} href={social.url} target="_blank" className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 hover:bg-[#1e40af] hover:text-white hover:border-[#1e40af] transition-all duration-300">
                     <social.icon size={18} />
                   </a>
                 ))}
              </div>
            </div>
          </div>

          {/* COL 2: NAVIGASI LAYANAN (Sesuai Link Asli) */}
          <div className="lg:col-span-3 lg:pl-8">
             <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e40af]"></span> Layanan Kilat
             </h4>
             <ul className="space-y-4">
                {serviceLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.url}
                      className="text-sm text-stone-400 hover:text-white transition-colors flex items-center gap-3 group"
                    >
                      {/* Titik indikator berubah biru saat hover */}
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-800 group-hover:bg-[#3b82f6] group-hover:scale-125 transition-all duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* COL 3: WIDGETS AREA (5 Cols - Unique Layout) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
             
             {/* WIDGET 1: LOCATION CARD (Unique: Overlay Style) */}
             <div className="group relative w-full h-48 rounded-2xl overflow-hidden border border-stone-800 bg-stone-900">
                {/* Map Background */}
                <iframe
                  src={mapEmbedUrl}
                  width="100%" height="100%"
                  className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 p-5 w-full flex justify-between items-end pointer-events-none">
                   <div>
                      <div className="flex items-center gap-2 text-[#3b82f6] mb-1">
                         <MapPin size={16} fill="currentColor" />
                         <span className="text-xs font-bold uppercase tracking-wider">Kantor Pusat</span>
                      </div>
                      <p className="text-white text-xs leading-relaxed max-w-[200px]">
                         Jl. Raya Gading Tutuka No.175 B, Soreang, Bandung
                      </p>
                   </div>
                   <a 
                     href="https://goo.gl/maps/placeholder" 
                     target="_blank" 
                     className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[#1e40af] hover:border-[#1e40af] text-white px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                   >
                     Buka Peta <ExternalLink size={12}/>
                   </a>
                </div>
             </div>

             {/* WIDGET 2: SUPPORT CARD (Unique: Dashboard Style) */}
             <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-5 flex items-center justify-between hover:border-stone-700 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-stone-300 font-bold border border-stone-700">
                         CS
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-stone-900 rounded-full animate-pulse"></span>
                   </div>
                   <div>
                      <p className="text-white font-bold text-sm">Butuh Bantuan Cepat?</p>
                      <p className="text-stone-500 text-xs flex items-center gap-1.5 mt-0.5">
                         <Clock size={10} /> Online: 09:00 - 17:00 WIB
                      </p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <a href="mailto:mail@valprointertech.com" className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors border border-stone-700">
                      <Mail size={18} />
                   </a>
                   <a href={createWhatsAppUrl(whatsappNumber)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e40af] text-white hover:bg-[#3b82f6] shadow-lg shadow-blue-900/20 transition-colors">
                      {/* Icon WA Putih */}
                      <Image src="/whatsapp-icon.svg" alt="WA" width={18} height={18} className="invert brightness-0" style={{ filter: 'brightness(0) invert(1)' }} />
                   </a>
                </div>
             </div>

          </div>
        </div>

        {/* --- BOTTOM SECTION: TRUST & COPYRIGHT --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           
           {/* Trust Badges (Monochrome Style) */}
           <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
              {trustBadges.map((badge, idx) => (
                 <div key={idx} className="relative group opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-help">
                    <Image 
                      src={badge.src} 
                      alt={badge.name} 
                      width={100} height={40} 
                      className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                    />
                 </div>
              ))}
           </div>

           {/* Copyright & Legal */}
           <div className="flex flex-col md:flex-row items-center gap-6 text-xs text-stone-600">
              <div className="flex gap-4">
                 <Link href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
                 <Link href="#" className="hover:text-stone-300 transition-colors">Terms</Link>
              </div>
              <p>© 2025 PT Valpro Intertech.</p>
           </div>

        </div>

      </div>
    </footer>
  );
}