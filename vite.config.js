import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        index1: 'index1.html',
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
