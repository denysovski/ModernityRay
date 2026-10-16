import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon, Img, SmartLink } from '../components/ui'
import { TIERS, JOIN_STEPS, JOIN_ANSWERS, JOIN_FACES, JOIN_IMG } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'

/* View 10 — what joining actually means.
 *
 * The tier list answers "how much". This page answers the questions that
 * come before that one: what you are joining, how it works, and what
 * happens if it does not suit you. It ends by handing over to the tiers
 * rather than trying to sell one.
 */

const ease = [0.22, 1, 0.36, 1]

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export default function Join() {
  const { money } = useStore()

  useEffect(() => {
    document.title = 'Become a member — CourtSy'
  }, [])

  const cheapest = Math.min(...TIERS.map((t) => t.price))

  return (
    <main className="jn">
      <header className="jn-hero">
        <Img src={JOIN_IMG} alt="" sizes="100vw" loading="eager" fetchPriority="high" className="jn-hero-img" />
        <span className="jn-hero-scrim" />
        <div className="shell jn-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="jn-hero-text"
          >
            <span className="micro micro-dark">
              <Icon.star className="deco-star deco-star-light" /> Becoming a member
            </span>
            <h1 className="jn-title">A club, not a gym.</h1>
            <p className="jn-lede">
              Courts, greens, coaching and recovery, kept to one standard and
              open to the people who use them. Here is what that means before
              you look at a price.
            </p>
            <div className="jn-faces-row">
              <div className="jn-faces">
                {JOIN_FACES.map((src) => (
                  <img key={src} src={src} alt="" width="40" height="40" loading="lazy" />
                ))}
              </div>
              <span>5,000+ people train here every week</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── what you are joining ─────────────────────────────────────── */}
      <section className="section jn-what">
        <div className="shell jn-what-grid">
          <h2 className="h-md jn-h">What you are joining.</h2>
          <div className="jn-what-text">
            <p>
              One set of grounds: five facilities, eighty-five coaches and a
              calendar that runs all year. Every tier opens the same gates. What
              changes between them is how often you come, how far ahead you can
              book, and how many people you bring.
            </p>
            <p>
              There is no joining fee on any tier, and nothing is sold as an
              add-on. Coaching, the recovery suite and the members&rsquo;
              calendar are included wherever they are included at all.
            </p>
          </div>
        </div>
      </section>

      {/* ── how it works ─────────────────────────────────────────────── */}
      <section className="jn-steps-wrap">
        <div className="shell">
          <h2 className="h-md jn-h">How it works.</h2>
          <motion.ol
            className="jn-steps"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-70px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            {JOIN_STEPS.map((s) => (
              <motion.li className="jn-step" key={s.n} variants={rise}>
                <span className="jn-step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ── the tiers, briefly ───────────────────────────────────────── */}
      <section className="section jn-tiers-wrap">
        <div className="shell">
          <div className="jn-tiers-head">
            <h2 className="h-md jn-h">Five tiers.</h2>
            <p className="lede">
              From {money(cheapest)} for a single day to ten transferable seats
              for a team.
            </p>
          </div>
          <div className="jn-tiers">
            {TIERS.map((t) => (
              <SmartLink className="jn-tier" href={paths.membership(t.slug)} key={t.slug}>
                <span className="jn-tier-name">{t.name}</span>
                <span className="jn-tier-line">{t.line}</span>
                <span className="jn-tier-foot">
                  <span className="jn-tier-price">
                    {money(t.price)} <span>{t.cadence}</span>
                  </span>
                  <Icon.arrowUR className="jn-tier-go" />
                </span>
              </SmartLink>
            ))}
          </div>
          <div className="jn-tiers-cta">
            <SmartLink href={paths.memberships} className="btn btn-member">
              Compare them properly <span className="btn-bubble"><Icon.arrow /></span>
            </SmartLink>
          </div>
        </div>
      </section>

      {/* ── what people ask ──────────────────────────────────────────── */}
      <section className="section jn-ask-wrap">
        <div className="shell jn-ask-grid">
          <h2 className="h-md jn-h">What people ask.</h2>
          <dl className="jn-ask">
            {JOIN_ANSWERS.map((item, i) => (
              <motion.div
                className="jn-ask-item"
                key={item.q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease, delay: Math.min(i * 0.06, 0.3) }}
              >
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── before you decide ────────────────────────────────────────── */}
      <section className="section jn-next">
        <div className="shell jn-next-grid">
          <SmartLink className="jn-next-card" href={paths.tour}>
            <span className="jn-next-label">Not sure yet</span>
            <h3>Book a private tour</h3>
            <p>An hour on foot with someone who works here. Nothing to sign.</p>
            <Icon.arrowUR className="jn-next-go" />
          </SmartLink>
          <SmartLink className="jn-next-card" href={paths.students}>
            <span className="jn-next-label">Studying</span>
            <h3>Student membership</h3>
            <p>A reduced rate, agreed in person, for anyone with a student card.</p>
            <Icon.arrowUR className="jn-next-go" />
          </SmartLink>
          <SmartLink className="jn-next-card" href={paths.gift}>
            <span className="jn-next-label">For someone else</span>
            <h3>Gift a day pass</h3>
            <p>Vouchers from $50, spendable on anything at the club.</p>
            <Icon.arrowUR className="jn-next-go" />
          </SmartLink>
        </div>
      </section>
    </main>
  )
}
