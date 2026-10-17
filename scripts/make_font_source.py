#!/usr/bin/env python3
"""由完整的昭源宋體（Chiron Sung HK Medium，OFL）切出「Big5-HKSCS 字集＋標點＋拉丁」精簡來源檔 fonts-src/ChironSungHK-M-hk.ttf。
用法：python3 -I scripts/make_font_source.py <完整 ttf> <輸出 ttf>   需要 fonttools（pip install fonttools brotli）
"""
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
src, out = sys.argv[1:3]
chars = set()
for b1 in range(0x81, 0xFE):
    for b2 in list(range(0x40, 0x7F)) + list(range(0xA1, 0xFF)):
        try:
            chars.add(bytes([b1, b2]).decode('big5hkscs'))
        except Exception:
            pass
chars |= {chr(c) for c in range(0x20, 0x7F)} | set('，。、；：？！「」『』（）《》〈〉…·‧—～﹏％＋－＝＠＃＄＆＊')
chars |= {chr(c) for c in range(0x3000, 0x3040)} | {chr(c) for c in range(0xFF01, 0xFF5F)}
opts = subset.Options(); opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True; opts.glyph_names = False
f = TTFont(src)
s = subset.Subsetter(opts); s.populate(text=''.join(sorted(chars))); s.subset(f)
f.save(out)
print('chars', len(chars))
