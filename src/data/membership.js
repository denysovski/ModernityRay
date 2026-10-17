/* Pricing, benefits and what members say.
 *
 * Prices are plain numbers, not display strings — the cart, the totals and the
 * checkout all do arithmetic on them, and `money()` in lib/store owns the one
 * place that formats them. A tier's `slug` is its route segment, so
 * /memberships/:slug resolves straight out of this file.
 */
import { local, remote } from './images'

export const TESTIMONIALS = [
  { quote: 'Best decision I made this year. The courts are immaculate and the coaching is genuinely world-class.', name: 'Isabella Rodriguez', role: 'Resident member', img: remote('1494790108377-be9c29b29330', 120) },
  { quote: 'Calm, never crowded, and the recovery suite alone is worth the membership.', name: 'Gabrielle Williams', role: 'Signature member', img: remote('1438761681033-6461ffad8d80', 120) },
  { quote: 'I have trained at clubs all over the city. Nothing comes close to this one.', name: 'Samantha Johnson', role: 'Resident member', img: remote('1534528741775-53994a69daeb', 120) },
  { quote: 'From booking to play it takes seconds. The whole experience just feels effortless.', name: 'Victoria Thompson', role: 'Resident member', img: remote('1544005313-94ddf0286df2', 120) },
  { quote: 'The community here pushes me to be better every single week.', name: 'John Peter', role: 'Signature member', img: remote('1500648767791-00dcc994a43e', 120) },
  { quote: 'A refreshing, considered space — every detail is thought through.', name: 'Daniel Cho', role: 'Resident member', img: remote('1507003211169-0a1dd7228f2d', 120) },
  { quote: 'My game has improved more in three months than in three years before.', name: 'Natalie Martin', role: 'Day-pass member', img: remote('1633332755192-727a05c4013d', 120) },
  { quote: 'Coaching that actually meets you at your level. Highly recommended.', name: 'Marcus Lee', role: 'Resident member', img: remote('1463453091185-61582044d556', 120) },
]

/**
 * @typedef {Object} Tier
 * @property {string} slug        route segment under /memberships
 * @property {string} name
 * @property {string} [tag]       badge shown on the card
 * @property {number} price       in USD, billed per `cadence`
 * @property {string} cadence     'per month' | 'per visit' | 'per year'
 * @property {string} note        small print under the call to action
 * @property {string} summary     one sentence for the overview grid
 * @property {string} img
 * @property {string[]} benefits  bullet list, shown on card and detail
 * @property {{icon: string, title: string, desc: string}[]} includes
 * @property {{label: string, value: string}[]} specs  the detail view's fact table
 * @property {boolean} [shipped]  false for digital-only tiers (no member card posted)
 * @property {boolean} [featured] the tier the homepage promotes
 * @property {string} line     the promise, in one sentence
 * @property {string} forWhom  who the tier is actually for
 * @property {{value: string, label: string, note: string}[]} figures
 *   Three headline numbers, the spine of the membership page.
 */

/** @type {Tier[]} */
export const TIERS = [
  {
    slug: 'day-pass',
    line: 'A day, not a decision.',
    forWhom:
      'Someone who wants to see the place before committing to it.',
    figures: [
      { value: '24', label: 'hours of access', note: 'From first entry, not from midnight.' },
      { value: '0', label: 'joining fee', note: 'Nothing to cancel afterwards.' },
      { value: '1', label: 'drop-in clinic', note: 'Join any group session running that day.' },
    ],
    name: 'Day Pass',
    price: 45,
    cadence: 'per visit',
    note: 'Valid 24 hours · no commitment',
    summary: 'A single day of full access, for trying the club before you commit.',
    img: local('courtside.jpg'),
    shipped: false,
    benefits: [
      'One full day of court and green access',
      'Locker, towel and shower service',
      'One drop-in group clinic',
      'Clubhouse dining at member prices',
    ],
    includes: [
      { icon: 'clock', title: '24-hour access', desc: 'Arrive any time; the pass runs a full day from first entry.' },
      { icon: 'check', title: 'No joining fee', desc: 'Nothing to cancel and nothing stored on file afterwards.' },
    ],
    specs: [
      { label: 'Booking window', value: 'Same day' },
      { label: 'Guests', value: 'Not included' },
      { label: 'Member card', value: 'Digital only' },
      { label: 'Minimum term', value: 'None' },
    ],
  },
  {
    slug: 'junior-family',
    line: 'One household, one membership.',
    forWhom:
      'Families who would rather be at the club together than take turns.',
    figures: [
      { value: '5', label: 'people covered', note: 'Two adults and up to three juniors.' },
      { value: '2×', label: 'coaching a week', note: 'Age-grouped squads, technique through to match play.' },
      { value: '4', label: 'holiday camps', note: 'Full days, every school break, included.' },
    ],
    name: 'Junior & Family',
    tag: 'All ages',
    price: 240,
    cadence: 'per month',
    note: 'Two adults + up to three juniors',
    summary: 'One household, one membership — coached pathways for ages 6 to 16.',
    img: local('bluesky.jpg'),
    benefits: [
      'Access for two adults and up to three juniors',
      'Junior Academy coaching included',
      'Weekend family court priority',
      'School-holiday camps at no extra cost',
      'Two guest passes each month',
    ],
    includes: [
      { icon: 'dumbbell', title: 'Academy coaching', desc: 'Age-grouped squads twice weekly, technique through to match play.' },
      { icon: 'spark', title: 'Holiday camps', desc: 'Full-day supervised camps every school break.' },
      { icon: 'check', title: 'One bill', desc: 'The whole household on a single monthly price.' },
    ],
    specs: [
      { label: 'Booking window', value: '10 days ahead' },
      { label: 'Guests', value: '2 per month' },
      { label: 'Member card', value: 'Posted, one per adult' },
      { label: 'Minimum term', value: '3 months' },
    ],
  },
  {
    slug: 'resident',
    line: 'The whole club, one honest price.',
    forWhom:
      'Members who play most weeks and want no decisions left to make.',
    figures: [
      { value: '24/7', label: 'access', note: 'Every court and green, every day of the year.' },
      { value: '14', label: 'days ahead', note: 'Priority booking before it opens to anyone else.' },
      { value: '2', label: 'clinics a week', note: 'Coached group sessions at no extra cost.' },
    ],
    name: 'Resident',
    tag: 'Most popular',
    price: 190,
    cadence: 'per month',
    note: 'No joining fee · cancel anytime',
    summary: 'The full club on one honest monthly price — no tiers to decode.',
    img: local('courts.jpg'),
    featured: true,
    benefits: [
      '24/7 access to every court & green',
      'Priority booking up to 14 days ahead',
      'Two group clinics every week',
      'Recovery suite, sauna & spa access',
      'Bring up to 4 guests each month',
    ],
    includes: [
      { icon: 'clock', title: 'Open 24 / 7', desc: 'Play whenever it suits you, every day of the year.' },
      { icon: 'dumbbell', title: 'Coaching included', desc: 'Weekly clinics with certified pros at no extra cost.' },
      { icon: 'spark', title: 'Members-only events', desc: 'Socials, leagues and retreats all season long.' },
      { icon: 'check', title: 'One simple price', desc: 'Everything in, no add-ons, no surprises.' },
    ],
    specs: [
      { label: 'Booking window', value: '14 days ahead' },
      { label: 'Guests', value: '4 per month' },
      { label: 'Member card', value: 'Posted within 5 days' },
      { label: 'Minimum term', value: 'None' },
    ],
  },
  {
    slug: 'signature',
    line: 'Your court, your coach, your hours.',
    forWhom:
      'Players with a standing routine and no patience for a waiting list.',
    figures: [
      { value: '4', label: 'private hours', note: 'One to one each month with the pro you choose.' },
      { value: '30', label: 'days ahead', note: 'The longest booking window at the club.' },
      { value: '∞', label: 'guests', note: 'Bring whoever you like, as often as you like.' },
    ],
    name: 'Signature',
    tag: 'Full access',
    price: 420,
    cadence: 'per month',
    note: 'Includes private coaching hours',
    summary: 'Everything in Resident, plus a named coach and the reserved courts.',
    img: local('woodcourt.jpg'),
    benefits: [
      'Everything in the Resident tier',
      'Four private coaching hours monthly',
      'Reserved Centre Court slots',
      'Unlimited guests',
      'Championship and tournament entry included',
      'Dedicated membership manager',
    ],
    includes: [
      { icon: 'dumbbell', title: 'Named coach', desc: 'Four one-to-one hours a month with the pro you choose.' },
      { icon: 'star', title: 'Reserved courts', desc: 'Standing Centre Court slots held in your name each week.' },
      { icon: 'spark', title: 'Tournament entry', desc: 'Every club championship and invitational included.' },
      { icon: 'check', title: 'Membership manager', desc: 'One person who knows you and handles everything.' },
    ],
    specs: [
      { label: 'Booking window', value: '30 days ahead' },
      { label: 'Guests', value: 'Unlimited' },
      { label: 'Member card', value: 'Engraved, posted within 10 days' },
      { label: 'Minimum term', value: '6 months' },
    ],
  },
  {
    slug: 'corporate',
    line: 'Ten seats, one invoice.',
    forWhom:
      'Teams who use the club for people and for clients in equal measure.',
    figures: [
      { value: '10', label: 'named seats', note: 'Reassign any of them at the start of a month.' },
      { value: '4', label: 'client days a year', note: 'A catered quarter-day of the grounds and clubhouse.' },
      { value: '2', label: 'meeting rooms', note: 'Full AV, bookable like a court.' },
    ],
    name: 'Corporate',
    tag: 'Teams',
    price: 1450,
    cadence: 'per month',
    note: 'Ten named seats · transferable',
    summary: 'Ten transferable seats for a team, with the clubhouse for client days.',
    img: local('aerial.jpg'),
    benefits: [
      'Ten named seats, transferable monthly',
      'Clubhouse meeting rooms included',
      'Quarterly private client day',
      'Team leagues and inter-company fixtures',
      'Invoiced annually or monthly',
    ],
    includes: [
      { icon: 'spark', title: 'Client days', desc: 'A quarter-day of the grounds and clubhouse, catered, four times a year.' },
      { icon: 'check', title: 'Transferable seats', desc: 'Reassign any seat at the start of a month as your team changes.' },
      { icon: 'clock', title: 'Meeting rooms', desc: 'Two bookable rooms with full AV in the clubhouse.' },
    ],
    specs: [
      { label: 'Booking window', value: '30 days ahead' },
      { label: 'Guests', value: '10 per month, pooled' },
      { label: 'Member card', value: 'Posted per seat' },
      { label: 'Minimum term', value: '12 months' },
    ],
  },
]

/** Lookup used by the /memberships/:slug route. */
export const tierBySlug = (slug) => TIERS.find((t) => t.slug === slug)

/** The tier the homepage pricing card promotes. */
export const MEMBERSHIP = TIERS.find((t) => t.featured)

/* Kept so the homepage field showcase keeps working off one list. */
/* The three photographs under the membership copy. Each one opens the
   facility it shows — they were decorative, which made the hover arrow on
   them a lie. `court` is a slug in ./courts. */
export const MEMBERSHIP_FIELDS = [
  { img: local('courts.jpg'), label: 'Hard courts', court: 'the-lawns' },
  { img: local('clay.jpg'), label: 'Clay courts', court: 'centre-court' },
  { img: local('golf.jpg'), label: 'Golf greens', court: 'golf-greens' },
]
