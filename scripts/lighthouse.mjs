/* Lighthouse audit of the production build.
 *
 * Measures the routes that matter — the landing page, a list view and a
 * detail view — against `vite preview`, because the dev server's unbundled
 * module graph makes every performance number meaningless.
 *
 *   npm run build
 *   npx vite preview --port 4173
 *   npm run audit            # add --save to write HTML reports into docs/
 *
 * Scores vary a few points between runs on a loaded machine; the numbers
 * quoted in docs/ are from a quiet one, and the point of the exercise is the
 * before/after delta, not the absolute figure.
 */
import fs from 'node:fs'
import path from 'node:path'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'

const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:4173'
const SAVE = process.argv.includes('--save')
const OUT = 'docs/lighthouse'

const ROUTES = [
  ['/', 'home'],
  ['/memberships', 'memberships'],
  ['/courts/centre-court', 'court-detail'],
]

const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] })
if (SAVE) fs.mkdirSync(OUT, { recursive: true })

const pct = (c) => (c == null ? '  —' : String(Math.round(c * 100)).padStart(3))
const ms = (a) => (a ? a.displayValue || '—' : '—')

console.log(`\nLighthouse · ${BASE}\n`)
console.log('route                perf  a11y  best   seo   | FCP        LCP        TBT        CLS')
console.log('─'.repeat(92))

const summary = []

for (const [route, name] of ROUTES) {
  const result = await lighthouse(
    BASE + route,
    { port: chrome.port, output: SAVE ? 'html' : 'json', logLevel: 'error' },
    // mobile emulation is Lighthouse's default and the harsher of the two
    { extends: 'lighthouse:default' },
  )

  const { categories, audits } = result.lhr
  const row = {
    route,
    performance: categories.performance.score,
    accessibility: categories.accessibility.score,
    bestPractices: categories['best-practices'].score,
    seo: categories.seo.score,
    fcp: ms(audits['first-contentful-paint']),
    lcp: ms(audits['largest-contentful-paint']),
    tbt: ms(audits['total-blocking-time']),
    cls: ms(audits['cumulative-layout-shift']),
  }
  summary.push(row)

  console.log(
    `${route.padEnd(20)} ${pct(row.performance)}   ${pct(row.accessibility)}   ` +
      `${pct(row.bestPractices)}   ${pct(row.seo)}   | ${row.fcp.padEnd(10)} ` +
      `${row.lcp.padEnd(10)} ${row.tbt.padEnd(10)} ${row.cls}`,
  )

  if (SAVE) {
    fs.writeFileSync(path.join(OUT, `${name}.html`), result.report)
  }
}

/* The opportunities Lighthouse found, so the optimisation pass has a list to
   work from rather than guesswork. */
const last = await lighthouse(
  BASE + '/',
  { port: chrome.port, output: 'json', logLevel: 'error' },
  { extends: 'lighthouse:default' },
)
const opportunities = Object.values(last.lhr.audits)
  .filter((a) => a.details?.type === 'opportunity' && a.numericValue > 0)
  .sort((a, b) => b.numericValue - a.numericValue)
  .slice(0, 8)

if (opportunities.length > 0) {
  console.log('\nTop opportunities on /:')
  for (const a of opportunities) {
    console.log(`  ${String(Math.round(a.numericValue)).padStart(6)} ms  ${a.title}`)
  }
}

if (SAVE) {
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2))
  console.log(`\nreports written to ${OUT}/`)
}

await chrome.kill()
