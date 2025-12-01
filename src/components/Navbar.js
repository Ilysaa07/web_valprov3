"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, X, ChevronDown, 
  Phone, Mail, Clock, ShieldCheck, 
  BookOpen, Calculator, Tag, FileText, ArrowRight,
  Instagram, Facebook, Linkedin, 
  CalendarCheck, BookA, HelpCircle, Coins, Package,
  Briefcase, HardHat, Zap, Award
} from 'lucide-react';
import { servicesData } from '@/lib/servicesData';

import LangDropdown from './LangDropdown';

const iconMap = {
  Briefcase,
  FileText,
  HardHat,
  Zap,
  Award,
  Calculator,
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(prev => {
        if (prev !== isScrolled) return isScrolled;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = useMemo(() => {
    const baseClasses = "fixed w-full z-50 transition-all duration-300 ease-in-out";
    if (mounted && scrolled) {
      return `${baseClasses} bg-white/95 shadow-sm py-3 top-0 border-b border-stone-100 backdrop-blur-sm`;
    }
    return `${baseClasses} bg-white py-5 top-0 lg:top-[34px]`;
  }, [mounted, scrolled]);

  const groupedServices = useMemo(() => ({
    "Legalitas & Izin": servicesData.filter(s => s.category === "Legal" || s.category === "Legalitas"),
    "Sektor Konstruksi": servicesData.filter(s => s.category === "Konstruksi"),
    "Kelistrikan & Energi": servicesData.filter(s => s.category === "Kelistrikan"),
    "Keuangan & Standar": servicesData.filter(s => s.category === "Keuangan" || s.category === "Standar"),
  }), []);

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={16} /> : null;
  };

  return (
    <>
      <div className="hidden lg:block bg-[#0f172a] text-stone-300 text-[11px] font-medium py-2 relative z-[60]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
             <a href="mailto:mail@valprointertech.com" className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={12}/> mail@valprointertech.com</a>
             <a href="tel:+6281399710085" className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={12}/> +62 813-9971-0085</a>
             <div className="w-px h-4 bg-stone-700"></div>
             <div className="flex items-center gap-4">
                 <a href="#" aria-label="Instagram" className="text-stone-400 hover:text-white transition-colors"><Instagram size={14} /></a>
                 <a href="#" aria-label="Facebook" className="text-stone-400 hover:text-white transition-colors"><Facebook size={14} /></a>
                 <a href="#" aria-label="LinkedIn" className="text-stone-400 hover:text-white transition-colors"><Linkedin size={14} /></a>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Clock size={12} className="text-[#3b82f6]" />
             <span>Senin - Jumat, 09:00 - 17:00 WIB</span>
          </div>
        </div>
      </div>

      <nav className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          <Link href="/" className="text-2xl font-bold text-stone-900 tracking-tight z-50 flex items-center gap-1 group/logo">
             <div className="rounded-lg flex items-center justify-center text-white transition-transform">
               <Image
                 src="/logometa.svg"
                 alt="Valpro Intertech Logo"
                 width={40}
                 height={40} 
                 priority
               />
             </div>
             <span className="text-xl font-semibold">
               Valpro
               <span className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent ml-0.5">
                 Intertech
               </span>.
             </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-stone-600 font-medium hover:text-[#1e40af] text-[13px] transition-colors rounded-full hover:bg-stone-50">Beranda</Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1 px-4 py-2 text-[13px] font-medium transition-all duration-200 rounded-full ${dropdownOpen ? 'text-[#1e40af] bg-stone-50' : 'text-stone-600 hover:text-[#1e40af] hover:bg-stone-50'}`}>
                Layanan <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full -left-48 w-[900px] bg-white rounded-3xl shadow-xl border border-stone-100 p-2 transition-all duration-200 origin-top-left overflow-hidden z-50 ${dropdownOpen ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-6 invisible pointer-events-none'}`}>
                 <div className="flex">
                    <div className="flex-1 p-6 grid grid-cols-2 gap-x-8 gap-y-6">
                      {Object.entries(groupedServices).map(([catName, items]) => (
                        <div key={catName}>
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 border-b border-stone-100 pb-1">{catName}</h4>
                          <div className="space-y-1">
                            {items.map((item, idx) => (
                              <Link key={item.slug || idx} href={`/layanan/${item.slug}`} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-stone-50 transition-colors group/item">
                                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-500 group-hover/item:bg-stone-200 flex items-center justify-center transition-colors duration-200 shrink-0">
                                    {renderIcon(item.icon)}
                                  </div>
                                  <div>
                                    <span className="block text-sm font-semibold text-stone-700 group-hover/item:text-[#1e40af] transition-colors">{item.title}</span>
                                    <span className="block text-[10px] text-stone-400 line-clamp-1 group-hover/item:text-stone-500">{item.shortDesc}</span>
                                  </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="w-[250px] bg-stone-50 p-6 flex flex-col justify-between border-l border-stone-100 shrink-0">
                        <div>
                            <h4 className="font-bold text-stone-900 mb-2">Butuh Bantuan?</h4>
                            <p className="text-xs text-stone-500 mb-4">Konsultasikan kebutuhan bisnis Anda.</p>
                        </div>
                        <Link href="https://wa.me/6281399710085" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95">
                            <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={16} height={16}/> Chat Admin
                        </Link>
                    </div>
                 </div>
              </div>
            </div>

            <div 
              className="relative group"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className={`flex items-center gap-1 px-4 py-2 text-[13px] font-medium transition-all duration-200 rounded-full ${toolsOpen ? 'text-[#1e40af] bg-stone-50' : 'text-stone-600 hover:text-[#1e40af] hover:bg-stone-50'}`}>
                Alat Bantu <ChevronDown size={14} className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute top-full -left-20 w-[600px] bg-white rounded-3xl shadow-xl border border-stone-100 p-6 transition-all duration-200 origin-top-left overflow-hidden z-50 ${toolsOpen ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-6 invisible pointer-events-none'}`}>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-2">Legalitas & Izin</p>
                        
                        <Link href="/kbli" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition group">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#1e40af] group-hover:bg-[#1e40af] group-hover:text-white transition"><BookOpen size={18}/></div>
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

                 <div className="mt-4 pt-4 border-t border-stone-100">
                    <Link href="/cek-status" className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-stone-200 text-stone-600 group-hover:border-[#3b82f6] group-hover:text-[#1e40af] transition"><Package size={18}/></div>
                            <div><span className="block text-sm font-bold text-stone-800">Cek Status Berkas</span><span className="text-[10px] text-stone-400">Sudah jadi klien? Lacak dokumen di sini</span></div>
                        </div>
                        <ArrowRight size={16} className="text-stone-400 group-hover:text-[#1e40af] transition-transform group-hover:translate-x-1"/>
                    </Link>
                 </div>
              </div>
            </div>

            <Link href="/blog" className="px-4 py-2 text-stone-600 font-medium hover:text-[#1e40af] text-[13px] transition-colors rounded-full hover:bg-stone-50">Wawasan</Link>
            <Link href="/#tentang" className="px-4 py-2 text-stone-600 font-medium hover:text-[#1e40af] text-[13px] transition-colors rounded-full hover:bg-stone-50">Tentang Kami</Link>

            <div className="w-px h-6 bg-stone-200 mx-2"></div>
            <LangDropdown />
          </div>

          <div className="hidden md:block ml-4">
            <Link href="https://wa.me/6281399710085" className="text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 hover:-translate-y-0.5 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] active:scale-95">
               Konsultasi <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
              <LangDropdown />
              <button 
                className="text-stone-800 p-2 rounded-lg hover:bg-stone-100 transition-colors" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-stone-100 p-6 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-5 duration-200">
            <Link href="/" onClick={() => setIsOpen(false)} className="font-medium text-stone-700 text-lg">Beranda</Link>
            
            <div className="space-y-3 pt-2 border-t border-stone-100">
               <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Layanan</p>
               {Object.entries(groupedServices).map(([catName, items]) => (
                  <div key={catName}>
                     <p className="text-xs font-bold text-[#1e40af] mt-3 mb-2">{catName}</p>
                     {items.map((item, idx) => (
                        <Link key={idx} href={`/layanan/${item.slug}`} onClick={() => setIsOpen(false)} className="block py-1.5 pl-2 text-sm font-medium text-stone-600 border-l-2 border-stone-100 hover:border-[#3b82f6] hover:text-[#1e40af] transition-colors">
                          {item.title}
                        </Link>
                     ))}
                  </div>
               ))}
            </div>
            
            <div className="space-y-3 pt-2 border-t border-stone-100">
               <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Alat Bantu</p>
               
               <Link href="/kbli" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><BookOpen size={16}/> Cek KBLI 2020</Link>
               <Link href="/cek-merek" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><Tag size={16}/> Cek Kelas Merek</Link>
               <Link href="/cek-nama-pt" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><ShieldCheck size={16}/> Cek Nama PT</Link>
               <Link href="/kuis-legalitas" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><HelpCircle size={16}/> Kuis Badan Usaha</Link>
               
               <div className="my-2 border-t border-stone-50"></div>
               
               <Link href="/kalkulator-pajak" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><Calculator size={16}/> Kalkulator Pajak</Link>
               <Link href="/simulasi-biaya" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><Coins size={16}/> Simulasi Biaya</Link>
               <Link href="/buat-surat" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><FileText size={16}/> Buat Surat MoU</Link>
               <Link href="/kalender-bisnis" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><CalendarCheck size={16}/> Kalender Bisnis</Link>
               <Link href="/kamus" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-stone-600 font-medium py-1 hover:text-[#1e40af]"><BookA size={16}/> Kamus Istilah</Link>
               
               <div className="my-2 border-t border-stone-50"></div>
               
               <Link href="/cek-status" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-[#1e40af] font-bold py-1"><Package size={16}/> Cek Status Berkas</Link>
            </div>

            <Link href="/blog" onClick={() => setIsOpen(false)} className="font-medium text-stone-700">Wawasan</Link>
            <Link href="https://wa.me/6281399710085" className="w-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white py-4 rounded-xl text-center font-bold mt-4 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={16} height={16}/> Chat WhatsApp Sekarang
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}