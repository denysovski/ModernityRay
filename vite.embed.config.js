import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.BASE_PATH || '/'

// Builds src/embed.jsx into a single self-contained IIFE (+ css) under
// public/embed, so the static subpages can mount the real React navbar.
export default defineConfig({
  base,
  plugins: [react()],
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'public/embed',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/embed.jsx',
      name: 'CourtsyEmbed',
      formats: ['iife'],
      fileName: () => 'embed.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'embed.[ext]' },
    },
  },
})
