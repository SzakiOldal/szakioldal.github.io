export function initNav() {
  const header = document.querySelector('header');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mobile.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  // Active-section highlight
  const anchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (anchors.length && typeof IntersectionObserver === 'function') {
    const map = {};
    anchors.forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!map[id]) return;
          if (entry.isIntersecting) {
            anchors.forEach((a) => a.classList.remove('is-active'));
            map[id].classList.add('is-active');
          }
        });
      },
      { threshold: 0, rootMargin: '-40% 0px -55% 0px' }
    );
    Object.keys(map).forEach((id) => io.observe(document.getElementById(id)));
  }
}
