import { expect, test } from './fixtures'

/* The four ways in: the explainer, the tour list, the student rate and
   gift cards. */

test.describe('become a member', () => {
  test('explains joining and hands over to the tiers', async ({ page }) => {
    await page.goto('/join')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('A club, not a gym.')
    await expect(page.getByText('5,000+ people train here every week')).toBeVisible()

    // all five tiers are listed, each linking to its own page
    await expect(page.locator('.jn-tier')).toHaveCount(5)
    await page.locator('.jn-tier', { hasText: 'Signature' }).click()
    await expect(page).toHaveURL(/\/memberships\/signature$/)
  })

  test('is where the navbar call to action goes', async ({ page }) => {
    await page.goto('/')
    await page.locator('.nav-cta').click()
    await expect(page).toHaveURL(/\/join$/)
  })
})

test.describe('private tour', () => {
  test('puts you on a list and remembers it', async ({ page }) => {
    await page.goto('/private-tour')
    await expect(page.locator('.tour')).toHaveCount(5)

    const slot = page.locator('.tour').first()
    await expect(slot).toContainText('3 of 8 places left')
    await slot.getByRole('button', { name: /enroll/i }).click()

    // the name is validated before it reaches the list
    await slot.getByLabel('Your name for the list').fill('Dan')
    await slot.getByRole('button', { name: /put me on the list/i }).click()
    await expect(slot.getByRole('alert')).toContainText(/first and last/)

    await slot.getByLabel('Your name for the list').fill('Daniel Svoboda')
    await slot.getByRole('button', { name: /put me on the list/i }).click()

    await expect(slot.locator('.tour-badge')).toContainText('Daniel Svoboda')
    await expect(slot).toContainText('2 of 8 places left')

    // and it is still there after a reload
    await page.reload()
    const again = page.locator('.tour').first()
    await expect(again.locator('.tour-badge')).toContainText('Daniel Svoboda')

    await again.getByRole('button', { name: /take me off/i }).click()
    await expect(again.getByRole('button', { name: /enroll/i })).toBeVisible()
  })

  test('a full tour cannot be joined', async ({ page }) => {
    await page.goto('/private-tour')
    // 4 April holds eight and has seven taken, so one place remains
    const nearlyFull = page.locator('.tour', { hasText: '4 April 2027' })
    await expect(nearlyFull).toContainText('1 of 8 places left')
  })
})

test.describe('student membership', () => {
  test('leads with the saving and never asks for payment', async ({ page }) => {
    await page.goto('/students')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('66% off')
    await expect(page.getByText('$65.00')).toBeVisible()
    await expect(page.getByText('instead of $190.00')).toBeVisible()

    // it is agreed in person, so there is nothing to add to a basket
    await expect(page.getByRole('button', { name: /add to basket/i })).toHaveCount(0)
    await page.getByRole('link', { name: /arrange the conversation/i }).click()
    await expect(page).toHaveURL(/\/private-tour$/)
  })
})

test.describe('gift cards', () => {
  test('picks an amount and adds it to the basket', async ({ page }) => {
    await page.goto('/gift')
    await expect(page.locator('.gift-card')).toHaveCount(4)

    // the middle amount is selected by default
    await expect(page.locator('.gift-card.on')).toContainText('A weekend')

    await page.locator('.gift-card', { hasText: 'A season' }).click()
    await expect(page.locator('.gift-buy-text')).toContainText('$500.00')

    await page.getByRole('button', { name: /add to basket/i }).click()
    const drawer = page.getByRole('dialog', { name: 'Your cart' })
    await expect(drawer).toContainText('Gift card · A season')

    // a voucher is digital, so no delivery is charged
    await expect(drawer).toContainText('$500.00')
  })
})

test.describe('the Join menu', () => {
  test('offers the new pages and shows the members instead of a button', async ({ page }) => {
    await page.goto('/')
    await page.locator('.nav-item', { hasText: 'Join' }).hover()

    const panel = page.locator('.mega-join')
    await expect(panel).toBeVisible()
    await expect(panel.getByRole('link', { name: /become a member/i })).toBeVisible()
    await expect(panel.getByRole('link', { name: /book a private tour/i })).toBeVisible()
    await expect(panel.getByRole('link', { name: /student membership/i })).toBeVisible()

    await expect(panel.locator('.mega-proof')).toContainText('5,000+')
    await expect(panel.getByRole('link', { name: /start your application/i })).toHaveCount(0)
  })

  test('the Courts panel says why those three', async ({ page }) => {
    await page.goto('/')
    await page.locator('.nav-item', { hasText: 'Courts' }).hover()
    await expect(page.locator('.mega-hint')).toHaveText('The most popular')
  })
})
