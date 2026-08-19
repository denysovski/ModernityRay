import { motion } from 'framer-motion'
import { Reveal, Icon, CountUp } from '../ui'
import { ELEVATE, STATS } from '../../data'

export default function Elevate() {
  return (
    <section className="section elevate" id="elevate">
      <div className="shell">
        <Reveal className="elevate-head">
          <span className="micro"><Icon.star className="deco-star" /> Smart lifestyle</span>
          <h2 className="h-lg">Elevate health and strength.</h2>
          <p className="lede elevate-lede">
            Membership is more than court time. From conditioning and recovery to
            coaching and the social calendar, every part of the club is built to
            keep you moving — and feeling — your best.
          </p>
        </Reveal>

        <div className="elevate-grid">
          {ELEVATE.map((e, i) => (
            <motion.div
              key={e.label}
              className="ecell"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            >
              <a href={e.href} className="ecell-img">
                <img src={e.img} alt={e.title} />
                <span className="ecell-tag">{e.label}</span>
                <span className="ecell-go"><Icon.arrowUR /></span>
              </a>
              <div className="ecell-body">
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
              </div>
              <a href={e.href} className="ecell-link">
                Learn more <Icon.arrow className="arrow" />
              </a>

              {['left', 'right'].map((side) => (
                <div className={`ecell-fly ecell-fly-${side}`} key={side}>
                  <span className="ecell-fly-head">{e.menu.heading}</span>
                  <ul>
                    {e.menu.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href}>
                          {l.label} <Icon.arrowUR />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        <Reveal className="elevate-stats" delay={0.1}>
          {STATS.map((s) => (
            <div className="estat" key={s.l}>
              <div className="estat-n display">
                {s.static ? (
                  s.static
                ) : (
                  <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
                )}
              </div>
              <div className="estat-l">{s.l}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
