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
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0); // Track the currently selected service
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

  // Determine which logo to show based on the currently selected service
  const getLogoForService = (serviceSlug) => {
    switch(serviceSlug) {
      case 'pendirian-badan-usaha':
        return '/images/logos/kemenkumham.png';
      case 'izin-usaha-oss':
        return '/images/logos/djp.png';
      case 'sertifikasi-skk':
        return '/images/logos/pupr.jpg';
      case 'sbu-konstruksi':
        return '/images/logos/pupr.jpg';
      case 'sertifikasi-serkom':
        return '/images/logos/esdm.png';
      case 'sbu-jptl':
        return '/images/logos/esdm.png';
      case 'audit-keuangan':
      case 'pajak-umkm':
        return '/images/logos/djp.png';
      case 'sertifikasi-iso':
      default:
        return '/gedung.png'; // fallback to the original image
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Update selected service when pagination changes to ensure it stays within current page
  useEffect(() => {
    const updateSelection = async () => {
      // If the selected service is not on the current page, select the first service on the current page
      const firstServiceIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const lastServiceIndex = Math.min(currentPage * ITEMS_PER_PAGE - 1, services.length - 1);

      if (selectedServiceIndex < firstServiceIndex || selectedServiceIndex > lastServiceIndex) {
        // If the selected service is outside current page range, select the first service on the page
        if (firstServiceIndex < services.length) {
          setSelectedServiceIndex(firstServiceIndex);
        }
      }
    };

    updateSelection();
  }, [currentPage, services.length, selectedServiceIndex]);

  // Auto-rotate through services every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentServices.length > 0) {
        // Calculate the range of services on the current page
        const firstIndexOnPage = (currentPage - 1) * ITEMS_PER_PAGE;
        const lastIndexOnPage = Math.min(currentPage * ITEMS_PER_PAGE - 1, services.length - 1);

        // Find the next service index on the current page
        const nextIndex = selectedServiceIndex + 1;
        if (nextIndex > lastIndexOnPage) {
          // If we've reached the end of the page, go back to the first service on the page
          setSelectedServiceIndex(firstIndexOnPage);
        } else {
          // Otherwise, go to the next service
          setSelectedServiceIndex(nextIndex);
        }
      }
    }, 5000); // Change every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [selectedServiceIndex, currentPage, services.length, currentServices.length]);

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
  const { ref: headerRef, visible: headerVisible } = header;
  const { ref: gridRef, visible: gridVisible } = grid;

  return (
    <section 
      id="layanan" 
      className="py-20 md:py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mb-16 transition-all duration-1000 ease-out
          ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
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
          ref={gridRef}
          className={`grid lg:grid-cols-3 gap-8 items-start transition-all duration-1000 ease-out
          ${gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
        >
          {/* Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {currentServices.map((item, idx) => {
              const Icon = ICON_MAP[item.icon] || ICON_MAP.Default;
              const actualIndex = startIndex + idx;

              // Check if this service is currently selected
              const isSelected = selectedServiceIndex === actualIndex;

              return (
                <div
                  key={item.slug || actualIndex}
                  onClick={() => {
                    // Update selected service when clicked
                    setSelectedServiceIndex(actualIndex);
                  }}
                  className={`group block bg-white rounded-2xl p-7 border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isSelected
                      ? 'border-[color:var(--brand-color,#1e40af)] shadow-lg bg-[color:var(--brand-color,#1e40af)]/[.03]'
                      : 'border-slate-200 hover:border-[color:var(--brand-color,#1e40af)]'
                  }`}
                >
                  <Link href={`/layanan/${item.slug}`}>
                    <div className="flex items-start justify-between mb-5">
                      <span className={`text-sm font-semibold ${
                        isSelected ? 'text-[color:var(--brand-color,#1e40af)]' : 'text-slate-400'
                      }`}>
                        {(actualIndex + 1).toString().padStart(2, "0")}
                      </span>

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-[color:var(--brand-color,#1e40af)] text-white'
                          : 'bg-slate-50 text-slate-400 group-hover:bg-[color:var(--brand-color,#1e40af)] group-hover:text-white'
                      }`}>
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className={`text-base font-bold mb-3 leading-snug ${
                      isSelected ? 'text-[color:var(--brand-color,#1e40af)]' : 'text-slate-900'
                    }`}>
                      {item.title}
                    </h3>

                    <span className="text-sm font-semibold text-[color:var(--brand-color,#1e40af)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lihat Detail <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Decorative Logo Card with Trust-Building Description */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl h-full min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col">
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-blue-200/30"></div>
            <div className="absolute top-8 right-6 w-6 h-6 rounded-full bg-indigo-200/30"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 rounded-full bg-indigo-300/30"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-300/30"></div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              {/* Determine which logo to show based on the currently selected service */}
              {currentServices.length > 0 && selectedServiceIndex < services.length && (
                <>
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-slate-200/50">
                    <Image
                      src={getLogoForService(services[selectedServiceIndex]?.slug)}
                      alt="Logo layanan profesional"
                      width={200}
                      height={200}
                      className="object-contain max-h-[150px] w-auto"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
                    {services[selectedServiceIndex]?.title}
                  </h3>
                  <p className="text-slate-600 text-center text-sm leading-relaxed max-w-xs mb-4">
                    {services[selectedServiceIndex]?.shortDesc}
                  </p>

                  {/* Trust indicators */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 w-full max-w-xs">
                    <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Prosedur Resmi & Terpercaya
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {services[selectedServiceIndex]?.slug === 'pendirian-badan-usaha' && (
                        <>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Proses melalui Notaris Terdaftar</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Verifikasi Kemenkumham Resmi</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Legalitas Diakui Hukum</span>
                          </li>
                        </>
                      )}
                      {services[selectedServiceIndex]?.slug === 'izin-usaha-oss' && (
                        <>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Platform OSS RBA Resmi Pemerintah</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>NPWP Terdaftar di DJP</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Izin Berlaku Nasional</span>
                          </li>
                        </>
                      )}
                      {(services[selectedServiceIndex]?.slug === 'sertifikasi-skk' || services[selectedServiceIndex]?.slug === 'sbu-konstruksi') && (
                        <>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Terdaftar di LPJK</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Standar Kompetensi Nasional</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Diakui dalam Proyek Pemerintah</span>
                          </li>
                        </>
                      )}
                      {(services[selectedServiceIndex]?.slug === 'sertifikasi-serkom' || services[selectedServiceIndex]?.slug === 'sbu-jptl') && (
                        <>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Sertifikasi dari ESDM</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Standar Keselamatan Nasional</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Mandatory untuk Tenaga Listrik</span>
                          </li>
                        </>
                      )}
                      {(services[selectedServiceIndex]?.slug === 'audit-keuangan' || services[selectedServiceIndex]?.slug === 'pajak-umkm') && (
                        <>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Akuntan Publik Bersertifikat</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Standar PSAK & Internasional</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Valid untuk Lembaga Keuangan</span>
                          </li>
                        </>
                      )}
                      {(services[selectedServiceIndex]?.slug === 'sertifikasi-iso') && (
                        <>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Sertifikasi Internasional terakreditasi</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Standar Manajemen Tertinggi</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Diakui Global</span>
                          </li>
                        </>
                      )}
                      {(services[selectedServiceIndex]?.slug !== 'pendirian-badan-usaha' &&
                        services[selectedServiceIndex]?.slug !== 'izin-usaha-oss' &&
                        services[selectedServiceIndex]?.slug !== 'sertifikasi-skk' &&
                        services[selectedServiceIndex]?.slug !== 'sbu-konstruksi' &&
                        services[selectedServiceIndex]?.slug !== 'sertifikasi-serkom' &&
                        services[selectedServiceIndex]?.slug !== 'sbu-jptl' &&
                        services[selectedServiceIndex]?.slug !== 'audit-keuangan' &&
                        services[selectedServiceIndex]?.slug !== 'pajak-umkm' &&
                        services[selectedServiceIndex]?.slug !== 'sertifikasi-iso') && (
                        <>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Proses Resmi & Sesuai Regulasi</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Pelaksana Bersertifikat</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>Legalitas Diakui Hukum</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </>
              )}
              {/* Fallback image if no services are available or index is out of bounds */}
              {(currentServices.length === 0 || selectedServiceIndex >= services.length) && (
                <>
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-slate-200/50">
                    <Image
                      src="/gedung.png"
                      alt="Layanan profesional"
                      width={200}
                      height={200}
                      className="object-contain max-h-[150px] w-auto"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
                    Layanan Profesional
                  </h3>
                  <p className="text-slate-600 text-center text-sm leading-relaxed max-w-xs mb-4">
                    Pilih layanan untuk melihat logo yang relevan
                  </p>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 w-full max-w-xs">
                    <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Keunggulan Layanan Kami
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-1">✓</span>
                        <span>Proses Cepat & Profesional</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-1">✓</span>
                        <span>Legalitas Diakui Hukum</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-1">✓</span>
                        <span>Tim Ahli Berpengalaman</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Decorative elements at bottom */}
            <div className="relative z-10 mt-6 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
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