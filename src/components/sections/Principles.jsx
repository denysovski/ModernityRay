import { motion } from 'framer-motion'
import { Icon, Reveal } from '../ui'
import { PRINCIPLES } from '../../data'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Principles() {
  return (
    <section className="section principles" id="principles">
      <div className="shell">
        <Reveal className="pr-head">
          <span className="micro"><Icon.star className="deco-star" /> What we&rsquo;re built on</span>
          <h2 className="h-lg">The details we never skip.</h2>
          <p className="lede pr-lede">
            A club is only as good as the standards behind it. These are the
            principles every session, surface and conversation is held to.
          </p>
        </Reveal>

        <motion.div
          className="pr-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PRINCIPLES.map((p) => (
            <motion.div className="pr-card" variants={item} key={p.n}>
              <span className="pr-n">{p.n}</span>
              <span className="pr-line" />
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
