import { motion, useScroll, useSpring } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import SocialDock from './components/layout/SocialDock'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Tailored from './components/sections/Tailored'
import Endless from './components/sections/Endless'
import Gallery from './components/sections/Gallery'
import Elevate from './components/sections/Elevate'
import Testimonials from './components/sections/Testimonials'
import Membership from './components/sections/Membership'
import Events from './components/sections/Events'
import Principles from './components/sections/Principles'
import Newsletter from './components/sections/Newsletter'
import Marquee from './components/sections/Marquee'
import Commerce from './components/commerce/Commerce'
import { Depth } from './components/ui'
import './styles/app.css'

export default function App() {
  const { scrollYProgress } = useScroll()
  const railX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <>
      <motion.div className="scroll-rail" style={{ scaleX: railX }} />
      <Navbar />
      <Commerce />
      <SocialDock />
      {/* Hero drives its own parallax; every section below rides the scroll
          on a slight 3D tilt (see Depth in components/ui/motion) */}
      <main className="stage">
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
        <Depth strength={0.5}><Marquee /></Depth>
      </main>
      <Footer />
    </>
  )
}
