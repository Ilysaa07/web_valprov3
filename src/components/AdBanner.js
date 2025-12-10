"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AdBanner = () => {
  const [bannerData, setBannerData] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [whatsappSettings, setWhatsappSettings] = useState({
    mainNumber: '6281399710085', // Default number
    messageTemplate: 'Halo, saya ingin bertanya tentang layanan Valpro...'
  });

  // Load banner data and WhatsApp settings from localStorage or API
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        // Load WhatsApp settings
        const settingsResponse = await fetch('/api/settings');
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          setWhatsappSettings(prev => ({
            ...prev,
            ...settings
          }));
        }

        // Load banner data
        const bannerResponse = await fetch('/api/banner');
        if (bannerResponse.ok) {
          const banner = await bannerResponse.json();
          if (banner && banner.imageUrl && banner.active) {
            setBannerData(banner);
            // Show banner after a short delay for better UX
            setTimeout(() => {
              setShowBanner(true);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error loading banner data:', error);
      }
    };

    loadBannerData();
  }, []);

  const handleBannerClick = () => {
    // Construct WhatsApp URL with the main number and message template, including banner title
    const phoneNumber = whatsappSettings.mainNumber || '6281399710085'; // Default number
    // Include the banner title in the message if available
    const bannerTitle = bannerData?.title || 'Banner Advertisement';
    const baseMessage = whatsappSettings.messageTemplate || 'Halo, saya ingin bertanya tentang layanan Valpro...';
    const message = encodeURIComponent(`${baseMessage} - ${bannerTitle}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner || !bannerData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div
          className="w-full h-auto cursor-pointer"
          onClick={handleBannerClick}
        >
          {bannerData.imageUrl ? (
            <img
              src={bannerData.imageUrl}
              alt="Advertisement Banner"
              className="w-full h-auto object-contain max-h-[80vh] max-w-full"
              style={{ maxHeight: '80vh' }}
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
              Banner Image Placeholder
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;