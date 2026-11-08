# 圖片畫風守則（P-21，opt3）

全站圖片只有兩套畫風，其餘都屬例外：

1. **主畫風：寫實紀實靜物攝影**（茶間筆記、茶逢知己、主題頁、首頁）
2. **修器：墨綠影棚**（`src/assets/repair/*.jpg` 八張修器封面，作為欄目識別，內文圖已是主畫風）

另有真人課堂照片（`teaching-*`、`youth-*`、`tang-organict-teaching`）與首頁主圖（`tea.webp`），屬紀實相，不重生。

## 主畫風的固定做法

- 光線：一側的自然窗光，柔和、有方向；夜景只用一盞暖色檯燈加窗外餘光，暗部要看得見細節。
- 材質：老胡桃木或深橡木桌面、亞麻布、淺色石板、白瓷、陶、竹；不用塑膠質感與純白無縫背景。
- 色調：低飽和、偏暖的泥土色；統計上亮度中位約 93、紅藍比約 1.33。冷灰、過暗（平均亮度 < 40）或高飽和的圖視為偏離。
- 構圖：3:2 橫幅，淺景深，前景有一件清楚的主體，不擠滿畫面。
- 人：不露臉；手只在需要時入鏡，五指正常、素色衣袖、無首飾。
- 禁止：任何文字、字母、數字、標誌、水印；手機屏幕與書頁用模糊或空白；示意圖／插畫／3D 渲染感；風景名勝的真實地標。
- 器物結構要對：蓋碗三件（蓋、碗、托）、公道杯有嘴、紫砂壺嘴與壺把相對、茶餅是圓餅形。

## 生圖流程

Codex CLI `gpt-6.1-sol`（`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium`），前綴固定如 `image-prompts/covers-opt3.md` 開頭；一次最多 5 張並行；輸出 1536×1024 PNG，用 `sharp`／Pillow 轉 1400／960／640 寬 WebP（quality 72／68／68）；逐張目視（手指、文字、器物結構）才採用，不合格重生。

## 偏離主畫風的現有圖（opt3 清點）

| 圖 | 偏離原因 | 處理 |
|---|---|---|
| `columns/*-v1`（7 張，茶逢知己舊封面） | 古風插畫感：綠色桌旗、水墨掛畫背景 | 已重生為主畫風（`cv-col-*`），舊檔保留作舊網址 |
| `photography-v2/daily-evening` | 過暗（平均亮度 27）、偏橘 | 封面已重生為 `cv-evening-choices`；原圖仍用於三篇文內 |
| `photography-v2/storage-sample-v2`、`vessels-cup`、`taste-cups`、`learning-coldpractice` | 冷灰色調、低飽和 | 封面已重生為暖木色（`cv-small-samples-first`、`cv-rim-of-a-cup`、`cv-blind-tasting-at-home`、`cv-practice-with-water`）；原圖仍用於文內 |
| `photography-v2/taste-notebook`、`brew-cool`、`brew-water`、`vessels-dry`、`craft-leaves-corrected`、`storage-pack`、`hosting-two` | 輕微偏冷灰（距離統計中位 3σ 內） | 未改：仍屬同一類寫實靜物，只作封面或文內，且重生會連帶改動多篇文內配圖，收益小 |
| `repair/*.jpg`（八張） | 墨綠影棚 | 未改：欄目識別，D-6 之後也不改 |
