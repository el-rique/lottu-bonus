import type { APIRoute } from 'astro';

const pages = import.meta.glob('./**/*.astro', { eager: false });

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.origin : 'https://lottu-bonus.com';

  const urls = Object.keys(pages)
    .map((filePath) => {
      const slug = filePath.replace(/^\.\//, '').replace(/\.astro$/, '');
      const urlPath = slug === 'index' ? '' : slug.replace(/\/index$/, '');
      return urlPath === '' ? siteUrl : `${siteUrl}/${urlPath}`;
    })
    .sort();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
