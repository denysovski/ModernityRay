import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './useCart'
import { Icon } from '../ui'

const ease = [0.22, 1, 0.36, 1]
const easeOut = [0.4, 0, 1, 1]

/* Opening is a spring — it carries a little weight and settles, which is what
   makes a drawer feel physical. Closing is a short eased slide: getting out of
   the way should never feel like it takes time. */
const panelIn = { type: 'spring', stiffness: 300, damping: 34, mass: 0.85 }
const panelOut = { duration: 0.3, ease: easeOut }

/* Contents trail the panel in. Opacity only on entry, deliberately: an x
   offset here fights the panel's own transform and framer's layout
   measurement, which is what made the open stutter. Movement on exit is fine
   — nothing is measuring by then. */
const line = (i) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease, delay: 0.1 + i * 0.045 } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.22, ease: easeOut } },
})

/** Slide-in basket. Review and adjust here, then hand off to Checkout. */
export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, totals, setQty, remove, money } = useCart()

  // esc closes, like any other dialog
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="cart-layer">
          <motion.div
            className="cart-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: easeOut } }}
          />
          <motion.aside
            className="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: panelIn }}
            exit={{ x: '100%', transition: panelOut }}
          >
            <motion.header
              className="cart-head"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.35, ease, delay: 0.06 } }}
            >
              <h2>Your cart</h2>
              <button className="cart-close" onClick={onClose} aria-label="Close cart">
                <Icon.close />
              </button>
            </motion.header>

            {items.length === 0 ? (
              <motion.div
                className="cart-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4, ease, delay: 0.12 } }}
              >
                <span className="cart-empty-ic"><Icon.cart /></span>
                <p>Your cart is empty.</p>
                <a href="/pages/become-a-member.html#plans" className="btn btn-green">
                  Browse memberships
                </a>
              </motion.div>
            ) : (
              <>
                <div className="cart-items">
                  {/* layout="position" only — full layout re-measures size every
                      frame and jitters against the panel's slide */}
                  <AnimatePresence initial={false}>
                    {items.map((it, i) => (
                      <motion.div className="cart-item" key={it.id} layout="position" {...line(i)}>
                        <div className="cart-item-t">
                          <strong>{it.name}</strong>
                          <span>{it.meta}</span>
                        </div>
                        <div className="cart-item-r">
                          <div className="cart-qty">
                            <button onClick={() => setQty(it.id, it.qty - 1)} aria-label="Decrease">−</button>
                            <motion.span key={it.qty} initial={{ y: -7, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.22, ease }}>
                              {it.qty}
                            </motion.span>
                            <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase">+</button>
                          </div>
                          <span className="cart-item-p">{money(it.price * it.qty)}</span>
                          <button className="cart-del" onClick={() => remove(it.id)} aria-label={`Remove ${it.name}`}>
                            <Icon.close />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.footer
                  className="cart-foot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.4, ease, delay: 0.16 } }}
                >
                  <div className="cart-line">
                    <span>Subtotal</span>
                    <span>{money(totals.subtotal)}</span>
                  </div>
                  <div className="cart-line cart-line-soft">
                    <span>Tax &amp; delivery</span>
                    <span>calculated at checkout</span>
                  </div>
                  <button className="btn btn-green cart-checkout" onClick={onCheckout}>
                    Checkout <span className="btn-bubble"><Icon.arrow /></span>
                  </button>
                </motion.footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
