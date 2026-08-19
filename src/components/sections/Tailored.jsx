import { motion } from 'framer-motion'
import { Icon, Reveal, Stagger, upItem, CountUp } from '../ui'
import { CLUB_STATS, PLAN_ITEMS } from '../../data'

const ICONS = { body: Icon.body, flame: Icon.flame, dumbbell: Icon.dumbbell, spark: Icon.spark }

export default function Tailored() {
  return (
    <section className="section tailored" id="tailored">
      <div className="shell">
        <Reveal className="tl-head">
          <span className="micro"><Icon.star className="deco-star" /> Why CourtSy</span>
          <h2 className="h-lg">We believe in your goals.</h2>
        </Reveal>

        <Stagger className="tline">
          {CLUB_STATS.map((s) => (
            <motion.div className="tline-item" key={s.l} variants={upItem} whileHover={{ y: -6 }}>
              <span className="tline-n display">
                {s.static ? (
                  s.static
                ) : (
                  <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
                )}
              </span>
              <span className="tline-l">{s.l}</span>
            </motion.div>
          ))}
        </Stagger>

        <div className="tailored-grid">
          <Reveal className="tailored-copy">
            <span className="micro"><Icon.star className="deco-star" /> Your goals</span>
            <h2 className="h-lg tailored-h">
              Training built around you.
            </h2>
            <p className="lede">
              Individualised programs tailored to your body, lifestyle and goals —
              so every session at the club is optimised for you.
            </p>
            <a href="#join" className="btn btn-green">
              Build my plan
            </a>
          </Reveal>

          <Reveal className="plan" delay={0.1}>
            <div className="plan-card">
              <div className="plan-head">
                <span className="plan-pre">Your program</span>
                <h3>Fitness Program Plan</h3>
              </div>
              <Stagger className="plan-list" as="ul" amount={0.1} delay={0.2}>
                {PLAN_ITEMS.map((it) => {
                  const I = ICONS[it.icon] || Icon.spark
                  return (
                    <motion.li key={it.title} variants={upItem}>
                      <span className="plan-ic"><I /></span>
                      <div className="plan-text">
                        <strong>{it.title}</strong>
                        <span>{it.sub}</span>
                      </div>
                      {it.done && (
                        <span className="plan-ok"><Icon.check /></span>
                      )}
                    </motion.li>
                  )
                })}
              </Stagger>
              <div className="plan-progress">
                <motion.div
                  className="plan-progress-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: '24%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
                <span className="plan-progress-label">24%</span>
              </div>
            </div>

            <motion.div
              className="plan-aside"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <span className="plan-aside-ic"><Icon.spark /></span>
              <p>Transform goals into results.</p>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
