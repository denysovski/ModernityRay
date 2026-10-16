import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { Icon, Showcase, SmartLink } from '../components/ui'
import { COURTS, courtBySlug, CALENDAR } from '../data'
import { useStore } from '../context/StoreContext'
import { formatDateRange, byDate } from '../lib/format'
import { paths } from '../routes'
import NotFound from './NotFound'

/* View 5 of 9 — one facility, with its bookable sessions.
 *
 * Shows the cross-link between two data sets: the events calendar stores a
 * venue slug, so this view lists what is happening on this court without the
 * court data having to know about events at all.
 */

export default function CourtDetail() {
  const { slug } = useParams()
  const court = courtBySlug(slug)
  const { add, openCart, money } = useStore()

  useEffect(() => {
    document.title = court ? `${court.name} — CourtSy` : 'Not found — CourtSy'
  }, [court])

  if (!court) return <NotFound what="facility" />

  const here = CALENDAR.filter((e) => e.venue === court.slug).sort(byDate)
  const others = COURTS.filter((c) => c.slug !== court.slug)

  const book = (session) => {
    // sessions are a service, so nothing is posted — shipped: false keeps the
    // flat delivery fee off a basket of bookings only
    add({ ...session, shipped: false })
    openCart()
  }

  return (
    <main className="pg">
      <PageHeader
        label={court.surface}
        title={court.name}
        lede={court.tagline}
        crumbs={[
          { label: 'Home', href: paths.home },
          { label: 'Courts', href: paths.courts },
          { label: court.name },
        ]}
      />

      <section className="pg-section">
        <div className="shell">
          <Showcase slides={court.gallery} name={court.name} />

          <div className="detail-grid">
            <div className="detail-main">
              <p className="court-desc lede">{court.desc}</p>

              <h2 className="h-md detail-h">Book a session</h2>
              <div className="court-sessions">
                {court.sessions.map((s) => (
                  <div className="court-session" key={s.id}>
                    <div className="court-session-text">
                      <strong>{s.name}</strong>
                      <span>{s.meta}</span>
                    </div>
                    <span className="court-session-price">{money(s.price)}</span>
                    <button type="button" className="btn btn-member" onClick={() => book(s)}>
                      Add <span className="btn-bubble"><Icon.plus /></span>
                    </button>
                  </div>
                ))}
              </div>

              {here.length > 0 && (
                <>
                  <h2 className="h-md detail-h">Coming up here</h2>
                  <div className="court-events">
                    {here.map((e) => (
                      <SmartLink className="court-event" href={paths.event(e.slug)} key={e.slug}>
                        <span className="court-event-cat">{e.category}</span>
                        <span className="court-event-text">
                          <strong>{e.title}</strong>
                          <span>{formatDateRange(e.start, e.end)}</span>
                        </span>
                        <Icon.arrowUR className="court-event-go" />
                      </SmartLink>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="detail-side">
              <h3 className="detail-side-h">Specification</h3>
              <dl className="detail-specs">
                {court.specs.map((s) => (
                  <div className="detail-spec" key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="detail-side-h">Elsewhere on the grounds</h3>
              <div className="detail-others">
                {others.map((o) => (
                  <SmartLink className="detail-other" href={paths.court(o.slug)} key={o.slug}>
                    <span className="detail-other-text">
                      <strong>{o.name}</strong>
                      <span>{o.surface}</span>
                    </span>
                    <Icon.arrowUR className="detail-other-go" />
                  </SmartLink>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
