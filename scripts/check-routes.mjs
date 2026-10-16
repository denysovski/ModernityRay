/* Route smoke check.
 *
 * Opens every route in a real headless Chromium against a running dev server
 * and fails on any console error, page error or failed request. Cheaper than
 * the Playwright suite and useful while refactoring: it catches a view that
 * throws on mount, which a build never will.
 *
 *   npm run dev            # in one terminal
 *   npm run check:routes   # in another
 *
 * Pass a different origin as the first argument, and a screenshot directory as
 * the second:
 *   node scripts/check-routes.mjs http://localhost:4173 ./shots
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'

const BASE = process.argv[2] || 'http://localhost:5173'
const SHOTS = process.argv[3] || null

const ROUTES = [
  ['/', 'home'],
  ['/memberships', 'memberships'],
  ['/memberships/resident', 'membership-detail'],
  ['/courts', 'courts'],
  ['/courts/centre-court', 'court-detail'],
  ['/events', 'events'],
  ['/events/summer-open-doubles', 'event-detail'],
  ['/checkout', 'checkout'],
  ['/account', 'account'],
  ['/nonsense', 'not-found'],
]

/* Noise that is not the app's fault: the missing dev favicon, React's devtools
   advert, and the remote avatars that need a network the CI box may not have. */
const IGNORE = /favicon|Download the React DevTools|images\.unsplash\.com/i

if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch()
let failures = 0

for (const [route, name] of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const problems = []

  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text()}`)
  })
  page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`))
  page.on('requestfailed', (r) => problems.push(`[request] ${r.url()} ${r.failure()?.errorText}`))

  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)

  const heading = (await page.locator('h1').first().textContent().catch(() => '')) || ''
  const navLinks = await page.locator('.nav-link').count()
  const footerCols = await page.locator('.footer-col').count()
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png` })

  const real = problems.filter((p) => !IGNORE.test(p))
  if (real.length > 0) failures++

  console.log(
    `${real.length ? 'FAIL' : ' ok '}  ${route.padEnd(34)} ` +
      `h1=${JSON.stringify(heading.trim().slice(0, 44))} nav=${navLinks} footer=${footerCols}`,
  )
  for (const p of real.slice(0, 6)) console.log('        ' + p.slice(0, 200))

  await page.close()
}

await browser.close()
console.log(failures ? `\n${failures} route(s) reported problems` : '\nall routes clean')
process.exit(failures ? 1 : 0)
