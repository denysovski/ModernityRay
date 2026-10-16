import { motion } from 'framer-motion'
import { Icon, SmartLink } from '../ui'

/* The masthead every routed view opens with.
 *
 * Pulled out because all eight subviews need the same thing — a breadcrumb, a
 * micro-label, a heading and a standfirst — and copying that markup eight
 * times is how a design drifts apart. Views pass content; this owns layout,
 * spacing and the entrance animation.
 */

const ease = [0.22, 1, 0.36, 1]

/**
 * @param {object} props
 * @param {string} props.label      small uppercase label above the title
 * @param {string} props.title
 * @param {string} [props.lede]
 * @param {{label: string, href?: string}[]} [props.crumbs]  last item is the current page
 * @param {React.ReactNode} [props.aside]  pulled right on wide screens
 * @param {React.ReactNode} [props.children]  renders under the standfirst
 */
export default function PageHeader({ label, title, lede, crumbs = [], aside, children }) {
  return (
    <header className="pg-head">
      <div className="shell">
        {crumbs.length > 0 && (
          <nav className="pg-crumbs" aria-label="Breadcrumb">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1
              return (
                <span className="pg-crumb" key={`${c.label}-${i}`}>
                  {c.href && !last ? (
                    <SmartLink href={c.href}>{c.label}</SmartLink>
                  ) : (
                    <span aria-current={last ? 'page' : undefined}>{c.label}</span>
                  )}
                  {!last && <Icon.chevron className="pg-crumb-sep" />}
                </span>
              )
            })}
          </nav>
        )}

        <div className="pg-head-grid">
          <motion.div
            className="pg-head-text"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
          >
            {label && (
              <span className="micro">
                <Icon.star className="deco-star" /> {label}
              </span>
            )}
            <h1 className="h-lg pg-title">{title}</h1>
            {lede && <p className="lede pg-lede">{lede}</p>}
            {children}
          </motion.div>

          {aside && (
            <motion.div
              className="pg-head-aside"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease, delay: 0.1 }}
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}
