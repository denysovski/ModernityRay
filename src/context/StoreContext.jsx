import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react'
import * as store from '../lib/store'

/* The app's single state container.
 *
 * Two kinds of state meet here:
 *
 *   Persistent state (basket, profile, orders, preferences) lives in
 *   lib/store, outside React, and is read through useSyncExternalStore. That
 *   is React's purpose-built hook for external stores: it subscribes, it
 *   re-renders on change, and it cannot tear during a concurrent render the
 *   way a useEffect + useState pairing can.
 *
 *   Ephemeral UI state (is the cart drawer open) lives in useState right here,
 *   because it should not survive a reload.
 *
 * The provider sits above the router in main.jsx, so navigating between views
 * never unmounts it and the basket survives every route change.
 *
 * Why not Redux: the whole state is one basket, one profile and three
 * booleans, with no async and no cross-slice coordination. Context over an
 * external store gives the same single-source-of-truth guarantee without
 * ~15 kB of middleware, and the assignment explicitly allows a custom
 * solution. The seam is a hook, so swapping the implementation later would
 * not touch a single component.
 */

const StoreContext = createContext(null)

/* getSnapshot must return a value that is stable between unrelated renders, so
   it returns a cheap version stamp rather than the arrays themselves — the
   arrays are then read fresh below. Returning `items` directly would allocate
   a new identity on some paths and loop. */
const snapshot = () => {
  const lines = store.getItems().map((l) => `${l.id}:${l.qty}`).join('|')
  const user = store.getUser()
  const prefs = store.getPrefs()
  return [
    lines,
    user?.email ?? '',
    store.getOrders().length,
    prefs.reducedMotion,
    prefs.emailReceipts,
    prefs.taxInclusivePrices,
  ].join('~')
}

/* Server rendering is not used, but the hook requires the third argument and
   a constant keeps the first client render consistent. */
const serverSnapshot = () => ''

export function StoreProvider({ children }) {
  const version = useSyncExternalStore(store.subscribe, snapshot, serverSnapshot)
  const [cartOpen, setCartOpen] = useState(false)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  const value = useMemo(
    () => ({
      // persisted, re-read on every store change
      items: store.getItems(),
      user: store.getUser(),
      orders: store.getOrders(),
      prefs: store.getPrefs(),
      count: store.count(),
      totals: store.totals(),
      lifetimeSpend: store.lifetimeSpend(),
      storageAvailable: store.storageAvailable,

      // actions
      add: store.add,
      setQty: store.setQty,
      remove: store.remove,
      clear: store.clear,
      signIn: store.signIn,
      signOut: store.signOut,
      forgetMe: store.forgetMe,
      deleteAccount: store.deleteAccount,
      setPref: store.setPref,
      placeOrder: store.placeOrder,
      money: store.money,

      // ephemeral UI
      cartOpen,
      openCart,
      closeCart,
    }),
    // `version` is the dependency that matters: it changes iff the store did
    [version, cartOpen, openCart, closeCart],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

/**
 * Reads the app store. Throws rather than returning undefined, so a component
 * rendered outside the provider fails loudly in development instead of
 * silently showing an empty basket.
 */
export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used inside <StoreProvider>')
  return value
}
