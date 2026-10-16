/* Date and label formatting.
 *
 * Pure functions on ISO date strings, deliberately free of React and of any
 * module-level `new Date()` — every function that needs "now" takes it as an
 * argument, which is what makes the calendar testable without faking timers.
 */

const LOCALE = 'en-GB'

/** Parses YYYY-MM-DD as a local-midnight date, not a UTC one. */
const parse = (iso) => {
  if (typeof iso !== 'string') return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!m) return null
  const [, y, mo, d] = m
  const date = new Date(Number(y), Number(mo) - 1, Number(d))
  // rejects 2027-02-31 and friends, which Date would silently roll over
  return date.getMonth() === Number(mo) - 1 ? date : null
}

const parts = (date) => ({
  day: date.getDate(),
  month: date.toLocaleDateString(LOCALE, { month: 'long' }),
  year: date.getFullYear(),
})

/** '2027-05-06' -> '6 May 2027'. Returns '' for anything unparseable. */
export const formatDate = (iso) => {
  const d = parse(iso)
  if (!d) return ''
  const p = parts(d)
  return `${p.day} ${p.month} ${p.year}`
}

/**
 * Collapses a span to the shortest honest form:
 *   same month  -> '14–16 August 2027'
 *   same year   -> '22 May – 28 August 2027'
 *   otherwise   -> '28 December 2027 – 3 January 2028'
 * With no end date, or an end equal to the start, falls back to formatDate.
 */
export const formatDateRange = (start, end) => {
  const a = parse(start)
  const b = parse(end)
  if (!a) return ''
  if (!b || a.getTime() === b.getTime()) return formatDate(start)
  if (b < a) return formatDateRange(end, start)

  const pa = parts(a)
  const pb = parts(b)
  if (pa.year === pb.year && pa.month === pb.month) {
    return `${pa.day}–${pb.day} ${pa.month} ${pa.year}`
  }
  if (pa.year === pb.year) {
    return `${pa.day} ${pa.month} – ${pb.day} ${pb.month} ${pb.year}`
  }
  return `${formatDate(start)} – ${formatDate(end)}`
}

/** Sort/group key for a month, e.g. '2027-08'. */
export const monthKey = (iso) => (typeof iso === 'string' ? iso.slice(0, 7) : '')

/** '2027-08' or '2027-08-14' -> 'August 2027'. */
export const monthLabel = (iso) => {
  const d = parse(`${monthKey(iso)}-01`)
  if (!d) return ''
  const p = parts(d)
  return `${p.month} ${p.year}`
}

/**
 * True when the event has finished. An event runs to the end of its last day,
 * so a range ending today still counts as current.
 * @param {{start: string, end?: string}} event
 * @param {Date} [now] injected so tests do not depend on the clock
 */
export const hasEnded = (event, now = new Date()) => {
  const last = parse(event?.end) || parse(event?.start)
  if (!last) return false
  last.setHours(23, 59, 59, 999)
  return last.getTime() < now.getTime()
}

/** Chronological comparator for calendar entries. */
export const byDate = (a, b) => String(a.start).localeCompare(String(b.start))
