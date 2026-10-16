import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/* Unit and component tests.
 *
 * Separate from vite.config.js so the app build never carries test settings,
 * and so `tests/e2e` (Playwright, which needs a real browser) cannot be picked
 * up by Vitest — the two runners both match *.spec/*.test by default.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/unit/**/*.test.{js,jsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // the logic worth covering: state, validation, formatting
      include: ['src/lib/**', 'src/context/**', 'src/components/commerce/**'],
    },
  },
})
