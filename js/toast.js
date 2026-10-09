// Small status message, announced politely to screen readers (see #toast in index.html).

let hideTimer = null;

export function toast(message, duration = 3200) {
  const el = document.getElementById('toast');
  if (!el) return;

  window.clearTimeout(hideTimer);
  el.classList.remove('is-shown');
  el.textContent = '';

  // Re-set the text on the next frame so repeated identical messages are announced again.
  window.requestAnimationFrame(() => {
    el.textContent = message;
    el.classList.add('is-shown');
    hideTimer = window.setTimeout(() => el.classList.remove('is-shown'), duration);
  });
}
