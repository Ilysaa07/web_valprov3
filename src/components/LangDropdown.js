"use client";
import { useState, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LangDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('id');
  const [mounted, setMounted] = useState(false);

  const languages = [
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
  ];

  useEffect(() => {
    const init = async () => {
      setMounted(true);
    };

    init();
  }, []);

  // Cek bahasa saat ini dari Cookie
  useEffect(() => {
    const init = async () => {
      if (mounted) {
        const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const cookieVal = getCookie('googtrans');
        if (cookieVal) {
          const langCode = cookieVal.split('/')[2];
          if (langCode) setCurrentLang(langCode);
        }
      }
    };

    init();
  }, [mounted]);

  const changeLanguage = (langCode) => {
    // Update cookies using a side-effect friendly method
    const setCookie = (name, value, path = '/', domain = window.location.hostname) => {
      document.cookie = `${name}=${value}; path=${path}; domain=${domain}`;
    };

    setCookie('googtrans', `/id/${langCode}`);
    setCookie('googtrans', `/id/${langCode}`, '/'); // For backward compatibility

    setCurrentLang(langCode);
    setIsOpen(false);

    window.location.reload();
  };

  const activeLang = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative">
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-stone-100 hover:bg-white hover:shadow-md border border-transparent hover:border-stone-200 transition-all duration-300"
      >
        {mounted ? (
          <>
            <span className="text-lg">{activeLang.flag}</span>
            <span className="text-xs font-bold text-stone-600 uppercase hidden md:block">
              {activeLang.code}
            </span>
          </>
        ) : (
          <>
            <span className="text-lg">🇮🇩</span>
            <span className="text-xs font-bold text-stone-600 uppercase hidden md:block">
              ID
            </span>
          </>
        )}
        <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-fade-in-up">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 py-2 mb-1">Pilih Bahasa</p>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        currentLang === lang.code 
                        ? 'bg-[#2a3f9b] text-white shadow-md' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                    </div>
                    {currentLang === lang.code && <Check size={14} />}
                </button>
            ))}
            </div>
        </>
      )}
    </div>
  );
}