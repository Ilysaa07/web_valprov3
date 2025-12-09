"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { MessageCircle, ArrowRight, Shield } from "lucide-react";
import { getWhatsappSettings, createWhatsAppUrl } from "@/lib/whatsappSettings";

/* ================== COMPONENT ================== */
export default function HeroModern({ city = null }) {
  const [whatsappNumber, setWhatsappNumber] = useState("6281399710085"); // Default value

  useEffect(() => {
    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.mainNumber || "6281399710085");
    };

    loadWhatsappSettings();
  }, []);

  const logos = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => `/images/logos/logo_klien/${i + 1}.png`),
    []
  );

  return (
    <section className="relative bg-[#F5F5F7] min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ================= LEFT ================= */}
          <div className="relative z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 mb-8">
              <div className="w-6 h-6 bg-[#110e60] rounded-full flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                Legalitas Profesional, Proses Mudah
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] mb-6 tracking-tight">
              Legalitas Usaha<br />
              Yang Membangun<br />
              <span className="text-[#110e60]">Kepercayaan</span>
            </h1>

            {/* Desc */}
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              Pengurusan dokumen legal end-to-end dengan transparansi penuh
              dan pendampingan di setiap tahap.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 mb-16">
              <a
                href={createWhatsAppUrl(
                  whatsappNumber,
                  "Halo, saya ingin berkonsultasi mengenai pendirian badan usaha"
                )}
                className="group inline-flex items-center justify-center gap-2 bg-[#110e60] hover:bg-[#0d0b4a] text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-[#110e60]/25"
              >
                <span>Konsultasi Gratis</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#layanan"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-slate-700 hover:bg-white/60 transition-all border border-slate-300 bg-white/40 backdrop-blur-sm"
              >
                Lihat Layanan
              </a>
            </div>

            {/* ================= LOGO MARQUEE (DIBESARKAN + TANPA HOVER) ================= */}
            <div className="relative mt-12">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Dipercaya Oleh
              </h3>

              <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F5F5F7] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F5F5F7] to-transparent z-10" />

                <div className="flex w-max gap-12 animate-marquee will-change-transform">
                  {[...logos, ...logos].map((src, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-40 h-24 bg-white rounded-2xl flex items-center justify-center p-5"
                    >
                      <img
                        src={src}
                        alt="Logo Klien"
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT ================= */}
          <div className="relative lg:h-[700px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#110e60]/20 via-transparent to-purple-500/10 blur-3xl" />

            <div className="relative w-[420px] h-[580px] bg-gradient-to-br from-slate-900 via-slate-800 to-[#110e60] rounded-[32px] shadow-2xl overflow-hidden p-6">

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    Testimoni Klien
                  </div>
                  <div className="text-white/60 text-xs">
                    Real feedback dari pelanggan kami
                  </div>
                </div>
              </div>

              {/* ✅ TESTIMONI KEMBALI */}
              <div className="space-y-4 overflow-y-auto h-[450px] scrollbar-hide">

                {[
                  {
                    name: "Budi Santoso",
                    company: "PT Maju Teknologi",
                    seed: "Budi",
                    text: "Proses pendirian PT saya cuma 6 hari! Dokumen lengkap semua, SK Kemenkumham langsung terbit. Tim sangat responsif via WA 👍",
                  },
                  {
                    name: "Siti Rahayu",
                    company: "PT Berkah Mandiri",
                    seed: "Siti",
                    text: "Awalnya bingung mau bikin CV atau PT. Konsultasinya detail banget, dijelasin sampai paham. Akhirnya pilih PT dan ga nyesel!",
                  },
                  {
                    name: "Andi Wijaya",
                    company: "CV Sejahtera Bersama",
                    seed: "Andi",
                    text: "Update progress setiap hari lewat WA, jadi tenang. Harga juga transparan, ga ada biaya tersembunyi. Recommended!",
                  },
                  {
                    name: "Dewi Lestari",
                    company: "PT Cahaya Prima",
                    seed: "Dewi",
                    text: "Pelayanan profesional! Semua dokumen diurus sampai selesai. NIB OSS juga langsung dapat. Worth it 💯",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seed}`}
                      className="w-9 h-9 rounded-full flex-shrink-0"
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4">
                        <div className="text-white/90 text-sm leading-relaxed">
                          {item.text}
                        </div>
                      </div>
                      <div className="text-white/40 text-xs mt-1 ml-1">
                        {item.name} • {item.company}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CSS ================= */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
