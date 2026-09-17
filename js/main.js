import { initIntro } from './intro.js';
import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initCursor } from './cursor.js';
import { initMagnetic } from './magnetic.js';
import { initTilt } from './tilt.js';
import { initParallax } from './parallax.js';
import { initMorph } from './morph.js';
import { initShowcase } from './showcase.js';
import { initBeforeAfter } from './before-after.js';

function boot() {
  initIntro();
  initNav();
  initReveal();
  initCursor();
  initMagnetic();
  initTilt();
  initParallax();
  initMorph();
  initShowcase();
  initBeforeAfter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
