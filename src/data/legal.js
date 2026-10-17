/* The three small-print pages.
 *
 * Plain content, deliberately short. This is a coursework build with no
 * company behind it and no data leaving the browser, so the honest version
 * of each page is mostly "there is less here than you expect" — which is
 * also the only version that is true of this app. Anything longer would be
 * boilerplate copied from a real company's lawyers.
 *
 * All three share one view (views/Legal) and are keyed by route.
 */
import { paths } from '../routes'

/**
 * @typedef {Object} LegalPage
 * @property {string} path     the route this page answers
 * @property {string} label    the micro-label above the title
 * @property {string} title
 * @property {string} lede
 * @property {string} updated
 * @property {{heading: string, body: string[]}[]} sections
 */

/** @type {Record<string, LegalPage>} */
export const LEGAL = {
  [paths.terms]: {
    path: paths.terms,
    label: 'Terms',
    title: 'Terms of use.',
    updated: 'October 2026',
    lede:
      'The rules for using this site. Short, because the site does very little on your behalf.',
    sections: [
      {
        heading: 'What this site is',
        body: [
          'CourtSy is a demonstration of a private members’ sport club, built as university coursework. The club, its coaches, its facilities and its events are invented. Nothing shown here can actually be booked, bought or attended.',
          'Prices, availability and member numbers are illustrative. No contract is formed by anything you do on this site.',
        ],
      },
      {
        heading: 'Your basket and your order',
        body: [
          'The basket, the checkout and the order history are simulations. No payment is taken, no card details are transmitted anywhere, and no order is ever fulfilled. A completed checkout writes a record to your own browser and nothing else.',
          'You may clear that record at any time from your account page, or by clearing this site’s data in your browser.',
        ],
      },
      {
        heading: 'Acceptable use',
        body: [
          'Use the site as you would any other: do not attempt to disrupt it, and do not present it to anyone as a real business. The photography is licensed from Unsplash for this project and is not ours to sublicense.',
        ],
      },
      {
        heading: 'No warranty',
        body: [
          'The site is provided as it is, with no guarantee that it is available, accurate or free of defects. It is a student project, and it is allowed to be wrong.',
        ],
      },
    ],
  },

  [paths.privacy]: {
    path: paths.privacy,
    label: 'Privacy',
    title: 'Your privacy.',
    updated: 'October 2026',
    lede:
      'The short version: nothing you type here is sent anywhere. There is no server to send it to.',
    sections: [
      {
        heading: 'What is collected',
        body: [
          'Nothing is collected by us. This site has no backend, no analytics, no tracking pixels and no third-party scripts beyond the fonts and photographs it loads to render the page.',
          'There is no account on a server anywhere. The “sign in” on this site creates a profile in your own browser.',
        ],
      },
      {
        heading: 'What is stored on your device',
        body: [
          'Your basket, your profile, your past simulated orders and your display preferences are written to this browser’s local storage, under keys beginning courtsy.. They stay on this device, they are readable only by this site, and they are never transmitted.',
          'Clearing them is immediate and complete: use “Forget me” on the account page, or clear this site’s data in your browser settings.',
        ],
      },
      {
        heading: 'What is deliberately not stored',
        body: [
          'Passwords are never written to storage and are discarded the moment the form unmounts. Card numbers are validated in the browser and then thrown away — only the last four digits are kept on the simulated order, so a receipt looks right.',
        ],
      },
      {
        heading: 'Other people’s servers',
        body: [
          'Member photographs are loaded from Unsplash and the typeface is served from this site itself. Requesting an image tells Unsplash your IP address, as any image request would; their privacy policy governs that, not ours.',
        ],
      },
    ],
  },

  [paths.cookies]: {
    path: paths.cookies,
    label: 'Cookies',
    title: 'Cookies.',
    updated: 'October 2026',
    lede: 'This site sets no cookies at all, which is why it never asks you about them.',
    sections: [
      {
        heading: 'No cookies',
        body: [
          'There are no cookies on this site: no essential ones, no analytics, no advertising, and no third-party cookies. That is why you have not seen a consent banner — there is nothing to consent to.',
        ],
      },
      {
        heading: 'Local storage is not a cookie',
        body: [
          'The site does use your browser’s local storage to remember your basket and your preferences between visits. It is not a cookie: it is never attached to a network request, so it cannot be read by this site’s host or by anyone else.',
          'It is listed in full on the privacy page, and you can clear it whenever you like.',
        ],
      },
      {
        heading: 'If that changes',
        body: [
          'It will not, for this project. A real club would need at least a session cookie to keep you signed in, and that would need saying here properly.',
        ],
      },
    ],
  },
}

/** Resolves a pathname to its page, or undefined. */
export const legalByPath = (pathname) => LEGAL[pathname]

/** The three links, for the footer and for cross-linking between them. */
export const LEGAL_LINKS = Object.values(LEGAL).map((p) => ({
  label: p.label,
  href: p.path,
}))
