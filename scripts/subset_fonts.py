#!/usr/bin/env python3
"""建置後字體處理（P-25）：標題字體（昭源宋體 Medium，OFL）切成兩層 woff2，並寫入每頁 <head>。
  共用層 tea-<hash>.woff2：全站標題用字中出現頁數最多的前 N 個字（預設 200；實測 150–250 時首次進站的字體總量與舊版每頁各切一份相當，第二頁起只剩約 3–5 KB 差額）＋ ASCII 與標點，所有頁同一檔名，第二頁起命中快取；
  差額層 d-<hash>.woff2：該頁用到、但不在共用層的字（多數頁沒有，有的也只有幾個字，約 1–3 KB），作為 TeaSerifX 家族補在 --serif 字體堆疊第二位。
正文用系統字體（D-7 的正文子集由 opt3 另加）。
用法：python3 -I scripts/subset_fonts.py <dist> [--base /tang-wei-tea] [--font fonts-src/ChironSungHK-M-hk.ttf]
需要：pip install fonttools brotli
"""
import argparse, hashlib, io, os, re, sys
from html.parser import HTMLParser
from fontTools import subset
from fontTools.ttLib import TTFont

ap = argparse.ArgumentParser()
ap.add_argument('dist'); ap.add_argument('--base', default=os.environ.get('BASE', '/tang-wei-tea')); ap.add_argument('--shared-size', type=int, default=200)
ap.add_argument('--font', default=os.path.join(os.path.dirname(__file__), '..', 'fonts-src', 'ChironSungHK-M-hk.ttf'))
a = ap.parse_args()
BASE = a.base.rstrip('/')
FAMILY = 'TeaSerif'
FAMILY_X = 'TeaSerifX'
HEADINGS = {'h1', 'h2', 'h3', 'h4'}
SERIF_CLASSES = {'wordmark', 'serif', 'english-title', 'when', 'term-pop'}
SERIF_DESC = [  # (祖先 class, 標籤)
    ('crack-links', 'strong'), ('series-nav', 'strong'), ('stat-grid', 'dt'), ('faq', 'summary'), ('menu-group', 'a'), ('prose', 'blockquote'), ('plain-block', 'h2'),
]
ALWAYS = ''.join(chr(c) for c in range(0x20, 0x7F)) + '，。、；：？！「」『』（）《》·…％'

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []  # (tag, classes, serif?)
        self.text = []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'template'):
            self.skip += 1
        if tag in ('br', 'img', 'meta', 'link', 'input', 'hr', 'path', 'ellipse', 'source'):
            return
        cls = set((dict(attrs).get('class') or '').split())
        ancestors = set().union(*[s[1] for s in self.stack]) if self.stack else set()
        serif = tag in HEADINGS or bool(cls & SERIF_CLASSES) or any(ac in ancestors and tag == t for ac, t in SERIF_DESC)
        inherited = bool(self.stack) and bool(self.stack[-1][2])
        self.stack.append((tag, cls, bool(serif) or inherited))
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'template'):
            self.skip = max(0, self.skip - 1)
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break
    def handle_data(self, data):
        if self.skip or not self.stack:
            return
        if self.stack[-1][2]:
            self.text.append(data)

src = TTFont(a.font)
sizes = {}
def make(chars: str, prefix: str) -> str:
    h = hashlib.sha1(chars.encode()).hexdigest()[:10]
    name = f'{prefix}-{h}.woff2'
    path = os.path.join(a.dist, 'fonts', name)
    if name in sizes:
        return name
    os.makedirs(os.path.dirname(path), exist_ok=True)
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'locl', 'vert', 'vrt2']; opts.name_IDs = [0, 1, 2, 13, 14]; opts.notdef_outline = True; opts.hinting = False
    f = TTFont(a.font)
    s = subset.Subsetter(opts); s.populate(text=chars); s.subset(f)
    f.flavor = 'woff2'; f.save(path)
    sizes[name] = os.path.getsize(path)
    return name

# 第一輪：讀全部頁面，收集每頁標題用字
pages = {}
for root, _, files in os.walk(a.dist):
    for fn in files:
        if not fn.endswith('.html'):
            continue
        p = os.path.join(root, fn)
        html = open(p, encoding='utf-8').read()
        parser = P(); parser.feed(html)
        chars = set(''.join(parser.text)) - set(' \n\t\r')
        pages[p] = (html, {c for c in chars if ord(c) > 0x20})

# 共用層：按出現頁數排序（同分按字碼），取前 N 個
df = {}
for _, (_, chars) in pages.items():
    for c in chars:
        df[c] = df.get(c, 0) + 1
ranked = sorted(df, key=lambda c: (-df[c], c))
shared = set(ranked[: a.shared_size]) | set(ALWAYS)
shared_name = make(''.join(sorted(shared)) + ' ', 'tea')
shared_url = f'{BASE}/fonts/{shared_name}'

n = diff_pages = diff_bytes = 0
for p, (html, chars) in pages.items():
    face = (f'@font-face{{font-family:{FAMILY};src:url({shared_url}) format("woff2");font-weight:500;font-display:swap}}')
    inject = f'<link rel="preload" href="{shared_url}" as="font" type="font/woff2" crossorigin>'
    diff = chars - shared
    if diff:
        dname = make(''.join(sorted(diff)) + ' ', 'd')
        durl = f'{BASE}/fonts/{dname}'
        inject += f'<link rel="preload" href="{durl}" as="font" type="font/woff2" crossorigin>'
        face += f'@font-face{{font-family:{FAMILY_X};src:url({durl}) format("woff2");font-weight:500;font-display:swap}}'
        diff_pages += 1; diff_bytes += sizes[dname]
    inject += f'<style>{face}</style>'
    open(p, 'w', encoding='utf-8').write(html.replace('</head>', inject + '</head>', 1))
    n += 1
print(f'字體處理完成：{n} 頁；共用層 {shared_name}（{len(shared)} 字，{sizes[shared_name] / 1024:.1f} KB）；'
      f'{diff_pages} 頁有差額層（共 {len(sizes) - 1} 個檔，平均 {diff_bytes / max(diff_pages, 1) / 1024:.1f} KB，最大 {max([v for k, v in sizes.items() if k.startswith("d-")] or [0]) / 1024:.1f} KB）')
