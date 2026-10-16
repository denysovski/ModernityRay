import { defineConfig, devices } from '@playwright/test'

/* End-to-end tests.
 *
 * These run against a production build served by `vite preview`, not the dev
 * server: the build is what gets deployed, and it is the only way to catch
 * something that works under the dev server's module graph but breaks once
 * routes are split into lazy chunks.
 *
 * The server is started by Playwright itself, so `npm run test:e2e` is the
 * whole command — no second terminal.
 */

const PORT = 4173
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `npm run build:app && npx vite preview --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
