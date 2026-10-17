# hot-tea-in-repaired-cups 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：2（共生成 2 張）
- Codex session：`01a1473a-1d97-7830-a146-a7e9116c72db`
- 原檔：`/root/.codex/generated_images/01a1473a-1d97-7830-a146-a7e9116c72db/exec-68b81fc4-ed69-45df-9d02-e01f455b6fcc.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/hot-tea-in-repaired-cups.jpg`
- 揀選理由：白瓷杯一道連續金線由口沿而下，琥珀色茶湯、一縷熱氣、後方紫砂壺局部；100% 裁切金線無斷裂。候選 1 釉色偏灰、熱氣較弱，揀 2。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: a white porcelain tea cup with a single thin continuous gold kintsugi line from the rim, filled with amber Pu'er tea; a gentle wisp of steam over the rim; in the soft background, part of a small purple-clay teapot. Setting: dark aged wood tea table, ink-green wall, warm window light. Cup occupies about 40 percent of the frame placed right of centre, negative space on the left. Camera about 15 degrees above the table. Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
