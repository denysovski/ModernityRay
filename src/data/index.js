/* Barrel for all site content. Components import from '../../data', never
   from the individual modules, so content can be re-grouped freely.

   Add a new content area as its own file here, then re-export it below. */
export { local, remote } from './images'
export { MENU, FOOTER } from './navigation'
export { HERO_IMG, HERO_CARDS } from './hero'
export { TABS, PLAN_ITEMS, CATEGORIES, PLANS, ENDLESS_IMG } from './training'
export { ELEVATE, PRINCIPLES, STATS, CLUB_STATS } from './club'
export { TESTIMONIALS, MEMBERSHIP, MEMBERSHIP_FIELDS, TIERS, tierBySlug } from './membership'
export { COURTS, courtBySlug } from './courts'
export { EVENTS, CALENDAR, EVENT_CATEGORIES, eventBySlug } from './events'
export {
  VOUCHERS,
  GIFT_FACTS,
  TOURS,
  TOUR_STEPS,
  STUDENT,
  JOIN_STEPS,
  JOIN_ANSWERS,
  JOIN_FACES,
  JOIN_IMG,
  TOUR_IMG,
  STUDENT_IMG,
  GIFT_IMG,
} from './join'
