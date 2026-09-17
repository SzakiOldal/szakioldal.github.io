export function initShowcase() {
  const stage = document.querySelector('.showcase-stage');
  if (!stage) return;

  const tabs = Array.from(document.querySelectorAll('.showcase-tab'));
  const panels = Array.from(document.querySelectorAll('.showcase-panel'));
  const nameEl = document.querySelector('.showcase-caption-name');
  const tagEl = document.querySelector('.showcase-caption-tag');
  const linkEl = document.querySelector('.showcase-caption-link');
  const badgeEl = document.querySelector('.showcase-caption-badge');
  const urlEl = document.getElementById('showcaseUrl');
  if (!tabs.length || !panels.length) return;

  function loadPanel(panel) {
    if (!panel || panel.classList.contains('is-loading') || panel.classList.contains('is-loaded')) return;
    const src = panel.dataset.src;
    const frame = panel.querySelector('.showcase-frame');
    if (!src || !frame) return;
    panel.classList.add('is-loading');
    let settled = false;
    const markLoaded = () => {
      if (settled) return;
      settled = true;
      panel.classList.remove('is-loading');
      panel.classList.add('is-loaded');
    };
    frame.addEventListener('load', markLoaded, { once: true });
    // Fallback: some browsers can miss/delay the iframe load event for a
    // background/off-screen tab even once navigation has finished, so
    // don't leave the loading spinner stuck forever.
    window.setTimeout(markLoaded, 2500);
    frame.src = src;
  }

  function activate(target, { focus = false } = {}) {
    tabs.forEach((t) => {
      const active = t.dataset.target === target;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active && focus) t.focus();
    });
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === target));

    const activePanel = panels.find((p) => p.dataset.panel === target);
    if (activePanel) loadPanel(activePanel);

    const tab = tabs.find((t) => t.dataset.target === target);
    if (!tab) return;
    if (nameEl) nameEl.textContent = tab.dataset.name || '';
    if (tagEl) tagEl.textContent = tab.dataset.tag || '';
    if (urlEl && activePanel && activePanel.dataset.src) {
      urlEl.textContent = 'szakioldal.github.io/' + activePanel.dataset.src.replace('/index.html', '');
    }
    if (badgeEl) {
      const isLive = tab.dataset.live === 'true';
      badgeEl.textContent = isLive ? 'Élő oldal' : 'Koncepció';
      badgeEl.classList.toggle('is-live', isLive);
    }
    if (linkEl) {
      if (tab.dataset.link) {
        linkEl.href = tab.dataset.link;
        linkEl.style.visibility = 'visible';
        linkEl.textContent = '';
        const label = document.createElement('span');
        label.textContent = tab.dataset.live === 'true' ? 'Élő oldal megtekintése ' : 'Weboldal megtekintése ';
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '→';
        linkEl.appendChild(label);
        linkEl.appendChild(arrow);
      } else {
        linkEl.style.visibility = 'hidden';
      }
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.target));
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') { e.preventDefault(); activate(tabs[(idx + 1) % tabs.length].dataset.target, { focus: true }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); activate(tabs[(idx - 1 + tabs.length) % tabs.length].dataset.target, { focus: true }); }
    });
  });

  const initial = tabs.find((t) => t.classList.contains('is-active')) || tabs[0];
  activate(initial.dataset.target);
}
