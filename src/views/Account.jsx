import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import Field from '../components/commerce/Field'
import { Icon, SmartLink } from '../components/ui'
import { useStore } from '../context/StoreContext'
import { validateEmail, validateName } from '../lib/validation'
import { formatDate } from '../lib/format'
import { paths } from '../routes'

/* View 9 of 9 — profile, preferences and order history.
 *
 * This is the view that makes the storage layer visible. Orders written by the
 * checkout are read back here, the profile is editable (and re-validated on
 * save), and the preferences genuinely change the app: reduced motion is
 * handed to framer-motion's MotionConfig in RootLayout, and tax-inclusive
 * pricing changes what the membership cards show.
 *
 * "Forget me" wipes every key the app owns — the only honest answer to a
 * local-only account, and worth demonstrating rather than hiding.
 */

const ease = [0.22, 1, 0.36, 1]

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'Orders' },
  { id: 'settings', label: 'Settings' },
]

const PREFS = [
  {
    key: 'reducedMotion',
    label: 'Reduce motion',
    desc: 'Turns off the scroll parallax and section reveals. Your system setting is honoured either way.',
  },
  {
    key: 'taxInclusivePrices',
    label: 'Show prices with tax',
    desc: 'Membership cards show the amount including the 8.25% rate instead of the pre-tax price.',
  },
  {
    key: 'emailReceipts',
    label: 'Email receipts',
    desc: 'Simulated — no mail is sent, but the preference is stored with your profile.',
  },
]

export default function Account() {
  const {
    user, orders, prefs, lifetimeSpend, storageAvailable,
    signIn, signOut, forgetMe, setPref, money,
  } = useStore()

  const [tab, setTab] = useState('profile')
  const [draft, setDraft] = useState({ name: user?.name || '', email: user?.email || '' })
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'Your account — CourtSy'
  }, [])

  /* Same pattern as the checkout: errors are derived from the draft, not
     stored, so a field clears the instant it becomes valid. */
  const errors = useMemo(
    () => {
      const out = {}
      const name = validateName(draft.name)
      if (name) out.name = name
      const email = validateEmail(draft.email)
      if (email) out.email = email
      return out
    },
    [draft],
  )

  const save = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return
    signIn({ name: draft.name, email: draft.email })
    setSaved(true)
    setSubmitted(false)
    window.setTimeout(() => setSaved(false), 2600)
  }

  const wipe = () => {
    // eslint-disable-next-line no-alert -- a destructive local action deserves a confirm
    if (!window.confirm('This clears your profile, basket and order history from this browser. Continue?')) return
    forgetMe()
    setDraft({ name: '', email: '' })
    setTab('profile')
  }

  if (!user) {
    return (
      <main className="pg">
        <PageHeader
          label="Account"
          title="No profile on this browser yet."
          lede="The account is created during checkout and lives only in this browser — there is no server to sign in to."
          crumbs={[{ label: 'Home', href: paths.home }, { label: 'Account' }]}
        />
        <section className="pg-section section">
          <div className="shell ck-empty">
            <SmartLink href={paths.memberships} className="btn btn-member">
              Choose a membership <span className="btn-bubble"><Icon.arrow /></span>
            </SmartLink>
            <SmartLink href={paths.events} className="btn btn-light">
              See what&rsquo;s on
            </SmartLink>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="pg">
      <PageHeader
        label="Account"
        title={user.name || user.email}
        lede={
          user.since
            ? `Member on this browser since ${formatDate(user.since.slice(0, 10))}.`
            : 'Your profile, orders and preferences.'
        }
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Account' }]}
        aside={
          <div className="acc-summary">
            <div>
              <span className="acc-summary-n display">{orders.length}</span>
              <span className="acc-summary-l">{orders.length === 1 ? 'order' : 'orders'}</span>
            </div>
            <div>
              <span className="acc-summary-n display">{money(lifetimeSpend)}</span>
              <span className="acc-summary-l">lifetime</span>
            </div>
          </div>
        }
      />

      <section className="pg-section section">
        <div className="shell">
          <div className="tier-filters acc-tabs" role="tablist" aria-label="Account sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                className={`chip-btn ${tab === t.id ? 'on' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {t.id === 'orders' && orders.length > 0 && (
                  <span className="acc-tab-n">{orders.length}</span>
                )}
              </button>
            ))}
          </div>

          {!storageAvailable && (
            <p className="ck-warn" role="status">
              Local storage is unavailable in this browser, so nothing here will persist
              after a reload.
            </p>
          )}

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="acc-panel"
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
          >
            {tab === 'profile' && (
              <form className="ck-form acc-form" onSubmit={save} noValidate>
                <h2>Your profile</h2>
                <p className="ck-note">
                  Stored under <code>courtsy.user</code> in this browser&rsquo;s local storage.
                  No password is kept, here or anywhere.
                </p>
                <Field
                  label="Full name" name="name" autoComplete="name"
                  value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
                  error={errors.name} show={submitted}
                />
                <Field
                  label="Email" name="email" type="email" autoComplete="email"
                  value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                  error={errors.email} show={submitted}
                />
                <div className="ck-row">
                  <button type="submit" className="btn btn-green">
                    Save changes
                  </button>
                  <button type="button" className="btn btn-light" onClick={signOut}>
                    Sign out
                  </button>
                </div>
                {saved && (
                  <p className="acc-saved" role="status">
                    <Icon.check /> Profile saved.
                  </p>
                )}
              </form>
            )}

            {tab === 'orders' && (
              <div className="acc-orders">
                {orders.length === 0 ? (
                  <p className="pg-empty">
                    No orders yet.{' '}
                    <SmartLink href={paths.memberships} className="link-btn">
                      Pick a membership
                    </SmartLink>{' '}
                    and the receipt will appear here.
                  </p>
                ) : (
                  orders.map((o) => (
                    <article className="acc-order" key={o.ref}>
                      <header className="acc-order-head">
                        <div>
                          <strong>{o.ref}</strong>
                          <span>{formatDate(o.placedAt.slice(0, 10))}</span>
                        </div>
                        <span className="acc-order-total">{money(o.totals.total)}</span>
                      </header>
                      <ul className="acc-order-items">
                        {o.items.map((it) => (
                          <li key={it.id}>
                            <span>{it.qty}× {it.name}</span>
                            <span>{money(it.price * it.qty)}</span>
                          </li>
                        ))}
                      </ul>
                      <footer className="acc-order-foot">
                        <span>{o.details.address}</span>
                        {o.details.cardLast4 && (
                          <span>{o.details.cardBrand} ····{o.details.cardLast4}</span>
                        )}
                      </footer>
                    </article>
                  ))
                )}
              </div>
            )}

            {tab === 'settings' && (
              <div className="acc-settings">
                <h2>Preferences</h2>
                <p className="ck-note">
                  Stored under <code>courtsy.prefs</code>. These change the app immediately,
                  not just this screen.
                </p>
                {PREFS.map((p) => (
                  <label className="acc-pref" key={p.key}>
                    <span className="acc-pref-text">
                      <strong>{p.label}</strong>
                      <span>{p.desc}</span>
                    </span>
                    <span className="switch">
                      <input
                        type="checkbox"
                        checked={prefs[p.key]}
                        onChange={(e) => setPref(p.key, e.target.checked)}
                      />
                      <span className="switch-track"><span className="switch-dot" /></span>
                    </span>
                  </label>
                ))}

                <div className="acc-danger">
                  <div>
                    <strong>Forget me</strong>
                    <p>
                      Clears the profile, the basket and every stored order from this
                      browser. There is no copy anywhere else, so this cannot be undone.
                    </p>
                  </div>
                  <button type="button" className="btn btn-light acc-danger-btn" onClick={wipe}>
                    Clear all my data
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
