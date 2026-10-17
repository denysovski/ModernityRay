import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, Img, SmartLink, useSeo } from '../components/ui'
import { CALENDAR, courtBySlug, eventBySlug, describe } from '../data'
import { useStore } from '../context/StoreContext'
import { byDate, formatDate, formatDateRange, hasEnded } from '../lib/format'
import { paths } from '../routes'
import NotFound from './NotFound'

/* View 7 of 9 — a single calendar entry. */

const ease = [0.22, 1, 0.36, 1]

export default function EventDetail() {
  const { slug } = useParams()
  const event = eventBySlug(slug)
  const { add, openCart, money } = useStore()

  useSeo({
    title: event ? event.title : 'Event Not Found',
    description: event
      ? `${formatDateRange(event.start, event.end)} at CourtSy. ${event.desc}`
      : 'That date is not in the calendar. See everything on at CourtSy.',
    image: event?.img,
    // a dated, one-off happening is the textbook og:type article
    type: 'article',
    noindex: !event,
  })

  if (!event) return <NotFound what="event" />

  const venue = courtBySlug(event.venue)
  const past = hasEnded(event)
  const free = event.price === 0
  const alsoOn = CALENDAR.filter((e) => e.slug !== event.slug && e.category === event.category)
    .sort(byDate)
    .slice(0, 3)

  const reserve = () => {
    add({
      id: `event-${event.slug}`,
      name: event.title,
      meta: formatDateRange(event.start, event.end),
      price: event.price,
      shipped: false,
    })
    openCart()
  }

  return (
    <main className="pg">
      <PageHeader
        label={event.category}
        title={event.title}
        lede={formatDateRange(event.start, event.end)}
        crumbs={[
          { label: 'Home', href: paths.home },
          { label: 'Events', href: paths.events },
          { label: event.title },
        ]}
        aside={
          <div className="detail-buy">
            <div className="detail-buy-amount">
              <span className="display">{free ? 'Included' : money(event.price)}</span>
              <span>{free ? 'with every membership' : 'per entry'}</span>
            </div>
            {past ? (
              <span className="detail-buy-closed">This date has passed.</span>
            ) : free ? (
              <SmartLink href={paths.memberships} className="btn btn-member detail-buy-cta">
                See memberships <span className="btn-bubble"><Icon.arrow /></span>
              </SmartLink>
            ) : (
              <button type="button" className="btn btn-member detail-buy-cta" onClick={reserve}>
                {event.cta} <span className="btn-bubble"><Icon.arrow /></span>
              </button>
            )}
            <span className="detail-buy-note">
              {event.spots} {event.spots === 1 ? 'place' : 'places'} remaining
            </span>
          </div>
        }
      />

      <section className="pg-section">
        <div className="shell">
          <motion.div
            className="detail-banner"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease }}
          >
            <Img
              src={event.img}
              alt={describe(event.img)}
              sizes="(max-width: 1440px) 100vw, 1440px"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          <div className="detail-grid">
            <div className="detail-main">
              <p className="court-desc lede">{event.desc}</p>

              <h2 className="h-md detail-h">Also in {event.category.toLowerCase()}</h2>
              <div className="court-events">
                {alsoOn.map((e) => (
                  <SmartLink className="court-event" href={paths.event(e.slug)} key={e.slug}>
                    <span className="court-event-cat">{e.category}</span>
                    <span className="court-event-text">
                      <strong>{e.title}</strong>
                      <span>{formatDateRange(e.start, e.end)}</span>
                    </span>
                    <Icon.arrowUR className="court-event-go" />
                  </SmartLink>
                ))}
                <SmartLink className="btn btn-light detail-all" href={paths.events}>
                  See the whole calendar
                </SmartLink>
              </div>
            </div>

            <aside className="detail-side">
              <h3 className="detail-side-h">The details</h3>
              <dl className="detail-specs">
                <div className="detail-spec">
                  <dt>Starts</dt>
                  <dd>{formatDate(event.start)}</dd>
                </div>
                {event.end && (
                  <div className="detail-spec">
                    <dt>Ends</dt>
                    <dd>{formatDate(event.end)}</dd>
                  </div>
                )}
                <div className="detail-spec">
                  <dt>Category</dt>
                  <dd>{event.category}</dd>
                </div>
                <div className="detail-spec">
                  <dt>Entry</dt>
                  <dd>{free ? 'Included in membership' : money(event.price)}</dd>
                </div>
                <div className="detail-spec">
                  <dt>Places left</dt>
                  <dd>{event.spots}</dd>
                </div>
              </dl>

              {venue && (
                <>
                  <h3 className="detail-side-h">Venue</h3>
                  <SmartLink className="detail-venue" href={paths.court(venue.slug)}>
                    <Img src={venue.img} alt="" sizes="48px" />
                    <span>
                      <strong>{venue.name}</strong>
                      <span>{venue.surface}</span>
                    </span>
                    <Icon.arrowUR className="detail-other-go" />
                  </SmartLink>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
