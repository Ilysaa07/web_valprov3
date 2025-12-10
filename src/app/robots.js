export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      }
    ],
    sitemap: 'https://valprointertech.com/sitemap.xml',
    host: 'https://valprointertech.com',
  };
}