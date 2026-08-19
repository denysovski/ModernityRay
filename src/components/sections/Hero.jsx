import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Icon } from '../ui'
import { HERO_CARDS } from '../../data'

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.09 },
  }),
}

const pop = (i) => ({
  hidden: { opacity: 0, y: 22, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.7 + i * 0.13 },
  },
})

const HERO_BG = '/img/aerial.jpg'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // each card drifts a little, by a different amount, on scroll
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -90])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 70])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 110])

  return (
    <section className="hero" id="top" ref={ref}>
      <Icon.star className="star-float" style={{ top: '116px', left: '7%', width: 42, height: 42 }} />
      <Icon.star className="star-float" style={{ top: '170px', right: '9%', width: 34, height: 34 }} />
      <Icon.star className="star-float" style={{ top: '320px', left: '13%', width: 30, height: 30 }} />

      <div className="hero-head shell">
        <motion.span className="hero-eyebrow" variants={rise} custom={0} initial="hidden" animate="show">
          Private Sport Club · Est. 2026
        </motion.span>
        <motion.h1 className="hero-title" variants={rise} custom={1} initial="hidden" animate="show">
          Where players belong.
        </motion.h1>
        <motion.p className="hero-sub" variants={rise} custom={2} initial="hidden" animate="show">
          Courts, greens, coaching and recovery — one considered space for people
          who move. Members only.
        </motion.p>
        <motion.div className="hero-actions" variants={rise} custom={3} initial="hidden" animate="show">
          <a href="#tailored" className="btn btn-greenfill btn-pulse">
            About us
          </a>
          <a href="#endless" className="btn btn-play">
            <span className="btn-ic"><Icon.play /></span>
            Watch the tour
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hero-wide"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={HERO_BG} alt="Aerial view of the club courts" />

        <div className="hero-overlay">
          <span className="hero-overlay-tag">Members only</span>
          <strong>Professional court care, just for you.</strong>
        </div>

        <motion.a href="#tailored" className="fc fc-coach" style={{ y: y1 }} variants={pop(0)} initial="hidden" animate="show" whileHover={{ scale: 1.05 }}>
          <img src={HERO_CARDS.coach.avatar} alt={HERO_CARDS.coach.name} />
          <div>
            <strong>{HERO_CARDS.coach.name}</strong>
            <span>{HERO_CARDS.coach.role}</span>
          </div>
        </motion.a>

        <motion.a href="#elevate" className="fc fc-members" style={{ y: y2 }} variants={pop(1)} initial="hidden" animate="show" whileHover={{ scale: 1.05 }}>
          <div className="fc-avatars">
            {HERO_CARDS.members.map((m) => (
              <img key={m} src={m} alt="" />
            ))}
          </div>
          <div>
            <strong>+5,000</strong>
            <span>members moving</span>
          </div>
        </motion.a>

        <motion.a href="#join" className="fc fc-time" style={{ y: y3 }} variants={pop(2)} initial="hidden" animate="show" whileHover={{ scale: 1.05 }}>
          <span className="fc-ic"><Icon.clock /></span>
          <div>
            <strong>Open 24 / 7</strong>
            <span>Resident access</span>
          </div>
        </motion.a>

        <motion.a href="#endless" className="fc fc-focus" style={{ y: y4 }} variants={pop(3)} initial="hidden" animate="show" whileHover={{ scale: 1.05 }}>
          <span className="fc-ic fc-ic-ok"><Icon.check /></span>
          <div>
            <strong>Full access</strong>
            <span>Every court &amp; green</span>
          </div>
        </motion.a>
      </motion.div>
    </section>
  )
}
