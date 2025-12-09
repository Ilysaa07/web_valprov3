"use client";

import { useState, useEffect } from 'react';
import { getWhatsappSettings } from '@/lib/whatsappSettings';
import { MessageCircle, ChevronRight } from 'lucide-react';

export default function WhatsAppButton({ serviceName, className = "" }) {
  const [whatsappNumber, setWhatsappNumber] = useState('6289518530306'); // Default value

  useEffect(() => {
    // Load WhatsApp number settings
    const loadWhatsappSettings = async () => {
      const settings = await getWhatsappSettings();
      setWhatsappNumber(settings.secondaryNumber || settings.mainNumber || '6289518530306');
    };
    
    loadWhatsappSettings();
  }, []);

  const createWhatsAppUrl = (number, message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${number}?text=${encodedMessage}`;
  };

  return (
    <a 
      href={createWhatsAppUrl(whatsappNumber, `Halo Tim Valpro, saya tertarik dengan layanan ${serviceName}`)}
      className={`group relative overflow-hidden bg-white text-[#2a3f9b] px-6 py-3.5 rounded-full font-bold hover:shadow-[0_10px_30px_-10px_rgba(30,64,175,0.3)] transition-all flex items-center gap-3 ${className}`}
    >
      {/* Shimmer Effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
      
      <MessageCircle size={24} className="text-[#2a3f9b]" />
      <div className="flex flex-col items-start leading-none">
         <span className="text-[10px] uppercase tracking-wider text-blue-200 font-medium mb-1">Respon Cepat</span>
         <span>Konsultasi Gratis</span>
      </div>
      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
    </a>
  );
}