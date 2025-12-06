import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Enable edge runtime for Vercel Blob

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const access = formData.get('access') || 'public';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer for upload
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename with timestamp
    const originalFilename = file.name;
    const timestamp = Date.now();
    const extension = originalFilename.split('.').pop();
    const filename = `${timestamp}-${originalFilename}`;

    // Upload to Vercel Blob using your store
    const blob = await put(filename, buffer, {
      access: access,
      contentType: file.type,
      // For your specific store, you can customize options if needed
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: new Date().toISOString(),
      key: blob.key
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}