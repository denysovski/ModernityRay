import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './views/Home'
import ErrorView from './views/ErrorView'

/* The route table — the app's map.
 *
 * A data router (createBrowserRouter) rather than <BrowserRouter> because it
 * gives per-route error boundaries, <ScrollRestoration>, and the route-level
 * `lazy` used below.
 *
 * Code splitting: Home is imported eagerly because it is the landing route and
 * lazy-loading it would only add a round trip before the first paint. Every
 * other view is split into its own chunk, so visiting the site no longer
 * downloads the checkout form, the account screen and five detail views up
 * front — see docs/ for the measurements.
 *
 * Why the router's `lazy` and not React.lazy + <Suspense>: with Suspense, the
 * router paints the shell and a placeholder first, then swaps in the view when
 * its chunk lands — which moves the footer down the page and scored a
 * cumulative layout shift of 0.58 on a cold load. The router's `lazy` resolves
 * the module *before* it renders the route, so the page paints once, complete.
 * Same number of chunks, same bytes, no shift.
 */

/** Wraps a dynamic import in the { Component } shape react-router expects. */
const view = (load) => async () => ({ Component: (await load()).default })

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorView />,
    children: [
      { index: true, element: <Home /> },
      { path: 'memberships', lazy: view(() => import('./views/Memberships')) },
      { path: 'memberships/:slug', lazy: view(() => import('./views/MembershipDetail')) },
      { path: 'courts', lazy: view(() => import('./views/Courts')) },
      { path: 'courts/:slug', lazy: view(() => import('./views/CourtDetail')) },
      { path: 'events', lazy: view(() => import('./views/Events')) },
      { path: 'events/:slug', lazy: view(() => import('./views/EventDetail')) },
      { path: 'checkout', lazy: view(() => import('./views/Checkout')) },
      { path: 'account', lazy: view(() => import('./views/Account')) },
      { path: '*', lazy: view(() => import('./views/NotFound')) },
    ],
  },
]

/* Opt in to the v7 behaviours now rather than carrying deprecation warnings.
   These are the router-level flags; v7_startTransition belongs on
   <RouterProvider> instead and is set in main.jsx. Nothing in this app depends
   on the old behaviour. */
export const routerFuture = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
}

export const router = createBrowserRouter(routes, { basename, future: routerFuture })
