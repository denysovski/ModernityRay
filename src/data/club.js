/* What the club is and what it is built on. */
import { local } from './images'
import { paths } from '../routes'

/* Every href here is a real route. These were same-page anchors while the
   site was one long page; now that the courts, the programmes, the shop and
   the kitchen each have their own view, a flyout link goes to the page it
   names rather than scrolling a few sections down. */
export const ELEVATE = [
  {
    img: local('courts.jpg'),
    label: 'The courts',
    title: 'Train on championship surfaces',
    desc: 'Clay, grass and hard courts kept to tour standard, floodlit until late.',
    href: paths.courts,
    menu: {
      heading: 'On the courts',
      links: [
        { label: 'All five facilities', href: paths.courts },
        { label: 'Centre Court', href: paths.court('centre-court') },
        { label: 'The Lawns', href: paths.court('the-lawns') },
        { label: 'Golf Greens', href: paths.court('golf-greens') },
      ],
    },
  },
  {
    img: local('courtside.jpg'),
    label: 'The game',
    title: 'Coaching that meets your level',
    desc: 'Private sessions, clinics and match play with certified pros.',
    href: paths.programmes,
    menu: {
      heading: 'Improve your game',
      links: [
        { label: 'All nine programmes', href: paths.programmes },
        { label: 'Meet the coaches', href: `${paths.programmes}#coaches` },
        { label: 'Junior academy', href: paths.programme('junior-academy') },
        { label: 'Match play league', href: paths.programme('match-play-league') },
      ],
    },
  },
  {
    img: local('palms.jpg'),
    label: 'The lifestyle',
    title: 'Recover, dine and belong',
    desc: 'Spa, lakeside dining and a members’ calendar beyond the baseline.',
    href: paths.dining,
    menu: {
      heading: 'Off the court',
      links: [
        { label: 'Clubhouse dining', href: paths.dining },
        { label: 'The club shop', href: paths.shop },
        { label: 'Spa & recovery', href: paths.programme('recovery-mobility') },
        { label: 'Members’ events', href: paths.events },
      ],
    },
  },
]

export const PRINCIPLES = [
  { n: '1', title: 'Professionality', desc: 'Tour-grade facilities and certified coaches, held to a standard you feel in every session.' },
  { n: '2', title: 'Clean aesthetic', desc: 'A calm, considered space — no clutter, no noise, just room to focus and move.' },
  { n: '3', title: 'Active support', desc: 'A team genuinely in your corner, from your very first tour to your hundredth match.' },
  { n: '4', title: 'Lasting progress', desc: 'Programs built around you, so every week you leave a little better than you came.' },
]

export const STATS = [
  { value: 85, suffix: '+', decimals: 0, l: 'Certified coaches' },
  { value: 0, static: '24/7', l: 'Resident access' },
  { value: 14, suffix: '', decimals: 0, l: 'Disciplines' },
  { value: 120, suffix: '+', decimals: 0, l: 'Courts & greens' },
]

// stat line shown above the Tailored section (replaces the old tabs)
export const CLUB_STATS = [
  { value: 14.7, suffix: 'K+', decimals: 1, l: 'Memberships' },
  { value: 120, suffix: '+', decimals: 0, l: 'Courts & greens' },
  { value: 85, suffix: '', decimals: 0, l: 'Certified coaches' },
  { static: '24/7', l: 'Open access' },
]
