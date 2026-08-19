import { motion } from 'framer-motion'
import { Icon, Reveal, Stagger, upItem } from '../ui'
import { MEMBERSHIP } from '../../data'
import { add } from '../../lib/cart'

export default function Membership() {
  const m = MEMBERSHIP
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
              <span className="mb-amount-n display">{m.price}</span>
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
                  id: `plan-${m.name.toLowerCase()}`,
                  name: m.name,
                  meta: m.cadence,
                  price: Number(m.price.replace(/[^0-9.]/g, '')),
                })
                window.dispatchEvent(new Event('courtsy:open-cart'))
              }}
            >
              Become a member <span className="btn-bubble"><Icon.arrow /></span>
            </button>
            <span className="mb-note">{m.note}</span>
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
              {m.fields.map((f, i) => (
                <motion.div
                  className="mb-field"
                  key={f.label}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                >
                  <img src={f.img} alt={f.label} loading="lazy" />
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
            <a href="#join" className="btn btn-green mb-custom-btn">
              Create a custom membership
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
