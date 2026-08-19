import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Reveal } from '../ui'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3500)
  }

  return (
    <section className="section newsletter" id="newsletter">
      <div className="shell">
        <Reveal className="nl-card">
          <div className="nl-glow" />
          <div className="nl-inner">
            <span className="micro micro-dark"><Icon.star className="deco-star deco-star-light" /> Stay in the loop</span>
            <h2 className="h-lg nl-title">Get the club in your inbox.</h2>
            <p className="nl-sub">
              Monthly drops on member sales, new events, court openings and the
              odd surprise — no noise, unsubscribe anytime.
            </p>

            <form className="nl-form" onSubmit={submit}>
              <div className="nl-field">
                <Icon.search className="nl-mail" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
              </div>
              <button type="submit" className="btn nl-subscribe">
                Subscribe <span className="nl-sub-bubble"><Icon.arrow /></span>
              </button>
            </form>

            <AnimatePresence>
              {sent && (
                <motion.span
                  className="nl-thanks"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Icon.check /> You&rsquo;re in — check your inbox to confirm.
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
