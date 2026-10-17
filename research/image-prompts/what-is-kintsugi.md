# what-is-kintsugi 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：1（共生成 2 張）
- Codex session：`01a14737-f200-71f0-b719-68219b7ad429`
- 原檔：`/root/.codex/generated_images/01a14737-f200-71f0-b719-68219b7ad429/exec-f35bc3d4-e4d3-4e2e-9baf-bac9ce2de39c.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/what-is-kintsugi.jpg`
- 揀選理由：金線由口沿起、沿一條連續裂紋走到碗腹，略高於釉面、啞金；開片釉紋自然；與 photography-v2 同為窗光靜物。候選 2 偏暗、金線較細，揀 1。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: a single grey-green celadon tea bowl repaired with kintsugi; one thin gold line follows a single continuous, physically plausible crack running from the rim down to the middle of the bowl; the gold line is 1-2 mm wide, slightly raised, satin (not glossy, not glowing). Setting: dark aged wooden tea table with a folded undyed linen cloth, deep ink-green wall behind. Bowl occupies about 40 percent of the frame placed right of centre, generous negative space on the left. Camera about 20 degrees above the table. Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
