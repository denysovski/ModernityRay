import { Icon, Reveal } from '../ui'
import { TESTIMONIALS } from '../../data'

function Card({ t }) {
  return (
    <figure className="tm-card">
      <span className="tm-quote"><Icon.quote /></span>
      <blockquote>{t.quote}</blockquote>
      <figcaption className="tm-person">
        <img src={t.img} alt={t.name} loading="lazy" />
        <span className="tm-meta">
          <strong>{t.name}</strong>
          <span>{t.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

function Row({ items, dir }) {
  const loop = [...items, ...items]
  return (
    <div className="tm-row-wrap">
      <div className={`tm-row ${dir === 'right' ? 'tm-row-right' : 'tm-row-left'}`}>
        {loop.map((t, i) => (
          <Card t={t} key={`${t.name}-${i}`} />
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const top = TESTIMONIALS.slice(0, 4)
  const bottom = TESTIMONIALS.slice(4)
  return (
    <section className="section testimonials" id="testimonials">
      <Reveal className="tm-head shell">
        <span className="tm-badge">
          <span className="tm-badge-ic"><Icon.star /></span>
          Rated 4.9 / 5 by over 5,000 members
        </span>
        <h2 className="h-lg">
          Words of praise from <br /> our members.
        </h2>
      </Reveal>

      <div className="tm-rows">
        <Row items={top} dir="left" />
        <Row items={bottom} dir="right" />
      </div>
    </section>
  )
}
