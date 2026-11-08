// 每篇文章的分享圖（P-22）：由封面置中裁成 1200×630 JPG，寫入輸出目錄 images/og/<slug>.jpg。
// 只輸出到 dist（不入 git）；Base 的 og:image 對應 /images/og/<slug>.jpg。
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import YAML from 'yaml';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.resolve(root, process.env.OUT_DIR ?? 'dist', 'images/og');
fs.mkdirSync(outDir, { recursive: true });

const jobs = [];
for (const [dir, resolve] of [
  ['src/content/journal', (fm) => path.join(root, 'public', fm.cover)],
  ['src/content/repair', (fm, slug) => path.join(root, 'public/images/repair', `${slug}.jpg`)],
]) {
  for (const f of fs.readdirSync(path.join(root, dir))) {
    if (!f.endsWith('.md')) continue;
    const slug = f.replace(/\.md$/, '');
    const fm = YAML.parse(fs.readFileSync(path.join(root, dir, f), 'utf8').split(/^---$/m)[1]);
    jobs.push({ slug, src: resolve(fm, slug) });
  }
}
let n = 0;
for (const { slug, src } of jobs) {
  if (!fs.existsSync(src)) { console.error(`og：找不到封面 ${src}`); process.exit(1); }
  await sharp(src).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(outDir, `${slug}.jpg`));
  n++;
}
console.log(`分享圖：${n} 張（1200×630 JPG）`);
