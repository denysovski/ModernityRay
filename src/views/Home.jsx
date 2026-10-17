import Hero from '../components/sections/Hero'
import Tailored from '../components/sections/Tailored'
import Endless from '../components/sections/Endless'
import Gallery from '../components/sections/Gallery'
import Elevate from '../components/sections/Elevate'
import Testimonials from '../components/sections/Testimonials'
import Membership from '../components/sections/Membership'
import Events from '../components/sections/Events'
import Principles from '../components/sections/Principles'
import Newsletter from '../components/sections/Newsletter'
import Marquee from '../components/sections/Marquee'
import { Depth, useSeo } from '../components/ui'
import { local } from '../data/images'

/* View 1 of 9 — the landing page.
 *
 * Long-scroll storytelling: the hero drives its own parallax and every section
 * below rides the scroll on a slight 3D tilt (see Depth in components/ui/motion).
 * Each section is its own component and reads its own slice of src/data, so
 * reordering the page is reordering this list.
 *
 * Sections that have grown into their own routes (memberships, events) keep a
 * short teaser here that links through, rather than repeating the full detail.
 */
export default function Home() {
  /* The homepage is the one title without a page part: pageTitle() turns
     an absent title into the brand plus its positioning, which is what a
     result for "CourtSy" should read as. */
  useSeo({
    description:
      'A private members’ sport club: championship clay, six floodlit hard courts, eighteen lakeside holes, a strength pavilion and a heated pool, with coaching and recovery included.',
    image: local('aerial.jpg'),
  })

  return (
    <main className="stage" id="top">
      <Hero />
      <Depth><Tailored /></Depth>
      <Depth strength={0.8}><Endless /></Depth>
      <Depth strength={0.6}><Gallery /></Depth>
      <Depth><Elevate /></Depth>
      <Depth strength={0.9}><Testimonials /></Depth>
      <Depth><Membership /></Depth>
      <Depth><Events /></Depth>
      <Depth strength={0.9}><Principles /></Depth>
      <Depth strength={0.7}><Newsletter /></Depth>
      {/* The marquee is the one section that is already in motion, and
          riding the scroll tilt on top of that made the wordmark swim
          forward and back. It keeps its own right-to-left scroll and sits
          flat on the page. */}
      <Marquee />
    </main>
  )
}
