#!/usr/bin/env python3
"""唐老師網站：建置輸出檢查（CI 閘門，只讀，不改任何檔案）。
來源：_plan/附件/驗收腳本/check_site.py；L1 例外只有 wa.me（Oliver 2026-10-17 決定）。


用法：
  python3 -I check_site.py <dist 目錄> [--base /tang-wei-tea] [--legacy legacy-routes.json] [--json 報告.json]

檢查項目（每項輸出 PASS/FAIL 及明細）：
  U1 舊網址保留：legacy-routes.json 內每條路徑在 dist 內都有 index.html（或 404.html）
  L1 頁面無外部連結：<a href> 指向站外（http/https/協定相對 //）的數目，允許清單見 ALLOW_HOSTS
  L2 頁面無外部資源：<img/script/link/iframe/source/video/audio> 的 src/href 指向站外的數目
  A1 AI 痕跡字串：BANNED 清單在可見文字中的出現次數必須為 0
  A2 破折號：可見文字中的「——」「—」「–」總數必須為 0
  S1 每頁 <title> 獨立、<meta description> 獨立且非空、有 canonical、有 og:image（404 除外）
  S2 每頁剛好一個 <h1>
  S3 sitemap.xml 存在並列出所有可索引頁
  I1 所有 <img> 有 alt（裝飾圖 alt="" 並帶 aria-hidden 或 role=presentation 才算合格）及 width/height
  K1 內部連結無斷鏈：所有站內 <a href> 指向的路徑在 dist 內存在
"""
import argparse, json, os, re, sys
from collections import Counter, defaultdict
from urllib.parse import urlparse, unquote
try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit('需要 beautifulsoup4 及 lxml')

ALLOW_HOSTS = {'wa.me'}  # Oliver 2026-10-17 決定的唯一例外
BANNED = ['情境配圖', '茶間編輯', '閱讀約', '分鐘閱讀', '參考來源', '資料來源', '延伸資料', '先留意', '讀這一頁',
          '可信度', '機構資料可查', '合成案例', '本頁採用', '生成圖片', 'AI 生成', 'AI生成', '示意插圖（AI',
          '值得一提的是', '總而言之', '綜上所述', '在這個快節奏', '讓我們一起', '不僅僅是', '畫龍點睛', '娓娓道來']
DASHES = ['——', '—', '–']

ap = argparse.ArgumentParser()
ap.add_argument('dist')
ap.add_argument('--base', default='/tang-wei-tea')
ap.add_argument('--site', default='https://teabonvivant.github.io')
ap.add_argument('--legacy', default=os.path.join(os.path.dirname(__file__), 'legacy-routes.json'))
ap.add_argument('--json')
a = ap.parse_args()
DIST, BASE = a.dist.rstrip('/'), a.base.rstrip('/')

html_files = []
for root, _, files in os.walk(DIST):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))
html_files.sort()

def route_of(p):
    rel = os.path.relpath(p, DIST).replace(os.sep, '/')
    if rel == 'index.html':
        return '/'
    if rel.endswith('/index.html'):
        return '/' + rel[:-len('index.html')]
    return '/' + rel

def exists_path(path):
    path = unquote(path.split('#')[0].split('?')[0])
    if not path.startswith(BASE + '/') and path != BASE:
        return None  # 不屬本站 base
    rel = path[len(BASE):].lstrip('/')
    cand = [os.path.join(DIST, rel), os.path.join(DIST, rel, 'index.html'), os.path.join(DIST, rel + '.html')]
    return any(os.path.isfile(c) for c in cand)

R = {}
def res(key, ok, detail):
    R[key] = {'pass': bool(ok), 'detail': detail}

# U1
legacy = json.load(open(a.legacy, encoding='utf-8')) if os.path.exists(a.legacy) else []
missing = [r for r in legacy if not (os.path.isfile(os.path.join(DIST, r.strip('/'), 'index.html')) if r != '/' else os.path.isfile(os.path.join(DIST, 'index.html')))]
res('U1 舊網址保留', not missing and legacy, {'legacy_total': len(legacy), 'missing': missing})

ext_links, ext_res, banned_hits, dash_hits = [], [], Counter(), Counter()
titles, descs = Counter(), Counter()
seo_problems, h1_problems, img_problems, broken = [], [], [], []
indexable = []
for p in html_files:
    rt = route_of(p)
    soup = BeautifulSoup(open(p, encoding='utf-8').read(), 'lxml')
    robots = soup.find('meta', attrs={'name': 'robots'})
    noindex = robots and 'noindex' in (robots.get('content') or '')
    refresh = soup.find('meta', attrs={'http-equiv': re.compile('refresh', re.I)})
    is404 = rt in ('/404.html', '/404/')
    for t in soup(['script', 'style', 'noscript', 'template']):
        if t.name != 'script' or not t.get('src'):
            pass
    # links
    for el in soup.find_all('a'):
        href = (el.get('href') or '').strip()
        if re.match(r'^(https?:)?//', href):
            host = urlparse(href if not href.startswith('//') else 'https:' + href).netloc
            if host and host not in ALLOW_HOSTS and not (a.site and a.site.endswith(host)):
                ext_links.append((rt, href))
        elif href.startswith('/'):
            ok = exists_path(href)
            if ok is False:
                broken.append((rt, href))
    for tag, attr in [('img', 'src'), ('script', 'src'), ('link', 'href'), ('iframe', 'src'), ('source', 'src'), ('video', 'src'), ('audio', 'src')]:
        for el in soup.find_all(tag):
            v = (el.get(attr) or '').strip()
            if tag == 'link' and (el.get('rel') and ('canonical' in el.get('rel') or 'alternate' in el.get('rel'))):
                continue
            if re.match(r'^(https?:)?//', v):
                host = urlparse(v if not v.startswith('//') else 'https:' + v).netloc
                if not (a.site and a.site.endswith(host)):
                    ext_res.append((rt, tag, v))
        for el in soup.find_all(['img', 'source']):
            ss = el.get('srcset') or ''
            for part in ss.split(','):
                u = part.strip().split(' ')[0]
                if re.match(r'^(https?:)?//', u) and not (a.site and a.site.endswith(urlparse(u).netloc)):
                    ext_res.append((rt, el.name + '[srcset]', u))
    # visible text
    body = soup.find('body')
    if body:
        for t in body(['script', 'style', 'noscript']):
            t.decompose()
        text = body.get_text(' ')
        for b in BANNED:
            n = text.count(b)
            if n:
                banned_hits[(b, rt)] += n
        for d in DASHES:
            n = text.count(d)
            if n:
                dash_hits[(d, rt)] += n
    if refresh or noindex or is404:
        continue
    indexable.append(rt)
    t = soup.find('title'); t = t.get_text(strip=True) if t else ''
    d = soup.find('meta', attrs={'name': 'description'}); d = (d.get('content') or '').strip() if d else ''
    c = soup.find('link', rel='canonical'); og = soup.find('meta', attrs={'property': 'og:image'})
    titles[t] += 1; descs[d] += 1
    if not t or not d or not c or not og:
        seo_problems.append({'route': rt, 'title': bool(t), 'description': bool(d), 'canonical': bool(c), 'og_image': bool(og)})
    h1s = soup.find_all('h1')
    if len(h1s) != 1:
        h1_problems.append((rt, len(h1s)))
    for im in soup.find_all('img'):
        alt = im.get('alt')
        deco = im.get('aria-hidden') == 'true' or im.get('role') in ('presentation', 'none')
        if alt is None or (alt == '' and not deco) or not im.get('width') or not im.get('height'):
            img_problems.append((rt, im.get('src'), alt))

res('L1 頁面無外部連結', not ext_links, {'count': len(ext_links), 'examples': ext_links[:30]})
res('L2 頁面無外部資源', not ext_res, {'count': len(ext_res), 'examples': ext_res[:30]})
res('A1 AI 痕跡字串', not banned_hits, {'count': sum(banned_hits.values()), 'by_string': Counter({k[0]: 0 for k in banned_hits}) and dict(Counter({b: sum(v for (bb, _), v in banned_hits.items() if bb == b) for b in {k[0] for k in banned_hits}})), 'examples': [f'{k[0]} @ {k[1]} ×{v}' for k, v in list(banned_hits.items())[:30]]})
res('A2 破折號', not dash_hits, {'count': sum(dash_hits.values()), 'examples': [f'{k[0]} @ {k[1]} ×{v}' for k, v in list(dash_hits.items())[:20]]})
dup_t = [t for t, n in titles.items() if n > 1]; dup_d = [d for d, n in descs.items() if n > 1]
res('S1 標題/描述/canonical/OG', not seo_problems and not dup_t and not dup_d, {'problems': seo_problems[:30], 'dup_titles': dup_t[:10], 'dup_descriptions': dup_d[:10]})
res('S2 每頁一個 h1', not h1_problems, {'problems': h1_problems[:30]})
sm = os.path.join(DIST, 'sitemap.xml')
locs = set()
if os.path.exists(sm):
    s = open(sm, encoding='utf-8').read()
    locs = set(re.findall(r'<loc>([^<]+)</loc>', s))
    # sitemap index 支援
    for sub in re.findall(r'<loc>([^<]+sitemap[^<]*\.xml)</loc>', s):
        fp = os.path.join(DIST, urlparse(sub).path[len(BASE):].lstrip('/'))
        if os.path.exists(fp):
            locs |= set(re.findall(r'<loc>([^<]+)</loc>', open(fp, encoding='utf-8').read()))
paths = {urlparse(l).path for l in locs}
not_in_sm = [r for r in indexable if (BASE + r) not in paths and (BASE + r.rstrip('/') + '/') not in paths]
res('S3 sitemap 完整', os.path.exists(sm) and not not_in_sm, {'sitemap_exists': os.path.exists(sm), 'indexable_pages': len(indexable), 'missing_in_sitemap': not_in_sm[:30]})
res('I1 圖片 alt 與尺寸', not img_problems, {'count': len(img_problems), 'examples': img_problems[:30]})
res('K1 站內無斷鏈', not broken, {'count': len(broken), 'examples': broken[:30]})

ok_all = all(v['pass'] for v in R.values())
for k, v in R.items():
    print(('PASS ' if v['pass'] else 'FAIL ') + k)
    if not v['pass']:
        print('     ', json.dumps(v['detail'], ensure_ascii=False)[:900])
print('\n總結：', '全部通過' if ok_all else '有不合格項目', f'（HTML 頁數 {len(html_files)}，可索引 {len(indexable)}）')
if a.json:
    json.dump(R, open(a.json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
sys.exit(0 if ok_all else 1)
