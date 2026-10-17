import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, Img, SmartLink, useSeo } from '../components/ui'
import { PRODUCTS, SHOP_CATEGORIES, describe } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'

/* View 12 — the club shop.
 *
 * Kit and gadgets carrying the club mark, added straight to the same basket
 * the memberships and bookings use — these are the only lines in the app with
 * `shipped: true` by default, so the flat delivery fee applies to them.
 *
 * The grid animates on filter rather than cutting, which is the one place in
 * the app where a layout animation earns its keep: the same products move,
 * so seeing them move tells you nothing was removed.
 */

const ease = [0.22, 1, 0.36, 1]

export default function Shop() {
  const { add, openCart, money, items } = useStore()
  const [category, setCategory] = useState('All')
  useSeo({
    title: 'The Club Shop',
    description:
      'CourtSy kit and gadgets: the swing sensor, the training band, club apparel and clubhouse essentials. Members take 15% off, delivered in three days or collected from the pro shop.',
  })

  const shown = useMemo(
    () =>
      category === 'All'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category],
  )

  const inBasket = (id) => items.some((line) => line.id === id)

  const buy = (product) => {
    add({
      id: product.id,
      name: product.name,
      meta: product.meta,
      price: product.price,
      shipped: true,
    })
    openCart()
  }

  const chips = ['All', ...SHOP_CATEGORIES]

  return (
    <main className="pg shop">
      <PageHeader
        label="CourtSy kit"
        title="Built for the people who use it."
        lede="Everything here is in daily use somewhere on the grounds before it is ever offered to members — the swing sensor on the coaching team's rackets, the jacket on the ground staff. Delivered in three days, or collected from the pro shop."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Shop' }]}
        aside={
          <div className="pg-stat-card">
            <span className="pg-stat-n display">{PRODUCTS.length}</span>
            <span className="pg-stat-l">products, in four groups</span>
            <span className="pg-stat-sub">Members take 15% at the counter</span>
          </div>
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
            <p className="tier-count prg-count" aria-live="polite">
              {shown.length} {shown.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <motion.div className="shop-grid" layout>
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <motion.article
                  className="shop-card"
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32, ease }}
                >
                  <div className="shop-card-img">
                    <Img src={p.img} alt={describe(p.img)} sizes="(max-width: 760px) 100vw, 400px" />
                    {p.tag && <span className="shop-card-tag">{p.tag}</span>}
                    <span className="shop-card-cat">{p.category}</span>
                  </div>
                  <div className="shop-card-body">
                    <h2>{p.name}</h2>
                    <span className="shop-card-meta">{p.meta}</span>
                    <p>{p.blurb}</p>
                  </div>
                  <div className="shop-card-foot">
                    <span className="shop-card-price">{money(p.price)}</span>
                    <button
                      type="button"
                      className="btn btn-member shop-card-btn"
                      onClick={() => buy(p)}
                    >
                      {inBasket(p.id) ? 'Add another' : 'Add to basket'}
                      <span className="btn-bubble"><Icon.plus /></span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="section shop-promise-wrap">
        <div className="shell">
          <div className="shop-promise">
            {[
              { h: 'Members take 15%', p: 'Applied at the counter and at checkout, on everything except stringing services.' },
              { h: 'Three-day delivery', p: 'Flat fee, anywhere, or collect from the pro shop the same afternoon at no charge.' },
              { h: 'Repaired, not replaced', p: 'Bags, jackets and sensors come back to us for repair for as long as we make the part.' },
            ].map((c, i) => (
              <motion.div
                className="shop-promise-card"
                key={c.h}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                <span className="shop-promise-ic"><Icon.check /></span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section shop-cross">
        <div className="shell shop-cross-grid">
          <SmartLink className="shop-cross-card" href={paths.dining}>
            <span className="shop-cross-label">Also at the clubhouse</span>
            <h3>The kitchen</h3>
            <p>Three rooms, one kitchen, and a bill that goes to your member account.</p>
            <Icon.arrowUR className="shop-cross-go" />
          </SmartLink>
          <SmartLink className="shop-cross-card" href={paths.programmes}>
            <span className="shop-cross-label">Put it to use</span>
            <h3>Training programmes</h3>
            <p>Nine coached blocks, from the junior academy to the match-play ladder.</p>
            <Icon.arrowUR className="shop-cross-go" />
          </SmartLink>
        </div>
      </section>
    </main>
  )
}
