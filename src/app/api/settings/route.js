import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// GET: Retrieve WhatsApp settings
export async function GET(request) {
  try {
    const settingsRef = doc(db, "settings", "whatsapp_settings");
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      return NextResponse.json(settingsDoc.data());
    } else {
      // Return default settings if none exist
      return NextResponse.json({
        mainNumber: '6281399710085',
        secondaryNumber: '6289518530306',
        messageTemplate: 'Halo, saya ingin bertanya tentang layanan Valpro...'
      });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}