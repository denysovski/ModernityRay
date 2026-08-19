/* Inline icon set — stroke/fill follow currentColor, so icons take the
   colour of whatever they sit inside. */
export const Icon = {
  arrow: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowUR: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  left: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  right: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  members: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6.2a3 3 0 0 1 0 5.6M16.8 19c.2-2.3-.8-4-2-5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  spark: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}>
      <path d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" {...p}>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  expand: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  quote: (p) => (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" {...p}>
      <path d="M10 7c-3 0-5 2.3-5 5.4 0 2.7 1.8 4.6 4.2 4.6 1.4 0 2.5-1 2.5-2.4 0-1.3-1-2.3-2.3-2.3-.2 0-.5 0-.6.1.2-1.3 1.4-2.4 2.9-2.6.4 0 .7-.4.7-.8V7.8c0-.5-.4-.8-.9-.8H10Zm9 0c-3 0-5 2.3-5 5.4 0 2.7 1.8 4.6 4.2 4.6 1.4 0 2.5-1 2.5-2.4 0-1.3-1-2.3-2.3-2.3-.2 0-.5 0-.6.1.2-1.3 1.4-2.4 2.9-2.6.4 0 .7-.4.7-.8V7.8c0-.5-.4-.8-.9-.8H19Z" />
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M12 0c.7 6.3 4.4 9.3 12 10-7.6.7-11.3 3.7-12 14-.7-10.3-4.4-13.3-12-14C7.6 9.3 11.3 6.3 12 0Z" />
    </svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  share: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...p}>
      <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.2 10.9 6.6-3.6M8.2 13.1l6.6 3.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  instagram: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.1L8 21H5l7.5-8.6L4.5 3H11l4.5 5.5L17.5 3Zm-1 16h1.7L8 4.8H6.2L16.5 19Z" />
    </svg>
  ),
  linkedin: (p) => (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" {...p}>
      <path d="M6.5 8.5v10h-3v-10h3Zm.3-3.2a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0ZM20.5 13v5.5h-3V13.4c0-1.2-.4-2-1.5-2-1.7 0-1.9 1.6-1.9 2.5v4.6h-3v-10h2.9v1.3c.5-.7 1.4-1.6 3.1-1.6 2.3 0 3.4 1.5 3.4 4.5Z" />
    </svg>
  ),
  chevron: (p) => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" {...p}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flame: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <path d="M12 3c.6 3 3.5 4.4 3.5 8a3.5 3.5 0 1 1-7 0c0-1.2.5-2 .5-2-2 .6-3.5 2.5-3.5 5A6 6 0 0 0 18 14c0-5-4-7-6-11z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  dumbbell: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  body: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" {...p}>
      <circle cx="12" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 10c2 1 4.5 1.5 7 1.5S17 11 19 10M12 11.5V17m0 0-3 4m3-4 3 4"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  cart: (p) => (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" {...p}>
      <path d="M3 4h2.2l2.2 10.4a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.55L20.5 8H6.2"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="20" r="1.5" fill="currentColor" />
    </svg>
  ),
  logo: (p) => (
    <svg viewBox="0 0 28 28" width="26" height="26" {...p}>
      <circle cx="14" cy="14" r="12.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="14" r="3.4" fill="currentColor" />
      <path d="M14 1.6v8M14 18.4v8M1.6 14h8M18.4 14h8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
}
