import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Reveal, Icon, Img, MotionLink } from '../ui'
import { local } from '../../data/images'
import { paths } from '../../routes'

/* One shot per space in the club — every photograph in public/img that is not
   already carrying a section of its own gets its moment here.

   Each tile names a real place or service, so each one opens that place's
   page. They scrolled to a homepage section while the facilities and
   programmes lived here; now that every one of them is a route, a tile that
   says "The Pro Shop" should open the shop. */
const SHOTS = [
  { img: local('courts.jpg'), label: 'The Lawns', meta: 'Six open-air hard courts', href: paths.court('the-lawns') },
  { img: local('clay.jpg'), label: 'Centre Court', meta: 'Floodlit championship clay', href: paths.court('centre-court') },
  { img: local('strength.jpg'), label: 'The Strength Room', meta: 'Conditioning & mobility', href: paths.programme('strength-conditioning') },
  { img: local('woodcourt.jpg'), label: 'The Hidden Court', meta: 'Members practice, in the trees', href: paths.courts },
  { img: local('rackets.jpg'), label: 'The Pro Shop', meta: 'Demo, restring & fit', href: paths.shop },
  { img: local('swim.jpg'), label: 'The Pool', meta: '25m saltwater lanes', href: paths.court('lakeside-pool') },
  { img: local('golf.jpg'), label: 'Lakeside Greens', meta: '18-hole members course', href: paths.court('golf-greens') },
  { img: local('runners.jpg'), label: 'The Track', meta: 'Dawn & dusk run club', href: paths.programme('cardio-hiit') },
  { img: local('ball.jpg'), label: 'Practice Wall', meta: 'Drills & ball machines', href: paths.programme('tennis-performance') },
  { img: local('yoga.jpg'), label: 'The Studio', meta: 'Mobility, pilates & flow', href: paths.programme('recovery-mobility') },
  { img: local('night.jpg'), label: 'Floodlit Nights', meta: 'Play until midnight', href: paths.court('centre-court') },
  { img: local('scrum.jpg'), label: 'The Field', meta: 'Team sport & corporate days', href: paths.membership('corporate') },
  { img: local('palms.jpg'), label: 'The Grounds', meta: 'Gardens & terraces', href: paths.dining },
  { img: local('cycling.jpg'), label: 'The Ride Room', meta: 'Road club & watt bikes', href: paths.programme('endurance-road') },
  { img: local('player.jpg'), label: 'Match Play', meta: 'Leagues & socials', href: paths.programme('match-play-league') },
  { img: local('floodlights.jpg'), label: 'Groundskeeping', meta: 'Surfaces kept to tour spec', href: paths.courts },
]

export default function Gallery() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // % is relative to the track's own width — the range is tuned so the longer
  // 16-shot track travels roughly the same distance on screen as the old one
  const raw = useTransform(scrollYProgress, [0, 1], ['16%', '-90%'])
  const x = useSpring(raw, { stiffness: 200, damping: 20, mass: 0.28 })

  return (
    <section className="gallery" ref={ref}>
      <motion.div className="gallery-track" style={{ x }}>
        {SHOTS.map((s) => (
          <MotionLink
            href={s.href}
            className="gshot"
            key={s.label}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Img
              src={s.img}
              alt={s.label}
              /* matches .gshot: clamp(420px, 42vw, 590px) */
              sizes="(max-width: 700px) 70vw, (max-width: 1400px) 42vw, 590px"
            />
            <span className="gshot-scrim" />
            <span className="gshot-go"><Icon.arrowUR /></span>
            <div className="gshot-text">
              <strong>{s.label}</strong>
              <span>{s.meta}</span>
            </div>
          </MotionLink>
        ))}
      </motion.div>
    </section>
  )
}
