import type { APIRoute } from 'astro';
import { allArticles, allRepair, allTerms, categoryName, plainText, u } from '../lib/site';

// 站內搜尋索引（P-04）：建置時輸出，前端在使用者第一次點搜尋框時才下載。
// 欄位：t 標題、c 分類、u 網址、e 摘要、x 正文純文字（截 1500 字）。
export const GET: APIRoute = async () => {
  const articles = await allArticles();
  const repair = await allRepair();
  const terms = await allTerms();
  const items = [
    ...articles.map((a) => ({ t: a.data.title, c: categoryName(a), u: u(`/journal/${a.id}/`), e: a.data.excerpt, x: plainText(a.body ?? '').slice(0, 1500) })),
    ...repair.map((r) => ({ t: r.data.title, c: '修器', u: u(`/repair/${r.id}/`), e: r.data.excerpt, x: plainText(r.body ?? '').slice(0, 1500) })),
    ...terms.map((t) => ({ t: t.data.term, c: '修補小詞典', u: u(`/repair/glossary/#${t.id}`), e: t.data.short, x: [...t.data.aka, t.data.body].join(' ') })),
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
