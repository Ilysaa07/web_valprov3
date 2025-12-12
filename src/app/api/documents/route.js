import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, arrayUnion } from 'firebase/firestore';

// GET: Retrieve all documents for the current user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const limitParam = searchParams.get('limit');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Simple query with only the userId filter to avoid index issues
    const documentsQuery = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(documentsQuery);

    let documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    // Sort by uploadedAt descending on the client side
    documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    // Filter by category on the client side if specified
    if (category && category !== 'all') {
      documents = documents.filter(doc => doc.category === category);
    }

    // Filter by clientId on the client side if specified
    const clientId = searchParams.get('clientId');
    if (clientId) {
      documents = documents.filter(doc => doc.clientId === clientId);
    }

    // Apply limit on the client side if specified
    if (limitParam) {
      documents = documents.slice(0, parseInt(limitParam));
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save or update a document in the repository
export async function POST(request) {
  try {
    const { userId, fileName, fileUrl, fileSize, fileType, category, relatedInvoice, tags, clientId } = await request.json();

    if (!userId || !fileName || !fileUrl) {
      return NextResponse.json({ error: 'User ID, file name, and file URL are required' }, { status: 400 });
    }

    // Create document object
    const documentData = {
      userId,
      fileName,
      fileUrl,
      fileSize: fileSize || 0,
      fileType: fileType || 'unknown',
      category: category || 'other',
      relatedInvoice: relatedInvoice || null,
      clientId: clientId || null,
      tags: tags || [],
      uploadedAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      isFavorite: false
    };

    // Generate a unique ID for the document
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const docRef = doc(db, 'documents', docId);

    await setDoc(docRef, documentData);

    return NextResponse.json({ 
      message: 'Document saved successfully', 
      documentId: docId,
      document: { id: docId, ...documentData }
    });
  } catch (error) {
    console.error('Error saving document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}