"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, X, ArrowRight, ChevronDown, 
  Phone, Mail, Clock, MessageCircle, ShieldCheck 
} from 'lucide-react';
import { servicesData } from '@/lib/servicesData';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const BRAND_HEX = "#2a3f9b";

  // Mengelompokkan Layanan
  const groupedServices = {
    "Legalitas & Izin": servicesData.filter(s => s.category === "Legal" || s.category === "Legalitas"),
    "Sektor Konstruksi": servicesData.filter(s => s.category === "Konstruksi"),
    "Kelistrikan & Energi": servicesData.filter(s => s.category === "Kelistrikan"),
    "Keuangan & Standar": servicesData.filter(s => s.category === "Keuangan" || s.category === "Standar"),
  };

  return (
    <>
    {/* --- TOP BAR --- */}
    <div className="hidden lg:block bg-[#0f172a] text-stone-300 text-[11px] font-medium py-2 relative z-[60]">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
           <a href="mailto:mail@valprointertech.com" className="flex items-center gap-2 hover:text-white transition"><Mail size={12}/> mail@valprointertech.com</a>
           <a href="tel:+6281399710085" className="flex items-center gap-2 hover:text-white transition"><Phone size={12}/> +62 813-9971-0085</a>
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
          
          {/* === MEGA MENU DROPDOWN === */}
          <div 
            className="relative group h-full"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition rounded-full ${dropdownOpen ? 'text-[#2a3f9b] bg-stone-50' : 'text-stone-600 hover:text-[#2a3f9b] hover:bg-stone-50'}`}>
              Layanan <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Container */}
            <div className={`absolute top-full -left-48 w-[900px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-100 p-2 transition-all duration-300 origin-top-left overflow-hidden ${dropdownOpen ? 'opacity-100 translate-y-2 visible' : 'opacity-0 translate-y-6 invisible'}`}>
               
               <div className="flex">
                  {/* KIRI: List Menu */}
                  <div className="flex-1 p-6 grid grid-cols-2 gap-x-8 gap-y-6">
                    {Object.entries(groupedServices).map(([catName, items]) => (
                      <div key={catName}>
                        <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 border-b border-stone-100 pb-1">{catName}</h4>
                        <div className="space-y-1">
                          {items.map((item, idx) => (
                            <Link 
                                key={idx} 
                                href={`/layanan/${item.slug}`}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition group/item"
                            >
                                {/* IKON: Diubah jadi Monokrom (Abu-abu) -> Brand Color saat Hover */}
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

                  {/* KANAN: Featured Panel */}
                  <div className="w-[280px] bg-stone-50 p-6 flex flex-col justify-between border-l border-stone-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#2a3f9b]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                     
                     <div>
                       <h4 className="font-bold text-stone-900 text-lg mb-2">Butuh Bantuan?</h4>
                       <p className="text-xs text-stone-500 leading-relaxed mb-4">
                         Konsultasikan kebutuhan bisnis Anda. Kami akan merekomendasikan paket yang paling efisien.
                       </p>
                       <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                            <ShieldCheck size={14} className="text-green-500"/> Garansi Resmi
                          </div>
                          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                             <Clock size={14} className="text-blue-500"/> Respon Cepat
                          </div>
                       </div>
                     </div>

                     <Link 
                       href="https://wa.me/6289518530306" 
                       className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[#2a3f9b] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/10 group/btn"
                     >
                       <MessageCircle size={16} /> Chat Admin
                       <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                     </Link>
                  </div>
               </div>

            </div>
          </div>

          <Link href="/#tentang" className="px-4 py-2 text-stone-600 font-medium hover:text-[#2a3f9b] text-sm transition rounded-full hover:bg-stone-50">Tentang Kami</Link>
          <Link href="/blog" className="px-4 py-2 text-stone-600 font-medium hover:text-[#2a3f9b] text-sm transition rounded-full hover:bg-stone-50">Blog</Link>
        </div>

        {/* CTA BUTTON */}
        <div className="hidden md:block">
          <Link 
            href="https://wa.me/6289518530306" 
            className="text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
            style={{ backgroundColor: BRAND_HEX }}
          >
            Konsultasi <ArrowRight size={16} />
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-stone-800 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-stone-100 p-6 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto">
          <Link href="/" onClick={() => setIsOpen(false)} className="font-medium text-stone-700 text-lg">Beranda</Link>
          
          <div className="space-y-4 pt-2">
             <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-widest border-b border-stone-100 pb-2">
               Pilihan Layanan
             </div>
             {Object.entries(groupedServices).map(([catName, items]) => (
                <div key={catName} className="space-y-2">
                   <p className="text-xs font-bold text-[#2a3f9b] mt-3">{catName}</p>
                   {items.map((item, idx) => (
                      <Link key={idx} href={`/layanan/${item.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2 group/mobile">
                        {/* Ikon Mobile juga dibuat konsisten */}
                        <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-500 group-hover/mobile:bg-[#2a3f9b] group-hover/mobile:text-white flex items-center justify-center transition-colors">
                           <div className="w-4 h-4">{item.icon}</div>
                        </div>
                        <span className="text-sm font-medium text-stone-600 group-hover/mobile:text-[#2a3f9b]">{item.title}</span>
                      </Link>
                   ))}
                </div>
             ))}
          </div>

          <Link href="/#tentang" onClick={() => setIsOpen(false)} className="font-medium text-stone-700 text-lg pt-2">Tentang Kami</Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} className="font-medium text-stone-700 text-lg">Blog</Link>
          <Link href="https://wa.me/6289518530306" className="w-full bg-[#2a3f9b] text-white py-4 rounded-xl text-center font-bold mt-4 shadow-lg">Chat WhatsApp Sekarang</Link>
        </div>
      )}
    </nav>
    </>
  );
}