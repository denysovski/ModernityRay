/* Renders docs/dokumentace.md to docs/dokumentace.pdf.
 *
 * The Markdown file is the single source of truth — it stays readable on
 * GitHub, and the PDF the assignment asks for is generated from it, so the two
 * can never drift apart.
 *
 *   npm run docs:pdf
 */
import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import { chromium } from '@playwright/test'

const SRC = path.resolve('docs/dokumentace.md')
const OUT = path.resolve('docs/dokumentace.pdf')

const body = marked.parse(fs.readFileSync(SRC, 'utf8'), { mangle: false, headerIds: false })

/* Print styling: a serif-free, compact A4 layout that keeps tables and
   headings from splitting across a page break. */
const html = `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<title>CourtSy — technická dokumentace</title>
<style>
  @page { size: A4; margin: 13mm 14mm; }
    * { box-sizing: border-box; }
  body {
    margin: 0;
    font: 8.9pt/1.35 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #16181d;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  h1 {
    font-size: 17pt; line-height: 1.12; letter-spacing: -0.02em;
    margin: 0 0 2mm;
  }
  h2 {
    font-size: 11.5pt; letter-spacing: -0.01em;
    margin: 4mm 0 1.5mm; padding-top: 1.5mm;
    border-top: 1px solid #d9dde3;
    break-after: avoid;
  }
  h2:first-of-type { border-top: 0; padding-top: 0; }
  h3 { font-size: 10.5pt; margin: 4mm 0 1.5mm; break-after: avoid; }
  p, ul, ol, table { margin: 0 0 1.9mm; }
  ul, ol { padding-left: 5mm; }
  li { margin-bottom: 0.8mm; }
  strong { font-weight: 650; }
  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    font-size: 8.8pt;
    background: #f1f3f6;
    padding: 0.5mm 1mm;
    border-radius: 1mm;
  }
  pre {
    background: #f1f3f6; padding: 2.5mm 3mm; border-radius: 1.5mm;
    font-size: 8.5pt; overflow: hidden; break-inside: avoid;
  }
  pre code { background: none; padding: 0; }
  table {
    width: 100%; border-collapse: collapse; font-size: 8.6pt;
    break-inside: avoid;
  }
  th, td {
    border: 1px solid #d9dde3; padding: 1.5mm 2mm; text-align: left;
    vertical-align: top;
  }
  th { background: #f1f3f6; font-weight: 650; }
  hr { border: 0; border-top: 1px solid #d9dde3; margin: 4mm 0; }
  blockquote {
    margin: 0 0 2.5mm; padding-left: 3mm;
    border-left: 2px solid #2f7a18; color: #4a5160;
  }
  /* the subtitle block under the title */
  h1 + p { color: #4a5160; font-size: 9pt; margin-bottom: 4mm; }
</style>
</head>
<body>${body}</body>
</html>`

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'networkidle' })
await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  margin: { top: '13mm', bottom: '13mm', left: '14mm', right: '14mm' },
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate:
    '<div style="width:100%;font-size:7.5pt;color:#8a909c;padding:0 15mm;' +
    'display:flex;justify-content:space-between;">' +
    '<span>CourtSy — technická dokumentace</span>' +
    '<span class="pageNumber"></span>/<span class="totalPages"></span></div>',
})
await browser.close()

const kb = (fs.statSync(OUT).size / 1024).toFixed(0)
console.log(`wrote ${path.relative(process.cwd(), OUT)} (${kb} kB)`)
