// Scroll reveal: sections rise in as they come into view (never with reduced motion).
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.remove('reveal-pending');
      e.target.classList.add('reveal-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal')) : [];
    const i = Math.min(sibs.indexOf(el), 6);
    if (i > 0) el.style.transitionDelay = `${i * 70}ms`;
    el.classList.add('reveal-pending');
    io.observe(el);
  });
}
