/* Header navigation and the mega-menu behind it. */
import { local } from './images'

const page = (slug) => `${import.meta.env.BASE_URL}pages/${slug}.html`

export const NAV = [
  { label: 'Club', href: '#tailored' },
  { label: 'Courts', href: '#endless' },
  { label: 'Lifestyle', href: '#elevate' },
  { label: 'Join', href: '#join' },
]

// Mega-menu structure for the complex navbar
export const MENU = [
  { label: 'Club', href: page('club') },
  {
    label: 'Courts',
    type: 'courts',
    items: [
      { name: 'Centre Court', desc: 'Championship clay, floodlit', img: local('clay.jpg'), href: page('centre-court') },
      { name: 'The Lawns', desc: 'Six open-air hard courts', img: local('courts.jpg'), href: page('the-lawns') },
      { name: 'Golf Greens', desc: '18-hole lakeside course', img: local('golf.jpg'), href: page('golf-greens') },
    ],
  },
  {
    label: 'Lifestyle',
    type: 'feature',
    items: [
      { name: 'Merchandise', desc: 'Apparel & equipment', href: page('merchandise') },
      { name: 'Memberships', desc: 'Tiers & residencies', href: page('memberships') },
      { name: 'Wellness & Spa', desc: 'Recovery and reset', href: page('wellness-spa') },
      { name: 'Events & Socials', desc: 'The members’ calendar', href: page('events-socials') },
      { name: 'Dining', desc: 'Lakeside clubhouse', href: page('dining') },
      { name: 'Gift cards', desc: 'Give the club', href: page('gift-cards') },
    ],
    feature: {
      img: local('courtlife.jpg'),
      tag: 'Featured',
      title: 'The members’ lifestyle, beyond the baseline.',
      cta: { label: 'Explore lifestyle', href: page('memberships') },
    },
  },
  {
    label: 'Join',
    type: 'join',
    cards: [
      // each card carries the same photograph its landing page opens on
      { name: 'Become a member', desc: 'Apply for a residency', img: local('stretch.jpg'), href: page('become-a-member') },
      { name: 'Book a private tour', desc: 'See the club in person', img: local('woodcourt.jpg'), href: page('book-a-private-tour') },
      { name: 'Gift a membership', desc: 'Give access to the club', img: local('airborne.jpg'), href: page('gift-a-membership') },
    ],
    items: [
      { name: 'Pricing & tiers', desc: 'From day pass to signature', href: page('pricing-tiers') },
      { name: 'Corporate membership', desc: 'Teams & partners', href: page('corporate-membership') },
      { name: 'Junior & family', desc: 'All ages welcome', href: page('junior-family') },
      { name: 'FAQ', desc: 'Everything you need', href: page('faq') },
    ],
    cta: { label: 'Start your application', href: page('become-a-member') },
  },
]
