export function initMorph() {
  const els = document.querySelectorAll('[data-morph]');
  if (!els.length) return;

  let reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  if (reduceMotion || typeof IntersectionObserver !== 'function') {
    els.forEach((el) => el.classList.add('is-morphed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => entry.target.classList.add('is-morphed'), 450);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  els.forEach((el) => io.observe(el));
}
