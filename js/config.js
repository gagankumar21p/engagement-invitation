// Central place for the facts the JavaScript needs (countdown, calendar file, share text, directions).
// The visible text on the page lives in index.html. If you change the date, venue or names,
// update BOTH this file and index.html (see README.md → "Customize").

export const INVITE = Object.freeze({
  couple: Object.freeze({ groom: 'Gagan', bride: 'Khushbu' }),

  // Optional. Leave empty to use the address the page is opened from (recommended).
  // Set it (for example 'https://username.github.io/engagement-invitation/') only if you want
  // Share links should always point to one specific URL.
  siteUrl: '',

  event: Object.freeze({
    title: 'Engagement of Gagan & Khushbu',
    // ISO 8601 with an explicit +05:30 offset = India Standard Time. Do not remove the offset.
    start: '2026-10-12T10:30:00+05:30',
    durationMinutes: 180,
    dateLabel: 'Monday, 12 October 2026',
    timeLabel: '10:30 AM IST',
    venueName: 'Alka Motel',
    venueAddress: 'Pallav Vihar, Bulandshahr, Uttar Pradesh, India',
  }),

  meetup: Object.freeze({
    point: 'Our House',
    timeLabel: '8:30 AM IST',
  }),

  hosts: 'Ex-Sub Sukrampal Singh & Family',

  // Background music. Keep false until you have added assets/music.mp3 (see README.md → Customize).
  // When false, no music button is shown and no audio request is ever made.
  music: Object.freeze({ enabled: false }),
});

/** Google Maps search link built from the venue name + address (no invented coordinates). */
export function directionsUrl() {
  const query = `${INVITE.event.venueName}, ${INVITE.event.venueAddress}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Event start as epoch milliseconds. */
export function eventStartMs() {
  return new Date(INVITE.event.start).getTime();
}
