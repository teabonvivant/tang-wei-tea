# grandmothers-bowl 封面圖生成紀錄

- 日期：2026-10-17
- 工具：`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium -i <錨點1> -i <錨點2> -s workspace-write "<提示>"`
- 風格錨點圖：`photography-v2/vessels-gaiwan.webp`、`tea.webp`
- 揀選候選：3（共生成 2 張，第一輪 2 張因窗台問題棄用、第二輪再生成 2 張）
- Codex session：`01a14740-c29d-79f1-81f1-3ce778e40d8b`
- 原檔：`/root/.codex/generated_images/01a14740-c29d-79f1-81f1-3ce778e40d8b/exec-3f92a5d1-618c-4ec0-9851-4fb128f07885.png`（1536×1024 PNG）→ 轉 JPG（品質 88）→ `site/src/assets/repair/grandmothers-bowl.jpg`
- 揀選理由：第二輪重生成：器物放在室內木桌上、窗在背景（不放窗台，因保存機構建議不要把修補器放在窗台受日曬與碰撞）；舊青花飯碗一道金線由口沿貫穿碗內外至圈足。候選 4 金線較斷續，揀 3。
- 放大檢查：100%／200% 裁切見 `_team_runs/batch1-1A-1C/驗收證據/images/crops/`，無手指、文字亂碼、口沿變形、重複物件、浮空物件。

## 提示

```
Use your image generation tool to generate ONE new image (do not write code, do not try to copy files; just generate the image and print its path). The attached images are style references only (light, colour, texture); do not copy their objects or composition. Photorealistic editorial still-life photograph for a Hong Kong tea teacher's journal, same photographic style as the reference images. Subject: an old blue-and-white porcelain rice bowl with simple floral lines, slightly worn, repaired with one fine gold line along a single continuous crack from the rim; beside it a folded piece of soft old cotton cloth. Setting: a low plain wooden table well inside a room (clearly NOT on a window sill), with a window softly out of focus in the background at left, afternoon side light from the left, soft muted ink-green wall. Bowl occupies about 40 percent of the frame, right of centre, negative space on the left. Camera about 25 degrees above the table. Soft natural window light from the left, gentle long shadows, shallow depth of field, 50mm lens look. Palette: muted ink green, warm grey stone, celadon and white porcelain, aged wood; restrained and matte. 3:2 landscape composition. No people, no hands, no faces, no text, no letters, no logos, no labels, no watermark. Avoid glossy CGI look, oversaturation, lens flare, glowing gold, duplicated objects, warped or asymmetric rims, floating objects.
```
