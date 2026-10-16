import { useCallback, useEffect, useState } from 'react'
import { ScrollRestoration, useLocation, useOutlet } from 'react-router-dom'
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import SocialDock from '../components/layout/SocialDock'
import Footer from '../components/layout/Footer'
import Commerce from '../components/commerce/Commerce'
import Intro, { introPending } from '../components/layout/Intro'
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

  /* The arrival sequence runs once per session, and only on the homepage:
     someone who deep-links to a membership page came for that page.
     Read lazily so the decision is made before the first paint. */
  const [intro, setIntro] = useState(() => isHome && introPending())
  const endIntro = useCallback(() => setIntro(false), [])

  /* useOutlet, not <Outlet />: it returns the current route's element as a
     value. <Outlet /> is a component that always renders whatever route is
     active now, which is exactly what broke the first attempt at page
     transitions (see below). */
  const outlet = useOutlet()
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
      {/* Page transition: the new view fades up on arrival.

          An earlier version wrapped this in <AnimatePresence mode="wait"> to
          get an exit animation too, and it blanked the whole site. Two
          reasons, both worth remembering:

          1. <Outlet /> is not a snapshot. The exiting copy and the entering
             copy rendered the same (new) route, so AnimatePresence never saw
             a clean swap and left the wrapper parked at its exit values:
             opacity 0. The content was in the DOM, which is why it still
             passed every text-based check, but nothing was visible.
          2. mode="wait" means nothing at all is rendered between the exit
             finishing and the entrance starting. On a route whose chunk is
             still loading, that reads as a broken page.

          Keying the element on pathname remounts it, which replays the
          entrance on its own. No exit, no dead frame, nothing to get stuck
          in. */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {outlet}
      </motion.div>
      <Footer />
      {/* Restores scroll position per history entry: back goes where you were,
          a new route starts at the top. */}
      <ScrollRestoration />

      {intro && <Intro onDone={endIntro} />}
    </MotionConfig>
  )
}
