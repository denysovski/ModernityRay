/* Pricing, benefits and what members say. */
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

export const MEMBERSHIP = {
  name: 'Resident',
  tag: 'Most popular',
  price: '$190',
  cadence: 'per month',
  note: 'No joining fee · cancel anytime',
  benefits: [
    '24/7 access to every court & green',
    'Priority booking up to 14 days ahead',
    'Two group clinics every week',
    'Recovery suite, sauna & spa access',
    'Bring up to 4 guests each month',
  ],
  advantages: [
    { icon: 'clock', title: 'Open 24 / 7', desc: 'Play whenever it suits you, every day of the year.' },
    { icon: 'dumbbell', title: 'Coaching included', desc: 'Weekly clinics with certified pros at no extra cost.' },
    { icon: 'spark', title: 'Members-only events', desc: 'Socials, leagues and retreats all season long.' },
    { icon: 'check', title: 'One simple price', desc: 'Everything in, no add-ons, no surprises.' },
  ],
  fields: [
    { img: local('courts.jpg'), label: 'Hard courts' },
    { img: local('clay.jpg'), label: 'Clay courts' },
    { img: local('golf.jpg'), label: 'Golf greens' },
  ],
}
