import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon, Img, SmartLink } from '../components/ui'
import { PROGRAMMES, programmeBySlug, coachById, courtBySlug } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'
import NotFound from './NotFound'

/* View 11 — one training programme.
 *
 * A third layout again, on purpose. The facility pages lead with photography
 * and the membership pages lead with a promise; a programme is a plan, so
 * this one is built as a split: a sticky rail on the left that holds the
 * price and the facts while you read, and the plan itself scrolling past it
 * on the right. Underneath, the coaches who actually run it.
 */

const ease = [0.22, 1, 0.36, 1]

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export default function ProgrammeDetail() {
  const { slug } = useParams()
  const programme = programmeBySlug(slug)
  const { add, openCart, money } = useStore()

  useEffect(() => {
    document.title = programme
      ? `${programme.title} — CourtSy`
      : 'Not found — CourtSy'
  }, [programme])

  if (!programme) return <NotFound what="programme" />

  const venue = programme.venue ? courtBySlug(programme.venue) : null
  const coaches = programme.coaches.map(coachById).filter(Boolean)
  const others = PROGRAMMES.filter((p) => p.slug !== programme.slug).slice(0, 3)

  const enrol = () => {
    // a programme is a service, so nothing is posted — shipped: false keeps
    // the flat delivery fee off a basket of coaching alone
    add({
      id: `programme-${programme.slug}`,
      name: programme.title,
      meta: programme.meta,
      price: programme.price,
      shipped: false,
    })
    openCart()
  }

  return (
    <main className="prgd">
      {/* ── banner ───────────────────────────────────────────────────── */}
      <header className="prgd-hero">
        <Img
          src={programme.img}
          alt=""
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="prgd-hero-img"
        />
        <span className="prgd-hero-scrim" />
        <div className="shell prgd-hero-inner">
          <nav className="pg-crumbs prgd-crumbs" aria-label="Breadcrumb">
            <span className="pg-crumb">
              <SmartLink href={paths.home}>Home</SmartLink>
              <Icon.chevron className="pg-crumb-sep" />
            </span>
            <span className="pg-crumb">
              <SmartLink href={paths.programmes}>Programmes</SmartLink>
              <Icon.chevron className="pg-crumb-sep" />
            </span>
            <span className="pg-crumb">
              <span aria-current="page">{programme.title}</span>
            </span>
          </nav>

          <motion.div initial="hidden" animate="show" variants={rise}>
            <span className="prgd-tag">{programme.tag}</span>
            <h1 className="prgd-title">{programme.title}</h1>
            <p className="prgd-lede">{programme.lede}</p>
          </motion.div>
        </div>
      </header>

      {/* ── the split: sticky facts, scrolling plan ──────────────────── */}
      <section className="prgd-split">
        <div className="shell prgd-split-grid">
          <aside className="prgd-rail">
            <div className="prgd-rail-card">
              <span className="prgd-rail-pre">From</span>
              <div className="prgd-rail-amount">
                <span className="display">{money(programme.price)}</span>
                <span>per month</span>
              </div>
              <button type="button" className="btn btn-member prgd-rail-cta" onClick={enrol}>
                Join this programme <span className="btn-bubble"><Icon.plus /></span>
              </button>
              <span className="prgd-rail-note">
                Billed monthly · leave at the end of any block
              </span>

              <dl className="prgd-rail-facts">
                {programme.facts.map((f) => (
                  <div className="prgd-rail-fact" key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
                <div className="prgd-rail-fact">
                  <dt>Level</dt>
                  <dd>{programme.level}</dd>
                </div>
                {venue && (
                  <div className="prgd-rail-fact">
                    <dt>Where</dt>
                    <dd>
                      <SmartLink href={paths.court(venue.slug)} className="prgd-rail-venue">
                        {venue.name} <Icon.arrowUR />
                      </SmartLink>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>

          <div className="prgd-main">
            <div className="prgd-read">
              {programme.body.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                  className={i === 0 ? 'prgd-read-first' : undefined}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* the block, as a vertical timeline */}
            <h2 className="h-md prgd-h">How the block runs.</h2>
            <ol className="prgd-steps">
              {programme.weeks.map((w, i) => (
                <motion.li
                  className="prgd-step"
                  key={w.n}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease, delay: Math.min(i * 0.08, 0.3) }}
                >
                  <span className="prgd-step-n">{w.n}</span>
                  <div className="prgd-step-text">
                    <h3>{w.title}</h3>
                    <p>{w.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            {/* information cards */}
            <h2 className="h-md prgd-h">Worth knowing.</h2>
            <div className="prgd-cards">
              {programme.cards.map((c, i) => (
                <motion.div
                  className="prgd-card"
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease, delay: Math.min(i * 0.08, 0.3) }}
                >
                  <span className="prgd-card-ic"><Icon.spark /></span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── introducing the coaches ──────────────────────────────────── */}
      <section className="section prgd-coaches" id="coaches">
        <div className="shell">
          <div className="prgd-coaches-head">
            <span className="micro"><Icon.star className="deco-star" /> Introducing the coaches</span>
            <h2 className="h-lg">Who runs it.</h2>
          </div>
          <div className="prgd-coach-row">
            {coaches.map((c, i) => (
              <motion.article
                className="prgd-coach"
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease, delay: i * 0.1 }}
              >
                <img src={c.img} alt={c.name} loading="lazy" />
                <div className="prgd-coach-text">
                  <span className="prgd-coach-role">{c.role}</span>
                  <h3>{c.name}</h3>
                  <p>{c.bio}</p>
                  <ul className="coach-badges">
                    {c.badges.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
          <SmartLink href={`${paths.programmes}#coaches`} className="btn btn-light prgd-coach-all">
            Meet the whole coaching team <Icon.arrow />
          </SmartLink>
        </div>
      </section>

      {/* ── keep reading ─────────────────────────────────────────────── */}
      <section className="section prgd-next">
        <div className="shell">
          <h2 className="h-md prgd-h">Other programmes.</h2>
          <div className="prgd-next-grid">
            {others.map((p) => (
              <SmartLink className="prgd-next-card" href={paths.programme(p.slug)} key={p.slug}>
                <Img src={p.img} alt="" sizes="(max-width: 760px) 100vw, 360px" />
                <span className="prgd-next-scrim" />
                <span className="prgd-next-body">
                  <span className="prgd-next-chip">{p.discipline}</span>
                  <strong>{p.title}</strong>
                  <span>{p.meta}</span>
                </span>
                <span className="prgd-next-go"><Icon.arrowUR /></span>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
