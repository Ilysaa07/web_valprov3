'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { getWhatsappSettings, createWhatsAppUrl } from '@/lib/whatsappSettings';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('6289518530306'); // Default value

  useEffect(() => {
    setIsMounted(true);

    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.secondaryNumber || settings.mainNumber || '6289518530306');
    };

    loadWhatsappSettings();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = 'Halo, saya ingin bertanya tentang layanan Valpro...';
    const whatsappUrl = createWhatsAppUrl(whatsappNumber, message);
    window.open(whatsappUrl, '_blank');
  };

  // Only render on client to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        title="Chat dengan kami di WhatsApp"
        aria-label="Chat dengan kami di WhatsApp"
      >
        <Image
          src="/whatsapp-icon.svg"
          alt="WhatsApp"
          width={24}
          height={24}
        />
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-fadeIn"
          title="Scroll ke atas"
          aria-label="Scroll ke atas"
        >
          <ArrowUp size={24} />
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}
