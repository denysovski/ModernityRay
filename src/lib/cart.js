/* Cart + account state for the simulated store.
 *
 * Everything here is local only — nothing is sent anywhere, there is no
 * server, and the "account" is a name and an email in localStorage. It exists
 * so the buying flow can be walked end to end.
 *
 * Plain JS rather than a React store because the statically generated
 * subpages drive it too: build-pages.mjs renders `data-buy` buttons and
 * page.js calls window.CourtSyCart.add() on them.
 */

const KEY = 'courtsy.cart'
const USER_KEY = 'courtsy.user'
const ORDERS_KEY = 'courtsy.orders'

/** Sales tax applied at review, on the taxable subtotal. */
export const TAX_RATE = 0.0825
/** Flat cost of couriering the physical member card and welcome pack. */
export const SHIPPING = 12

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode / quota — the session just won't persist */
  }
}

let items = read(KEY, [])
let user = read(USER_KEY, null)
const listeners = new Set()

const emit = () => {
  write(KEY, items)
  listeners.forEach((fn) => fn())
}

export const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const getItems = () => items
export const getUser = () => user

/** Signed-in state is simulated: any email works, no password is stored. */
export const signIn = ({ name, email }) => {
  user = { name, email }
  write(USER_KEY, user)
  listeners.forEach((fn) => fn())
  return user
}
export const signOut = () => {
  user = null
  write(USER_KEY, null)
  listeners.forEach((fn) => fn())
}

export const add = (item) => {
  if (!item || !item.id) return
  const found = items.find((i) => i.id === item.id)
  if (found) found.qty += item.qty || 1
  else items = [...items, { qty: 1, ...item }]
  emit()
}

export const setQty = (id, qty) => {
  items = items
    .map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i))
    .filter((i) => i.qty > 0)
  emit()
}

export const remove = (id) => {
  items = items.filter((i) => i.id !== id)
  emit()
}

export const clear = () => {
  items = []
  emit()
}

export const count = () => items.reduce((n, i) => n + i.qty, 0)

/** One place that decides what a basket costs, so every screen agrees. */
export const totals = (list = items) => {
  const subtotal = list.reduce((n, i) => n + i.price * i.qty, 0)
  // digital-only baskets (gift cards) ship nothing
  const shipping = list.some((i) => i.shipped !== false) && subtotal > 0 ? SHIPPING : 0
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}

export const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

/** Records a completed order so the confirmation screen has something real. */
export const placeOrder = (details) => {
  const order = {
    ref: 'CS-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    placedAt: new Date().toISOString(),
    items,
    totals: totals(),
    details,
  }
  write(ORDERS_KEY, [order, ...read(ORDERS_KEY, [])].slice(0, 20))
  clear()
  return order
}

/* Bridge for the static subpages — see page.js in build-pages.mjs. */
if (typeof window !== 'undefined') {
  window.CourtSyCart = { add, open: () => window.dispatchEvent(new Event('courtsy:open-cart')) }
}
