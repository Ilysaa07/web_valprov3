import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Get current WhatsApp settings from Firestore
export const getWhatsappSettings = async () => {
  try {
    const settingsRef = doc(db, "settings", "whatsapp_settings");
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      return settingsDoc.data();
    } else {
      // Return default values if no settings exist
      return {
        mainNumber: '6281399710085',
        secondaryNumber: '6289518530306',
        messageTemplate: 'Halo, saya ingin bertanya tentang layanan Valpro...'
      };
    }
  } catch (error) {
    console.error("Error fetching WhatsApp settings:", error);
    // Return default values on error
    return {
      mainNumber: '6281399710085',
      secondaryNumber: '6289518530306',
      messageTemplate: 'Halo, saya ingin bertanya tentang layanan Valpro...'
    };
  }
};

// Helper function to create WhatsApp URL
export const createWhatsAppUrl = (phoneNumber, message = '') => {
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${phoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};