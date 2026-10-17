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

/* The carousel's cards now open real programme pages, so the list lives with
   the pages themselves in ./programmes and is re-exported here only so the
   old import path keeps working. */
export { PLANS } from './programmes'

export const ENDLESS_IMG = local('airborne.jpg')
