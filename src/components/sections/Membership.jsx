import { motion } from 'framer-motion'
import { Icon, Img, Reveal, SmartLink, Stagger, upItem } from '../ui'
import { MEMBERSHIP, MEMBERSHIP_FIELDS } from '../../data'
import { useStore } from '../../context/StoreContext'
import { paths } from '../../routes'

export default function Membership() {
  const m = MEMBERSHIP
  const { add, openCart, money } = useStore()
  return (
    <section className="section membership" id="membership">
      <div className="shell">
        <div className="mb-grid">
          {/* pricing card */}
          <Reveal className="mb-price">
            <div className="mb-price-top">
              <span className="mb-tag">{m.tag}</span>
              <h3>{m.name}</h3>
            </div>
            <div className="mb-amount">
              <span className="mb-amount-n display">{money(m.price)}</span>
              <span className="mb-amount-c">{m.cadence}</span>
            </div>
            <Stagger className="mb-benefits" as="ul" amount={0.09} delay={0.15}>
              {m.benefits.map((b) => (
                <motion.li key={b} variants={upItem}>
                  <span className="mb-check"><Icon.check /></span>
                  {b}
                </motion.li>
              ))}
            </Stagger>
            <button
              type="button"
              className="btn btn-member mb-cta"
              onClick={() => {
                add({
                  id: `tier-${m.slug}`,
                  name: m.name,
                  meta: m.cadence,
                  price: m.price,
                })
                openCart()
              }}
            >
              Become a member <span className="btn-bubble"><Icon.arrow /></span>
            </button>
            <span className="mb-note">{m.note}</span>
            <SmartLink href={paths.membership(m.slug)} className="mb-detail-link">
              See everything in {m.name} <Icon.arrow />
            </SmartLink>
          </Reveal>

          {/* heading + description + field showcase */}
          <div className="mb-right">
            <Reveal className="mb-intro">
              <span className="micro"><Icon.star className="deco-star" /> Membership</span>
              <h2 className="mb-title">One membership. Every advantage.</h2>
              <p className="mb-desc">
                A single, honest monthly price unlocks the whole club — courts,
                greens, coaching, recovery and the calendar. No tiers to decode,
                no add-ons.
              </p>
            </Reveal>

            <div className="mb-fields">
              {MEMBERSHIP_FIELDS.map((f, i) => (
                <motion.div
                  className="mb-field"
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                >
                  <Img src={f.img} alt={f.label} sizes="(max-width: 700px) 33vw, 220px" />
                  <span className="mb-field-go"><Icon.arrowUR /></span>
                  <span className="mb-field-label">{f.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* wide custom-membership card */}
        <motion.div
          className="mb-custom"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-custom-left">
            <span className="mb-custom-eyebrow">Tailored plans</span>
            <h3>Need something different? Build your own.</h3>
            <p>
              Corporate, family, junior or seasonal — shape a membership around
              exactly how you and yours want to play.
            </p>
          </div>
          <div className="mb-custom-right">
            <SmartLink href={paths.memberships} className="btn btn-green mb-custom-btn">
              Compare all five tiers
            </SmartLink>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
