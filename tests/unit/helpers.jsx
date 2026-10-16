import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { StoreProvider } from '../../src/context/StoreContext'

/* Component tests need the same two providers the real app mounts: the store
   context, and a router (every view links somewhere). MemoryRouter keeps
   history in memory so a test can start on any route without a browser. */

/**
 * @param {React.ReactElement} ui
 * @param {{route?: string}} [options]
 */
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <StoreProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </StoreProvider>,
  )
}

/** A valid basket line, so views that need a non-empty cart have one. */
export const RESIDENT_LINE = {
  id: 'tier-resident',
  name: 'Resident',
  meta: 'per month',
  price: 190,
}
