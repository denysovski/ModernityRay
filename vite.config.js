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

export default defineConfig({
  base,
  plugins: [react(), spaFallback()],
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
