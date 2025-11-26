export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['keystatic', '/admin/', '/api/'], // Larang Google masuk Admin
    },
    sitemap: 'https://valprointertech.com/sitemap.xml',
  };
}