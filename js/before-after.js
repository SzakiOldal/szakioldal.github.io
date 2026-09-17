export function initBeforeAfter() {
  const instances = document.querySelectorAll('.ba-compare');

  instances.forEach((compare) => {
    const handle = compare.querySelector('.ba-handle');
    if (!handle) return;

    let pos = 50;
    let dragging = false;

    function clamp(v) {
      return Math.min(100, Math.max(0, v));
    }

    function apply() {
      compare.style.setProperty('--ba-pos', pos + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
    }

    function setPos(v) {
      pos = clamp(v);
      apply();
    }

    function posFromClientX(clientX) {
      const rect = compare.getBoundingClientRect();
      if (!rect.width) return pos;
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onMove(e) {
      if (!dragging) return;
      const clientX = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
      setPos(posFromClientX(clientX));
      if (e.cancelable) e.preventDefault();
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      compare.classList.remove('ba-dragging');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', endDrag);
      window.removeEventListener('touchcancel', endDrag);
    }

    function startDrag(e) {
      dragging = true;
      compare.classList.add('ba-dragging');
      handle.focus();
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', endDrag);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', endDrag);
      window.addEventListener('touchcancel', endDrag);
      if (e.cancelable) e.preventDefault();
    }

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });

    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        setPos(pos - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setPos(pos + 5);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setPos(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        setPos(100);
        e.preventDefault();
      }
    });

    setPos(50);

    // One-time auto-intro: when the section first scrolls into view, briefly
    // sweep the handle so visitors notice it's draggable, then hand control back.
    let reduceMotion = false;
    try {
      reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}

    if (!reduceMotion && typeof IntersectionObserver === 'function') {
      const introObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            introObserver.disconnect();
            compare.classList.add('ba-auto');
            setPos(30);
            window.setTimeout(() => setPos(70), 700);
            window.setTimeout(() => setPos(50), 1500);
            window.setTimeout(() => compare.classList.remove('ba-auto'), 2300);
          });
        },
        { threshold: 0.4 }
      );
      introObserver.observe(compare);
    }
  });
}
