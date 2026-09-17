export function initTilt() {
  let canHover = false;
  try {
    canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (e) {}

  let reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  if (!canHover || reduceMotion) return;

  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const maxTilt = parseFloat(el.getAttribute('data-tilt')) || 6;
    let raf = null;

    el.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1400px) rotateY(${(px * maxTilt - maxTilt * 0.5).toFixed(2)}deg) rotateX(${(py * -maxTilt).toFixed(2)}deg)`;
        raf = null;
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
