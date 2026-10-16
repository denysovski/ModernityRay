import { expect, test } from './fixtures'

/* The full buying journey in a real browser: pick a membership, add a court
   session, review the basket, fail validation, fix it, pay, and find the
   order in the account view after a reload.
 *
 * This is the test that proves the pieces fit together — routing, the context
 * store, localStorage persistence and the validation rules — in a way no unit
 * test can. */

const fill = async (page, label, value) => {
  await page.getByLabel(label, { exact: true }).fill(value)
}

test('a member can join, book a court and see the order afterwards', async ({ page }) => {
  // ── pick a membership ────────────────────────────────────────────────────
  await page.goto('/memberships')
  const resident = page.locator('.tier-card', { hasText: 'Resident' }).first()
  await resident.getByRole('button', { name: /add to basket/i }).click()

  // adding opens the drawer
  const drawer = page.getByRole('dialog', { name: 'Your cart' })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByText('Resident')).toBeVisible()
  await page.getByRole('button', { name: 'Close cart' }).click()

  // ── add a court session from another view ────────────────────────────────
  await page.goto('/courts/the-lawns')
  await page
    .locator('.court-session', { hasText: 'The Lawns · 60 min' })
    .getByRole('button', { name: 'Add' })
    .click()

  await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible()
  // the basket survived the route change: two different lines
  await expect(page.locator('.cart-item')).toHaveCount(2)

  // ── through to the checkout ──────────────────────────────────────────────
  await page.getByRole('button', { name: /^checkout/i }).click()
  await expect(page).toHaveURL(/\/checkout$/)

  // 190 + 38 = 228 subtotal, + 12 delivery, + 8.25% tax = 258.81
  const summary = page.getByRole('complementary')
  await expect(summary.getByText('$258.81')).toBeVisible()

  // ── step 1: the validator refuses an empty form ──────────────────────────
  await page.getByRole('button', { name: /continue/i }).click()
  await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(3)

  // and a weak password specifically
  await fill(page, 'Full name', 'Daniel Svoboda')
  await fill(page, 'Email', 'dan@example.com')
  await fill(page, 'Password', 'abcdefgh')
  await page.getByRole('button', { name: /continue/i }).click()
  await expect(page.getByRole('alert')).toContainText('letter and one number')

  await fill(page, 'Password', 'abcdefg1')
  await page.getByRole('button', { name: /continue/i }).click()

  // ── step 2: details ──────────────────────────────────────────────────────
  await expect(page.getByRole('heading', { name: /your details/i })).toBeVisible()
  await fill(page, 'Phone', '555')
  await page.getByRole('button', { name: /continue/i }).click()
  await expect(page.getByRole('alert')).toContainText('too short')

  await fill(page, 'Phone', '+1 555 0100')
  await page.getByRole('button', { name: /continue/i }).click()

  // ── step 3: delivery, with a country-aware postcode rule ─────────────────
  await expect(page.getByRole('heading', { name: /member card go/i })).toBeVisible()
  await fill(page, 'Street address', 'Lakeside Drive')
  await fill(page, 'City', 'Austin')
  await fill(page, 'Postal code', 'SW1A 1AA')
  await page.getByRole('button', { name: /continue/i }).click()

  const alerts = page.getByRole('alert')
  await expect(alerts).toHaveCount(2)
  await expect(alerts.first()).toContainText('house or building number')

  await fill(page, 'Street address', '24 Lakeside Drive')
  await fill(page, 'Postal code', '78701')
  await page.getByRole('button', { name: /continue/i }).click()

  // ── step 4: payment, Luhn-checked ────────────────────────────────────────
  await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible()
  const card = page.getByLabel(/card number/i)
  await card.fill('4242424242424241')
  await page.getByLabel('Expiry').fill('0429')
  await page.getByLabel('Security code').fill('123')
  await page.getByRole('button', { name: /^pay/i }).click()
  await expect(page.getByRole('alert')).toContainText('not valid')

  // the mask groups the digits and the brand is detected
  await card.fill('4242424242424242')
  await expect(card).toHaveValue('4242 4242 4242 4242')
  await expect(page.getByText('Card number · Visa')).toBeVisible()

  // an expired card is caught too
  await page.getByLabel('Expiry').fill('0120')
  await page.getByRole('button', { name: /^pay/i }).click()
  await expect(page.getByRole('alert')).toContainText('expired')

  await page.getByLabel('Expiry').fill('0429')
  await page.getByRole('button', { name: /^pay/i }).click()

  // ── confirmation ─────────────────────────────────────────────────────────
  await expect(page.getByRole('heading', { level: 1 })).toContainText('You’re in, Daniel')
  await expect(page.getByText(/^CS-/)).toBeVisible()
  await expect(page.getByText('····4242')).toBeVisible()

  // the cart badge is gone, because the basket emptied
  await expect(page.locator('.cart-badge')).toHaveCount(0)

  // ── the order is in the account, and survives a reload ───────────────────
  await page.getByRole('button', { name: /see your orders/i }).click()
  await expect(page).toHaveURL(/\/account$/)

  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Daniel Svoboda')

  await page.getByRole('tab', { name: /orders/i }).click()
  await expect(page.locator('.acc-order')).toHaveCount(1)
  await expect(page.locator('.acc-order')).toContainText('Resident')
  await expect(page.locator('.acc-order')).toContainText('The Lawns · 60 min')
  await expect(page.locator('.acc-order')).toContainText('$258.81')

  // the full card number was never written to storage
  const stored = await page.evaluate(() => window.localStorage.getItem('courtsy.orders'))
  expect(stored).toContain('4242')
  expect(stored).not.toContain('4242424242424242')
})

test('preferences change the app, not just the settings screen', async ({ page }) => {
  await page.goto('/checkout')

  // seed a profile the way the checkout would, so the account view is reachable
  await page.evaluate(() => {
    window.localStorage.setItem('courtsy.schema', '2')
    window.localStorage.setItem(
      'courtsy.user',
      JSON.stringify({ name: 'Daniel Svoboda', email: 'dan@example.com', since: '2026-10-16T00:00:00.000Z' }),
    )
  })

  await page.goto('/account')
  await page.getByRole('tab', { name: /settings/i }).click()

  await page.getByText('Show prices with tax').click()
  await page.goto('/memberships')

  await expect(page.getByText('Prices include tax')).toBeVisible()
  // 190 + 8.25% = 205.68
  await expect(page.locator('.tier-card', { hasText: 'Resident' }).getByText('$205.68')).toBeVisible()
})

test('the basket empties when the account is wiped', async ({ page }) => {
  await page.goto('/memberships')
  await page
    .locator('.tier-card', { hasText: 'Day Pass' })
    .getByRole('button', { name: /add to basket/i })
    .click()
  await page.getByRole('button', { name: 'Close cart' }).click()
  await expect(page.locator('.cart-badge')).toHaveText('1')

  await page.evaluate(() => {
    window.localStorage.setItem(
      'courtsy.user',
      JSON.stringify({ name: 'Daniel Svoboda', email: 'dan@example.com', since: null }),
    )
  })
  await page.goto('/account')
  await page.getByRole('tab', { name: /settings/i }).click()

  page.once('dialog', (d) => d.accept())
  await page.getByRole('button', { name: /clear all my data/i }).click()

  await expect(page.locator('.cart-badge')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('No profile on this browser yet')
})
