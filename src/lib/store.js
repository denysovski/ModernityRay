/* Client-side application state for the simulated club store.
 *
 * There is no backend. Everything a "logged in" member has — their basket,
 * their profile, their past orders and their preferences — lives in
 * localStorage under the keys below, and this module is the only code that
 * touches it. Components never call localStorage directly; they go through the
 * React context in src/context/StoreContext.jsx, which subscribes here.
 *
 * Why a plain module with a subscribe/emit pair instead of putting the state
 * in React:
 *   - it is readable and writable before React mounts, which keeps the first
 *     paint of the cart badge correct with no flash of an empty basket,
 *   - it keeps storage concerns out of the component tree entirely,
 *   - React subscribes to it with useSyncExternalStore, the API built for
 *     exactly this, so there is no risk of tearing during concurrent renders.
 *
 * Security posture, deliberately: no password is ever stored or even kept in
 * state after the form unmounts, card numbers are validated and then
 * discarded (only the last four digits are kept on the order), and every
 * string that comes from a form is length-capped and stripped of control
 * characters before it is persisted. See lib/validation.js.
 */

import { sanitizeText } from './validation'

/* ── storage keys ──────────────────────────────────────────────────────────
   Namespaced so the app can share an origin with anything else, and
   versioned so a shape change can throw away stale data instead of crashing
   on it. Bump SCHEMA whenever the persisted shape changes. */
const SCHEMA = 2
const K = {
  schema: 'courtsy.schema',
  cart: 'courtsy.cart',
  user: 'courtsy.user',
  orders: 'courtsy.orders',
  prefs: 'courtsy.prefs',
}

/** Sales tax applied at review, on the taxable subtotal. */
export const TAX_RATE = 0.0825
/** Flat cost of couriering the physical member card and welcome pack. */
export const SHIPPING = 12
/** Most orders kept in history; older ones are dropped. */
const ORDER_HISTORY_LIMIT = 20

/* ── safe storage access ───────────────────────────────────────────────────
   localStorage throws in private mode and when the quota is full, and it can
   hold anything at all once a user has opened devtools, so every read is
   parsed defensively and validated by the caller. */

const canStore = () => {
  try {
    const probe = '__courtsy_probe__'
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/** False in private mode, with storage disabled, or when the quota is full. */
export const storageAvailable = canStore()

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    // unparseable or unreadable — treat it as absent rather than crashing
    return fallback
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    /* private mode / quota — the session just won't persist */
    return false
  }
}

/* One-time migration: anything written by an older schema is discarded rather
   than guessed at, because the only loss is a basket that was never an order. */
const migrate = () => {
  if (!storageAvailable) return
  const found = read(K.schema, 0)
  if (found === SCHEMA) return
  ;[K.cart, K.user, K.orders, K.prefs].forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  })
  write(K.schema, SCHEMA)
}
migrate()

/* ── validation of what came back out of storage ───────────────────────────
   Storage is user-writable, so a stored basket is untrusted input. A line
   that does not look like a line is dropped instead of poisoning the totals
   with NaN. */

const isLine = (l) =>
  l &&
  typeof l === 'object' &&
  typeof l.id === 'string' &&
  typeof l.name === 'string' &&
  Number.isFinite(l.price) &&
  l.price >= 0 &&
  Number.isInteger(l.qty) &&
  l.qty > 0

const cleanLines = (list) => (Array.isArray(list) ? list.filter(isLine) : [])

const DEFAULT_PREFS = {
  /** Honour the OS "reduce motion" setting, or force it on from the account view. */
  reducedMotion: false,
  /** Pretend-email the receipt after checkout. */
  emailReceipts: true,
  /** Show prices with tax folded in on listing pages. */
  taxInclusivePrices: false,
}

const cleanPrefs = (value) => {
  const out = { ...DEFAULT_PREFS }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(DEFAULT_PREFS)) {
      if (typeof value[key] === 'boolean') out[key] = value[key]
    }
  }
  return out
}

const cleanUser = (value) => {
  if (!value || typeof value !== 'object') return null
  const name = sanitizeText(value.name, 80)
  const email = sanitizeText(value.email, 160)
  if (!email) return null
  return { name, email, since: typeof value.since === 'string' ? value.since : null }
}

/* ── state ─────────────────────────────────────────────────────────────── */

let items = cleanLines(read(K.cart, []))
let user = cleanUser(read(K.user, null))
let orders = Array.isArray(read(K.orders, [])) ? read(K.orders, []) : []
let prefs = cleanPrefs(read(K.prefs, null))

const listeners = new Set()

/** @param {() => void} fn @returns {() => void} unsubscribe */
export const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

const notify = () => listeners.forEach((fn) => fn())

/* ── reads ─────────────────────────────────────────────────────────────── */

export const getItems = () => items
export const getUser = () => user
export const getOrders = () => orders
export const getPrefs = () => prefs

export const count = () => items.reduce((n, l) => n + l.qty, 0)

/** One place that decides what a basket costs, so every screen agrees. */
export const totals = (list = items) => {
  const subtotal = list.reduce((n, l) => n + l.price * l.qty, 0)
  // digital-only baskets (day passes, gift cards) ship nothing
  const shipping = list.some((l) => l.shipped !== false) && subtotal > 0 ? SHIPPING : 0
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}

export const money = (n) =>
  (Number.isFinite(n) ? n : 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })

/* ── cart writes ───────────────────────────────────────────────────────── */

/**
 * Adds a line, or bumps the quantity if it is already in the basket.
 * Rejects anything that is not a well-formed line, so a bad call site cannot
 * put NaN into the totals.
 * @returns {boolean} whether the basket changed
 */
export const add = (item) => {
  if (!item || typeof item.id !== 'string' || !item.id) return false
  const price = Number(item.price)
  if (!Number.isFinite(price) || price < 0) return false

  const qty = Number.isInteger(item.qty) && item.qty > 0 ? item.qty : 1
  const found = items.find((l) => l.id === item.id)
  if (found) {
    items = items.map((l) => (l.id === item.id ? { ...l, qty: l.qty + qty } : l))
  } else {
    items = [...items, { ...item, price, qty }]
  }
  write(K.cart, items)
  notify()
  return true
}

export const setQty = (id, qty) => {
  const next = Number(qty)
  if (!Number.isFinite(next)) return
  items = items
    .map((l) => (l.id === id ? { ...l, qty: Math.max(0, Math.floor(next)) } : l))
    .filter((l) => l.qty > 0)
  write(K.cart, items)
  notify()
}

export const remove = (id) => {
  items = items.filter((l) => l.id !== id)
  write(K.cart, items)
  notify()
}

export const clear = () => {
  items = []
  write(K.cart, items)
  notify()
}

/* ── account ───────────────────────────────────────────────────────────── */

/**
 * Signed-in state is simulated: any email is accepted and no password is
 * stored anywhere, not even hashed — there is nothing to authenticate against.
 * The caller validates the email first (see validation.validateAccount).
 */
export const signIn = ({ name, email }) => {
  const next = cleanUser({ name, email, since: user?.since || new Date().toISOString() })
  if (!next) return null
  user = next
  write(K.user, user)
  notify()
  return user
}

export const signOut = () => {
  user = null
  write(K.user, null)
  notify()
}

/** Clears the basket, the profile and the order history in one go. */
export const forgetMe = () => {
  items = []
  user = null
  orders = []
  write(K.cart, items)
  write(K.user, null)
  write(K.orders, orders)
  notify()
}

/* ── preferences ───────────────────────────────────────────────────────── */

export const setPref = (key, value) => {
  if (!(key in DEFAULT_PREFS) || typeof value !== 'boolean') return
  prefs = { ...prefs, [key]: value }
  write(K.prefs, prefs)
  notify()
}

/* ── orders ────────────────────────────────────────────────────────────── */

const orderRef = () => {
  // Crypto where available so two tabs cannot mint the same reference.
  const rand =
    typeof crypto !== 'undefined' && crypto.getRandomValues
      ? [...crypto.getRandomValues(new Uint8Array(3))].map((b) => b.toString(36)).join('')
      : Math.random().toString(36).slice(2)
  return 'CS-' + rand.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 6).padEnd(6, '0')
}

/**
 * Records a completed order and empties the basket.
 * `details` is already-validated form data; only the last four digits of the
 * card are kept, and the number itself never reaches storage.
 * @returns {object|null} the stored order, or null for an empty basket
 */
export const placeOrder = (details = {}) => {
  if (items.length === 0) return null

  const order = {
    ref: orderRef(),
    placedAt: new Date().toISOString(),
    items,
    totals: totals(),
    details: {
      name: sanitizeText(details.name, 80),
      email: sanitizeText(details.email, 160),
      phone: sanitizeText(details.phone, 32),
      address: sanitizeText(details.address, 240),
      cardLast4: sanitizeText(details.cardLast4, 4),
      cardBrand: sanitizeText(details.cardBrand, 20),
    },
  }

  orders = [order, ...orders].slice(0, ORDER_HISTORY_LIMIT)
  write(K.orders, orders)
  items = []
  write(K.cart, items)
  notify()
  return order
}

/** Lifetime spend across stored orders, for the account summary. */
export const lifetimeSpend = () =>
  orders.reduce((n, o) => n + (Number(o?.totals?.total) || 0), 0)
