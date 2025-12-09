import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { invoiceId, fileId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Get the invoice document
    const invoiceRef = doc(db, 'invoices', invoiceId);
    const invoiceSnap = await getDoc(invoiceRef);

    if (!invoiceSnap.exists()) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoiceData = invoiceSnap.data();

    // Track the download in a separate field without changing the core status
    await updateDoc(invoiceRef, {
      lastDownloadAt: new Date().toISOString(),
      downloadHistory: arrayUnion({
        fileId: fileId || 'unknown',
        downloadedAt: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || 'unknown'
      }),
      isDelivered: true, // Mark that delivery has been completed (document downloaded)
      deliveryCompletedAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'Download tracked successfully',
      downloadTracked: true
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}