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

  document.documentElement.classList.add('intro-lock');

  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });

  window.setTimeout(() => {
    overlay.classList.add('is-hidden');
    document.documentElement.classList.remove('intro-lock');
    window.setTimeout(() => overlay.remove(), 550);
  }, 1100);
}
