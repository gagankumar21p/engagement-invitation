// Local QR code (no API, no network call). Uses the small MIT-licensed "qrcode-generator" library
// vendored in js/vendor/qrcode.js. The QR is only shown when the page is served from a real public
// address, so a fake or localhost QR is never displayed.

function isPublicUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch (err) {
    return false;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
  const host = url.hostname;
  if (host === 'localhost' || host === '0.0.0.0' || host === '[::1]') return false;
  if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
  if (host.endsWith('.local')) return false;
  return true;
}

function loadLibrary() {
  return new Promise((resolve, reject) => {
    if (typeof window.qrcode === 'function') {
      resolve(window.qrcode);
      return;
    }
    const script = document.createElement('script');
    script.src = new URL('./vendor/qrcode.js', import.meta.url).href;
    script.async = true;
    script.onload = () => (typeof window.qrcode === 'function' ? resolve(window.qrcode) : reject(new Error('QR library missing')));
    script.onerror = () => reject(new Error('QR library failed to load'));
    document.head.appendChild(script);
  });
}

function toSvg(qr) {
  const count = qr.getModuleCount();
  const quiet = 2; // quiet-zone modules
  const size = count + quiet * 2;
  let path = '';
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) path += `M${col + quiet} ${row + quiet}h1v1h-1z`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">` +
    `<rect width="${size}" height="${size}" fill="#ffffff"/>` +
    `<path d="${path}" fill="#3D2029"/></svg>`
  );
}

/**
 * @param {{figure: HTMLElement|null, target: HTMLElement|null, url: string}} options
 * @returns {Promise<boolean>} true when a QR code was rendered
 */
export async function initQr({ figure, target, url }) {
  if (!figure || !target || !isPublicUrl(url)) return false;
  try {
    const qrcode = await loadLibrary();
    const qr = qrcode(0, 'M'); // type 0 = choose the smallest version that fits
    qr.addData(url);
    qr.make();
    target.innerHTML = toSvg(qr);
    figure.hidden = false;
    return true;
  } catch (err) {
    console.warn('[invitation] QR code unavailable:', err);
    figure.hidden = true;
    return false;
  }
}
