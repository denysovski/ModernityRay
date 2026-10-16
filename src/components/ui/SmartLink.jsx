import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isInternal } from '../../routes'

/* One link component for the whole app.
 *
 * Content data mixes three kinds of destination — app routes ('/events'),
 * same-page anchors ('#join') and outside URLs — and every navigation surface
 * was previously hardcoding <a>. SmartLink decides per href: routes become
 * react-router <Link> (client-side, no reload), anchors and external URLs stay
 * plain anchors, with rel/target added for the external ones.
 *
 * Forwards its ref so framer-motion can animate it via motion(SmartLink).
 */
const SmartLink = forwardRef(function SmartLink({ href, to, children, external, ...rest }, ref) {
  const target = to ?? href

  if (isInternal(target) && !external) {
    return (
      <Link ref={ref} to={target} {...rest}>
        {children}
      </Link>
    )
  }

  const outside = external || /^https?:\/\//.test(target || '')
  return (
    <a
      ref={ref}
      href={target}
      {...(outside ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...rest}
    >
      {children}
    </a>
  )
})

export default SmartLink

/** Animated variant, for the staggered menu and card reveals. */
export const MotionLink = motion.create(SmartLink)
