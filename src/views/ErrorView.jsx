import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { paths } from '../routes'

/* The router's error boundary.
 *
 * Attached as `errorElement` on the root route, so a thrown render error takes
 * out one route instead of blanking the whole app. It deliberately does not
 * use the shared layout: if the failure were in the navbar or the store, the
 * error screen would fail to render too.
 *
 * The message is shown because this is a coursework project and a visible
 * stack is useful during the defense; a production build would log it and show
 * only the apology.
 */
export default function ErrorView() {
  const error = useRouteError()

  const status = isRouteErrorResponse(error) ? error.status : null
  const detail = isRouteErrorResponse(error)
    ? error.statusText || error.data
    : error instanceof Error
      ? error.message
      : String(error ?? 'Unknown error')

  return (
    <main className="err">
      <div className="err-box">
        <span className="micro">{status ? `Error ${status}` : 'Something broke'}</span>
        <h1 className="h-md">The club is briefly out of order.</h1>
        <p>
          A view failed to render. The rest of the app is fine — reloading, or going back to
          the homepage, should pick things up again.
        </p>
        {detail && <pre className="err-detail">{detail}</pre>}
        <div className="err-actions">
          <button type="button" className="btn btn-green" onClick={() => window.location.reload()}>
            Reload
          </button>
          <a className="btn btn-light" href={import.meta.env.BASE_URL}>
            Back to {paths.home === '/' ? 'the homepage' : paths.home}
          </a>
        </div>
      </div>
    </main>
  )
}
