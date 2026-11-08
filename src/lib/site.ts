import { getCollection, type CollectionEntry } from 'astro:content';
import { execFileSync } from 'node:child_process';
import type { ImageMetadata } from 'astro';
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
  const at = (w: number) => src.replace(/\.(webp|jpg)$/, `-${w}.$1`);
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

// ---------------------------------------------------------------------------
// 結構化資料：真實日期（P-24）、麵包屑、頁面類型
// ---------------------------------------------------------------------------

/** 內容檔的 git 最後修改日（YYYY-MM-DD）。一次 git log 取全部，之後查表；取不到（如淺層複製）回傳 undefined。 */
let gitLast: Map<string, string> | null = null;
function loadGitLast(): Map<string, string> {
  if (gitLast) return gitLast;
  gitLast = new Map();
  try {
    const out = execFileSync('git', ['log', '--name-only', '--format=@@%cI', '--', 'src/content'], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    let cur = '';
    for (const line of out.split('\n')) {
      if (line.startsWith('@@')) cur = line.slice(2, 12);
      else if (line && cur && !gitLast.has(line)) gitLast.set(line, cur);
    }
  } catch { /* 沒有 git 歷史就用 frontmatter 日期 */ }
  return gitLast;
}
const ymd = (d: Date) => d.toISOString().slice(0, 10);
/** datePublished 取 frontmatter；dateModified 取 git 最後修改日（不早於發表日）。專欄原文不改，不給 dateModified。 */
export function articleDates(entry: { filePath?: string; data: { date: Date; series?: string } }): { datePublished: string; dateModified?: string } {
  const datePublished = ymd(entry.data.date);
  if (entry.data.series === 'column') return { datePublished };
  const last = entry.filePath ? loadGitLast().get(entry.filePath.replace(/^\.?\//, '')) : undefined;
  return { datePublished, dateModified: last && last > datePublished ? last : datePublished };
}

export type Crumb = { name: string; path: string };
const SECTION_NAMES: Record<string, string> = {
  '/tea/': '茶知識', '/works/': '器物', '/columns/': '茶逢知己', '/journal/': '茶間筆記', '/courses/': '課程與合作', '/about/': '關於唐老師',
  '/events/': '教學紀錄', '/contact/': '聯絡', '/sources/': '文字與圖片說明', '/repair/': '修器', '/repair/glossary/': '修補小詞典', '/projects/youth-tea-culture/': '青年與茶',
};
const SECTION_PARENT: Record<string, string> = { '/repair/': '/works/', '/repair/glossary/': '/repair/', '/events/': '/about/', '/projects/youth-tea-culture/': '/about/' };
/** 由網址推出麵包屑（首頁 → … → 本頁）；首頁與 404 回傳空陣列。 */
export function crumbsFor(path: string): Crumb[] {
  if (path === '/' || path === '/404.html') return [];
  const chain: Crumb[] = [];
  const add = (p: string, name?: string) => chain.unshift({ name: name ?? SECTION_NAMES[p], path: p });
  let m: RegExpMatchArray | null;
  if ((m = path.match(/^\/topics\/([a-z]+)\/$/))) { add(path, topicBySlug[m[1]]?.name); add('/tea/'); }
  else if ((m = path.match(/^\/journal\/page\/(\d+)\/$/))) { add(path, `第 ${m[1]} 頁`); add('/journal/'); }
  else if (SECTION_NAMES[path]) { add(path); let p = SECTION_PARENT[path]; while (p) { add(p); p = SECTION_PARENT[p]; } }
  else return [];
  return [{ name: BRAND, path: '/' }, ...chain].filter((c) => c.name);
}
export function pageSchemaType(path: string): 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' {
  if (path === '/about/') return 'AboutPage';
  if (path === '/contact/') return 'ContactPage';
  if (['/tea/', '/works/', '/columns/', '/journal/', '/repair/', '/repair/glossary/'].includes(path) || /^\/(topics|journal\/page)\//.test(path)) return 'CollectionPage';
  return 'WebPage';
}
export function breadcrumbLd(crumbs: Crumb[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })) };
}

// ---------------------------------------------------------------------------
// 文末「接着讀」：1 同主題 + 1 跨主題 + 1 修器（無合適修器時用另一篇跨主題）（P-08）
// ---------------------------------------------------------------------------
export type ReadCard = { href: string; title: string; excerpt: string; cover: string | ImageMetadata; category: string; date?: string };
const AFFINITY: Record<string, string[]> = {
  brewing: ['senses', 'vessels'], senses: ['brewing', 'daily'], puer: ['storage', 'culture'], storage: ['puer', 'daily'], vessels: ['hosting', 'brewing'],
  hosting: ['vessels', 'culture'], craft: ['culture', 'puer'], daily: ['learning', 'senses'], learning: ['daily', 'brewing'], culture: ['craft', 'hosting'],
};
const hashOf = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const articleCard = (x: Article): ReadCard => ({ href: `/journal/${x.id}/`, title: x.data.title, excerpt: x.data.excerpt, cover: x.data.cover, category: categoryName(x), date: shownDate(x) });
const repairCard = (x: Repair): ReadCard => ({ href: `/repair/${x.id}/`, title: x.data.title, excerpt: x.data.excerpt, cover: x.data.cover, category: '修器' });

export async function readNext(a: Article, related: Article[]): Promise<ReadCard[]> {
  const all = await allArticles();
  const notes = all.filter((x) => x.data.series === 'notes');
  const isColumn = a.data.series === 'column';
  const rotate = <T,>(list: T[]) => (list.length ? [...list.slice(hashOf(a.id) % list.length), ...list.slice(0, hashOf(a.id) % list.length)] : list);
  let same: Article | undefined;
  let crossPool: Article[];
  if (isColumn) {
    same = related.find((r) => r.data.series === 'column');
    // 專欄文末的「跨」＝讀唐老師談同一件事的筆記：先找有連到這一篇的筆記，再用日常／文化／學習主題補
    const back = notes.filter((n) => n.data.related.some((r) => r.id === a.id));
    crossPool = [...back, ...rotate(notes.filter((n) => ['daily', 'culture', 'learning'].includes(n.data.topic!)))];
  } else {
    same = related.find((r) => r.data.series === 'notes' && r.data.topic === a.data.topic && r.id !== a.id) ?? (await topicArticles(a.data.topic!)).find((x) => x.id !== a.id);
    const aff = rotate((AFFINITY[a.data.topic!] ?? []).flatMap((t) => notes.filter((n) => n.data.topic === t)));
    crossPool = [...related.filter((r) => r.data.series !== 'notes' || r.data.topic !== a.data.topic), ...aff];
  }
  const seen = new Set<string>([a.id, ...(same ? [same.id] : [])]);
  let firstCross: Article | undefined;
  // 第二篇跨主題盡量與第一篇不同主題
  const takeCross = () => { const x = crossPool.find((c) => !seen.has(c.id) && (!firstCross || c.data.topic !== firstCross.data.topic)) ?? crossPool.find((c) => !seen.has(c.id)); if (x) seen.add(x.id); return x; };
  const cross1 = takeCross();
  firstCross = cross1;
  const rep = (await repairForTea(a.id, a.data.topic))[0];
  const third: ReadCard | undefined = rep ? repairCard(rep) : (() => { const x = takeCross(); return x && articleCard(x); })();
  const out: ReadCard[] = [];
  if (same) out.push(articleCard(same));
  if (cross1) out.push(articleCard(cross1));
  if (third) out.push(third);
  return out;
}
