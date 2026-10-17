import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon, Img, SmartLink, useSeo } from '../components/ui'
import { TIERS, tierBySlug, TESTIMONIALS, describe } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'
import NotFound from './NotFound'

/* View 3 of 9 — a single membership tier.
 *
 * Deliberately a different shape from the facility pages. A court is a place,
 * so that page leads with photography and a specification. A membership is a
 * decision, so this one leads with the promise, then the three numbers that
 * settle it, then what you get and who it is for. Full-bleed blocks, one idea
 * at a time, and short sentences: restraint is the point.
 *
 * The slug comes from the URL, so the page is addressable and shareable; an
 * unknown slug renders the 404 view rather than throwing.
 */

const ease = [0.22, 1, 0.36, 1]

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export default function MembershipDetail() {
  const { slug } = useParams()
  const tier = tierBySlug(slug)
  const { add, openCart, money } = useStore()

  useSeo({
    title: tier ? `${tier.name} Membership` : 'Membership Not Found',
    description: tier
      ? `${tier.name} at CourtSy — ${money(tier.price)} ${tier.cadence}. ${tier.summary} ${tier.note}.`
      : 'That membership tier is not here. Compare all five CourtSy tiers.',
    image: tier?.img,
    noindex: !tier,
  })

  if (!tier) return <NotFound what="membership tier" />

  const others = TIERS.filter((t) => t.slug !== tier.slug)
  const voices = TESTIMONIALS.filter((t) =>
    t.role.toLowerCase().startsWith(tier.name.toLowerCase()),
  ).slice(0, 2)

  const join = () => {
    add({
      id: `tier-${tier.slug}`,
      name: tier.name,
      meta: tier.cadence,
      price: tier.price,
      shipped: tier.shipped !== false,
    })
    openCart()
  }

  return (
    <main className="member-page">
      {/* ── the promise, over the photograph ─────────────────────────── */}
      <header className="member-hero">
        <Img
          src={tier.img}
          alt={describe(tier.img)}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="member-hero-img"
        />
        <span className="member-hero-scrim" />

        <div className="shell member-hero-inner">
          <nav className="pg-crumbs member-crumbs" aria-label="Breadcrumb">
            <span className="pg-crumb">
              <SmartLink href={paths.home}>Home</SmartLink>
              <Icon.chevron className="pg-crumb-sep" />
            </span>
            <span className="pg-crumb">
              <SmartLink href={paths.memberships}>Memberships</SmartLink>
              <Icon.chevron className="pg-crumb-sep" />
            </span>
            <span className="pg-crumb">
              <span aria-current="page">{tier.name}</span>
            </span>
          </nav>

          <motion.div
            className="member-hero-text"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
          >
            {tier.tag && <span className="member-badge">{tier.tag}</span>}
            <h1 className="member-name">{tier.name}</h1>
            <p className="member-line">{tier.line}</p>
          </motion.div>
        </div>
      </header>

      {/* ── price and the way in, on its own ─────────────────────────── */}
      <section className="member-buy">
        <div className="shell member-buy-inner">
          <div className="member-price">
            <span className="member-price-n display">{money(tier.price)}</span>
            <span className="member-price-c">{tier.cadence}</span>
          </div>
          <div className="member-buy-actions">
            <button type="button" className="btn btn-member member-cta" onClick={join}>
              Add to basket <span className="btn-bubble"><Icon.arrow /></span>
            </button>
            <SmartLink href={paths.checkout} className="btn btn-light">
              Go to checkout
            </SmartLink>
          </div>
          <span className="member-note">{tier.note}</span>
        </div>
      </section>

      {/* ── the three numbers that decide it ─────────────────────────── */}
      <section className="section member-figures">
        <div className="shell">
          <motion.div
            className="member-figure-row"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            {tier.figures.map((f) => (
              <motion.div className="member-figure" key={f.label} variants={rise}>
                <span className="member-figure-n display">{f.value}</span>
                <span className="member-figure-l">{f.label}</span>
                <p className="member-figure-note">{f.note}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── who it is for, and everything in it ──────────────────────── */}
      <section className="member-body">
        <div className="shell member-body-grid">
          <motion.div
            className="member-for"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease }}
          >
            <span className="micro"><Icon.star className="deco-star" /> Who it&rsquo;s for</span>
            <p className="member-for-text">{tier.forWhom}</p>
          </motion.div>

          <div className="member-included">
            <h2 className="h-md member-h">Everything in {tier.name}.</h2>
            <ul className="member-list">
              {tier.benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, ease, delay: Math.min(i * 0.06, 0.35) }}
                >
                  <span className="member-list-n">{i + 1}</span>
                  <span className="member-list-t">{b}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── the difference it makes, as wide cards ───────────────────── */}
      <section className="section member-makes">
        <div className="shell">
          <h2 className="h-md member-h member-h-centre">The difference it makes.</h2>
          <div className="member-make-grid">
            {tier.includes.map((inc, i) => {
              const Glyph = Icon[inc.icon] || Icon.check
              return (
                <motion.article
                  className="member-make"
                  key={inc.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.55, ease, delay: Math.min(i * 0.08, 0.3) }}
                >
                  <span className="member-make-ic"><Glyph /></span>
                  <h3>{inc.title}</h3>
                  <p>{inc.desc}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── the small print, as a plain table ────────────────────────── */}
      <section className="member-terms">
        <div className="shell member-terms-inner">
          <h2 className="h-md member-h">The details.</h2>
          <dl className="member-specs">
            {tier.specs.map((s) => (
              <div className="member-spec" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── members on this tier ─────────────────────────────────────── */}
      {voices.length > 0 && (
        <section className="section member-voices-wrap">
          <div className="shell">
            <h2 className="h-md member-h member-h-centre">From {tier.name} members.</h2>
            <div className="member-voices">
              {voices.map((v) => (
                <blockquote className="member-voice" key={v.name}>
                  <Icon.quote className="member-voice-q" />
                  <p>{v.quote}</p>
                  <footer>
                    <img src={v.img} alt="" loading="lazy" width="44" height="44" />
                    <span>
                      <strong>{v.name}</strong>
                      <span>{v.role}</span>
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── the other plans, full width ──────────────────────────────── */}
      <section className="section member-others-wrap">
        <div className="shell">
          <div className="member-others-head">
            <h2 className="h-md member-h">Other plans.</h2>
            <SmartLink href={paths.memberships} className="btn btn-light">
              Compare all five
            </SmartLink>
          </div>
          <div className="member-others">
            {others.map((o) => (
              <SmartLink className="member-other" href={paths.membership(o.slug)} key={o.slug}>
                <span className="member-other-name">{o.name}</span>
                <span className="member-other-line">{o.line}</span>
                <span className="member-other-foot">
                  <span className="member-other-price">
                    {money(o.price)} <span>{o.cadence}</span>
                  </span>
                  <Icon.arrowUR className="member-other-go" />
                </span>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
