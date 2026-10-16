import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/* The arrival sequence, shown once per visit on the homepage.
 *
 * Three beats: a spinner while the page settles, a line of welcome, then the
 * screen parts like a curtain and the site is revealed behind it.
 *
 * Rules it follows:
 *   - once per session. A splash on every navigation is an obstacle, not a
 *     welcome, so a flag in sessionStorage retires it after the first view.
 *   - the page cannot be scrolled while it is up, otherwise you arrive
 *     halfway down the hero.
 *   - reduced motion skips the whole thing. It is decoration, and someone
 *     who has asked for less movement should not be made to sit through it.
 *   - it never blocks the content from rendering; the site is behind it the
 *     whole time, which is why the curtain can simply open.
 */

const SEEN_KEY = 'courtsy.intro.seen'

/* Timings, in milliseconds. Short enough not to be in the way. */
const SPINNER_MS = 1150
const WELCOME_MS = 1250
const CURTAIN_MS = 900

const ease = [0.76, 0, 0.24, 1]

/** Whether this visitor still has the intro coming to them. */
export const introPending = () => {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    // private mode: show it, it is only a second
    return true
  }
}

const markSeen = () => {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* nothing to do; it will show again next navigation at worst */
  }
}

export default function Intro({ onDone }) {
  const reduced = useReducedMotion()
  // 'spinner' -> 'welcome' -> 'opening' -> gone
  const [phase, setPhase] = useState('spinner')

  useEffect(() => {
    if (reduced) {
      markSeen()
      onDone?.()
      return undefined
    }

    const timers = [
      window.setTimeout(() => setPhase('welcome'), SPINNER_MS),
      window.setTimeout(() => setPhase('opening'), SPINNER_MS + WELCOME_MS),
      window.setTimeout(() => {
        markSeen()
        onDone?.()
      }, SPINNER_MS + WELCOME_MS + CURTAIN_MS),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [reduced, onDone])

  /* Lock the page for as long as the curtain is up, otherwise you arrive
     halfway down the hero. The lock goes on <html>, not <body>: body carries
     an overflow-x of its own (see index.css) and overriding it there would
     turn body back into the scroll container. */
  useEffect(() => {
    if (reduced) return undefined
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [reduced])

  if (reduced) return null

  const opening = phase === 'opening'

  return (
    <div className="intro" role="status" aria-live="polite" aria-label="Loading CourtSy">
      {/* two halves that part to reveal the page */}
      {['top', 'bottom'].map((half) => (
        <motion.div
          key={half}
          className={`intro-panel intro-panel-${half}`}
          initial={{ y: 0 }}
          animate={{ y: opening ? (half === 'top' ? '-100%' : '100%') : 0 }}
          transition={{ duration: CURTAIN_MS / 1000, ease }}
        />
      ))}

      <AnimatePresence mode="wait">
        {phase === 'spinner' && (
          <motion.div
            className="intro-middle"
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4 }}
          >
            <span className="intro-spinner" aria-hidden="true" />
            <span className="intro-mark">CourtSy<span>.</span></span>
          </motion.div>
        )}

        {phase === 'welcome' && (
          <motion.div
            className="intro-middle"
            key="welcome"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14, transition: { duration: 0.3 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="intro-welcome">Welcome to the luxury</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
