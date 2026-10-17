import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import Field from '../components/commerce/Field'
import { Icon, SmartLink, useSeo } from '../components/ui'
import { useStore } from '../context/StoreContext'
import { TAX_RATE } from '../lib/store'
import {
  COUNTRIES,
  cardBrand,
  maskCard,
  maskCvc,
  maskExpiry,
  validateAccountStep,
  validateDeliveryStep,
  validateDetailsStep,
  validatePaymentStep,
} from '../lib/validation'
import { paths } from '../routes'

/* View 8 of 9 — the checkout.
 *
 * A four-step form, now a route rather than a modal, so a half-finished
 * checkout has a URL, the back button steps out of it, and the browser can
 * autofill it properly.
 *
 * Validation is the point of this screen. Every step runs the matching
 * validator from lib/validation on submit; failing fields get an inline
 * message, `aria-invalid`, and focus moves to the first one. Nothing advances
 * until the step is clean, and the card number is checked with the Luhn
 * algorithm — the same check a real payment form runs client-side.
 *
 * What is NOT kept: the password is validated and then dropped (it never
 * reaches the store), and the card number is reduced to a brand plus the last
 * four digits before the order is written. See lib/store.placeOrder.
 */

const ease = [0.22, 1, 0.36, 1]
const easeOut = [0.4, 0, 1, 1]

/** One line of the confirmation, rising in behind the one before it. */
const doneItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}
const STEPS = ['Account', 'Details', 'Delivery', 'Payment']

/* Each step slides in from the direction you travelled, so moving forward and
   pressing Back read as opposite motions rather than the same fade. */
const stepIn = (dir) => ({
  initial: { opacity: 0, x: dir * 26 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.42, ease } },
  exit: { opacity: 0, x: dir * -26, transition: { duration: 0.22, ease: easeOut } },
})

const EMPTY = {
  name: '', email: '', password: '',
  phone: '', address: '', city: '', zip: '', country: COUNTRIES[0],
  card: '', exp: '', cvc: '',
}

/** Which validator guards which step, and which fields it can blame. */
const STEP_RULES = [
  { validate: validateAccountStep, fields: ['name', 'email', 'password'] },
  { validate: validateDetailsStep, fields: ['name', 'email', 'phone'] },
  { validate: validateDeliveryStep, fields: ['address', 'city', 'zip', 'country'] },
  { validate: validatePaymentStep, fields: ['card', 'exp', 'cvc'] },
]

export default function Checkout() {
  const { items, totals, user, signIn, placeOrder, money, storageAvailable } = useStore()
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [step, setStep] = useState(user ? 1 : 0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    name: user?.name || '',
    email: user?.email || '',
  }))
  /* `submitted` per step: errors stay hidden until the first submit of that
     step, then update live as the user fixes them. */
  const [submitted, setSubmitted] = useState({})
  const [order, setOrder] = useState(null)

  useSeo({
    title: 'Checkout',
    description: 'Complete your CourtSy membership, booking or order.',
    noindex: true,
  })

  /* The payment step is the tallest, so the submit button sits well down
     the page — and the confirmation that replaces it is short. Without
     this you land on "You're in" already scrolled past it. Instant, not
     smooth: the old view is gone, so there is nothing to travel through. */
  useEffect(() => {
    if (order) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [order])

  /* Errors are derived, never stored — recomputing on each render means a
     field clears the moment it becomes valid, with no stale-state bugs. */
  const errors = useMemo(() => STEP_RULES[step]?.validate(form) ?? {}, [step, form])
  const showErrors = Boolean(submitted[step])

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const goTo = (next) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  /** Moves focus to the first field the validator rejected. */
  const focusFirstError = (errs) => {
    const first = STEP_RULES[step].fields.find((f) => errs[f])
    if (!first || !formRef.current) return
    const el = formRef.current.querySelector(`[name="${first}"]`)
    if (el) el.focus()
  }

  const advance = (e) => {
    e.preventDefault()
    setSubmitted((s) => ({ ...s, [step]: true }))
    const errs = STEP_RULES[step].validate(form)
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs)
      return
    }
    // step 0 is the only one with a side effect: it creates the local profile
    if (step === 0) signIn({ name: form.name, email: form.email })
    goTo(step + 1)
  }

  const pay = (e) => {
    e.preventDefault()
    setSubmitted((s) => ({ ...s, [step]: true }))
    const errs = validatePaymentStep(form)
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs)
      return
    }

    const digits = form.card.replace(/\D+/g, '')
    const placed = placeOrder({
      name: form.name || user?.name,
      email: form.email || user?.email,
      phone: form.phone,
      address: `${form.address}, ${form.city} ${form.zip}, ${form.country}`,
      // only the last four digits are ever persisted
      cardLast4: digits.slice(-4),
      cardBrand: cardBrand(digits).brand,
    })
    if (placed) setOrder(placed)
  }

  /* An empty basket has nothing to check out — show the door rather than a
     form that cannot be submitted. */
  if (items.length === 0 && !order) {
    return (
      <main className="pg">
        <PageHeader
          label="Checkout"
          title="Your basket is empty."
          lede="Add a membership, a court session or an event and the checkout will open here."
          crumbs={[{ label: 'Home', href: paths.home }, { label: 'Checkout' }]}
        />
        <section className="pg-section section">
          <div className="shell ck-empty">
            <SmartLink href={paths.memberships} className="btn btn-member">
              Browse memberships <span className="btn-bubble"><Icon.arrow /></span>
            </SmartLink>
            <SmartLink href={paths.courts} className="btn btn-light">
              Book a court
            </SmartLink>
          </div>
        </section>
      </main>
    )
  }

  if (order) {
    return (
      <main className="pg">
        <section className="pg-section section">
          <div className="shell">
            {/* The confirmation arrives in sequence rather than all at once:
                the mark, then the name, then the detail. Each child picks
                up its delay from the container's stagger. */}
            <motion.div
              className="ck-done"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
              }}
            >
              <motion.span
                className="ck-done-ic"
                variants={{
                  hidden: { scale: 0.4, opacity: 0 },
                  show: {
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
                  },
                }}
              >
                <Icon.check />
              </motion.span>
              <motion.h1 className="h-md" variants={doneItem}>
                You&rsquo;re in, {order.details.name}.
              </motion.h1>
              <motion.p variants={doneItem}>
                Order <strong>{order.ref}</strong> is confirmed. A receipt is on its way to{' '}
                {order.details.email}, and your member card ships to {order.details.address}.
              </motion.p>
              <motion.div className="ck-done-total" variants={doneItem}>
                <span>Paid today</span>
                <strong>{money(order.totals.total)}</strong>
              </motion.div>
              <motion.p className="ck-sim" variants={doneItem}>
                Simulated checkout — no payment was taken and nothing left your browser.
                {order.details.cardLast4
                  ? ` Only ${order.details.cardBrand} ····${order.details.cardLast4} was recorded.`
                  : null}
              </motion.p>
              <motion.div className="ck-done-actions" variants={doneItem}>
                <button type="button" className="btn btn-member" onClick={() => navigate(paths.account)}>
                  See your orders <span className="btn-bubble"><Icon.arrow /></span>
                </button>
                <SmartLink href={paths.home} className="btn btn-light">
                  Back to the club
                </SmartLink>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    )
  }

  const brand = cardBrand(form.card)

  return (
    <main className="pg">
      <PageHeader
        label="Checkout"
        title="Join the club."
        lede="Four steps, nothing charged. Everything you enter stays in this browser."
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Checkout' }]}
      />

      <section className="pg-section section">
        <div className="shell">
          {!storageAvailable && (
            <p className="ck-warn" role="status">
              Your browser is blocking local storage, so this basket will not survive a
              reload. The checkout still works.
            </p>
          )}

          <div className="ck-layout">
            <div className="ck-main">
              <ol className="ck-steps">
                {STEPS.map((s, i) => (
                  <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>
                    <button
                      type="button"
                      className="ck-step-btn"
                      onClick={() => i < step && goTo(i)}
                      disabled={i >= step}
                      aria-current={i === step ? 'step' : undefined}
                    >
                      <span className="ck-step-n">{i < step ? <Icon.check /> : i + 1}</span>
                      {s}
                    </button>
                  </li>
                ))}
              </ol>

              <AnimatePresence mode="wait" initial={false} custom={dir}>
                {step === 0 && (
                  <motion.form
                    className="ck-form"
                    key="s0"
                    ref={formRef}
                    onSubmit={advance}
                    noValidate
                    {...stepIn(dir)}
                  >
                    <h2>Create your account</h2>
                    <p className="ck-note">
                      Local only — the profile is stored in this browser and the password is
                      checked for strength, then discarded. Nothing is sent anywhere.
                    </p>
                    <Field
                      label="Full name" name="name" autoComplete="name"
                      placeholder="Jane Doe"
                      value={form.name} onChange={set('name')}
                      error={errors.name} show={showErrors}
                    />
                    <Field
                      label="Email" name="email" type="email" autoComplete="email"
                      placeholder="you@email.com"
                      value={form.email} onChange={set('email')}
                      error={errors.email} show={showErrors}
                    />
                    <Field
                      label="Password" name="password" type="password"
                      autoComplete="new-password" placeholder="••••••••"
                      hint="At least 8 characters, with a letter and a number."
                      value={form.password} onChange={set('password')}
                      error={errors.password} show={showErrors}
                    />
                    <button className="btn btn-green ck-next" type="submit">
                      Continue <span className="btn-bubble"><Icon.arrow /></span>
                    </button>
                  </motion.form>
                )}

                {step === 1 && (
                  <motion.form
                    className="ck-form"
                    key="s1"
                    ref={formRef}
                    onSubmit={advance}
                    noValidate
                    {...stepIn(dir)}
                  >
                    <h2>Your details</h2>
                    <p className="ck-note">Signed in as {user?.email}.</p>
                    <Field
                      label="Full name" name="name" autoComplete="name"
                      value={form.name} onChange={set('name')}
                      error={errors.name} show={showErrors}
                    />
                    <Field
                      label="Email" name="email" type="email" autoComplete="email"
                      value={form.email} onChange={set('email')}
                      error={errors.email} show={showErrors}
                    />
                    <Field
                      label="Phone" name="phone" type="tel" autoComplete="tel"
                      inputMode="tel" placeholder="+1 555 0100"
                      value={form.phone} onChange={set('phone')}
                      error={errors.phone} show={showErrors}
                    />
                    <div className="ck-row">
                      <button className="btn btn-light" type="button" onClick={() => goTo(0)}>
                        Back
                      </button>
                      <button className="btn btn-green ck-next" type="submit">
                        Continue <span className="btn-bubble"><Icon.arrow /></span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form
                    className="ck-form"
                    key="s2"
                    ref={formRef}
                    onSubmit={advance}
                    noValidate
                    {...stepIn(dir)}
                  >
                    <h2>Where should the member card go?</h2>
                    <p className="ck-note">
                      Your access is live immediately — this is for the physical card and
                      welcome pack.
                    </p>
                    <Field
                      label="Street address" name="address" autoComplete="street-address"
                      placeholder="24 Lakeside Drive"
                      value={form.address} onChange={set('address')}
                      error={errors.address} show={showErrors}
                    />
                    <div className="ck-row2">
                      <Field
                        label="City" name="city" autoComplete="address-level2"
                        placeholder="Austin"
                        value={form.city} onChange={set('city')}
                        error={errors.city} show={showErrors}
                      />
                      <Field
                        label="Postal code" name="zip" autoComplete="postal-code"
                        placeholder="78701" maxLength={12}
                        value={form.zip} onChange={set('zip')}
                        error={errors.zip} show={showErrors}
                      />
                    </div>
                    <Field
                      label="Country" name="country" autoComplete="country-name"
                      options={COUNTRIES}
                      value={form.country} onChange={set('country')}
                      error={errors.country} show={showErrors}
                      hint="The postal-code format is checked against this country."
                    />
                    <div className="ck-row">
                      <button className="btn btn-light" type="button" onClick={() => goTo(1)}>
                        Back
                      </button>
                      <button className="btn btn-green ck-next" type="submit">
                        Continue <span className="btn-bubble"><Icon.arrow /></span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.form
                    className="ck-form"
                    key="s3"
                    ref={formRef}
                    onSubmit={pay}
                    noValidate
                    {...stepIn(dir)}
                  >
                    <h2>Payment</h2>
                    <p className="ck-note">
                      Simulated — nothing is charged. The number is still checked with the
                      Luhn algorithm, so a typo is caught here. Try 4242&nbsp;4242&nbsp;4242&nbsp;4242.
                    </p>
                    <Field
                      label={`Card number${brand.brand !== 'Card' ? ` · ${brand.brand}` : ''}`}
                      name="card" autoComplete="cc-number" inputMode="numeric"
                      placeholder="4242 4242 4242 4242" mask={maskCard}
                      value={form.card} onChange={set('card')}
                      error={errors.card} show={showErrors}
                    />
                    <div className="ck-row2">
                      <Field
                        label="Expiry" name="exp" autoComplete="cc-exp" inputMode="numeric"
                        placeholder="04 / 29" mask={maskExpiry}
                        value={form.exp} onChange={set('exp')}
                        error={errors.exp} show={showErrors}
                      />
                      <Field
                        label="Security code" name="cvc" autoComplete="cc-csc"
                        inputMode="numeric" placeholder="123" mask={maskCvc}
                        value={form.cvc} onChange={set('cvc')}
                        error={errors.cvc} show={showErrors}
                        hint={`${brand.cvc} digits`}
                      />
                    </div>
                    <div className="ck-row">
                      <button className="btn btn-light" type="button" onClick={() => goTo(2)}>
                        Back
                      </button>
                      <button className="btn btn-green ck-next" type="submit">
                        Pay {money(totals.total)} <span className="btn-bubble"><Icon.arrow /></span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <aside className="ck-sum">
              <h2 className="ck-sum-h">Order summary</h2>
              <div className="ck-sum-items">
                {items.map((it) => (
                  <div className="ck-sum-item" key={it.id}>
                    <span className="ck-sum-q">{it.qty}×</span>
                    <span className="ck-sum-n">
                      <strong>{it.name}</strong>
                      <span>{it.meta}</span>
                    </span>
                    <span className="ck-sum-p">{money(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="ck-sum-lines">
                <div><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
                <div>
                  <span>Delivery</span>
                  <span>{totals.shipping ? money(totals.shipping) : 'Free'}</span>
                </div>
                <div>
                  <span>Tax ({(TAX_RATE * 100).toFixed(2)}%)</span>
                  <span>{money(totals.tax)}</span>
                </div>
              </div>
              <div className="ck-sum-total">
                <span>Total</span>
                <strong>{money(totals.total)}</strong>
              </div>
              <SmartLink href={paths.memberships} className="ck-sum-back">
                Add something else
              </SmartLink>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
