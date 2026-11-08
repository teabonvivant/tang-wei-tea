import type { APIRoute } from 'astro';
import { allArticles, allRepair, abs, categoryName, BRAND, TAGLINE } from '../lib/site';

// RSS 2.0（P-27）：茶間筆記與修器。專欄原文不放進訂閱，避免與原刊重複。
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const GET: APIRoute = async () => {
  const notes = (await allArticles()).filter((a) => a.data.series === 'notes');
  const repair = await allRepair();
  const items = [
    ...notes.map((a) => ({ title: a.data.title, link: abs(`/journal/${a.id}/`), desc: a.data.excerpt, date: a.data.date, cat: categoryName(a) })),
    ...repair.map((r) => ({ title: r.data.title, link: abs(`/repair/${r.id}/`), desc: r.data.excerpt, date: r.data.date, cat: '修器' })),
  ].sort((x, y) => y.date.getTime() - x.date.getTime());
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(BRAND)}｜${esc(TAGLINE)}</title>
  <link>${abs('/')}</link>
  <description>${esc(BRAND)}的茶間筆記與修器文章。</description>
  <language>zh-Hant-HK</language>
  <atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml" />
${items.map((i) => `  <item>
    <title>${esc(i.title)}</title>
    <link>${i.link}</link>
    <guid isPermaLink="true">${i.link}</guid>
    <pubDate>${i.date.toUTCString()}</pubDate>
    <category>${esc(i.cat)}</category>
    <description>${esc(i.desc)}</description>
  </item>`).join('\n')}
</channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
