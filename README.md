# Gagan & Khushbu — Engagement Invitation

A minimalist, mobile-first animated invitation website. Plain HTML, CSS and JavaScript (ES modules).
No backend, no database, no API keys, no build step, no paid services.

* **Event:** Monday, 12 October 2026, 10:30 AM IST — Alka Motel, Pallav Vihar, Bulandshahr, Uttar Pradesh
* **Meetup:** Our House, 8:30 AM IST

> Nothing has been deployed by this project. You create the repository and switch on the free
> hosting feature yourself (steps below). Free hosting is subject to GitHub's / GitLab's current terms.

---

## 1. Architecture (why it suits free static hosting)

The site is a folder of static files. GitHub Pages and GitLab Pages just serve that folder over HTTPS,
so there is nothing to run, pay for or secure.

* All asset paths are **relative** (`css/styles.css`, `js/main.js`, `assets/...`), so the site works
  at the root of a domain and at a project sub-path such as `https://username.github.io/engagement-invitation/`.
* All icons and ornaments are **inline SVG** (no image requests). The only external request is the
  free Google Fonts stylesheet; if it fails, Georgia / system fonts are used and nothing breaks.
* The text is in the HTML, so it is visible even if JavaScript fails. JavaScript only adds the opening
  screen, animations, countdown, share/copy/calendar buttons and optional music.
* Social crawlers (WhatsApp, Facebook, X) do not run JavaScript, so the Open Graph tags live in
  `index.html`. The deploy workflows write your real public URL into those tags automatically.

## 2. File tree

```
engagement-invitation/
├── index.html                  Page, SEO + WhatsApp preview tags, SVG sprite
├── css/
│   └── styles.css              All styling (colours/fonts are variables at the top)
├── js/
│   ├── main.js                 Entry point: opening screen, wiring
│   ├── config.js               Event facts used by JS (date, venue, names, maps link, music on/off)
│   ├── countdown.js            Live countdown (Asia/Kolkata-correct, no negatives)
│   ├── reveal.js               Scroll reveals, progress bar, light parallax
│   ├── particles.js            Floating gold particles (opening screen)
│   ├── music.js                Optional play/pause music (never autoplays)
│   ├── share.js                Share, copy details, add-to-calendar (.ics)
│   ├── toast.js                Small status messages
│   └── vendor/
├── assets/
│   ├── favicon.svg
│   ├── og-image.png            1200×630 link-preview image (placeholder: replace with your own)
│   └── README.txt              How to add music.mp3
├── .github/workflows/pages.yml GitHub Pages deployment
├── .gitlab-ci.yml              GitLab Pages deployment
├── .nojekyll
├── .gitignore
└── README.md
```

## 3. Run and preview locally

The site uses ES modules, which browsers will not load from a `file://` address. Use any tiny local server:

```bash
cd engagement-invitation
python3 -m http.server 8080
# open http://localhost:8080
```

(or `npx serve`, or the VS Code "Live Server" extension). To test on your phone, connect it to the
same Wi-Fi and open `http://<your-computer-ip>:8080`.

## 4. Deploy on GitHub Pages (recommended)

1. Create a GitHub account if needed, then **New repository**. Name it `engagement-invitation`,
   set it to **Public** (GitHub's free plan serves Pages from public repositories), and create it.
2. Upload this whole folder's contents to the repository root (so `index.html` is at the top level):
   * With git:
     ```bash
     cd engagement-invitation
     git init -b main
     git add -A
     git commit -m "Engagement invitation"
     git remote add origin https://github.com/YOUR-USERNAME/engagement-invitation.git
     git push -u origin main
     ```
   * Or in the browser: **Add file → Upload files** and drag the folder contents in. Make sure the
     hidden `.github/workflows/pages.yml` file is included (drag-and-drop from a file manager works;
     some file pickers skip hidden folders). If it is missing, use **Add file → Create new file**, type
     `.github/workflows/pages.yml` as the name, and paste the file's contents.
3. In the repository open **Settings → Pages**. Under **Build and deployment → Source** choose
   **GitHub Actions**.
4. Open the **Actions** tab. The "Deploy invitation to GitHub Pages" run starts on every push to
   `main`. When it turns green (usually about a minute), your site is live at
   `https://YOUR-USERNAME.github.io/engagement-invitation/`.
5. Open that link on your phone, then share it on WhatsApp.

**If you cannot use Actions:** choose **Deploy from a branch → main → / (root)** instead, then replace the
placeholder URL by hand (section 6).

## 5. Deploy on GitLab Pages

1. Create a GitLab account and a **New project → Create blank project** named `engagement-invitation`.
2. Push the files (same `git` commands as above, with your GitLab remote URL), keeping `.gitlab-ci.yml`
   at the root. The default branch must be the one you push (usually `main`).
3. Open **Build → Pipelines**. The `pages` job copies the site into `public/` and publishes it.
   (GitLab.com may ask you to verify your account before running pipelines on the free tier. If that
   is a hurdle, use GitHub Pages instead.)
4. Open **Deploy → Pages** to see the URL. Make sure **Settings → General → Visibility → Pages** is set to
   **Everyone**, otherwise visitors (and WhatsApp's link preview) cannot open it.
5. The address looks like `https://YOUR-USERNAME.gitlab.io/engagement-invitation/`.

## 6. Set the public URL (WhatsApp previews)

Open Graph needs an **absolute HTTPS URL**. `index.html` contains this placeholder in the canonical link,
`og:url`, `og:image`, `twitter:image` and the structured data:

```
https://YOUR-USERNAME.github.io/engagement-invitation/
```

* **Using the included GitHub Actions workflow or `.gitlab-ci.yml`:** it is replaced automatically with
  your real URL on every deploy. Nothing to do.
* **Deploying another way** (branch deploy, Netlify drop, etc.): find and replace that exact text in
  `index.html` with your real URL (keep the trailing `/`), or run
  `sed -i 's|https://YOUR-USERNAME.github.io/engagement-invitation/|https://REAL-URL/|g' index.html`.

**Preview image:** replace `assets/og-image.png` with your own **1200 × 630** PNG or JPG (keep it under
about 300 KB, and keep the file name, or update the two `og-image.png` lines in `index.html`). The
included image is a simple placeholder.

**Caching:** WhatsApp, Facebook, X and others cache link previews, and refreshing is not instant or
guaranteed. Test your link in a chat with yourself *before* sending it widely. If you change the preview
afterwards, sharing the link with a different ending (for example `.../?v=2`) often forces a new preview,
and Facebook's "Sharing Debugger" can re-scrape a URL.

## 7. Customize

| What | Where |
| --- | --- |
| Colours | Variables at the top of `css/styles.css` (`--color-maroon`, `--color-gold`, …) |
| Fonts | `<link>` in `index.html` and `--font-serif` / `--font-sans` in `css/styles.css` |
| Wording | Visible text in `index.html` |
| Date, time, venue, meetup, names, signature (for JS features) | `js/config.js` — **and** the matching text in `index.html` (hero, details, meetup, countdown note, `<title>`, meta tags, JSON-LD) |
| Countdown target | `event.start` in `js/config.js` (ISO time with the `+05:30` India offset) |
| Directions button | Built from the venue name + address in `js/config.js`; the fallback link is also in `index.html` (`id="directions-link"`). To use a Google Maps "Share" link instead, paste it into that `href` and remove `data-directions` from the tag |
| Signature line | `index.html` (`.closing__signoff`) and `hosts` in `js/config.js`. It currently reads "Ex-Sub Sukrampal Singh & Family"; change both places if you prefer "Khushbu & Gagan & Family" |
| Music | Save a track you are allowed to use as `assets/music.mp3`, then set `music: Object.freeze({ enabled: true })` in `js/config.js` (see `assets/README.txt`). It is off by default, so a missing file never causes errors |
| Preview image | `assets/og-image.png` (1200 × 630) |

## 8. Test on iPhone and Android

Do this on the deployed link, not just locally.

- [ ] Opens over HTTPS in Safari (iPhone) and Chrome (Android); the opening screen fits without scrolling.
- [ ] "SHREE GANESHAY NAMAH" appears, then the title, then **Open Invitation**; tapping it opens the invitation smoothly.
- [ ] Gagan & Khushbu are large and readable without zooming; no sideways scrolling anywhere (try 320 px width and landscape).
- [ ] **Get Directions** opens Google Maps with a search for Alka Motel, Pallav Vihar, Bulandshahr.
- [ ] **Add to Calendar** downloads an `.ics` file that opens in the calendar app with the right date/time (10:30 AM IST).
- [ ] The countdown ticks every second and shows the right remaining time.
- [ ] **Share Invitation** opens the share sheet (choose WhatsApp); the message has names, date, venue and the link.
- [ ] **Copy Event Details** shows "copied"; pasting into a chat works.
- [ ] With music off (the default), there is no music button. With `music.mp3` added and `enabled: true`, the button plays and pauses, and nothing plays by itself.
- [ ] Turn on "Reduce Motion" (iOS: Accessibility → Motion; Android: Remove animations): text still appears, motion stops.
- [ ] Send the link to yourself on WhatsApp and check the preview card (title, description, image).
- [ ] Turn on airplane mode after loading once: the page still works (fonts fall back, countdown continues).

## 9. Feature checklist

**Implemented**

- [x] Opening screen with floating gold particles, blessing, title and "Open Invitation" button (no sound)
- [x] Hero with Gagan & Khushbu, mask-reveal names, self-drawing line-art arch
- [x] Event details with calendar and location icons, Google Maps search link for the exact venue
- [x] Meetup section (Our House, 8:30 AM IST; no invented address)
- [x] Live countdown to 12 Oct 2026, 10:30 AM IST, no negatives, graceful post-event message, timers cleaned up
- [x] Closing messages, signature and floral flourish
- [x] Scroll reveals, progress bar, light parallax, reduced-motion support, text visible without JS
- [x] Optional music button (off by default) that never autoplays and hides itself with a message if the file is missing
- [x] Share (Web Share API, clipboard fallback), Copy Event Details, Add to Calendar (real `.ics` download)
- [x] SEO, Open Graph, Twitter card, theme colour, SVG favicon, structured data
- [x] GitHub Actions and GitLab CI deployment that write the real URL into the preview tags
- [x] Keyboard focus styles, skip link, safe-area insets, 320 px support

**Needs your own action**

- [ ] Create the repository and enable GitHub Pages (or GitLab Pages)
- [ ] Confirm the signature wording (see section 7)
- [ ] Replace `assets/og-image.png` with your preferred 1200 × 630 image (optional)
- [ ] Add `assets/music.mp3` and set `music.enabled` to `true` in `js/config.js` if you want music (optional; must be music you may use)
- [ ] Test the link in WhatsApp before sending; previews may be cached by the platform
- [ ] Review the page on your own phone

## Credits and licences

* Fonts: Cormorant Garamond and Jost via Google Fonts (SIL Open Font License, free to use).
