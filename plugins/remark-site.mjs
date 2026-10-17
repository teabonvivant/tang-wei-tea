// 站內 Markdown 擴充：
//  1. [[詞條]] 或 [[顯示字|詞條名]] → 詞條 popover 按鈕；未知詞條令建置失敗
//  2. 以 / 開頭的站內連結自動加 base
//  3. ![alt](/images/…) → 帶寬高及 srcset 的 <figure>
import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import YAML from 'yaml';

const root = process.cwd();
const base = (process.env.BASE ?? '/tang-wei-tea').replace(/\/$/, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadGlossary() {
  const f = path.join(root, 'src/content/glossary.yaml');
  const map = new Map();
  if (!fs.existsSync(f)) return map;
  for (const e of YAML.parse(fs.readFileSync(f, 'utf8')) ?? []) {
    map.set(e.term, e.id);
    for (const a of e.aka ?? []) map.set(a, e.id);
  }
  return map;
}
function loadImages() {
  const f = path.join(root, 'src/data/images.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
}

export default function remarkSite() {
  const glossary = loadGlossary();
  const images = loadImages();
  return (tree, file) => {
    visit(tree, 'link', (n) => {
      if (n.url.startsWith('/') && !n.url.startsWith(base + '/')) n.url = base + n.url;
    });
    const figure = (n) => {
      const src = n.url;
      const dim = images[src];
      const small = images[src.replace(/\.webp$/, '-640.webp')];
      const set = small ? ` srcset="${base}${src.replace(/\.webp$/, '-640.webp')} ${small[0]}w, ${base}${src} ${dim[0]}w" sizes="(min-width: 1080px) 1040px, 100vw"` : '';
      const wh = dim ? ` width="${dim[0]}" height="${dim[1]}"` : '';
      return `<figure class="body-figure"><img src="${base}${src}"${set}${wh} alt="${esc(n.alt ?? '')}" loading="lazy" decoding="async"></figure>`;
    };
    // 單獨成段的圖片 → 整段換成 <figure>（避免 <p><figure> 巢狀）
    visit(tree, 'paragraph', (node, i, parent) => {
      if (node.children.length === 1 && node.children[0].type === 'image') {
        parent.children[i] = { type: 'html', value: figure(node.children[0]) };
      }
    });
    visit(tree, 'text', (n, i, parent) => {
      if (!parent || !n.value.includes('[[')) return;
      const parts = [];
      let last = 0;
      for (const m of n.value.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)) {
        const shown = m[1];
        const name = m[2] ?? m[1];
        const id = glossary.get(name);
        if (!id) throw new Error(`詞條「${name}」不在 src/content/glossary.yaml（${file.path}）`);
        if (m.index > last) parts.push({ type: 'text', value: n.value.slice(last, m.index) });
        parts.push({
          type: 'html',
          value: `<button type="button" class="term" popovertarget="term-${id}" data-term="${id}">${esc(shown)}</button>`,
        });
        last = m.index + m[0].length;
      }
      if (!parts.length) return;
      if (last < n.value.length) parts.push({ type: 'text', value: n.value.slice(last) });
      parent.children.splice(i, 1, ...parts);
      return i + parts.length;
    });
  };
}
