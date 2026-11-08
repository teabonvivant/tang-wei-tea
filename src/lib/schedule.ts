// 最新班期（P-11）：建置時讀 AI 客服知識庫 CSV，只取「茶藝師班、現行、最新班期、未結束」的班。
// 只讀日期、時間、地點、班別這幾欄；學費、剩餘名額、內部備註一律不讀不寫。讀不到檔或沒有符合的班就回傳空陣列，頁面不顯示該區。
import fs from 'node:fs';

const CSV_PATH = process.env.COURSE_CSV ?? '/home/workspace/古樹茶文化學會 AI 客服/knowledge_base_master_filled_v4.csv';

export type TeaClass = {
  code: string; // A1
  place: '佐敦' | '屯門' | string;
  start: string; end: string; // ISO yyyy-mm-dd
  dateText: string; // 2027 年 1 月 8 日至 3 月 19 日
  startText: string; endText: string; // 2027 年 1 月 8 日、3 月 19 日（版面上分開不斷行）
  weekText: string; slotText: string; // 逢周五、上午 11:00 至 下午 1:00
  location: string;
};

/** 最小 CSV 解析（含雙引號欄位、欄內逗號與換行）。 */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); cur = ''; if (row.length > 1 || row[0] !== '') rows.push(row); row = []; }
    else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift()!.map((h) => h.replace(/^﻿/, ''));
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

const pad = (n: number) => String(n).padStart(2, '0');
/** "8/1/2027 - 19/3/2027" → 起迄日；格式不符回傳 null。 */
function parseRange(s: string): { start: Date; end: Date } | null {
  const m = s.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
  if (!m) return null;
  const mk = (d: string, mo: string, y: string) => new Date(Date.UTC(+y, +mo - 1, +d));
  return { start: mk(m[1], m[2], m[3]), end: mk(m[4], m[5], m[6]) };
}
const iso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export function teaClasses(now: Date = new Date()): TeaClass[] {
  let text: string;
  try { text = fs.readFileSync(CSV_PATH, 'utf8'); } catch { return []; }
  let rows: Record<string, string>[];
  try { rows = parseCsv(text); } catch { return []; }
  // 以香港時間的「今天」為準
  const hk = new Date(now.getTime() + 8 * 3600 * 1000);
  const today = Date.UTC(hk.getUTCFullYear(), hk.getUTCMonth(), hk.getUTCDate());
  const out: TeaClass[] = [];
  for (const r of rows) {
    if (r.business_name !== '茶藝師班' || r.intent_name !== '最新班期' || r.status !== 'active' || !r.class_code) continue;
    const range = parseRange(r.date_range);
    if (!range || range.end.getTime() < today) continue;
    const place = r.title.match(/^(佐敦|屯門)/)?.[1] ?? (r.location.includes('屯門') ? '屯門' : '佐敦');
    const sameYear = range.start.getUTCFullYear() === range.end.getUTCFullYear();
    const ey = sameYear ? '' : `${range.end.getUTCFullYear()} 年 `;
    const dateText = `${range.start.getUTCFullYear()} 年 ${range.start.getUTCMonth() + 1} 月 ${range.start.getUTCDate()} 日至 ${ey}${range.end.getUTCMonth() + 1} 月 ${range.end.getUTCDate()} 日`;
    const slot = r.time_slot.replace(/\s*-\s*/, ' 至 ').replace(/\s+/g, ' ');
    const wk = r.weekday.replace(/^周/, '');
    const startText = `${range.start.getUTCFullYear()} 年 ${range.start.getUTCMonth() + 1} 月 ${range.start.getUTCDate()} 日`;
    const endText = `${ey}${range.end.getUTCMonth() + 1} 月 ${range.end.getUTCDate()} 日`;
    out.push({ code: r.class_code, place, start: iso(range.start), end: iso(range.end), dateText, startText, endText, weekText: `逢周${wk}`, slotText: slot, location: r.location });
  }
  return out.sort((a, b) => a.start.localeCompare(b.start) || a.code.localeCompare(b.code));
}
