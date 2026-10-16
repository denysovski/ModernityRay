import { describe, expect, it } from 'vitest'
import { byDate, formatDate, formatDateRange, hasEnded, monthKey, monthLabel } from '../../src/lib/format'

/* The calendar's date handling. `now` is always injected, so these assertions
   are still true next year. */

describe('formatDate', () => {
  it('writes a readable date', () => {
    expect(formatDate('2027-05-06')).toBe('6 May 2027')
    expect(formatDate('2027-12-25')).toBe('25 December 2027')
  })

  it('returns an empty string rather than "Invalid Date"', () => {
    expect(formatDate('2027-02-31')).toBe('')
    expect(formatDate('nonsense')).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('reads the date as local midnight, not UTC', () => {
    // a UTC parse would render 1 January as 31 December west of Greenwich
    expect(formatDate('2027-01-01')).toBe('1 January 2027')
  })
})

describe('formatDateRange', () => {
  it('collapses a span inside one month', () => {
    expect(formatDateRange('2027-08-14', '2027-08-16')).toBe('14–16 August 2027')
  })

  it('keeps both months inside one year', () => {
    expect(formatDateRange('2027-05-22', '2027-08-28')).toBe('22 May – 28 August 2027')
  })

  it('spells out both ends across a year boundary', () => {
    expect(formatDateRange('2027-12-28', '2028-01-03')).toBe('28 December 2027 – 3 January 2028')
  })

  it('falls back to a single date', () => {
    expect(formatDateRange('2027-05-06')).toBe('6 May 2027')
    expect(formatDateRange('2027-05-06', '2027-05-06')).toBe('6 May 2027')
  })

  it('tolerates a reversed range', () => {
    expect(formatDateRange('2027-08-16', '2027-08-14')).toBe('14–16 August 2027')
  })
})

describe('monthKey and monthLabel', () => {
  it('groups by year and month', () => {
    expect(monthKey('2027-08-14')).toBe('2027-08')
    expect(monthLabel('2027-08-14')).toBe('August 2027')
    expect(monthLabel('2027-08')).toBe('August 2027')
  })
})

describe('hasEnded', () => {
  const now = new Date(2026, 9, 16, 12, 0)

  it('is false for a date still to come', () => {
    expect(hasEnded({ start: '2027-08-14' }, now)).toBe(false)
  })

  it('is false on the day itself, right up to midnight', () => {
    expect(hasEnded({ start: '2026-10-16' }, now)).toBe(false)
  })

  it('is false while a multi-day event is running', () => {
    expect(hasEnded({ start: '2026-10-10', end: '2026-10-20' }, now)).toBe(false)
  })

  it('is true once the last day is past', () => {
    expect(hasEnded({ start: '2026-10-10', end: '2026-10-15' }, now)).toBe(true)
  })
})

describe('byDate', () => {
  it('sorts chronologically', () => {
    const list = [{ start: '2027-08-14' }, { start: '2027-03-08' }, { start: '2027-05-22' }]
    expect([...list].sort(byDate).map((e) => e.start)).toEqual([
      '2027-03-08',
      '2027-05-22',
      '2027-08-14',
    ])
  })
})
