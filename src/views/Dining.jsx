import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Img, SmartLink } from '../components/ui'
import { VENUES, MENU_SECTIONS, DINING_FACTS, DINING_HERO } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'

/* View 13 — the clubhouse kitchen.
 *
 * A fourth layout: a full-bleed banner, then the three rooms as a set of
 * tabs that cross-fade rather than a grid, then the menu as a plain typeset
 * list. Restaurants are read, not browsed, so the page is mostly type.
 */

const ease = [0.22, 1, 0.36, 1]

export default function Dining() {
  const { money } = useStore()
  const [room, setRoom] = useState(VENUES[0].slug)

  useEffect(() => {
    document.title = 'Clubhouse dining — CourtSy'
  }, [])

  const active = VENUES.find((v) => v.slug === room) ?? VENUES[0]

  return (
    <main className="dine">
      {/* ── banner ───────────────────────────────────────────────────── */}
      <header className="dine-hero">
        <Img
          src={DINING_HERO}
          alt=""
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="dine-hero-img"
        />
        <span className="dine-hero-scrim" />
        <div className="shell dine-hero-inner">
          <nav className="pg-crumbs dine-crumbs" aria-label="Breadcrumb">
            <span className="pg-crumb">
              <SmartLink href={paths.home}>Home</SmartLink>
              <Icon.chevron className="pg-crumb-sep" />
            </span>
            <span className="pg-crumb">
              <span aria-current="page">Dining</span>
            </span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
          >
            <span className="micro micro-dark">
              <Icon.star className="deco-star deco-star-light" /> The clubhouse
            </span>
            <h1 className="dine-title">
              Lunch that runs <br /> into the afternoon.
            </h1>
            <p className="dine-lede">
              One kitchen, three rooms and a bill that never arrives at the
              table. Breakfast from half past six for the early courts; the
              last table in the Long Room goes at eleven.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ── the three rooms, as cross-fading tabs ────────────────────── */}
      <section className="section dine-rooms">
        <div className="shell">
          <div className="dine-rooms-head">
            <h2 className="h-lg">Three rooms.</h2>
            <div className="dine-tabs" role="tablist" aria-label="Choose a room">
              {VENUES.map((v) => (
                <button
                  key={v.slug}
                  type="button"
                  role="tab"
                  id={`dine-tab-${v.slug}`}
                  aria-selected={room === v.slug}
                  aria-controls={`dine-panel-${v.slug}`}
                  className={`dine-tab ${room === v.slug ? 'on' : ''}`}
                  onClick={() => setRoom(v.slug)}
                >
                  {room === v.slug && (
                    <motion.span
                      className="dine-tab-pill"
                      layoutId="dine-tab-pill"
                      transition={{ duration: 0.4, ease }}
                    />
                  )}
                  <span className="dine-tab-label">{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="dine-room"
            id={`dine-panel-${active.slug}`}
            role="tabpanel"
            aria-labelledby={`dine-tab-${active.slug}`}
          >
            {/* All three photographs are mounted from the start and stacked,
                with only the active one at full opacity. Swapping the <Img>
                on click meant the next photograph began downloading at the
                moment it was needed, so the panel sat empty and then
                snapped in; this way the browser has fetched all three by
                the time anyone picks a tab, and the change is a crossfade
                with nothing to wait for. */}
            <div className="dine-room-img">
              {VENUES.map((v) => (
                <Img
                  key={v.slug}
                  src={v.img}
                  alt={v.slug === active.slug ? v.name : ''}
                  sizes="(max-width: 900px) 100vw, 55vw"
                  className={`dine-room-shot ${v.slug === active.slug ? 'is-on' : ''}`}
                  aria-hidden={v.slug === active.slug ? undefined : 'true'}
                />
              ))}
            </div>

            {/* The copy is cheap to remount, so it keeps the crossfade. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="dine-room-text"
                key={active.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease }}
              >
                <span className="dine-room-line">{active.line}</span>
                <h3>{active.name}</h3>
                <p>{active.desc}</p>
                <dl className="dine-room-facts">
                  <div>
                    <dt>Hours</dt>
                    <dd>{active.hours}</dd>
                  </div>
                  <div>
                    <dt>Size</dt>
                    <dd>{active.seats}</dd>
                  </div>
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── the menu, typeset ────────────────────────────────────────── */}
      <section className="section dine-menu-wrap">
        <div className="shell">
          <div className="dine-menu-head">
            <span className="micro"><Icon.star className="deco-star" /> What is on today</span>
            <h2 className="h-lg">A balanced menu.</h2>
          </div>

          <div className="dine-menu">
            {MENU_SECTIONS.map((section, s) => (
              <motion.div
                className="dine-course"
                key={section.heading}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease, delay: s * 0.08 }}
              >
                <div className="dine-course-head">
                  <h3>{section.heading}</h3>
                  <span>{section.note}</span>
                </div>
                <ul>
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <div className="dine-dish">
                        <strong>{item.name}</strong>
                        <span>{item.desc}</span>
                      </div>
                      <span className="dine-dish-price">{money(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── how it works ─────────────────────────────────────────────── */}
      <section className="section dine-facts-wrap">
        <div className="shell dine-facts">
          {DINING_FACTS.map((f, i) => (
            <motion.div
              className="dine-fact"
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <span className="dine-fact-ic"><Icon.check /></span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section dine-cross">
        <div className="shell dine-cross-grid">
          <SmartLink className="shop-cross-card" href={paths.events}>
            <span className="shop-cross-label">On the calendar</span>
            <h3>Members’ events</h3>
            <p>Finals nights, long-table dinners and the summer retreat.</p>
            <Icon.arrowUR className="shop-cross-go" />
          </SmartLink>
          <SmartLink className="shop-cross-card" href={paths.shop}>
            <span className="shop-cross-label">Take it home</span>
            <h3>The club shop</h3>
            <p>Kit, gadgets and the clubhouse things people keep asking about.</p>
            <Icon.arrowUR className="shop-cross-go" />
          </SmartLink>
        </div>
      </section>
    </main>
  )
}
