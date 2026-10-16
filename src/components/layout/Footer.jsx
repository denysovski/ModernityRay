import { motion } from 'framer-motion'
import { Icon, SmartLink, Stagger, upItem } from '../ui'
import { FOOTER } from '../../data'
import { paths } from '../../routes'

/* Site footer, and the app's sitemap.
 *
 * Columns come from data/navigation so the footer and the mega-menu cannot
 * disagree about where a link goes. Every entry is a real destination now —
 * these were all `href="#top"` placeholders before the app had routes.
 *
 * Keeps id="join" because the homepage's "Join" anchors still scroll here.
 */
export default function Footer() {
  return (
    <footer className="footer" id="join">
      <div className="footer-pad">
        <Stagger className="footer-grid" amount={0.1}>
          <motion.div className="footer-brandcol" variants={upItem}>
            <SmartLink href={paths.home} className="nav-logo footer-logo">
              CourtSy<span>.</span>
            </SmartLink>
            <p className="footer-sub">
              A private members&rsquo; sport club. Start today, play forever.
            </p>
            <SmartLink href={paths.membership('resident')} className="btn btn-member footer-join">
              Become a member <span className="btn-bubble"><Icon.arrow /></span>
            </SmartLink>
          </motion.div>

          {FOOTER.map((col) => (
            <motion.div className="footer-col" key={col.h} variants={upItem}>
              <h2>{col.h}</h2>
              {col.items.map((it) => (
                <SmartLink href={it.href} external={it.external} key={it.label}>
                  {it.label}
                </SmartLink>
              ))}
            </motion.div>
          ))}
        </Stagger>

        <div className="footer-bottom">
          <span className="footer-copy">© 2026 CourtSy Sport Club. All rights reserved.</span>
          <div className="footer-links">
            {['Terms', 'Privacy', 'Cookies'].map((l) => (
              /* No legal pages in a coursework build — these stay inert rather
                 than pretending to lead somewhere. */
              <span key={l} className="footer-inert">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
