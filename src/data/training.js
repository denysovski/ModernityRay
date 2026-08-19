/* Programs, plans and the training carousel. */
import { local } from './images'

export const TABS = ['Membership', 'Coaching', 'Courts', 'Lifestyle']

export const PLAN_ITEMS = [
  { icon: 'body', title: '5’11, 140 lbs', sub: 'Body assessment', done: true },
  { icon: 'flame', title: '2,658 kcal', sub: 'Daily target', done: false },
  { icon: 'dumbbell', title: 'Full body', sub: 'Training focus', done: false },
  { icon: 'spark', title: 'Resident', sub: 'Membership tier', done: false },
]

export const CATEGORIES = [
  { title: 'Tennis Courts', meta: '18 open sessions', img: local('courts.jpg'), href: '#elevate' },
  { title: 'Private Coaching', meta: '24 classes weekly', img: local('courtlife.jpg'), href: '#tailored' },
  { title: 'Golf & Leisure', meta: '12 tee times daily', img: local('golf.jpg'), href: '#elevate' },
]

// All custom plans — the moving carousel
export const PLANS = [
  {
    title: 'Tennis Performance',
    meta: '8-week program',
    tag: 'Most popular',
    desc: 'Footwork, serve mechanics and match tactics with a dedicated pro.',
    img: local('baseline.jpg'),
    href: '#tailored',
  },
  {
    title: 'Strength & Conditioning',
    meta: '12 sessions / month',
    tag: 'Build power',
    desc: 'Progressive lifting and mobility built around your sport.',
    img: local('strength.jpg'),
    href: '#tailored',
  },
  {
    title: 'Junior Academy',
    meta: 'Ages 6–16',
    tag: 'Coached',
    desc: 'Group coaching that grows technique, confidence and fitness.',
    img: local('bluesky.jpg'),
    href: '#tailored',
  },
  {
    title: 'Golf Improvement',
    meta: 'Swing & short game',
    tag: 'On the greens',
    desc: 'Launch-monitor lessons and on-course play with our golf team.',
    img: local('golf.jpg'),
    href: '#tailored',
  },
  {
    title: 'Recovery & Mobility',
    meta: 'Spa & physio',
    tag: 'Reset',
    desc: 'Contrast therapy, soft-tissue work and guided mobility flows.',
    img: local('yoga.jpg'),
    href: '#elevate',
  },
  {
    title: 'Cardio & HIIT',
    meta: '30-min express',
    tag: 'High energy',
    desc: 'Short, sharp interval sessions to lift your engine fast.',
    img: local('runners.jpg'),
    href: '#tailored',
  },
  {
    title: 'Match Play League',
    meta: 'Seasonal ladder',
    tag: 'Compete',
    desc: 'Ranked singles and doubles with weekly fixtures and finals.',
    img: local('fixture.jpg'),
    href: '#join',
  },
  {
    title: 'Endurance & Road',
    meta: 'Weekend rides',
    tag: 'Go long',
    desc: 'Club rides and indoor threshold work to build a bigger engine.',
    img: local('cycling.jpg'),
    href: '#tailored',
  },
  {
    title: 'Swim & Aqua',
    meta: 'Lanes & open water',
    tag: 'Low impact',
    desc: 'Stroke technique, threshold sets and easy recovery lengths.',
    img: local('lanes.jpg'),
    href: '#elevate',
  },
]

export const ENDLESS_IMG = local('airborne.jpg')
