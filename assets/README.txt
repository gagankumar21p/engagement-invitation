ASSETS FOLDER
=============

favicon.svg   Tab icon (included).
og-image.png  1200 x 630 link-preview image used by WhatsApp / social cards (a simple placeholder is
              included; replace it with your own image of the same name and size).
music.mp3     OPTIONAL background music. It is NOT included.

To enable music:
  1. Choose music you have the right to use (your own recording, a licensed track, or a
     royalty-free / Creative Commons track whose licence allows this use).
  2. Save it in this folder with the exact name  music.mp3  (keep it small, ideally under 3 MB;
     a 1 to 2 minute loop at 96-128 kbps is plenty).
  3. Open js/config.js and change   music: Object.freeze({ enabled: false })
     to                             music: Object.freeze({ enabled: true })
  4. Commit and deploy again.

Until you do this, the site works normally with no music button and no audio requests.
Music never starts by itself: visitors must tap the music button. If the file turns out to be
missing or unplayable, the button hides itself and a short message appears.
