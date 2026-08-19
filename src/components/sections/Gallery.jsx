import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Reveal, Icon } from '../ui'
import { local } from '../../data/images'

// One shot per space in the club — every photograph in public/img that is not
// already carrying a section of its own gets its moment here.
const SHOTS = [
  { img: local('courts.jpg'), label: 'The Lawns', meta: 'Six open-air hard courts', href: '#endless' },
  { img: local('clay.jpg'), label: 'Centre Court', meta: 'Floodlit championship clay', href: '#endless' },
  { img: local('strength.jpg'), label: 'The Strength Room', meta: 'Conditioning & mobility', href: '#tailored' },
  { img: local('woodcourt.jpg'), label: 'The Hidden Court', meta: 'Members practice, in the trees', href: '#endless' },
  { img: local('rackets.jpg'), label: 'The Pro Shop', meta: 'Demo, restring & fit', href: '#elevate' },
  { img: local('swim.jpg'), label: 'The Pool', meta: '25m saltwater lanes', href: '#elevate' },
  { img: local('golf.jpg'), label: 'Lakeside Greens', meta: '18-hole members course', href: '#endless' },
  { img: local('runners.jpg'), label: 'The Track', meta: 'Dawn & dusk run club', href: '#tailored' },
  { img: local('ball.jpg'), label: 'Practice Wall', meta: 'Drills & ball machines', href: '#tailored' },
  { img: local('yoga.jpg'), label: 'The Studio', meta: 'Mobility, pilates & flow', href: '#elevate' },
  { img: local('night.jpg'), label: 'Floodlit Nights', meta: 'Play until midnight', href: '#endless' },
  { img: local('scrum.jpg'), label: 'The Field', meta: 'Team sport & corporate days', href: '#join' },
  { img: local('palms.jpg'), label: 'The Grounds', meta: 'Gardens & terraces', href: '#elevate' },
  { img: local('cycling.jpg'), label: 'The Ride Room', meta: 'Road club & watt bikes', href: '#tailored' },
  { img: local('player.jpg'), label: 'Match Play', meta: 'Leagues & socials', href: '#join' },
  { img: local('floodlights.jpg'), label: 'Groundskeeping', meta: 'Surfaces kept to tour spec', href: '#elevate' },
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
          <motion.a
            href={s.href}
            className="gshot"
            key={s.label}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={s.img} alt={s.label} loading="lazy" />
            <span className="gshot-scrim" />
            <span className="gshot-go"><Icon.arrowUR /></span>
            <div className="gshot-text">
              <strong>{s.label}</strong>
              <span>{s.meta}</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
