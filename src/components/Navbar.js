"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, X, ChevronDown, 
  Phone, Mail, Clock, MessageCircle, ShieldCheck, 
  BookOpen, Calculator, Tag, FileText, ArrowRight,
  Instagram, Facebook, Linkedin, 
  CalendarCheck, BookA, HelpCircle, Coins, Package
} from 'lucide-react';
import { servicesData } from '@/lib/servicesData';

// Import 2 Komponen Bahasa
import GoogleTranslateScript from './GoogleTranslateScript';
import LangDropdown from './LangDropdown';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const BRAND_HEX = "#2a3f9b";

  // Grouping Services Logic
  const groupedServices = {
    "Legalitas & Izin": servicesData.filter(s => s.category === "Legal" || s.category === "Legalitas"),
    "Sektor Konstruksi": servicesData.filter(s => s.category === "Konstruksi"),
    "Kelistrikan & Energi": servicesData.filter(s => s.category === "Kelistrikan"),
    "Keuangan & Standar": servicesData.filter(s => s.category === "Keuangan" || s.category === "Standar"),
  };

  return (
    <>
    {/* 1. LOAD SCRIPT GOOGLE (Invisible) */}
    <GoogleTranslateScript />

    {/* --- TOP BAR --- */}
    <div className="hidden lg:block bg-[#0f172a] text-stone-300 text-[11px] font-medium py-2 relative z-[60]">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
           <a href="mailto:mail@valprointertech.com" className="flex items-center gap-2 hover:text-white transition"><Mail size={12}/> mail@valprointertech.com</a>
           <a href="tel:+6281399710085" className="flex items-center gap-2 hover:text-white transition"><Phone size={12}/> +62 813-9971-0085</a>
           <div className="w-px h-4 bg-stone-700"></div>
           <div className="flex items-center gap-4">
                <a href="#" className="text-stone-400 hover:text-white transition"><Instagram size={14} /></a>
                <a href="#" className="text-stone-400 hover:text-white transition"><Facebook size={14} /></a>
                <a href="#" className="text-stone-400 hover:text-white transition"><Linkedin size={14} /></a>
            </div>
        </div>
        <div className="flex items-center gap-2">
           <Clock size={12} className="text-[#2a3f9b]" />
           <span>Senin - Jumat, 09:00 - 17:00 WIB</span>
        </div>
      </div>
    </div>

    {/* --- MAIN NAVBAR --- */}
    <nav className={`fixed w-full z-50 transition-all duration-300 font-sans ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 top-0 border-b border-stone-100' 
        : 'bg-white py-5 top-0 lg:top-[34px]' 
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold text-stone-900 tracking-tight z-50 flex items-center gap-1 group/logo">
           <div className="w-8 h-8 bg-[#2a3f9b] rounded-lg flex items-center justify-center text-white group-hover/logo:rotate-12 transition-transform">
             <ShieldCheck size={18} />
           </div>
           <span>Valpro<span style={{ color: BRAND_HEX }}>Intertech</span>.</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/" className="px-4 py-2 text-stone-600 font-medium hover:text-[#2a3f9b] text-sm transition rounded-full hover:bg-stone-50">Beranda</Link>
          
          {/* === MEGA MENU LAYANAN === */}
          <div 
            className="relative group h-full"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition rounded-full ${dropdownOpen ? 'text-[#2a3f9b] bg-stone-50' : 'text-stone-600 hover:text-[#2a3f9b] hover:bg-stone-50'}`}>
              Layanan <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`absolute top-full -left-48 w-[900px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-100 p-2 transition-all duration-300 origin-top-left overflow-hidden ${dropdownOpen ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-6 invisible'}`}>
               <div className="flex">
                  {/* List Menu */}
                  <div className="flex-1 p-6 grid grid-cols-2 gap-x-8 gap-y-6">
                    {Object.entries(groupedServices).map(([catName, items]) => (
                      <div key={catName}>
                        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 border-b border-stone-100 pb-1">{catName}</h4>
                        <div className="space-y-1">
                          {items.map((item, idx) => (
                            <Link key={idx} href={`/layanan/${item.slug}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition group/item">
                                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-500 group-hover/item:bg-[#2a3f9b] group-hover/item:text-white flex items-center justify-center transition-all duration-300">
                                  <div className="w-4 h-4">{item.icon}</div>
                                </div>
                                <div>
                                  <span className="block text-sm font-semibold text-stone-700 group-hover/item:text-[#2a3f9b] transition-colors">{item.title}</span>
                                  <span className="block text-[10px] text-stone-400 line-clamp-1 group-hover/item:text-stone-500">{item.shortDesc}</span>
                                </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Featured Panel */}
                  <div className="w-[250px] bg-stone-50 p-6 flex flex-col justify-between border-l border-stone-100">
                      <div>
                         <h4 className="font-bold text-stone-900 mb-2">Butuh Bantuan?</h4>
                         <p className="text-xs text-stone-500 mb-4">Konsultasikan kebutuhan bisnis Anda.</p>
                      </div>
                      <Link href="https://wa.me/6281399710085" className="flex items-center justify-center gap-2 w-full py-3 bg-[#2a3f9b] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                         <MessageCircle size={16} /> Chat Admin
                      </Link>
                  </div>
               </div>
            </div>
          </div>

          {/* === MEGA MENU ALAT BANTU (TOOLS) - UPDATED === */}
          <div 
            className="relative group h-full"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition rounded-full ${toolsOpen ? 'text-[#2a3f9b] bg-stone-50' : 'text-stone-600 hover:text-[#2a3f9b] hover:bg-stone-50'}`}>
              Alat Bantu <ChevronDown size={14} className={`transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Diperlebar untuk Grid 2 Kolom */}
            <div className={`absolute top-full -left-20 w-[600px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-100 p-6 transition-all duration-300 origin-top-left overflow-hidden ${toolsOpen ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-6 invisible'}`}>
               
               <div className="grid grid-cols-2 gap-4">
                  {/* Col 1: Legalitas & Perizinan */}
                  <div className="space-y-2">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-2">Legalitas & Izin</p>
                      
                      <Link href="/kbli" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-blue-50 rounded-lg text-[#2a3f9b] group-hover:bg-[#2a3f9b] group-hover:text-white transition"><BookOpen size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Cek KBLI 2020</span><span className="text-[10px] text-stone-400">Database Kode Usaha</span></div>
                      </Link>

                      <Link href="/cek-merek" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition"><Tag size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Cek Kelas Merek</span><span className="text-[10px] text-stone-400">Klasifikasi HAKI</span></div>
                      </Link>

                      <Link href="/cek-nama-pt" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition"><ShieldCheck size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Cek Nama PT</span><span className="text-[10px] text-stone-400">Validator Aturan Nama</span></div>
                      </Link>

                      <Link href="/kuis-legalitas" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition"><HelpCircle size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Kuis Badan Usaha</span><span className="text-[10px] text-stone-400">Cek PT vs CV</span></div>
                      </Link>
                  </div>

                  {/* Col 2: Bisnis & Keuangan */}
                  <div className="space-y-2">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-2">Bisnis & Keuangan</p>
                      
                      <Link href="/kalkulator-pajak" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition"><Calculator size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Kalkulator Pajak</span><span className="text-[10px] text-stone-400">Hitung PPh UMKM</span></div>
                      </Link>

                      <Link href="/simulasi-biaya" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition"><Coins size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Simulasi Biaya</span><span className="text-[10px] text-stone-400">Quotation Generator</span></div>
                      </Link>

                      <Link href="/buat-surat" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-rose-50 rounded-lg text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition"><FileText size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Buat Surat (MoU)</span><span className="text-[10px] text-stone-400">Generator Kontrak</span></div>
                      </Link>

                      <Link href="/kalender-bisnis" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition"><CalendarCheck size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Kalender Bisnis</span><span className="text-[10px] text-stone-400">Jadwal Pajak & Laporan</span></div>
                      </Link>

                      <Link href="/kamus" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                          <div className="p-2 bg-sky-50 rounded-lg text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition"><BookA size={18}/></div>
                          <div><span className="block text-sm font-bold text-stone-700">Kamus Istilah</span><span className="text-[10px] text-stone-400">Ensiklopedia Hukum</span></div>
                      </Link>
                  </div>
               </div>

               {/* Footer Tool (Status) */}
               <div className="mt-4 pt-4 border-t border-stone-100">
                  <Link href="/cek-status" className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition group">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg border border-stone-200 text-stone-600 group-hover:border-[#2a3f9b] group-hover:text-[#2a3f9b] transition"><Package size={18}/></div>
                         <div><span className="block text-sm font-bold text-stone-800">Cek Status Berkas</span><span className="text-[10px] text-stone-400">Sudah jadi klien? Lacak dokumen di sini</span></div>
                      </div>
                      <ArrowRight size={16} className="text-stone-400 group-hover:text-[#2a3f9b] transition-transform group-hover:translate-x-1"/>
                  </Link>
               </div>

            </div>
          </div>

          <Link href="/blog" className="px-4 py-2 text-stone-600 font-medium hover:text-[#2a3f9b] text-sm transition rounded-full hover:bg-stone-50">Wawasan</Link>
          <Link href="/#tentang" className="px-4 py-2 text-stone-600 font-medium hover:text-[#2a3f9b] text-sm transition rounded-full hover:bg-stone-50">Tentang Kami</Link>

          {/* SEPARATOR & LANGUAGE SWITCHER */}
          <div className="w-px h-6 bg-stone-200 mx-2"></div>
          <LangDropdown />

        </div>

        {/* CTA BUTTON */}
        <div className="hidden md:block ml-4">
          <Link href="https://wa.me/6281399710085" className="text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg flex items-center gap-2 hover:-translate-y-0.5" style={{ backgroundColor: BRAND_HEX }}>
            Konsultasi <ArrowRight size={16} />
          </Link>
        </div>

        {/* MOBILE TOGGLE & LANG */}
        <div className="flex items-center gap-3 md:hidden">
            <LangDropdown />
            <button className="text-stone-800 p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-stone-100 p-6 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto">
          <Link href="/" onClick={() => setIsOpen(false)} className="font-medium text-stone-700 text-lg">Beranda</Link>
          
          {/* Layanan Mobile */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
             <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Layanan</p>
             {Object.entries(groupedServices).map(([catName, items]) => (
                <div key={catName}>
                   <p className="text-xs font-bold text-[#2a3f9b] mt-3 mb-2">{catName}</p>
                   {items.map((item, idx) => (
                      <Link key={idx} href={`/layanan/${item.slug}`} onClick={() => setIsOpen(false)} className="block py-1.5 pl-2 text-sm font-medium text-stone-600 border-l-2 border-stone-100 hover:border-[#2a3f9b] hover:text-[#2a3f9b]">
                        {item.title}
                      </Link>
                   ))}
                </div>
             ))}
          </div>
          
          {/* Tools Mobile (UPDATED COMPLETE) */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
             <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Alat Bantu</p>
             
             <Link href="/kbli" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><BookOpen size={16}/> Cek KBLI 2020</Link>
             <Link href="/cek-merek" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><Tag size={16}/> Cek Kelas Merek</Link>
             <Link href="/cek-nama-pt" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><ShieldCheck size={16}/> Cek Nama PT</Link>
             <Link href="/kuis-legalitas" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><HelpCircle size={16}/> Kuis Badan Usaha</Link>
             
             <div className="my-2 border-t border-stone-50"></div>
             
             <Link href="/kalkulator-pajak" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><Calculator size={16}/> Kalkulator Pajak</Link>
             <Link href="/simulasi-biaya" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><Coins size={16}/> Simulasi Biaya</Link>
             <Link href="/buat-surat" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><FileText size={16}/> Buat Surat MoU</Link>
             <Link href="/kalender-bisnis" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><CalendarCheck size={16}/> Kalender Bisnis</Link>
             <Link href="/kamus" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1"><BookA size={16}/> Kamus Istilah</Link>
             
             <div className="my-2 border-t border-stone-50"></div>
             
             <Link href="/cek-status" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-[#2a3f9b] font-bold py-1"><Package size={16}/> Cek Status Berkas</Link>
          </div>

          <Link href="/blog" onClick={() => setIsOpen(false)} className="font-medium text-stone-700">Wawasan</Link>
          <Link href="https://wa.me/6281399710085" className="w-full bg-[#2a3f9b] text-white py-4 rounded-xl text-center font-bold mt-4 shadow-lg">Chat WhatsApp Sekarang</Link>
        </div>
      )}
    </nav>
    </>
  );
}