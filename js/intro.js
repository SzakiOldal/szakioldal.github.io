export function initIntro() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  let reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  if (reduceMotion) {
    overlay.remove();
    return;
  }

  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });

  window.setTimeout(() => {
    overlay.classList.add('is-hidden');
    document.body.style.overflow = '';
    window.setTimeout(() => overlay.remove(), 550);
  }, 1100);
}
