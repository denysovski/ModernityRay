/* The facilities, and the sessions you can put in a basket.
 *
 * Same shape as a membership tier: `slug` is the route segment, so
 * /courts/:slug resolves out of this file with no lookup table in between.
 */
import { local, remote } from './images'

/**
 * @typedef {Object} Session
 * @property {string} id      cart line id, must be globally unique
 * @property {string} name
 * @property {string} meta    the line's secondary text in the cart
 * @property {number} price   USD
 */

/**
 * @typedef {Object} Court
 * @property {string} slug
 * @property {string} name
 * @property {string} surface   short label, e.g. 'Championship clay'
 * @property {string} tagline
 * @property {string} desc
 * @property {string} img
 * @property {{img: string, title: string, fact: string, by: {name: string, role: string, img: string}}[]} gallery
 *   Each slide carries one fact about the place, shown over the photograph.
 * @property {{label: string, value: string}[]} specs
 * @property {Session[]} sessions  bookable slots, added to the cart directly
 */

/** @type {Court[]} */
export const COURTS = [
  {
    slug: 'centre-court',
    name: 'Centre Court',
    surface: 'Championship clay',
    tagline: 'Floodlit until midnight',
    desc:
      'The club’s show court, laid with imported red clay and resurfaced every spring. ' +
      'Seated for four hundred, floodlit to broadcast standard, and the venue for every ' +
      'club championship since the grounds opened.',
    img: local('clay.jpg'),
    gallery: [
      {
        img: local('clay.jpg'),
        title: 'The clay itself',
        by: { name: 'Tomás Ferrer', role: 'Head groundsman', img: remote('1507003211169-0a1dd7228f2d', 96) },
        fact:
          'Four hundred tonnes of crushed brick, watered twice a day and rolled before every session.',
      },
      {
        img: local('floodlights.jpg'),
        title: 'After dark',
        by: { name: 'Priya Raman', role: 'Facilities engineer', img: remote('1573496359142-b8d87734a5a2', 96) },
        fact:
          'Sixteen floodlights at 1,200 lux. Half the court bookings here are taken after eight in the evening.',
      },
      {
        img: local('baseline.jpg'),
        title: 'How it plays',
        by: { name: 'Davis Korsgaard', role: 'Head coach', img: remote('1472099645785-5658abf4ff4e', 96) },
        fact:
          'The slowest surface at the club. Rallies here run roughly twice as long as on the hard courts.',
      },
    ],
    specs: [
      { label: 'Surface', value: 'Imported red clay' },
      { label: 'Floodlights', value: 'Until 24:00' },
      { label: 'Seating', value: '400' },
      { label: 'Resurfaced', value: 'Every spring' },
    ],
    sessions: [
      { id: 'court-centre-60', name: 'Centre Court · 60 min', meta: 'Single court hire', price: 70 },
      { id: 'court-centre-coach', name: 'Centre Court · coached hour', meta: 'With a certified pro', price: 120 },
    ],
  },
  {
    slug: 'the-lawns',
    name: 'The Lawns',
    surface: 'Six open-air hard courts',
    tagline: 'Open 24 hours to residents',
    desc:
      'Six cushioned acrylic courts arranged in two banks of three, sheltered by the ' +
      'east treeline. The everyday courts of the club: never more than a short wait, ' +
      'and the only ones open around the clock.',
    img: local('courts.jpg'),
    gallery: [
      {
        img: local('courts.jpg'),
        title: 'Six courts, two banks',
        by: { name: 'Priya Raman', role: 'Facilities engineer', img: remote('1573496359142-b8d87734a5a2', 96) },
        fact:
          'Arranged in threes behind the east treeline, which takes the afternoon glare off the baseline.',
      },
      {
        img: local('aerial.jpg'),
        title: 'Never a wait',
        by: { name: 'Marta Lindqvist', role: 'Club manager', img: remote('1580489944761-15a19d654956', 96) },
        fact:
          'Busiest between six and eight in the morning. Even then the average wait for a court is under ten minutes.',
      },
      {
        img: local('woodcourt.jpg'),
        title: 'Resurfaced in cycles',
        by: { name: 'Tomás Ferrer', role: 'Head groundsman', img: remote('1507003211169-0a1dd7228f2d', 96) },
        fact:
          'Two courts are relaid each spring, so no surface is ever more than three years old.',
      },
    ],
    specs: [
      { label: 'Surface', value: 'Cushioned acrylic' },
      { label: 'Courts', value: '6' },
      { label: 'Access', value: '24 / 7 for residents' },
      { label: 'Ball machine', value: 'Courts 4–6' },
    ],
    sessions: [
      { id: 'court-lawns-60', name: 'The Lawns · 60 min', meta: 'Single court hire', price: 38 },
      { id: 'court-lawns-doubles', name: 'The Lawns · doubles block', meta: '2 hours, two courts', price: 120 },
    ],
  },
  {
    slug: 'golf-greens',
    name: 'Golf Greens',
    surface: '18-hole lakeside course',
    tagline: 'Par 71, 6,480 yards',
    desc:
      'Eighteen holes wrapped around the lake, with a short game area and a ' +
      'launch-monitor bay beside the pro shop. Walkable in three and a half hours, ' +
      'and quiet enough midweek to play a round alone.',
    img: local('golf.jpg'),
    gallery: [
      {
        img: local('golf.jpg'),
        title: 'Eighteen holes',
        by: { name: 'Alan Whitcombe', role: 'Golf professional', img: remote('1519085360753-af0119f7cbe7', 96) },
        fact:
          'Par 71 over 6,480 yards, wrapped around the lake. Walkable in three and a half hours.',
      },
      {
        img: local('palms.jpg'),
        title: 'The quiet round',
        by: { name: 'Marta Lindqvist', role: 'Club manager', img: remote('1580489944761-15a19d654956', 96) },
        fact:
          'Midweek mornings average eleven players on the course. You can play a full round alone.',
      },
      {
        img: local('aerial.jpg'),
        title: 'Greens kept to spec',
        by: { name: 'Tomás Ferrer', role: 'Head groundsman', img: remote('1507003211169-0a1dd7228f2d', 96) },
        fact:
          'Cut to 3.2 mm daily through the season and measured with a stimpmeter every Monday.',
      },
    ],
    specs: [
      { label: 'Holes', value: '18' },
      { label: 'Par', value: '71' },
      { label: 'Length', value: '6,480 yards' },
      { label: 'Practice', value: 'Range, short game, launch bay' },
    ],
    sessions: [
      { id: 'golf-round', name: 'Golf · 18-hole tee time', meta: 'Round of eighteen', price: 95 },
      { id: 'golf-lesson', name: 'Golf · launch-monitor lesson', meta: '45 min with the golf team', price: 85 },
    ],
  },
  {
    slug: 'the-pavilion',
    name: 'The Pavilion',
    surface: 'Strength & conditioning',
    tagline: 'Platforms, turf and a recovery suite',
    desc:
      'Eight lifting platforms, a sled track on turf, and a recovery suite with ' +
      'contrast baths, sauna and two treatment rooms. Coached conditioning runs ' +
      'here every morning and evening.',
    img: local('strength.jpg'),
    gallery: [
      {
        img: local('strength.jpg'),
        title: 'Eight platforms',
        by: { name: 'Jonah Reyes', role: 'Strength coach', img: remote('1504257432389-52343af06ae3', 96) },
        fact:
          'Calibrated bars and bumper plates, with a sled track on turf running the length of the room.',
      },
      {
        img: local('yoga.jpg'),
        title: 'Coached twice daily',
        by: { name: 'Jonah Reyes', role: 'Strength coach', img: remote('1504257432389-52343af06ae3', 96) },
        fact:
          'Conditioning at six in the morning and six in the evening, capped at twelve people a session.',
      },
      {
        img: local('stretch.jpg'),
        title: 'Recovery suite',
        by: { name: 'Dr. Hana Brezina', role: 'Physiotherapist', img: remote('1559839734-2b71ea197ec2', 96) },
        fact:
          'Contrast baths, sauna and two treatment rooms. Booked by about a third of members each week.',
      },
    ],
    specs: [
      { label: 'Platforms', value: '8' },
      { label: 'Recovery', value: 'Contrast baths, sauna' },
      { label: 'Treatment rooms', value: '2' },
      { label: 'Coached sessions', value: '06:00 & 18:00 daily' },
    ],
    sessions: [
      { id: 'pavilion-session', name: 'Pavilion · coached conditioning', meta: '50 min group session', price: 32 },
      { id: 'pavilion-recovery', name: 'Pavilion · recovery & massage', meta: '60 min treatment', price: 110 },
    ],
  },
  {
    slug: 'lakeside-pool',
    name: 'Lakeside Pool',
    surface: 'Eight 25-metre lanes',
    tagline: 'Heated year round',
    desc:
      'A twenty-five metre, eight-lane pool under a retractable roof, held at ' +
      '28°C through the winter. Lane discipline is posted hourly, and the squad ' +
      'swims technique sets three mornings a week.',
    img: local('lanes.jpg'),
    gallery: [
      {
        img: local('lanes.jpg'),
        title: 'Eight lanes, 25 metres',
        by: { name: 'Elena Vargas', role: 'Swim coach', img: remote('1534528741775-53994a69daeb', 96) },
        fact:
          'Lane discipline is posted hourly, so there is always a lane matched to your pace.',
      },
      {
        img: local('swim.jpg'),
        title: 'Squad mornings',
        by: { name: 'Elena Vargas', role: 'Swim coach', img: remote('1534528741775-53994a69daeb', 96) },
        fact:
          'Technique sets three mornings a week with the swim coach on deck.',
      },
      {
        img: local('palms.jpg'),
        title: 'Open all year',
        by: { name: 'Priya Raman', role: 'Facilities engineer', img: remote('1573496359142-b8d87734a5a2', 96) },
        fact:
          'Held at 28 °C under a retractable roof that comes off on any day above twenty degrees.',
      },
    ],
    specs: [
      { label: 'Length', value: '25 m' },
      { label: 'Lanes', value: '8' },
      { label: 'Temperature', value: '28 °C' },
      { label: 'Roof', value: 'Retractable' },
    ],
    sessions: [
      { id: 'pool-lane', name: 'Pool · lane hire', meta: '45 min, one lane', price: 24 },
      { id: 'pool-stroke', name: 'Pool · stroke clinic', meta: '60 min with the swim coach', price: 46 },
    ],
  },
]

/** Lookup used by the /courts/:slug route. */
export const courtBySlug = (slug) => COURTS.find((c) => c.slug === slug)
