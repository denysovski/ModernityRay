/* Every URL the app knows, in one place.
 *
 * Navigation data, the route table in App.jsx and the tests all build their
 * links from here, so a path is written once. Builders take a slug and return
 * the full path; constants are plain strings.
 *
 * Paths are app-relative. The /ModernityRay/ prefix GitHub Pages needs is
 * handled once by the router's basename in main.jsx — never add it here.
 */

export const paths = {
  home: '/',
  memberships: '/memberships',
  membership: (slug) => `/memberships/${slug}`,
  courts: '/courts',
  court: (slug) => `/courts/${slug}`,
  events: '/events',
  event: (slug) => `/events/${slug}`,
  checkout: '/checkout',
  account: '/account',

  // the three ways in
  join: '/join',
  tour: '/private-tour',
  students: '/students',
  gift: '/gift',
}

/** True for links this app routes itself, false for anchors and outside URLs. */
export const isInternal = (href) =>
  typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
