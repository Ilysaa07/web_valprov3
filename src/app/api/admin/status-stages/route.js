import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// GET: Retrieve status stages configuration
export async function GET() {
  try {
    const configRef = doc(db, 'config', 'statusStages');
    const configDoc = await getDoc(configRef);

    if (configDoc.exists()) {
      return NextResponse.json(configDoc.data());
    } else {
      // Return default configuration if not exists
      const defaultConfig = {
        stages: [
          {
            id: 'draft',
            name: 'Draft',
            steps: [
              { id: 'creation', name: 'Pembuatan Draft Invoice', order: 1, isActive: true },
              { id: 'waiting-payment', name: 'Menunggu Pembayaran', order: 2, isActive: true },
              { id: 'admin-process', name: 'Proses Administrasi', order: 3, isActive: true },
              { id: 'document-work', name: 'Pengerjaan Dokumen', order: 4, isActive: true },
              { id: 'delivery', name: 'Serah Terima', order: 5, isActive: true }
            ]
          },
          {
            id: 'sent',
            name: 'Dikirim',
            steps: [
              { id: 'creation', name: 'Pembuatan Draft Invoice', order: 1, isActive: true },
              { id: 'invoice-sent', name: 'Invoice Dikirim', order: 2, isActive: true },
              { id: 'waiting-payment', name: 'Menunggu Pembayaran', order: 3, isActive: true },
              { id: 'admin-process', name: 'Proses Administrasi', order: 4, isActive: true },
              { id: 'document-work', name: 'Pengerjaan Dokumen', order: 5, isActive: true },
              { id: 'delivery', name: 'Serah Terima', order: 6, isActive: true }
            ]
          },
          {
            id: 'paid',
            name: 'Lunas',
            steps: [
              { id: 'creation', name: 'Pembuatan Draft Invoice', order: 1, isActive: true },
              { id: 'invoice-sent', name: 'Invoice Dikirim', order: 2, isActive: true },
              { id: 'payment-received', name: 'Pembayaran Diterima', order: 3, isActive: true },
              { id: 'admin-process', name: 'Proses Administrasi', order: 4, isActive: true },
              { id: 'document-work', name: 'Pengerjaan Dokumen', order: 5, isActive: true },
              { id: 'delivery', name: 'Serah Terima', order: 6, isActive: true }
            ]
          },
          {
            id: 'partial',
            name: 'Dibayar Sebagian',
            steps: [
              { id: 'creation', name: 'Pembuatan Draft Invoice', order: 1, isActive: true },
              { id: 'invoice-sent', name: 'Invoice Dikirim', order: 2, isActive: true },
              { id: 'partial-payment', name: 'Pembayaran Sebagian', order: 3, isActive: true },
              { id: 'waiting-balance', name: 'Menunggu Pelunasan', order: 4, isActive: true },
              { id: 'admin-process', name: 'Proses Administrasi', order: 5, isActive: true },
              { id: 'document-work', name: 'Pengerjaan Dokumen', order: 6, isActive: true }
            ]
          },
          {
            id: 'overdue',
            name: 'Terlambat Pembayaran',
            steps: [
              { id: 'creation', name: 'Pembuatan Draft Invoice', order: 1, isActive: true },
              { id: 'invoice-sent', name: 'Invoice Dikirim', order: 2, isActive: true },
              { id: 'due-date-passed', name: 'Jatuh Tempo Pembayaran', order: 3, isActive: true },
              { id: 'overdue-payment', name: 'Menunggu Pembayaran', order: 4, isActive: true },
              { id: 'admin-process', name: 'Proses Administrasi', order: 5, isActive: true },
              { id: 'document-work', name: 'Pengerjaan Dokumen', order: 6, isActive: true }
            ]
          },
          {
            id: 'cancelled',
            name: 'Dibatalkan',
            steps: [
              { id: 'creation', name: 'Pembuatan Draft Invoice', order: 1, isActive: true },
              { id: 'invoice-cancelled', name: 'Invoice Dibatalkan', order: 2, isActive: true },
              { id: 'process-cancelled', name: 'Proses Dibatalkan', order: 3, isActive: true },
              { id: 'admin-process', name: '-', order: 4, isActive: false },
              { id: 'document-work', name: '-', order: 5, isActive: false },
              { id: 'delivery', name: '-', order: 6, isActive: false }
            ]
          }
        ],
        updatedAt: new Date().toISOString()
      };
      return NextResponse.json(defaultConfig);
    }
  } catch (error) {
    console.error('Error fetching status stages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update status stages configuration
export async function PUT(request) {
  try {
    const configRef = doc(db, 'config', 'statusStages');
    const data = await request.json();

    // Update the configuration in Firestore
    await setDoc(configRef, {
      stages: data.stages,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ message: 'Status stages updated successfully' });
  } catch (error) {
    console.error('Error updating status stages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}