"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { getWhatsappSettings, createWhatsAppUrl } from "@/lib/whatsappSettings";

/* ================== COMPONENT ================== */
export default function HeroModern({ city = null }) {
  const [whatsappNumber, setWhatsappNumber] = useState("6281399710085");
  const [whatsappMessage, setWhatsappMessage] = useState("Halo, saya ingin konsultasi pengurusan legalitas usaha");
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Mobile detection (performance safe)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Load WhatsApp settings
  useEffect(() => {
    getWhatsappSettings().then((settings) => {
      setWhatsappNumber(settings.mainNumber || "6281399710085");
      // Use the template message from settings if available, otherwise use default
      setWhatsappMessage(settings.messageTemplate || "Halo, saya ingin konsultasi pengurusan legalitas usaha");
    });
  }, []);

  // ✅ Kurangi jumlah logo di mobile
  const logoCount = isMobile ? 14 : 28;

  const logos = useMemo(
    () =>
      Array.from(
        { length: logoCount },
        (_, i) => `/images/logos/logo_klien/${i + 1}.png`
      ),
    [logoCount]
  );

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 min-h-screen flex items-center overflow-hidden mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* ================= LEFT ================= */}
          <div className="relative z-10">
            {/* ✅ Judul baru — selaras dengan visual GIF */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 tracking-tight">
              <span className="text-slate-900">Tidak perlu</span>{" "}
              <span className="text-blue-600">bingung</span>
              <br />
              <span className="text-slate-900">mengurus</span>{" "}
              <span className="text-indigo-600">legalitas</span>
            </h1>

            {/* ✅ Deskripsi baru */}
            <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Serahkan proses legalitas usaha Anda kepada tim profesional.
              Lebih cepat, lebih aman, tanpa stres.
            </p>

            {/* CTA */}
            <div className="mb-14">
              <a
                href={createWhatsAppUrl(whatsappNumber, whatsappMessage)}
                className="group inline-flex items-center justify-center gap-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-4 rounded-xl font-semibold transition-all text-base shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30 touch-manipulation"
              >
                <span>Konsultasi Gratis via WhatsApp</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* ================= RIGHT (GIF) ================= */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full min-h-[520px] sm:min-h-[640px] flex items-center justify-center">
              <div className="relative">

                {/* ✅ Optimized GIF using next/image */}
                <Image
                  src="/hero.gif"
                  alt="Ilustrasi orang sedang bingung mengurus legalitas"
                  width={800}
                  height={800}
                  priority={!isMobile}
                  className="w-full h-auto max-h-[700px] object-contain scale-110"
                  sizes="(max-width: 768px) 90vw, 800px"
                />

                {/* Floating question marks (dipertahankan tapi lebih ringan) */}
                {!isMobile && (
                  <>
                    <div className="absolute -top-8 -left-8 text-5xl text-blue-500 animate-float font-bold drop-shadow-xl">?</div>
                    <div className="absolute -top-6 -right-8 text-4xl text-blue-400 animate-float font-bold drop-shadow-xl" style={{ animationDelay: "0.5s" }}>?</div>
                    <div className="absolute top-16 -left-10 text-3xl text-blue-300 animate-float font-bold drop-shadow-lg" style={{ animationDelay: "1s" }}>?</div>
                    <div className="absolute bottom-16 -right-10 text-3xl text-blue-300 animate-float font-bold drop-shadow-lg" style={{ animationDelay: "1.5s" }}>?</div>
                  </>
                )}

                {/* ✅ Card "Bingung?" DIHILANGKAN sesuai permintaan */}
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOGO SECTION ================= */}
        <div className="mt-20 pt-10 border-t border-slate-200">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Dipercaya Oleh
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex w-max gap-1 sm:gap-2 animate-marquee will-change-transform">
              {[...logos, ...logos].map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 h-24 sm:w-56 sm:h-32 flex items-center justify-center px-3"
                >
                  <Image
                    src={src}
                    alt="Logo klien"
                    width={210}
                    height={120}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 640px) 160px, 220px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CSS (Optimized) ================= */}
      <style jsx>{`
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-14px) rotate(6deg); opacity: 0.7; }
        }

        .animate-marquee {
          animation: marquee 45s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
          will-change: transform;
        }

        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 32s;
          }
        }
      `}</style>
    </section>
  );
}
