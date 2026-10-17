# is-it-real-gold 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：1（共生成 2 張）
- Codex session：`01a14739-ed11-7e81-99ca-ba38cc301328`
- 原檔：`/root/.codex/generated_images/01a14739-ed11-7e81-99ca-ba38cc301328/exec-3d325b02-4ace-4081-9d29-894a5b3bb119.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/is-it-real-gold.jpg`
- 揀選理由：三碟色澤明顯不同（暖金、偏紅黃銅、啞光淺金），旁有細毛筆與絲綿，無文字。候選 2 毛筆接近畫面邊緣，揀 1。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: three small white porcelain dishes in a row, each holding a small mound of a different gold-coloured powder: one a warm fine yellow-gold, one a reddish brass tone, one a flat pale matte imitation gold; beside them a fine thin brush and a small wisp of silk cotton. Setting: warm grey stone slab, linen cloth edge, dark ink-green background. Objects occupy about 50 percent of the frame along the lower two thirds, negative space at the top. Camera top-down about 60 degrees. Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
