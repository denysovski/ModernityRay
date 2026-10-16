import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Reveal } from '../ui'
import { validateEmail } from '../../lib/validation'

/* The sign-up card.
 *
 * Takes its wording from props so the same component can close the homepage
 * and the events calendar without either one pretending to be the other.
 * Nothing is sent anywhere; the address is validated and then forgotten.
 */
export default function Newsletter({
  label = 'Stay in the loop',
  title = 'Get the club in your inbox.',
  copy = 'Monthly drops on member sales, new events, court openings and the odd surprise. No noise, unsubscribe anytime.',
  id = 'newsletter',
}) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    const problem = validateEmail(email)
    if (problem) {
      setError(problem)
      return
    }
    setError(null)
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3500)
  }

  return (
    <section className="section newsletter" id={id}>
      <div className="shell">
        <Reveal className="nl-card">
          <div className="nl-glow" />
          <div className="nl-inner">
            <span className="micro micro-dark">
              <Icon.star className="deco-star deco-star-light" /> {label}
            </span>
            <h2 className="h-lg nl-title">{title}</h2>
            <p className="nl-sub">{copy}</p>

            <form className="nl-form" onSubmit={submit} noValidate>
              <div className="nl-field">
                <Icon.search className="nl-mail" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  aria-label="Email address"
                  aria-invalid={error ? 'true' : undefined}
                />
              </div>
              <button type="submit" className="btn nl-subscribe">
                Subscribe <span className="nl-sub-bubble"><Icon.arrow /></span>
              </button>
            </form>

            {error && (
              <span className="nl-error" role="alert">
                {error}
              </span>
            )}

            <AnimatePresence>
              {sent && (
                <motion.span
                  className="nl-thanks"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Icon.check /> You&rsquo;re in. Check your inbox to confirm.
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
