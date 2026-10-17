import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const base = process.env.BASE_PATH || '/'

/* GitHub Pages serves static files only: a request for /ModernityRay/events
   finds no such file and returns its 404 page. Pages serves 404.html for
   exactly those misses, so shipping a byte-for-byte copy of index.html as
   404.html makes every deep link boot the app, which then routes the URL
   client-side. This is the standard SPA-on-Pages fallback and the reason the
   app can use clean paths instead of hash routing. */
const spaFallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const dist = path.resolve('dist')
    const index = path.join(dist, 'index.html')
    if (fs.existsSync(index)) {
      fs.copyFileSync(index, path.join(dist, '404.html'))
      this.info?.('wrote dist/404.html (SPA fallback)')
    }
  },
})

/* The sitemap is generated, not written by hand.
 *
 * A hand-maintained list of twenty-one URLs is a list that is wrong within
 * a month: the slugs live in src/data, and adding a court or a programme
 * would silently leave it out. This reads the same data the app routes
 * from, so the two cannot disagree.
 *
 * The checkout, the account and the 404 are left out on purpose — they
 * carry `noindex` in the app for the same reason.
 */
const sitemap = () => ({
  name: 'sitemap',
  apply: 'build',
  closeBundle() {
    const origin = 'https://denysovski.github.io'
    const prefix = base.replace(/\/$/, '')

    /* Slugs are read out of the data files rather than imported from them.
       Importing would be tidier, but these modules call local() at module
       scope and that reads import.meta.env, which does not exist in the
       Node process running this plugin. A regex over `slug: '…'` is enough
       because that is the only shape a slug takes in src/data, and the
       assertion below turns a miss into a failed build rather than a
       quietly short sitemap. */
    const slugsIn = (file, expected) => {
      const src = fs.readFileSync(path.resolve('src/data', file), 'utf8')
      const found = [...src.matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1])
      if (found.length < expected) {
        throw new Error(
          `sitemap: expected at least ${expected} slugs in src/data/${file}, found ${found.length}`,
        )
      }
      return found
    }

    const tiers = slugsIn('membership.js', 5)
    const courts = slugsIn('courts.js', 5)
    const programmes = slugsIn('programmes.js', 9)
    const events = slugsIn('events.js', 9)

    const paths = [
      ['/', '1.0', 'weekly'],
      ['/memberships', '0.9', 'monthly'],
      ['/courts', '0.9', 'monthly'],
      ['/programmes', '0.9', 'monthly'],
      ['/events', '0.8', 'weekly'],
      ['/join', '0.8', 'monthly'],
      ['/shop', '0.7', 'monthly'],
      ['/dining', '0.7', 'monthly'],
      ['/private-tour', '0.6', 'monthly'],
      ['/students', '0.6', 'yearly'],
      ['/gift', '0.6', 'yearly'],
      ...tiers.map((s) => [`/memberships/${s}`, '0.7', 'monthly']),
      ...courts.map((s) => [`/courts/${s}`, '0.7', 'monthly']),
      ...programmes.map((s) => [`/programmes/${s}`, '0.7', 'monthly']),
      ...events.map((s) => [`/events/${s}`, '0.5', 'weekly']),
      ['/terms', '0.2', 'yearly'],
      ['/privacy', '0.2', 'yearly'],
      ['/cookies', '0.2', 'yearly'],
    ]

    const today = new Date().toISOString().slice(0, 10)
    const body = paths
      .map(
        ([p, priority, changefreq]) =>
          `  <url>\n` +
          `    <loc>${origin}${prefix}${p === '/' ? '/' : p}</loc>\n` +
          `    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${changefreq}</changefreq>\n` +
          `    <priority>${priority}</priority>\n` +
          `  </url>`,
      )
      .join('\n')

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

    fs.writeFileSync(path.resolve('dist', 'sitemap.xml'), xml)
    this.info?.(`wrote dist/sitemap.xml (${paths.length} URLs)`)
  },
})

export default defineConfig({
  base,
  plugins: [react(), spaFallback(), sitemap()],
  build: {
    rollupOptions: {
      output: {
        /* Split the two libraries that dominate the bundle into their own
           chunks. They change far less often than application code, so a
           returning visitor keeps them cached across deploys, and the route
           chunks created by React.lazy in src/App.jsx stay small. */
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    watch: {
      // Only ever ignore directories that hold no served source. Do NOT add a
      // blanket image glob here: Vite builds its list of public/ files at boot
      // and keeps it current from watcher add/unlink events, so an ignored
      // image dropped into public/img is invisible to the dev server (requests
      // fall through to the index.html SPA fallback) until a restart.
      // Raw, unprocessed photography belongs in assets/source instead.
      ignored: ['**/assets/source/**', '**/dist/**'],
    },
  },
})
