/* What the club is and what it is built on. */
import { local } from './images'

export const ELEVATE = [
  {
    img: local('courts.jpg'),
    label: 'The courts',
    title: 'Train on championship surfaces',
    desc: 'Clay, grass and hard courts kept to tour standard, floodlit until late.',
    href: '#endless',
    menu: {
      heading: 'On the courts',
      links: [
        { label: 'Book a court', href: '#endless' },
        { label: 'Court availability', href: '#endless' },
        { label: 'Surface guide', href: '#tailored' },
        { label: 'Floodlit play', href: '#join' },
      ],
    },
  },
  {
    img: local('courtside.jpg'),
    label: 'The game',
    title: 'Coaching that meets your level',
    desc: 'Private sessions, clinics and match play with certified pros.',
    href: '#tailored',
    menu: {
      heading: 'Improve your game',
      links: [
        { label: 'Find a coach', href: '#tailored' },
        { label: 'Group clinics', href: '#endless' },
        { label: 'Match play', href: '#join' },
        { label: 'Junior academy', href: '#tailored' },
      ],
    },
  },
  {
    img: local('palms.jpg'),
    label: 'The lifestyle',
    title: 'Recover, dine and belong',
    desc: 'Spa, lakeside dining and a members’ calendar beyond the baseline.',
    href: '#join',
    menu: {
      heading: 'Off the court',
      links: [
        { label: 'Spa & recovery', href: '#elevate' },
        { label: 'Clubhouse dining', href: '#elevate' },
        { label: 'Members’ events', href: '#join' },
        { label: 'Merchandise', href: '#elevate' },
      ],
    },
  },
]

export const PRINCIPLES = [
  { n: '01', title: 'Professionality', desc: 'Tour-grade facilities and certified coaches, held to a standard you feel in every session.' },
  { n: '02', title: 'Clean aesthetic', desc: 'A calm, considered space — no clutter, no noise, just room to focus and move.' },
  { n: '03', title: 'Active support', desc: 'A team genuinely in your corner, from your very first tour to your hundredth match.' },
  { n: '04', title: 'Lasting progress', desc: 'Programs built around you, so every week you leave a little better than you came.' },
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
