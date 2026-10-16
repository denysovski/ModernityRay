import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, Img, SmartLink } from '../components/ui'
import { CALENDAR, EVENT_CATEGORIES, courtBySlug } from '../data'
import { useStore } from '../context/StoreContext'
import { byDate, formatDateRange, hasEnded, monthKey, monthLabel } from '../lib/format'
import { paths } from '../routes'

/* View 6 of 9 — the members' calendar.
 *
 * The data-heaviest view: a category filter, a free-text search, a
 * past/upcoming toggle and month grouping, all derived from one array in
 * src/data/events.js in a single useMemo. Nothing is copied into state except
 * the three controls, which is what keeps the filters composable — any
 * combination of them works without a special case.
 */

const ease = [0.22, 1, 0.36, 1]

export default function Events() {
  const { add, openCart, money } = useStore()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [showPast, setShowPast] = useState(false)

  useEffect(() => {
    document.title = 'What’s on — CourtSy'
  }, [])

  const { months, total } = useMemo(() => {
    const now = new Date()
    const q = query.trim().toLowerCase()

    const matching = CALENDAR.filter((e) => {
      if (category !== 'All' && e.category !== category) return false
      if (!showPast && hasEnded(e, now)) return false
      if (!q) return true
      const venue = courtBySlug(e.venue)?.name ?? ''
      return [e.title, e.desc, e.category, venue].join(' ').toLowerCase().includes(q)
    }).sort(byDate)

    // group into months, preserving chronological order
    const grouped = new Map()
    for (const event of matching) {
      const key = monthKey(event.start)
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key).push(event)
    }

    return { months: [...grouped.entries()], total: matching.length }
  }, [category, query, showPast])

  const reserve = (event) => {
    if (event.price === 0) return
    add({
      id: `event-${event.slug}`,
      name: event.title,
      meta: formatDateRange(event.start, event.end),
      price: event.price,
      shipped: false,
    })
    openCart()
  }

  const chips = ['All', ...EVENT_CATEGORIES]

  return (
    <main className="pg">
      <PageHeader
        label="What’s on"
        title="The season, in order."
        lede="Tournaments, ladders, clinics, socials and one retreat — every date in the members’ calendar, grouped by month."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Events' }]}
        aside={
          <label className="court-search">
            <Icon.search className="court-search-ic" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, venues…"
              aria-label="Search events"
            />
          </label>
        }
      />

      <section className="section pg-section">
        <div className="shell">
          <div className="tier-controls">
            <div className="tier-filters" role="group" aria-label="Filter by category">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip-btn ${category === c ? 'on' : ''}`}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={showPast}
                onChange={(e) => setShowPast(e.target.checked)}
              />
              <span className="switch-track"><span className="switch-dot" /></span>
              Include past dates
            </label>
          </div>

          <p className="tier-count" aria-live="polite">
            {total} {total === 1 ? 'date' : 'dates'}
            {category !== 'All' && ` in ${category}`}
          </p>

          {months.map(([key, list]) => (
            <div className="cal-month" key={key}>
              <h2 className="cal-month-h">
                <span>{monthLabel(key)}</span>
                <span className="cal-month-n">{list.length}</span>
              </h2>

              <div className="cal-rows">
                {list.map((event, i) => {
                  const venue = courtBySlug(event.venue)
                  const past = hasEnded(event)
                  const nearlyFull = event.spots <= 8
                  return (
                    <motion.article
                      className={`cal-row ${past ? 'is-past' : ''}`}
                      key={event.slug}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, ease, delay: Math.min(i * 0.05, 0.25) }}
                    >
                      <SmartLink href={paths.event(event.slug)} className="cal-row-img">
                        <Img src={event.img} alt="" sizes="(max-width: 620px) 100vw, 180px" />
                      </SmartLink>

                      <div className="cal-row-main">
                        <div className="cal-row-meta">
                          <span className="cal-cat">{event.category}</span>
                          <span className="cal-date">{formatDateRange(event.start, event.end)}</span>
                          {past && <span className="cal-past">Finished</span>}
                        </div>
                        <h3 className="cal-row-title">
                          <SmartLink href={paths.event(event.slug)}>{event.title}</SmartLink>
                        </h3>
                        <p className="cal-row-desc">{event.desc}</p>
                        <div className="cal-row-facts">
                          {venue && (
                            <SmartLink href={paths.court(venue.slug)} className="cal-fact">
                              <Icon.pin /> {venue.name}
                            </SmartLink>
                          )}
                          <span className={`cal-fact ${nearlyFull ? 'is-warn' : ''}`}>
                            <Icon.members /> {event.spots} {event.spots === 1 ? 'place' : 'places'} left
                          </span>
                        </div>
                      </div>

                      <div className="cal-row-buy">
                        <span className="cal-price">
                          {event.price === 0 ? 'Included' : money(event.price)}
                        </span>
                        {event.price === 0 ? (
                          <SmartLink href={paths.event(event.slug)} className="btn btn-light">
                            {event.cta}
                          </SmartLink>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-member"
                            onClick={() => reserve(event)}
                            disabled={past}
                          >
                            {event.cta} <span className="btn-bubble"><Icon.arrow /></span>
                          </button>
                        )}
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>
          ))}

          {total === 0 && (
            <p className="pg-empty">
              Nothing on in that category.{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => { setCategory('All'); setQuery(''); setShowPast(true) }}
              >
                Show the whole calendar
              </button>
              .
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
