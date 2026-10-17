import type { APIRoute } from 'astro';
import { allArticles, allRepair, topicList, abs } from '../lib/site';
export const GET: APIRoute = async () => {
  const articles = await allArticles();
  const repair = await allRepair();
  const pages = Math.ceil(articles.length / 12);
  const paths = [
    '/', '/about/', '/courses/', '/contact/', '/events/', '/tea/', '/works/', '/columns/', '/sources/', '/journal/',
    ...Array.from({ length: pages - 1 }, (_, i) => `/journal/page/${i + 2}/`),
    '/projects/youth-tea-culture/', '/repair/', '/repair/glossary/',
    ...topicList.map((t) => `/topics/${t.slug}/`),
    ...articles.map((a) => `/journal/${a.id}/`),
    ...repair.map((r) => `/repair/${r.id}/`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${abs(p)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
