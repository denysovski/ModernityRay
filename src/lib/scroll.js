/* Scrolling an in-page anchor into view.
 *
 * Two things make this harder than scrollIntoView.
 *
 * First, every homepage section sits inside <Depth>, which translates it
 * vertically in response to scroll position. The target therefore moves while
 * you travel towards it: aiming at a section 1730 px away landed it 146 px
 * too high, tucked under the navbar. Any approach that computes a destination
 * once and scrolls there is wrong by construction.
 *
 * Second, the browser's own smooth scrolling cannot be corrected mid-flight,
 * and detecting when it has finished is unreliable.
 *
 * So the scroll is animated here instead. Each frame measures how far the
 * target still is from where it should sit and closes a fixed fraction of
 * that gap. Because the measurement is fresh every frame, a target that moves
 * is simply followed, and the motion eases out naturally as the remaining
 * distance shrinks.
 */

/** Matches the scroll-margin-top in index.css; used when it cannot be read. */
const FALLBACK_OFFSET = 150

/** Share of the remaining distance covered per frame. */
const EASING = 0.18

/** Close enough to stop, in pixels. */
const TOLERANCE = 0.5

/** Never animate longer than this, however stubborn the target. */
const MAX_DURATION_MS = 1600

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** How far below the viewport top this element wants to sit. */
const offsetFor = (el) => {
  const declared = Number.parseFloat(getComputedStyle(el).scrollMarginTop)
  return Number.isFinite(declared) && declared > 0 ? declared : FALLBACK_OFFSET
}

/** Distance the page still has to travel for `el` to reach its mark. */
const errorFor = (el) => el.getBoundingClientRect().top - offsetFor(el)

/** Scrolls immediately, overriding the smooth scroll-behavior set in CSS. */
const jumpTo = (top) => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: Math.min(Math.max(top, 0), max), behavior: 'instant' })
}

/**
 * Brings `el` to its scroll-margin-top offset below the viewport top.
 * @param {Element|null} el
 * @param {{smooth?: boolean}} [options]
 */
export function scrollToAnchor(el, { smooth = true } = {}) {
  if (!el || typeof window === 'undefined') return

  /* Reduced motion gets no animation, but still needs more than one pass:
     the target shifts as the page moves, so one jump leaves it off the mark. */
  if (!smooth || prefersReducedMotion()) {
    for (let pass = 0; pass < 4; pass += 1) {
      const error = errorFor(el)
      if (Math.abs(error) <= 1) break
      jumpTo(window.scrollY + error)
    }
    return
  }

  const startedAt = performance.now()
  let cancelled = false
  let frame = 0

  /* A deliberate scroll by the reader wins over an animation they have
     already seen the result of. */
  const stop = () => {
    cancelled = true
    window.removeEventListener('wheel', stop)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('keydown', stop)
  }
  window.addEventListener('wheel', stop, { passive: true, once: true })
  window.addEventListener('touchstart', stop, { passive: true, once: true })
  window.addEventListener('keydown', stop, { once: true })

  const tick = (now) => {
    if (cancelled) return

    const error = errorFor(el)
    const expired = now - startedAt > MAX_DURATION_MS

    if (Math.abs(error) <= TOLERANCE || expired) {
      if (Math.abs(error) > TOLERANCE) jumpTo(window.scrollY + error)
      stop()
      return
    }

    // never crawl: below a pixel or two a proportional step would stall
    const step = Math.abs(error) < 2 ? error : error * EASING
    const before = window.scrollY
    jumpTo(before + step)

    // the page cannot move any further, so neither can we
    if (window.scrollY === before && frame > 0) {
      stop()
      return
    }

    frame += 1
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

/** Resolves a '#id' href to its element, tolerating encoded characters. */
export const anchorTarget = (hash) => {
  if (typeof hash !== 'string' || hash.length < 2) return null
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  } catch {
    return document.getElementById(hash.slice(1))
  }
}
