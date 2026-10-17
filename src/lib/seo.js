/* Per-page metadata, applied to the document head.
 *
 * A single-page app serves one index.html for every URL, so the title and
 * the description baked into it describe the homepage and nothing else.
 * Every view therefore sets its own, and this module is the only code that
 * writes to <head> — components call the useSeo hook in components/ui/Seo.
 *
 * Why no react-helmet: the app needs five tags per route, all of them
 * simple, and Helmet is a dependency plus a context provider plus a render
 * phase to manage something a dozen lines of DOM code does exactly as well.
 *
 * What crawlers get from this that they did not before:
 *   - a distinct, descriptive <title> and meta description per URL,
 *   - a canonical URL, so the Pages deployment does not look like duplicate
 *     content when reached with a query string or a trailing slash,
 *   - Open Graph and Twitter tags, so a shared link previews properly,
 *   - a per-page og:image, because the default was the same photograph for
 *     all twenty-one routes.
 */

/** The club's name, appended to every page title. */
export const SITE_NAME = 'CourtSy'

/** Where the app is actually published. Used for canonical and og:url. */
export const SITE_ORIGIN = 'https://denysovski.github.io'

/**
 * Builds a page title in the house format.
 * The homepage passes nothing and gets the brand plus its positioning,
 * because "CourtSy | CourtSy" helps nobody.
 * @param {string} [page]
 */
export const pageTitle = (page) =>
  page ? `${page} | ${SITE_NAME}` : `${SITE_NAME} | Private Members’ Sport Club`

/** Absolute URL for a path, which canonical and og:url both require. */
export const absoluteUrl = (pathname = '/') => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const clean = pathname === '/' ? '' : pathname
  return `${SITE_ORIGIN}${base}${clean}`
}

/* Longest description worth sending. Google renders about 155-160
   characters on desktop and cuts the rest, so anything past this is
   weight nobody reads. Detail pages compose their description out of
   content — an event's own sentence, a tier's summary — and those are
   written for the page, not for a search result, so the length has to be
   enforced here rather than counted by hand in twenty call sites. */
const DESCRIPTION_MAX = 180

/** Trims to the last whole word inside the limit, with an ellipsis. */
const clamp = (text) => {
  if (typeof text !== 'string' || text.length <= DESCRIPTION_MAX) return text
  const cut = text.slice(0, DESCRIPTION_MAX - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`
}

/** Finds or creates a <meta>, keyed by name or by property. */
const meta = (keyName, key) => {
  const selector = `meta[${keyName}="${key}"]`
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(keyName, key)
    document.head.appendChild(tag)
  }
  return tag
}

const setMeta = (keyName, key, content) => {
  if (!content) return
  meta(keyName, key).setAttribute('content', content)
}

/** Finds or creates <link rel="canonical">. */
const setCanonical = (href) => {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Writes one page's metadata into <head>.
 *
 * @param {object} seo
 * @param {string} [seo.title]        the page part, without the brand
 * @param {string} seo.description    140–160 characters reads best in results
 * @param {string} seo.pathname       the route, for canonical and og:url
 * @param {string} [seo.image]        absolute or app-relative image URL
 * @param {'website'|'article'} [seo.type]
 * @param {boolean} [seo.noindex]     for pages with nothing to rank
 */
export function applySeo({
  title,
  description: rawDescription,
  pathname = '/',
  image,
  type = 'website',
  noindex = false,
}) {
  const description = clamp(rawDescription)
  const fullTitle = pageTitle(title)
  const url = absoluteUrl(pathname)
  // og:image must be absolute; local() gives an app-relative path
  const imageUrl = image
    ? /^https?:\/\//.test(image)
      ? image
      : `${SITE_ORIGIN}${image}`
    : undefined

  document.title = fullTitle
  setMeta('name', 'description', description)
  setCanonical(url)

  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:type', type)
  setMeta('property', 'og:title', fullTitle)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', imageUrl)

  setMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary')
  setMeta('name', 'twitter:title', fullTitle)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', imageUrl)

  /* The checkout, the account and the 404 have nothing to offer a search
     result, and an indexed "Your basket is empty" is worse than no result
     at all. Removed rather than set to "index" so the tag only ever exists
     where it is meant to. */
  const robots = document.head.querySelector('meta[name="robots"]')
  if (noindex) setMeta('name', 'robots', 'noindex, follow')
  else if (robots) robots.remove()
}
