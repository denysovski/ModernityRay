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

const MENU_COURTS = ['centre-court', 'the-lawns', 'golf-greens']

export const MENU = [
  {
    label: 'Courts',
    type: 'courts',
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
  { label: 'Events', href: paths.events },
  {
    label: 'Join',
    type: 'join',
    cards: [
      // each card carries the same photograph its landing page opens on
      { name: 'Become a member', desc: 'Apply for a residency', img: local('stretch.jpg'), href: paths.membership('resident') },
      { name: 'Book a private tour', desc: 'See the club in person', img: local('woodcourt.jpg'), href: paths.courts },
      { name: 'Gift a day pass', desc: 'Give access to the club', img: local('airborne.jpg'), href: paths.membership('day-pass') },
    ],
    items: [
      { name: 'Pricing & tiers', desc: 'From day pass to signature', href: paths.memberships },
      { name: 'Corporate membership', desc: 'Teams & partners', href: paths.membership('corporate') },
      { name: 'Junior & family', desc: 'All ages welcome', href: paths.membership('junior-family') },
      { name: 'Your account', desc: 'Profile & order history', href: paths.account },
    ],
    cta: { label: 'Start your application', href: paths.membership('resident') },
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
    h: 'Club',
    items: [
      { label: "What's on", href: paths.events },
      { label: 'Your account', href: paths.account },
      { label: 'Checkout', href: paths.checkout },
      { label: 'Home', href: paths.home },
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
