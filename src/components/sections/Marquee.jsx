import { motion } from 'framer-motion'

export default function Marquee() {
  const items = Array.from({ length: 6 })
  return (
    <section className="marquee" aria-hidden>
      <motion.div
        className="marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {items.concat(items).map((_, i) => (
          <span className="marquee-item" key={i}>
            Join The Club <span className="marquee-dot">•</span>
          </span>
        ))}
      </motion.div>
    </section>
  )
}
