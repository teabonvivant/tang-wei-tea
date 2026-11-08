#!/usr/bin/env python3
"""建置後字體處理（P-25）：標題字體（昭源宋體 Medium，OFL）切成兩層 woff2，並寫入每頁 <head>。
  共用層 tea-<hash>.woff2：全站標題用字中出現頁數最多的前 N 個字（預設 200；實測 150–250 時首次進站的字體總量與舊版每頁各切一份相當，第二頁起只剩約 3–5 KB 差額）＋ ASCII 與標點，所有頁同一檔名，第二頁起命中快取；
  差額層 d-<hash>.woff2：該頁用到、但不在共用層的字（多數頁沒有，有的也只有幾個字，約 1–3 KB），作為 TeaSerifX 家族補在 --serif 字體堆疊第二位。
正文（T-12／D-7）：昭源黑體（Chiron Hei HK Regular，OFL）同樣切兩層，家族名 TeaSans／TeaSansX（子集內部字體名亦改為 TeaSans）。
  共用層 hei-<hash>.woff2：全站正文用字中出現頁數最多的前 N 個字，N 取使 woff2 ≤ --sans-budget（預設 120 KB）的最大值；
  差額層 hd-<hash>.woff2：該頁正文用到而共用層沒有的字。系統黑體保留作後備（--sans 字體堆疊在 TeaSans 之後）。
  首頁不 preload 正文字體（讓主圖獨佔頻寬，LCP 優先），其他頁 preload 共用層與差額層。
用法：python3 -I scripts/subset_fonts.py <dist> [--base /tang-wei-tea] [--font fonts-src/ChironSungHK-M-hk.ttf] [--sans-font fonts-src/ChironHeiHK-R-hk.ttf]
需要：pip install fonttools brotli
"""
import argparse, hashlib, io, json, os, re, sys
from html.parser import HTMLParser
from fontTools import subset
from fontTools.ttLib import TTFont

ap = argparse.ArgumentParser()
ap.add_argument('dist'); ap.add_argument('--base', default=os.environ.get('BASE', '/tang-wei-tea')); ap.add_argument('--shared-size', type=int, default=200)
ap.add_argument('--font', default=os.path.join(os.path.dirname(__file__), '..', 'fonts-src', 'ChironSungHK-M-hk.ttf'))
ap.add_argument('--sans-font', default=os.path.join(os.path.dirname(__file__), '..', 'fonts-src', 'ChironHeiHK-R-hk.ttf'))
ap.add_argument('--sans-budget', type=int, default=120, help='正文共用層 woff2 大小上限（KB）')
a = ap.parse_args()
BASE = a.base.rstrip('/')
FAMILY = 'TeaSerif'
FAMILY_X = 'TeaSerifX'
SANS = 'TeaSans'
SANS_X = 'TeaSansX'
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
        self.sans = []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'template', 'title'):
            self.skip += 1
        if tag == 'input':
            ph = dict(attrs).get('placeholder')
            if ph:
                self.sans.append(ph)
        if tag in ('br', 'img', 'meta', 'link', 'input', 'hr', 'path', 'ellipse', 'source'):
            return
        cls = set((dict(attrs).get('class') or '').split())
        ancestors = set().union(*[s[1] for s in self.stack]) if self.stack else set()
        serif = tag in HEADINGS or bool(cls & SERIF_CLASSES) or any(ac in ancestors and tag == t for ac, t in SERIF_DESC)
        inherited = bool(self.stack) and bool(self.stack[-1][2])
        self.stack.append((tag, cls, bool(serif) or inherited))
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'template', 'title'):
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
        else:
            self.sans.append(data)

src = TTFont(a.font)
sizes = {}
def build(font_path: str, chars: str, rename=None) -> bytes:
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'locl', 'vert', 'vrt2']; opts.name_IDs = [0, 1, 2, 3, 4, 6, 13, 14]; opts.notdef_outline = True; opts.hinting = False
    f = TTFont(font_path)
    s = subset.Subsetter(opts); s.populate(text=chars); s.subset(f)
    if rename:  # OFL：改名後才散佈子集（家族名、全名、PostScript 名；版權與授權欄位保留）
        for rec in f['name'].names:
            if rec.nameID in (1, 4):
                rec.string = rename
            elif rec.nameID == 6:
                rec.string = rename + '-Regular'
            elif rec.nameID == 3:
                rec.string = rename + ';subset'
    f.flavor = 'woff2'
    buf = io.BytesIO(); f.save(buf)
    return buf.getvalue()
def make(chars: str, prefix: str, font_path=None, rename=None) -> str:
    h = hashlib.sha1(chars.encode()).hexdigest()[:10]
    name = f'{prefix}-{h}.woff2'
    path = os.path.join(a.dist, 'fonts', name)
    if name in sizes:
        return name
    os.makedirs(os.path.dirname(path), exist_ok=True)
    data = build(font_path or a.font, chars, rename)
    open(path, 'wb').write(data)
    sizes[name] = len(data)
    return name

# 第一輪：讀全部頁面，收集每頁標題用字（serif）與正文用字（sans）
pages = {}
for root, _, files in os.walk(a.dist):
    for fn in files:
        if not fn.endswith('.html'):
            continue
        p = os.path.join(root, fn)
        html = open(p, encoding='utf-8').read()
        parser = P(); parser.feed(html)
        chars = set(''.join(parser.text)) - set(' \n\t\r')
        sans_chars = set(''.join(parser.sans)) - set(' \n\t\r')
        pages[p] = (html, {c for c in chars if ord(c) > 0x20}, {c for c in sans_chars if ord(c) > 0x20})

# 共用層：按出現頁數排序（同分按字碼），取前 N 個
df = {}
for _, (_, chars, _s) in pages.items():
    for c in chars:
        df[c] = df.get(c, 0) + 1
ranked = sorted(df, key=lambda c: (-df[c], c))
shared = set(ranked[: a.shared_size]) | set(ALWAYS)
shared_name = make(''.join(sorted(shared)) + ' ', 'tea')
shared_url = f'{BASE}/fonts/{shared_name}'

# 正文共用層：同法，N 取使 woff2 不超過預算的最大值（二分搜尋）
sdf = {}
for _, (_h, _c, sch) in pages.items():
    for c in sch:
        sdf[c] = sdf.get(c, 0) + 1
sranked = sorted(sdf, key=lambda c: (-sdf[c], c))
base_sans = set(ALWAYS)
budget = a.sans_budget * 1024
def sans_size(n: int) -> int:
    return len(build(a.sans_font, ''.join(sorted(base_sans | set(sranked[:n]))) + ' ', SANS))
# 字數 N 與大小近似成正比：由 700 字起按預算比例逼近（約 3–4 次），最後保證不超預算
lo = min(700, len(sranked)); cur = sans_size(lo)
for _ in range(6):
    nxt = min(len(sranked), max(200, int(lo * budget / cur * 0.997)))
    if nxt == lo:
        break
    lo, cur = nxt, sans_size(nxt)
    if abs(cur - budget) < budget * 0.004 and cur <= budget:
        break
while cur > budget and lo > 200:
    lo -= 5; cur = sans_size(lo)
sans_shared = base_sans | set(sranked[:lo])
sans_shared_name = make(''.join(sorted(sans_shared)) + ' ', 'hei', a.sans_font, SANS)
sans_shared_url = f'{BASE}/fonts/{sans_shared_name}'

n = diff_pages = diff_bytes = sdiff_pages = sdiff_bytes = 0
for p, (html, chars, sch) in pages.items():
    face = (f'@font-face{{font-family:{FAMILY};src:url({shared_url}) format("woff2");font-weight:500;font-display:swap}}')
    inject = f'<link rel="preload" href="{shared_url}" as="font" type="font/woff2" crossorigin>'
    diff = chars - shared
    if diff:
        dname = make(''.join(sorted(diff)) + ' ', 'd')
        durl = f'{BASE}/fonts/{dname}'
        inject += f'<link rel="preload" href="{durl}" as="font" type="font/woff2" crossorigin>'
        face += f'@font-face{{font-family:{FAMILY_X};src:url({durl}) format("woff2");font-weight:500;font-display:swap}}'
        diff_pages += 1; diff_bytes += sizes[dname]
    # 正文（T-12）：Regular 一個字重，同時承接 400 與 500（不假造粗體）。
    # 載入策略：首次到訪不搶頻寬——等 load 事件後 50ms 才註冊 @font-face（頁面先以系統黑體顯示，之後換成 TeaSans，CJK 字寬同為 1em，版面不跳）；
    # 到訪過的（localStorage 有記號，字體已在快取）一開始就註冊並 preload，不會見到換字。無 JS 時維持系統黑體。
    sdiff = sch - sans_shared
    sface = f'@font-face{{font-family:{SANS};src:url({sans_shared_url}) format("woff2");font-weight:400 500;font-display:swap}}'
    spre = [sans_shared_url]
    if sdiff:
        sname = make(''.join(sorted(sdiff)) + ' ', 'hd', a.sans_font, SANS)
        surl = f'{BASE}/fonts/{sname}'
        spre.append(surl)
        sface += f'@font-face{{font-family:{SANS_X};src:url({surl}) format("woff2");font-weight:400 500;font-display:swap}}'
        sdiff_pages += 1; sdiff_bytes += sizes[sname]
    inject += ('<script>(function(){var k="tea-sans-v1",css=' + json.dumps(sface) + ',pre=' + json.dumps(spre) + ';'
               'function go(){for(var i=0;i<pre.length;i++){var l=document.createElement("link");l.rel="preload";l.as="font";l.type="font/woff2";l.crossOrigin="";l.href=pre[i];document.head.appendChild(l)}'
               'var s=document.createElement("style");s.textContent=css;document.head.appendChild(s);try{localStorage.setItem(k,"1")}catch(e){}}'
               'var seen=false;try{seen=localStorage.getItem(k)==="1"}catch(e){}'
               'if(seen)go();else addEventListener("load",function(){setTimeout(go,50)})})()</script>')
    inject += f'<style>{face}</style>'
    open(p, 'w', encoding='utf-8').write(html.replace('</head>', inject + '</head>', 1))
    n += 1
print(f'字體處理完成：{n} 頁；標題共用層 {shared_name}（{len(shared)} 字，{sizes[shared_name] / 1024:.1f} KB）；'
      f'{diff_pages} 頁有標題差額層（平均 {diff_bytes / max(diff_pages, 1) / 1024:.1f} KB，最大 {max([v for k, v in sizes.items() if k.startswith("d-")] or [0]) / 1024:.1f} KB）')
print(f'正文共用層 {sans_shared_name}（{len(sans_shared)} 字，{sizes[sans_shared_name] / 1024:.1f} KB）；'
      f'{sdiff_pages} 頁有正文差額層（平均 {sdiff_bytes / max(sdiff_pages, 1) / 1024:.1f} KB，最大 {max([v for k, v in sizes.items() if k.startswith("hd-")] or [0]) / 1024:.1f} KB）')
