# crackle-or-crack 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：2（共生成 2 張）
- Codex session：`01a14738-ea68-7d52-83b5-b718c19045c9`
- 原檔：`/root/.codex/generated_images/01a14738-ea68-7d52-83b5-b718c19045c9/exec-b403a354-694a-4472-8ace-76691975244d.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/crackle-or-crack.jpg`
- 揀選理由：左杯滿佈吃茶色開片、右杯一條穿過杯身的真裂，兩者一眼可分；兩口沿圓順對稱。候選 1 構圖較遠，揀 2。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: two celadon tea cups side by side on a pale grey stone surface; the left cup has a fine all-over network of crackle glaze (kaipian) whose lines have taken on a faint tea-brown tint; the right cup has one single true crack running down from the rim, clearly different from crackle (a straight-ish dark line through the body). Both rims round and symmetric. Setting: pale grey stone slab, soft ink-green blurred background. Cups occupy about 50 percent of the frame, centred slightly right, negative space on the left. Camera eye level. Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
