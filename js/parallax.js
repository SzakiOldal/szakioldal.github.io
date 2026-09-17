export function initParallax() {
  // Target the glow layer, not .hero-visual itself — that element already
  // owns a data-reveal="scale" transform, and .hero-mockup owns the
  // mousemove tilt transform; writing inline transform to either here
  // would fight those and break the reveal/tilt animation.
  const target = document.querySelector('.hero .mockup-glow');
  if (!target) return;

  let reduceMotion = false;
  try {
    reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}
  if (reduceMotion) return;

  let ticking = false;

  function update() {
    ticking = false;
    if (window.innerWidth < 900) {
      target.style.transform = '';
      return;
    }
    const rect = target.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const offset = Math.max(-24, Math.min(24, center * -0.06));
    target.style.transform = `translateY(${offset.toFixed(1)}px)`;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  window.addEventListener('resize', update, { passive: true });
  update();
}
