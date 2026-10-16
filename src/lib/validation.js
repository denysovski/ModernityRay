/* Client-side input validation and sanitization.
 *
 * Every function here is pure and framework-free: a value in, an error string
 * or null out. That is what lets the whole rule set be unit-tested without
 * rendering a form, and it keeps the rules in one file instead of scattered
 * across onChange handlers.
 *
 * On the security framing — this is a frontend-only project, so none of this
 * is a substitute for server-side checks, and it is not pretending to be. It
 * does three things that are genuinely the client's job:
 *
 *   1. Sanitize before persisting. Anything that reaches localStorage is
 *      length-capped and stripped of control characters, so a crafted value
 *      cannot bloat storage or smuggle terminators into stored JSON.
 *   2. Never retain a secret. Passwords are validated and dropped; card
 *      numbers are validated and reduced to a brand and the last four digits
 *      before an order is written.
 *   3. Reject structurally impossible input early (a failed Luhn check, an
 *      expiry in the past), so bad data never enters application state.
 *
 * Returning `null` for "valid" rather than `true` means a validator's result
 * can be dropped straight into an errors object.
 */

/* C0/C1 control characters plus the Unicode line and paragraph separators,
   matched by code point. Done with a character test rather than a regex so
   the source file never has to carry raw control bytes. */
const isControl = (cp) =>
  cp <= 0x1f || (cp >= 0x7f && cp <= 0x9f) || cp === 0x2028 || cp === 0x2029

/** Replaces every control character in a string with a single space. */
const stripControls = (input) => {
  let out = ''
  for (const ch of input) out += isControl(ch.codePointAt(0)) ? ' ' : ch
  return out
}

/** Longest value any single text field will persist. */
export const MAX_FIELD = 240

/**
 * Normalizes a free-text value for storage.
 * Strips C0/C1 control characters (which includes the line and paragraph
 * separators that break stored JSON when it is re-read loosely), collapses
 * runs of whitespace, trims, and caps the length.
 * @param {unknown} value
 * @param {number} [max]
 * @returns {string} always a string, never null or undefined
 */
export const sanitizeText = (value, max = MAX_FIELD) => {
  if (value === null || value === undefined) return ''
  const limit = Number.isInteger(max) && max > 0 ? max : MAX_FIELD
  return stripControls(String(value))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit)
}

/**
 * Escapes the five characters that matter in HTML.
 * Nothing in this app sets innerHTML — React escapes by default — but any
 * value that ends up in a `title`, a document title or a generated download
 * goes through here, so the habit is explicit rather than assumed.
 * @param {unknown} value
 */
export const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

/** Digits only, for card and phone handling. */
const digits = (value) => String(value ?? '').replace(/\D+/g, '')

/* ── individual field rules ────────────────────────────────────────────────
   Each returns an error message, or null when the value is acceptable. */

/**
 * Deliberately not the RFC 5322 monster. A single @, something before it,
 * a dotted domain after it, no whitespace, no consecutive dots — which
 * rejects every typo a real user makes and accepts every address they own.
 */
export const validateEmail = (value) => {
  const v = sanitizeText(value, 160)
  if (!v) return 'Email is required.'
  if (v.length > 160) return 'Email is too long.'
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v)) return 'Enter a valid email address.'
  if (v.includes('..')) return 'Enter a valid email address.'
  return null
}

export const validateName = (value) => {
  const v = sanitizeText(value, 80)
  if (!v) return 'Full name is required.'
  if (v.length < 2) return 'That name looks too short.'
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'\-. ]*$/u.test(v)) return 'Use letters, spaces, hyphens and apostrophes only.'
  if (!/ /.test(v)) return 'Please enter your first and last name.'
  return null
}

/**
 * Not stored anywhere — see lib/store — but the rule is enforced so the form
 * behaves like a real sign-up and the requirement is demonstrably handled.
 */
export const validatePassword = (value) => {
  const v = String(value ?? '')
  if (!v) return 'Password is required.'
  if (v.length < 8) return 'Use at least 8 characters.'
  if (v.length > 128) return 'Password is too long.'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include at least one letter and one number.'
  return null
}

/** E.164-ish: optional +, 7 to 15 digits once separators are stripped. */
export const validatePhone = (value) => {
  const v = sanitizeText(value, 32)
  if (!v) return 'Phone number is required.'
  if (!/^\+?[\d\s().-]+$/.test(v)) return 'Use digits, spaces and + ( ) - only.'
  const d = digits(v)
  if (d.length < 7) return 'That number is too short.'
  if (d.length > 15) return 'That number is too long.'
  return null
}

export const validateAddress = (value) => {
  const v = sanitizeText(value, 240)
  if (!v) return 'Street address is required.'
  if (v.length < 5) return 'Please enter the full street address.'
  if (!/\d/.test(v)) return 'Include the house or building number.'
  return null
}

export const validateCity = (value) => {
  const v = sanitizeText(value, 80)
  if (!v) return 'City is required.'
  if (v.length < 2) return 'That city name looks too short.'
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'\-. ]*$/u.test(v)) return 'Use letters, spaces and hyphens only.'
  return null
}

/** Postal-code shapes for the four countries the delivery step offers. */
const POSTCODE = {
  'United States': { re: /^\d{5}(-\d{4})?$/, hint: 'ZIP should be 5 digits, e.g. 78701.' },
  Canada: { re: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, hint: 'Postal code should look like K1A 0B1.' },
  'United Kingdom': {
    re: /^[A-Za-z]{1,2}\d[A-Za-z\d]?[ ]?\d[A-Za-z]{2}$/,
    hint: 'Postcode should look like SW1A 1AA.',
  },
  Australia: { re: /^\d{4}$/, hint: 'Postcode should be 4 digits, e.g. 3000.' },
}

export const COUNTRIES = Object.keys(POSTCODE)

/**
 * @param {string} value
 * @param {string} [country] one of COUNTRIES; unknown countries get a loose check
 */
export const validatePostcode = (value, country = 'United States') => {
  const v = sanitizeText(value, 12)
  if (!v) return 'Postal code is required.'
  const rule = POSTCODE[country]
  if (!rule) return /^[A-Za-z\d][A-Za-z\d \-]{1,10}$/.test(v) ? null : 'Enter a valid postal code.'
  return rule.re.test(v) ? null : rule.hint
}

export const validateCountry = (value) =>
  COUNTRIES.includes(sanitizeText(value, 60)) ? null : 'Choose a delivery country.'

/* ── payment card ──────────────────────────────────────────────────────── */

/**
 * The Luhn checksum — the check every real payment form runs before it ever
 * contacts a processor. Doubling every second digit from the right and
 * summing the digits of the results must give a multiple of ten.
 * @param {string} value digits, with or without separators
 */
export const luhn = (value) => {
  const d = digits(value)
  if (d.length < 2) return false
  let sum = 0
  let double = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48
    if (double) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    double = !double
  }
  return sum % 10 === 0
}

const BRANDS = [
  { brand: 'Visa', re: /^4\d{12}(\d{3})?(\d{3})?$/, lengths: [13, 16, 19], cvc: 3 },
  { brand: 'Mastercard', re: /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/, lengths: [16], cvc: 3 },
  { brand: 'American Express', re: /^3[47]\d{13}$/, lengths: [15], cvc: 4 },
  { brand: 'Discover', re: /^(6011\d{12}|65\d{14}|64[4-9]\d{13})$/, lengths: [16], cvc: 3 },
]

/**
 * Identifies the card scheme from the number, for the CVC length rule and
 * for labelling the stored order ("Visa ····4242").
 * @returns {{brand: string, cvc: number}} 'Card' when nothing matches
 */
export const cardBrand = (value) => {
  const d = digits(value)
  const hit = BRANDS.find((b) => b.re.test(d))
  return hit ? { brand: hit.brand, cvc: hit.cvc } : { brand: 'Card', cvc: 3 }
}

export const validateCard = (value) => {
  const d = digits(value)
  if (!d) return 'Card number is required.'
  if (d.length < 12) return 'That card number is too short.'
  if (d.length > 19) return 'That card number is too long.'
  if (!luhn(d)) return 'That card number is not valid — check for a typo.'
  return null
}

/**
 * Accepts MM/YY, MM / YYYY and MMYY. A card is valid through the last day of
 * its expiry month, so the comparison is month-granular.
 * @param {string} value
 * @param {Date} [now] injected so tests do not depend on the clock
 */
export const validateExpiry = (value, now = new Date()) => {
  const v = sanitizeText(value, 10)
  if (!v) return 'Expiry date is required.'
  const m = /^(\d{1,2})\s*[/\-. ]?\s*(\d{2}|\d{4})$/.exec(v)
  if (!m) return 'Use MM / YY.'

  const month = Number(m[1])
  if (month < 1 || month > 12) return 'Month must be between 01 and 12.'

  const rawYear = Number(m[2])
  const year = m[2].length === 2 ? 2000 + rawYear : rawYear

  const nowYear = now.getFullYear()
  if (year < nowYear || (year === nowYear && month < now.getMonth() + 1)) {
    return 'That card has expired.'
  }
  if (year > nowYear + 20) return 'Check the expiry year.'
  return null
}

/** @param {string} value @param {string} [card] the card number, for the length rule */
export const validateCvc = (value, card = '') => {
  const d = digits(value)
  if (!d) return 'Security code is required.'
  const expected = cardBrand(card).cvc
  if (d.length !== expected) {
    return `Security code should be ${expected} digits.`
  }
  return null
}

/* ── step validators ───────────────────────────────────────────────────────
   The checkout validates a step at a time. Each returns an errors object,
   empty when the step is clean, so a caller can do `Object.keys(e).length`. */

/** @typedef {Record<string, string>} Errors */

/** @returns {Errors} */
export const validateAccountStep = (form) => {
  const errors = {}
  const name = validateName(form.name)
  if (name) errors.name = name
  const email = validateEmail(form.email)
  if (email) errors.email = email
  const password = validatePassword(form.password)
  if (password) errors.password = password
  return errors
}

/** @returns {Errors} */
export const validateDetailsStep = (form) => {
  const errors = {}
  const name = validateName(form.name)
  if (name) errors.name = name
  const email = validateEmail(form.email)
  if (email) errors.email = email
  const phone = validatePhone(form.phone)
  if (phone) errors.phone = phone
  return errors
}

/** @returns {Errors} */
export const validateDeliveryStep = (form) => {
  const errors = {}
  const address = validateAddress(form.address)
  if (address) errors.address = address
  const city = validateCity(form.city)
  if (city) errors.city = city
  const zip = validatePostcode(form.zip, form.country)
  if (zip) errors.zip = zip
  const country = validateCountry(form.country)
  if (country) errors.country = country
  return errors
}

/** @returns {Errors} */
export const validatePaymentStep = (form, now = new Date()) => {
  const errors = {}
  const card = validateCard(form.card)
  if (card) errors.card = card
  const exp = validateExpiry(form.exp, now)
  if (exp) errors.exp = exp
  const cvc = validateCvc(form.cvc, form.card)
  if (cvc) errors.cvc = cvc
  return errors
}

/** Newsletter and other single-field forms. */
export const validateSubscribe = (email) => {
  const error = validateEmail(email)
  return error ? { email: error } : {}
}

/* ── input masks ───────────────────────────────────────────────────────────
   Formatting as the user types, kept next to the rules that read the result
   so the two cannot drift apart. */

/** '4242424242424242' -> '4242 4242 4242 4242' (Amex groups 4-6-5). */
export const maskCard = (value) => {
  const d = digits(value).slice(0, 19)
  if (/^3[47]/.test(d)) {
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ')
  }
  return (d.match(/.{1,4}/g) || []).join(' ')
}

/** '0429' -> '04 / 29', and stops the user typing a third group. */
export const maskExpiry = (value) => {
  const d = digits(value).slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)} / ${d.slice(2)}`
}

export const maskCvc = (value) => digits(value).slice(0, 4)
