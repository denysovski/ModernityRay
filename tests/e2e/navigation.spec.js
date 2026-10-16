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
