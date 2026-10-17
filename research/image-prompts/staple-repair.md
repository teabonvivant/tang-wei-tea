# staple-repair 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：2（共生成 2 張）
- Codex session：`01a14738-fbc5-7da3-b8ef-1f0df4c4556a`
- 原檔：`/root/.codex/generated_images/01a14738-fbc5-7da3-b8ef-1f0df4c4556a/exec-3727af66-1c09-4f4e-ad7a-0410b9031aa1.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/staple-repair.jpg`
- 揀選理由：一排五枚銅鋦釘垂直跨過一條連續裂縫，間距大致相等，釘腳入孔；灰綠粗陶、舊木桌。候選 1 裂縫斜度過大，揀 2。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: a grey-green rustic stoneware tea bowl with one long crack across its side, repaired with a row of five small copper staples (traditional Chinese ju-ci staple repair); every staple bridges the crack at a right angle and both legs of each staple sit in small drilled holes on either side; the staples are evenly spaced, dull aged copper. Setting: old worn wooden table, soft plain wall behind in muted ink green. Bowl occupies about 45 percent of the frame, left of centre, negative space on the right. Camera about 30 degrees above the table. Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
