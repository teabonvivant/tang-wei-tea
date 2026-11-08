// 全站極少量互動：選單、深淺色、詞條 popover 位置、進場。沒有 scroll 事件監聽。
const root = document.documentElement;

// 深淺色（動12：顏色過渡寫在 CSS）
document.querySelectorAll('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
    try { localStorage.setItem('tong-tea-theme', dark ? 'dark' : 'light'); } catch (e) {}
  })
);

// 首頁主圖（M-03、M-04）：圖片 decode 完成才讓金線開始畫；入場結束後撤走 will-change
const hero = document.querySelector('.hero');
const heroImg = hero && hero.querySelector('.hero-image');
if (hero && heroImg) {
  const go = () => requestAnimationFrame(() => hero.classList.add('ready'));
  (heroImg.decode ? heroImg.decode() : Promise.reject()).then(go, go);
  setTimeout(go, 3000); // 後備：圖片過慢或 decode 無回應時仍畫出金線
  const settle = () => hero.classList.add('settled');
  heroImg.addEventListener('transitionend', (e) => { if (e.propertyName === 'transform') settle(); });
  setTimeout(settle, 3500);
}

// 頁首捲動狀態（M-11）：用頁頂哨兵的 IntersectionObserver，不監聽 scroll
const sentinel = document.querySelector('.top-sentinel');
const siteHeader = document.querySelector('.site-header');
if (sentinel && siteHeader && 'IntersectionObserver' in window) {
  new IntersectionObserver((en) => {
    if (en[0].isIntersecting) siteHeader.removeAttribute('data-scrolled'); else siteHeader.setAttribute('data-scrolled', '');
  }).observe(sentinel);
}

// 「文章」下拉（P-05）：按鈕開合、Esc 關閉並把焦點還給按鈕、點外面或焦點離開就關
document.querySelectorAll('[data-drop]').forEach((drop) => {
  const btn = drop.querySelector('.nav-drop-btn');
  const set = (open) => { drop.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', () => set(!drop.classList.contains('open')));
  drop.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drop.classList.contains('open')) { set(false); btn.focus(); } });
  drop.addEventListener('focusout', (e) => { if (!drop.contains(e.relatedTarget)) set(false); });
  document.addEventListener('click', (e) => { if (!drop.contains(e.target)) set(false); });
});

// 修器裂紋地圖（M-08）：進入視窗才加 .drawn，五條線依次畫出（延遲寫在 CSS）；後備 2.5 秒必顯示
document.querySelectorAll('[data-crackmap]').forEach((map) => {
  const show = () => map.classList.add('drawn');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { show(); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(map);
  } else show();
  setTimeout(show, 2500);
});

// FAQ 開合（M-05）：grid-template-rows 0fr↔1fr，320ms；減少動態時維持原生 details
document.querySelectorAll('.faq').forEach((faq) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  faq.classList.add('anim');
  faq.querySelectorAll('details').forEach((d) => {
    if (d.open) d.classList.add('is-open');
    const body = d.querySelector('.faq-body');
    d.querySelector('summary').addEventListener('click', (e) => {
      e.preventDefault();
      if (!d.open) {
        d.open = true;
        requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('is-open')));
      } else if (d.classList.contains('is-open')) {
        d.classList.remove('is-open');
        const done = () => { if (!d.classList.contains('is-open')) d.open = false; };
        body.addEventListener('transitionend', done, { once: true });
        setTimeout(done, 450);
      }
    });
  });
});

// 站內搜尋（P-04）：第一次聚焦才下載索引；標題、分類、摘要、正文都參與比對；所有關鍵字都要出現
const norm = (t) => t.toLowerCase().replace(/\s+/g, ' ').trim();
let searchIndex = null;
const loadIndex = (url) => (searchIndex ||= fetch(url).then((r) => r.json()).catch(() => { searchIndex = null; return []; }));
const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function snippet(item, terms) {
  const hay = item.x || '';
  for (const t of terms) {
    const i = hay.toLowerCase().indexOf(t);
    if (i >= 0) { const a = Math.max(0, i - 18); return (a ? '…' : '') + hay.slice(a, a + 70) + '…'; }
  }
  return item.e;
}
function runSearch(items, q) {
  const terms = norm(q).split(' ').filter(Boolean);
  if (!terms.length) return [];
  const hits = [];
  items.forEach((it, order) => {
    const t = it.t.toLowerCase(), c = it.c.toLowerCase(), e = it.e.toLowerCase(), x = (it.x || '').toLowerCase();
    let score = 0;
    for (const w of terms) {
      let s = 0;
      if (t === w) s += 30; else if (t.includes(w)) s += 12;
      if (c.includes(w)) s += 3;
      if (e.includes(w)) s += 5;
      if (x.includes(w)) s += 1 + Math.min(3, x.split(w).length - 2);
      if (!s) return;
      score += s;
    }
    hits.push({ it, score, order });
  });
  return hits.sort((a, b) => b.score - a.score || a.order - b.order).map((h) => h.it);
}
document.querySelectorAll('[data-search]').forEach((form) => {
  const input = form.querySelector('input');
  const list = form.querySelector('[data-search-results]');
  const status = form.querySelector('[data-search-status]');
  const url = form.dataset.index;
  let seq = 0;
  const render = async () => {
    const q = input.value;
    const my = ++seq;
    if (!norm(q)) { list.hidden = true; list.innerHTML = ''; status.textContent = ''; return; }
    const items = await loadIndex(url);
    if (my !== seq) return;
    const res = runSearch(items, q);
    const terms = norm(q).split(' ').filter(Boolean);
    if (!res.length) {
      list.innerHTML = '<li class="r-none">找不到相關文章。換一個詞試試，例如「蓋碗」「悶泡」「存茶」。</li>';
      status.textContent = '找不到相關文章';
    } else {
      list.innerHTML = res.slice(0, 8).map((it) => `<li><a href="${esc(it.u)}"><span class="r-meta">${esc(it.c)}</span><span class="r-title">${esc(it.t)}</span><span class="r-snip">${esc(snippet(it, terms))}</span></a></li>`).join('') + (res.length > 8 ? `<li class="r-none">另有 ${res.length - 8} 項，加一個關鍵字可以縮小範圍。</li>` : '');
      status.textContent = `找到 ${res.length} 項`;
    }
    list.hidden = false;
  };
  input.addEventListener('focus', () => loadIndex(url), { once: true });
  input.addEventListener('input', (e) => { if (!e.isComposing) render(); });
  input.addEventListener('compositionend', render);
  form.addEventListener('submit', (e) => { e.preventDefault(); render(); });
  form.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !list.hidden) { input.value = ''; render(); } });
  // 從頁首放大鏡（/journal/#search）或 ?q= 進來
  if (form.id === 'search') {
    const q = new URLSearchParams(location.search).get('q');
    if (q) { input.value = q; render(); }
    if (location.hash === '#search') input.focus({ preventScroll: false });
  }
});

// 手機選單（動8）
const dlg = document.getElementById('mobile-menu');
const opener = document.querySelector('[data-menu-open]');
if (dlg && opener) {
  opener.addEventListener('click', () => { dlg.showModal(); opener.setAttribute('aria-expanded', 'true'); });
  const close = () => {
    if (!dlg.open || dlg.classList.contains('closing')) return;
    dlg.classList.add('closing');
    // M-10：動畫時間只寫在 CSS，結束事件才真正關閉；400ms 後備只為動畫被停用的瀏覽器
    const done = () => { if (!dlg.classList.contains('closing')) return; dlg.close(); dlg.classList.remove('closing'); };
    dlg.addEventListener('animationend', done, { once: true });
    setTimeout(done, 400);
  };
  dlg.querySelector('[data-menu-close]').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  dlg.addEventListener('close', () => opener.setAttribute('aria-expanded', 'false'));
}

// 詞條 popover（動9）：由觸發點決定 transform-origin 及桌面位置
document.querySelectorAll('.term-pop').forEach((pop) => {
  pop.addEventListener('beforetoggle', (e) => {
    if (e.newState !== 'open') return;
    const btn = document.querySelector(`[popovertarget="${pop.id}"]`);
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    if (window.innerWidth <= 640) return;
    const w = Math.min(360, window.innerWidth - 32);
    const left = Math.max(16, Math.min(r.left, window.innerWidth - w - 16));
    const below = r.bottom + 8 + 220 < window.innerHeight;
    pop.style.inset = 'auto';
    pop.style.left = left + 'px';
    pop.style[below ? 'top' : 'bottom'] = below ? r.bottom + 8 + 'px' : window.innerHeight - r.top + 8 + 'px';
    pop.style.setProperty('--ox', r.left - left + r.width / 2 + 'px');
    pop.style.setProperty('--oy', below ? '0' : '100%');
  });
});

// 進場（動2 後備、動11）：只有「不在視窗內」的元素才先隱藏，內容預設可見
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = [...document.querySelectorAll('[data-stagger] > *')];
  // --i 以「同一批一起進入視窗」的次序計，逐件延遲（間隔與上限由 CSS 的 data-stagger 類型決定）
  const io = new IntersectionObserver((entries) => {
    let k = 0;
    entries.filter((en) => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left).forEach((en) => {
      en.target.style.setProperty('--i', String(k++));
      en.target.classList.add('reveal-in');
      en.target.classList.remove('reveal-pre');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((t) => {
    const r = t.getBoundingClientRect();
    if (r.top > innerHeight) { t.classList.add('reveal-pre'); io.observe(t); }
  });
  if (!CSS.supports('animation-timeline: view()')) {
    const g = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.remove('pre'); en.target.classList.add('drawn'); g.unobserve(en.target);
      });
    });
    document.querySelectorAll('.gold-draw').forEach((el) => { el.classList.add('pre'); g.observe(el); });
  }
}
