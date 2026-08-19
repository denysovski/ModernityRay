import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui'

const SOCIALS = [
  { label: 'Instagram', icon: Icon.instagram, href: 'https://www.instagram.com/', variant: 'lime' },
  { label: 'X', icon: Icon.x, href: 'https://x.com/', variant: 'dark' },
  { label: 'LinkedIn', icon: Icon.linkedin, href: 'https://www.linkedin.com/', variant: 'white' },
]

const bubble = {
  hidden: { opacity: 0, scale: 0, y: 6 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 24, delay: 0.34 + 0.07 * i },
  }),
  exit: (i) => ({
    opacity: 0,
    scale: 0,
    transition: { duration: 0.18, delay: 0.04 * i },
  }),
}

export default function SocialDock() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <div className={`dock ${open ? 'is-open' : ''}`}>
      {/* trigger + menu move down together (not on mobile, where the dock sits at the bottom) */}
      <motion.div
        className="dock-inner"
        animate={{ y: open && !isMobile ? 80 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: open ? 0 : 0.34 }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              className="dock-panel"
              initial={{ opacity: 0, scale: 0.45, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.28 } }}
              exit={{ opacity: 0, scale: 0.45, y: 14, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            >
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`dock-bubble dock-${s.variant}`}
                  aria-label={s.label}
                  variants={bubble}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={{ scale: 1.14 }}
                >
                  <s.icon />
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={`dock-trigger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close' : 'Connect with us'}
          whileTap={{ scale: 0.92 }}
        >
          {!open && <span className="dock-trigger-dot" />}
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'grid', placeItems: 'center' }}
          >
            {open ? <Icon.close /> : <Icon.share />}
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  )
}
