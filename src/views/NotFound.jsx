import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { Icon, SmartLink, useSeo } from '../components/ui'
import { paths } from '../routes'

/* The catch-all route, and the fallback a detail view renders when its slug
   does not resolve — a mistyped URL is a user error, so it gets an exit, not
   an exception. `what` names the thing that was missing. */
export default function NotFound({ what = 'page' }) {
  const { pathname } = useLocation()

  useSeo({
    title: 'Page Not Found',
    description: 'That page is not here. Find your way back to the club.',
    noindex: true,
  })

  return (
    <main className="pg">
      <PageHeader
        label="404"
        title={`That ${what} isn’t here.`}
        lede={`Nothing answers to ${pathname}. It may have moved, or the link may have a typo in it.`}
        crumbs={[{ label: 'Home', href: paths.home }, { label: 'Not found' }]}
      />
      <section className="pg-section section">
        <div className="shell ck-empty">
          <SmartLink href={paths.home} className="btn btn-member">
            Back to the homepage <span className="btn-bubble"><Icon.arrow /></span>
          </SmartLink>
          <SmartLink href={paths.memberships} className="btn btn-light">
            Memberships
          </SmartLink>
          <SmartLink href={paths.courts} className="btn btn-light">
            Courts
          </SmartLink>
          <SmartLink href={paths.events} className="btn btn-light">
            What&rsquo;s on
          </SmartLink>
        </div>
      </section>
    </main>
  )
}
