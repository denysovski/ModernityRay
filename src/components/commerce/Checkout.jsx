import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './useCart'
import { Icon } from '../ui'
import { TAX_RATE } from '../../lib/cart'

const ease = [0.22, 1, 0.36, 1]
const easeOut = [0.4, 0, 1, 1]
const STEPS = ['Account', 'Details', 'Delivery', 'Payment']

/* Each step slides in from the direction you travelled, so moving forward and
   pressing Back read as opposite motions rather than the same fade. */
const stepIn = (dir) => ({
  initial: { opacity: 0, x: dir * 26 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.42, ease } },
  exit: { opacity: 0, x: dir * -26, transition: { duration: 0.22, ease: easeOut } },
})

/* Nothing here talks to a server. Sign-in accepts any email, the card fields
   are never read, and "paying" just writes an order into localStorage. */
export default function Checkout({ open, onClose }) {
  const { items, totals, user, signIn, placeOrder, money } = useCart()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [order, setOrder] = useState(null)
  // one setter so every step change records which way we went
  const goTo = (next) => { setDir(next > step ? 1 : -1); setStep(next) }
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', address: '', city: '', zip: '', country: 'United States',
    card: '', exp: '', cvc: '',
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // Opening resets the flow. A local account already on file skips the
  // sign-in step and seeds the fields, but Back still reaches it.
  useEffect(() => {
    if (!open) return
    setOrder(null)
    setStep(user ? 1 : 0)
    setForm((f) => ({ ...f, name: f.name || user?.name || '', email: f.email || user?.email || '' }))
    // only when the sheet opens — re-seeding mid-flow would fight the inputs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => onClose()

  const submitAccount = (e) => {
    e.preventDefault()
    signIn({ name: form.name || form.email.split('@')[0], email: form.email })
    goTo(1)
  }

  const pay = (e) => {
    e.preventDefault()
    setOrder(placeOrder({
      name: form.name || user?.name,
      email: form.email || user?.email,
      phone: form.phone,
      address: `${form.address}, ${form.city} ${form.zip}, ${form.country}`,
    }))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ck"
          role="dialog"
          aria-label="Checkout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: easeOut } }}
        >
          <motion.div
            className="ck-sheet"
            initial={{ y: 48, opacity: 0, scale: 0.985 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 },
            }}
            exit={{ y: 24, opacity: 0, scale: 0.99, transition: { duration: 0.24, ease: easeOut } }}
          >
            <header className="ck-head">
              <span className="ck-logo">CourtSy<span>.</span></span>
              <button className="ck-close" onClick={close} aria-label="Close checkout">
                <Icon.close />
              </button>
            </header>

            {order ? (
              <div className="ck-done">
                <motion.span
                  className="ck-done-ic"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease, delay: 0.1 }}
                >
                  <Icon.check />
                </motion.span>
                <h2>You&rsquo;re in, {order.details.name}.</h2>
                <p>
                  Order <strong>{order.ref}</strong> is confirmed. A receipt is on its way to{' '}
                  {order.details.email}, and your member card ships to {order.details.address}.
                </p>
                <div className="ck-done-total">
                  <span>Paid today</span>
                  <strong>{money(order.totals.total)}</strong>
                </div>
                <p className="ck-sim">
                  Simulated checkout — no payment was taken and nothing left your browser.
                </p>
                <button className="btn btn-green" onClick={close}>Back to the club</button>
              </div>
            ) : (
              <div className="ck-body">
                <div className="ck-main">
                  <ol className="ck-steps">
                    {STEPS.map((s, i) => (
                      <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>
                        <span className="ck-step-n">{i < step ? <Icon.check /> : i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>

                  <AnimatePresence mode="wait" initial={false} custom={dir}>
                  {step === 0 && (
                    <motion.form className="ck-form" key="s0" onSubmit={submitAccount} {...stepIn(dir)}>
                      <h2>Sign in or create an account</h2>
                      <p className="ck-note">
                        Local only — any email works and no password is stored.
                      </p>
                      <label>Full name<input value={form.name} onChange={set('name')} placeholder="Jane Doe" required /></label>
                      <label>Email<input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" required /></label>
                      <label>Password<input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required /></label>
                      <button className="btn btn-green ck-next" type="submit">
                        Continue <span className="btn-bubble"><Icon.arrow /></span>
                      </button>
                    </motion.form>
                  )}

                  {step === 1 && (
                    <motion.form className="ck-form" key="s1" onSubmit={(e) => { e.preventDefault(); goTo(2) }} {...stepIn(dir)}>
                      <h2>Your details</h2>
                      <p className="ck-note">Signed in as {user?.email}.</p>
                      <label>Full name<input value={form.name} onChange={set('name')} required /></label>
                      <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
                      <label>Phone<input value={form.phone} onChange={set('phone')} placeholder="+1 555 0100" required /></label>
                      <div className="ck-row">
                        <button className="btn btn-ghost" type="button" onClick={() => goTo(0)}>Back</button>
                        <button className="btn btn-green ck-next" type="submit">
                          Continue <span className="btn-bubble"><Icon.arrow /></span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.form className="ck-form" key="s2" onSubmit={(e) => { e.preventDefault(); goTo(3) }} {...stepIn(dir)}>
                      <h2>Where should the member card go?</h2>
                      <p className="ck-note">
                        Your access is live immediately — this is for the physical card and welcome pack.
                      </p>
                      <label>Street address<input value={form.address} onChange={set('address')} placeholder="24 Lakeside Drive" required /></label>
                      <div className="ck-row2">
                        <label>City<input value={form.city} onChange={set('city')} placeholder="Austin" required /></label>
                        <label>ZIP<input value={form.zip} onChange={set('zip')} placeholder="78701" required /></label>
                      </div>
                      <label>Country
                        <select value={form.country} onChange={set('country')}>
                          <option>United States</option><option>Canada</option>
                          <option>United Kingdom</option><option>Australia</option>
                        </select>
                      </label>
                      <div className="ck-row">
                        <button className="btn btn-ghost" type="button" onClick={() => goTo(1)}>Back</button>
                        <button className="btn btn-green ck-next" type="submit">
                          Continue <span className="btn-bubble"><Icon.arrow /></span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {step === 3 && (
                    <motion.form className="ck-form" key="s3" onSubmit={pay} {...stepIn(dir)}>
                      <h2>Payment</h2>
                      <p className="ck-note">Simulated — enter anything, nothing is charged or sent.</p>
                      <label>Card number<input value={form.card} onChange={set('card')} placeholder="4242 4242 4242 4242" required /></label>
                      <div className="ck-row2">
                        <label>Expiry<input value={form.exp} onChange={set('exp')} placeholder="04 / 29" required /></label>
                        <label>CVC<input value={form.cvc} onChange={set('cvc')} placeholder="123" required /></label>
                      </div>
                      <div className="ck-row">
                        <button className="btn btn-ghost" type="button" onClick={() => goTo(2)}>Back</button>
                        <button className="btn btn-green ck-next" type="submit">
                          Pay {money(totals.total)} <span className="btn-bubble"><Icon.arrow /></span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                  </AnimatePresence>
                </div>

                <aside className="ck-sum">
                  <h3>Order summary</h3>
                  <div className="ck-sum-items">
                    {items.map((it) => (
                      <div className="ck-sum-item" key={it.id}>
                        <span className="ck-sum-q">{it.qty}×</span>
                        <span className="ck-sum-n"><strong>{it.name}</strong><span>{it.meta}</span></span>
                        <span className="ck-sum-p">{money(it.price * it.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ck-sum-lines">
                    <div><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
                    <div><span>Delivery</span><span>{totals.shipping ? money(totals.shipping) : 'Free'}</span></div>
                    <div><span>Tax ({(TAX_RATE * 100).toFixed(2)}%)</span><span>{money(totals.tax)}</span></div>
                  </div>
                  <div className="ck-sum-total">
                    <span>Total</span><strong>{money(totals.total)}</strong>
                  </div>
                </aside>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
