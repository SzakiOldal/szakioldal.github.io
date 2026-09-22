const SHOWCASE_DESIGN_WIDTH = 1440;

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

  // Scale every demo iframe to a real ~1440px desktop layout instead of an
  // arbitrary crop, so the preview is actually readable at any frame size.
  function rescaleFrames() {
    const wrap = stage.querySelector('.showcase-frame-wrap');
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    const scale = w / SHOWCASE_DESIGN_WIDTH;
    panels.forEach((p) => {
      const frame = p.querySelector('.showcase-frame');
      if (!frame) return;
      frame.style.width = SHOWCASE_DESIGN_WIDTH + 'px';
      frame.style.height = h / scale + 'px';
      frame.style.transform = 'scale(' + scale + ')';
    });
  }
  rescaleFrames();
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(rescaleFrames);
    const firstWrap = stage.querySelector('.showcase-frame-wrap');
    if (firstWrap) ro.observe(firstWrap);
  } else {
    window.addEventListener('resize', rescaleFrames, { passive: true });
  }

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
    // don't leave the loading spinner stuck forever. These are small,
    // self-contained pages — 6s is a generous last resort, not the norm.
    window.setTimeout(markLoaded, 6000);
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
      badgeEl.textContent = 'Demó · kitalált vállalkozás';
      badgeEl.classList.add('is-live');
    }
    if (linkEl) {
      if (tab.dataset.link) {
        linkEl.href = tab.dataset.link;
        linkEl.style.visibility = 'visible';
        linkEl.textContent = '';
        const label = document.createElement('span');
        label.textContent = 'Demó megnyitása ';
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
