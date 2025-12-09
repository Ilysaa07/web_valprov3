"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase, ArrowRight, Sparkles, PhoneCall,
  Scale, FileText, Building2, HardHat, Zap, ShieldCheck,
  Calculator, Gavel, ChevronLeft, ChevronRight
} from "lucide-react";
import { servicesData } from "@/lib/servicesData";
import { getWhatsappSettings, createWhatsAppUrl } from "@/lib/whatsappSettings";

const ICON_MAP = {
  Briefcase, Scale, FileText, Building2,
  HardHat, Zap, ShieldCheck, Calculator, Gavel,
  Default: Briefcase
};

const ITEMS_PER_PAGE = 6;

/* ---------------- Intersection Hooks --------------- */
function useRevealOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ---------------- Component --------------- */
export default function Services() {
  const [whatsappNumber, setWhatsappNumber] = useState("6281399710085");
  const [currentPage, setCurrentPage] = useState(1);
  const imageRef = useRef(null);

  useEffect(() => {
    getWhatsappSettings().then((settings) => {
      setWhatsappNumber(settings.mainNumber || "6281399710085");
    });
  }, []);

  const services = useMemo(() => servicesData, []);

  // Pagination logic
  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentServices = services.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  /* -------- Parallax for Image -------- */
  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      const offset = window.scrollY;
      imageRef.current.style.transform = `translateY(${offset * 0.04}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const header = useRevealOnScroll();
  const grid = useRevealOnScroll();

  return (
    <section 
      id="layanan" 
      className="py-20 md:py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          ref={header.ref}
          className={`max-w-3xl mb-16 transition-all duration-1000 ease-out
          ${header.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            <span className="text-[color:var(--brand-color,#1e40af)]">
              Layanan Terpercaya,
            </span>{" "}
            untuk berbagai kebutuhan Anda
          </h2>

          <Link
            href={createWhatsAppUrl(whatsappNumber)}
            className="inline-block mt-8 px-6 py-3 rounded-full bg-[color:var(--brand-color,#1e40af)] text-white text-sm font-semibold hover:brightness-110 transition shadow-lg"
          >
            Hubungi Kami
          </Link>
        </div>

        {/* Grid */}
        <div
          ref={grid.ref}
          className={`grid lg:grid-cols-3 gap-8 items-start transition-all duration-1000 ease-out
          ${grid.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
        >
          {/* Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {currentServices.map((item, idx) => {
              const Icon = ICON_MAP[item.icon] || ICON_MAP.Default;
              const actualIndex = startIndex + idx;

              return (
                <Link
                  key={item.slug || actualIndex}
                  href={`/layanan/${item.slug}`}
                  className="group block bg-white rounded-2xl p-7 border border-slate-200 hover:border-[color:var(--brand-color,#1e40af)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-sm font-semibold text-slate-400">
                      {(actualIndex + 1).toString().padStart(2, "0")}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[color:var(--brand-color,#1e40af)] group-hover:text-white transition">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <span className="text-sm font-semibold text-[color:var(--brand-color,#1e40af)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lihat Detail <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Parallax Image */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl h-full min-h-[400px] will-change-transform">
            <div
              ref={imageRef}
              className="absolute inset-0 will-change-transform transition-transform duration-200"
            >
              <Image
                src="/gedung.png"
                alt="Layanan profesional"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:border-[color:var(--brand-color,#1e40af)] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft size={20} className="text-slate-700" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold text-sm transition ${
                    currentPage === page
                      ? "bg-[color:var(--brand-color,#1e40af)] text-white"
                      : "border border-slate-200 text-slate-700 hover:border-[color:var(--brand-color,#1e40af)] hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:border-[color:var(--brand-color,#1e40af)] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight size={20} className="text-slate-700" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}