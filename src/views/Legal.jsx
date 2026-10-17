import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/layout/PageHeader'
import { Icon, SmartLink, useSeo } from '../components/ui'
import { legalByPath, LEGAL_LINKS } from '../data'
import { paths } from '../routes'
import NotFound from './NotFound'

/* View 14 — terms, privacy and cookies.
 *
 * One view for all three. They are the same layout over different prose, so
 * three near-identical files would be three places to keep in step; the
 * content lives in src/data/legal and the route picks which one to render.
 *
 * A single measure column, no photography and no call to action: these are
 * pages people arrive at to check one specific thing, and the fastest way
 * to help them is to get out of the way.
 */

const ease = [0.22, 1, 0.36, 1]

export default function Legal() {
  const { pathname } = useLocation()
  const page = legalByPath(pathname)

  useSeo({
    title: page ? page.title.replace(/\.$/, '') : 'Page Not Found',
    description: page ? page.lede : 'That page is not here.',
    noindex: !page,
  })

  if (!page) return <NotFound what="page" />

  const others = LEGAL_LINKS.filter((l) => l.href !== page.path)

  return (
    <main className="pg legal">
      <PageHeader
        label={page.label}
        title={page.title}
        lede={page.lede}
        crumbs={[{ label: 'Home', href: paths.home }, { label: page.label }]}
      />

      <section className="section pg-section">
        <div className="shell">
          <p className="legal-updated">Last updated {page.updated}</p>

          <div className="legal-body">
            {page.sections.map((s, i) => (
              <motion.section
                className="legal-section"
                key={s.heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, ease, delay: Math.min(i * 0.06, 0.24) }}
              >
                <h2>{s.heading}</h2>
                {s.body.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
              </motion.section>
            ))}
          </div>

          <div className="legal-more">
            <span>The rest of the small print</span>
            <div className="legal-more-links">
              {others.map((l) => (
                <SmartLink href={l.href} key={l.href} className="btn btn-light">
                  {l.label} <Icon.arrow />
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
