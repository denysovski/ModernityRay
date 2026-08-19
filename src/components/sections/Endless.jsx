import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Icon, Reveal } from '../ui'
import { PLANS, ENDLESS_IMG } from '../../data'

export default function Endless() {
  const n = PLANS.length
  const [active, setActive] = useState(0)
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const go = (dir) => setActive((a) => (a + dir + n) % n)

  // signed shortest distance from the active card (wraps → infinite)
  const offset = (i) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <section className="section endless" id="endless">
      <div className="shell">
        <div className="endless-card" ref={cardRef}>
          <motion.img className="endless-bg" src={ENDLESS_IMG} alt="Training at the club" style={{ y: bgY }} />
          <div className="endless-scrim" />
          <Reveal className="endless-copy">
            <span className="micro micro-dark">
              <Icon.star className="deco-star deco-star-light" /> Custom plans
            </span>
            <h2 className="h-lg">
              Endless ways <br /> <span className="ghost-light">to move.</span>
            </h2>
            <p>
              Explore countless training options for strength, court sport,
              recovery — or maintaining your best shape.
            </p>
          </Reveal>
        </div>

        {/* moving carousel of all custom plans */}
        <div className="plans">
          <div className="plans-head">
            <div>
              <span className="micro micro-plain"><Icon.star className="deco-star" /> All plans</span>
              <h3 className="plans-title">Pick a custom plan.</h3>
            </div>
            <div className="plans-nav">
              <button className="iconbtn" onClick={() => go(-1)} aria-label="Previous">
                <Icon.left />
              </button>
              <button className="iconbtn" onClick={() => go(1)} aria-label="Next">
                <Icon.right />
              </button>
            </div>
          </div>

          <div className="plans-stage">
            {PLANS.map((p, i) => {
              const pos = offset(i)
              const abs = Math.abs(pos)
              const visible = abs <= 2
              const center = pos === 0
              // pull the outermost (3rd-layer) cards 40px toward centre
              const pull = abs === 2 ? (pos > 0 ? -40 : 40) : 0
              // lift the centre card, push the back cards down for depth
              const yOff = pos === 0 ? -40 : abs === 2 ? 20 : 0
              return (
                <a
                  key={p.title}
                  className={`pcard ${center ? 'is-active' : ''}`}
                  href={center ? p.href : undefined}
                  onClick={center ? undefined : (e) => { e.preventDefault(); setActive(i) }}
                  style={{
                    transform: `translate(calc(-50% + ${pos} * var(--step) + ${pull}px), ${yOff}px) scale(${1 - abs * 0.12})`,
                    opacity: visible ? 1 : 0,
                    '--veil': abs === 0 ? 0 : abs === 1 ? 0.45 : 0.7,
                    zIndex: 10 - abs,
                    pointerEvents: visible ? 'auto' : 'none',
                  }}
                >
                  <div className="pcard-img">
                    <img src={p.img} alt={p.title} loading="lazy" />
                    <span className="pcard-tag">{p.tag}</span>
                    <span className="pcard-go"><Icon.arrowUR /></span>
                  </div>
                  <div className="pcard-body">
                    <strong>{p.title}</strong>
                    <span className="pcard-meta">{p.meta}</span>
                    <p className="pcard-desc">{p.desc}</p>
                    <span className="pcard-link">
                      View plan <Icon.arrow className="arrow" />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>

          <div className="plans-dots">
            {PLANS.map((_, i) => (
              <button
                key={i}
                className={`plans-dot ${i === active ? 'on' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Go to ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
