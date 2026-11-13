// Dots under each swipe row (see [data-swipe] in global.css): show where you are, tap to jump.
document.querySelectorAll<HTMLElement>('[data-swipe]').forEach((row) => {
  const cards = [...row.children] as HTMLElement[];
  if (cards.length < 2) return;
  const dots = document.createElement('div');
  dots.className = 'swipe-dots';
  dots.setAttribute('aria-hidden', 'true');
  const buttons = cards.map((card, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.addEventListener('click', () => row.scrollTo({ left: card.offsetLeft - row.offsetLeft - parseFloat(getComputedStyle(row).paddingLeft), behavior: 'smooth' }));
    dots.append(b);
    return b;
  });
  row.after(dots);
  const update = () => {
    const step = cards[1].offsetLeft - cards[0].offsetLeft || 1;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    const i = atEnd ? cards.length - 1 : Math.round(row.scrollLeft / step);
    buttons.forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
  };
  row.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();
});
