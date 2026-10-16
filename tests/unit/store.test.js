import { beforeEach, describe, expect, it, vi } from 'vitest'

/* The store reads localStorage once at module load, so every test gets a
   fresh module with a known storage state. vi.resetModules() plus a dynamic
   import is the only way to exercise "what does it do when it boots on top of
   this data", which is most of what a persistence layer has to get right. */
const freshStore = async () => {
  vi.resetModules()
  return import('../../src/lib/store')
}

const TIER = { id: 'tier-resident', name: 'Resident', meta: 'per month', price: 190 }
const SESSION = { id: 'court-lawns-60', name: 'The Lawns · 60 min', meta: 'hire', price: 38, shipped: false }

beforeEach(() => {
  window.localStorage.clear()
})

describe('cart', () => {
  it('starts empty', async () => {
    const store = await freshStore()
    expect(store.getItems()).toEqual([])
    expect(store.count()).toBe(0)
  })

  it('adds a line and bumps the quantity on a repeat add', async () => {
    const store = await freshStore()
    store.add(TIER)
    store.add(TIER)
    expect(store.getItems()).toHaveLength(1)
    expect(store.count()).toBe(2)
  })

  it('keeps separate products apart', async () => {
    const store = await freshStore()
    store.add(TIER)
    store.add(SESSION)
    expect(store.getItems().map((l) => l.id)).toEqual(['tier-resident', 'court-lawns-60'])
  })

  it('refuses a line that would poison the totals', async () => {
    const store = await freshStore()
    expect(store.add(null)).toBe(false)
    expect(store.add({ name: 'no id', price: 10 })).toBe(false)
    expect(store.add({ id: 'x', name: 'not a number', price: 'free' })).toBe(false)
    expect(store.add({ id: 'x', name: 'negative', price: -5 })).toBe(false)
    expect(store.getItems()).toEqual([])
  })

  it('removes a line when its quantity reaches zero', async () => {
    const store = await freshStore()
    store.add(TIER)
    store.setQty('tier-resident', 0)
    expect(store.getItems()).toEqual([])
  })

  it('ignores a non-numeric quantity', async () => {
    const store = await freshStore()
    store.add(TIER)
    store.setQty('tier-resident', 'lots')
    expect(store.count()).toBe(1)
  })

  it('notifies subscribers on every change, and stops after unsubscribe', async () => {
    const store = await freshStore()
    const seen = vi.fn()
    const off = store.subscribe(seen)
    store.add(TIER)
    store.setQty('tier-resident', 3)
    expect(seen).toHaveBeenCalledTimes(2)
    off()
    store.clear()
    expect(seen).toHaveBeenCalledTimes(2)
  })
})

describe('totals', () => {
  it('adds tax and the flat delivery fee to a shippable basket', async () => {
    const store = await freshStore()
    store.add(TIER) // 190, shippable
    const t = store.totals()
    expect(t.subtotal).toBe(190)
    expect(t.shipping).toBe(store.SHIPPING)
    expect(t.tax).toBeCloseTo(190 * store.TAX_RATE, 2)
    expect(t.total).toBeCloseTo(190 + store.SHIPPING + t.tax, 2)
  })

  it('charges no delivery on a basket of bookings only', async () => {
    const store = await freshStore()
    store.add(SESSION) // shipped: false
    expect(store.totals().shipping).toBe(0)
  })

  it('charges delivery once when a basket mixes both', async () => {
    const store = await freshStore()
    store.add(TIER)
    store.add(SESSION)
    expect(store.totals().shipping).toBe(store.SHIPPING)
  })

  it('is all zeroes for an empty basket', async () => {
    const store = await freshStore()
    expect(store.totals()).toEqual({ subtotal: 0, shipping: 0, tax: 0, total: 0 })
  })

  it('rounds tax to whole cents', async () => {
    const store = await freshStore()
    store.add({ id: 'odd', name: 'Odd', price: 33.33 })
    const { tax } = store.totals()
    expect(Number.isInteger(Math.round(tax * 100))).toBe(true)
    expect(String(tax).split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2)
  })
})

describe('money', () => {
  it('formats as US dollars with two decimals', async () => {
    const store = await freshStore()
    expect(store.money(190)).toBe('$190.00')
    expect(store.money(1450.5)).toBe('$1,450.50')
  })

  it('never renders NaN', async () => {
    const store = await freshStore()
    expect(store.money(undefined)).toBe('$0.00')
  })
})

describe('persistence', () => {
  it('survives a reload', async () => {
    const first = await freshStore()
    first.add(TIER)

    const second = await freshStore()
    expect(second.count()).toBe(1)
    expect(second.getItems()[0].name).toBe('Resident')
  })

  it('discards a basket written by an older schema', async () => {
    window.localStorage.setItem('courtsy.schema', '1')
    window.localStorage.setItem('courtsy.cart', JSON.stringify([TIER]))

    const store = await freshStore()
    expect(store.getItems()).toEqual([])
  })

  it('ignores unparseable storage instead of crashing', async () => {
    window.localStorage.setItem('courtsy.schema', '2')
    window.localStorage.setItem('courtsy.cart', '{not json')

    const store = await freshStore()
    expect(store.getItems()).toEqual([])
  })

  it('drops hand-edited basket lines that are malformed', async () => {
    window.localStorage.setItem('courtsy.schema', '2')
    window.localStorage.setItem(
      'courtsy.cart',
      JSON.stringify([
        { ...TIER, qty: 1 },
        { id: 'bad', name: 'No price', qty: 1 },
        { id: 'worse', name: 'Negative qty', price: 10, qty: -3 },
      ]),
    )

    const store = await freshStore()
    expect(store.getItems()).toHaveLength(1)
    expect(Number.isFinite(store.totals().total)).toBe(true)
  })
})

describe('account', () => {
  it('stores a sanitised profile and never a password', async () => {
    const store = await freshStore()
    store.signIn({ name: '  Daniel   Svoboda ', email: 'dan@example.com', password: 'hunter22' })

    expect(store.getUser()).toMatchObject({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    expect(JSON.stringify(store.getUser())).not.toMatch(/hunter22|password/i)
    expect(window.localStorage.getItem('courtsy.user')).not.toMatch(/hunter22/)
  })

  it('refuses a profile with no email', async () => {
    const store = await freshStore()
    expect(store.signIn({ name: 'Nobody' })).toBeNull()
    expect(store.getUser()).toBeNull()
  })

  it('keeps the original join date when the profile is edited', async () => {
    const store = await freshStore()
    const first = store.signIn({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    const edited = store.signIn({ name: 'Daniel Novák', email: 'dan@example.com' })
    expect(edited.since).toBe(first.since)
  })

  it('signs out without touching the basket', async () => {
    const store = await freshStore()
    store.add(TIER)
    store.signIn({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    store.signOut()
    expect(store.getUser()).toBeNull()
    expect(store.count()).toBe(1)
  })
})

describe('placeOrder', () => {
  const details = {
    name: 'Daniel Svoboda',
    email: 'dan@example.com',
    phone: '+1 555 0100',
    address: '24 Lakeside Drive, Austin 78701, United States',
    cardLast4: '4242',
    cardBrand: 'Visa',
  }

  it('records the order and empties the basket', async () => {
    const store = await freshStore()
    store.add(TIER)
    const order = store.placeOrder(details)

    expect(order.ref).toMatch(/^CS-[0-9A-Z]{6}$/)
    expect(order.items).toHaveLength(1)
    expect(order.totals.total).toBeGreaterThan(190)
    expect(store.getItems()).toEqual([])
    expect(store.getOrders()).toHaveLength(1)
  })

  it('stores only the last four digits of the card', async () => {
    const store = await freshStore()
    store.add(TIER)
    store.placeOrder({ ...details, card: '4242424242424242' })

    const raw = window.localStorage.getItem('courtsy.orders')
    expect(raw).toContain('4242')
    expect(raw).not.toContain('4242424242424242')
  })

  it('does nothing for an empty basket', async () => {
    const store = await freshStore()
    expect(store.placeOrder(details)).toBeNull()
    expect(store.getOrders()).toEqual([])
  })

  it('puts the newest order first and totals lifetime spend', async () => {
    const store = await freshStore()
    store.add(TIER)
    const first = store.placeOrder(details)
    store.add(SESSION)
    const second = store.placeOrder(details)

    expect(store.getOrders()[0].ref).toBe(second.ref)
    expect(store.getOrders()[1].ref).toBe(first.ref)
    expect(store.lifetimeSpend()).toBeCloseTo(first.totals.total + second.totals.total, 2)
  })

  it('caps the stored history', async () => {
    const store = await freshStore()
    for (let i = 0; i < 25; i++) {
      store.add({ id: `item-${i}`, name: `Item ${i}`, price: 10 })
      store.placeOrder(details)
    }
    expect(store.getOrders()).toHaveLength(20)
  })
})

describe('preferences', () => {
  it('defaults to motion on and tax-exclusive prices', async () => {
    const store = await freshStore()
    expect(store.getPrefs()).toEqual({
      reducedMotion: false,
      emailReceipts: true,
      taxInclusivePrices: false,
    })
  })

  it('persists a change', async () => {
    const first = await freshStore()
    first.setPref('reducedMotion', true)
    const second = await freshStore()
    expect(second.getPrefs().reducedMotion).toBe(true)
  })

  it('ignores unknown keys and non-boolean values', async () => {
    const store = await freshStore()
    store.setPref('isAdmin', true)
    store.setPref('reducedMotion', 'yes')
    expect(store.getPrefs()).not.toHaveProperty('isAdmin')
    expect(store.getPrefs().reducedMotion).toBe(false)
  })
})

describe('forgetMe', () => {
  it('clears the profile, the basket and the order history', async () => {
    const store = await freshStore()
    store.signIn({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    store.add(TIER)
    store.placeOrder({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    store.add(SESSION)

    store.forgetMe()

    expect(store.getUser()).toBeNull()
    expect(store.getItems()).toEqual([])
    expect(store.getOrders()).toEqual([])

    const reloaded = await freshStore()
    expect(reloaded.getOrders()).toEqual([])
  })
})
