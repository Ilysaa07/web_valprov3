import { config, fields, collection } from '@keystatic/core';

// Cek apakah sedang di mode Production (Vercel) atau Development (Local)
const isProd = process.env.NODE_ENV === 'local';

export default config({
  // LOGIKA OTOMATIS:
  storage: isProd
    ? {
        kind: 'github',
        repo: {
          owner: 'ilysaa07', // Ganti nanti saat mau deploy
          name: 'NAMA_REPO_ANDA',
        },
      }
    : {
        kind: 'local', // <--- INI YANG AKTIF SEKARANG DI LAPTOP ANDA
      },

  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*', // File akan disimpan di sini
      format: { contentField: 'content' }, // Format Markdown dengan Frontmatter
      schema: {
        title: fields.slug({ name: { label: 'Judul Artikel' } }),
        excerpt: fields.text({ label: 'Deskripsi Singkat', multiline: true }),
        date: fields.date({ label: 'Tanggal Publish' }),
        category: fields.select({
          label: 'Kategori',
          options: [
            { label: 'Legalitas', value: 'Legalitas' },
            { label: 'Konstruksi', value: 'Konstruksi' },
            { label: 'Kelistrikan', value: 'Kelistrikan' },
            { label: 'Standar', value: 'Standar' },
            { label: 'Keuangan', value: 'Keuangan' },
          ],
          defaultValue: 'Legalitas',
        }),
        author: fields.text({ label: 'Penulis', defaultValue: 'Tim Valpro' }),
        authorRole: fields.text({ label: 'Jabatan Penulis', defaultValue: 'Legal Consultant' }),
        
        // Konfigurasi Gambar Local
        image: fields.image({
          label: 'Gambar Utama',
          directory: 'public/images/blog', 
          publicPath: '/images/blog/',
        }),
        authorImage: fields.image({
          label: 'Foto Penulis',
          directory: 'public/images/authors',
          publicPath: '/images/authors/',
        }),
        
        relatedService: fields.text({ label: 'Slug Layanan Terkait (Opsional)' }),
        content: fields.document({
          label: 'Isi Artikel',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/blog/content',
            publicPath: '/images/blog/content/',
          },
        }),
      },
    }),
  },
});