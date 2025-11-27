import { client } from './contentful';

// Helper untuk format data dari Contentful agar cocok dengan UI kita
const parseContentfulPost = (item) => {
  const fields = item.fields;
  return {
    slug: fields.slug,
    title: fields.title,
    excerpt: fields.excerpt,
    category: fields.category,
    date: fields.date ? new Date(fields.date).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    }) : "",
    author: fields.author,
    authorRole: fields.authorRole,
    // Ambil URL gambar (tambah https:)
    image: fields.image?.fields?.file?.url ? `https:${fields.image.fields.file.url}` : null,
    authorImage: fields.authorImage?.fields?.file?.url ? `https:${fields.authorImage.fields.file.url}` : null,
    relatedService: fields.relatedService,
    content: fields.content, // Ini format Rich Text khusus Contentful
  };
};

// 1. Ambil SEMUA Artikel
export async function getSortedPostsData() {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost', // Sesuai ID di Contentful tadi
      order: '-fields.date',    // Urutkan dari yang terbaru
    });

    if (!response || !response.items || !Array.isArray(response.items)) {
      console.warn('Contentful API returned invalid response or no items');
      return [];
    }

    return response.items.map(parseContentfulPost);
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    return [];
  }
}

// 2. Ambil SATU Artikel (Detail)
export async function getPostData(slug) {
  const response = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  if (response.items.length === 0) return null;

  return parseContentfulPost(response.items[0]);
}