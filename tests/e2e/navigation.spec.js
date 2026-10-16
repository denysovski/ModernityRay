import { expect, test } from '@playwright/test'

/* Routing, end to end in a real browser: client-side navigation, deep links,
   history, and the state that has to survive all of it. */

test.describe('navigation', () => {
  test('moves between views without reloading the document', async ({ page }) => {
    await page.goto('/')

    // mark the live document; a full reload would wipe this
    await page.evaluate(() => {
      window.__noReload = true
    })

    await page.locator('.nav-links').getByRole('link', { name: 'Events' }).click()
    await expect(page).toHaveURL(/\/events$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('The season, in order.')

    expect(await page.evaluate(() => window.__noReload)).toBe(true)
  })

  test('deep links work on a cold load, which is what the 404 fallback is for', async ({ page }) => {
    await page.goto('/memberships/signature')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Signature')
    await expect(page.getByText('$420.00')).toBeVisible()
  })

  test('walks a list through to a detail view and back', async ({ page }) => {
    await page.goto('/courts')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Five places to play.')

    await page.locator('.court-grid').getByRole('link', { name: /Centre Court/ }).first().click()
    await expect(page).toHaveURL(/\/courts\/centre-court$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centre Court')

    await page.goBack()
    await expect(page).toHaveURL(/\/courts$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Five places to play.')
  })

  test('an unknown URL renders the 404 view, not a blank page', async ({ page }) => {
    await page.goto('/this-does-not-exist')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('isn’t here')
    await expect(page.getByRole('link', { name: /back to the homepage/i })).toBeVisible()
  })

  test('an unknown slug on a real route 404s rather than throwing', async ({ page }) => {
    await page.goto('/memberships/platinum-elite')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('membership tier')
  })

  test('sets a distinct document title per view', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/private members/i)

    await page.goto('/events')
    await expect(page).toHaveTitle(/What’s on/i)

    await page.goto('/account')
    await expect(page).toHaveTitle(/Your account/i)
  })
})

test.describe('calendar filtering', () => {
  test('filters by category and recovers from an empty result', async ({ page }) => {
    await page.goto('/events')
    await expect(page.getByText('9 dates')).toBeVisible()

    await page.getByRole('button', { name: 'Retreat', exact: true }).click()
    await expect(page.getByText('1 date in Retreat')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Recovery & mobility retreat/ })).toBeVisible()

    await page.getByRole('button', { name: 'All', exact: true }).click()
    await expect(page.getByText('9 dates')).toBeVisible()
  })

  test('searches across titles and venues', async ({ page }) => {
    await page.goto('/events')
    await page.getByLabel('Search events').fill('golf')
    await expect(page.getByText('2 dates')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Club Championship/ })).toBeVisible()
  })
})

test.describe('membership filtering', () => {
  test('filters and sorts the tier grid', async ({ page }) => {
    await page.goto('/memberships')
    await expect(page.getByText('Showing 5 of 5 tiers')).toBeVisible()

    await page.getByRole('button', { name: 'No minimum term' }).click()
    await expect(page.getByText('Showing 2 of 5 tiers')).toBeVisible()

    await page.getByRole('button', { name: 'All tiers' }).click()
    await page.getByLabel('Sort').selectOption('price-desc')

    const names = await page.locator('.tier-name').allTextContents()
    expect(names[0]).toBe('Corporate')
  })
})

test.describe('in-page anchors', () => {
  /* These were silently broken: clicking a hero card put the hash in the URL
     and left the page where it was. When they did move, the section landed
     flush with the top of the viewport, hidden behind the fixed navbar. */

  /** Waits for smooth scrolling to finish before measuring. */
  const settle = async (page) => {
    await page.waitForFunction(
      () =>
        new Promise((resolve) => {
          let last = window.scrollY
          let still = 0
          const tick = () => {
            if (window.scrollY === last) {
              still += 1
              if (still > 5) return resolve(true)
            } else {
              still = 0
              last = window.scrollY
            }
            requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }),
      null,
      { timeout: 10_000 },
    )
  }

  for (const [card, target, label] of [
    ['.fc-coach', '#tailored', 'the coach card'],
    ['.fc-members', '#elevate', 'the members card'],
    ['.fc-focus', '#endless', 'the focus card'],
  ]) {
    test(`${label} scrolls its section clear of the navbar`, async ({ page }) => {
      await page.goto('/')
      await page.locator(card).click()
      await settle(page)

      const { sectionTop, navBottom } = await page.evaluate((sel) => ({
        sectionTop: Math.round(document.querySelector(sel).getBoundingClientRect().top),
        navBottom: Math.round(document.querySelector('.nav').getBoundingClientRect().bottom),
      }), target)

      // below the navbar, and not so far down that the section is off screen
      expect(sectionTop).toBeGreaterThan(navBottom)
      expect(sectionTop).toBeLessThan(220)
    })
  }

  test('a cold load of /#principles lands on the section', async ({ page }) => {
    await page.goto('/#principles')
    await settle(page)

    const top = await page.evaluate(() =>
      Math.round(document.querySelector('#principles').getBoundingClientRect().top),
    )
    expect(top).toBeGreaterThan(90)
    expect(top).toBeLessThan(220)
  })
})

test.describe('plan carousel', () => {
  test('cards slide between positions instead of jumping', async ({ page }) => {
    await page.goto('/')
    await page.locator('#endless').scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)

    /* Every card has to stay the same element. Rendering the centre one as a
       link and the rest as buttons made React rebuild the node on each step,
       which killed the CSS transition. */
    const tags = await page.locator('.pcard').evaluateAll((els) => els.map((e) => e.tagName))
    expect(new Set(tags).size).toBe(1)

    await page.evaluate(() => {
      window.__positions = []
      const grab = () => {
        const el = document.querySelector('.pcard.is-active')
        if (el) window.__positions.push(Math.round(el.getBoundingClientRect().left))
        if (window.__positions.length < 40) requestAnimationFrame(grab)
      }
      requestAnimationFrame(grab)
    })

    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForTimeout(1000)

    const frames = await page.evaluate(() => window.__positions)
    const movements = frames.filter((v, i) => i > 0 && v !== frames[i - 1]).length
    // a hard jump produces one change; an animation produces many
    expect(movements).toBeGreaterThan(4)
  })
})
