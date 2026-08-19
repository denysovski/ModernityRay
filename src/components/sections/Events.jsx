import { motion } from 'framer-motion'
import { Icon, Reveal } from '../ui'
import { EVENTS } from '../../data'

function EventCard({ e, big }) {
  return (
    <motion.a
      href={e.href}
      className={`ev-card ${big ? 'ev-big' : 'ev-small'}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={e.img} alt={e.title} loading="lazy" />
      <div className="ev-scrim" />
      <span className="ev-tag">{e.tag}</span>
      <div className="ev-body">
        <div className="ev-text">
          <h3>{e.title}</h3>
          <span className="ev-meta">{e.meta}</span>
        </div>
        <span className="btn btn-member ev-btn">
          {e.cta} <span className="btn-bubble"><Icon.arrow /></span>
        </span>
      </div>
    </motion.a>
  )
}

export default function Events() {
  return (
    <section className="section events" id="events">
      <div className="shell">
        <Reveal className="ev-head">
          <span className="micro"><Icon.star className="deco-star" /> What&rsquo;s on</span>
          <h2 className="h-lg">Events at the club.</h2>
          <p className="lede ev-lede">
            Leagues, clinics and socials run all season — there&rsquo;s always a
            reason to be here.
          </p>
        </Reveal>

        <div className="ev-grid">
          <EventCard e={EVENTS.feature} big />
          <div className="ev-col">
            {EVENTS.small.map((e) => (
              <EventCard e={e} key={e.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
