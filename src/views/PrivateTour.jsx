import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import Field from '../components/commerce/Field'
import { Icon, SmartLink, useSeo } from '../components/ui'
import { TOURS, TOUR_STEPS } from '../data'
import { useStore } from '../context/StoreContext'
import { formatDate } from '../lib/format'
import { validateName } from '../lib/validation'
import { paths } from '../routes'

/* View 11 — booking a look round before you join.
 *
 * A list of dates, each a small group with a host. Putting your name down
 * costs nothing: no card, no checkout. The fee is paid at the desk on the
 * day, so this page deliberately has no basket in it.
 *
 * Enrolments are held in localStorage next to everything else, so the list
 * remembers you after a reload and the remaining places go down.
 */

const ease = [0.22, 1, 0.36, 1]
const STORAGE_KEY = 'courtsy.tours'

/** Reads the enrolments, tolerating a blocked or corrupted store. */
const readEnrolled = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeEnrolled = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* private mode: the list simply will not survive a reload */
  }
}

export default function PrivateTour() {
  const { user } = useStore()
  const [enrolled, setEnrolled] = useState(readEnrolled)
  const [openSlot, setOpenSlot] = useState(null)
  const [name, setName] = useState(user?.name || '')
  const [submitted, setSubmitted] = useState(false)
  useSeo({
    title: 'Book a Private Tour',
    description:
      'See CourtSy before you join. An hour on foot with someone who works here, in a small group, for $20 paid at the desk. No card and no commitment.',
  })

  const error = useMemo(() => validateName(name), [name])

  const start = (id) => {
    setOpenSlot((current) => (current === id ? null : id))
    setSubmitted(false)
    setName(user?.name || '')
  }

  const enrol = (slot) => (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (error) return

    const next = { ...enrolled, [slot.id]: name.trim() }
    setEnrolled(next)
    writeEnrolled(next)
    setOpenSlot(null)
    setSubmitted(false)
  }

  const cancel = (id) => {
    const next = { ...enrolled }
    delete next[id]
    setEnrolled(next)
    writeEnrolled(next)
  }

  const mine = Object.keys(enrolled).length

  return (
    <main className="pg">
      <PageHeader
        label="Before you join"
        title="Come and look round first."
        lede="An hour on foot with someone who works here, in a small group of people deciding the same thing you are. Rackets and a court are held for every tour."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Private tour' }]}
        aside={
          <div className="pg-stat-card">
            <span className="pg-stat-n display">$20</span>
            <span className="pg-stat-l">paid at the desk on the day</span>
            <span className="pg-stat-sub">
              Comes off your first month if you join. Nothing is taken now.
            </span>
          </div>
        }
      />

      {/* ── how a tour goes ──────────────────────────────────────────── */}
      <section className="pg-section tour-steps-wrap">
        <div className="shell">
          <div className="tour-steps">
            {TOUR_STEPS.map((s, i) => (
              <motion.div
                className="tour-step"
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, ease, delay: Math.min(i * 0.07, 0.3) }}
              >
                <span className="tour-step-n">{i + 1}</span>
                <h2>{s.title}</h2>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── the dates ────────────────────────────────────────────────── */}
      <section className="section pg-section">
        <div className="shell">
          <div className="tour-head">
            <h2 className="h-md">Pick a date.</h2>
            <p className="tier-count" aria-live="polite">
              {mine === 0
                ? `${TOURS.length} tours scheduled`
                : `You are on ${mine} ${mine === 1 ? 'list' : 'lists'}`}
            </p>
          </div>

          <div className="tour-list">
            {TOURS.map((slot) => {
              const joined = Boolean(enrolled[slot.id])
              const taken = slot.taken + (joined ? 1 : 0)
              const left = Math.max(slot.places - taken, 0)
              const full = left === 0 && !joined
              const open = openSlot === slot.id

              return (
                <article className={`tour ${joined ? 'is-joined' : ''}`} key={slot.id}>
                  <div className="tour-when">
                    <span className="tour-date">{formatDate(slot.date)}</span>
                    <span className="tour-time">{slot.time}</span>
                  </div>

                  <div className="tour-main">
                    <h3 className="tour-host">
                      {slot.host} <span>{slot.role}</span>
                    </h3>
                    <p className="tour-focus">{slot.focus}</p>

                    {/* who is already coming, as a row of places */}
                    <div className="tour-places" aria-hidden="true">
                      {Array.from({ length: slot.places }, (_, i) => (
                        <span key={i} className={`tour-place ${i < taken ? 'on' : ''}`} />
                      ))}
                    </div>
                    <span className="tour-left">
                      {full ? 'This tour is full' : `${left} of ${slot.places} places left`}
                    </span>
                  </div>

                  <div className="tour-act">
                    {joined ? (
                      <>
                        <span className="tour-badge">
                          <Icon.check /> {enrolled[slot.id]}
                        </span>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => cancel(slot.id)}
                        >
                          Take me off
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-member"
                        onClick={() => start(slot.id)}
                        disabled={full}
                      >
                        {open ? 'Close' : 'Enroll'}
                        <span className="btn-bubble"><Icon.arrow /></span>
                      </button>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {open && !joined && (
                      <motion.form
                        className="tour-form"
                        onSubmit={enrol(slot)}
                        noValidate
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        <div className="tour-form-inner">
                          <Field
                            label="Your name for the list"
                            name="name"
                            autoComplete="name"
                            placeholder="Jane Doe"
                            value={name}
                            onChange={setName}
                            error={error}
                            show={submitted}
                            hint="No card, no deposit. Pay the $20 at the desk when you arrive."
                          />
                          <button type="submit" className="btn btn-green">
                            Put me on the list
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </article>
              )
            })}
          </div>

          <p className="tour-foot">
            Would rather just play? A{' '}
            <SmartLink href={paths.membership('day-pass')}>day pass</SmartLink> gives you the
            run of the club for a day, with no tour attached.
          </p>
        </div>
      </section>
    </main>
  )
}
