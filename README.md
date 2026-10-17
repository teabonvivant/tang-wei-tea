# 唐娓老師網站（tang-wei-tea）

Astro 7.4 純靜態網站，源碼取代原本只剩編譯檔的版本。設計：「墨綠茶室」。部署：GitHub Pages（GitHub Actions）。

- 正式網址（待唐老師審閱修器首批文章後切換）：https://teabonvivant.github.io/tang-wei-tea/
- 預覽網址：https://teabonvivant.github.io/tang-wei-tea-preview/（noindex，robots 全禁）

## 目錄

```
src/content/journal/*.md     茶間筆記 100 篇＋茶逢知己 33 篇（網址 /journal/<檔名>/）
src/content/repair/*.md      修器文章（網址 /repair/<檔名>/），封面圖在 src/assets/repair/
src/content/glossary.yaml    修補小詞典（網址 /repair/glossary/#<id>）
src/data/                    主題、專欄篇目、圖片尺寸表（images.json 由腳本生成）
src/pages/                   頁面與路由（sitemap.xml、robots.txt 也是這裏的 endpoint）
src/components, layouts      元件與版面
src/styles/global.css        全部樣式（色彩 token、字級、動畫）
src/scripts/site.js          全站唯一的腳本：選單、深淺色、詞條 popover、進場
plugins/remark-site.mjs      Markdown 擴充：[[詞條]]、站內連結加 base、圖片寬高
public/images/               全部舊圖片網址原樣保留（社交平台快取不會斷）
scripts/                     建置後字體處理、輸出檢查、一次性遷移腳本
research/                    內部資料，不會被打包：來源 YAML、生圖提示及紀錄
fonts-src/                   標題字體來源（昭源宋體 Medium，SIL OFL 1.1）
```

## 本機建置

需要 Node ≥ 22.22、Python 3（字體子集化用）。

```
npm ci
python3 -m pip install -r requirements.txt
npm run build                 # 輸出到 dist/
python3 -I scripts/check_dist.py dist --base /tang-wei-tea
```

環境變數：

| 變數 | 預設 | 說明 |
|---|---|---|
| `BASE` | `/tang-wei-tea` | 網址前綴。預覽版 `/tang-wei-tea-preview` |
| `SITE` | `https://teabonvivant.github.io` | 網站根網址（canonical、sitemap 用） |
| `PUBLIC_PREVIEW` | 空 | 設 `1`：全站 `noindex`、robots 全禁、不載入統計 |
| `PUBLIC_CF_BEACON_TOKEN` | 空 | Cloudflare Web Analytics 的 token；有值且非預覽才載入 beacon |
| `OUT_DIR` | `dist` | 建置後字體處理的輸出目錄 |

預覽式建置：`BASE=/tang-wei-tea-preview PUBLIC_PREVIEW=1 npm run build`。

## 建置做了甚麼

1. `astro build`：靜態輸出，`trailingSlash: always`、`build.format: directory`，154 個舊網址全部保留（`/topics/`、`/journal/`、`/works/` 等不變）。
2. `scripts/postbuild.mjs` → `scripts/subset_fonts.py`：按每頁實際出現的標題用字，把昭源宋體切成 woff2（每頁約 20 至 60 KB），寫入該頁 `<head>`。正文用系統字體。
3. CI 再跑 `scripts/check_dist.py`：舊網址、站外連結（只准 `wa.me`）、站外資源、AI 痕跡字串、破折號、title／description／canonical／og:image、每頁一個 h1、sitemap、圖片 alt 與寬高、站內斷鏈。任何一項不過，建置失敗。

## 加內容

- 修器文章：在 `src/content/repair/` 新增 Markdown，frontmatter 欄位見 `src/content.config.ts`（欄位不合，建置即失敗）。正文用 `[[詞條]]` 或 `[[顯示字|詞條名]]` 標記詞條（詞條必須在 `glossary.yaml`），站內連結寫 `/journal/<slug>/`、`/repair/<slug>/`（不要加 base）。事實來源寫在 `research/sources/repair/<slug>.yaml`，生圖提示寫在 `research/image-prompts/<slug>.md`。
- 封面圖：3:2、寬 ≥ 1536、JPG ≤ 450 KB，放 `src/assets/repair/<slug>.jpg`，並複製一份到 `public/images/repair/<slug>.jpg`（社交分享圖）。
- 新詞條：加到 `glossary.yaml`（`id` 用拼音小寫連字號）。
- 文字風格與驗收：`check_text.py`（在原構思段 `_plan/附件/驗收腳本/`）。唐老師審閱通過後，把文章 `review` 改為 `tang-wei-approved`。

## 部署與回滾

部署：推送到 `main` 即由 `ci/deploy.yml`（需複製到 `.github/workflows/`，推送 workflow 檔需要有 `workflow` 權限的憑證）建置並發佈到 GitHub Pages（Pages 來源須為「GitHub Actions」）。

**預覽 repo**（`teabonvivant/tang-wei-tea-preview`）：倉庫變數 `BASE=/tang-wei-tea-preview`、`PUBLIC_PREVIEW=1`。

**回滾**（兩種，視情況選）：

1. 還原上一個好的版本：`git revert <壞的 commit>` 後 push，Actions 會重新部署（約 2 至 3 分鐘）。或在 Actions 頁面對上一次成功的 workflow 按「Re-run all jobs」。
2. 回到改版前的舊編譯版（只適用於正式 repo `tang-wei-tea`）：
   ```
   gh api -X PUT repos/teabonvivant/tang-wei-tea/pages -f build_type=legacy -f 'source[branch]=backup/pre-rebuild-20261016' -f 'source[path]=/'
   ```
   舊版備份：tag `backup-20261016-pre-rebuild`、分支 `backup/pre-rebuild-20261016`、私人鏡像 `teabonvivant/tang-wei-tea-backup-20261016`。**不要刪除。**

回滾演練的實測步驟與時間見驗收報告（預覽 repo 做過一次）。

## 切換正式網站（待唐老師審閱第一批 8 篇後）

1. 唐老師審閱 8 篇修器文章，意見改好；對應文章 `review: tang-wei-approved`。
2. 在 `tang-wei-tea` 的 `astro` 分支跑完整驗收（預覽網址已驗證過；正式網址 base 為 `/tang-wei-tea`）。
3. 如要統計：在 Cloudflare 建 Web Analytics 站點（host 填 `teabonvivant.github.io`），把 token 設為倉庫變數 `PUBLIC_CF_BEACON_TOKEN`。
4. 把 `astro` 合併到 `main`（舊編譯檔已備份，見上）。
5. `gh api -X PUT repos/teabonvivant/tang-wei-tea/pages -f build_type=workflow`，Pages 來源改為 GitHub Actions；等 workflow 成功。
6. 抽查 154 條舊網址回 200（`scripts/legacy-routes.json`）、`/journal/?category=…` 轉址、404 頁、`sitemap.xml`。
7. 出問題即用上面的回滾 2。

## 設計與動畫備註

- 色彩 token、字級、動畫清單見 `src/styles/global.css` 開頭與構思報告第 5.5、5.6 節。金色只用於：首頁主圖金線、器物入口與修器目錄的金線及裂紋地圖、閱讀進度線。
- 動畫只動 `transform`、`opacity`、`stroke-dashoffset`；沒有 `scroll` 事件監聽；`prefers-reduced-motion: reduce` 時位移動畫停止、金線直接完整顯示、換頁過場關閉。
- 換頁過場用瀏覽器原生 cross-document view transition（Chrome／Edge 126+、Safari 18.2+）；Firefox 為普通換頁。

## 字體與授權

標題字體為昭源宋體（Chiron Sung HK），SIL Open Font License 1.1，來源 https://github.com/chiron-fonts/chiron-sung-hk 。`fonts-src/` 內為 Big5-HKSCS 字集的精簡版；網頁輸出的子集字體在 CSS 內以 `TeaSerif` 命名。Phosphor 圖示與舊站字體授權檔仍在 `public/licenses/`（如有保留）。
