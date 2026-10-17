import { expect, test } from './fixtures'

/* The metadata a crawler reads.
 *
 * None of this is visible in the app, which is exactly why it needs a test:
 * a route added without useSeo inherits whatever the previous page set, and
 * nothing on screen looks wrong. Twenty-one routes sharing one title is the
 * single most damaging thing an SPA can do to its own search results, and
 * it happens silently.
 */

/** Every indexable route, and the title it should carry. */
const INDEXABLE = [
  ['/', 'CourtSy | Private Members’ Sport Club'],
  ['/memberships', 'Memberships | CourtSy'],
  ['/memberships/resident', 'Resident Membership | CourtSy'],
  ['/courts', 'Courts & Facilities | CourtSy'],
  ['/courts/centre-court', 'Centre Court · Championship clay | CourtSy'],
  ['/programmes', 'Training Programmes | CourtSy'],
  ['/programmes/tennis-performance', 'Tennis Performance · 8-week program | CourtSy'],
  ['/events', 'What’s On | CourtSy'],
  ['/shop', 'The Club Shop | CourtSy'],
  ['/dining', 'Clubhouse Dining | CourtSy'],
  ['/join', 'Become a Member | CourtSy'],
  ['/private-tour', 'Book a Private Tour | CourtSy'],
  ['/students', 'Student Membership | CourtSy'],
  ['/gift', 'Gift a Day Pass | CourtSy'],
  ['/terms', 'Terms of use | CourtSy'],
  ['/privacy', 'Your privacy | CourtSy'],
  ['/cookies', 'Cookies | CourtSy'],
]

/** Personal, transactional or error — useful to a visitor, not to a result. */
const NOINDEX = ['/checkout', '/account', '/nonsense']

const head = (page) =>
  page.evaluate(() => {
    const content = (sel) => document.head.querySelector(sel)?.getAttribute('content') ?? null
    return {
      title: document.title,
      description: content('meta[name="description"]'),
      canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      ogTitle: content('meta[property="og:title"]'),
      ogUrl: content('meta[property="og:url"]'),
      ogImage: content('meta[property="og:image"]'),
      robots: content('meta[name="robots"]'),
      h1Count: document.querySelectorAll('h1').length,
    }
  })

test('every indexable route has its own title, description and canonical', async ({ page }) => {
  const seenTitles = new Map()
  const seenDescriptions = new Map()

  for (const [route, expected] of INDEXABLE) {
    await page.goto(route)
    /* The head is written by an effect after mount, so this has to be the
       auto-retrying assertion — reading document.title straight after
       goto() catches whatever index.html shipped with. */
    await expect(page, `title for ${route}`).toHaveTitle(expected)
    const meta = await head(page)

    /* Length is the difference between a description Google shows and one
       it rewrites: too long is truncated mid-sentence, too short is
       usually discarded in favour of scraped page text. */
    expect(meta.description, `description for ${route}`).toBeTruthy()
    expect(meta.description.length, `description length for ${route}`).toBeGreaterThan(69)
    expect(meta.description.length, `description length for ${route}`).toBeLessThan(183)

    expect(meta.canonical, `canonical for ${route}`).toContain(route === '/' ? '/' : route)
    expect(meta.ogTitle, `og:title for ${route}`).toBe(expected)
    expect(meta.ogUrl, `og:url for ${route}`).toBe(meta.canonical)
    expect(meta.ogImage, `og:image for ${route}`).toMatch(/^https?:\/\//)

    // indexable means no robots tag at all, not robots="index"
    expect(meta.robots, `robots for ${route}`).toBeNull()

    // one h1 per document: zero leaves the page unlabelled, two compete
    expect(meta.h1Count, `h1 count for ${route}`).toBe(1)

    expect(seenTitles.has(meta.title), `${route} duplicates the title of ${seenTitles.get(meta.title)}`).toBe(false)
    expect(
      seenDescriptions.has(meta.description),
      `${route} duplicates the description of ${seenDescriptions.get(meta.description)}`,
    ).toBe(false)
    seenTitles.set(meta.title, route)
    seenDescriptions.set(meta.description, route)
  }
})

test('transactional and error routes ask not to be indexed', async ({ page }) => {
  for (const route of NOINDEX) {
    await page.goto(route)
    // again, written by an effect: poll rather than read once
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
          ),
        { message: `robots for ${route}` },
      )
      .toBe('noindex, follow')
    const meta = await head(page)
    // still titled and canonical: a crawler that ignores the hint should
    // at least see a page that describes itself honestly
    expect(meta.title, `title for ${route}`).toContain('CourtSy')
    expect(meta.canonical, `canonical for ${route}`).toBeTruthy()
  }
})

test('the metadata follows a client-side navigation, not just a cold load', async ({ page }) => {
  /* The real risk in an SPA: the head is correct on a hard load and stale
     after a click, because nothing told it to change. */
  await page.goto('/')
  await expect(page).toHaveTitle('CourtSy | Private Members’ Sport Club')

  await page.locator('.nav-links').getByRole('link', { name: 'Events' }).click()
  await expect(page).toHaveTitle('What’s On | CourtSy')

  const after = await head(page)
  expect(after.canonical).toContain('/events')
  expect(after.ogUrl).toContain('/events')
})

test('every image carries an alt attribute', async ({ page }) => {
  for (const [route] of INDEXABLE) {
    await page.goto(route)
    // scroll the page so lazily mounted images are in the DOM
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 30))
      }
    })
    const missing = await page.$$eval('img', (els) =>
      els.filter((e) => !e.hasAttribute('alt')).map((e) => e.getAttribute('src')),
    )
    expect(missing, `images without alt on ${route}`).toEqual([])
  }
})
