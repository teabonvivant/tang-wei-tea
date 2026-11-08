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
src/lib/schedule.ts          課程頁「最新班期」：建置時讀客服知識庫 CSV（見下）
scripts/                     建置後字體處理、輸出檢查、一次性遷移腳本；make_hero_avif.mjs（首頁主圖 AVIF）、make_jpg_variants.mjs（內文 JPG 640／960 縮圖）、make_brand_assets.py（favicon、apple-touch-icon、og-default.jpg）、make_og.mjs（建置後為每篇文章出 1200×630 分享圖，只進 dist）
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

未裝 fonttools 時建置會失敗；可先 `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`，再以 `PYTHON=.venv/bin/python npm run build` 建置。

預覽 repo 的部署目前用 gh-pages 分支（`scripts/publish_gh_pages.sh`）；`ci/deploy.yml` 待取得 `workflow` 權限後放入 `.github/workflows/` 即轉為 GitHub Actions 部署。預覽的 `robots.txt` 在 `/tang-wei-tea-preview/` 下，爬蟲只讀網域根目錄，實際擋收錄的是每頁的 meta noindex。

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
2. `scripts/postbuild.mjs` → `scripts/subset_fonts.py`：標題字體（昭源宋體）與正文字體（昭源黑體 Chiron Hei HK Regular）各切兩層 woff2 寫入每頁 `<head>`。標題：共用層 `fonts/tea-<hash>.woff2`（全站標題用字中出現頁數最多的 200 字＋ASCII 與標點，約 48 KB，所有頁同一檔名，第二頁起命中快取）；差額層 `fonts/d-<hash>.woff2`（該頁用到而共用層沒有的字，平均約 5 KB）以 `TeaSerifX` 家族補在 `--serif` 字體堆疊第二位。`--shared-size` 可調共用層字數。正文（T-12／D-7）：共用層 `fonts/hei-<hash>.woff2`（全站正文用字中出現頁數最多的前 N 字，N 由腳本按 `--sans-budget`〔預設 120 KB〕自動取最大值，約 900 字，所有頁同一檔名）＋差額層 `fonts/hd-<hash>.woff2`（`TeaSansX`，平均約 9 KB）；`--sans` 堆疊先 `TeaSans`、`TeaSansX`，再退回系統黑體；`font-display: swap`；**載入策略**：首次到訪等 `load` 事件後 50ms 才註冊 `@font-face`（先以系統黑體顯示，不搶主圖與 LCP 的頻寬；實測立即載入令首頁手機 LCP 由 2.3 秒升到約 3.0 秒），到訪過的（`localStorage` 有 `tea-sans-v1`）一開始就註冊並 preload，不見換字；無 JS 維持系統黑體。子集內部字體名一律改為 TeaSans（OFL 保險做法）。
3. `scripts/make_og.mjs`：由每篇封面置中裁出 `dist/images/og/<slug>.jpg`（1200×630 JPG），對應 Base 的 og:image。
4. CI 再跑 `scripts/check_dist.py`：舊網址、站外連結（只准 `wa.me`）、站外資源、AI 痕跡字串、破折號、title／description／canonical／og:image、每頁一個 h1、sitemap、圖片 alt 與寬高、站內斷鏈。任何一項不過，建置失敗。

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

- 首頁主圖（`index.astro`＋`global.css` 的 `.hero-stage`）：以 `--cx／--cy` 指定裂杯落在畫面哪裏、`--z` 為放大倍數，`clamp` 保證圖片蓋滿；金線（`crack`／`branch` 兩條路徑，原圖 1400×933 座標，另有光暈層）畫在深色遮罩之上，圖片 decode 完成（`site.js` 加 `.ready`）後才以 900ms ease-out 畫出，無 JS 或減少動態時直接完整顯示。手機與直向平板用 1400px 實寬、裂杯在上半部中央。改圖或改裁切後要目視核對金線仍沿杯身。
- 文章頁 h1、署名、導言逐件上移（600ms／90ms），封面 `clip-path` 揭開 900ms；由目錄經共用元素過場進入時（`html.vt-in`）不再揭開。正文不動。
- 結構化資料：Base 自動補 WebPage／CollectionPage／AboutPage／ContactPage＋BreadcrumbList（麵包屑由 `crumbsFor(path)` 推出，文章頁自帶）；文章 `dateModified` 取內容檔的 git 最後修改日（建置需要完整 git 歷史，CI 已設 `fetch-depth: 0`），`datePublished` 取 frontmatter；專欄原文不給 dateModified。

- 色彩 token、字級、動畫清單見 `src/styles/global.css` 開頭與構思報告第 5.5、5.6 節。金色只用於：首頁主圖金線、器物入口與修器目錄的金線及裂紋地圖、閱讀進度線。
- 動畫只動 `transform`、`opacity`、`stroke-dashoffset`；沒有 `scroll` 事件監聽；`prefers-reduced-motion: reduce` 時位移動畫停止、金線直接完整顯示、換頁過場關閉。
- 換頁過場用瀏覽器原生 cross-document view transition（Chrome／Edge 126+、Safari 18.2+）；Firefox 為普通換頁。

## 第二期（opt2）加入的功能與維護備註

- **站內搜尋**（P-04）：建置時輸出 `/search.json`（筆記、專欄、修器、詞條；標題、分類、摘要、正文前 1,500 字），`SearchBox.astro` 放在 `/journal/`（含分頁）頂與手機選單頂，頁首桌面版有放大鏡連到 `/journal/#search`。前端只在第一次聚焦輸入框時才下載索引，比對在瀏覽器內完成（所有關鍵字都要出現；標題＞摘要＞正文計分），沒有外部請求。沒有用 Pagefind：中文片語比對自製即可，且不增加建置依賴。`/journal/?q=蓋碗` 會預填搜尋。
- **導覽**（P-05 方案甲）：桌面 茶知識｜文章（下拉：茶間筆記／茶逢知己）｜器物｜修器｜課程｜關於；手機選單同一套頂層次序。下拉是 `button[aria-expanded]`，滑鼠停留、點擊、Enter／Space 皆可開，Esc 關閉並把焦點還給按鈕，焦點離開即關。導覽資料只在 `Header.astro` 頂部。
- **目錄密度**（P-07）：`/journal/` 每頁 24 篇（`JOURNAL_PER_PAGE` 在 `lib/site.ts`，sitemap、分頁都讀它），舊版 12 頁的第 7–12 頁留一頁 meta refresh 轉向（noindex）；目錄用 `ArticleCard variant="compact"`（手機左圖右文只留分類與標題，≥640px 加兩行摘要，≥1000px 兩欄）。`/columns/` 按刊出月份分組，每篇有摘要與小圖。主題頁頂 3 行導讀與 description 在 `src/data/topics.json`（`pageIntro`、`description`，人手寫）。
- **最新班期**（P-11）：`lib/schedule.ts` 在建置時讀 `/home/workspace/古樹茶文化學會 AI 客服/knowledge_base_master_filled_v4.csv`（環境變數 `COURSE_CSV` 可改路徑），只取 `business_name=茶藝師班`、`intent_name=最新班期`、`status=active`、有班別代號、且結束日不早於今天（香港時間）的列；只讀班別、日期、時間、地點，**學費、剩餘名額、內部備註一律不讀**。讀不到檔或沒有符合的班，整個區塊與 `Course` 的 `hasCourseInstance` 都不輸出。班期是建置時快照：知識庫更新或有班期過期後，要重新建置部署頁面才會變。`FAQPage`＋`Course`（provider＝香港古樹茶文化學會）JSON-LD 在 `courses.astro`。
- **description**（P-16）：頁面與主題頁人手寫 60–90 字；文章用 `seo.description`，缺或不足 50 字時由 `metaDescription()`（`lib/site.ts`）以摘要加出處句補足；`check_dist.py` 的 D1 檢查全站可索引頁 50–110 字。
- **RSS／sitemap**（P-27）：`/rss.xml`（茶間筆記＋修器，專欄原文不放）；sitemap 每條 `lastmod` 取內容檔 git 最後修改日（目錄頁取成員最新日期；淺層複製取不到就不寫）。
- **字級五級**（T-02、T-03）：`--fs-small／body／lead／head／display` 五個 `clamp()` 變數，全站不再寫 px 字級。`display` 依頁面型別在容器內覆寫（`.article-head`、`.repair-hero`；首頁 hero h1 另有 `clamp(33px, 4.4vw + 17px, 84px)`，手機 33px 是為了讓第二行 9 個字不折行）。實測每頁只用 5 種字級。
- **不畫線**（T-04）：列表、群組、系列導覽、頁尾改用留白與 `--surface` 色階；保留線條的只有 FAQ 與表單。頁首沒有底線，捲離頁頂後背景轉 `--surface`（`site.js` 以頂部哨兵的 IntersectionObserver 加 `data-scrolled`，不監聽 scroll）。
- **入場分法**（M-02）：`data-stagger` 的值決定動作——`list`（逐行 16px／60ms）、`figure`（`scale(1.03)→1`，700ms）、`statement`（逐行 24px／90ms，700ms）、`cards`（逐張 70ms，最多 6 張）；只在元素「確定在視窗外」時才先隱藏，`--i` 按同一批進入視窗的次序計。全部寫在 `prefers-reduced-motion: no-preference` 內。
- **FAQ 開合**（M-05）：`.faq-body` 以 `grid-template-rows: 0fr→1fr`（320ms）；`site.js` 加 `.anim` 才啟用，沒有 JS 或減少動態時是原生 `<details>`。
- **換頁共用元素**（M-07）：目錄卡片標題（`ArticleCard` 的 `.vt-title`）與文章 h1 共用 `view-transition-name: t-<slug>`（封面是 `c-<slug>`）；同一頁每個名稱只可出現一次。
- **裂紋地圖**（T-06、P-10、M-08）：`CrackMap.astro` 有桌面與手機兩個 viewBox（≥900px 左碗右字，碗高約 70svh；手機碗在上、連結兩欄在碗下）；五條裂紋用折線畫，`site.js` 在碗進入視窗時加 `.drawn`，依次畫出（`--n` × 120ms，900ms ease-out）。

### 動畫效能守則（日後任何改動都要守）

1. 只動 `transform`、`opacity`、`clip-path`；`grid-template-rows` 只准用在 FAQ；金線動 `stroke-dashoffset`。
2. 每頁載入時移動的元素 8–12 件；hero 最多 4 件。
3. 入場動畫不可令 LCP 元素延後：主圖淡入 ≤ 600ms。
4. 所有入場寫在 `@media (prefers-reduced-motion: no-preference)` 內；內容預設可見（減少動態與無 JS 都是完成狀態）。
5. 任何新動畫都要在 iPhone Safari 與一部 Android 中階機實測一次；伺服器截圖不作幀率證據。

## 第三期（opt3）加入的功能與維護備註

- **封面規則**（P-20）：每個封面最多 2 篇使用——茶間筆記一篇一張（`photography-v2/cv-<slug>.webp`），茶逢知己 33 篇最多兩篇共用一張，筆記與專欄不混用同一張；封面不與同一篇文內插圖相同。新增文章要先生一張專屬封面（提示與流程見 `research/image-prompts/covers-opt3.md`、畫風守則見 `research/image-style.md`）。分配可用 repo 外的檢查腳本核對，或在 `src/content/journal/*.md` 抽出 `cover:` 欄位逐張計數。
- **首頁四段四種形狀**（T-05）：器物＝深色全寬帶（`.band-feature`，金繕碗相滿版、字壓左下）；茶逢知己＝索引列（`.column-index`，最近 5 篇專欄，桌面 hover 或鍵盤聚焦於右側顯示該篇小圖，手機只列標題）；課堂＝置中陳述句＋滿寬課堂相（`.statement-band`）；青年與茶＝左直幅人像右文（`.youth-split`）。任何兩個相鄰段落版面不同。
- **卡片 hover**（T-09）：只有 `.card.feature` 與 `.gate` 放大 `scale(1.03)`／400ms；其餘卡片 hover 只亮 `brightness(1.04)`＋標題底線。
- **頁尾**（T-10）：兩行——品牌一句＋六個最常用連結；版權、聯絡、文字與圖片說明、外觀切換。其餘連結在各頁與選單。
- **對話書面語**（P-15／D-4）：茶間筆記的對話一律書面語，不用粵語字（係、嘅、唔、咁、佢、冇、啲、咗、喺、哋、嚟、咩、嗰、呢、點解、好飲等）；茶逢知己原文不動。

## 字體與授權

標題字體為昭源宋體（Chiron Sung HK），正文字體為昭源黑體（Chiron Hei HK，Regular 字重），皆 SIL Open Font License 1.1，來源 https://github.com/chiron-fonts/chiron-sung-hk 、https://github.com/chiron-fonts/chiron-hei-hk 。`fonts-src/` 內為 Big5-HKSCS 字集的精簡版（`scripts/make_font_source.py` 由完整 ttf 切出）；網頁輸出的子集字體在 CSS 內分別以 `TeaSerif`、`TeaSans` 命名。授權檔在 `public/licenses/`。正文只出 Regular 一個字重，同時承接 400 與 500（`<strong>` 等 ≥600 由瀏覽器合成粗體）。Phosphor 圖示與舊站字體授權檔仍在 `public/licenses/`（如有保留）。
