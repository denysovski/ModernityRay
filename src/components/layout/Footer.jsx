import { motion } from 'framer-motion'
import { Icon, SmartLink, Stagger, upItem } from '../ui'
import { FOOTER, LEGAL_LINKS } from '../../data'
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
              {col.items.map((it) =>
                /* The club has no social accounts to point at — it is an
                   invented club — so these name the networks without
                   sending anyone to a real stranger's profile. */
                it.inert ? (
                  <span className="footer-inert" key={it.label}>
                    {it.label}
                  </span>
                ) : (
                  <SmartLink href={it.href} external={it.external} key={it.label}>
                    {it.label}
                  </SmartLink>
                ),
              )}
            </motion.div>
          ))}
        </Stagger>

        <div className="footer-bottom">
          <span className="footer-copy">© 2026 CourtSy Sport Club. All rights reserved.</span>
          {/* These were inert placeholders. The three pages exist now, so
              they are real links — see src/data/legal. */}
          <div className="footer-links">
            {LEGAL_LINKS.map((l) => (
              <SmartLink href={l.href} key={l.href}>
                {l.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
