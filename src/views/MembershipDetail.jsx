import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, Img, SmartLink } from '../components/ui'
import { TIERS, tierBySlug, TESTIMONIALS } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'
import NotFound from './NotFound'

/* View 3 of 9 — a single membership tier.
 *
 * The detail half of the list/detail pair. The slug comes from the URL, so
 * this view is addressable and shareable; an unknown slug renders the 404 view
 * rather than throwing, because a mistyped URL is a user error, not a bug.
 */

const ease = [0.22, 1, 0.36, 1]

export default function MembershipDetail() {
  const { slug } = useParams()
  const tier = tierBySlug(slug)
  const { add, openCart, money } = useStore()

  useEffect(() => {
    document.title = tier ? `${tier.name} membership — CourtSy` : 'Not found — CourtSy'
  }, [tier])

  if (!tier) return <NotFound what="membership tier" />

  const others = TIERS.filter((t) => t.slug !== tier.slug).slice(0, 3)
  const voices = TESTIMONIALS.filter((t) => t.role.toLowerCase().startsWith(tier.name.toLowerCase())).slice(0, 2)

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
    <main className="pg">
      <PageHeader
        label={tier.tag || 'Membership'}
        title={tier.name}
        lede={tier.summary}
        crumbs={[
          { label: 'Home', href: paths.home },
          { label: 'Memberships', href: paths.memberships },
          { label: tier.name },
        ]}
        aside={
          <div className="detail-buy">
            <div className="detail-buy-amount">
              <span className="display">{money(tier.price)}</span>
              <span>{tier.cadence}</span>
            </div>
            <button type="button" className="btn btn-member detail-buy-cta" onClick={join}>
              Add to basket <span className="btn-bubble"><Icon.arrow /></span>
            </button>
            <SmartLink href={paths.checkout} className="btn btn-light detail-buy-alt">
              Go to checkout
            </SmartLink>
            <span className="detail-buy-note">{tier.note}</span>
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
              src={tier.img}
              alt={`${tier.name} membership`}
              sizes="(max-width: 1440px) 100vw, 1440px"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          <div className="detail-grid">
            <div className="detail-main">
              <h2 className="h-md detail-h">What&rsquo;s included</h2>
              <ul className="detail-benefits">
                {tier.benefits.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, ease, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <span className="tier-check"><Icon.check /></span>
                    {b}
                  </motion.li>
                ))}
              </ul>

              <h2 className="h-md detail-h">The difference it makes</h2>
              <div className="detail-includes">
                {tier.includes.map((inc) => {
                  const Glyph = Icon[inc.icon] || Icon.check
                  return (
                    <div className="detail-include" key={inc.title}>
                      <span className="detail-include-ic"><Glyph /></span>
                      <div>
                        <strong>{inc.title}</strong>
                        <p>{inc.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {voices.length > 0 && (
                <>
                  <h2 className="h-md detail-h">From {tier.name} members</h2>
                  <div className="detail-voices">
                    {voices.map((v) => (
                      <blockquote className="detail-voice" key={v.name}>
                        <Icon.quote className="detail-voice-q" />
                        <p>{v.quote}</p>
                        <footer>
                          <img src={v.img} alt="" loading="lazy" width="44" height="44" />
                          <span><strong>{v.name}</strong><span>{v.role}</span></span>
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="detail-side">
              <h3 className="detail-side-h">The details</h3>
              <dl className="detail-specs">
                {tier.specs.map((s) => (
                  <div className="detail-spec" key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="detail-side-h">Compare with</h3>
              <div className="detail-others">
                {others.map((o) => (
                  <SmartLink className="detail-other" href={paths.membership(o.slug)} key={o.slug}>
                    <span className="detail-other-text">
                      <strong>{o.name}</strong>
                      <span>{money(o.price)} {o.cadence}</span>
                    </span>
                    <Icon.arrowUR className="detail-other-go" />
                  </SmartLink>
                ))}
                <SmartLink className="btn btn-light detail-all" href={paths.memberships}>
                  See all tiers
                </SmartLink>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
