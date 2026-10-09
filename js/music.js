// Optional background music. Never autoplays: playback only starts from a tap on the button.
// Off by default (INVITE.music.enabled = false). When enabled but assets/music.mp3 is missing or
// cannot be played, the button hides itself and a short message is shown instead of failing silently.

export function initMusic({ button, audio, notify = () => {}, enabled = false }) {
  const noop = { reveal() {}, pause() {} };
  if (!enabled || !button || !audio) return noop;

  const playIcon = button.querySelector('.icon-play');
  const pauseIcon = button.querySelector('.icon-pause');
  let unavailable = false;

  function setPlaying(isPlaying) {
    button.dataset.state = isPlaying ? 'playing' : 'paused';
    button.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
    if (playIcon) playIcon.hidden = isPlaying;
    if (pauseIcon) pauseIcon.hidden = !isPlaying;
  }

  function markUnavailable(showMessage) {
    if (unavailable) return;
    unavailable = true;
    button.hidden = true;
    button.disabled = true;
    setPlaying(false);
    if (showMessage) notify('Music is not available right now.');
  }

  async function toggle() {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch (err) {
      // Missing file, unsupported format, or the browser refused playback.
      markUnavailable(true);
    }
  }

  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => setPlaying(false));
  audio.addEventListener('error', () => markUnavailable(false));
  const sourceEl = audio.querySelector('source');
  if (sourceEl) sourceEl.addEventListener('error', () => markUnavailable(true));

  button.addEventListener('click', toggle);
  setPlaying(false);

  return {
    /** Called once the invitation is opened. */
    reveal() {
      if (!unavailable) {
        button.hidden = false;
        button.disabled = false;
      }
    },
    pause() {
      if (!audio.paused) audio.pause();
    },
  };
}
