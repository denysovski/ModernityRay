import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { CoachSocials, Icon, Img, SmartLink } from '../components/ui'
import { PROGRAMMES, DISCIPLINES, COACHES_BY_JOINED } from '../data'
import { useStore } from '../context/StoreContext'
import { monthLabel } from '../lib/format'
import { paths } from '../routes'

/* View 10 — every training programme the club runs.
 *
 * Deliberately not another three-up card grid: the programmes are a list you
 * read down, so this is an editorial index — a numbered row per programme,
 * the photograph revealed on hover, and the coaching team underneath. The
 * detail pages then use a different layout again.
 */

const ease = [0.22, 1, 0.36, 1]

export default function Programmes() {
  const { money } = useStore()
  const [discipline, setDiscipline] = useState('All')

  useEffect(() => {
    document.title = 'Training programmes — CourtSy'
  }, [])

  const shown = useMemo(
    () =>
      discipline === 'All'
        ? PROGRAMMES
        : PROGRAMMES.filter((p) => p.discipline === discipline),
    [discipline],
  )

  const groups = ['All', ...DISCIPLINES]

  /* The coaching timeline groups by hiring month, so two people who started
     in the same month share one date and one node on the spine. COACHES_BY_JOINED
     is already in order, so a plain reduce preserves it. */
  const intake = useMemo(() => {
    const byMonth = new Map()
    for (const coach of COACHES_BY_JOINED) {
      if (!byMonth.has(coach.joined)) byMonth.set(coach.joined, [])
      byMonth.get(coach.joined).push(coach)
    }
    return [...byMonth.entries()]
  }, [])

  return (
    <main className="pg pr-page">
      <PageHeader
        label="Coached training"
        title="Training programmes we offer."
        lede="Nine programmes, eight coaches and one rule — every block starts with a measurement and ends with the same measurement repeated. Pick the one that matches what you are trying to change."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Programmes' }]}
        aside={
          <div className="pg-stat-card">
            <span className="pg-stat-n display">{PROGRAMMES.length}</span>
            <span className="pg-stat-l">programmes, across five disciplines</span>
            <span className="pg-stat-sub">Included or discounted on every tier</span>
          </div>
        }
      />

      <section className="section pg-section">
        <div className="shell">
          <div className="tier-controls">
            <div className="tier-filters" role="group" aria-label="Filter by discipline">
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`chip-btn ${discipline === g ? 'on' : ''}`}
                  onClick={() => setDiscipline(g)}
                  aria-pressed={discipline === g}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="tier-count prg-count" aria-live="polite">
              {shown.length} {shown.length === 1 ? 'programme' : 'programmes'}
            </p>
          </div>

          {/* The index itself: a row per programme, numbered, with the
              photograph sliding in from the right on hover. */}
          <ol className="prg-list">
            {shown.map((p, i) => (
              <motion.li
                className="prg-row"
                key={p.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: Math.min(i * 0.05, 0.3) }}
              >
                <SmartLink href={paths.programme(p.slug)} className="prg-row-link">
                  <span className="prg-row-n">{i + 1}</span>
                  <span className="prg-row-main">
                    <span className="prg-row-title">{p.title}</span>
                    <span className="prg-row-desc">{p.desc}</span>
                  </span>
                  <span className="prg-row-meta">
                    <span className="prg-row-chip">{p.discipline}</span>
                    <span className="prg-row-cadence">{p.meta}</span>
                  </span>
                  <span className="prg-row-price">
                    {money(p.price)} <span>/ mo</span>
                  </span>
                  <span className="prg-row-go"><Icon.arrowUR /></span>
                  <span className="prg-row-img" aria-hidden="true">
                    <Img src={p.img} alt="" sizes="260px" />
                  </span>
                </SmartLink>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── the coaching team ──────────────────────────────────────────── */}
      <section className="section prg-coaches-wrap" id="coaches">
        <div className="shell">
          <div className="prg-coaches-head">
            <span className="micro"><Icon.star className="deco-star" /> Introducing the coaches</span>
            <h2 className="h-lg">The people you need.</h2>
            <p className="lede">
              Eight full-time coaches, all of them on the floor rather than in
              an office. You will be handed to one of them in your first week
              and you will keep them.
            </p>
          </div>

          {/* The team as a hiring timeline: a spine down the centre of the
              page, a dated node per intake, and the people alternating
              either side of it. Each date is a group, so two coaches hired
              in the same month share one node and stack under it rather
              than repeating the heading. */}
          <ol className="ctl">
            <span className="ctl-spine" aria-hidden="true" />

            {intake.map(([joined, people], gi) => (
              <motion.li
                className={`ctl-group ctl-${gi % 2 === 0 ? 'left' : 'right'}`}
                key={joined}
                initial={{ opacity: 0, x: gi % 2 === 0 ? -34 : 34, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, ease }}
              >
                <motion.span
                  className="ctl-node"
                  aria-hidden="true"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, ease, delay: 0.1 }}
                />
                <span className="ctl-date">{monthLabel(joined)}</span>

                <div className="ctl-cards">
                  {people.map((c) => (
                    <article className="ctl-card" key={c.id}>
                      <span className="ctl-avatar">
                        <img src={c.img} alt={c.name} loading="lazy" />
                      </span>
                      <div className="ctl-text">
                        <h3>{c.name}</h3>
                        <span className="ctl-role">{c.role}</span>
                        <CoachSocials socials={c.socials} name={c.name} />
                      </div>
                    </article>
                  ))}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section prg-cta-wrap">
        <div className="shell prg-cta">
          <div>
            <h2 className="h-md">Not sure which block you want?</h2>
            <p>
              Book an hour with a coach before you choose. They will put you
              through the same assessment every programme opens with, and tell
              you honestly which one it points at.
            </p>
          </div>
          <div className="prg-cta-actions">
            <SmartLink href={paths.tour} className="btn btn-green">
              Book a private tour
            </SmartLink>
            <SmartLink href={paths.memberships} className="btn btn-light">
              See the tiers <Icon.arrow />
            </SmartLink>
          </div>
        </div>
      </section>
    </main>
  )
}
