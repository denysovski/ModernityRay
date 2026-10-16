import { test as base, expect } from '@playwright/test'

/* Shared setup for the end-to-end suite.
 *
 * The homepage plays an arrival sequence on a visitor's first page view,
 * which locks scrolling for a few seconds. That is correct for a person and
 * wrong for a test: every spec would wait out the curtain before it could
 * touch anything.
 *
 * Marking the intro as already seen puts the tests in the position of a
 * visitor who has been here before, which is the state nearly every test is
 * actually about. The one spec that covers the intro clears the flag itself.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try {
        window.sessionStorage.setItem('courtsy.intro.seen', '1')
      } catch {
        /* storage blocked; the intro will play and the test will say so */
      }
    })
    await use(page)
  },
})

export { expect }
