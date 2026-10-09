// Live countdown. The target is an absolute instant (ISO string with +05:30), so the result is
// correct for every visitor regardless of their own time zone.

const pad = (value, length = 2) => String(value).padStart(length, '0');

/**
 * Pure helper (easy to test). Never returns negative numbers.
 * @param {number} targetMs epoch milliseconds of the event start
 * @param {number} nowMs    epoch milliseconds "now"
 */
export function getRemaining(targetMs, nowMs = Date.now()) {
  const diff = Number.isFinite(targetMs) ? Math.max(0, targetMs - nowMs) : 0;
  const total = Math.floor(diff / 1000);
  return {
    total,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: total === 0 && (!Number.isFinite(targetMs) || nowMs >= targetMs),
  };
}

/**
 * Starts the countdown inside `root`. Returns a function that stops it and removes listeners.
 * @param {{root: HTMLElement|null, targetMs: number}} options
 */
export function startCountdown({ root, targetMs }) {
  if (!root || !Number.isFinite(targetMs)) return () => {};

  const units = {};
  root.querySelectorAll('[data-unit]').forEach((el) => { units[el.dataset.unit] = el; });
  const grid = root.querySelector('[data-countdown-grid]');
  const doneEl = root.querySelector('[data-countdown-done]');

  let timerId = null;
  let finished = false;

  const setText = (el, text) => {
    if (el && el.textContent !== text) el.textContent = text;
  };

  function showFinished(nowMs) {
    finished = true;
    stopTimer();
    const hoursSince = (nowMs - targetMs) / 3600000;
    const message = hoursSince < 12
      ? 'The celebration has begun. We are so happy you are with us.'
      : 'Thank you for celebrating with us.';
    if (grid) grid.hidden = true;
    if (doneEl) {
      setText(doneEl, message);
      doneEl.hidden = false;
    }
  }

  function render() {
    const now = Date.now();
    const r = getRemaining(targetMs, now);
    if (r.done) {
      showFinished(now);
      return;
    }
    setText(units.days, pad(r.days));
    setText(units.hours, pad(r.hours));
    setText(units.minutes, pad(r.minutes));
    setText(units.seconds, pad(r.seconds));
  }

  function startTimer() {
    if (finished || timerId !== null) return;
    render();
    if (!finished) timerId = window.setInterval(render, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  // Do not keep a timer running while the tab is hidden; resync immediately when it comes back.
  const onVisibility = () => (document.hidden ? stopTimer() : startTimer());
  const onPageHide = () => stopTimer();
  const onPageShow = () => startTimer();

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);

  startTimer();

  return function destroy() {
    stopTimer();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  };
}
