import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, SmartLink, useSeo } from '../components/ui'
import { VOUCHERS, GIFT_FACTS } from '../data'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'

/* View 13 — gift vouchers.
 *
 * Four amounts, nothing to configure. Pick one, add it to the basket, and
 * the existing checkout handles the rest; a voucher is digital, so it ships
 * nothing and carries no delivery fee.
 */

const ease = [0.22, 1, 0.36, 1]

export default function Gift() {
  const { add, openCart, money } = useStore()
  const [chosen, setChosen] = useState(VOUCHERS[1].value)
  useSeo({
    title: 'Gift a Day Pass',
    description:
      'CourtSy gift vouchers from $50, spendable on court time, coaching, the recovery suite or the clubhouse kitchen. No expiry and nothing to activate.',
  })

  const voucher = VOUCHERS.find((v) => v.value === chosen) ?? VOUCHERS[0]

  const buy = () => {
    add({
      id: `gift-${voucher.value}`,
      name: `Gift card · ${voucher.name}`,
      meta: money(voucher.value),
      price: voucher.value,
      // digital: nothing is posted, so no delivery fee
      shipped: false,
    })
    openCart()
  }

  return (
    <main className="pg gift">
      <PageHeader
        label="Gift cards"
        title="Give the club."
        lede="One card, four amounts, spendable on anything here: a day pass, a coached hour, a month of membership or a weekend retreat. No expiry worth worrying about."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Gift' }]}
      />

      <section className="pg-section section">
        <div className="shell">
          {/* ── pick an amount ───────────────────────────────────────── */}
          <div className="gift-grid" role="radiogroup" aria-label="Gift card amount">
            {VOUCHERS.map((v, i) => {
              const on = v.value === chosen
              return (
                <motion.button
                  type="button"
                  key={v.value}
                  role="radio"
                  aria-checked={on}
                  className={`gift-card ${on ? 'on' : ''}`}
                  onClick={() => setChosen(v.value)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: Math.min(i * 0.07, 0.3) }}
                >
                  <span className="gift-card-top">
                    <span className="gift-mark">CourtSy<span>.</span></span>
                    {on && <span className="gift-tick"><Icon.check /></span>}
                  </span>
                  <span className="gift-value display">{money(v.value)}</span>
                  <span className="gift-name">{v.name}</span>
                  <span className="gift-covers">{v.covers}</span>
                  <span className="gift-note">{v.note}</span>
                </motion.button>
              )
            })}
          </div>

          {/* ── and send it ──────────────────────────────────────────── */}
          <div className="gift-buy">
            <div className="gift-buy-text">
              <span className="gift-buy-label">Selected</span>
              <strong>
                {money(voucher.value)} · {voucher.name}
              </strong>
              <span>{voucher.covers}</span>
            </div>
            <button type="button" className="btn btn-member gift-cta" onClick={buy}>
              Add to basket <span className="btn-bubble"><Icon.arrow /></span>
            </button>
          </div>

          {/* ── the small print, as four facts ───────────────────────── */}
          <dl className="gift-facts">
            {GIFT_FACTS.map((f) => (
              <div className="gift-fact" key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <p className="gift-foot">
            Buying for someone who has never been? A{' '}
            <SmartLink href={paths.tour}>private tour</SmartLink> makes a better
            first visit than a card does, and it costs twenty dollars.
          </p>
        </div>
      </section>
    </main>
  )
}
