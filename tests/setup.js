import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

/* Shared test environment.
 *
 * jsdom gives us a localStorage, but it is shared across every test in a
 * file, so it is cleared between tests — the store is explicitly about
 * persistence and a leaked basket would make tests pass for the wrong reason.
 */

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})

/* jsdom implements neither of these, and framer-motion and the account view
   both call them on mount. */
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}

if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = () => {}
}
window.scrollTo = vi.fn()
