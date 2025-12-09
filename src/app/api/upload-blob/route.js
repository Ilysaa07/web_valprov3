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

    // Check if the required environment variable is set for Vercel Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN === 'your_blob_token_here') {
      // Fallback for local development - simulate upload with local URL
      // In production, you should properly configure Vercel Blob
      console.warn('BLOB_READ_WRITE_TOKEN not configured. Using fallback for local development.');
      return NextResponse.json({
        url: `/uploads/${filename}`, // Local fallback URL
        pathname: `/uploads/${filename}`,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        key: filename,
        fallback: true // Indicate this is a fallback response
      });
    }

    // Upload to Vercel Blob using the official method
    const blob = await put(filename, buffer, {
      access: access,
      contentType: file.type,
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