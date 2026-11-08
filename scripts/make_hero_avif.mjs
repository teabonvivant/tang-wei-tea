// 首頁主圖 AVIF（M-04）：由 public/images/tea.webp 產生 tea.avif；主圖在任何螢幕上都以 ≥1400px 寬繪出，故只出一個尺寸。
import path from 'node:path';
import sharp from 'sharp';
const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'public/images/tea.webp');
const info = await sharp(src).avif({ quality: 52, effort: 7 }).toFile(path.join(root, 'public/images/tea.avif'));
console.log('tea.avif', info.width, info.height, info.size);
