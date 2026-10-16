import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, Img, SmartLink } from '../components/ui'
import { COURTS } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'

/* View 4 of 9 — the facilities index.
 *
 * A searchable overview over the same list/detail shape as memberships. The
 * search box filters on name, surface and description, and the result is
 * derived with useMemo so typing does not rebuild the list on unrelated
 * renders.
 */

const ease = [0.22, 1, 0.36, 1]

export default function Courts() {
  const { money } = useStore()
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = 'Courts & facilities — CourtSy'
  }, [])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COURTS
    return COURTS.filter((c) =>
      [c.name, c.surface, c.tagline, c.desc].join(' ').toLowerCase().includes(q),
    )
  }, [query])

  const cheapest = (court) => Math.min(...court.sessions.map((s) => s.price))

  return (
    <main className="pg">
      <PageHeader
        label="The grounds"
        title="Five places to play."
        lede="Clay, hard court, eighteen holes, eight lifting platforms and a heated pool — every surface kept to the same standard, and all of it bookable by the hour."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Courts' }]}
        aside={
          <label className="court-search">
            <Icon.search className="court-search-ic" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search surfaces, facilities…"
              aria-label="Search facilities"
            />
          </label>
        }
      />

      <section className="section pg-section">
        <div className="shell">
          <p className="tier-count" aria-live="polite">
            {shown.length === COURTS.length
              ? `${COURTS.length} facilities`
              : `${shown.length} of ${COURTS.length} facilities match “${query.trim()}”`}
          </p>

          <div className="court-grid">
            {shown.map((court) => (
              <motion.article
                className="court-card"
                key={court.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, ease }}
              >
                <SmartLink href={paths.court(court.slug)} className="court-card-link">
                  <div className="court-card-img">
                    <Img src={court.img} alt={court.name} sizes="(max-width: 700px) 100vw, 440px" />
                    <span className="court-card-scrim" />
                    <span className="court-card-tag">{court.surface}</span>
                  </div>
                  <div className="court-card-body">
                    <div className="court-card-text">
                      <h2>{court.name}</h2>
                      <span className="court-card-tagline">{court.tagline}</span>
                    </div>
                    <span className="court-card-go"><Icon.arrowUR /></span>
                  </div>
                </SmartLink>
                <div className="court-card-foot">
                  <span className="court-card-from">
                    From <strong>{money(cheapest(court))}</strong>
                  </span>
                  <SmartLink href={paths.court(court.slug)} className="btn btn-light court-card-btn">
                    Book a session
                  </SmartLink>
                </div>
              </motion.article>
            ))}
          </div>

          {shown.length === 0 && (
            <p className="pg-empty">
              Nothing matches that search.{' '}
              <button type="button" className="link-btn" onClick={() => setQuery('')}>
                Clear it
              </button>{' '}
              to see all five facilities.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
