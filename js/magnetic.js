export function initMagnetic() {
  let canHover = false;
  try {
    canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (e) {}

  let reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  if (!canHover || reduceMotion) return;

  const RADIUS = 70;
  const STRENGTH = 0.35;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS + r.width / 2) {
        el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
      }
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
