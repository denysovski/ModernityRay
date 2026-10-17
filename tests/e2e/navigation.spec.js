import { expect, test } from './fixtures'

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

  /* The one above proves a single hop stays client-side. This one walks the
     whole site, because "still an SPA" is the kind of property that decays
     one careless <a> at a time: an href the router does not own, or a link
     rendered as a plain anchor, and that route quietly starts reloading the
     document while everything still looks right. Counting document
     responses catches it; counting URLs would not. */
  test('every route is reached without fetching a second document', async ({ page }) => {
    let documents = 0
    page.on('response', (r) => {
      if (r.request().resourceType() === 'document') documents += 1
    })

    await page.goto('/')
    await page.evaluate(() => {
      window.__spaToken = 'alive'
    })
    const afterFirstLoad = documents

    /** Clicks the first anchor whose href is exactly this route. */
    const follow = async (route) =>
      page.evaluate((href) => {
        const a = [...document.querySelectorAll('a[href]')].find(
          (n) => n.getAttribute('href') === href,
        )
        if (!a) return false
        a.click()
        return true
      }, route)

    const routes = [
      '/courts', '/courts/centre-court', '/memberships', '/memberships/resident',
      '/events', '/programmes', '/programmes/tennis-performance', '/shop',
      '/dining', '/join', '/private-tour', '/students', '/gift', '/account',
      '/terms', '/privacy', '/cookies',
    ]

    for (const route of routes) {
      let clicked = await follow(route)
      if (!clicked) {
        // not linked from here — every route is in the footer sitemap
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        clicked = await follow(route)
      }
      expect(clicked, `no link to ${route} on ${page.url()}`).toBe(true)
      await expect(page).toHaveURL(new RegExp(`${route}$`))
    }

    // the document was never replaced, so the page's JS state is still there
    expect(documents - afterFirstLoad).toBe(0)
    expect(await page.evaluate(() => window.__spaToken)).toBe('alive')

    // and history is client-side too
    await page.goBack()
    await page.goForward()
    expect(await page.evaluate(() => window.__spaToken)).toBe('alive')
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

    /* The sort control is ours, not a native <select>: open it and pick an
       option the way someone with a mouse would. */
    await page.locator('.selectmenu-trigger').click()
    await expect(page.getByRole('listbox', { name: 'Sort' })).toBeVisible()
    await page.getByRole('option', { name: 'Price, high to low' }).click()

    // it closes on choosing, and the trigger reports the choice
    await expect(page.getByRole('listbox', { name: 'Sort' })).toHaveCount(0)
    await expect(page.locator('.selectmenu-trigger')).toHaveText(/Price, high to low/)

    const names = await page.locator('.tier-name').allTextContents()
    expect(names[0]).toBe('Corporate')
  })

  test('the sort menu closes on Escape without changing the sort', async ({ page }) => {
    await page.goto('/memberships')
    await page.locator('.selectmenu-trigger').click()
    await expect(page.getByRole('listbox', { name: 'Sort' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox', { name: 'Sort' })).toHaveCount(0)
    await expect(page.locator('.selectmenu-trigger')).toHaveText(/Price, low to high/)
  })
})

test.describe('in-page anchors', () => {
  /* Anchor scrolling was silently broken once: the hash went into the URL and
     the page stayed where it was, and when it did move the section landed
     flush under the fixed navbar. Only a cold load of /#section still
     exercises that path — the hero cards and the gallery tiles that used to
     are covered here too, for what they do now instead. */

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

  /* The four floating cards over the hero are labels, not navigation. They
     used to be anchors that jumped down the page, which read as a promise
     the card could not keep — there is no "Open 24/7" section to land on.
     They keep the pointer cursor and the hover lift, and go nowhere. */
  for (const card of ['.fc-coach', '.fc-members', '.fc-time', '.fc-focus']) {
    test(`the hero card ${card} is a label, not a link`, async ({ page }) => {
      await page.goto('/')
      const el = page.locator(card)

      await expect(el).toHaveCount(1)
      expect(await el.evaluate((n) => n.tagName)).toBe('DIV')
      expect(await el.evaluate((n) => getComputedStyle(n).cursor)).toBe('pointer')

      /* Nothing anywhere above it is an anchor either — wrapping the card
         rather than being the card would reintroduce exactly the behaviour
         this removes. */
      expect(await el.evaluate((n) => !!n.closest('a'))).toBe(false)

      /* The old cards put '#tailored' and friends in the address bar. An
         unchanged URL is the assertion that matters, and the only one that
         is stable: the cards ride the hero's parallax, so measuring scroll
         here measures Playwright's own scroll-into-view as much as the
         card's behaviour, and that was flaky on CI. */
      const before = page.url()
      await el.click()
      await page.waitForTimeout(600)
      expect(page.url()).toBe(before)
    })
  }

  /* The gallery tiles name real places, so each one opens that place rather
     than scrolling to a section that only mentions it. */
  test('a gallery tile opens the page it names', async ({ page }) => {
    await page.goto('/')
    await page.locator('.gshot').first().scrollIntoViewIfNeeded()
    await page.locator('.gshot').first().click()
    await expect(page).toHaveURL(/\/courts\/the-lawns$/)
  })

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

test.describe('page transitions', () => {
  /* The page transition once left the wrapper parked at its exit values, so
     every subpage rendered at opacity 0: present in the DOM, invisible on
     screen. Text assertions passed happily, and so does toBeVisible, which
     does not look at opacity. These check what the eye checks. */

  /** Opacity of the element the route is rendered into. */
  const viewOpacity = (page) =>
    page.evaluate(() => {
      const main = document.querySelector('main')
      if (!main) return null
      return Number(getComputedStyle(main.parentElement).opacity)
    })

  for (const [label, link, heading] of [
    ['Courts', 'Courts', 'Five places to play.'],
    ['Memberships', 'Memberships', 'Five ways to belong.'],
    ['Events', 'Events', 'The season, in order.'],
  ]) {
    test(`${label} is actually visible after navigating to it`, async ({ page }) => {
      await page.goto('/')
      await page.locator('.nav-links').getByRole('link', { name: link }).click()

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
      await expect.poll(() => viewOpacity(page), { timeout: 4000 }).toBe(1)
    })
  }

  test('survives a burst of navigation', async ({ page }) => {
    await page.goto('/')
    for (const name of ['Courts', 'Memberships', 'Events', 'Courts']) {
      await page.locator('.nav-links').getByRole('link', { name }).click()
      await page.waitForTimeout(90)
    }

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Five places to play.')
    await expect.poll(() => viewOpacity(page), { timeout: 4000 }).toBe(1)
  })

  test('a view loaded cold is visible too', async ({ page }) => {
    await page.goto('/courts/centre-court')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centre Court')
    await expect.poll(() => viewOpacity(page), { timeout: 4000 }).toBe(1)
  })
})
