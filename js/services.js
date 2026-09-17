export function initServices() {
  const triggers = document.querySelectorAll('.svc-toggle');
  if (!triggers.length) return;

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.svc-item');
      if (!item) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      item.classList.toggle('is-open', !isOpen);
    });
  });
}
