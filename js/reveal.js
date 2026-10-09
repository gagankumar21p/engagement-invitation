// Scroll-triggered reveals (IntersectionObserver), a thin reading-progress bar and a very light parallax.
// Text is visible by default in CSS; these effects only enhance it.

export function initReveal({ reduceMotion = false } = {}) {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  items.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

export function initScrollEffects({ reduceMotion = false } = {}) {
  const bar = document.getElementById('progress-bar');
  const parallaxItems = Array.from(document.querySelectorAll('[data-parallax]'));
  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (bar) {
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }

    if (!reduceMotion) {
      for (const el of parallaxItems) {
        const speed = parseFloat(el.dataset.parallax) || 0.05;
        // Only move while near the top of the page, where the hero is.
        const offset = Math.min(y, window.innerHeight * 1.2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}
