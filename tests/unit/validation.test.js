import { describe, expect, it } from 'vitest'
import * as v from '../../src/lib/validation'

/* Validation is the layer the checkout trusts, so it is tested on its own:
   a value in, an error message or null out, no React involved. Each block
   covers the happy path, the realistic typo, and the boundary. */

describe('sanitizeText', () => {
  it('trims and collapses whitespace', () => {
    expect(v.sanitizeText('  Daniel   Svoboda  ')).toBe('Daniel Svoboda')
  })

  it('strips control characters that would corrupt stored JSON', () => {
    // written as escapes, so the test file itself stays plain text
    expect(v.sanitizeText('Dan\u0000\u001FSvoboda')).toBe('Dan Svoboda')
    expect(v.sanitizeText('line\u2028break')).toBe('line break')
    expect(v.sanitizeText('tab\tand\nnewline')).toBe('tab and newline')
  })

  it('caps the length so storage cannot be bloated from a form', () => {
    expect(v.sanitizeText('abcdefghij', 4)).toBe('abcd')
    expect(v.sanitizeText('x'.repeat(5000))).toHaveLength(v.MAX_FIELD)
  })

  it('returns a string for every input type', () => {
    expect(v.sanitizeText(null)).toBe('')
    expect(v.sanitizeText(undefined)).toBe('')
    expect(v.sanitizeText(42)).toBe('42')
  })
})

describe('escapeHtml', () => {
  it('neutralises the characters that matter in markup', () => {
    expect(v.escapeHtml('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
    )
    expect(v.escapeHtml("O'Brien & co")).toBe('O&#39;Brien &amp; co')
  })
})

describe('validateEmail', () => {
  it.each(['dan@example.com', 'a.b+tag@sub.example.co.uk'])('accepts %s', (email) => {
    expect(v.validateEmail(email)).toBeNull()
  })

  it.each([
    ['', 'empty'],
    ['dan', 'no at sign'],
    ['dan@example', 'no top-level domain'],
    ['dan @example.com', 'contains a space'],
    ['a..b@example.com', 'consecutive dots'],
    ['dan@@example.com', 'two at signs'],
  ])('rejects %s (%s)', (email) => {
    expect(v.validateEmail(email)).toEqual(expect.any(String))
  })
})

describe('validateName', () => {
  it('accepts a full name, including diacritics and hyphens', () => {
    expect(v.validateName('Daniel Svoboda')).toBeNull()
    expect(v.validateName('Žofie Dvořáková')).toBeNull()
    expect(v.validateName("Anne-Marie O'Neill")).toBeNull()
  })

  it('asks for a surname when only one word is given', () => {
    expect(v.validateName('Dan')).toMatch(/first and last/)
  })

  it('rejects digits and markup', () => {
    expect(v.validateName('<script>x</script>')).toEqual(expect.any(String))
    expect(v.validateName('Agent 47')).toEqual(expect.any(String))
  })
})

describe('validatePassword', () => {
  it('requires eight characters with a letter and a digit', () => {
    expect(v.validatePassword('abcdefg1')).toBeNull()
    expect(v.validatePassword('short1')).toMatch(/8 characters/)
    expect(v.validatePassword('abcdefgh')).toMatch(/letter and one number/)
    expect(v.validatePassword('12345678')).toMatch(/letter and one number/)
  })
})

describe('validatePhone', () => {
  it('accepts international formats', () => {
    expect(v.validatePhone('+1 555 0100')).toBeNull()
    expect(v.validatePhone('(020) 7946-0958')).toBeNull()
  })

  it('rejects too few and too many digits', () => {
    expect(v.validatePhone('12345')).toMatch(/too short/)
    expect(v.validatePhone('1'.repeat(16))).toMatch(/too long/)
  })
})

describe('validatePostcode', () => {
  it('applies the rule for the chosen country', () => {
    expect(v.validatePostcode('78701', 'United States')).toBeNull()
    expect(v.validatePostcode('78701-1234', 'United States')).toBeNull()
    expect(v.validatePostcode('K1A 0B1', 'Canada')).toBeNull()
    expect(v.validatePostcode('SW1A 1AA', 'United Kingdom')).toBeNull()
    expect(v.validatePostcode('3000', 'Australia')).toBeNull()
  })

  it('rejects a code from the wrong country', () => {
    expect(v.validatePostcode('SW1A 1AA', 'United States')).toMatch(/5 digits/)
    expect(v.validatePostcode('78701', 'Australia')).toMatch(/4 digits/)
  })
})

describe('validateAddress', () => {
  it('requires a building number', () => {
    expect(v.validateAddress('24 Lakeside Drive')).toBeNull()
    expect(v.validateAddress('Lakeside Drive')).toMatch(/number/)
  })
})

describe('luhn', () => {
  it('accepts the standard test numbers', () => {
    expect(v.luhn('4242424242424242')).toBe(true) // Visa
    expect(v.luhn('5555555555554444')).toBe(true) // Mastercard
    expect(v.luhn('378282246310005')).toBe(true) // Amex
  })

  it('catches a single-digit typo', () => {
    expect(v.luhn('4242424242424241')).toBe(false)
  })

  it('catches a transposition', () => {
    expect(v.luhn('4242424242424422')).toBe(false)
  })

  it('ignores spaces and dashes', () => {
    expect(v.luhn('4242 4242-4242 4242')).toBe(true)
  })
})

describe('cardBrand', () => {
  it('identifies the scheme and its security-code length', () => {
    expect(v.cardBrand('4242424242424242')).toEqual({ brand: 'Visa', cvc: 3 })
    expect(v.cardBrand('5555555555554444')).toEqual({ brand: 'Mastercard', cvc: 3 })
    expect(v.cardBrand('378282246310005')).toEqual({ brand: 'American Express', cvc: 4 })
    expect(v.cardBrand('6011111111111117')).toEqual({ brand: 'Discover', cvc: 3 })
  })

  it('falls back to a generic card', () => {
    expect(v.cardBrand('9999999999999999').brand).toBe('Card')
  })
})

describe('validateCard', () => {
  it('accepts a well-formed number with separators', () => {
    expect(v.validateCard('4242 4242 4242 4242')).toBeNull()
  })

  it('reports the specific problem', () => {
    expect(v.validateCard('')).toMatch(/required/)
    expect(v.validateCard('4242')).toMatch(/too short/)
    expect(v.validateCard('4'.repeat(20))).toMatch(/too long/)
    expect(v.validateCard('4242424242424241')).toMatch(/not valid/)
  })
})

describe('validateExpiry', () => {
  // every assertion is relative to this, never to the real clock
  const now = new Date(2026, 9, 16) // October 2026

  it('accepts a future date in several notations', () => {
    expect(v.validateExpiry('04 / 29', now)).toBeNull()
    expect(v.validateExpiry('04/29', now)).toBeNull()
    expect(v.validateExpiry('0429', now)).toBeNull()
    expect(v.validateExpiry('04 / 2029', now)).toBeNull()
  })

  it('treats the expiry month itself as still valid', () => {
    expect(v.validateExpiry('10 / 26', now)).toBeNull()
  })

  it('rejects the month before', () => {
    expect(v.validateExpiry('09 / 26', now)).toMatch(/expired/)
  })

  it('rejects an impossible month and an implausible year', () => {
    expect(v.validateExpiry('13 / 29', now)).toMatch(/between 01 and 12/)
    expect(v.validateExpiry('01 / 2099', now)).toMatch(/expiry year/)
  })
})

describe('validateCvc', () => {
  it('wants four digits for Amex and three for everything else', () => {
    expect(v.validateCvc('123', '4242424242424242')).toBeNull()
    expect(v.validateCvc('1234', '4242424242424242')).toMatch(/3 digits/)
    expect(v.validateCvc('1234', '378282246310005')).toBeNull()
    expect(v.validateCvc('123', '378282246310005')).toMatch(/4 digits/)
  })
})

describe('input masks', () => {
  it('groups a card number in fours, and Amex as 4-6-5', () => {
    expect(v.maskCard('4242424242424242')).toBe('4242 4242 4242 4242')
    expect(v.maskCard('378282246310005')).toBe('3782 822463 10005')
  })

  it('never lets the user exceed the field', () => {
    expect(v.maskCard('4'.repeat(30)).replace(/\s/g, '')).toHaveLength(19)
    expect(v.maskExpiry('04292')).toBe('04 / 29')
    expect(v.maskCvc('12345')).toBe('1234')
  })

  it('leaves a half-typed expiry alone', () => {
    expect(v.maskExpiry('0')).toBe('0')
    expect(v.maskExpiry('04')).toBe('04')
  })
})

describe('step validators', () => {
  const now = new Date(2026, 9, 16)

  it('returns an empty object when a step is clean', () => {
    expect(
      v.validateAccountStep({ name: 'Daniel Svoboda', email: 'dan@example.com', password: 'abcdefg1' }),
    ).toEqual({})
    expect(
      v.validateDeliveryStep({
        address: '24 Lakeside Drive',
        city: 'Austin',
        zip: '78701',
        country: 'United States',
      }),
    ).toEqual({})
    expect(
      v.validatePaymentStep({ card: '4242424242424242', exp: '04 / 29', cvc: '123' }, now),
    ).toEqual({})
  })

  it('blames every failing field at once, so the form can mark them all', () => {
    const errors = v.validatePaymentStep({ card: '1', exp: 'nope', cvc: '' }, now)
    expect(Object.keys(errors).sort()).toEqual(['card', 'cvc', 'exp'])
  })

  it('checks the postal code against the selected country', () => {
    const errors = v.validateDeliveryStep({
      address: '24 Lakeside Drive',
      city: 'Austin',
      zip: '78701',
      country: 'Australia',
    })
    expect(errors.zip).toMatch(/4 digits/)
  })

  it('rejects a country that is not on the list', () => {
    expect(v.validateCountry('Narnia')).toEqual(expect.any(String))
    expect(v.validateCountry(v.COUNTRIES[0])).toBeNull()
  })
})
