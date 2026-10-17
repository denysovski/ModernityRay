/* Header navigation and the mega-menu behind it.
 *
 * Built from the courts and tiers data rather than repeating their names, so
 * adding a tier or a facility puts it in the menu automatically. Every href is
 * an app-relative route from src/routes — the navbar renders internal hrefs as
 * router links and leaves anchors alone.
 */
import { local } from './images'
import { COURTS } from './courts'
import { TIERS } from './membership'
import { paths } from '../routes'
import { JOIN_FACES } from './join'

const MENU_COURTS = ['centre-court', 'the-lawns', 'golf-greens']

export const MENU = [
  {
    label: 'Courts',
    type: 'courts',
    // the label is a link in its own right; the panel still opens on hover
    href: paths.courts,
    items: COURTS.filter((c) => MENU_COURTS.includes(c.slug)).map((c) => ({
      name: c.name,
      desc: c.surface,
      img: c.img,
      href: paths.court(c.slug),
    })),
  },
  {
    label: 'Memberships',
    type: 'feature',
    href: paths.memberships,
    items: TIERS.map((t) => ({
      name: t.name,
      desc: `${t.cadence === 'per visit' ? 'Day rate' : 'Monthly'} · ${t.summary.split('—')[0].trim()}`,
      href: paths.membership(t.slug),
    })),
    feature: {
      img: local('courtlife.jpg'),
      tag: 'Featured',
      title: 'The members’ lifestyle, beyond the baseline.',
      cta: { label: 'Compare every tier', href: paths.memberships },
    },
  },
  {
    label: 'Club',
    type: 'feature',
    href: paths.programmes,
    items: [
      { name: 'Training programmes', desc: 'Nine coached blocks, five disciplines', href: paths.programmes },
      { name: 'Meet the coaches', desc: 'The eight people who write your plan', href: `${paths.programmes}#coaches` },
      { name: 'Clubhouse dining', desc: 'Three rooms, one kitchen', href: paths.dining },
      { name: 'The club shop', desc: 'Kit and gadgets, members take 15%', href: paths.shop },
      { name: "What's on", desc: 'The members’ calendar, by month', href: paths.events },
    ],
    feature: {
      img: local('strength.jpg'),
      tag: 'Programmes',
      title: 'Every block starts and ends with the same measurement.',
      cta: { label: 'See all nine programmes', href: paths.programmes },
    },
  },
  { label: 'Events', href: paths.events },
  {
    label: 'Join',
    type: 'join',
    href: paths.join,
    cards: [
      // each card carries the same photograph its landing page opens on
      { name: 'Become a member', desc: 'What it means, and how', img: local('stretch.jpg'), href: paths.join },
      { name: 'Book a private tour', desc: 'See the club in person', img: local('woodcourt.jpg'), href: paths.tour },
      { name: 'Gift a day pass', desc: 'Vouchers from $50', img: local('airborne.jpg'), href: paths.gift },
    ],
    items: [
      { name: 'Pricing & tiers', desc: 'From day pass to signature', href: paths.memberships },
      { name: 'Student membership', desc: 'A special rate, in person', href: paths.students },
      { name: 'Junior & family', desc: 'All ages welcome', href: paths.membership('junior-family') },
      { name: 'Your account', desc: 'Profile & order history', href: paths.account },
    ],
    // the panel closes with the members, not with another button
    proof: { count: '5,000+', text: 'people train here every week', faces: JOIN_FACES },
  },
]

/** Footer columns — same route constants, grouped for the sitemap. */
export const FOOTER = [
  {
    h: 'Courts',
    items: [
      ...COURTS.slice(0, 3).map((c) => ({ label: c.name, href: paths.court(c.slug) })),
      { label: 'All facilities', href: paths.courts },
    ],
  },
  {
    h: 'Membership',
    items: [
      { label: 'Compare tiers', href: paths.memberships },
      { label: 'Resident', href: paths.membership('resident') },
      { label: 'Junior & family', href: paths.membership('junior-family') },
      { label: 'Corporate', href: paths.membership('corporate') },
    ],
  },
  {
    h: 'Join',
    items: [
      { label: 'Become a member', href: paths.join },
      { label: 'Book a private tour', href: paths.tour },
      { label: 'Student membership', href: paths.students },
      { label: 'Gift a day pass', href: paths.gift },
    ],
  },
  {
    h: 'Training',
    items: [
      { label: 'All programmes', href: paths.programmes },
      { label: 'Meet the coaches', href: `${paths.programmes}#coaches` },
      { label: 'Tennis performance', href: paths.programme('tennis-performance') },
      { label: 'Junior academy', href: paths.programme('junior-academy') },
    ],
  },
  {
    h: 'Club',
    items: [
      { label: "What's on", href: paths.events },
      { label: 'Clubhouse dining', href: paths.dining },
      { label: 'The club shop', href: paths.shop },
      { label: 'Your account', href: paths.account },
    ],
  },
  {
    h: 'Social',
    items: [
      { label: 'Instagram', href: 'https://www.instagram.com/', external: true },
      { label: 'X', href: 'https://x.com/', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
      { label: 'YouTube', href: 'https://www.youtube.com/', external: true },
    ],
  },
]
