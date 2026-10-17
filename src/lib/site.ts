import { getCollection, type CollectionEntry } from 'astro:content';
import topics from '../data/topics.json';
import order from '../data/order.json';
import images from '../data/images.json';

export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const SITE = (import.meta.env.SITE ?? '').replace(/\/$/, '');
export const IS_PREVIEW = import.meta.env.PUBLIC_PREVIEW === '1';
export const WA_NUMBER = '85263802761'; // 沿用舊網站聯絡頁的號碼
export const BRAND = '唐娓老師';
export const TAGLINE = '茶、器物與日常';

/** 站內路徑加 base，保證尾斜線（錨點與查詢字串原樣保留） */
export function u(p: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(p)) return p;
  const [pathAndQuery, hash] = p.split('#');
  const [pathname, query] = pathAndQuery.split('?');
  let out = BASE + (pathname.startsWith('/') ? pathname : '/' + pathname);
  if (!out.endsWith('/') && !/\.[a-z0-9]+$/i.test(out)) out += '/';
  return out + (query ? '?' + query : '') + (hash ? '#' + hash : '');
}
export const abs = (p: string) => SITE + u(p);

export function wa(text?: string): string {
  return `https://wa.me/${WA_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : '');
}

export const topicList = topics as { slug: string; name: string; intro: string; image: string; alt: string; pageIntro: string; english: string; title: string; description: string }[];
export const topicBySlug = Object.fromEntries(topicList.map((t) => [t.slug, t]));

export const clusters = [
  { id: 'look', name: '看懂破損', blurb: '碎了、裂了、崩了，先看清楚是哪一種。' },
  { id: 'method', name: '修補的方法', blurb: '金繕、鋦瓷，各有各的做法和限度。' },
  { id: 'material', name: '材料與安全', blurb: '金色是甚麼、漆和膠碰不碰得茶，要問清楚。' },
  { id: 'table', name: '茶席上的修補器', blurb: '修過的器物，放回茶桌上怎麼用。' },
  { id: 'people', name: '器物與人', blurb: '一隻舊碗、一件器物，和用它的人。' },
] as const;

export type Article = CollectionEntry<'articles'>;
export type Repair = CollectionEntry<'repair'>;

export async function allArticles(): Promise<Article[]> {
  const all = (await getCollection('articles')).filter((a) => !a.data.draft);
  const rank = (a: Article) => {
    if (a.data.series === 'column') return 1000;
    const t = a.data.topic!;
    const ti = topicList.findIndex((x) => x.slug === t);
    return ti * 100 + (order as Record<string, string[]>)[t].indexOf(a.id);
  };
  return all.sort((a, b) => {
    const d = b.data.date.getTime() - a.data.date.getTime();
    if (d) return d;
    return rank(a) - rank(b);
  });
}
export async function topicArticles(slug: string): Promise<Article[]> {
  const list = (await allArticles()).filter((a) => a.data.topic === slug);
  const o = (order as Record<string, string[]>)[slug];
  return list.sort((a, b) => o.indexOf(a.id) - o.indexOf(b.id));
}
export async function columnArticles(): Promise<Article[]> {
  return (await allArticles()).filter((a) => a.data.series === 'column').sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export async function allRepair(): Promise<Repair[]> {
  return (await getCollection('repair')).filter((a) => !a.data.draft).sort((a, b) => a.data.order - b.data.order);
}

export function categoryName(a: Article): string {
  return a.data.series === 'column' ? '茶逢知己' : topicBySlug[a.data.topic!].name;
}
export function categoryHref(a: Article): string {
  return a.data.series === 'column' ? '/columns/' : `/topics/${a.data.topic}/`;
}

export function fmtDate(d: Date): string {
  const y = d.getUTCFullYear(), m = String(d.getUTCMonth() + 1).padStart(2, '0'), day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}
export function fmtDateZh(d: Date): string {
  return `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
}
/** 只在有真實刊出日期時才顯示（專欄文章）；批量上載的筆記與修器文章不標日期 */
export function shownDate(a: { data: { series?: string; date: Date } }): string | undefined {
  return a.data.series === 'column' ? fmtDate(a.data.date) : undefined;
}

/** 本機圖片（/images/**）的寬高與縮圖 */
export function imgInfo(src: string) {
  const imgs = images as Record<string, number[]>;
  const dim = imgs[src];
  const at = (w: number) => src.replace(/\.webp$/, `-${w}.webp`);
  const widths = [640, 960].filter((w) => imgs[at(w)]);
  const list = widths.map((w) => `${u(at(w)).replace(/\/$/, '')} ${imgs[at(w)][0]}w`);
  if (widths.length) list.push(`${u(src).replace(/\/$/, '')} ${dim[0]}w`);
  return {
    src: u(src).replace(/\/$/, ''),
    width: dim?.[0],
    height: dim?.[1],
    srcset: widths.length ? list.join(', ') : undefined,
  };
}

/** 茶文章 → 對應修器文章（由修器文章的 relatedTea 反查）。 */
export async function repairForTea(slug: string, topic?: string): Promise<Repair[]> {
  const rep = await allRepair();
  const hit = rep.filter((r) => r.data.relatedTea.some((x) => x.id === slug));
  if (hit.length) return hit.slice(0, 2);
  if (topic === 'vessels' || topic === 'hosting') {
    const d = rep.find((r) => r.id === 'what-is-kintsugi');
    return d ? [d] : [];
  }
  return [];
}

export type Term = CollectionEntry<'glossary'>;
export const glossaryGroups = ['部位', '材質', '破損', '方法', '觀念', '材料', '工具', '安全', '茶席'] as const;
export const glossaryGroupNames: Record<string, string> = { 部位: '器物部位', 材質: '材質', 破損: '破損', 方法: '修補方法', 觀念: '修補觀念', 材料: '材料', 工具: '工具與環境', 安全: '安全與使用', 茶席: '茶席與日常' };

export async function allTerms(): Promise<Term[]> {
  return getCollection('glossary');
}
/** 文章原文中 [[…]] 標記過的詞條 id（按出現次序，去重）。 */
export function bodyTerms(body: string, terms: Term[]): string[] {
  const map = new Map<string, string>();
  for (const t of terms) { map.set(t.data.term, t.id); for (const a of t.data.aka) map.set(a, t.id); }
  const out: string[] = [];
  for (const m of body.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)) {
    const id = map.get(m[2] ?? m[1]);
    if (id && !out.includes(id)) out.push(id);
  }
  return out;
}
export async function termUsage(): Promise<Map<string, Repair[]>> {
  const terms = await allTerms();
  const use = new Map<string, Repair[]>();
  for (const r of await allRepair()) {
    for (const id of bodyTerms(r.body ?? '', terms)) use.set(id, [...(use.get(id) ?? []), r]);
  }
  return use;
}
