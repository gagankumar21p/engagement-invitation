// Share, copy and calendar-download actions. Everything runs in the browser; nothing is sent anywhere.

import { INVITE, directionsUrl, eventStartMs } from './config.js';
import { toast } from './toast.js';

/** The public address of this invitation (config override, otherwise the current page without #hash). */
export function getInviteUrl() {
  if (INVITE.siteUrl) return INVITE.siteUrl;
  const { origin, pathname, href } = window.location;
  if (origin && origin !== 'null') return origin + pathname;
  return href.split('#')[0];
}

function shareHeadline() {
  return `You're invited to the engagement of ${INVITE.couple.groom} & ${INVITE.couple.bride}!`;
}

/** WhatsApp-friendly invitation message. */
export function shareMessage({ includeUrl = true } = {}) {
  const e = INVITE.event;
  const lines = [
    shareHeadline(),
    '',
    `${e.dateLabel} · ${e.timeLabel}`,
    `${e.venueName}, ${e.venueAddress}`,
  ];
  if (includeUrl) {
    lines.push('', `Invitation: ${getInviteUrl()}`);
  }
  return lines.join('\n');
}

export function eventDetailsText() {
  const e = INVITE.event;
  const m = INVITE.meetup;
  return [
    `Engagement of ${INVITE.couple.groom} & ${INVITE.couple.bride}`,
    '',
    `Date: ${e.dateLabel}`,
    `Time: ${e.timeLabel}`,
    `Venue: ${e.venueName}, ${e.venueAddress}`,
    `Directions: ${directionsUrl()}`,
    '',
    `Meetup: ${m.point} at ${m.timeLabel}`,
    '',
    `Invitation: ${getInviteUrl()}`,
    '',
    `With love and warm regards, ${INVITE.hosts}`,
  ].join('\n');
}

/** Copies text. Uses the async Clipboard API when possible, otherwise a textarea fallback. */
export async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // fall through to the legacy path
    }
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;';
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (err) {
    ok = false;
  }
  area.remove();
  return ok;
}

async function handleShare() {
  const url = getInviteUrl();
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: `${INVITE.couple.groom} & ${INVITE.couple.bride} — Engagement Invitation`,
        text: shareMessage({ includeUrl: false }),
        url,
      });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return; // the person closed the share sheet
      // any other failure: fall back to copying the link
    }
  }
  const ok = await copyText(url);
  toast(ok ? 'Invitation link copied.' : 'Could not copy automatically. Please copy the link from the address bar.');
}

async function handleCopyDetails() {
  const ok = await copyText(eventDetailsText());
  toast(ok ? 'Event details copied.' : 'Could not copy automatically. Please select and copy the details manually.');
}

// ---- Calendar (.ics) -------------------------------------------------------------------------

function formatUtc(ms) {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}

function escapeIcs(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

// Lines longer than 75 characters must be folded (RFC 5545).
function foldLine(line) {
  const parts = [];
  let rest = line;
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  parts.push(rest);
  return parts.join('\r\n');
}

export function buildIcs() {
  const e = INVITE.event;
  const m = INVITE.meetup;
  const start = eventStartMs();
  const end = start + e.durationMinutes * 60000;
  const description = [
    `Together with our families, we joyfully invite you to celebrate the engagement of ${INVITE.couple.groom} and ${INVITE.couple.bride}.`,
    `Meetup: ${m.point} at ${m.timeLabel}.`,
    `Directions: ${directionsUrl()}`,
    `Invitation: ${getInviteUrl()}`,
  ].join('\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Engagement Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:engagement-${formatUtc(start)}@engagement-invitation`,
    `DTSTAMP:${formatUtc(Date.now())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeIcs(e.title)}`,
    `LOCATION:${escapeIcs(`${e.venueName}, ${e.venueAddress}`)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}

function handleAddToCalendar() {
  try {
    const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'gagan-khushbu-engagement.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 4000);
    toast('Calendar file downloaded. Open it to add the event.');
  } catch (err) {
    toast('Could not create the calendar file on this device.');
  }
}

export function initShare() {
  // Make sure every directions link points at the Google Maps search for the exact venue.
  document.querySelectorAll('[data-directions]').forEach((a) => { a.href = directionsUrl(); });

  const actions = {
    share: handleShare,
    'copy-details': handleCopyDetails,
    'add-calendar': handleAddToCalendar,
  };
  document.querySelectorAll('[data-action]').forEach((button) => {
    const handler = actions[button.dataset.action];
    if (handler) button.addEventListener('click', handler);
  });
}
