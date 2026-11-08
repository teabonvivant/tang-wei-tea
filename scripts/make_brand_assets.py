#!/usr/bin/env python3
"""品牌圖標與分享圖（P-22）。輸出到 public/：
  favicon.svg（唐字＋金線）、favicon-32.png、apple-touch-icon.png（180px）、images/og-default.jpg（1200×630）
需要 Pillow、fonttools、sharp（node，用來把 SVG 轉 PNG）。字體：昭源宋體（OFL，fonts-src/）。
用法：python3 scripts/make_brand_assets.py
"""
import os, subprocess
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FONT = os.path.join(ROOT, 'fonts-src', 'ChironSungHK-M-hk.ttf')
PUB = os.path.join(ROOT, 'public')
GOLD, INK, PAPER = '#c9a869', '#1a1917', '#f3f2ee'

# ---- favicon.svg：深色圓角方塊、紙白「唐」、一道金線
tt = TTFont(FONT)
gs = tt.getGlyphSet()
name = tt.getBestCmap()[ord('唐')]
size = 44  # 字高（viewBox 64）
s = size / 1000
pen = SVGPathPen(gs)
tp = TransformPen(pen, (s, 0, 0, -s, 32 - 500 * s, 32 + 400 * s))  # 置中；y 軸翻轉
gs[name].draw(tp)
glyph_d = pen.getCommands()
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
<rect width="64" height="64" rx="14" fill="{INK}"/>
<path d="{glyph_d}" fill="{PAPER}"/>
<path d="M45 8 L40 23 L47 32 L41 45 L45 57" fill="none" stroke="{GOLD}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
'''
open(os.path.join(PUB, 'favicon.svg'), 'w', encoding='utf-8').write(svg)

# ---- PNG（用 sharp 轉 SVG）
js = f"""import sharp from 'sharp';
const svg = Buffer.from({svg!r});
await sharp(svg, {{ density: 600 }}).resize(180, 180).png().toFile({os.path.join(PUB, 'apple-touch-icon.png')!r});
await sharp(svg, {{ density: 600 }}).resize(32, 32).png().toFile({os.path.join(PUB, 'favicon-32.png')!r});
"""
tmp = os.path.join(ROOT, '_icons_tmp.mjs')
open(tmp, 'w').write(js)
subprocess.run(['node', tmp], check=True, cwd=ROOT)
os.remove(tmp)

# ---- og-default.jpg：主圖裁成 1200×630，左側壓暗放字，右下裂杯加金線
src = Image.open(os.path.join(PUB, 'images', 'tea.webp')).convert('RGB')  # 1400×933
top = 150
crop = src.crop((0, top, 1400, top + 735)).resize((1200, 630), Image.LANCZOS)
k = 1200 / 1400
# 與首頁主圖同一條金線（原圖座標），換算到分享圖
crack = [(979, 603), (985, 619), (994, 641), (989, 664), (1001, 674), (993, 696), (1007, 715), (998, 734), (1003, 751)]
branch = [(993, 696), (977, 706), (972, 724)]
pt = lambda p: (p[0] * k, (p[1] - top) * k)
# 暗化：左→右漸變
shade = Image.new('RGBA', crop.size, (0, 0, 0, 0))
sd = ImageDraw.Draw(shade)
for x in range(crop.width):
    a = int(215 * max(0.0, 1 - x / (crop.width * 0.78)) ** 1.2 + 55)
    sd.line([(x, 0), (x, crop.height)], fill=(22, 20, 18, min(a, 235)))
img = Image.alpha_composite(crop.convert('RGBA'), shade)
glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
for pts in (crack, branch):
    gd.line([pt(p) for p in pts], fill=(201, 168, 105, 110), width=11, joint='curve')
img = Image.alpha_composite(img, glow)
d = ImageDraw.Draw(img)
for pts in (crack, branch):
    d.line([pt(p) for p in pts], fill=(201, 168, 105, 255), width=5, joint='curve')
    for p in pts:
        x, y = pt(p); d.ellipse([x - 2.5, y - 2.5, x + 2.5, y + 2.5], fill=(201, 168, 105, 255))
big = ImageFont.truetype(FONT, 84)
small = ImageFont.truetype(FONT, 34)
d.text((72, 372), '唐娓老師', font=big, fill=(243, 242, 238, 255))
d.text((76, 484), '茶、器物與日常', font=small, fill=(220, 217, 209, 255))
img.convert('RGB').save(os.path.join(PUB, 'images', 'og-default.jpg'), quality=82, optimize=True, progressive=True)
print('done')
