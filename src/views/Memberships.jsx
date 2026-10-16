import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, Img, SmartLink } from '../components/ui'
import { TIERS } from '../data'
import { useStore } from '../context/StoreContext'
import { TAX_RATE } from '../lib/store'
import { paths } from '../routes'

/* View 2 of 9 — the membership overview.
 *
 * The list screen of a list/detail pair: compare every tier, filter by what
 * you actually want, then follow through to /memberships/:slug. Sorting and
 * filtering are derived state (useMemo over the data) rather than copies of
 * it, so there is only ever one source of truth for a tier.
 */

const ease = [0.22, 1, 0.36, 1]

/** The filters are expressed as predicates over a tier, not as stored flags. */
const FILTERS = [
  { id: 'all', label: 'All tiers', test: () => true },
  { id: 'monthly', label: 'Monthly', test: (t) => t.cadence === 'per month' },
  { id: 'guests', label: 'Brings guests', test: (t) => t.specs.some((s) => s.label === 'Guests' && s.value !== 'Not included') },
  { id: 'no-commitment', label: 'No minimum term', test: (t) => t.specs.some((s) => s.label === 'Minimum term' && s.value === 'None') },
]

const SORTS = [
  { id: 'price-asc', label: 'Price, low to high', cmp: (a, b) => a.price - b.price },
  { id: 'price-desc', label: 'Price, high to low', cmp: (a, b) => b.price - a.price },
  { id: 'benefits', label: 'Most included', cmp: (a, b) => b.benefits.length - a.benefits.length },
]

export default function Memberships() {
  const { add, openCart, money, prefs } = useStore()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('price-asc')

  useEffect(() => {
    document.title = 'Memberships — CourtSy'
  }, [])

  const shown = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filter)?.test ?? (() => true)
    const cmp = SORTS.find((s) => s.id === sort)?.cmp
    return TIERS.filter(test).sort(cmp)
  }, [filter, sort])

  /* The account view can ask for tax-inclusive prices; one helper keeps every
     card consistent with that choice. */
  const shownPrice = (tier) =>
    prefs.taxInclusivePrices ? tier.price * (1 + TAX_RATE) : tier.price

  const join = (tier) => {
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
        label="Membership"
        title="Five ways to belong."
        lede="Every tier opens the same grounds — they differ in how often you come, how far ahead you can book, and who you bring. Compare them here, then open the one that fits."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Memberships' }]}
        aside={
          <div className="pg-stat-card">
            <span className="pg-stat-n display">{TIERS.length}</span>
            <span className="pg-stat-l">tiers, from a single day to a full team</span>
            <span className="pg-stat-sub">
              {prefs.taxInclusivePrices ? 'Prices include tax' : `Prices exclude ${(TAX_RATE * 100).toFixed(2)}% tax`}
            </span>
          </div>
        }
      />

      <section className="section pg-section">
        <div className="shell">
          <div className="tier-controls">
            <div className="tier-filters" role="group" aria-label="Filter tiers">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`chip-btn ${filter === f.id ? 'on' : ''}`}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="tier-sort">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          <p className="tier-count" aria-live="polite">
            Showing {shown.length} of {TIERS.length} tiers
          </p>

          <div className="tier-grid">
            {shown.map((tier, i) => (
              <motion.article
                className={`tier-card ${tier.featured ? 'is-featured' : ''}`}
                key={tier.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: Math.min(i * 0.06, 0.3) }}
              >
                <div className="tier-card-img">
                  <Img src={tier.img} alt="" sizes="(max-width: 700px) 100vw, 340px" />
                  {tier.tag && <span className="tier-tag">{tier.tag}</span>}
                </div>

                <div className="tier-card-body">
                  <h2 className="tier-name">{tier.name}</h2>
                  <p className="tier-summary">{tier.summary}</p>

                  <div className="tier-amount">
                    <span className="tier-amount-n display">{money(shownPrice(tier))}</span>
                    <span className="tier-amount-c">{tier.cadence}</span>
                  </div>

                  <ul className="tier-benefits">
                    {tier.benefits.slice(0, 4).map((b) => (
                      <li key={b}>
                        <span className="tier-check"><Icon.check /></span>
                        {b}
                      </li>
                    ))}
                    {tier.benefits.length > 4 && (
                      <li className="tier-more">+{tier.benefits.length - 4} more</li>
                    )}
                  </ul>

                  <div className="tier-actions">
                    <button type="button" className="btn btn-member" onClick={() => join(tier)}>
                      Add to basket <span className="btn-bubble"><Icon.arrow /></span>
                    </button>
                    <SmartLink href={paths.membership(tier.slug)} className="btn btn-light">
                      Details
                    </SmartLink>
                  </div>
                  <span className="tier-note">{tier.note}</span>
                </div>
              </motion.article>
            ))}
          </div>

          {shown.length === 0 && (
            <p className="pg-empty">
              No tier matches that combination. <button type="button" className="link-btn" onClick={() => setFilter('all')}>Clear the filter</button>.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
