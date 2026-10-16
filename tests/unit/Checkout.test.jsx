import { beforeEach, describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkout from '../../src/views/Checkout'
import * as store from '../../src/lib/store'
import { renderWithProviders, RESIDENT_LINE } from './helpers'

/* The checkout is where routing, state, storage and validation meet, so this
   is the integration test: drive it the way a person would and assert on what
   they would see, not on internals. */

beforeEach(() => {
  window.localStorage.clear()
  store.forgetMe()
})

describe('Checkout', () => {
  it('offers a way out instead of a form when the basket is empty', () => {
    renderWithProviders(<Checkout />, { route: '/checkout' })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your basket is empty')
    expect(screen.getByRole('link', { name: /browse memberships/i })).toBeInTheDocument()
    expect(screen.queryByLabelText('Card number')).not.toBeInTheDocument()
  })

  it('shows the basket and the computed totals', () => {
    store.add(RESIDENT_LINE)
    renderWithProviders(<Checkout />, { route: '/checkout' })

    const summary = screen.getByRole('complementary')
    expect(within(summary).getByText('Resident')).toBeInTheDocument()
    // once as the line price, once as the subtotal
    expect(within(summary).getAllByText('$190.00')).toHaveLength(2)
    expect(within(summary).getByText('$12.00')).toBeInTheDocument()
    // 190 + 12 delivery + 8.25% tax on the subtotal
    expect(within(summary).getByText('$217.68')).toBeInTheDocument()
  })

  it('blocks the first step until every field is valid, then advances', async () => {
    const user = userEvent.setup()
    store.add(RESIDENT_LINE)
    renderWithProviders(<Checkout />, { route: '/checkout' })

    await user.click(screen.getByRole('button', { name: /continue/i }))

    // still on the account step, with all three fields blamed
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    expect(screen.getAllByRole('alert')).toHaveLength(3)
    expect(screen.getByLabelText('Full name')).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText('Full name'), 'Daniel Svoboda')
    await user.type(screen.getByLabelText('Email'), 'dan@example.com')
    await user.type(screen.getByLabelText('Password'), 'abcdefg1')

    // errors clear as the fields become valid, without another submit
    expect(screen.queryAllByRole('alert')).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(await screen.findByRole('heading', { name: /your details/i })).toBeInTheDocument()
  })

  it('creates the local profile when the account step passes, with no password', async () => {
    const user = userEvent.setup()
    store.add(RESIDENT_LINE)
    renderWithProviders(<Checkout />, { route: '/checkout' })

    await user.type(screen.getByLabelText('Full name'), 'Daniel Svoboda')
    await user.type(screen.getByLabelText('Email'), 'dan@example.com')
    await user.type(screen.getByLabelText('Password'), 'abcdefg1')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(store.getUser()).toMatchObject({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    expect(JSON.stringify(store.getUser())).not.toMatch(/abcdefg1/)
  })

  it('rejects a card that fails the Luhn check and names the problem', async () => {
    const user = userEvent.setup()
    store.add(RESIDENT_LINE)
    store.signIn({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    renderWithProviders(<Checkout />, { route: '/checkout' })

    // signed in, so the flow opens on Details
    await user.type(screen.getByLabelText('Phone'), '+1 555 0100')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    await user.type(await screen.findByLabelText('Street address'), '24 Lakeside Drive')
    await user.type(screen.getByLabelText('City'), 'Austin')
    await user.type(screen.getByLabelText('Postal code'), '78701')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    const card = await screen.findByLabelText(/card number/i)
    await user.type(card, '4242424242424241')
    await user.type(screen.getByLabelText('Expiry'), '0429')
    await user.type(screen.getByLabelText('Security code'), '123')
    await user.click(screen.getByRole('button', { name: /^pay/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/not valid/i)
    expect(store.getOrders()).toHaveLength(0)
  })

  it('checks the postal code against the selected country', async () => {
    const user = userEvent.setup()
    store.add(RESIDENT_LINE)
    store.signIn({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    renderWithProviders(<Checkout />, { route: '/checkout' })

    await user.type(screen.getByLabelText('Phone'), '+1 555 0100')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    await user.type(await screen.findByLabelText('Street address'), '24 Lakeside Drive')
    await user.type(screen.getByLabelText('City'), 'Austin')
    await user.type(screen.getByLabelText('Postal code'), '78701')
    await user.selectOptions(screen.getByLabelText('Country'), 'Australia')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/4 digits/)
  })

  it('completes the purchase, empties the basket and keeps only the last four digits', async () => {
    const user = userEvent.setup()
    store.add(RESIDENT_LINE)
    store.signIn({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    renderWithProviders(<Checkout />, { route: '/checkout' })

    await user.type(screen.getByLabelText('Phone'), '+1 555 0100')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    await user.type(await screen.findByLabelText('Street address'), '24 Lakeside Drive')
    await user.type(screen.getByLabelText('City'), 'Austin')
    await user.type(screen.getByLabelText('Postal code'), '78701')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    await user.type(await screen.findByLabelText(/card number/i), '4242424242424242')
    await user.type(screen.getByLabelText('Expiry'), '0429')
    await user.type(screen.getByLabelText('Security code'), '123')
    await user.click(screen.getByRole('button', { name: /^pay/i }))

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/you’re in, daniel/i)

    expect(store.getItems()).toEqual([])
    expect(store.getOrders()).toHaveLength(1)

    const order = store.getOrders()[0]
    expect(order.details.cardLast4).toBe('4242')
    expect(order.details.cardBrand).toBe('Visa')
    expect(window.localStorage.getItem('courtsy.orders')).not.toContain('4242424242424242')
  })

  it('groups the card number as the user types', async () => {
    const user = userEvent.setup()
    store.add(RESIDENT_LINE)
    store.signIn({ name: 'Daniel Svoboda', email: 'dan@example.com' })
    renderWithProviders(<Checkout />, { route: '/checkout' })

    await user.type(screen.getByLabelText('Phone'), '+1 555 0100')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(await screen.findByLabelText('Street address'), '24 Lakeside Drive')
    await user.type(screen.getByLabelText('City'), 'Austin')
    await user.type(screen.getByLabelText('Postal code'), '78701')
    await user.click(screen.getByRole('button', { name: /continue/i }))

    const card = await screen.findByLabelText(/card number/i)
    await user.type(card, '4242424242424242')
    expect(card).toHaveValue('4242 4242 4242 4242')
  })
})
