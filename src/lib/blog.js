import { createReader } from '@keystatic/core/reader';
import { keystaticConfig } from './keystatic'; 

const reader = createReader(process.cwd(), keystaticConfig);

// 1. Ambil SEMUA Artikel (Sorted by Date)
export async function getSortedPostsData() {
  const posts = await reader.collections.blog.all();

  const formattedPosts = posts.map((post) => {
    return {
      slug: post.slug,
      ...post.entry,
    };
  });

  return formattedPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 2. Ambil SATU Artikel (Detail)
export async function getPostData(slug) {
  const post = await reader.collections.blog.read(slug);
  
  if (!post) return null;

  // --- BAGIAN PENTING: RESOLVE CONTENT ---
  // Keystatic sering mengembalikan content sebagai fungsi async.
  // Kita harus memanggilnya untuk mendapatkan data JSON yang asli.
  let finalContent = post.content;
  
  if (typeof finalContent === 'function') {
    finalContent = await finalContent();
  }
  // ---------------------------------------

  return {
    slug,
    ...post,
    content: finalContent, // Kirim konten yang sudah "matang" (bukan fungsi lagi)
  };
}