import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Img from './Img'

/* The photo showcase on a facility page.
 *
 * Three jobs: cross-fade between slides, say something about each one in an
 * overlay rather than leaving the picture to speak for itself, and show how
 * long until the next slide so the movement never feels arbitrary.
 *
 * The progress indicator is the thumbnail itself: a bar fills across it, and
 * when it reaches the end that slide takes over. Clicking a thumbnail jumps
 * there and restarts the clock.
 *
 * It pauses while the pointer is over it (nobody wants a caption to slide
 * away mid-sentence) and while the tab is hidden. With reduced motion it does
 * not advance on its own at all, because unprompted movement is the thing
 * that setting is asking us to stop.
 */

const SLIDE_MS = 6000
const TICK_MS = 50

export default function Showcase({ slides, name, sizes = '(max-width: 1440px) 100vw, 1440px' }) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const elapsed = useRef(0)

  const count = slides.length
  const go = useCallback(
    (next) => {
      elapsed.current = 0
      setProgress(0)
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  /* One interval drives both the progress bar and the advance, so the bar can
     never finish early or late relative to the slide change. */
  useEffect(() => {
    if (reduced || paused || count < 2) return undefined

    const id = window.setInterval(() => {
      if (document.hidden) return
      elapsed.current += TICK_MS
      if (elapsed.current >= SLIDE_MS) {
        elapsed.current = 0
        setProgress(0)
        setIndex((i) => (i + 1) % count)
      } else {
        setProgress(elapsed.current / SLIDE_MS)
      }
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [reduced, paused, count])

  // a new facility resets the showcase
  useEffect(() => {
    elapsed.current = 0
    setProgress(0)
    setIndex(0)
  }, [name])

  const slide = slides[index]

  return (
    <div
      className="shw"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="shw-stage">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            className="shw-slide"
            key={slide.img}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Img
              src={slide.img}
              alt={`${name}: ${slide.title}`}
              sizes={sizes}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : undefined}
            />
          </motion.div>
        </AnimatePresence>

        <span className="shw-scrim" />

        {/* The caption sits bottom left, over the darkest part of the scrim. */}
        <AnimatePresence mode="wait">
          <motion.figcaption
            className="shw-note"
            key={slide.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="shw-note-title">{slide.title}</span>
            <span className="shw-note-fact">{slide.fact}</span>
          </motion.figcaption>
        </AnimatePresence>
      </div>

      <div className="shw-thumbs" role="group" aria-label={`${name} photographs`}>
        {slides.map((s, i) => (
          <button
            type="button"
            key={s.img}
            className={`shw-thumb ${i === index ? 'on' : ''}`}
            onClick={() => go(i)}
            aria-label={s.title}
            aria-pressed={i === index}
          >
            <Img src={s.img} alt="" sizes="120px" />
            {/* fills left to right over the life of the slide */}
            <span
              className="shw-thumb-bar"
              style={{ transform: `scaleX(${i === index ? progress : i < index ? 1 : 0})` }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
