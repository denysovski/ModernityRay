import { useSyncExternalStore } from 'react'
import * as cart from '../../lib/cart'

/* One subscription for the whole commerce layer. getSnapshot must return a
   primitive or a stable reference — items is mutated in place by the store on
   qty bumps, so we snapshot a cheap version stamp instead and read the arrays
   fresh on each render. */
const stamp = () => cart.getItems().map((i) => `${i.id}:${i.qty}`).join('|') + (cart.getUser()?.email || '')
const server = () => ''

export function useCart() {
  useSyncExternalStore(cart.subscribe, stamp, server)
  const items = cart.getItems()
  return {
    items,
    user: cart.getUser(),
    count: cart.count(),
    totals: cart.totals(),
    add: cart.add,
    setQty: cart.setQty,
    remove: cart.remove,
    clear: cart.clear,
    signIn: cart.signIn,
    signOut: cart.signOut,
    placeOrder: cart.placeOrder,
    money: cart.money,
  }
}
