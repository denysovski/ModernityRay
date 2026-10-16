/* The members' calendar.
 *
 * CALENDAR is the source of truth; the homepage's featured trio is picked out
 * of it by slug rather than duplicated, so an event only ever has one record.
 * Dates are ISO strings — formatting lives in lib/format so it can be tested
 * without rendering anything.
 */
import { local } from './images'

/** Every category used below, in the order the filter bar shows them. */
export const EVENT_CATEGORIES = ['Tournament', 'League', 'Clinic', 'Social', 'Retreat']

/**
 * @typedef {Object} ClubEvent
 * @property {string} slug
 * @property {string} title
 * @property {typeof EVENT_CATEGORIES[number]} category
 * @property {string} start      ISO date, YYYY-MM-DD
 * @property {string} [end]      ISO date; omitted for single-day events
 * @property {string} venue      a slug from data/courts
 * @property {string} img
 * @property {string} desc
 * @property {number} price      USD; 0 means included in membership
 * @property {number} spots      places left, drives the "nearly full" state
 * @property {string} cta
 */

/** @type {ClubEvent[]} */
export const CALENDAR = [
  {
    slug: 'summer-open-doubles',
    title: 'Summer Open — Doubles Championship',
    category: 'Tournament',
    start: '2027-08-14',
    end: '2027-08-16',
    venue: 'centre-court',
    img: local('floodlights.jpg'),
    desc:
      'Three days of floodlit doubles across every surface, finishing with the ' +
      'final under lights on Centre Court. Open to all tiers; Signature members ' +
      'enter free.',
    price: 60,
    spots: 8,
    cta: 'Reserve a spot',
  },
  {
    slug: 'sunset-clay-clinics',
    title: 'Sunset clay clinics',
    category: 'Clinic',
    start: '2027-05-06',
    venue: 'centre-court',
    img: local('clay.jpg'),
    desc:
      'Weekly technique work on the clay as the floodlights come up — footwork, ' +
      'the slide, and the patience to play long points.',
    price: 0,
    spots: 12,
    cta: 'Join',
  },
  {
    slug: 'dusk-run-mixer',
    title: 'Dusk run & lakeside mixer',
    category: 'Social',
    start: '2027-04-30',
    venue: 'golf-greens',
    img: local('runners.jpg'),
    desc:
      'Five kilometres around the lake at golden hour, then drinks on the ' +
      'clubhouse terrace. No pace requirement and no one left behind.',
    price: 0,
    spots: 40,
    cta: 'RSVP',
  },
  {
    slug: 'spring-singles-ladder',
    title: 'Spring singles ladder',
    category: 'League',
    start: '2027-03-08',
    end: '2027-06-14',
    venue: 'the-lawns',
    img: local('baseline.jpg'),
    desc:
      'A fourteen-week ranked ladder with one fixture a week, arranged between ' +
      'players. Promotion and relegation every fortnight.',
    price: 35,
    spots: 6,
    cta: 'Enter the ladder',
  },
  {
    slug: 'junior-academy-camp',
    title: 'Junior Academy spring camp',
    category: 'Clinic',
    start: '2027-04-05',
    end: '2027-04-09',
    venue: 'the-lawns',
    img: local('bluesky.jpg'),
    desc:
      'Five full days of coached play for ages six to sixteen, grouped by ' +
      'standard. Included with the Junior & Family tier.',
    price: 180,
    spots: 14,
    cta: 'Book a place',
  },
  {
    slug: 'club-championship-golf',
    title: 'Club Championship — 36 holes',
    category: 'Tournament',
    start: '2027-07-10',
    end: '2027-07-11',
    venue: 'golf-greens',
    img: local('golf.jpg'),
    desc:
      'Thirty-six holes of strokeplay over a weekend, handicapped and gross ' +
      'divisions, finishing with lunch in the clubhouse.',
    price: 75,
    spots: 22,
    cta: 'Enter',
  },
  {
    slug: 'recovery-retreat',
    title: 'Recovery & mobility retreat',
    category: 'Retreat',
    start: '2027-09-18',
    end: '2027-09-19',
    venue: 'the-pavilion',
    img: local('yoga.jpg'),
    desc:
      'A weekend of contrast therapy, guided mobility and soft-tissue work, with ' +
      'two nights of lakeside dining and nothing competitive about it.',
    price: 290,
    spots: 4,
    cta: 'Reserve',
  },
  {
    slug: 'masters-swim-series',
    title: 'Masters swim series',
    category: 'League',
    start: '2027-05-22',
    end: '2027-08-28',
    venue: 'lakeside-pool',
    img: local('lanes.jpg'),
    desc:
      'Monthly timed sets across four strokes, scored cumulatively over the ' +
      'season. Coached warm-up included in every round.',
    price: 25,
    spots: 18,
    cta: 'Sign up',
  },
  {
    slug: 'members-summer-party',
    title: 'Members’ summer party',
    category: 'Social',
    start: '2027-06-26',
    venue: 'the-pavilion',
    img: local('palms.jpg'),
    desc:
      'The one night a year the whole club is in one place — long tables on the ' +
      'lawns, a band on the terrace, and guests welcome.',
    price: 0,
    spots: 120,
    cta: 'RSVP',
  },
]

/** Lookup used by the /events/:slug route. */
export const eventBySlug = (slug) => CALENDAR.find((e) => e.slug === slug)

/* The homepage picks three out of the calendar — one wide, two stacked. */
const pick = (slug) => CALENDAR.find((e) => e.slug === slug)

export const EVENTS = {
  feature: pick('summer-open-doubles'),
  small: [pick('sunset-clay-clinics'), pick('dusk-run-mixer')],
}
