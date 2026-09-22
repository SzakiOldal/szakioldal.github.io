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
    function closeMenu() {
      mobile.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('nav-open');
    }
    function openMenu() {
      mobile.classList.add('is-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('nav-open');
    }
    toggle.addEventListener('click', () => {
      if (mobile.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobile.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
    try {
      window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
        if (e.matches) closeMenu();
      });
    } catch (e) {}
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
