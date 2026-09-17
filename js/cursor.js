export function initCursor() {
  let canHover = false;
  try {
    canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (e) {}
  if (!canHover) return;

  let reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  document.body.classList.add('has-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const ringLabel = document.createElement('span');
  ringLabel.className = 'cursor-ring-label';
  ring.appendChild(ringLabel);
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }

  if (reduceMotion) {
    ring.style.transition = 'none';
    window.addEventListener('mousemove', () => {
      ring.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });
  } else {
    requestAnimationFrame(loop);
  }

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    const label = el.getAttribute('data-cursor');
    el.addEventListener('mouseenter', () => {
      ring.classList.add('is-active');
      ringLabel.textContent = label === 'drag' ? 'HÚZD' : label === 'view' ? 'NÉZD' : label;
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('is-active');
      ringLabel.textContent = '';
    });
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
