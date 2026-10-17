import { useCallback, useEffect, useRef, useState } from 'react'
import { describe } from '../../data/images'
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
 * The clock runs continuously. It yields only to a hidden tab, and under
 * reduced motion it does not advance on its own at all, because unprompted
 * movement is the thing that setting is asking us to stop.
 */

const SLIDE_MS = 7000
const TICK_MS = 50

export default function Showcase({ slides, name, sizes = '(max-width: 1440px) 100vw, 1440px' }) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
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

  /* One interval drives both the progress bar and the advance, so the bar
     can never finish early or late relative to the slide change.

     It deliberately does not pause on hover: the pointer tends to rest over
     the picture while you read it, so the sequence would simply never move
     on. A hidden tab is different, since nothing is being read at all. */
  useEffect(() => {
    if (reduced || count < 2) return undefined

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
  }, [reduced, count])

  // a new facility resets the showcase
  useEffect(() => {
    elapsed.current = 0
    setProgress(0)
    setIndex(0)
  }, [name])

  const slide = slides[index]

  return (
    <div className="shw">
      <div className="shw-stage">
        {/* A plain cross-fade. Both slides are absolutely positioned and
            stacked, so the outgoing one can simply fade under the incoming
            one: no layout mode, and no scale, which is what made the
            picture appear to twitch as it arrived. */}
        <AnimatePresence initial={false}>
          <motion.div
            className="shw-slide"
            key={slide.img}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'linear' }}
          >
            <Img
              src={slide.img}
              alt={describe(slide.img) || `${name}: ${slide.title}`}
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
            {slide.by && (
              <span className="shw-by">
                <img src={slide.by.img} alt="" width="34" height="34" loading="lazy" />
                <span className="shw-by-text">
                  <strong>{slide.by.name}</strong>
                  <span>{slide.by.role}</span>
                </span>
              </span>
            )}
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
