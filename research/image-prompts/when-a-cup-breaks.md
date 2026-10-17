# when-a-cup-breaks 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：1（共生成 2 張）
- Codex session：`01a14737-f1e6-7b21-91e7-91b46525dd6c`
- 原檔：`/root/.codex/generated_images/01a14737-f1e6-7b21-91e7-91b46525dd6c/exec-64c5ec92-8e68-4e25-afa9-3221d01e3f06.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/when-a-cup-breaks.jpg`
- 揀選理由：四片斷口鋒利的白瓷碎片與小紙盒，無膠、無手；碎片大小合理。候選 2 的碎片形狀與杯形較不吻合，揀 1。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: a shallow wooden tray on a tea table; a white porcelain tea cup broken into four clean pieces, each piece laid apart on a folded plain linen cloth, with a small grey paper box holding a few tiny shards beside it. The pieces are realistic, with sharp fresh break edges and no glue. Setting: warm grey stone table surface, deep ink-green wall edge at the top of frame. Tray occupies about 50 percent of the frame, placed left of centre, negative space on the right. Camera A (angle: top-down about 70 degrees, view B). Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
