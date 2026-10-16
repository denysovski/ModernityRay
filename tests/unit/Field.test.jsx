import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Field from '../../src/components/commerce/Field'

/* Field owns the accessibility contract for every input in the app, so that
   contract is what gets tested: label association, aria-invalid, the error
   being announced, and the mask running before onChange fires. */

describe('Field', () => {
  it('associates the label with the input', () => {
    render(<Field label="Full name" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
  })

  it('hides the error until the step has been submitted', () => {
    const { rerender } = render(
      <Field label="Email" value="nope" onChange={() => {}} error="Enter a valid email address." />,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')

    rerender(
      <Field label="Email" value="nope" onChange={() => {}} error="Enter a valid email address." show />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('points aria-describedby at the message a screen reader should read', () => {
    render(<Field label="Email" value="x" onChange={() => {}} error="Bad." show />)
    const input = screen.getByLabelText('Email')
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id)
  })

  it('shows the hint while the field is valid, and the error instead when it is not', () => {
    const { rerender } = render(
      <Field label="Password" value="abcdefg1" onChange={() => {}} hint="At least 8 characters." show />,
    )
    expect(screen.getByText('At least 8 characters.')).toBeInTheDocument()

    rerender(
      <Field
        label="Password"
        value="abc"
        onChange={() => {}}
        hint="At least 8 characters."
        error="Use at least 8 characters."
        show
      />,
    )
    expect(screen.queryByText('At least 8 characters.')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('passes the masked value to onChange, not the raw keystrokes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const mask = (value) => value.replace(/\D/g, '').toUpperCase()

    render(<Field label="Card number" value="" onChange={onChange} mask={mask} />)
    await user.type(screen.getByLabelText('Card number'), '4a2')

    expect(onChange).toHaveBeenCalledWith('4')
    expect(onChange).not.toHaveBeenCalledWith('4a')
  })

  it('renders a select when given options', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <Field label="Country" value="United States" onChange={onChange} options={['United States', 'Canada']} />,
    )
    const select = screen.getByLabelText('Country')
    expect(select.tagName).toBe('SELECT')

    await user.selectOptions(select, 'Canada')
    expect(onChange).toHaveBeenCalledWith('Canada')
  })
})
