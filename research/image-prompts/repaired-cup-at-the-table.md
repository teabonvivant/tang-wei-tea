# repaired-cup-at-the-table 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：2（共生成 2 張）
- Codex session：`01a1473b-29e9-7522-a4d7-c4f73522d834`
- 原檔：`/root/.codex/generated_images/01a1473b-29e9-7522-a4d7-c4f73522d834/exec-fb1ff33c-070e-4639-9324-2ef2f5afe464.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/repaired-cup-at-the-table.jpg`
- 揀選理由：俯拍兩人茶席：主人位青瓷杯帶金線，客位素白杯，墨綠麻布桌面留白、一枝小花。候選 1 金線幾乎看不見，揀 2。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: an overhead view of a two-person tea setting: at the host's place a celadon tea cup with a fine gold kintsugi line, at the guest's place a plain white cup; a single small flower sprig in a tiny vessel; generous empty table space between. Setting: deep ink-green tablecloth. Cups occupy about 35 percent of the frame, negative space around. Camera top-down about 80 degrees. Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
