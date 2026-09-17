export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  let reduceMotion = false;
  try {
    reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  if (reduceMotion || typeof IntersectionObserver !== 'function') {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  // threshold must be 0: reveal targets start clipped/filtered to zero
  // visible area (mask/blur modes), which pins intersectionRatio at 0
  // until revealed — any non-zero threshold can never be crossed.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  );

  els.forEach((el) => observer.observe(el));
}
