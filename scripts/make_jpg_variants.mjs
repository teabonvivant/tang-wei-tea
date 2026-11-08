// 內文 JPG 補 -640／-960 縮圖（P-22），並登記尺寸到 src/data/images.json；舊網址（原圖）不動。
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'public/images');
const jf = path.join(root, 'src/data/images.json');
const images = JSON.parse(fs.readFileSync(jf, 'utf8'));
let n = 0;
for (const f of fs.readdirSync(dir)) {
  if (!/\.jpg$/.test(f) || /-(640|960)\.jpg$/.test(f) || f === 'og-default.jpg') continue;
  const full = path.join(dir, f);
  const meta = await sharp(full).metadata();
  for (const w of [640, 960]) {
    if (meta.width <= w) continue;
    const out = path.join(dir, f.replace(/\.jpg$/, `-${w}.jpg`));
    const info = await sharp(full).resize({ width: w }).jpeg({ quality: 74, mozjpeg: true }).toFile(out);
    images[`/images/${f.replace(/\.jpg$/, `-${w}.jpg`)}`] = [info.width, info.height];
    n++;
  }
}
const sorted = Object.fromEntries(Object.entries(images).sort(([a], [b]) => (a < b ? -1 : 1)));
fs.writeFileSync(jf, JSON.stringify(sorted, null, 0).replace(/,"/g, ',\n"') + '\n');
console.log('jpg variants:', n);
