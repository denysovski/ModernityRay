import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Img, MotionLink, SmartLink } from '../ui'
import { MENU } from '../../data'
import { paths } from '../../routes'
import CartButton from '../commerce/CartButton'

const panel = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.18 } },
}

function Rows({ items, onClose }) {
  return (
    <div className="mega-rows">
      {items.map((it, i) => (
        <MotionLink
          key={it.name}
          href={it.href || paths.memberships}
          className="mega-row"
          onClick={onClose}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04 * i, duration: 0.35 }}
        >
          <div className="mega-row-text">
            <strong>{it.name}</strong>
            <span>{it.desc}</span>
          </div>
          <Icon.arrow className="mega-row-go" />
        </MotionLink>
      ))}
    </div>
  )
}

function MegaPanel({ entry, onClose }) {
  if (entry.type === 'courts') {
    return (
      <motion.div className="mega mega-courts" variants={panel} initial="hidden" animate="show" exit="exit">
        {entry.items.map((it, i) => (
          <MotionLink
            key={it.name}
            href={it.href}
            className="mega-court"
            onClick={onClose}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mega-court-img">
              <Img src={it.img} alt={it.name} sizes="260px" />
            </div>
            <div className="mega-court-text">
              <strong>{it.name}</strong>
              <span>{it.desc}</span>
            </div>
            <Icon.arrowUR className="mega-court-go" />
          </MotionLink>
        ))}
      </motion.div>
    )
  }

  if (entry.type === 'feature') {
    return (
      <motion.div className="mega mega-feature" variants={panel} initial="hidden" animate="show" exit="exit">
        <Rows items={entry.items} onClose={onClose} />
        <SmartLink className="mega-card" href={entry.feature.cta.href} onClick={onClose}>
          <Img src={entry.feature.img} alt={entry.feature.title} sizes="420px" />
          <div className="mega-card-scrim" />
          <span className="mega-card-tag">{entry.feature.tag}</span>
          <div className="mega-card-body">
            <strong>{entry.feature.title}</strong>
            <span className="btn btn-member mega-card-btn">
              {entry.feature.cta.label}
              <span className="btn-bubble"><Icon.arrow /></span>
            </span>
          </div>
        </SmartLink>
      </motion.div>
    )
  }

  // join — image cards + links + big button
  return (
    <motion.div className="mega mega-join" variants={panel} initial="hidden" animate="show" exit="exit">
      <div className="mega-join-cards">
        {entry.cards.map((c, i) => (
          <MotionLink
            key={c.name}
            href={c.href}
            className="mega-jcard"
            onClick={onClose}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mega-jcard-img">
              <Img src={c.img} alt={c.name} sizes="240px" />
            </div>
            <strong>{c.name}</strong>
            <span>{c.desc}</span>
            <Icon.arrowUR className="mega-jcard-go" />
          </MotionLink>
        ))}
      </div>
      <div className="mega-join-side">
        <Rows items={entry.items} onClose={onClose} />
        <SmartLink className="btn btn-member mega-join-btn" href={entry.cta.href} onClick={onClose}>
          {entry.cta.label}
          <span className="btn-bubble"><Icon.arrow /></span>
        </SmartLink>
      </div>
    </motion.div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false) // mobile
  const [active, setActive] = useState(null) // desktop mega
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the mobile drawer smoothly whenever the window is resized
  useEffect(() => {
    const onResize = () => setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Navigation no longer reloads the page, so nothing closes the menus for
     us — the route change has to. */
  useEffect(() => {
    setOpen(false)
    setActive(null)
  }, [pathname])

  const mainHref = (m) => m.href || m.items?.[0]?.href || m.cards?.[0]?.href || paths.home

  return (
    <motion.header
      className={`nav ${scrolled ? 'is-scrolled' : ''} ${active ? 'is-open' : ''} ${open ? 'm-open' : ''}`}
      initial={{ y: -70, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={() => setActive(null)}
    >
      <div className="nav-inner">
        <SmartLink href={paths.home} className="nav-logo">
          CourtSy<span>.</span>
        </SmartLink>

        <nav className="nav-links hide-sm">
          {MENU.map((m) =>
            m.items ? (
              <div
                key={m.label}
                className={`nav-item ${active === m.label ? 'on' : ''}`}
                onMouseEnter={() => setActive(m.label)}
              >
                {/* A menu whose label is also a destination opens that page on
                    click while still revealing its panel on hover. Without an
                    href it stays a button, because a link to nowhere is worse
                    than a button that only opens a menu. */}
                {m.href ? (
                  <SmartLink
                    href={m.href}
                    className={`nav-link ${pathname === m.href ? 'is-current' : ''}`}
                  >
                    {m.label}
                    <Icon.chevron className="nav-chev" />
                  </SmartLink>
                ) : (
                  <button className="nav-link">
                    {m.label}
                    <Icon.chevron className="nav-chev" />
                  </button>
                )}
              </div>
            ) : (
              <SmartLink
                key={m.label}
                href={m.href}
                className={`nav-link ${pathname === m.href ? 'is-current' : ''}`}
                onMouseEnter={() => setActive(null)}
              >
                {m.label}
              </SmartLink>
            ),
          )}
        </nav>

        <div className="nav-right">
          <SmartLink href={paths.membership('resident')} className="btn btn-member nav-cta hide-sm">
            Become a member
            <span className="btn-bubble"><Icon.arrow /></span>
          </SmartLink>
          <CartButton />
          <button
            className={`nav-burger ${open ? 'on' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Desktop mega-menu */}
      <AnimatePresence initial={false}>
        {active && MENU.find((m) => m.label === active)?.items && (
          <motion.div
            key={active}
            className="nav-mega-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <MegaPanel entry={MENU.find((m) => m.label === active)} onClose={() => setActive(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer — smooth grid-rows reveal, shows the extended sub-links */}
      <div className="nav-mobile">
        <div className="nav-mobile-inner">
          {MENU.map((m) => {
            const subs = [...(m.cards || []), ...(m.items || [])]
            return (
              <div className="nav-m-group" key={m.label}>
                <SmartLink className="nav-m-head" href={mainHref(m)} onClick={() => setOpen(false)}>
                  {m.label}
                </SmartLink>
                {subs.length > 0 && (
                  <div className="nav-m-links">
                    {subs.map((it) => (
                      <SmartLink key={it.name} href={it.href} onClick={() => setOpen(false)}>
                        {it.name}
                      </SmartLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <SmartLink href={paths.membership('resident')} className="btn btn-member nav-m-cta" onClick={() => setOpen(false)}>
            Become a member <span className="btn-bubble"><Icon.arrow /></span>
          </SmartLink>
        </div>
      </div>
    </motion.header>
  )
}
