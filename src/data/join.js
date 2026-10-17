/* Content for the three ways into the club: joining, visiting first, and
   the student rate. Kept here with the rest of the site's copy so the views
   stay about layout. */
import { local, remote } from './images'

/* ── gift vouchers ──────────────────────────────────────────────────────── */

/**
 * @typedef {Object} Voucher
 * @property {number} value   face value in USD, also the price
 * @property {string} name
 * @property {string} covers  what it buys, in plain terms
 * @property {string} note    the small print, one line
 */

/** @type {Voucher[]} */
export const VOUCHERS = [
  {
    value: 50,
    name: 'An afternoon',
    covers: 'A day pass, with a court hour on The Lawns.',
    note: 'Enough for one visit, start to finish.',
  },
  {
    value: 100,
    name: 'A weekend',
    covers: 'Two day passes, or one coached hour on the clay.',
    note: 'The usual gift for someone curious about the club.',
  },
  {
    value: 200,
    name: 'A month of play',
    covers: 'A month of Resident access, or four coached hours.',
    note: 'Long enough to build a habit.',
  },
  {
    value: 500,
    name: 'A season',
    covers: 'Most of a season on any tier, or a recovery retreat.',
    note: 'Our most given card.',
  },
]

export const GIFT_FACTS = [
  { label: 'Valid for', value: '24 months' },
  { label: 'Delivered', value: 'By email, instantly' },
  { label: 'Spendable on', value: 'Anything at the club' },
  { label: 'Refundable', value: 'Unused balance, any time' },
]

/* ── private tours ──────────────────────────────────────────────────────── */

/**
 * @typedef {Object} TourSlot
 * @property {string} id
 * @property {string} date    ISO date
 * @property {string} time
 * @property {string} host    who walks you round
 * @property {string} role
 * @property {string} focus   what this particular tour dwells on
 * @property {number} places  how many spots the tour holds
 * @property {number} taken   how many are already claimed
 */

/** @type {TourSlot[]} */
export const TOURS = [
  {
    id: 'tour-2027-03-14-0930',
    date: '2027-03-14',
    time: '09:30',
    host: 'Marta Lindqvist',
    role: 'Club manager',
    focus: 'The grounds end to end, finishing with coffee in the clubhouse.',
    places: 8,
    taken: 5,
  },
  {
    id: 'tour-2027-03-21-1700',
    date: '2027-03-21',
    time: '17:00',
    host: 'Davis Korsgaard',
    role: 'Head coach',
    focus: 'Courts and coaching, with the floodlights coming on as you go.',
    places: 6,
    taken: 2,
  },
  {
    id: 'tour-2027-04-04-1030',
    date: '2027-04-04',
    time: '10:30',
    host: 'Jonah Reyes',
    role: 'Strength coach',
    focus: 'The Pavilion, the recovery suite and the pool.',
    places: 8,
    taken: 7,
  },
  {
    id: 'tour-2027-04-18-0900',
    date: '2027-04-18',
    time: '09:00',
    host: 'Alan Whitcombe',
    role: 'Golf professional',
    focus: 'A walk of the front nine, then the practice range.',
    places: 6,
    taken: 1,
  },
  {
    id: 'tour-2027-05-09-1600',
    date: '2027-05-09',
    time: '16:00',
    host: 'Marta Lindqvist',
    role: 'Club manager',
    focus: 'The family tour: juniors welcome, academy squads in session.',
    places: 10,
    taken: 4,
  },
]

export const TOUR_STEPS = [
  {
    title: 'Put your name down',
    desc: 'Pick a date that suits you. Tours run in small groups, so you will meet other people considering the club.',
  },
  {
    title: 'Arrive and be shown round',
    desc: 'An hour on foot with someone who works here. Courts, greens, the Pavilion, the clubhouse, and whatever you ask to see.',
  },
  {
    title: 'Play, if you want to',
    desc: 'Rackets and a court are held for every tour. Stay for a hit afterwards, or just finish your coffee and leave.',
  },
  {
    title: 'Decide later',
    desc: 'Nobody will ask you to sign anything on the day. The fee is paid at the desk when you arrive and comes off your first month if you join.',
  },
]

/* ── student membership ─────────────────────────────────────────────────── */

export const STUDENT = {
  price: 65,
  full: 190,
  cadence: 'per month',
  includes: [
    'Full court and green access outside peak hours',
    'One group clinic every week',
    'Recovery suite and pool',
    'Member rates on coaching and the pro shop',
    'Guest pass once a month',
  ],
  conditions: [
    {
      title: 'A valid student card',
      desc: 'Any university or college, anywhere. Checked once a year, not every visit.',
    },
    {
      title: 'A short conversation',
      desc: 'The rate is agreed in person with the club manager. It takes fifteen minutes and there is no form.',
    },
    {
      title: 'Outside peak hours',
      desc: 'Weekdays before five and after eight, and all weekend. Peak hours are available at the usual member rate.',
    },
  ],
  steps: [
    { n: 1, title: 'Book a conversation', desc: 'Fifteen minutes with the club manager, in person.' },
    { n: 2, title: 'Bring your card', desc: 'A student card and something with your address on it.' },
    { n: 3, title: 'Start the same day', desc: 'The rate applies from the moment it is agreed.' },
  ],
}

/* ── becoming a member ──────────────────────────────────────────────────── */

export const JOIN_STEPS = [
  {
    n: 1,
    title: 'See the place',
    desc: 'Book a private tour, or take a day pass and use the club as a member would for a day.',
  },
  {
    n: 2,
    title: 'Pick a tier',
    desc: 'Five of them, from a single day to ten transferable seats. The difference is how often you come and who you bring.',
  },
  {
    n: 3,
    title: 'Join',
    desc: 'Four steps online. Access is live immediately; the card is posted within the week.',
  },
  {
    n: 4,
    title: 'Settle in',
    desc: 'Your first month includes an induction with a coach and a session in the recovery suite.',
  },
]

export const JOIN_ANSWERS = [
  {
    q: 'Is there a joining fee?',
    a: 'No. Every tier is the price you see, and the monthly ones can be cancelled whenever you like unless they carry a minimum term.',
  },
  {
    q: 'Is there a waiting list?',
    a: 'Not at the moment. Signature is capped at sixty members and has been close to full twice; everything else is open.',
  },
  {
    q: 'Can I bring guests?',
    a: 'On every tier except the day pass. How many depends on the tier, from two a month up to as many as you like.',
  },
  {
    q: 'What if I travel for work?',
    a: 'Freeze any monthly membership for up to three months a year. You will not be charged while it is frozen.',
  },
  {
    q: 'Do I need to be any good?',
    a: 'No. Roughly a third of members had not held a racket before joining, and the group clinics are grouped by standard.',
  },
]

export const JOIN_FACES = [
  remote('1494790108377-be9c29b29330', 96),
  remote('1507003211169-0a1dd7228f2d', 96),
  remote('1534528741775-53994a69daeb', 96),
  remote('1500648767791-00dcc994a43e', 96),
  remote('1438761681033-6461ffad8d80', 96),
]

/* The photograph beside the questions, and the panel laid over it. The
   column holding "What people ask." was two thirds empty below the
   heading; this fills it with the things people are really asking about
   underneath the questions themselves. */
export const JOIN_ASK_MEDIA = {
  img: local('courtlife.jpg'),
  label: 'Becoming a member',
  title: 'What you are actually signing.',
  points: [
    'No joining fee, on any of the five tiers',
    'One month’s notice, in writing or in person',
    'Coaching and recovery included, never an add-on',
    'A tour first, if you would rather see it than read it',
  ],
}

export const JOIN_IMG = local('stretch.jpg')
export const TOUR_IMG = local('woodcourt.jpg')
export const STUDENT_IMG = local('bluesky.jpg')
export const GIFT_IMG = local('airborne.jpg')
