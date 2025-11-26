import { config as createConfig, fields, collection } from '@keystatic/core';

// PERBAIKAN LOGIKA:
// Jika Development (Laptop) -> Local
// Jika Production (Vercel) -> GitHub
const storageConfig = process.env.NODE_ENV === 'development' 
  ? { kind: 'local' } 
  : { 
      kind: 'github', 
      repo: { 
        owner: 'Ilysaa07', 
        name: 'web_valprov3' 
      } 
    };

export const keystaticConfig = createConfig({
  storage: storageConfig,
  
  collections: {
    blog: collection({
       label: 'Blog',
       slugField: 'title',
       path: 'src/content/blog/*',
       format: { contentField: 'content' },
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
          authorRole: fields.text({ label: 'Jabatan', defaultValue: 'Legal Consultant' }),
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
          relatedService: fields.text({ label: 'Slug Layanan Terkait' }),
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
       }
    }),
  },
});