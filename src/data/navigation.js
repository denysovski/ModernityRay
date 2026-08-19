/* Header navigation and the mega-menu behind it. */
import { local } from './images'

export const NAV = [
  { label: 'Club', href: '#tailored' },
  { label: 'Courts', href: '#endless' },
  { label: 'Lifestyle', href: '#elevate' },
  { label: 'Join', href: '#join' },
]

// Mega-menu structure for the complex navbar
export const MENU = [
  { label: 'Club', href: '/pages/club.html' },
  {
    label: 'Courts',
    type: 'courts',
    items: [
      { name: 'Centre Court', desc: 'Championship clay, floodlit', img: local('clay.jpg'), href: '/pages/centre-court.html' },
      { name: 'The Lawns', desc: 'Six open-air hard courts', img: local('courts.jpg'), href: '/pages/the-lawns.html' },
      { name: 'Golf Greens', desc: '18-hole lakeside course', img: local('golf.jpg'), href: '/pages/golf-greens.html' },
    ],
  },
  {
    label: 'Lifestyle',
    type: 'feature',
    items: [
      { name: 'Merchandise', desc: 'Apparel & equipment', href: '/pages/merchandise.html' },
      { name: 'Memberships', desc: 'Tiers & residencies', href: '/pages/memberships.html' },
      { name: 'Wellness & Spa', desc: 'Recovery and reset', href: '/pages/wellness-spa.html' },
      { name: 'Events & Socials', desc: 'The members’ calendar', href: '/pages/events-socials.html' },
      { name: 'Dining', desc: 'Lakeside clubhouse', href: '/pages/dining.html' },
      { name: 'Gift cards', desc: 'Give the club', href: '/pages/gift-cards.html' },
    ],
    feature: {
      img: local('courtlife.jpg'),
      tag: 'Featured',
      title: 'The members’ lifestyle, beyond the baseline.',
      cta: { label: 'Explore lifestyle', href: '/pages/memberships.html' },
    },
  },
  {
    label: 'Join',
    type: 'join',
    cards: [
      // each card carries the same photograph its landing page opens on
      { name: 'Become a member', desc: 'Apply for a residency', img: local('stretch.jpg'), href: '/pages/become-a-member.html' },
      { name: 'Book a private tour', desc: 'See the club in person', img: local('woodcourt.jpg'), href: '/pages/book-a-private-tour.html' },
      { name: 'Gift a membership', desc: 'Give access to the club', img: local('airborne.jpg'), href: '/pages/gift-a-membership.html' },
    ],
    items: [
      { name: 'Pricing & tiers', desc: 'From day pass to signature', href: '/pages/pricing-tiers.html' },
      { name: 'Corporate membership', desc: 'Teams & partners', href: '/pages/corporate-membership.html' },
      { name: 'Junior & family', desc: 'All ages welcome', href: '/pages/junior-family.html' },
      { name: 'FAQ', desc: 'Everything you need', href: '/pages/faq.html' },
    ],
    cta: { label: 'Start your application', href: '/pages/become-a-member.html' },
  },
]
