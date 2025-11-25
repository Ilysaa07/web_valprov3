import { Briefcase, HardHat, Zap, Award, FileText, Calculator } from 'lucide-react';

export const servicesData = [
  // --- LEGAL ---
  {
    slug: "pendirian-badan-usaha",
    category: "Legalitas",
    title: "Pendirian Badan Usaha (PT/CV)",
    shortDesc: "Pendirian PT, CV, Yayasan lengkap.",
    desc: "Layanan pendirian badan usaha terima beres. Kami mengurus pengecekan nama, Akta Notaris, SK Kemenkumham, hingga NPWP dan NIB perusahaan Anda.",
    icon: <Briefcase />, 
    // Gambar: Meeting kantor profesional
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
    features: ["Pengecekan Nama PT", "Akta Notaris", "SK Kemenkumham", "NPWP & SKT Pajak", "NIB OSS RBA"],
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    slug: "izin-usaha-oss",
    category: "Legalitas",
    title: "Pengurusan NPWP & OSS",
    shortDesc: "Izin berusaha & perpajakan.",
    desc: "Solusi kilat untuk kebutuhan izin dasar. Kami bantu registrasi akun OSS RBA, migrasi data lama, hingga pelaporan pajak pertama.",
    icon: <FileText />,
    // Gambar: Dokumen dan laptop
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2340&auto=format&fit=crop",
    features: ["Registrasi Akun OSS", "Migrasi OSS 1.1 ke RBA", "NPWP Badan/Pribadi", "Laporan LKPM"],
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },

  // --- KONSTRUKSI ---
  {
    slug: "sertifikasi-skk",
    category: "Konstruksi",
    title: "Sertifikasi SKK Konstruksi",
    shortDesc: "Sertifikat Tenaga Ahli (SKA).",
    desc: "Sertifikat Kompetensi Kerja (SKK) untuk tenaga ahli sipil, arsitektur, dan mekanikal. Wajib untuk TKK yang menjabat di proyek.",
    icon: <HardHat />,
    // Gambar: Insinyur di lapangan
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2340&auto=format&fit=crop",
    features: ["Jenjang 1 - 9", "Proses Asesmen Cepat", "Terdaftar di LPJK"],
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    slug: "sbu-konstruksi",
    category: "Konstruksi",
    title: "Sertifikasi SBU Konstruksi",
    shortDesc: "Legalitas Badan Usaha Jasa.",
    desc: "Pengurusan Sertifikat Badan Usaha (SBU) Konstruksi agar perusahaan Anda bisa mengikuti tender pemerintah maupun swasta.",
    icon: <HardHat />,
    // Gambar: Gedung sedang dibangun / Crane
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2340&auto=format&fit=crop",
    features: ["Kualifikasi Kecil - Besar", "Anggota Asosiasi", "ISO Terintegrasi"],
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },

  // --- KELISTRIKAN ---
  {
    slug: "sertifikasi-serkom",
    category: "Kelistrikan",
    title: "Sertifikasi Serkom / SKKTK",
    shortDesc: "Kompetensi Tenaga Listrik.",
    desc: "Sertifikasi wajib bagi tenaga teknik yang bekerja di bidang pembangkitan, transmisi, dan distribusi tenaga listrik.",
    icon: <Zap />,
    // Gambar: Panel Listrik / Teknisi
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2338&auto=format&fit=crop",
    features: ["Sertifikasi DJK ESDM", "Uji Kompetensi Online", "Masa Berlaku 5 Tahun"],
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    slug: "sbu-jptl",
    category: "Kelistrikan",
    title: "Sertifikasi SBU JPTL",
    shortDesc: "Izin Penunjang Listrik.",
    desc: "Legalitas untuk badan usaha yang bergerak di bidang jasa penunjang tenaga listrik (Pembangkit/Transmisi).",
    icon: <Zap />,
    // Gambar: Sutet / Transmisi Listrik
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2340&auto=format&fit=crop",
    features: ["Izin Usaha (IUJPTL)", "Penanggung Jawab Teknik", "Akreditasi Resmi"],
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },

  // --- STANDAR & KEUANGAN ---
  {
    slug: "sertifikasi-iso",
    category: "Standar",
    title: "Sertifikasi ISO",
    shortDesc: "Manajemen Mutu Internasional.",
    desc: "Tingkatkan kredibilitas bisnis di mata klien global dengan standar manajemen ISO yang terakreditasi.",
    icon: <Award />,
    // Gambar: Quality Control / Standard
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2340&auto=format&fit=crop",
    features: ["ISO 9001 (Mutu)", "ISO 14001 (Lingkungan)", "ISO 45001 (K3)"],
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    slug: "audit-keuangan",
    category: "Keuangan",
    title: "Audit & Laporan Keuangan",
    shortDesc: "Audit independen & PSAK.",
    desc: "Jasa audit laporan keuangan oleh akuntan publik resmi untuk keperluan tender, perbankan, atau RUPS.",
    icon: <Calculator />,
    // Gambar: Calculator / Finance
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2340&auto=format&fit=crop",
    features: ["Opini Auditor WTP", "Laporan Fiskal", "Kantor Akuntan Publik (KAP)"],
    color: "text-rose-600",
    bgColor: "bg-rose-50"
  },
  {
    slug: "pajak-umkm",
    category: "Keuangan",
    title: "Konsultasi Pajak UMKM",
    shortDesc: "Lapor SPT & EFIN.",
    desc: "Bimbingan perpajakan lengkap bagi UMKM agar administrasi rapi dan terhindar dari denda pajak.",
    icon: <Calculator />,
    // Gambar: Uang Rupiah / Tax
    image: "https://images.unsplash.com/photo-1593510987046-1f8fcfc517a0?q=80&w=2340&auto=format&fit=crop",
    features: ["Pembuatan NPWP", "Lapor SPT Tahunan", "Konsultasi Tax Amnesty"],
    color: "text-rose-600",
    bgColor: "bg-rose-50"
  }
];