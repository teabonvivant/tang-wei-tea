# 封面生成提示與檢查記錄（opt3，P-20／P-21）

生成：Codex CLI `gpt-6.1-sol`（`codex exec --skip-git-repo-check -m gpt-6.1-sol -c model_reasoning_effort=medium`），一次最多 5 張並行，輸出 1536×1024 PNG，轉 1400／960／640 WebP（quality 72／68／68）放 `public/images/photography-v2/cv-*.webp`。

## 提示前綴（每張相同）

Generate exactly one photograph with your image generation tool (do not write code). Realistic editorial still-life / documentary photography, 3:2 landscape, soft natural window light from one side, muted earthy palette, natural materials (aged walnut or dark oak, linen, pale stone, white porcelain), shallow depth of field, calm quiet mood, no faces, no text, no letters, no numbers, no logos, no watermark. Any hands must be natural, with exactly five fingers each and correct anatomy, plain sleeves, no jewellery. Subject: 

## 檢查記錄

- 80 張新封面全部逐張目視（縮圖總覽＋手部、書頁、屏幕等風險圖放大）：手指數量與姿勢、無可讀文字、器物結構（蓋碗三件、壺嘴與壺把、茶餅圓形、公道杯有嘴）均合格，沒有圖需要因畫面錯亂而重生。
- 1 張（`cv-raw-ripe-first-lesson`）第一次 Codex 進程卡住逾 6 分鐘，中止後以同一提示重跑，成品合格。
- 另有 5 張屬 P-21 畫風重生（偏冷灰或過暗的現有封面改為暖木色）。

## 分配規則與結果

- 筆記 100 篇：62 篇換新封面（含 5 篇 P-21 重生、1 篇 `raw-ripe-first-lesson` 因原封面與文內圖相同而重做），其餘 38 篇保留各自最貼題的一張現有封面，一篇一張，不再共用。
- 茶逢知己 33 篇：7 張古風插畫感舊封面重生為主畫風；其餘按題材兩篇共用一張（最多 2 篇），不與筆記共用。
- 封面不與同一篇文內插圖相同。結果：126 張不同封面，最多 2 篇共用（共 7 張，皆茶逢知己）。

## 筆記封面（新）

| 文章 | 封面檔 | 圖說（alt） | 提示（英文） |
|---|---|---|---|
| a-small-tea-break | `cv-a-small-tea-break.webp` | 教室茶桌上一隻留着茶痕的白瓷杯與疊好的杯子 | a single white porcelain tea cup with a faint dried tea ring on its inner wall, left on a pale wooden classroom desk beside a stack of rinsed cups on a tray, late afternoon light. |
| after-the-city | `cv-after-the-city.webp` | 玄關地上的鞋與布袋，遠處桌上亮着燈的茶具 | a quiet entryway at night: a pair of shoes and a bag just dropped by the door, and beyond them, softly lit, a small table with an electric kettle and a single white gaiwan; warm lamp light, no people. |
| aftertaste-and-time | `cv-aftertaste-and-time.webp` | 石板桌面上喝空的白瓷杯與一滴茶 | an emptied small porcelain tea cup seen from slightly above on a dark slate surface, a thin golden film drying on its inner wall, one single drop of tea beside it, soft side light, very quiet. |
| age-is-not-everything | `cv-age-is-not-everything.webp` | 舊紙包着的普洱茶餅與一杯琥珀色的茶 | an old pu-erh tea cake in a yellowed paper wrapper with a blank paper slip tucked in, resting beside a modest white cup of amber tea on a wooden table, soft side light, no writing visible. |
| aroma-is-a-description | `cv-aroma-is-a-description.webp` | 蓋碗蓋上的乾茶葉，旁邊放着蘭花、陳皮與桂花 | an upturned white gaiwan lid holding a few dry tea leaves, beside a small orchid sprig, a piece of orange peel and a few osmanthus flowers on a dark wooden table, as if comparing scents, soft light. |
| ask-a-teacher | `cv-ask-a-teacher.webp` | 茶桌上亮着對話框的手機、蓋碗與茶杯 | a smartphone lying on a wooden tea table beside a white gaiwan and a cup of pale tea, the screen softly glowing with a single blank chat bubble (no readable text), window light, no hands. |
| ask-before-pouring | `cv-ask-before-pouring.webp` | 為客人備下的一杯清水，茶罐與蓋碗退到桌角 | a clear glass of plain water placed on a small tray at a guest's seat, while a closed tea caddy and a gaiwan have been pushed to the far corner of the table, a kettle on a stove softly blurred behind, warm afternoon light. |
| bitterness-and-astringency | `cv-bitterness-and-astringency.webp` | 白瓷茶匙盛着琥珀色的茶湯，旁邊散着乾茶葉 | close-up of a white porcelain tasting spoon holding a little amber tea above a small white bowl, a gentle wisp of steam, a few tea leaves on dark wood, dramatic side light. |
| buying-less-tea | `cv-buying-less-tea.webp` | 木桌上一小包茶，身後是擺滿茶罐的貨架 | one single small sealed tea pack with a tiny wooden scoop on a pale wooden table in sharp focus, while behind it, softly blurred, rows of many tea tins and bags crowd a shop shelf. |
| certificate-and-practice | `cv-certificate-and-practice.webp` | 紮好的證書卷、蓋碗、茶杯與一本空白筆記 | a rolled paper certificate tied with a thin cotton cord lying beside a white gaiwan and a small cup on a wooden table, a pencil and an open blank notebook, soft afternoon light, no writing legible. |
| children-observe-tea | `cv-children-observe-tea.webp` | 孩子的手捏起一片乾茶葉，旁邊放着放大鏡 | a single dry rolled tea leaf on a white saucer beside a small magnifying glass, a child's small hand reaching in from the edge of frame to turn the leaf over, soft window light, only the hand visible. |
| choose-a-tea-course | `cv-choose-a-tea-course.webp` | 木桌上並排的四張空白課程單張與一隻蓋碗 | four blank cream-coloured folded course leaflets fanned out on a wooden table beside a white gaiwan and a pencil, one leaflet turned face down, soft window light, no writing. |
| closing-a-tea-gathering | `cv-closing-a-tea-gathering.webp` | 夜裏的茶桌，空杯、揭開的杯蓋與爐上的水壺 | end of an evening tea gathering: a kettle steaming on a small stove in the background, in the foreground an emptied cup with its lid off beside a pushed-back chair, warm low lamp light, no people. |
| compare-with-a-classmate | `cv-compare-with-a-classmate.webp` | 兩隻蓋碗並排，兩個公道杯裏一深一淺的茶湯 | top-down view of two identical white gaiwans side by side on a dark tray with two glass fair-cups, one holding deep amber tea and the other pale gold, a small dish of the same dry tea beside each, soft light. |
| cup-not-full | `cv-cup-not-full.webp` | 手持着只斟到七分滿的白瓷小杯 | close-up of a hand holding a small white tea cup by its empty upper part with fingertips, the tea filling only about two thirds of the cup with a clear gap below the rim, soft light, dark background. |
| daily-puer | `cv-daily-puer.webp` | 敞開蓋的陶罐裝着散普洱，旁邊是一隻日常用的白馬克杯 | a plain ceramic jar of loose pu-erh with its lid off beside a sturdy everyday mug of dark red tea on a kitchen table in morning light, a wrapped gift tea cake softly blurred high on a shelf behind. |
| first-gaiwan | `cv-first-gaiwan.webp` | 一隻手按着蓋碗的蓋鈕，熱氣從碗中升起 | a hand holding a white gaiwan with the thumb on the lid knob and the lid slightly tilted, steam rising, the other fingers resting naturally at the rim, close-up, dark blurred background, correct hand anatomy. |
| flowers-near-tea | `cv-flowers-near-tea.webp` | 茶盤一角的玻璃小瓶與一枝白花，前面是蓋碗和兩隻小杯 | a low clear glass vase of water holding a single white blossom branch at the far corner of a tea tray, kept apart from a gaiwan and two cups in front, a small cloth beside, soft window light, dark green wall. |
| fresh-leaf-to-tea | `cv-fresh-leaf-to-tea.webp` | 三隻白碟依次盛着鮮葉、萎凋後的葉與成品乾茶 | three white dishes in a row on a wooden table showing the stages of tea: fresh green leaves, softly withered leaves, and finished dark dry tea leaves, soft top-side light. |
| fridge-and-tea | `cv-fridge-and-tea.webp` | 雪櫃層架上的茶葉罐，旁邊是雞蛋與玻璃罐 | a small sealed tea tin sitting on a refrigerator shelf beside eggs and a glass jar, cool white light, a little condensation on the tin, inside of a fridge photographed straight on. |
| heritage-in-the-everyday | `cv-heritage-in-the-everyday.webp` | 水槽邊布上倒扣着一排洗好的白瓷茶杯 | a classroom sink corner after class, a row of white tea cups turned upside down on a folded cloth beside the sink, a drip of water, a wet cloth, soft evening window light, no people. |
| home-tea-tastes-different | `cv-home-tea-tastes-different.webp` | 家裏餐桌上的電水壺、蓋碗、陶杯與紙袋茶樣 | an ordinary home kitchen table with a plain electric kettle, one white gaiwan, a mismatched mug and a small paper sample bag of tea, morning window light, relaxed and slightly untidy. |
| hosting-first-timers | `cv-hosting-first-timers.webp` | 主人的手把一杯茶輕推向空着的客座 | a host's hand gently sliding a small tea cup on a saucer toward an empty chair across the table, a row of other cups on a wooden tray, linen napkin at the seat, warm light, only the hand visible. |
| introduce-a-tea | `cv-introduce-a-tea.webp` | 一杯放涼的茶、敞開的茶葉罐與一張空白小卡 | an untouched small cup of tea whose steam has long gone, beside an open tea tin with a bamboo scoop and a small blank card on a wooden table, evening light, no hands. |
| keep-learning | `cv-keep-learning.webp` | 壓在文件夾下的筆記本，旁邊是蓋碗與一隻沙漏 | a notebook half hidden under a pile of paper folders on a wooden desk, a white gaiwan and a small sand timer (hourglass) beside it, soft evening light, no text. |
| learn-one-motion | `cv-learn-one-motion.webp` | 紫砂壺斜身出湯，茶流順順落入小杯 | side view of a small clay teapot pouring one smooth arcing stream of tea into a tiny cup on a tray, a subtle motion feel, soft window light, dark wall, no hands visible. |
| liking-is-not-ranking | `cv-liking-is-not-ranking.webp` | 一隻手把盛着琥珀色茶的小杯遞向前 | a hand holding out a small filled cup of amber tea toward the viewer across a wooden table, a second cup softly blurred in front, warm friendly light, only the hand visible. |
| machine-and-hand | `cv-machine-and-hand.webp` | 製茶工場一角，三腳架上的手機對着竹篩上的茶葉 | a phone on a small tripod at the edge of a tea workshop floor pointing at a bamboo tray of leaves, while the busy workshop behind it with stainless steel machines and sacks is softly out of focus, daylight from windows, no people. |
| mountain-names | `cv-mountain-names.webp` | 印着等高線的舊地圖上放着一個茶包與空白吊牌 | a small tea pouch with a blank string tag lying on an old folded paper map showing only contour lines of mountains (no lettering), beside a small cup of tea, soft window light. |
| museum-teacup | `cv-museum-teacup.webp` | 玻璃展櫃裏靜靜擺着一隻舊茶碗 | a single old ceramic tea cup in a softly lit museum glass display case, dark background, faint reflections on the glass, calm and silent, no people. |
| open-one-bag | `cv-open-one-bag.webp` | 一排剪開了口的銀色茶袋，前面放着一把剪刀 | a row of foil tea bags standing on a wooden shelf, every one of them already opened at the top with scissors cuts and a few leaves showing, a pair of small scissors in front, soft window light. |
| ordinary-good-tea | `cv-ordinary-good-tea.webp` | 架上蒙着薄塵的茶葉罐與一隻日常用的馬克杯 | a sealed tea tin with a faint layer of dust on its lid sitting on a kitchen shelf beside a plain everyday mug, afternoon light across the shelf, a feeling of 'someday' and 'today'. |
| photograph-a-tea-table | `cv-photograph-a-tea-table.webp` | 剛斟好的茶，杯沿浮着細小泡沫，後面是手機 | macro close-up of a cup of freshly poured tea, tiny bubbles still clinging along the surface edge, window light glinting on the rim, a smartphone softly out of focus in the background. |
| puer-brewing-record | `cv-puer-brewing-record.webp` | 空白的記錄小卡、鉛筆、蓋碗與一角普洱茶餅 | a small tasting record card with just a couple of pencil marks lying beside a gaiwan and a corner of a pu-erh cake, a pencil, dark wood table, soft side light, no legible text. |
| puer-gift | `cv-puer-gift.webp` | 切菜板上的普洱茶餅與一把菜刀，旁邊是拆開的禮盒 | a pu-erh tea cake on a wooden kitchen cutting board with a heavy kitchen knife lying beside it, an open gift box and ribbon behind, kitchen background, soft daylight, no hands. |
| puer-without-a-story | `cv-puer-without-a-story.webp` | 白紙上一塊不帶包裝的普洱茶餅與一杯茶 | a plain compressed pu-erh tea cake unwrapped on a clean sheet of white paper beside a plain white cup of tea, nothing else, minimal and honest, soft side light. |
| quiet-guest | `cv-quiet-guest.webp` | 雙手在掌心慢慢轉着一隻白瓷茶杯 | close-up of two hands slowly turning a small white tea cup around in the palms, a teapot softly blurred behind, warm light, calm and hesitant mood, no faces. |
| rain-and-a-cup | `cv-rain-and-a-cup.webp` | 窗台上的茶葉罐與蓋碗，玻璃上滿是雨水與霧氣 | a window pane fogged with condensation and rain drops, on the sill a closed tea tin and a white gaiwan, grey damp light, moody and still. |
| reading-tea-writing | `cv-reading-tea-writing.webp` | 攤開的茶書，書邊有鉛筆小記號，旁邊是蓋碗 | a tea book lying open beside a white gaiwan, pencil marks in the margin and a pencil resting in the gutter, the printed lines softly blurred and unreadable, warm lamp light. |
| room-at-the-table | `cv-room-at-the-table.webp` | 擺滿壺、杯與花瓶的茶桌，桌邊放着一副眼鏡 | a pair of folded eyeglasses lying on the edge of a wooden tea table crowded with a teapot, cups, a flower vase and tea tools, no free space left, soft window light. |
| sample-sharing | `cv-sample-sharing.webp` | 潤手霜、肥皂與一小包打開了的茶樣 | a small tube of hand cream and a bar of soap beside a partly opened sample tea bag and a white saucer with a few tea leaves on a bathroom-shelf-like wooden board, soft daylight. |
| season-of-picking | `cv-season-of-picking.webp` | 茶樹上剛冒出的嫩芽，後面是竹籃與晨霧 | close-up of a tea bush with fresh pale green spring buds and young leaves, a bamboo basket softly blurred behind, early morning mist, no people. |
| single-cup-brewing | `cv-single-cup-brewing.webp` | 手把濾球從玻璃杯中提起，一滴茶湯將落在桌上 | a hand lifting a small stainless steel infuser out of a glass mug at a wooden desk, a single drop of tea about to fall beside a laptop keyboard, soft window light, correct hand anatomy. |
| six-tea-families | `cv-six-tea-families.webp` | 六隻玻璃杯排成一列，茶湯由淺黃漸變到深褐 | six small clear glass cups in a row on a white surface seen from above, holding the six tea liquor colours from pale yellow-green to gold, amber, red and dark brown, bright soft light. |
| tea-across-languages | `cv-tea-across-languages.webp` | 桌兩邊的手，一隻指向茶壺，一隻遞出茶杯 | across a wooden table, one hand gesturing toward a small teapot while another hand reaches out with a small cup, a friendly exchange without words, warm light, no faces. |
| tea-and-kitchen | `cv-tea-and-kitchen.webp` | 廚房層架上，茶葉罐緊貼着咖哩粉與香料罐 | a kitchen shelf with a tea tin standing right next to jars of curry powder and spices and a cooking oil bottle, warm kitchen light, the tea tin slightly out of place. |
| tea-and-snacks | `cv-tea-and-snacks.webp` | 蓋上蓋的點心盒旁放着蓋碗與兩隻品茗杯 | a closed small pastry box with its lid on, beside a clean white gaiwan and two tasting cups on a wooden table, soft side light, a sense of keeping the table clear for tasting. |
| tea-cloth | `cv-tea-cloth.webp` | 窗邊木架上晾着的茶巾與下方的白瓷杯 | a linen tea cloth hanging over a wooden rail in a sunny window to dry, a tray of white cups beneath it, warm bright morning light. |
| tea-for-one | `cv-tea-for-one.webp` | 夜裏小桌上一隻蓋碗與亮着小燈的電水壺 | a single white gaiwan with its lid on and an electric kettle with a small glowing light on a bare small table at night, the rest of the tea tray empty, one warm lamp, dark room. |
| tea-oxidation | `cv-tea-oxidation.webp` | 兩隻白碟，一碟葉邊泛紅的烏龍，一碟深色的陳年普洱 | two small white dishes side by side on a dark wooden table, one with red-edged bruised oolong leaves and one with dark post-fermented pu-erh leaves, soft top-side light. |
| tea-workshop-visit | `cv-tea-workshop-visit.webp` | 訪客的手停在竹篩上方，旁邊是工人戴手套的手 | a visitor's hand hovering above a bamboo tray of fresh tea leaves in a workshop, not touching, a worker's gloved hand waiting just beside it, soft daylight, no faces. |
| teapot-mouth | `cv-teapot-mouth.webp` | 紫砂壺嘴末端掛着一滴茶，下面是茶盤 | macro close-up of a clay teapot spout with a single tea drop hanging at the tip, a bamboo tea tray beneath, soft side light, shallow depth of field. |
| temperature-as-choice | `cv-temperature-as-choice.webp` | 水壺把滾水注入冷杯，冒出蒸氣 | a kettle with a thin spout pouring hot water into a cold white cup, steam rising, cold blue window light behind, a wool scarf draped on a chair in the soft background. |
| what-is-body | `cv-what-is-body.webp` | 一碗濃厚的深琥珀色老茶與一杯清水對照 | a white cup of thick glossy deep-amber aged tea showing a viscous coat on the cup wall, beside a glass of plain clear water for contrast, dark wood table, soft side light. |
| when-tea-smells-wrong | `cv-when-tea-smells-wrong.webp` | 一隻手把打開了的茶袋拿遠，後面是電水壺 | a hand holding an opened foil tea bag at arm's length away from the body, an electric kettle softly blurred and switched off in the background, kitchen light, correct hand anatomy. |
| white-porcelain-day | `cv-white-porcelain-day.webp` | 白麻布上三隻白瓷杯，茶湯由清亮金黃到深琥珀 | top-down view of three white porcelain cups on a white linen cloth holding tea of different clarity — clear gold, slightly cloudy, dark amber — bright diffuse daylight, high key. |
| youth-and-tea | `cv-youth-and-tea.webp` | 茶盤旁一枝喝了一半的樽裝檸檬茶，背景是課室 | a half-drunk bottled lemon tea (plain bottle, no label) standing beside a tea tray with a gaiwan in a classroom, student notebooks softly blurred behind, afternoon light. |
| evening-choices | `cv-evening-choices.webp` | 檯燈暖光下的一杯茶、合上的書與茶葉罐 | a small white cup of tea beside a closed cloth-bound book and a lidded tea tin on a dark walnut table, a warm reading lamp glowing gently and soft dusk light from a window, well exposed with visible detail in the shadows, calm evening mood. |
| small-samples-first | `cv-small-samples-first.webp` | 三隻白碟盛着不同的普洱茶樣，旁邊是小袋 | three small white dishes each holding a different small portion of pu-erh tea samples, tiny sealed sample bags and a bamboo scoop beside them, on a dark walnut table in soft window light, warm tones. |
| rim-of-a-cup | `cv-rim-of-a-cup.webp` | 白瓷茶杯杯沿近照，窗光掠過杯口 | close-up of the rim of a thin white porcelain tea cup with warm window light grazing the lip, a second thicker cup softly blurred behind it, dark walnut table, warm tones, shallow depth of field. |
| blind-tasting-at-home | `cv-blind-tasting-at-home.webp` | 三杯茶各自壓着翻轉的空白標籤 | three identical white tea cups holding tea of slightly different colours on a dark walnut table, each placed on a blank paper label turned face down, a notebook and pencil beside, warm window light. |
| practice-with-water | `cv-practice-with-water.webp` | 蓋碗把清水注入公道杯的練習 | clear water being poured from a white gaiwan into a glass fair-cup on a dark walnut tray, practising the pour without tea, only the hand and sleeve partly visible, warm soft window light. |
| raw-ripe-first-lesson | `cv-raw-ripe-first-lesson.webp` | 兩餅顏色深淺不同的普洱茶餅，前面是兩杯一淺一深的茶湯 | two pu-erh tea cakes side by side on a sheet of wrapping paper, the left one lighter greenish-brown and the right one very dark almost black, in front of them two small white cups holding pale yellow tea and deep red tea, dark walnut table, soft window light. |

## 茶逢知己封面

| 文章 | 封面檔 | 圖說（alt） | 新生成提示（英文，沿用現有圖者留空） |
|---|---|---|---|
| a-life-changed-by-tea | `cv-col-a-life-changed-by-tea.webp` | 酒瓶與酒杯退到桌後，前面放着一杯茶 | a wine bottle and a wine glass pushed to the back of a table, in front a white cup of tea in warm window light, calm, no people. |
| ai-and-the-tea-teacher | `cv-col-ai-and-the-teacher.webp` | 手機播着茶藝片段，旁邊一隻手正把水注入蓋碗 | a smartphone propped on a wooden tea table playing a blurred tea video, next to a real gaiwan and a hand pouring water into it, soft light, screen content abstract, no legible text. |
| becoming-a-good-tea-person | `cv-col-becoming-a-good-tea-person.webp` | 雙手持壺把茶斟進一排小杯 | two hands pouring tea from a small teapot into a row of small cups on a dark wooden tray, practising the same pour again and again, a few rinsed cups waiting, soft window light, no faces. |
| buying-tea-online | `tea-shopping.webp` | （沿用原圖說） |  |
| character-at-the-tea-table | `cv-col-character-at-the-table.webp` | 兩張空椅之間的茶盤，兩隻小杯與一把壺 | a bamboo tray with two small cups of tea and a teapot between two empty chairs, quiet warm afternoon light, an unhurried feeling, no people. |
| children-learning-the-art-of-tea | `cv-col-children-learning-the-art-of-tea.webp` | 孩子與大人的雙手一同捧着奉出的茶杯 | a child's small hands and an adult's larger hands together holding out a small tea cup on a saucer with both hands, soft warm window light, no faces, dark wood table behind. |
| choosing-a-kettle-for-tea | `cv-col-choosing-a-kettle.webp` | 窗邊木桌上並列的玻璃壺、鐵壺與陶壺 | three kettles in a row on a wooden counter — a glass kettle, a cast iron kettle and a ceramic kettle — soft window light, clean still life. |
| diancha-and-matcha | `cv-col-diancha-and-matcha.webp` | 黑釉碗中的抹茶泡沫，旁邊是竹茶筅與茶匙 | a dark ceramic bowl of frothy green matcha with a bamboo whisk resting on a stand beside it and a bamboo scoop on a wooden table, soft side light, dark green wall. |
| discovering-ya-shi-xiang | `tea-lemon.webp` | （沿用原圖說） |  |
| finding-the-tea-that-suits-you | `cv-col-finding-your-tea.webp` | 一隻手從托盤上三杯不同的茶中拿起一杯 | a hand choosing among three small cups of different teas on a tray, lifting one cup, the three liquor colours differing, soft light, no face. |
| tea-personal-choice-september | `cv-col-finding-your-tea.webp` | 一隻手從托盤上三杯不同的茶中拿起一杯 | a hand choosing among three small cups of different teas on a tray, lifting one cup, the three liquor colours differing, soft light, no face. |
| gathering-around-the-tea-stove | `tea-boil.webp` | （沿用原圖說） |  |
| why-steep-aged-tea | `tea-boil.webp` | （沿用原圖說） |  |
| learning-tea-beyond-the-page | `old-tea-tree.webp` | 晨霧山林裏一棵布滿青苔的老茶樹 |  |
| tea-path-awakening-the-senses | `old-tea-tree.webp` | 晨霧山林裏一棵布滿青苔的老茶樹 |  |
| machines-and-the-tea-makers-craft | `workshop-floor.webp` | 製茶工場裏層層排開的竹篩與鮮葉 |  |
| the-craft-of-making-tea | `workshop-floor.webp` | 製茶工場裏層層排開的竹篩與鮮葉 |  |
| million-dollar-puer-and-sleep | `pry-needle-seam.webp` | 茶針插入緊壓普洱茶餅的縫隙，茶塊落在白紙上 |  |
| tea-beyond-speculation | `pry-needle-seam.webp` | 茶針插入緊壓普洱茶餅的縫隙，茶塊落在白紙上 |  |
| one-pot-one-kind-of-tea | `cv-col-one-pot-one-kind-of-tea.webp` | 紫砂壺、小杯與一碟烏龍茶葉放在石板上 | a reddish-brown zisha teapot beside a small cup and a dish of dark oolong leaves on a slab of stone, soft window light, calm still life. |
| puer-traditional-wellness-perspectives | `cv-col-puer-traditional-wellness.webp` | 一杯紅濃的普洱旁放着陳皮、菊花、紅棗與枸杞 | a cup of dark red pu-erh tea beside small dishes of dried tangerine peel, chrysanthemum flowers, red dates and goji berries on a dark wooden table, soft side light. |
| tea-a-language-across-borders | `cv-col-tea-a-language-across-borders.webp` | 桌上並列蓋碗、西式杯碟、日式茶碗與玻璃杯 | a table set with cups from different cultures: a Chinese gaiwan, a Western cup and saucer, a Japanese tea bowl and a glass of tea, a sprig of tea leaves in the middle, soft daylight. |
| tea-and-health-perspectives-december | `cv-col-tea-and-health.webp` | 玻璃杯裏的綠茶，旁邊是新鮮茶葉與水果 | a clear glass cup of green tea beside fresh tea leaves and a small ceramic spoon on a pale wooden table, morning light, a bowl of fruit softly blurred behind. |
| tea-as-a-daily-practice | `cv-col-tea-as-a-daily-practice.webp` | 雙手奉茶與雙手接茶的一刻 | two hands offering a small tea cup and two hands receiving it, close-up at table height, soft window light, plain sleeves, no faces. |
| tea-at-your-own-pace | `cold-brew-jar.webp` | 玻璃罐中的冷泡茶與一杯加冰的茶 |  |
| tea-through-the-seasons | `cold-brew-jar.webp` | 玻璃罐中的冷泡茶與一杯加冰的茶 |  |
| the-human-side-of-tea-presentation | `cv-col-presentation.webp` | 雙手在演示前擺好茶桌上的小杯 | hands arranging cups on a neatly set tea table before a demonstration, a gaiwan, cups and a small flower, soft evening light, no faces. |
| the-professional-practice-of-tea | `cv-col-presentation.webp` | 雙手在演示前擺好茶桌上的小杯 | hands arranging cups on a neatly set tea table before a demonstration, a gaiwan, cups and a small flower, soft evening light, no faces. |
| trends-in-tea | `milk-tea-pour.webp` | 師傅提壺把濃茶隔着布袋濾入另一隻壺 |  |
| understanding-raw-and-ripe-puer | `puer-raw-ripe.webp` | 生普與熟普的乾茶和茶湯並列 |  |
| why-hong-kong-loves-puer | `cv-col-puer-hk.webp` | 普洱茶餅、玻璃公道杯與小杯，後面是點心蒸籠 | a pu-erh tea cake beside a glass pitcher of dark red tea and two small cups on a teahouse-style table with a bamboo steamer basket softly blurred behind, warm light. |
| when-tea-tastes-different-at-home | `cv-col-tastes-different-at-home.webp` | 左邊是茶店的品茗盤，右邊是家裏的馬克杯與水壺 | a split scene on one wooden table: on the left a professional tea shop tray with white tasting cups, on the right a home mug and kettle on a plain cloth, same tea in both, soft light. |
| white-porcelain-for-tasting-tea | `cv-col-white-porcelain-tasting.webp` | 白麻布上的白瓷蓋碗與兩隻品飲杯 | a white porcelain gaiwan set and two tasting cups on a white linen cloth in bright daylight with pale tea, minimal and clear, high key. |
