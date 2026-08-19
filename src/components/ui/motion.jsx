import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

/* ---------- Scroll reveal wrapper ---------- */
export function Reveal({ children, delay = 0, y = 30, className, as = 'div' }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  )
}

/* stagger container + child for lists/grids */
export function Stagger({ children, className, amount = 0.12, delay = 0.05, as = 'div' }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: amount, delayChildren: delay } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </M>
  )
}
export const upItem = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/* ---------- Pop: fade + grow-in on scroll ---------- */
export function Pop({ children, delay = 0, className, as = 'div', from = 0.9 }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, scale: from, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  )
}

/* ---------- Depth: scroll-driven 3D tilt for a whole section ----------
   The section leans back as it comes up from the bottom of the viewport,
   sits flat while it owns the screen, then tilts away as it leaves the top.
   Perspective is applied per-element (transformPerspective) rather than on a
   page-level ancestor — one shared vanishing point would badly distort
   sections far from the middle of a document this tall. */
export function Depth({ children, className = '', strength = 1 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // spring the raw progress so the tilt trails the scroll slightly — that lag
  // is most of what reads as "weight"
  const p = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 30,
    mass: 0.35,
  })

  // flat through the middle band, tilted at both ends. translateZ and scale
  // compound under perspective, so both stay modest on their own
  const stops = [0, 0.32, 0.66, 1]
  const rotateX = useTransform(p, stops, [8 * strength, 0, 0, -6 * strength])
  const scale = useTransform(p, stops, [0.96, 1, 1, 0.98])
  const y = useTransform(p, stops, [40 * strength, 0, 0, -26 * strength])
  const z = useTransform(p, stops, [-80 * strength, 0, 0, -55 * strength])

  if (reduced) return <div className={`depth ${className}`}>{children}</div>

  return (
    <div className={`depth ${className}`} ref={ref}>
      <motion.div
        className="depth-inner"
        style={{ rotateX, scale, y, z, transformPerspective: 1500 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* stagger container + item variants */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
export const popItem = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

