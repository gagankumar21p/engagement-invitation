// A handful of slow, soft gold particles for the opening screen. Pure CSS animation, no canvas.

export function initParticles(container, { enabled = true, count = 18 } = {}) {
  if (!container || !enabled) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    const size = 2 + Math.random() * 3.5;
    dot.style.setProperty('--x', `${(Math.random() * 100).toFixed(1)}%`);
    dot.style.setProperty('--size', `${size.toFixed(1)}px`);
    dot.style.setProperty('--dur', `${(14 + Math.random() * 14).toFixed(1)}s`);
    dot.style.setProperty('--delay', `${(-Math.random() * 24).toFixed(1)}s`);
    dot.style.setProperty('--drift', `${(Math.random() * 60 - 30).toFixed(0)}px`);
    dot.style.setProperty('--alpha', (0.35 + Math.random() * 0.4).toFixed(2));
    fragment.appendChild(dot);
  }
  container.appendChild(fragment);
}
