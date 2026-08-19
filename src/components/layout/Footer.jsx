import { motion } from 'framer-motion'
import { Icon, Stagger, upItem } from '../ui'

export default function Footer() {
  const cols = [
    { h: 'Courts', items: ['Centre Court', 'The Lawns', 'Golf Greens', 'Book a court'] },
    { h: 'Lifestyle', items: ['Merchandise', 'Memberships', 'Wellness & Spa', 'Events'] },
    { h: 'Club', items: ['About us', 'Coaches', 'Careers', 'Contact'] },
    { h: 'Social', items: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube'] },
  ]
  return (
    <footer className="footer" id="join">
      <div className="footer-pad">
        <Stagger className="footer-grid" amount={0.1}>
          <motion.div className="footer-brandcol" variants={upItem}>
            <a href="#top" className="nav-logo footer-logo">
              CourtSy<span>.</span>
            </a>
            <p className="footer-sub">A private members&rsquo; sport club. Start today, play forever.</p>
            <a href="#top" className="btn btn-member footer-join">
              Become a member <span className="btn-bubble"><Icon.arrow /></span>
            </a>
          </motion.div>
          {cols.map((c) => (
            <motion.div className="footer-col" key={c.h} variants={upItem}>
              <h4>{c.h}</h4>
              {c.items.map((it) => (
                <a href="#top" key={it}>
                  {it}
                </a>
              ))}
            </motion.div>
          ))}
        </Stagger>

        <div className="footer-bottom">
          <span className="footer-copy">© 2026 CourtSy Sport Club. All rights reserved.</span>
          <div className="footer-links">
            {['Terms', 'Privacy', 'Cookies'].map((l) => (
              <a href="#top" key={l}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
