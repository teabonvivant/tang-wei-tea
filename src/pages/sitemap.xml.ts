import type { APIRoute } from 'astro';
import { allArticles, allRepair, topicList, abs, articleDates, lastModOf, JOURNAL_PER_PAGE } from '../lib/site';

export const GET: APIRoute = async () => {
  const articles = await allArticles();
  const repair = await allRepair();
  const pages = Math.ceil(articles.length / JOURNAL_PER_PAGE);
  // lastmod：文章與修器取內容檔 git 最後修改日；獨立頁取頁面檔；目錄頁取其成員中最新的日期。取不到就不寫。
  const mod = (a: any) => articleDates(a).dateModified ?? articleDates(a).datePublished;
  const newest = (xs: (string | undefined)[]) => xs.filter(Boolean).sort().at(-1);
  const artMods = new Map(articles.map((a) => [a.id, mod(a)]));
  const allArt = newest([...artMods.values()]);
  const repMods = repair.map(mod);
  const page = (f: string) => lastModOf(`src/pages/${f}`);
  const entries: [string, string | undefined][] = [
    ['/', newest([page('index.astro'), allArt])], ['/about/', page('about.astro')], ['/courses/', page('courses.astro')], ['/contact/', page('contact.astro')],
    ['/events/', page('events.astro')], ['/tea/', page('tea.astro')], ['/works/', newest([page('works.astro'), ...repMods])], ['/columns/', newest([page('columns.astro'), lastModOf('src/data/columns.json')])],
    ['/sources/', page('sources.astro')], ['/journal/', newest([page('journal/index.astro'), allArt])],
    ...Array.from({ length: pages - 1 }, (_, i): [string, string | undefined] => [`/journal/page/${i + 2}/`, newest([page('journal/page/[n].astro'), allArt])]),
    ['/projects/youth-tea-culture/', page('projects/youth-tea-culture.astro')], ['/repair/', newest([page('repair/index.astro'), ...repMods])], ['/repair/glossary/', newest([lastModOf('src/content/glossary.yaml'), page('repair/glossary.astro')])],
    ...topicList.map((t): [string, string | undefined] => [`/topics/${t.slug}/`, newest(articles.filter((a) => a.data.topic === t.slug).map((a) => artMods.get(a.id)))]),
    ...articles.map((a): [string, string | undefined] => [`/journal/${a.id}/`, artMods.get(a.id)]),
    ...repair.map((r, i): [string, string | undefined] => [`/repair/${r.id}/`, repMods[i]]),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(([p, m]) => `  <url><loc>${abs(p)}</loc>${m ? `<lastmod>${m}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
