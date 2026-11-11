// Site-wide "tech" motion: scroll progress, decoding eyebrows, hero words rising in, a cursor
// spotlight on cards and numbers that count up. Nothing here runs with reduced motion.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  // Scroll progress: a thin glowing line along the top of the window.
  const bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hero headline: split into words that rise in one after another (after the logo intro, if any).
  const riseWords = () => document.querySelectorAll<HTMLElement>('[data-fx-words]').forEach((el) => {
    const words = (el.textContent ?? '').trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.replaceChildren(...words.flatMap((w, i) => {
      const s = document.createElement('span');
      s.className = 'fx-word';
      s.setAttribute('aria-hidden', 'true');
      s.style.animationDelay = `${120 + i * 70}ms`;
      s.textContent = w;
      return i < words.length - 1 ? [s, document.createTextNode(' ')] : [s];
    }));
  });
  if (document.documentElement.classList.contains('intro')) addEventListener('tl:intro-done', () => setTimeout(riseWords, 250), { once: true });
  else riseWords();

  // Eyebrows decode from random characters when they come into view.
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_';
  const decode = (el: HTMLElement) => {
    const final = el.dataset.fxText ?? el.textContent ?? '';
    el.dataset.fxText = final;
    const start = performance.now();
    const dur = Math.min(900, 280 + final.length * 22);
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const shown = Math.floor(p * final.length);
      el.textContent = final.slice(0, shown) + [...final.slice(shown)].map((c) => (c === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0])).join('');
      if (p < 1) requestAnimationFrame(step); else el.textContent = final;
    };
    requestAnimationFrame(step);
  };

  // Numbers count up from zero when they come into view.
  const countUp = (el: HTMLElement) => {
    const target = Number(el.dataset.countup ?? el.textContent);
    if (!Number.isFinite(target)) return;
    const start = performance.now(), dur = 1100;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };

  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      if (el.matches('[data-countup]')) countUp(el); else decode(el);
      seen.unobserve(el);
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll<HTMLElement>('.eyebrow').forEach((el) => {
    el.setAttribute('aria-label', el.textContent ?? '');
    seen.observe(el);
  });
  document.querySelectorAll<HTMLElement>('[data-countup]').forEach((el) => seen.observe(el));

  // Cursor spotlight on cards (mouse and pen only).
  const cards = '.icard, .film, .tcard, .theme, .shelf, .door, .gcard, .card, .ghb__banner, .partners li';
  document.querySelectorAll<HTMLElement>(cards).forEach((el) => el.classList.add('fx-spot'));
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const el = (e.target as HTMLElement).closest<HTMLElement>('.fx-spot');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}
