import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon, Img, SmartLink } from '../components/ui'
import { STUDENT, STUDENT_IMG } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'

/* View 12 — the student rate.
 *
 * Not a tier you can buy: it is agreed in person, so the page has no basket
 * button at all. It leads with the saving, says plainly what the conditions
 * are, and ends by pointing at the conversation that grants it.
 */

const ease = [0.22, 1, 0.36, 1]

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export default function Students() {
  const { money } = useStore()

  useEffect(() => {
    document.title = 'Student membership — CourtSy'
  }, [])

  const saving = Math.round(((STUDENT.full - STUDENT.price) / STUDENT.full) * 100)

  return (
    <main className="st">
      {/* ── the number, first ────────────────────────────────────────── */}
      <header className="st-hero">
        <div className="shell st-hero-grid">
          <motion.div
            className="st-hero-text"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="micro"><Icon.star className="deco-star" /> Special offer</span>
            <h1 className="st-title">
              The club, at <span className="st-off">{saving}% off</span>, while you study.
            </h1>
            <p className="st-lede">
              A full membership on a student budget. Agreed in person, kept
              simple, and valid for as long as you are enrolled anywhere.
            </p>

            <div className="st-price">
              <span className="st-price-n display">{money(STUDENT.price)}</span>
              <span className="st-price-c">{STUDENT.cadence}</span>
              <span className="st-price-was">
                instead of {money(STUDENT.full)}
              </span>
            </div>

            <SmartLink href={paths.tour} className="btn btn-member st-cta">
              Arrange the conversation <span className="btn-bubble"><Icon.arrow /></span>
            </SmartLink>
            <span className="st-note">
              No card needed today. The rate starts the day it is agreed.
            </span>
          </motion.div>

          <motion.div
            className="st-hero-img"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            <Img src={STUDENT_IMG} alt="" sizes="(max-width: 980px) 100vw, 44vw" loading="eager" />
          </motion.div>
        </div>
      </header>

      {/* ── what you get ─────────────────────────────────────────────── */}
      <section className="section st-gets">
        <div className="shell st-gets-grid">
          <h2 className="h-md st-h">What it includes.</h2>
          <motion.ul
            className="st-list"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          >
            {STUDENT.includes.map((item) => (
              <motion.li key={item} variants={rise}>
                <span className="st-check"><Icon.check /></span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ── the conditions, stated plainly ───────────────────────────── */}
      <section className="st-terms">
        <div className="shell">
          <h2 className="h-md st-h st-h-light">Three conditions.</h2>
          <div className="st-terms-grid">
            {STUDENT.conditions.map((c, i) => (
              <motion.article
                className="st-term"
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease, delay: Math.min(i * 0.08, 0.3) }}
              >
                <span className="st-term-n">{i + 1}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── how to get it ────────────────────────────────────────────── */}
      <section className="section st-how">
        <div className="shell">
          <h2 className="h-md st-h">How to get it.</h2>
          <ol className="st-steps">
            {STUDENT.steps.map((s) => (
              <li className="st-step" key={s.n}>
                <span className="st-step-n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="st-end">
            <p>
              The conversation happens on any private tour, or by arrangement at
              the desk. Bring a student card and fifteen minutes.
            </p>
            <div className="st-end-actions">
              <SmartLink href={paths.tour} className="btn btn-member">
                See tour dates <span className="btn-bubble"><Icon.arrow /></span>
              </SmartLink>
              <SmartLink href={paths.memberships} className="btn btn-light">
                Compare full tiers
              </SmartLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
