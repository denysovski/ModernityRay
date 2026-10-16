import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import SocialDock from '../components/layout/SocialDock'
import Footer from '../components/layout/Footer'
import Commerce from '../components/commerce/Commerce'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'
import { anchorTarget, scrollToAnchor } from '../lib/scroll'

/* The shell every route renders inside.
 *
 * Mounted once, above the router outlet, so the navbar, the cart drawer and
 * the footer are never torn down and remounted by navigation — which is the
 * whole point of a single-page app, and the reason the basket keeps its state
 * and its open/closed drawer across a route change.
 */

export default function RootLayout() {
  const { prefs } = useStore()
  const { pathname, hash } = useLocation()
  const isHome = pathname === paths.home
  const { scrollYProgress } = useScroll()
  const railX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  /* Each view sets its own title. Doing it here as a fallback keeps the tab
     honest if a route ever forgets to. */
  useEffect(() => {
    if (!document.title) document.title = 'CourtSy'
  }, [pathname])

  /* In-page anchors (#tailored, #join, the hero cards) need handling of our
     own. Clicking one changes the location, which makes <ScrollRestoration>
     restore the scroll position recorded for that history entry, and that
     undoes the browser's jump to the target: the URL gained a hash and the
     page did not move at all.
     Running after it, on the next frame, puts the scroll where the anchor
     actually points. This covers a cold load of /#section; clicks are
     handled by SmartLink. Both go through lib/scroll. */
  useEffect(() => {
    if (!hash) return undefined
    const target = anchorTarget(hash)
    if (!target) return undefined

    const frame = requestAnimationFrame(() => scrollToAnchor(target))
    return () => cancelAnimationFrame(frame)
  }, [hash, pathname])

  return (
    /* reducedMotion="user" makes framer honour the OS setting across every
       animation in the tree; the account view can force it on regardless. */
    <MotionConfig reducedMotion={prefs.reducedMotion ? 'always' : 'user'}>
      <motion.div className="scroll-rail" style={{ scaleX: railX }} />
      <Navbar />
      <Commerce />
      {/* Fixed to the left edge, over the hero. On a text view it would sit
          on top of the copy, so it stays on the homepage — the same links
          are in the footer everywhere. */}
      {isHome && <SocialDock />}
      <Outlet />
      <Footer />
      {/* Restores scroll position per history entry: back goes where you were,
          a new route starts at the top. */}
      <ScrollRestoration />
    </MotionConfig>
  )
}
