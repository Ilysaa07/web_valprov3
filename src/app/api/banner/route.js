import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// GET: Retrieve banner data
export async function GET(request) {
  try {
    const bannerRef = doc(db, "settings", "banner_settings");
    const bannerDoc = await getDoc(bannerRef);

    if (bannerDoc.exists()) {
      return NextResponse.json(bannerDoc.data());
    } else {
      // Return default banner data if none exist
      return NextResponse.json({
        imageUrl: '',
        active: false,
        title: 'Banner Advertisement'
      });
    }
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

// POST: Update banner data
export async function POST(request) {
  try {
    const { imageUrl, title, active } = await request.json();

    // Allow empty imageUrl for banner deletion
    const bannerRef = doc(db, "settings", "banner_settings");
    const bannerData = {
      imageUrl: imageUrl || '',
      title: title || 'Banner Advertisement',
      active: active !== undefined ? active : true,
      updatedAt: new Date().toISOString()
    };

    await setDoc(bannerRef, bannerData);

    return NextResponse.json({
      message: 'Banner updated successfully',
      ...bannerData
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}