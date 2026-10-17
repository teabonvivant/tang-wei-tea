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

// 手機選單（動8）
const dlg = document.getElementById('mobile-menu');
const opener = document.querySelector('[data-menu-open]');
if (dlg && opener) {
  opener.addEventListener('click', () => { dlg.showModal(); opener.setAttribute('aria-expanded', 'true'); });
  const close = () => {
    if (!dlg.open) return;
    dlg.classList.add('closing');
    setTimeout(() => { dlg.close(); dlg.classList.remove('closing'); }, 150);
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
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('reveal-in');
      en.target.classList.remove('reveal-pre');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((t, i) => {
    const r = t.getBoundingClientRect();
    t.style.setProperty('--i', String(Array.from(t.parentElement.children).indexOf(t)));
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
