import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './App.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import './styles/index.css'
import './styles/app.css'

/* Entry point. The store provider sits above the router, so application state
   outlives every navigation. */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      {/* v7_startTransition wraps navigation state updates in
          React.startTransition, which is the v7 default — opting in here keeps
          route changes from blocking paint while a lazy chunk loads. */}
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
        fallbackElement={
          <div className="route-loading" role="status" aria-live="polite">
            <span className="route-loading-bar" />
            <span className="sr-only">Loading</span>
          </div>
        }
      />
    </StoreProvider>
  </React.StrictMode>,
)
