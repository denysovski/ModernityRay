import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isInternal } from '../../routes'
import { anchorTarget, scrollToAnchor } from '../../lib/scroll'

/* One link component for the whole app.
 *
 * Content data mixes three kinds of destination: app routes ('/events'),
 * same-page anchors ('#join') and outside URLs. SmartLink decides per href.
 * Routes become react-router <Link> (client-side, no reload); outside URLs
 * get rel/target; anchors scroll the page themselves (see below).
 *
 * Forwards its ref so framer-motion can animate it via motion.create().
 */

/** True for '#section' style hrefs that point inside the current page. */
const isHash = (href) => typeof href === 'string' && href.startsWith('#') && href.length > 1

/** A click that the browser should handle itself: new tab, new window, etc. */
const isModified = (event) =>
  event.defaultPrevented ||
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey

const SmartLink = forwardRef(function SmartLink(
  { href, to, children, external, onClick, ...rest },
  ref,
) {
  const target = to ?? href

  /* Anchors are scrolled by us rather than by the browser.
   *
   * Letting the browser do it was unreliable here: the click updated the URL
   * and the page did not move, while the same hash set from script scrolled
   * correctly. Rather than depend on that, the component scrolls the target
   * itself and writes the hash into the address bar afterwards, so the
   * behaviour is identical everywhere and can be tested.
   *
   * lib/scroll owns the aiming, because the homepage sections move while
   * you scroll towards them and a single jump lands short. */
  if (isHash(target) && !external) {
    const handleHash = (event) => {
      onClick?.(event)
      if (isModified(event)) return

      const el = anchorTarget(target)
      if (!el) return

      event.preventDefault()
      scrollToAnchor(el)
      // replace rather than push: the section is not a separate destination,
      // and a history entry per anchor makes the back button useless
      window.history.replaceState(window.history.state, '', target)
    }

    return (
      <a ref={ref} href={target} onClick={handleHash} {...rest}>
        {children}
      </a>
    )
  }

  if (isInternal(target) && !external) {
    return (
      <Link ref={ref} to={target} onClick={onClick} {...rest}>
        {children}
      </Link>
    )
  }

  const outside = external || /^https?:\/\//.test(target || '')
  return (
    <a
      ref={ref}
      href={target}
      onClick={onClick}
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
