// 為已有 -640 縮圖的圖片補 960 寬版本（手機 DPR 2 的卡片用），並登記尺寸到 src/data/images.json
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const jf = path.join(root, 'src/data/images.json');
const images = JSON.parse(fs.readFileSync(jf, 'utf8'));
let n = 0;
for (const key of Object.keys(images)) {
  if (!key.endsWith('-640.webp')) continue;
  const base = key.replace(/-640\.webp$/, '.webp');
  const big = path.join(root, 'public', base);
  const out = path.join(root, 'public', base.replace(/\.webp$/, '-960.webp'));
  if (!fs.existsSync(big)) continue;
  const info = await sharp(big).resize({ width: 960 }).webp({ quality: 68, effort: 5 }).toFile(out);
  images[base.replace(/\.webp$/, '-960.webp')] = [info.width, info.height];
  n++;
}
const sorted = Object.fromEntries(Object.entries(images).sort(([a], [b]) => (a < b ? -1 : 1)));
fs.writeFileSync(jf, JSON.stringify(sorted, null, 0).replace(/,"/g, ',\n"') + '\n');
console.log('960 variants:', n);
