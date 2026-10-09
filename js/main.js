// Entry point. Wires the opening screen, reveals, countdown, music and sharing.
// Each feature is initialised independently, so one failing feature never breaks the invitation.

import { INVITE, eventStartMs } from './config.js';
import { initParticles } from './particles.js';
import { initReveal, initScrollEffects } from './reveal.js';
import { startCountdown } from './countdown.js';
import { initMusic } from './music.js';
import { initShare } from './share.js';
import { toast } from './toast.js';

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function safely(name, fn) {
  try {
    return fn();
  } catch (err) {
    console.warn(`[invitation] ${name} is unavailable:`, err);
    return undefined;
  }
}

function init() {
  root.classList.remove('no-js');
  root.classList.add('js');

  const gate = document.getElementById('gate');
  const main = document.getElementById('invitation');
  const heading = document.getElementById('couple-names');
  const openButton = document.getElementById('open-invitation');

  safely('particles', () => initParticles(document.getElementById('particles'), { enabled: !reduceMotion }));
  safely('scroll effects', () => initScrollEffects({ reduceMotion }));
  safely('countdown', () => startCountdown({ root: document.getElementById('countdown'), targetMs: eventStartMs() }));
  safely('share', () => initShare());

  const music = safely('music', () => initMusic({
    button: document.getElementById('music-toggle'),
    audio: document.getElementById('bg-audio'),
    notify: toast,
    enabled: INVITE.music.enabled,
  })) || { reveal() {}, pause() {} };

  // If the opening screen is missing for any reason, simply show the invitation.
  if (!gate || !openButton || !main) {
    root.classList.add('is-open');
    safely('reveal', () => initReveal({ reduceMotion }));
    return;
  }

  // Keep the invitation out of the tab order and away from screen readers until it is opened.
  main.inert = true;

  let opened = false;

  function finishOpening() {
    gate.hidden = true;
    main.inert = false;
    window.scrollTo(0, 0);
    if (heading) heading.focus({ preventScroll: true });
    safely('music reveal', () => music.reveal());
  }

  function openInvitation() {
    if (opened) return;
    opened = true;
    openButton.disabled = true;
    root.classList.add('is-open');
    gate.classList.add('is-leaving');
    main.inert = false;
    window.scrollTo(0, 0);

    window.setTimeout(() => safely('reveal', () => initReveal({ reduceMotion })), reduceMotion ? 0 : 250);
    if (reduceMotion) finishOpening();
    else window.setTimeout(finishOpening, 800);
  }

  openButton.addEventListener('click', openInvitation);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
