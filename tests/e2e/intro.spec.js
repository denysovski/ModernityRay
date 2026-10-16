import { expect, test } from '@playwright/test'

/* The arrival sequence. Uses the plain Playwright fixture rather than the
   shared one, because the shared one exists precisely to switch this off. */

test.describe('arrival sequence', () => {
  test('plays once, locks scrolling, then hands over the page', async ({ page }) => {
    await page.goto('/')

    const intro = page.locator('.intro')
    await expect(intro).toBeVisible()
    await expect(page.locator('.intro-spinner')).toBeVisible()

    // the page must not move while the curtain is up
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      'hidden',
    )
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(250)
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(0)

    await expect(page.getByText('Welcome to the luxury')).toBeVisible({ timeout: 4000 })

    // and then it leaves entirely
    await expect(intro).toHaveCount(0, { timeout: 6000 })
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe(
      'hidden',
    )

    // the site was behind it the whole time
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Where players belong.')
  })

  test('does not play again in the same session', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.intro')).toHaveCount(0, { timeout: 8000 })

    await page.getByRole('link', { name: 'Events', exact: true }).first().click()
    await page.goto('/')
    await expect(page.locator('.intro')).toHaveCount(0)
  })

  test('is skipped entirely for reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('.intro')).toHaveCount(0)
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(0)
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(250)
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBeGreaterThan(0)
    await context.close()
  })

  test('a deep link skips it: that visitor came for the page', async ({ page }) => {
    await page.goto('/memberships')
    await expect(page.locator('.intro')).toHaveCount(0)
  })
})
