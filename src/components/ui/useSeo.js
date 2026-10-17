import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applySeo } from '../../lib/seo'

/* One hook per view, replacing the ad-hoc `document.title = …` effects.
 *
 * The pathname comes from the router rather than from the caller, so a
 * view can never canonicalise itself to the wrong URL, and a detail view
 * does not have to rebuild the path it was already routed to.
 *
 * Fields are listed as dependencies individually: passing the options
 * object would re-run on every render, because a literal is a new object
 * each time.
 *
 * @param {object} seo  see lib/seo.applySeo — title, description, image,
 *   type and noindex. `pathname` is supplied here.
 */
export default function useSeo({ title, description, image, type, noindex }) {
  const { pathname } = useLocation()

  useEffect(() => {
    applySeo({ title, description, pathname, image, type, noindex })
  }, [title, description, pathname, image, type, noindex])
}
