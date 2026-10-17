#!/usr/bin/env python3
"""由 _plan/附件/site-pages.json 遷移 133 篇文章為 Markdown（只需執行一次，結果已入庫）。
用法：python3 -I scripts/migrate_articles.py <site-pages.json> <輸出目錄 src/content/journal> <差異清單 diff.csv>
"""
import json, os, re, sys, csv
from urllib.parse import urlparse, unquote
src, out, diffcsv = sys.argv[1:4]
TOPIC = {'入門沖泡':'brewing','感官品飲':'senses','普洱筆記':'puer','器物之間':'vessels','買茶與存茶':'storage',
         '茶席待客':'hosting','製茶與風土':'craft','茶與日常':'daily','學茶與教學':'learning','文化與閱讀':'culture'}
FIX = {  # 刻意修改：破折號
 '開心與滿足——也就是我們常說的愉悅感': '開心與滿足，也就是我們常說的愉悅感',
 '新的功課——嘗試不同的沖泡手法': '新的功課：嘗試不同的沖泡手法',
}
pages = json.load(open(src, encoding='utf-8'))
os.makedirs(out, exist_ok=True)
diffs = []
def q(s): return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'
n = 0
for r in pages:
    if r.get('type') != 'article': continue
    slug = r['route'].split('/')[-1]
    col = r['category'] == '茶逢知己'
    lines = ['---', f'title: {q(r["h1"])}', f'series: {"column" if col else "notes"}']
    if not col: lines.append(f'topic: {TOPIC[r["category"]]}')
    lines += [f'date: {r["date"]}', f'excerpt: {q(r["lead"])}',
              f'cover: {q(r["cover"]["src"])}', f'coverAlt: {q(r["cover"]["alt"])}']
    if col:
        s = r['sources'][0]
        hid = re.search(r'/article/(\d+)/', s['href']).group(1)
        lines += ['column:', f'  printedOn: {r["date"]}', f'  hketId: {q(hid)}']
    lines.append('related:')
    for x in r['related']: lines.append(f'  - {x.split("/")[-1]}')
    lines.append('---')
    body = []
    for b in r['blocks']:
        if b['type'] == 'p':
            t = b['text']
            for k, v in FIX.items():
                if k in t:
                    diffs.append([slug, '破折號改寫', k, v]); t = t.replace(k, v)
            body.append(t)
        elif b['type'] == 'figure':
            body.append(f'![{b["alt"]}]({b["src"]})')
            # 圖上「情境配圖」標籤移除
    if r.get('signature') and not col:
        diffs.append([slug, '移除簽名', r['signature'], ''])
    if r['sources'] and not col:
        for s in r['sources']:
            diffs.append([slug, '移除外連（延伸資料）', s['text'], s['href']])
    open(os.path.join(out, slug + '.md'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n\n' + '\n\n'.join(body) + '\n')
    n += 1
with open(diffcsv, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f); w.writerow(['slug', '類型', '原文', '新文／網址']); w.writerows(diffs)
print('migrated', n, 'diffs', len(diffs))
