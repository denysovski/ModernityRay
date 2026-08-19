import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('public/pages')
await mkdir(OUT, { recursive: true })

const BASE = (() => {
  const raw = process.env.BASE_PATH || '/'
  const prefixed = raw.startsWith('/') ? raw : `/${raw}`
  return prefixed.endsWith('/') ? prefixed : `${prefixed}/`
})()

const applyBase = (html) =>
  html
    .replaceAll('href="/', `href="${BASE}`)
    .replaceAll('src="/', `src="${BASE}`)

/* Image library. Every page below opens on a different photograph, and no
   page repeats an image within itself:
     courts   open-air hard courts     aerial    court from above, estate
     clay     championship clay        woodcourt court in woodland (portrait)
     golf     lakeside greens          courtside shoes, racket & ball
     palms    grounds & terraces       baseline  shoes & ball on clay
     rackets  pro shop                 courtlife player seated courtside
     ball     ball on court            bluesky   player against blue sky (portrait)
     player   player mid-match         fixture   floodlit match in play
     runners  runners at dusk          scrum     team locked in a scrum
     cycling  cyclist POV              swim      butterfly, full stroke
     strength conditioning, mono       lanes     swimmer in the lane
     floodlit sprinklers, floodlit     yoga      studio mobility flow
     night    full floodlit arena      stretch   warm-up by the water (portrait)
     air      athlete mid-air
   Note: portrait sources suit the near-square .phero-img slot, not the wide
   .banner — keep woodcourt / bluesky / stretch out of banner blocks.        */
const I = {
  courts: '/img/courts.jpg', clay: '/img/clay.jpg', golf: '/img/golf.jpg',
  palms: '/img/palms.jpg', rackets: '/img/rackets.jpg', ball: '/img/ball.jpg', player: '/img/player.jpg',
  runners: '/img/runners.jpg', cycling: '/img/cycling.jpg', strength: '/img/strength.jpg',
  floodlit: '/img/floodlights.jpg', night: '/img/night.jpg', air: '/img/airborne.jpg',
  aerial: '/img/aerial.jpg', woodcourt: '/img/woodcourt.jpg', courtside: '/img/courtside.jpg',
  baseline: '/img/baseline.jpg', courtlife: '/img/courtlife.jpg', bluesky: '/img/bluesky.jpg',
  fixture: '/img/fixture.jpg', scrum: '/img/scrum.jpg', swim: '/img/swim.jpg',
  lanes: '/img/lanes.jpg', yoga: '/img/yoga.jpg', stretch: '/img/stretch.jpg',
}

/* ---------- shared svg ---------- */
const arrow = `<svg class="svg-i" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const arrowUR = `<svg class="svg-i" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const play = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>`
const check = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ig = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg>`
const xicon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.1L8 21H5l7.5-8.6L4.5 3H11l4.5 5.5L17.5 3Zm-1 16h1.7L8 4.8H6.2L16.5 19Z"/></svg>`
const li = `<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M6.5 8.5v10h-3v-10h3Zm.3-3.2a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0ZM20.5 13v5.5h-3V13.4c0-1.2-.4-2-1.5-2-1.7 0-1.9 1.6-1.9 2.5v4.6h-3v-10h2.9v1.3c.5-.7 1.4-1.6 3.1-1.6 2.3 0 3.4 1.5 3.4 4.5Z"/></svg>`
const shareI = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="6" cy="12" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="m8.2 10.9 6.6-3.6M8.2 13.1l6.6 3.6" stroke="currentColor" stroke-width="1.7"/></svg>`
const closeI = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
const quoteI = `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M10 7c-3 0-5 2.3-5 5.4 0 2.7 1.8 4.6 4.2 4.6 1.4 0 2.5-1 2.5-2.4 0-1.3-1-2.3-2.3-2.3-.2 0-.5 0-.6.1.2-1.3 1.4-2.4 2.9-2.6.4 0 .7-.4.7-.8V7.8c0-.5-.4-.8-.9-.8H10Zm9 0c-3 0-5 2.3-5 5.4 0 2.7 1.8 4.6 4.2 4.6 1.4 0 2.5-1 2.5-2.4 0-1.3-1-2.3-2.3-2.3-.2 0-.5 0-.6.1.2-1.3 1.4-2.4 2.9-2.6.4 0 .7-.4.7-.8V7.8c0-.5-.4-.8-.9-.8H19Z"/></svg>`
const chevL = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const chevR = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const cartI = `<svg viewBox="0 0 24 24" width="19" height="19" fill="none"><path d="M3 4h2.2l2.2 10.4a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.55L20.5 8H6.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.5" fill="currentColor"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor"/></svg>`
/* Unsplash portraits, used only for member avatars. */
const face = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=160&q=80`
const dock = `<div class="dock" data-dock><div class="dock-inner">
  <div class="dock-panel">
    <a class="dock-bubble dock-lime" href="#" aria-label="Instagram">${ig}</a>
    <a class="dock-bubble dock-dark" href="#" aria-label="X">${xicon}</a>
    <a class="dock-bubble dock-white" href="#" aria-label="LinkedIn">${li}</a>
  </div>
  <button class="dock-trigger" data-dock-btn aria-label="Connect with us"><span class="dock-i dock-i-share">${shareI}</span><span class="dock-i dock-i-close">${closeI}</span></button>
</div></div>`

/* ---------- shared mega-menu nav + main footer (identical on every page) ---------- */
const chev = `<svg class="pnav-chev" viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const MEGA_COURTS = [
  ['Centre Court', 'Championship clay, floodlit', I.clay, 'centre-court'],
  ['The Lawns', 'Six open-air hard courts', I.courts, 'the-lawns'],
  ['Golf Greens', '18-hole lakeside course', I.golf, 'golf-greens'],
]
const MEGA_LIFE = [
  ['Merchandise', 'Apparel & equipment', 'merchandise'],
  ['Memberships', 'Tiers & residencies', 'memberships'],
  ['Wellness & Spa', 'Recovery and reset', 'wellness-spa'],
  ['Events & Socials', 'The members’ calendar', 'events-socials'],
  ['Dining', 'Lakeside clubhouse', 'dining'],
  ['Gift cards', 'Give the club', 'gift-cards'],
]
const MEGA_JOIN_CARDS = [
  ['Become a member', 'Apply for a residency', I.stretch, 'become-a-member'],
  ['Book a private tour', 'See the club in person', I.woodcourt, 'book-a-private-tour'],
  ['Gift a membership', 'Give access to the club', I.air, 'gift-a-membership'],
]
const MEGA_JOIN_LINKS = [
  ['Pricing & tiers', 'From day pass to signature', 'pricing-tiers'],
  ['Corporate membership', 'Teams & partners', 'corporate-membership'],
  ['Junior & family', 'All ages welcome', 'junior-family'],
  ['FAQ', 'Everything you need', 'faq'],
]
const rows = (arr) => `<div class="mega-rows">${arr.map(([n, d, s]) => `<a class="mega-row" href="/pages/${s}.html"><span class="mega-row-t"><strong>${n}</strong><span>${d}</span></span>${arrow}</a>`).join('')}</div>`

const nav = `<header class="pnav"><div class="pnav-in">
  <a href="/" class="pnav-logo">CourtSy<span>.</span></a>
  <nav class="pnav-links">
    <a class="pnav-link" href="/pages/club.html">Club</a>
    <div class="pnav-item">
      <a class="pnav-link" href="/pages/centre-court.html">Courts ${chev}</a>
      <div class="pnav-mega">
        <div class="mega mega-courts">${MEGA_COURTS.map(([n, d, img, s]) => `<a class="mega-court" href="/pages/${s}.html"><span class="mega-court-img"><img src="${img}" alt="${n}"/></span><span class="mega-court-t"><strong>${n}</strong><span>${d}</span></span></a>`).join('')}</div>
      </div>
    </div>
    <div class="pnav-item">
      <a class="pnav-link" href="/pages/memberships.html">Lifestyle ${chev}</a>
      <div class="pnav-mega pnav-mega-wide">
        <div class="mega mega-feature">
          ${rows(MEGA_LIFE)}
          <a class="mega-card" href="/pages/memberships.html"><img src="${I.courtlife}" alt="Lifestyle"/><span class="mega-card-scrim"></span><span class="mega-card-tag">Featured</span><span class="mega-card-b"><strong>The members&rsquo; lifestyle, beyond the baseline.</strong><span class="btn btn-member mega-card-btn">Explore lifestyle <span class="btn-bubble">${arrow}</span></span></span></a>
        </div>
      </div>
    </div>
    <div class="pnav-item">
      <a class="pnav-link" href="/pages/become-a-member.html">Join ${chev}</a>
      <div class="pnav-mega pnav-mega-wide">
        <div class="mega mega-join">
          <div class="mega-join-cards">${MEGA_JOIN_CARDS.map(([n, d, img, s]) => `<a class="mega-jcard" href="/pages/${s}.html"><span class="mega-jcard-img"><img src="${img}" alt="${n}"/></span><strong>${n}</strong><span>${d}</span></a>`).join('')}</div>
          <div class="mega-join-side">${rows(MEGA_JOIN_LINKS)}<a class="btn btn-member mega-join-btn" href="/pages/become-a-member.html">Start your application <span class="btn-bubble">${arrow}</span></a></div>
        </div>
      </div>
    </div>
  </nav>
  <a href="/pages/become-a-member.html#plans" class="btn btn-member pnav-cta">Become a member <span class="btn-bubble">${arrow}</span></a>
  <button class="pnav-burger" aria-label="Menu" data-burger><span></span><span></span><span></span></button>
</div>
<div class="pnav-drawer">
  <a href="/">Home</a>
  <a href="/pages/club.html">Club</a>
  <a href="/pages/centre-court.html">Courts</a>
  <a href="/pages/memberships.html">Lifestyle</a>
  <a href="/pages/become-a-member.html">Join</a>
  <a href="/pages/become-a-member.html#plans" class="btn btn-member pnav-drawer-cta">Become a member <span class="btn-bubble">${arrow}</span></a>
</div></header>`

const FCOLS = [
  ['Courts', [['Centre Court', 'centre-court'], ['The Lawns', 'the-lawns'], ['Golf Greens', 'golf-greens'], ['Book a court', 'centre-court']]],
  ['Lifestyle', [['Merchandise', 'merchandise'], ['Memberships', 'memberships'], ['Wellness & Spa', 'wellness-spa'], ['Events', 'events-socials']]],
  ['Club', [['About us', 'club'], ['Dining', 'dining'], ['Junior & Family', 'junior-family'], ['Contact', 'become-a-member']]],
  ['Join', [['Become a member', 'become-a-member'], ['Pricing & Tiers', 'pricing-tiers'], ['Book a tour', 'book-a-private-tour'], ['FAQ', 'faq']]],
]
const footer = `<footer class="mfoot"><div class="mfoot-pad">
  <div class="mfoot-grid">
    <div class="mfoot-brand">
      <a href="/" class="mfoot-logo">CourtSy<span>.</span></a>
      <p>A private members&rsquo; sport club. Start today, play forever.</p>
      <a href="/pages/become-a-member.html#plans" class="btn btn-member mfoot-join">Become a member <span class="btn-bubble">${arrow}</span></a>
    </div>
    ${FCOLS.map(([h, items]) => `<div class="mfoot-col"><h4>${h}</h4>${items.map(([l, s]) => `<a href="/pages/${s}.html">${l}</a>`).join('')}</div>`).join('')}
  </div>
  <div class="mfoot-bottom"><span class="mfoot-logo mfoot-logo-sm">CourtSy<span>.</span></span><span class="mfoot-copy">© 2026 CourtSy Sport Club. All rights reserved.</span>
    <div class="mfoot-mini"><a href="/pages/faq.html">Terms</a><a href="/pages/faq.html">Privacy</a><a href="/pages/faq.html">Cookies</a></div>
  </div>
</div></footer>`

/* ---------- block renderers ---------- */
const starI = `<svg class="deco-star" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 0c.7 6.3 4.4 9.3 12 10-7.6.7-11.3 3.7-12 14-.7-10.3-4.4-13.3-12-14C7.6 9.3 11.3 6.3 12 0Z"/></svg>`
const eyebrow = (t) => `<span class="micro">${starI} ${t}</span>`
const head = (b) => `<div class="blk-head">${eyebrow(b.eyebrow)}<h2>${b.title}</h2>${b.lead ? `<p class="blk-lead">${b.lead}</p>` : ''}</div>`

/* Money strings in the content are display copy ("$2,280", "Bespoke") — parse
   a number out for the cart, and fall back to an enquiry link when there
   isn't one. */
const priceOf = (s) => {
  const n = Number(String(s).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** `variant`/`cls` are button classes; `opts` carries label + line-item shape. */
const buyBtn = (t, { variant = 'btn-dark', cls = '', label = 'Become a member', meta, shipped = true, prefix = 'plan' } = {}) => {
  const price = priceOf(t.price)
  if (price === null) {
    return `<a href="/pages/book-a-private-tour.html" class="btn ${variant} ${cls}">Talk to our team ${arrow}</a>`
  }
  const item = { id: `${prefix}-${slugify(t.name)}`, name: t.name, meta: meta ?? t.cadence, price, shipped }
  const json = JSON.stringify(item).replace(/"/g, '&quot;')
  return `<button type="button" class="btn ${variant} ${cls}" data-buy="${json}">${label} ${arrow}</button>`
}

const renderers = {
  hero: (b) => `<section class="phero shell">
    <div class="phero-text" data-reveal>${eyebrow(b.eyebrow)}
      <h1 class="phero-title">${b.title}</h1>
      <p class="phero-lead">${b.lead}</p>
      ${b.cta ? `<div class="phero-actions"><a href="/pages/become-a-member.html#plans" class="btn btn-green">Become a member</a></div>` : ''}
    </div>
    <figure class="phero-img" data-reveal data-d="1"><img src="${b.img}" alt="${b.title}"/></figure>
  </section>`,

  rich: (b) => `<section class="blk shell"><div class="rich" data-reveal>${eyebrow(b.eyebrow)}
    <h2>${b.title}</h2>${b.paras.map((p) => `<p>${p}</p>`).join('')}</div></section>`,

  split: (b) => `<section class="blk shell"><div class="split ${b.flip ? 'split-flip' : ''}">
    <figure class="split-img" data-reveal><img src="${b.img}" alt="${b.title}"/>${b.tag ? `<span class="split-tag">${b.tag}</span>` : ''}</figure>
    <div class="split-text" data-reveal data-d="1">${eyebrow(b.eyebrow)}<h3>${b.title}</h3>${b.paras.map((p) => `<p>${p}</p>`).join('')}
      ${b.bullets ? `<ul class="split-list">${b.bullets.map((x) => `<li><span class="li-check">${check}</span>${x}</li>`).join('')}</ul>` : ''}
    </div></div></section>`,

  features: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div><div class="hgrid stagger">
    ${b.cards.map((c) => `<figure class="hcell" data-reveal><img src="${c.img}" alt="${c.t}"/><div class="hcell-b"><h3>${c.t}</h3><p>${c.d}</p></div></figure>`).join('')}
  </div></section>`,

  banner: (b) => `<section class="banner"><img src="${b.img}" alt="${b.title}"/><div class="banner-scrim"></div>
    <div class="banner-b" data-reveal>${eyebrow(b.eyebrow)}
      <h1 class="banner-title">${b.title}</h1>
      <p class="banner-lead">${b.lead}</p>
      ${b.cta ? `<a href="/pages/become-a-member.html#plans" class="btn btn-green banner-btn">Become a member</a>` : ''}
    </div></section>`,

  form: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div>
    <form class="gform" data-reveal onsubmit="this.querySelector('.gform-done').style.display='inline-flex';return false">
      <div class="gform-row">
        <label>Your name<input type="text" placeholder="Jane Doe" required/></label>
        <label>Your email<input type="email" placeholder="you@email.com" required/></label>
      </div>
      <div class="gform-row">
        <label>Recipient name<input type="text" placeholder="Alex Doe"/></label>
        <label>Gift amount<select><option>$45 — day pass</option><option>$190 — one month Resident</option><option>$420 — one month Signature</option><option>$2,280 — one year Resident</option><option>Custom amount</option></select></label>
      </div>
      <label>Delivery method<select><option>Email — instant e-gift card</option><option>Printed card — collect in person</option><option>Post — mailed gift card</option></select></label>
      <label>Personal message<textarea placeholder="Add a note for the lucky recipient…"></textarea></label>
      <div class="gform-foot">
        <button class="btn btn-green gform-btn" type="submit">Send gift request</button>
        <span class="gform-done">${check} Sent — we’ll be in touch shortly.</span>
      </div>
    </form></section>`,

  gallery: (b) => `<section class="blk shell" style="padding-bottom:clamp(40px,5vw,64px)"><div data-reveal>${head(b)}</div></section>
  <div class="gal"><div class="gal-track">${[...b.shots, ...b.shots].map(([img, label]) => `<figure class="gshot"><img src="${img}" alt="${label}" loading="lazy"/><figcaption class="gshot-cap">${label}</figcaption></figure>`).join('')}</div></div>`,

  mediagrid: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div><div class="mgrid stagger">
    ${b.items.map((m) => `<figure class="mcell" data-reveal><img src="${m.img}" alt="${m.t}" loading="lazy"/><figcaption class="mcell-cap"><strong>${m.t}</strong><span>${m.d}</span></figcaption></figure>`).join('')}
  </div></section>`,

  products: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div><div class="prods stagger">
    ${b.items.map((it) => `<div class="prod" data-reveal>${it.img ? `<div class="prod-img"><img src="${it.img}" alt="${it.name}" loading="lazy"/></div>` : ''}
      <div class="prod-b"><div class="prod-top"><strong>${it.name}</strong><span class="prod-price">${it.price}</span></div><p>${it.note}</p></div></div>`).join('')}
  </div></section>`,

  list: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div><div class="plist stagger">
    ${b.items.map((it) => `<div class="pli" data-reveal><span class="pli-ic">${check}</span><div><strong>${it.t}</strong><p>${it.d}</p></div></div>`).join('')}
  </div></section>`,

  steps: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div><div class="steps stagger">
    ${b.steps.map((s, i) => `<div class="step" data-reveal><span class="step-n">0${i + 1}</span><span class="step-line"></span><h3>${s.t}</h3><p>${s.d}</p></div>`).join('')}
  </div></section>`,

  stats: (b) => `<section class="blk shell"><div class="tline stagger">
    ${b.items.map((s) => `<div class="tline-item" data-reveal><span class="tline-n">${s.n}</span><span class="tline-l">${s.l}</span></div>`).join('')}
  </div></section>`,

  /* Every tier is buyable: the button carries its line item as JSON and
     page.js hands it to window.CourtSyCart (see src/lib/cart.js). */
  tiers: (b) => `<section class="blk shell" id="plans"><div data-reveal>${head(b)}</div><div class="tiers stagger">
    ${b.tiers.map((t) => `<div class="tier2 ${t.hot ? 'tier2-hot' : ''}" data-reveal>
      ${t.hot ? '<span class="tier2-badge">Most popular</span>' : ''}
      <h3>${t.name}</h3><div class="tier2-price"><span class="tier2-n">${t.price}</span><span class="tier2-c">${t.cadence}</span></div>
      <p class="tier2-desc">${t.desc}</p>
      <ul class="tier2-list">${t.perks.map((x) => `<li><span class="li-check">${check}</span>${x}</li>`).join('')}</ul>
      ${buyBtn(t, { variant: t.hot ? 'btn-green' : 'btn-dark', cls: 'tier2-btn' })}
    </div>`).join('')}
  </div></section>`,

  faq: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div><div class="faqs stagger">
    ${b.items.map((f) => `<div class="faq" data-reveal><h3>${f.q}</h3><p>${f.a}</p></div>`).join('')}
  </div></section>`,

  /* Member voices — portrait, who they are, what they said. */
  reviews: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div><div class="revs stagger">
    ${b.items.map((r) => `<figure class="rev" data-reveal>
      <span class="rev-mark">${quoteI}</span>
      <blockquote class="rev-q">${r.quote}</blockquote>
      <figcaption class="rev-who">
        <img src="${r.img}" alt="${r.name}" loading="lazy"/>
        <span class="rev-id"><strong>${r.name}</strong><span>${r.role}</span></span>
      </figcaption>
    </figure>`).join('')}
  </div></section>`,

  /* Looping three-card deck. The active card sits centre with its detail
     open; the other two peek in from left and right. Driven by [data-deck]
     in page.js — CSS owns the positions, JS only sets data-pos. */
  deck: (b) => `<section class="blk shell"><div data-reveal>${head(b)}</div>
    <div class="deck" data-deck data-reveal>
      <button class="deck-nav deck-prev" data-deck-prev aria-label="Previous card">${chevL}</button>
      <div class="deck-stage">
        ${b.cards.map((c, i) => `<article class="deck-card" data-deck-card data-pos="${i === 0 ? 0 : i === 1 ? 1 : -1}">
          <div class="deck-face">
            <span class="deck-brand">CourtSy<span>.</span></span>
            <span class="deck-tag">${c.tag}</span>
            <span class="deck-amount">${c.price}</span>
            <span class="deck-name">${c.name}</span>
          </div>
          <div class="deck-info">
            <p class="deck-desc">${c.desc}</p>
            <ul class="deck-list">${c.perks.map((x) => `<li><span class="li-check">${check}</span>${x}</li>`).join('')}</ul>
            ${buyBtn(c, { variant: 'btn-green', cls: 'deck-btn', label: 'Send this card', meta: `Gift card · ${c.tag}`, shipped: false, prefix: 'gift' })}
          </div>
        </article>`).join('')}
      </div>
      <button class="deck-nav deck-next" data-deck-next aria-label="Next card">${chevR}</button>
      <div class="deck-dots">${b.cards.map((c, i) => `<button class="deck-dot${i === 0 ? ' on' : ''}" data-deck-dot="${i}" aria-label="${c.name}"></button>`).join('')}</div>
    </div></section>`,

  cta: (b) => `<section class="blk shell" style="padding-top:0"><div class="pcta" data-reveal><div class="pcta-glow"></div>
    <h2>${b.title}</h2><p>${b.text}</p>
    <a href="/pages/become-a-member.html#plans" class="btn btn-green" style="padding:18px 30px">Become a member</a>
  </div></section>`,
}

const render = (blocks) => blocks.map((b) => renderers[b.type](b)).join('\n')

const page = (p) => `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/embed/embed.css"/>
<link rel="stylesheet" href="/pages/page.css"/>
<title>${p.title} — CourtSy</title>
<script>window.process=window.process||{env:{NODE_ENV:"production"}};</script>
</head>
<body>
<div id="cs-nav"></div>
<div id="cs-dock"></div>
<main>
${render(p.blocks)}
</main>
${footer}
<script src="/embed/embed.js" defer></script>
<script src="/pages/page.js" defer></script>
</body>
</html>`

/* =======================================================================
   PER-PAGE CONTENT — each page is a unique sequence of blocks
   ======================================================================= */
const PAGES = [
  /* ---------------- CLUB ---------------- */
  { slug: 'club', title: 'A private club, built to move.', blocks: [
    { type: 'banner', eyebrow: 'The Club', img: I.night, title: 'A private club, built to move.',
      lead: 'CourtSy is a members-only sport club where courts, greens, coaching and recovery live under one considered roof — quiet, calm, and never crowded.' },
    { type: 'rich', eyebrow: 'Our story', title: 'A club designed around how you actually play.',
      paras: ['We started CourtSy with a simple frustration: clubs that were either beautiful but unusable, or busy but soulless. We wanted somewhere that respected your time — where a court is always free, the coaching is genuinely good, and the spaces feel calm the moment you walk in.',
              'Today that means tour-standard surfaces, a small team of certified coaches, and a membership that includes everything rather than nickel-and-diming you. One honest monthly price, no joining fee, cancel anytime.'] },
    { type: 'split', eyebrow: 'The difference', title: 'Considered, not crowded.', img: I.palms, tag: 'Members only',
      paras: ['Membership is capped on purpose. Fewer members means open courts, faster bookings and a community that actually knows each other.'],
      bullets: ['Capped membership for open courts', 'Priority booking up to 14 days ahead', 'Calm, low-noise spaces by design', 'A team that remembers your name'] },
    { type: 'features', eyebrow: 'Inside CourtSy', title: 'Everything membership includes.',
      cards: [{ t: 'World-class facilities', d: 'Clay, hard courts, lanes and an 18-hole lakeside course — all kept immaculate.', img: I.aerial },
              { t: 'Coaching that fits you', d: 'Certified pros, weekly clinics and private sessions built around your level.', img: I.courtlife },
              { t: 'Recovery & lifestyle', d: 'Spa, sauna, lakeside dining and a members calendar beyond the baseline.', img: I.yoga }] },
    { type: 'stats', items: [{ n: '14.7K+', l: 'Memberships' }, { n: '120+', l: 'Courts & greens' }, { n: '85', l: 'Certified coaches' }, { n: '24/7', l: 'Open access' }] },
    { type: 'cta', title: 'Come see it for yourself.', text: 'Book a private tour and feel the difference a considered club makes.' },
  ] },

  /* ---------------- CENTRE COURT ---------------- */
  { slug: 'centre-court', title: 'Centre Court.', blocks: [
    { type: 'banner', eyebrow: 'Courts · Clay', img: I.clay, title: 'Centre Court.',
      lead: 'Our championship clay court — floodlit, refereed and built for the biggest matches of your season. Watered and rolled every morning, it is the surface where the club’s finals are decided.' },
    { type: 'split', eyebrow: 'The surface', title: 'Real clay, true bounce.', img: I.baseline,
      paras: ['Centre Court is laid and groomed as genuine clay — watered, rolled and lined every morning so the bounce stays high, slow and honest. It is the surface that rewards patience, footwork and craft over raw power.',
              'Sliding into shots, building the point, working the angles — this is tennis the way the purists love it.'],
      bullets: ['Watered and rolled daily', 'High, true, slow bounce', 'Kind on knees and joints', 'Lined fresh every morning'] },
    { type: 'list', eyebrow: 'Why players love it', title: 'Built for the big points.',
      items: [{ t: 'True championship clay', d: 'Watered, rolled and re-lined daily for a high, honest bounce that rewards craft.' },
              { t: 'Floodlit until late', d: 'Glare-free premium lighting so matches stay crisp well into the evening.' },
              { t: 'Kind on the body', d: 'A softer surface that lets you slide, build points and play longer with less strain.' },
              { t: 'Match-day ready', d: 'Officiating, seating, ball supply and on-site stringing whenever you compete.' },
              { t: 'The home of finals', d: 'Where our seasonal leagues, finals and exhibition nights are decided.' },
              { t: 'Coached or open', d: 'Book solo, with a partner, or with a pro for a focused private session.' }] },
    { type: 'steps', eyebrow: 'Get on court', title: 'Booking is effortless.',
      steps: [{ t: 'Open the app', d: 'See live availability for Centre Court up to 14 days out.' },
              { t: 'Pick your slot', d: 'Reserve in seconds — singles, doubles or a coached session.' },
              { t: 'Just play', d: 'Turn up; balls, towels and stringing are all on hand.' }] },
    { type: 'mediagrid', eyebrow: 'Around Centre Court', title: 'Detail, everywhere.',
      items: [{ img: I.floodlit, t: 'Groomed at dawn', d: 'Watered, rolled and re-lined before the first serve of the day.' },
              { img: I.fixture, t: 'Match ready', d: 'Officials, seating and stringing for every fixture and final.' }] },
    { type: 'cta', title: 'Book Centre Court.', text: 'Reserve your slot and play where the season is decided.' },
  ] },

  /* ---------------- THE LAWNS ---------------- */
  { slug: 'the-lawns', title: 'The Lawns.', blocks: [
    { type: 'banner', eyebrow: 'Courts · Hard', img: I.courts, title: 'The Lawns.',
      lead: 'Six open-air hard courts set among the trees — the everyday heart of the club for practice and play. Fast, true surfaces and priority booking mean a court is always within reach.' },
    { type: 'rich', eyebrow: 'The everyday courts', title: 'Where the club comes to play.',
      paras: ['The Lawns are where most of club life happens. Six fast, true hard courts mean you rarely wait — perfect for a quick hit before work, a coached session at lunch, or a long doubles set as the sun drops.',
              'Surrounded by mature trees and open sky, they feel a world away from the city, even though you are minutes from it.'] },
    { type: 'split', eyebrow: 'Practice', title: 'Sharpen every part of your game.', img: I.courtside, flip: true,
      paras: ['Beyond match play, the Lawns include a dedicated practice wall and ball machines you can book solo — so you can drill serves, returns and footwork on your own schedule.'],
      bullets: ['Six fast, true hard courts', 'Practice wall & ball machines', 'Open-air play among the trees', 'Rarely a wait, 14-day priority booking'] },
    { type: 'list', eyebrow: 'Good to know', title: 'Made for every level.',
      items: [{ t: 'Beginners welcome', d: 'Gentle rallies, friendly faces and a coach never more than a wave away.' },
              { t: 'League standard', d: 'True, fast surfaces and even lighting that hold up for ranked, competitive play.' },
              { t: 'Rarely a wait', d: 'Six courts and 14-day priority booking mean a slot is almost always free.' },
              { t: 'Drills built in', d: 'A dedicated hitting wall and ball machines you can book on your own.' },
              { t: 'Junior friendly', d: 'Safe, supervised court time as part of our junior academy and camps.' },
              { t: 'All day, every day', d: 'Open-air play from first light to floodlit evenings, year round.' }] },
    { type: 'mediagrid', eyebrow: 'On the lawns', title: 'Space to play your way.',
      items: [{ img: I.woodcourt, t: 'Six open courts', d: 'Rarely a wait, with priority booking up to two weeks ahead.' },
              { img: I.ball, t: 'Practice built in', d: 'A hitting wall and ball machines you can book on your own.' }] },
    { type: 'cta', title: 'Find your court.', text: 'Join CourtSy and the Lawns are yours, around the clock.' },
  ] },

  /* ---------------- GOLF GREENS ---------------- */
  { slug: 'golf-greens', title: 'Lakeside Greens.', blocks: [
    { type: 'banner', eyebrow: 'Courts · Golf', img: I.golf, title: 'Lakeside Greens.',
      lead: 'An 18-hole members course wrapped around the lake — a calm, beautiful round whenever the mood takes you. Water in play on a third of the holes, true greens, and the clubhouse a short walk away.' },
    { type: 'split', eyebrow: 'The course', title: 'Eighteen holes, no pressure.', img: I.palms,
      paras: ['Our course was designed to reward thought as much as power. Water comes into play on a third of the holes, the greens run true, and the pace is yours — quick nine before dinner or a full, slow round on a Sunday.',
              'It is a place to think, walk and breathe as much as it is to score.'],
      bullets: ['18 lakeside holes', 'Generous member tee times daily', 'Buggies and walking both welcome', 'Caddies available on request'] },
    { type: 'list', eyebrow: 'Beyond the round', title: 'Practice, coach, unwind.',
      items: [{ t: 'Launch-monitor lessons', d: 'Dial in your swing with real data and our resident golf coaches.' },
              { t: 'Short-game area', d: 'Dedicated chipping and putting greens to sharpen the shots that score.' },
              { t: 'Driving range', d: 'Covered, floodlit bays so you can practise in any weather, any hour.' },
              { t: 'Member tee times', d: 'Generous daily tee times, walk or ride, with caddies on request.' },
              { t: 'Clubhouse steps away', d: 'Finish your round on the lakeside terrace with something well earned.' },
              { t: 'Quiet by design', d: 'A calm, uncrowded course — a place to think and breathe as much as to play.' }] },
    { type: 'stats', items: [{ n: '18', l: 'Holes' }, { n: '6,840', l: 'Yards' }, { n: 'Par 72', l: 'Championship' }, { n: 'Daily', l: 'Member tee times' }] },
    { type: 'mediagrid', eyebrow: 'On the course', title: 'A round worth the walk.',
      items: [{ img: I.golf, t: 'Lakeside holes', d: 'Water in play on a third of the course, with true, quick greens.' },
              { img: I.floodlit, t: 'Floodlit range', d: 'Covered, floodlit bays and a short-game area for any hour, any weather.' }] },
    { type: 'cta', title: 'Play the greens.', text: 'Become a member and tee off lakeside whenever it suits you.' },
  ] },

  /* ---------------- MERCHANDISE ---------------- */
  { slug: 'merchandise', title: 'The Pro Shop.', blocks: [
    { type: 'hero', eyebrow: 'Lifestyle · Shop', img: I.rackets, title: 'The Pro Shop.',
      lead: 'Apparel, racquets and equipment chosen by our pros — demo, fit and restring, all in-house.' },
    { type: 'rich', eyebrow: 'Considered, not cluttered', title: 'Only what we would use ourselves.',
      paras: ['Our shop is small on purpose. Rather than rows of everything, our pros curate a tight selection of apparel and equipment they actually rate — pieces that perform on court and look right in the clubhouse.',
              'Members get shop credit, early access to new drops and preferential pricing across the range.'] },
    { type: 'features', eyebrow: 'Services', title: 'More than a shop.',
      cards: [{ t: 'Demo & fit', d: 'Try racquets and shoes on court with expert fitting before you buy.', img: I.courtside },
              { t: 'Restring service', d: 'Fast, precise restrings so your racquet always feels right.', img: I.ball },
              { t: 'Apparel & kit', d: 'Considered pieces for court, green and clubhouse alike.', img: I.stretch }] },
    { type: 'products', eyebrow: 'In stock now', title: 'A preview of the shop.',
      items: [{ name: 'CourtSy Match Tee', price: '$48', img: I.courtlife, note: 'Featherweight, moisture-wicking knit in club colours. Cut for full range on court.' },
              { name: 'Pro Tour Racquet', price: '$219', img: I.bluesky, note: 'Our best-selling frame — demo it on court before you commit, fitted free.' },
              { name: 'Clubhouse Hoodie', price: '$95', img: I.strength, note: 'Heavyweight organic cotton, embroidered mark. The one you will actually live in.' },
              { name: 'Grip & String Kit', price: '$34', img: I.baseline, note: 'Premium overgrips and a set of match string — a fresh feel every week.' },
              { name: 'Lakeside Cap', price: '$36', img: I.golf, note: 'Six-panel, unstructured, sun-ready. Golf greens or centre court, it works.' },
              { name: 'Members Tote', price: '$28', img: I.player, note: 'Waxed-canvas kit bag sized for two racquets, shoes and a towel.' }] },
    { type: 'steps', eyebrow: 'Racquet fitting', title: 'Fitted in three visits.',
      steps: [{ t: 'Talk it through', d: 'Ten minutes on your grip, your game and what is bothering you.' },
              { t: 'Demo on court', d: 'Take three frames out for a real hit — no deposit, no pressure.' },
              { t: 'String to spec', d: 'We string, grip and balance your pick, then check it in a week.' }] },
    { type: 'split', eyebrow: 'The workshop', title: 'Everything finished in-house.', img: I.rackets, flip: true, tag: '24-hour turnaround',
      paras: ['Our stringer works out of the shop floor, not a back room — so you can watch your frame go on the machine and talk tension while it happens. Same-day service before 11am, 24 hours otherwise.'],
      bullets: ['Same-day restrings before 11am', 'Every tension logged to your account', 'Grip, balance and stencil included', 'Free re-check two weeks after fitting'] },
    { type: 'list', eyebrow: 'Member benefits', title: 'What membership adds.',
      items: [{ t: '$25 shop credit monthly', d: 'Lands on the first of the month and rolls over for three.' },
              { t: 'Early access to drops', d: 'Limited pieces open to members a full week before anyone else.' },
              { t: 'Free demo programme', d: 'Take any frame in the range out on court for as long as you need.' },
              { t: 'Preferential pricing', d: 'Members save on the whole range, all year, no code required.' },
              { t: 'Kit storage', d: 'Leave your bag with us — we will restring between sessions.' },
              { t: 'No-quibble exchange', d: 'Played with it and it is wrong? Swap it within 30 days.' }] },
    { type: 'rich', eyebrow: 'Why it is different', title: 'Curated, not crammed.',
      paras: ['We don’t stock everything — we stock the few things our pros actually rate and use. Every piece is chosen for how it performs on court and how it wears in the clubhouse, then fitted and finished in-house.',
              'Members get shop credit each month, first access to limited drops, and preferential pricing across the whole range.'] },
    { type: 'reviews', eyebrow: 'From the shop floor', title: 'What members say.',
      lead: 'A few words from the people who actually play in this kit, week in, week out.',
      items: [{ quote: 'They talked me out of the expensive frame and into the right one. That is the whole shop in one sentence.', name: 'Marcus Lee', role: 'Resident member · 4 years', img: face('1463453091185-61582044d556') },
              { quote: 'Dropped my racquet off at nine, played with it at six the same evening. The tension was spot on.', name: 'Natalie Martin', role: 'Day-pass member', img: face('1633332755192-727a05c4013d') },
              { quote: 'I have bought three seasons of kit here now. It outlasts everything else in my bag.', name: 'Daniel Cho', role: 'Signature member', img: face('1507003211169-0a1dd7228f2d') }] },
    { type: 'cta', title: 'Members save more.', text: 'Membership unlocks shop credit and priority on new arrivals.' },
  ] },

  /* ---------------- MEMBERSHIPS ---------------- */
  { slug: 'memberships', title: 'One membership. Every advantage.', blocks: [
    { type: 'hero', eyebrow: 'Lifestyle · Membership', img: I.courtlife, title: 'One membership. Every advantage.',
      lead: 'A single, honest monthly price unlocks the whole club — courts, greens, coaching, recovery and the calendar. No tiers to decode.' },
    { type: 'split', eyebrow: 'Simple by design', title: 'Everything in, nothing hidden.', img: I.runners,
      paras: ['Most clubs bury the good stuff behind add-ons. We do the opposite: one membership opens every door, from 24/7 court access to weekly clinics and the recovery suite.',
              'No joining fee, no contract, cancel anytime. If you stop playing, you stop paying.'],
      bullets: ['24/7 access to every court & green', 'Priority booking up to 14 days ahead', 'Two group clinics every week', 'Recovery suite, sauna & spa', 'Bring up to 4 guests each month'] },
    { type: 'tiers', eyebrow: 'Pricing', title: 'Pick the plan that fits.',
      tiers: [{ name: 'Day Pass', price: '$45', cadence: 'per visit', desc: 'A single day inside the club, every facility open.', perks: ['All open facilities', 'One guest locker', 'Café credit included'] },
              { name: 'Resident', price: '$190', cadence: 'per month', hot: true, desc: 'Unlimited 24/7 access with priority booking.', perks: ['24/7 unlimited access', 'Priority court & lane booking', '2 group classes weekly', 'Recovery suite access'] },
              { name: 'Signature', price: '$420', cadence: 'per month', desc: 'Concierge membership with private coaching.', perks: ['Everything in Resident', 'Dedicated performance coach', 'Private suite & 4 guests', 'Events & retreats access'] }] },
    { type: 'cta', title: 'Join the club.', text: 'No joining fee, cancel anytime — just play.' },
  ] },

  /* ---------------- WELLNESS & SPA ---------------- */
  { slug: 'wellness-spa', title: 'Wellness & Spa.', blocks: [
    { type: 'hero', eyebrow: 'Lifestyle · Recovery', img: I.yoga, title: 'Wellness & Spa.',
      lead: 'Reset between sessions with a saltwater pool, sauna, contrast therapy and hands-on recovery.' },
    { type: 'rich', eyebrow: 'Recovery is training', title: 'You get better when you rest.',
      paras: ['Hard sessions only pay off if you recover well. That is why recovery is built into every CourtSy membership, not sold as an extra — heat, cold, water and skilled hands to help you bounce back faster and stay injury-free.'] },
    { type: 'features', eyebrow: 'The suite', title: 'Everything you need to reset.',
      cards: [{ t: 'Sauna & contrast', d: 'Heat, cold plunge and a saltwater pool to flush and calm.', img: I.swim },
              { t: 'Physio & massage', d: 'Soft-tissue work and mobility with qualified therapists.', img: I.strength },
              { t: 'Quiet recovery suite', d: 'A still, low-light space to switch off completely.', img: I.lanes }] },
    { type: 'products', eyebrow: 'Treatments', title: 'Add-ons for deeper recovery.',
      items: [{ name: 'Sports massage — 60 min', price: '$85', note: 'Deep-tissue and mobility work with a qualified therapist.' },
              { name: 'Physio assessment', price: '$110', note: 'A full movement screen with a plan to keep you injury-free.' },
              { name: 'Contrast & sauna', price: 'Included', note: 'Heat, cold plunge and saltwater — free with every membership.' },
              { name: 'Mobility class', price: '$18', note: 'Small-group guided flows to move better between sessions.' },
              { name: 'Recovery suite hour', price: 'Included', note: 'A quiet, low-light room to switch off completely.' },
              { name: 'Wellness day pass', price: '$60', note: 'Spa, sauna and pool access for a guest of a member.' }] },
    { type: 'cta', title: 'Feel the difference.', text: 'Recovery is part of every membership — come and use it.' },
  ] },

  /* ---------------- EVENTS & SOCIALS ---------------- */
  { slug: 'events-socials', title: 'Events & Socials.', blocks: [
    { type: 'hero', eyebrow: 'Lifestyle · Calendar', img: I.floodlit, title: 'Events & Socials.',
      lead: 'Leagues, clinics and members nights run all season — there is always a reason to be here.' },
    { type: 'features', eyebrow: "What's on", title: 'The members calendar.',
      cards: [{ t: 'Seasonal leagues', d: 'Ranked singles and doubles with weekly fixtures and a finals night.', img: I.player },
              { t: 'Clinics & camps', d: 'Group coaching for every level, plus junior holiday camps.', img: I.ball },
              { t: 'Members nights', d: 'Lakeside mixers, tastings and socials throughout the year.', img: I.runners }] },
    { type: 'split', eyebrow: 'Coming up', title: 'Summer Open — Doubles Championship.', img: I.night, flip: true, tag: '14–16 August',
      paras: ['Our flagship event of the season. Three days of doubles across every level, finishing under the floodlights on Centre Court with food, music and the whole club out to watch.'],
      bullets: ['All levels welcome', 'Round-robin into knockouts', 'Floodlit finals night', 'Members & guests'] },
    // calendar reads as a plain listing — no imagery, the dates do the work
    { type: 'products', eyebrow: 'Coming up', title: 'On the calendar.',
      items: [{ name: 'Summer Open — Doubles', price: '14–16 Aug', note: 'Three days across every level, finishing under the floodlights on Centre Court.' },
              { name: 'Sunset Clay Clinics', price: 'Thursdays', note: 'Coached small-group sessions as the light drops. All abilities welcome.' },
              { name: 'Lakeside Members Mixer', price: 'Last Fri', note: 'Food, music and a slow evening by the water — bring a guest.' },
              { name: 'Junior Holiday Camp', price: 'School breaks', note: 'Active, supervised days of coaching, games and friendships.' },
              { name: 'Winter Golf Scramble', price: '2 Dec', note: 'A relaxed team format on the lakeside course, prizes at the clubhouse.' },
              { name: 'Season Finals Night', price: '19 Sep', note: 'League finals across court and green, then the whole club celebrates.' }] },
    { type: 'cta', title: 'See you there.', text: 'Members get first access to every event and social.' },
  ] },

  /* ---------------- DINING ---------------- */
  { slug: 'dining', title: 'The Clubhouse.', blocks: [
    { type: 'hero', eyebrow: 'Lifestyle · Dining', img: I.palms, title: 'The Clubhouse.',
      lead: 'Lakeside dining for a post-match plate or a long, slow lunch — fresh, seasonal and unhurried.' },
    { type: 'rich', eyebrow: 'At the table', title: 'Food worth lingering over.',
      paras: ['Our kitchen keeps it short and seasonal: a handful of dishes done properly, built around what is good that week. Whether it is a protein-rich plate after training or a glass of something on the terrace, the clubhouse is where the day winds down.'] },
    { type: 'split', eyebrow: 'The terrace', title: 'Eat with the greens in view.', img: I.golf,
      paras: ['The lakeside terrace looks out across the course and water — the kind of spot you plan your evening around. Members get preferential rates and a tab linked straight to their membership.'],
      bullets: ['Short, seasonal menu', 'Lakeside terrace seating', 'Members rates & easy tab', 'Open from breakfast to late'] },
    { type: 'products', eyebrow: 'On the menu', title: 'A taste of the clubhouse.',
      items: [{ name: 'Post-match bowl', price: '$18', note: 'Grains, greens, roast veg and your choice of protein — built to refuel.' },
              { name: 'Lakeside flatbread', price: '$16', note: 'Wood-fired, seasonal toppings, made to share on the terrace.' },
              { name: 'Cold-press & smoothies', price: '$9', note: 'Rotating blends from the recovery bar — the green one is a member favourite.' },
              { name: 'Catch of the day', price: '$26', note: 'Line-caught, simply grilled, whatever’s freshest that morning.' },
              { name: 'The club burger', price: '$21', note: 'Dry-aged beef, house pickles, skin-on fries. Non-negotiable classic.' },
              { name: 'Something cold', price: '$12', note: 'A short, considered list of wine, beer and zero-proof pours.' }] },
    { type: 'cta', title: 'Pull up a chair.', text: 'Dining is part of the CourtSy lifestyle — come and taste it.' },
  ] },

  /* ---------------- GIFT CARDS ---------------- */
  { slug: 'gift-cards', title: 'Gift Cards.', blocks: [
    { type: 'hero', eyebrow: 'Lifestyle · Gifting', img: I.bluesky, title: 'Give the club.',
      lead: 'A CourtSy gift card works across membership, coaching, the pro shop and the clubhouse — the easiest way to share the club.' },
    { type: 'steps', eyebrow: 'How it works', title: 'Gifting in three taps.',
      steps: [{ t: 'Choose a value', d: 'Pick any amount — the recipient tops up the rest if they like.' },
              { t: 'Personalise it', d: 'Add a message and choose when it lands in their inbox.' },
              { t: 'Send instantly', d: 'Delivered by email in seconds, beautifully presented.' }] },
    { type: 'features', eyebrow: 'Good to know', title: 'A gift that gets used.',
      cards: [{ t: 'Use anywhere', d: 'Valid on membership, lessons, the shop and dining.', img: I.rackets },
              { t: 'Never expires', d: 'No rush and no fine print — spend it whenever.', img: I.golf },
              { t: 'Instant delivery', d: 'Send by email in seconds, perfectly timed.', img: I.courtside }] },
    { type: 'deck', eyebrow: 'Three cards', title: 'Pick the one that fits.',
      lead: 'Arrows, dots or arrow keys — or just click a card at the edge to bring it to the front.',
      cards: [
        { name: 'A day inside the club', tag: 'The Taster', price: '$45',
          desc: 'One full day with every facility open — courts, greens, the pool and the spa. The easiest way to show someone what the club actually feels like.',
          perks: ['Every open facility for a day', 'One guest locker & towel service', 'Café credit included', 'Book any day, no notice needed'] },
        { name: 'A month of Resident', tag: 'The Month', price: '$190',
          desc: 'Thirty days of full Resident membership. Long enough to build a habit, short enough to be an easy yes.',
          perks: ['24/7 access to every court & green', 'Two coached clinics a week', 'Recovery suite, sauna & spa', 'Priority booking, 14 days ahead'] },
        { name: 'A whole year, everything in', tag: 'The Year', price: '$2,280',
          desc: 'Twelve months of Resident membership, start date of their choosing. The most generous thing on this page by some distance.',
          perks: ['A full year of unlimited access', 'Clinics, recovery and events included', 'Four guest passes every month', 'They choose when it begins'] },
      ] },
    { type: 'faq', eyebrow: 'Good to know', title: 'The fine print, briefly.',
      items: [{ q: 'When does it expire?', a: 'It doesn’t. Gift cards hold their value indefinitely and any unused balance simply stays on the card.' },
              { q: 'Can they upgrade it?', a: 'Yes — the card works like credit, so they can put it toward a longer or higher tier and pay the difference.' },
              { q: 'What if I want a different amount?', a: 'Choose any value at checkout. It behaves exactly like the three cards above, just with your number on it.' },
              { q: 'Can I choose when it arrives?', a: 'Pick any future date and we will deliver it that morning, with your message attached.' }] },
    { type: 'cta', title: 'Send a gift card.', text: 'The easiest way to share the club with someone you love.' },
  ] },

  /* ---------------- BECOME A MEMBER ---------------- */
  { slug: 'become-a-member', title: 'Become a member.', blocks: [
    { type: 'hero', eyebrow: 'Join', img: I.stretch, title: 'Become a member.',
      lead: 'Apply for a residency at CourtSy. One simple monthly price, no joining fee, cancel anytime.' },
    { type: 'steps', eyebrow: 'How to join', title: 'Three steps to playing.',
      steps: [{ t: 'Apply online', d: 'Tell us a little about you — it takes about two minutes.' },
              { t: 'Book your tour', d: 'See the club in person and meet the team.' },
              { t: 'Start playing', d: 'Get your access and book your first session the same week.' }] },
    { type: 'split', eyebrow: 'What you get', title: 'Everything, from day one.', img: I.aerial,
      paras: ['There is no waiting period and no tier to upgrade to later. The moment you join, the whole club is open to you.'],
      bullets: ['24/7 access to every facility', 'Coaching and clinics included', 'Priority booking & guesting', 'No joining fee, cancel anytime'] },
    { type: 'tiers', eyebrow: 'Choose your plan', title: 'Membership that fits.',
      tiers: [{ name: 'Day Pass', price: '$45', cadence: 'per visit', desc: 'Try the whole club for a day.', perks: ['All open facilities', 'One guest locker', 'Café credit'] },
              { name: 'Resident', price: '$190', cadence: 'per month', hot: true, desc: 'Unlimited 24/7 access with priority booking.', perks: ['24/7 access', 'Priority booking', '2 clinics weekly', 'Recovery suite'] },
              { name: 'Signature', price: '$420', cadence: 'per month', desc: 'Concierge membership with private coaching.', perks: ['Everything in Resident', 'Personal coach', 'Private suite + 4 guests', 'Events & retreats'] }] },
    { type: 'cta', title: 'Ready when you are.', text: 'Limited residencies for 2026 — reserve yours today.' },
  ] },

  /* ---------------- BOOK A PRIVATE TOUR ---------------- */
  { slug: 'book-a-private-tour', title: 'Book a private tour.', blocks: [
    { type: 'hero', eyebrow: 'Join', img: I.woodcourt, title: 'Book a private tour.',
      lead: 'See CourtSy for yourself. A member of the team will walk you through every court, green and space — no pressure.' },
    { type: 'features', eyebrow: 'On the tour', title: 'What you will see.',
      cards: [{ t: 'Every facility', d: 'Courts, greens, the gym, the spa and the clubhouse.', img: I.aerial },
              { t: 'Meet the coaches', d: 'Talk goals with the people who will help you reach them.', img: I.player },
              { t: 'A relaxed look', d: 'Ask anything, try a court, join only if it feels right.', img: I.golf }] },
    { type: 'steps', eyebrow: 'Booking', title: 'Pick a time that suits.',
      steps: [{ t: 'Choose a slot', d: 'Tours run morning, noon and evening, seven days a week.' },
              { t: 'Tell us your game', d: 'We tailor the walk-through to what you love to play.' },
              { t: 'Come and see', d: 'Spend 30 unhurried minutes inside the club.' }] },
    { type: 'cta', title: 'Find a time.', text: 'Tours run daily — pick a slot that works for you.' },
  ] },

  /* ---------------- GIFT A MEMBERSHIP ---------------- */
  { slug: 'gift-a-membership', title: 'Gift a membership.', blocks: [
    { type: 'hero', eyebrow: 'Join · Gifting', img: I.air, title: 'Gift a membership.',
      lead: 'Give someone a year of movement, coaching and community — the most generous way to share the club. Choose a plan, add a note, and pick how it arrives.' },
    { type: 'split', eyebrow: 'The gift', title: 'A whole year of the club.', img: I.courtlife,
      paras: ['A gifted membership is full membership: every court and green, the coaching, the recovery suite and the calendar. They choose when it starts, so it is always perfectly timed.'],
      bullets: ['Full resident access', 'Beautifully presented', 'Flexible start date', 'No fuss to activate'] },
    { type: 'tiers', eyebrow: 'Available to gift', title: 'Plans you can give.',
      tiers: [{ name: 'Day Pass', price: '$45', cadence: 'one visit', desc: 'A taste of the whole club for a day.', perks: ['Every open facility', 'One guest locker', 'Café credit'] },
              { name: 'Resident — year', price: '$2,280', cadence: 'twelve months', hot: true, desc: 'A full year of unlimited access.', perks: ['24/7 unlimited access', 'Weekly clinics included', 'Recovery suite & spa', 'Priority booking'] },
              { name: 'Signature — year', price: '$5,040', cadence: 'twelve months', desc: 'Concierge membership, private coaching.', perks: ['Everything in Resident', 'Dedicated coach', 'Private suite & 4 guests', 'Events & retreats'] }] },
    { type: 'features', eyebrow: 'How it arrives', title: 'Delivered your way.',
      cards: [{ t: 'By email', d: 'An instant e-gift card, timed to land whenever you choose.', img: I.ball },
              { t: 'In person', d: 'A printed card to collect and hand over at the clubhouse.', img: I.rackets },
              { t: 'By post', d: 'A beautifully presented card, mailed anywhere you like.', img: I.palms }] },
    { type: 'rich', eyebrow: 'Coupons & credit', title: 'Flexible from every angle.',
      paras: ['Prefer to give an amount rather than a plan? A CourtSy gift card works like credit — usable across membership, coaching, the pro shop and the clubhouse, and it never expires.',
              'Have a promo or corporate coupon code? You can apply it at checkout, and any unused balance simply stays on the card for next time.'] },
    { type: 'form', eyebrow: 'Request a gift', title: 'Tell us who it’s for.',
      lead: 'Fill in the details and our team will set up the gift and confirm delivery within one working day.' },
    { type: 'cta', title: 'Give the club.', text: 'Gift a membership and make someone’s whole year.' },
  ] },

  /* ---------------- PRICING & TIERS ---------------- */
  { slug: 'pricing-tiers', title: 'Pricing & Tiers.', blocks: [
    { type: 'hero', eyebrow: 'Join · Pricing', img: I.courtside, title: 'Simple, honest pricing.',
      lead: 'From a single day pass to a full signature residency — clear prices, no joining fee, cancel anytime.' },
    { type: 'tiers', eyebrow: 'Choose your level', title: 'A plan for everyone.',
      tiers: [{ name: 'Day Pass', price: '$45', cadence: 'per visit', desc: 'A single day inside the club, every facility open.', perks: ['All open facilities', 'One guest locker', 'Café credit included'] },
              { name: 'Resident', price: '$190', cadence: 'per month', hot: true, desc: 'Unlimited 24/7 access with priority booking.', perks: ['24/7 unlimited access', 'Priority court & lane booking', '2 group classes weekly', 'Recovery suite access'] },
              { name: 'Signature', price: '$420', cadence: 'per month', desc: 'Concierge membership with private coaching & guesting.', perks: ['Everything in Resident', 'Dedicated performance coach', 'Private suite & 4 guests', 'Events & retreats access'] }] },
    { type: 'split', eyebrow: 'In every plan', title: 'The floor is already high.', img: I.aerial, tag: 'No add-ons',
      paras: ['Even a day pass opens the whole club. There is no bronze tier that locks you out of the pool, and no surcharge waiting at the spa door. What changes between plans is how often you come and how far ahead you can book — not what you are allowed to touch.'],
      bullets: ['Every court, green, lane and studio', 'Recovery suite, sauna and pool', 'Towels, showers and kit storage', 'No surcharge on any facility'] },
    { type: 'list', eyebrow: 'What drives the price', title: 'Where your money goes.',
      items: [{ t: 'Capped membership', d: 'We hold numbers below what the club could take, so courts stay open.' },
              { t: 'Coaches on salary', d: 'Our pros are employed, not commission-chasing — clinics cost you nothing.' },
              { t: 'Daily groundskeeping', d: 'Clay watered and rolled every morning; greens cut six days a week.' },
              { t: 'Kit that gets replaced', d: 'Nets, balls, machines and gym plate all on a fixed renewal cycle.' },
              { t: 'No joining fee', d: 'We would rather you stayed because it is good than because you paid to enter.' },
              { t: 'One price, all in', d: 'No peak pricing, no booking fees, no guest surcharge inside your allowance.' }] },
    { type: 'mediagrid', eyebrow: 'What a month looks like', title: 'Value, in practice.',
      items: [{ img: I.courtlife, t: 'A Resident month', d: 'Eight court hours, two clinics, four spa visits — around $6 an hour, all in.' },
              { img: I.night, t: 'A Signature month', d: 'Add a weekly private coach and unlimited guests; still one predictable bill.' }] },
    { type: 'faq', eyebrow: 'The fine print', title: 'No surprises.',
      items: [{ q: 'Is there a joining fee?', a: 'No. You pay a simple monthly price and nothing to start.' },
              { q: 'Can I cancel?', a: 'Anytime, with 30 days’ notice. No contracts, no penalties.' },
              { q: 'Can I freeze my membership?', a: 'Yes — pause for up to three months a year for travel or injury.' },
              { q: 'Do prices rise each year?', a: 'We review once a year and cap any change at inflation. You get 60 days’ notice, always.' },
              { q: 'Can I switch tiers?', a: 'Up or down, at any point in the month. We pro-rate the difference on your next bill.' },
              { q: 'What about guests?', a: 'Residents bring four a month, Signature members bring unlimited. Guests use everything you can.' }] },
    { type: 'reviews', eyebrow: 'Worth it?', title: 'Members on the price.',
      items: [{ quote: 'I worked out I was paying more for a gym I never went to. This costs less and I am here four times a week.', name: 'Isabella Rodriguez', role: 'Resident member · 2 years', img: face('1494790108377-be9c29b29330') },
              { quote: 'No booking fees, no peak pricing, no surprise invoice in January. It is the same number every month.', name: 'John Peter', role: 'Signature member', img: face('1500648767791-00dcc994a43e') },
              { quote: 'The clinics alone would cost me more than the membership if I bought them anywhere else.', name: 'Gabrielle Williams', role: 'Resident member', img: face('1438761681033-6461ffad8d80') }] },
    { type: 'cta', title: 'Pick your plan.', text: 'No joining fee, cancel anytime — start this week.' },
  ] },

  /* ---------------- CORPORATE ---------------- */
  { slug: 'corporate-membership', title: 'Corporate membership.', blocks: [
    { type: 'hero', eyebrow: 'Join · Business', img: I.scrum, title: 'Corporate membership.',
      lead: 'Give your team somewhere to move, meet and unwind — flexible corporate plans for any size of business.' },
    { type: 'rich', eyebrow: 'Why teams join', title: 'Healthier teams, happier people.',
      paras: ['Sport is the easiest way to build a team that actually likes each other. A corporate membership gives your people pooled access to the club, private events to bring everyone together, and a genuinely good perk that gets used — unlike most.'] },
    { type: 'features', eyebrow: 'How it works', title: 'Built around your business.',
      cards: [{ t: 'Shared access', d: 'Pooled memberships your people can share fairly.', img: I.courts },
              { t: 'Team events', d: 'Private leagues, away-days and tournaments.', img: I.fixture },
              { t: 'Simple billing', d: 'One invoice, easy onboarding, dedicated support.', img: I.runners }] },
    { type: 'split', eyebrow: 'How pooling works', title: 'Seats, not names.', img: I.courts, flip: true, tag: 'Flexible',
      paras: ['You buy seats, not individual memberships. Your team books against the pool from their own accounts, and anyone who leaves simply frees their seat for the next joiner — no paperwork, no wasted months.'],
      bullets: ['Reassign a seat in seconds', 'Usage dashboard for whoever owns the budget', 'No per-person admin or contracts', 'Scale up or down each quarter'] },
    { type: 'tiers', eyebrow: 'Corporate plans', title: 'Priced by team size.',
      tiers: [{ name: 'Team', price: '$820', cadence: 'per month · 5 seats', desc: 'For small teams who want somewhere to meet and move.', perks: ['5 pooled Resident seats', 'Two private court hours monthly', 'One invoice, 30-day terms', 'Reassign seats anytime'] },
              { name: 'Company', price: '$3,100', cadence: 'per month · 20 seats', hot: true, desc: 'The common choice — enough seats to make it a real perk.', perks: ['20 pooled Resident seats', 'Quarterly private team event', 'Dedicated account manager', 'Usage reporting & onboarding'] },
              { name: 'Enterprise', price: 'Bespoke', cadence: 'from 50 seats', desc: 'Multi-site teams, custom terms and a calendar of your own.', perks: ['50+ pooled seats', 'Private league in your name', 'Wellbeing reporting for HR', 'Custom billing & terms'] }] },
    { type: 'steps', eyebrow: 'Getting started', title: 'Live within a fortnight.',
      steps: [{ t: 'Tell us the shape', d: 'Team size, locations and what you actually want people to use.' },
              { t: 'We size the pool', d: 'A seat count and a single quote — no per-head negotiation.' },
              { t: 'Onboard together', d: 'We run a launch session on site so nobody has to work it out alone.' }] },
    { type: 'list', eyebrow: 'What HR asks', title: 'The practical detail.',
      items: [{ t: 'Usage reporting', d: 'Monthly breakdown of seat take-up, so you can prove the perk is landing.' },
              { t: 'One invoice', d: 'Consolidated monthly billing on 30-day terms, PO numbers welcome.' },
              { t: 'No individual contracts', d: 'Your people sign nothing — the agreement sits with the business.' },
              { t: 'Guest allowance', d: 'Every seat brings two guests a month, ideal for client entertaining.' },
              { t: 'Away-day space', d: 'Book the field, the terrace or a full court block for team days.' },
              { t: 'Wellbeing credits', d: 'Physio and recovery sessions can be pooled and allocated by HR.' }] },
    { type: 'reviews', eyebrow: 'From our partners', title: 'How teams use it.',
      items: [{ quote: 'We replaced three separate gym stipends with twenty seats here. Cheaper, and people actually use it.', name: 'Victoria Thompson', role: 'People Lead, 90-person studio', img: face('1544005313-94ddf0286df2') },
              { quote: 'The quarterly team event has become the thing new starters hear about in their first week.', name: 'Samantha Johnson', role: 'COO, logistics firm', img: face('1534528741775-53994a69daeb') },
              { quote: 'One invoice, one contact, and I can reassign a seat the day someone leaves. That is the whole sell.', name: 'Marcus Lee', role: 'Finance Director', img: face('1463453091185-61582044d556') }] },
    { type: 'faq', eyebrow: 'Before you ask', title: 'Corporate questions.',
      items: [{ q: 'Is there a minimum term?', a: 'Twelve months on Team and Company, reviewed quarterly. Enterprise terms are set with you.' },
              { q: 'Can seats be shared?', a: 'Yes — that is the point. Seats belong to the business and can be reassigned as often as you need.' },
              { q: 'Do you invoice in advance?', a: 'Monthly in arrears on 30-day terms, with PO references if your finance team needs them.' },
              { q: 'Can we host clients here?', a: 'Every seat carries two guest passes a month, and the terrace can be booked privately.' }] },
    { type: 'cta', title: 'Talk to our team.', text: 'Tell us about your business and we will build a plan that fits.' },
  ] },

  /* ---------------- JUNIOR & FAMILY ---------------- */
  { slug: 'junior-family', title: 'Junior & Family.', blocks: [
    { type: 'hero', eyebrow: 'Join · Family', img: I.swim, title: 'Junior & Family.',
      lead: 'From first racquets to family rounds — coaching and access designed for every age, all together.' },
    { type: 'features', eyebrow: 'For everyone', title: 'The whole family plays.',
      cards: [{ t: 'Junior academy', d: 'Coaching that grows technique, confidence and fitness.', img: I.bluesky },
              { t: 'Family access', d: 'Shared membership so everyone plays their way.', img: I.palms },
              { t: 'Holiday camps', d: 'Active, supervised camps through every school break.', img: I.air }] },
    { type: 'split', eyebrow: 'The academy', title: 'Where good habits start young.', img: I.clay, flip: true,
      paras: ['Our junior academy is built on fun first, fundamentals always. Small groups, certified coaches and a clear pathway — from a child’s first rally to competing in our junior leagues.'],
      bullets: ['Ages 6–16, all abilities', 'Small, coached groups', 'Clear progression pathway', 'Junior leagues & camps'] },
    { type: 'cta', title: 'Bring everyone.', text: 'Family memberships make the club a place for all ages.' },
  ] },

  /* ---------------- FAQ ---------------- */
  { slug: 'faq', title: 'Questions, answered.', blocks: [
    { type: 'hero', eyebrow: 'Join · FAQ', img: I.baseline, title: 'Questions, answered.',
      lead: 'Everything you need to know about joining CourtSy — and if it is not here, the team is one message away.' },
    { type: 'faq', eyebrow: 'Membership', title: 'The common questions.',
      items: [{ q: 'Is there a joining fee?', a: 'No. Membership is one simple monthly price you can cancel anytime with 30 days’ notice.' },
              { q: 'How do I book courts?', a: 'In seconds from your member account — courts, lanes, tee times and classes, up to 14 days ahead.' },
              { q: 'Can I bring guests?', a: 'Yes. Resident members bring up to four guests every month; Signature members bring more.' },
              { q: 'Is coaching included?', a: 'Two group clinics a week are included with Resident membership. Private lessons can be added anytime.' },
              { q: 'Can I freeze my membership?', a: 'Yes — pause for up to three months a year for travel or injury, no penalty.' },
              { q: 'Do you offer day passes?', a: 'We do. A day pass opens every facility for a single visit, perfect before you commit.' }] },
    { type: 'split', eyebrow: 'Getting in', title: 'Your first week, answered.', img: I.woodcourt,
      paras: ['Most questions we get are really one question: what actually happens after I join? You get your access on the day you sign, a welcome session with a coach in your first week, and a booking account that opens 14 days ahead from the moment you are in.'],
      bullets: ['Access on day one, no waiting list', 'Welcome session with a coach', 'Booking opens immediately', 'Nothing to buy before you play'] },
    { type: 'faq', eyebrow: 'Facilities', title: 'Courts, greens and everything else.',
      items: [{ q: 'How late can I play?', a: 'Centre Court and the Lawns are floodlit until midnight. Residents have 24/7 access to the gym, pool and recovery suite.' },
              { q: 'Do I need to book the gym or pool?', a: 'No — those are walk-in. Only courts, tee times, lanes for lane swimming, and classes need a booking.' },
              { q: 'What happens if it rains?', a: 'Hard courts drain and play through. Clay closes in heavy rain, and we credit any booking we cancel.' },
              { q: 'Is there parking?', a: 'Free on-site parking for members, with EV charging on the north side of the clubhouse.' },
              { q: 'Can I store my kit?', a: 'Yes. Every member gets a locker, and the pro shop will restring between sessions if you leave your bag.' },
              { q: 'Are the greens walkable?', a: 'All eighteen. Buggies are available and caddies can be booked with 24 hours’ notice.' }] },
    { type: 'faq', eyebrow: 'Coaching & juniors', title: 'Getting better, at any age.',
      items: [{ q: 'I have never played. Is that fine?', a: 'Completely. Our beginner clinics assume nothing, and half the people in them picked up a racquet this year.' },
              { q: 'How do I book a private lesson?', a: 'From your account, up to four weeks ahead. Members pay a reduced rate and can cancel free up to 24 hours before.' },
              { q: 'What ages is the junior academy?', a: 'Six to sixteen, grouped by ability rather than age, with a clear pathway into the junior leagues.' },
              { q: 'Can my family join on my membership?', a: 'A family membership covers two adults and up to three children under 18 on one bill.' }] },
    { type: 'mediagrid', eyebrow: 'Still deciding', title: 'Two ways to try before you join.',
      items: [{ img: I.stretch, t: 'Take a day pass', d: '$45 opens every facility for a full day — no strings, no follow-up call.' },
              { img: I.aerial, t: 'Book a private tour', d: 'Thirty unhurried minutes with someone who can answer anything.' }] },
    { type: 'cta', title: 'Still curious?', text: 'Book a tour and we will answer everything in person.' },
  ] },
]

/* ---------- post-process: self-contained pages, buttons only where it converts ---------- */
const CTA_PAGES = new Set([
  'become-a-member', 'memberships', 'pricing-tiers', 'gift-a-membership',
  'corporate-membership', 'junior-family', 'book-a-private-tour', 'club',
])
const COURTS_PAGES = new Set(['centre-court', 'the-lawns', 'golf-greens'])
const SHOTS = [
  [I.courts, 'The Lawns — open-air hard courts'],
  [I.clay, 'Centre Court — championship clay'],
  [I.strength, 'The Strength Room — conditioning'],
  [I.woodcourt, 'The Hidden Court — practice in the trees'],
  [I.golf, 'Lakeside Greens — 18 holes'],
  [I.rackets, 'The Pro Shop — fit & restring'],
  [I.swim, 'The Pool — 25m saltwater lanes'],
  [I.runners, 'The Track — dawn & dusk run club'],
  [I.ball, 'Practice — drills & machines'],
  [I.yoga, 'The Studio — mobility, pilates & flow'],
  [I.night, 'Floodlit Nights — play until midnight'],
  [I.scrum, 'The Field — team sport & corporate days'],
  [I.palms, 'The Grounds — gardens & terraces'],
  [I.cycling, 'The Ride Room — road club & watt bikes'],
  [I.player, 'Match Play — leagues & socials'],
  [I.floodlit, 'Groundskeeping — surfaces to tour spec'],
]

for (const p of PAGES) {
  const showCta = CTA_PAGES.has(p.slug)
  const heroB = p.blocks.find((b) => b.type === 'hero' || b.type === 'banner')
  if (heroB) heroB.cta = showCta
  if (!showCta) p.blocks = p.blocks.filter((b) => b.type !== 'cta')
  // numbers/stats live only on the homepage
  p.blocks = p.blocks.filter((b) => b.type !== 'stats')
}

/* ---------- stylesheet ---------- */
const css = `
@font-face{font-family:'Aspekta';src:url('../fonts/AspektaVF.woff2') format('woff2-variations');font-weight:100 1000;font-display:swap}
:root{
  --ink:#0f0f0f;--ink-soft:#202020;--paper:#fff;--page:#f8f8f8;--bone:#ededed;--mist:#dedede;
  --line:rgba(15,15,15,.1);--line-2:rgba(15,15,15,.16);--muted:#0f0f0f;
  --lime:#5dd62c;--green:#337418;--accent-soft:#e4f8d8;
  --sans:'Aspekta','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --display:'Inter','Aspekta',sans-serif;
  --r-md:18px;--r-lg:26px;--r-xl:34px;--r-pill:999px;--ease:cubic-bezier(.22,1,.36,1);
  --maxw:1440px;--pad:clamp(18px,4vw,52px);
}
*{box-sizing:border-box;margin:0;padding:0}
/* stable gutter so nothing can reclaim the scrollbar's width and shift the
   layout — see styles/index.css */
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;scrollbar-gutter:stable}
body{font-family:var(--sans);background:var(--page);color:var(--ink);line-height:1.5;overflow-x:hidden}
a{color:inherit;text-decoration:none}img{display:block;max-width:100%}
.shell{width:100%;max-width:var(--maxw);margin:0 auto;padding-inline:var(--pad)}
.svg-i{width:18px;height:18px}
.micro{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.micro .deco-star{width:17px;height:17px;color:var(--green);flex-shrink:0}
.btn{display:inline-flex;align-items:center;gap:10px;font-size:15px;font-weight:600;padding:14px 22px;border-radius:var(--r-pill);transition:transform .35s var(--ease),background .3s,color .3s;white-space:nowrap;border:none;cursor:pointer;font-family:inherit}
.btn-green{background:var(--green);color:#fff}.btn-green:hover{background:var(--lime);color:var(--ink)}
.btn-dark{background:var(--ink);color:#fff}.btn-dark:hover{background:var(--ink-soft)}
.btn-play{background:var(--ink);color:#fff;padding:7px 22px 7px 8px}.btn-play:hover{background:var(--ink-soft)}
.btn-ic{width:32px;height:32px;border-radius:50%;background:#fff;color:var(--ink);display:grid;place-items:center;flex-shrink:0}
.btn-member{background:var(--ink);color:#fff;padding:6px 8px 6px 22px;gap:14px}.btn-member:hover{background:#2a2a2a}
.btn-bubble{width:34px;height:34px;border-radius:50%;background:var(--lime);color:var(--ink);display:grid;place-items:center;flex-shrink:0}
.li-check{width:24px;height:24px;border-radius:50%;background:var(--accent-soft);color:var(--green);display:grid;place-items:center;flex-shrink:0}

/* nav + mega menu */
.pnav{position:fixed;top:18px;left:50%;transform:translateX(-50%);width:min(96%,1240px);z-index:200;border-radius:26px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.82);backdrop-filter:saturate(180%) blur(20px);box-shadow:0 16px 44px -26px rgba(10,10,10,.45)}
.pnav-in{display:flex;align-items:center;justify-content:space-between;height:64px;padding-inline:22px 12px}
.pnav-logo{font-family:var(--display);font-weight:800;font-size:21px;letter-spacing:-.04em}.pnav-logo span{color:var(--green)}
.pnav-links{display:flex;align-items:center;gap:4px}
.pnav-item{position:static}
.pnav-link{display:inline-flex;align-items:center;gap:5px;font-size:14.5px;font-weight:600;color:var(--muted);padding:9px 14px;border-radius:var(--r-pill);transition:background .25s;cursor:pointer}
.pnav-link:hover,.pnav-item:hover .pnav-link{background:var(--bone)}
.pnav-chev{transition:transform .3s var(--ease)}
.pnav-item:hover .pnav-chev{transform:rotate(180deg)}
.pnav-mega{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(6px);width:min(720px,94vw);padding-top:14px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s var(--ease),transform .3s var(--ease)}
.pnav-mega-wide{width:min(900px,94vw)}
.pnav-item:hover .pnav-mega{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}
.mega{border-top:1px solid var(--line);padding-top:16px}
.mega-courts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.mega-court{display:flex;flex-direction:column;gap:10px;padding:10px;border-radius:18px;transition:background .25s}
.mega-court:hover{background:var(--bone)}
.mega-court-img{border-radius:14px;overflow:hidden;aspect-ratio:16/10}
.mega-court-img img{width:100%;height:100%;object-fit:cover}
.mega-court-t strong{display:block;font-size:15px;font-weight:700}
.mega-court-t span{font-size:13px;font-weight:500;opacity:.65}
.mega-rows{display:grid;grid-template-columns:1fr 1fr;gap:6px;align-content:start}
.mega-feature{display:grid;grid-template-columns:1.1fr .9fr;gap:18px}
.mega-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;border-radius:14px;transition:background .25s}
.mega-row:hover{background:var(--bone)}
.mega-row-t strong{display:block;font-size:15px;font-weight:700}
.mega-row-t span{font-size:13px;font-weight:500;opacity:.65}
.mega-row .svg-i{opacity:0;transform:translateX(-6px);transition:all .25s var(--ease)}
.mega-row:hover .svg-i{opacity:1;transform:translateX(0)}
.mega-card{position:relative;border-radius:18px;overflow:hidden;min-height:220px;display:flex;align-items:flex-end;isolation:isolate;color:#fff}
.mega-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.mega-card-scrim{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(8,8,9,.1) 30%,rgba(8,8,9,.82) 100%)}
.mega-card-tag{position:absolute;top:14px;left:14px;padding:6px 12px;border-radius:var(--r-pill);background:var(--lime);color:var(--ink);font-size:11.5px;font-weight:700}
.mega-card-b{padding:18px;display:flex;flex-direction:column;gap:14px}
.mega-card-b strong{font-family:var(--display);font-size:21px;font-weight:700;letter-spacing:-.02em;line-height:1.08}
.mega-card-btn{align-self:flex-start}
.mega-join{display:grid;grid-template-columns:1.5fr 1fr;gap:22px}
.mega-join-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.mega-jcard{display:flex;flex-direction:column;gap:4px;padding:10px;border-radius:16px;transition:background .25s}
.mega-jcard:hover{background:var(--bone)}
.mega-jcard-img{border-radius:12px;overflow:hidden;aspect-ratio:4/3;margin-bottom:6px}
.mega-jcard-img img{width:100%;height:100%;object-fit:cover}
.mega-jcard strong{font-size:15px;font-weight:700}
.mega-jcard span{font-size:12.5px;font-weight:500;opacity:.65}
.mega-join-side{display:flex;flex-direction:column;justify-content:space-between;gap:16px;border-left:1px solid var(--line);padding-left:22px}
.mega-join-side .mega-rows{grid-template-columns:1fr}
.mega-join-btn{justify-content:center}
/* hamburger + mobile drawer */
.pnav-burger{display:none;flex-direction:column;gap:5px;padding:10px;background:none;border:none;cursor:pointer}
.pnav-burger span{width:22px;height:2px;background:var(--ink);border-radius:2px;transition:all .3s var(--ease)}
body.nav-open .pnav-burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}
body.nav-open .pnav-burger span:nth-child(2){opacity:0}
body.nav-open .pnav-burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.pnav-drawer{overflow:hidden;max-height:0;opacity:0;display:flex;flex-direction:column;padding:0 16px;transition:max-height .45s var(--ease),opacity .35s var(--ease),padding .45s var(--ease)}
body.nav-open .pnav-drawer{max-height:440px;opacity:1;padding:4px 16px 18px}
.pnav-drawer a:not(.btn){padding:14px 6px;border-top:1px solid var(--line);font-size:17px;font-weight:700;color:var(--ink)}
.pnav-drawer-cta{margin-top:14px;justify-content:center}
@media(max-width:980px){.pnav-links{display:none}.pnav-burger{display:flex}}
@media(max-width:520px){.pnav-cta{display:none}}

/* scroll reveal */
[data-reveal]{opacity:0;transform:translateY(34px) scale(.97);transition:opacity .85s var(--ease),transform .85s var(--ease)}
[data-reveal].in{opacity:1;transform:none}
[data-reveal][data-d="1"]{transition-delay:.12s}
.stagger>[data-reveal]:nth-child(2){transition-delay:.1s}
.stagger>[data-reveal]:nth-child(3){transition-delay:.2s}
.stagger>[data-reveal]:nth-child(4){transition-delay:.3s}
@media(prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none;transition:none}}

/* left social dock */
.dock{position:fixed;left:clamp(12px,2vw,24px);top:50%;transform:translateY(-50%);z-index:150}
.dock-inner{position:relative;display:flex;justify-content:center;width:54px}
.dock-panel{position:absolute;bottom:calc(100% + 12px);left:50%;width:76px;margin-left:-38px;display:flex;flex-direction:column;align-items:center;gap:12px;padding:12px;border-radius:var(--r-pill);background:rgba(255,255,255,.72);backdrop-filter:blur(14px) saturate(160%);border:1px solid rgba(255,255,255,.7);box-shadow:0 24px 50px -24px rgba(10,10,10,.4);transform-origin:bottom center;transform:translateY(10px) scale(.55);opacity:0;visibility:hidden;pointer-events:none;transition:.4s var(--ease)}
.dock.is-open .dock-panel{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0) scale(1)}
.dock-bubble{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;box-shadow:0 10px 24px -12px rgba(10,10,10,.5);cursor:pointer;transition:transform .25s var(--ease)}
.dock-bubble:hover{transform:scale(1.12)}
.dock-lime{background:var(--lime);color:var(--ink)}
.dock-dark{background:var(--ink);color:#fff}
.dock-white{background:#fff;color:var(--ink);border:1px solid var(--line-2)}
.dock-trigger{position:relative;width:54px;height:54px;border-radius:50%;background:var(--ink);color:#fff;border:3px solid #fff;display:grid;place-items:center;box-shadow:0 18px 38px -16px rgba(10,10,10,.6);cursor:pointer;transition:background .3s}
.dock.is-open .dock-trigger{background:var(--green)}
.dock-i{display:grid;place-items:center}
.dock-i-close{display:none}
.dock.is-open .dock-i-share{display:none}
.dock.is-open .dock-i-close{display:grid}
@media(max-width:760px){.dock{top:auto;bottom:18px;left:14px;transform:none}}

/* hero */
.phero{padding-top:clamp(140px,15vw,180px);padding-bottom:clamp(30px,5vw,60px);display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,5vw,64px);align-items:center}
.phero-text{display:flex;flex-direction:column;align-items:flex-start;gap:22px}
.phero-title{font-family:var(--display);font-weight:800;font-size:clamp(44px,6.4vw,92px);line-height:.96;letter-spacing:-.045em}
.phero-lead{font-size:clamp(16px,1.5vw,19px);font-weight:500;line-height:1.6;max-width:48ch;color:var(--muted);opacity:.8}
.phero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px}
.phero-img{position:relative;border-radius:var(--r-xl);aspect-ratio:5/5.2}
.phero-img::before{content:'';position:absolute;inset:8% 4% -5% 4%;border-radius:inherit;background:rgba(15,15,15,.4);filter:blur(60px);opacity:.5;z-index:0}
.phero-img img{position:relative;z-index:1;width:100%;height:100%;object-fit:cover;border-radius:inherit;box-shadow:0 50px 100px -55px rgba(10,10,10,.55)}
@media(max-width:860px){.phero{grid-template-columns:1fr}}

/* generic block */
.blk{padding-block:clamp(64px,8vw,120px)}
.blk-head{text-align:center;display:flex;flex-direction:column;align-items:center;gap:18px;margin-bottom:clamp(64px,9vw,120px)}
.blk-head h2{font-family:var(--display);font-weight:800;font-size:clamp(32px,4.6vw,60px);letter-spacing:-.04em;line-height:1}
.blk-lead{max-width:560px;font-size:16px;font-weight:500;color:var(--muted);opacity:.75;line-height:1.6}

/* rich text */
.rich{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
.rich h2{font-family:var(--display);font-weight:800;font-size:clamp(28px,3.8vw,48px);letter-spacing:-.03em;line-height:1.05}
.rich p{font-size:clamp(16px,1.5vw,18px);font-weight:500;line-height:1.65;color:var(--muted);opacity:.82}

/* split */
.split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,64px);align-items:center}
.split-flip .split-img{order:2}
.split-img{position:relative;border-radius:var(--r-lg);overflow:hidden;aspect-ratio:4/3.4}
.split-img img{width:100%;height:100%;object-fit:cover}
.split-tag{position:absolute;top:14px;left:14px;padding:7px 14px;border-radius:var(--r-pill);background:var(--lime);color:var(--ink);font-size:12px;font-weight:700}
.split-text{display:flex;flex-direction:column;align-items:flex-start;gap:16px}
.split-text h3{font-family:var(--display);font-weight:800;font-size:clamp(26px,3.4vw,44px);letter-spacing:-.03em;line-height:1.05}
.split-text p{font-size:16px;font-weight:500;line-height:1.6;color:var(--muted);opacity:.8}
.split-list{list-style:none;display:flex;flex-direction:column;gap:13px;margin-top:6px}
.split-list li{display:flex;align-items:center;gap:13px;font-size:15.5px;font-weight:600}
@media(max-width:820px){.split{grid-template-columns:1fr}.split-flip .split-img{order:0}}

/* features cards (informational — not clickable) */
.pcards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.pc{display:flex;flex-direction:column;border-radius:var(--r-lg);background:var(--paper);border:1px solid var(--line);padding:16px;transition:transform .4s var(--ease),border-color .3s,box-shadow .4s}
.pc:hover{transform:translateY(-6px);border-color:var(--lime);box-shadow:0 40px 70px -54px rgba(10,10,10,.18)}
.pc-img{position:relative;border-radius:var(--r-md);overflow:hidden;aspect-ratio:4/3.2}
.pc-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s var(--ease)}
.pc-cap{position:absolute;left:0;right:0;bottom:0;padding:34px 16px 14px;color:#fff;font-size:13.5px;font-weight:600;background:linear-gradient(180deg,transparent,rgba(8,8,9,.62));opacity:0;transform:translateY(12px);transition:opacity .4s var(--ease),transform .4s var(--ease)}
.pc:hover .pc-cap{opacity:1;transform:none}
.pc-b{padding:20px 8px 8px}
.pc-b h3{font-family:var(--display);font-size:22px;font-weight:700;letter-spacing:-.02em}
.pc-b p{margin-top:10px;font-size:14.5px;font-weight:500;color:var(--muted);opacity:.72;line-height:1.5}
@media(max-width:760px){.pcards{grid-template-columns:1fr}}

/* sliding image gallery with hover captions */
.gal{overflow:hidden;padding-block:8px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.gal-track{display:flex;gap:18px;width:max-content;padding-inline:var(--pad);animation:galslide 34s linear infinite}
.gal:hover .gal-track{animation-play-state:paused}
@keyframes galslide{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.gshot{position:relative;width:clamp(260px,28vw,380px);aspect-ratio:4/3;border-radius:var(--r-lg);overflow:hidden;flex-shrink:0}
.gshot img{width:100%;height:100%;object-fit:cover}
.gshot-cap{position:absolute;left:0;right:0;bottom:0;padding:40px 18px 16px;color:#fff;font-size:14px;font-weight:600;background:linear-gradient(180deg,transparent,rgba(8,8,9,.6));opacity:0;transform:translateY(12px);transition:opacity .4s var(--ease),transform .4s var(--ease)}
.gshot:hover .gshot-cap{opacity:1;transform:none}

/* media grid with hover descriptions */
.mgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.mcell{position:relative;border-radius:var(--r-lg);overflow:hidden;aspect-ratio:16/10}
.mcell img{width:100%;height:100%;object-fit:cover}
.mcell-cap{position:absolute;left:0;right:0;bottom:0;padding:46px 22px 20px;color:#fff;background:linear-gradient(180deg,transparent,rgba(8,8,9,.66));opacity:0;transform:translateY(10px);transition:opacity .45s var(--ease),transform .45s var(--ease)}
.mcell:hover .mcell-cap{opacity:1;transform:none}
.mcell-cap strong{display:block;font-family:var(--display);font-size:20px;font-weight:700;letter-spacing:-.01em}
.mcell-cap span{font-size:13.5px;opacity:.85}
@media(max-width:680px){.mgrid{grid-template-columns:1fr}}

/* hover-reveal image grid (replaces plain feature cards) */
.hgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.hcell{position:relative;border-radius:var(--r-lg);overflow:hidden;aspect-ratio:4/4.8;transition:transform .4s var(--ease)}
.hcell:hover{transform:translateY(-6px)}
.hcell img{width:100%;height:100%;object-fit:cover}
.hcell::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 42%,rgba(8,8,9,.8))}
.hcell-b{position:absolute;left:0;right:0;bottom:0;padding:24px;color:#fff;z-index:1}
.hcell-b h3{font-family:var(--display);font-size:23px;font-weight:700;letter-spacing:-.02em}
.hcell-b p{margin-top:8px;font-size:14px;line-height:1.5;opacity:0;max-height:0;transform:translateY(10px);transition:opacity .4s var(--ease),transform .4s var(--ease),max-height .4s var(--ease)}
.hcell:hover .hcell-b p{opacity:.9;max-height:130px;transform:none}
@media(max-width:760px){.hgrid{grid-template-columns:1fr}.hcell{aspect-ratio:4/3.2}.hcell-b p{opacity:.9;max-height:130px;transform:none}}

/* contained banner card (Club, Courts) — gap from the nav, taller, darker */
.banner{position:relative;width:min(var(--maxw),calc(100% - 2*var(--pad)));margin:clamp(104px,13vw,150px) auto 0;min-height:clamp(560px,74vh,860px);display:flex;align-items:flex-end;overflow:hidden;isolation:isolate;color:#fff;border-radius:clamp(24px,3vw,44px)}
.banner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.banner-scrim{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(8,8,9,.55) 0%,rgba(8,8,9,.22) 32%,rgba(8,8,9,.42) 62%,rgba(8,8,9,.94) 100%)}
.banner-b{width:100%;padding:clamp(28px,4vw,54px);display:flex;flex-direction:column;align-items:flex-start;gap:15px}
.banner-b .micro{color:#fff}
.banner-title{font-family:var(--display);font-weight:800;font-size:clamp(38px,5.6vw,82px);line-height:.96;letter-spacing:-.04em}
.banner-lead{max-width:52ch;font-size:clamp(14.5px,1.3vw,17px);font-weight:500;line-height:1.55;color:rgba(255,255,255,.82)}
.banner-btn{margin-top:8px}

/* product / price cards */
.prods{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.prod{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;background:var(--paper);transition:transform .4s var(--ease),border-color .3s,box-shadow .4s}
.prod:hover{transform:translateY(-6px);border-color:var(--lime);box-shadow:0 40px 70px -54px rgba(10,10,10,.18)}
.prod-img{aspect-ratio:4/3;overflow:hidden}
.prod-img img{width:100%;height:100%;object-fit:cover}
.prod-b{padding:18px 20px 22px}
.prod-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.prod-top strong{font-size:17px;font-weight:700;letter-spacing:-.01em}
.prod-price{font-family:var(--display);font-weight:800;font-size:17px;color:var(--green);white-space:nowrap}
.prod-b p{margin-top:8px;font-size:14px;font-weight:500;color:var(--muted);opacity:.72;line-height:1.5}
@media(max-width:760px){.prods{grid-template-columns:1fr}}

/* points list (why players love it, etc.) */
.plist{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.pli{display:flex;gap:15px;padding:24px;border:1px solid var(--line);border-radius:var(--r-lg);background:var(--paper);transition:border-color .3s,transform .3s var(--ease)}
.pli:hover{border-color:var(--lime);transform:translateY(-4px)}
.pli-ic{width:34px;height:34px;border-radius:50%;background:var(--accent-soft);color:var(--green);display:grid;place-items:center;flex-shrink:0}
.pli strong{font-family:var(--display);font-size:18px;font-weight:700;letter-spacing:-.01em}
.pli p{margin-top:7px;font-size:14.5px;font-weight:500;color:var(--muted);opacity:.72;line-height:1.5}
@media(max-width:680px){.plist{grid-template-columns:1fr}}

/* gift / contact form */
.gform{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:18px;background:var(--paper);border:1px solid var(--line);border-radius:var(--r-xl);padding:clamp(24px,3vw,44px);box-shadow:0 40px 80px -60px rgba(10,10,10,.35)}
.gform-row{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.gform label{display:flex;flex-direction:column;gap:8px;font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
.gform input,.gform select,.gform textarea{font-family:inherit;font-size:15px;font-weight:500;color:var(--ink);padding:14px 16px;border:1px solid var(--line-2);border-radius:14px;background:var(--page);outline:none;transition:border-color .25s}
.gform input:focus,.gform select:focus,.gform textarea:focus{border-color:var(--green)}
.gform textarea{min-height:120px;resize:vertical}
.gform-foot{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:6px}
.gform-done{display:none;align-items:center;gap:8px;color:var(--green);font-size:14px;font-weight:700}
@media(max-width:600px){.gform-row{grid-template-columns:1fr}}

/* steps */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.step{display:flex;flex-direction:column;align-items:flex-start;padding:30px 26px;border-radius:var(--r-lg);background:var(--paper);border:1px solid var(--line)}
.step-n{font-family:var(--display);font-size:22px;font-weight:800;color:var(--green)}
.step-line{width:40px;height:3px;border-radius:3px;background:var(--lime);margin:16px 0 20px}
.step h3{font-family:var(--display);font-size:21px;font-weight:700;letter-spacing:-.02em;margin-bottom:10px}
.step p{font-size:14.5px;font-weight:500;color:var(--muted);opacity:.75;line-height:1.5}
@media(max-width:760px){.steps{grid-template-columns:1fr}}

/* stat bubbles */
.tline{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.tline-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;min-height:150px;padding:22px 18px;border:1px solid var(--line);border-radius:var(--r-lg);background:var(--paper)}
.tline-n{font-family:var(--display);font-size:clamp(32px,3.8vw,50px);font-weight:800;letter-spacing:-.03em;line-height:1}
.tline-l{font-size:13.5px;font-weight:500;color:var(--muted);opacity:.72}
@media(max-width:720px){.tline{grid-template-columns:1fr 1fr}}

/* tiers */
.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:stretch}
.tier2{position:relative;display:flex;flex-direction:column;border:1px solid var(--line-2);border-radius:var(--r-lg);padding:28px;background:var(--paper)}
.tier2-hot{background:var(--ink);color:#fff;border-color:var(--ink)}
.tier2-badge{position:absolute;top:18px;right:18px;padding:6px 12px;border-radius:var(--r-pill);background:var(--lime);color:var(--ink);font-size:11px;font-weight:700}
.tier2 h3{font-family:var(--display);font-size:22px;font-weight:700;letter-spacing:-.02em}
.tier2-price{display:flex;align-items:baseline;gap:8px;margin:18px 0 6px}
.tier2-n{font-family:var(--display);font-size:46px;font-weight:800;letter-spacing:-.03em}
.tier2-c{font-size:14px;color:var(--muted);opacity:.6}
.tier2-hot .tier2-c{color:rgba(255,255,255,.6)}
.tier2-desc{font-size:14px;font-weight:500;opacity:.7;margin-bottom:18px}
.tier2-list{list-style:none;display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid var(--line);margin-bottom:24px}
.tier2-hot .tier2-list{border-top-color:rgba(255,255,255,.16)}
.tier2-list li{display:flex;align-items:center;gap:12px;font-size:14.5px;font-weight:500}
.tier2-hot .li-check{background:rgba(255,255,255,.16);color:#fff}
.tier2-btn{margin-top:auto;justify-content:center}
@media(max-width:820px){.tiers{grid-template-columns:1fr;max-width:460px;margin:0 auto}}

/* faq */
.faqs{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.faq{padding:28px;border-radius:var(--r-lg);background:var(--paper);border:1px solid var(--line)}
.faq h3{font-family:var(--display);font-size:19px;font-weight:700;letter-spacing:-.01em;margin-bottom:10px}
.faq p{font-size:14.5px;font-weight:500;color:var(--muted);opacity:.78;line-height:1.55}
@media(max-width:720px){.faqs{grid-template-columns:1fr}}

/* member reviews */
.revs{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.rev{position:relative;display:flex;flex-direction:column;gap:18px;padding:30px 28px;border-radius:var(--r-lg);background:var(--paper);border:1px solid var(--line);transition:transform .4s var(--ease),box-shadow .4s,border-color .3s}
.rev:hover{transform:translateY(-6px);border-color:var(--line-2);box-shadow:0 40px 70px -55px rgba(10,10,10,.6)}
.rev-mark{color:var(--lime);line-height:0}
.rev-q{font-size:16px;font-weight:500;line-height:1.6;color:var(--ink);flex:1}
.rev-who{display:flex;align-items:center;gap:13px;padding-top:18px;border-top:1px solid var(--line)}
.rev-who img{width:46px;height:46px;border-radius:50%;object-fit:cover;flex-shrink:0}
.rev-id{display:flex;flex-direction:column;gap:2px}
.rev-id strong{font-size:15px;font-weight:700}
.rev-id span{font-size:13px;font-weight:500;color:var(--muted);opacity:.62}
@media(max-width:940px){.revs{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.revs{grid-template-columns:1fr}}

/* looping gift-card deck */
.deck{position:relative;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:clamp(8px,2vw,22px)}
.deck-stage{position:relative;height:clamp(620px,72vw,680px);perspective:1600px}
.deck-card{position:absolute;top:0;left:50%;width:min(420px,100%);display:flex;flex-direction:column;gap:22px;padding:26px;border-radius:var(--r-xl);background:var(--paper);border:1px solid var(--line);box-shadow:0 50px 90px -60px rgba(10,10,10,.55);transform-style:preserve-3d;transition:transform .65s var(--ease),opacity .55s var(--ease),filter .55s var(--ease);cursor:pointer}
.deck-card[data-pos="0"]{transform:translateX(-50%) scale(1);opacity:1;filter:none;z-index:3;cursor:default}
.deck-card[data-pos="-1"]{transform:translateX(calc(-50% - clamp(150px,20vw,280px))) scale(.84) rotateY(16deg);opacity:.5;filter:saturate(.5);z-index:2}
.deck-card[data-pos="1"]{transform:translateX(calc(-50% + clamp(150px,20vw,280px))) scale(.84) rotateY(-16deg);opacity:.5;filter:saturate(.5);z-index:2}
.deck-card:not([data-pos="0"]):hover{opacity:.72;filter:none}
/* the card face itself */
.deck-face{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:210px;padding:24px;border-radius:var(--r-lg);background:linear-gradient(140deg,#161616,#0b0b0b 60%);color:#fff;overflow:hidden;isolation:isolate}
.deck-face::after{content:'';position:absolute;inset:auto -30% -70% auto;width:80%;height:150%;background:radial-gradient(ellipse at center,rgba(93,214,44,.55),transparent 62%);filter:blur(38px);z-index:-1}
.deck-brand{font-family:var(--display);font-weight:800;font-size:17px;letter-spacing:-.03em}
.deck-brand span{color:var(--lime)}
.deck-tag{position:absolute;top:24px;right:24px;font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:6px 11px;border-radius:var(--r-pill);background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16)}
.deck-amount{font-family:var(--display);font-weight:800;font-size:clamp(38px,6vw,52px);letter-spacing:-.05em;line-height:1;margin-top:auto}
.deck-name{font-size:13.5px;font-weight:600;color:rgba(255,255,255,.66);margin-top:6px}
/* the detail that only the centre card shows */
.deck-info{display:flex;flex-direction:column;gap:16px;opacity:0;transform:translateY(10px);transition:opacity .45s var(--ease) .1s,transform .45s var(--ease) .1s;pointer-events:none}
.deck-card[data-pos="0"] .deck-info{opacity:1;transform:none;pointer-events:auto}
.deck-desc{font-size:15px;font-weight:500;line-height:1.55;color:var(--muted);opacity:.8}
.deck-list{list-style:none;display:flex;flex-direction:column;gap:11px}
.deck-list li{display:flex;align-items:center;gap:11px;font-size:14.5px;font-weight:600}
.deck-btn{justify-content:center;width:100%}
/* nav */
.deck-nav{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:var(--paper);border:1px solid var(--line);color:var(--ink);cursor:pointer;transition:background .25s,transform .25s var(--ease),border-color .25s;z-index:5}
.deck-nav:hover{background:var(--ink);color:#fff;transform:scale(1.08)}
.deck-dots{grid-column:1/-1;display:flex;justify-content:center;gap:9px;margin-top:6px}
.deck-dot{width:8px;height:8px;padding:0;border:none;border-radius:50%;background:var(--mist);cursor:pointer;transition:width .35s var(--ease),background .35s}
.deck-dot.on{width:26px;border-radius:var(--r-pill);background:var(--green)}
@media(max-width:720px){
  .deck{grid-template-columns:1fr}
  .deck-nav{position:absolute;top:118px}
  .deck-prev{left:0}.deck-next{right:0}
  .deck-card[data-pos="-1"]{transform:translateX(calc(-50% - 62vw)) scale(.84)}
  .deck-card[data-pos="1"]{transform:translateX(calc(-50% + 62vw)) scale(.84)}
}
@media(prefers-reduced-motion:reduce){.deck-card{transition-duration:.01ms}}

/* cta */
.pcta{position:relative;overflow:hidden;border-radius:clamp(28px,4vw,48px);background:var(--ink);color:#fff;padding:clamp(44px,7vw,96px);text-align:center;isolation:isolate}
.pcta-glow{position:absolute;inset:auto -10% -60% -10%;height:70%;background:radial-gradient(ellipse at center,rgba(93,214,44,.5),transparent 65%);filter:blur(60px);z-index:-1}
.pcta h2{font-family:var(--display);font-weight:800;font-size:clamp(30px,5vw,72px);letter-spacing:-.045em;line-height:.98;max-width:16ch;margin:0 auto}
.pcta p{max-width:480px;margin:20px auto 30px;color:rgba(255,255,255,.78);font-size:clamp(15px,1.5vw,18px)}

/* main footer (full width, like index) */
.mfoot{background:var(--ink);color:rgba(255,255,255,.66)}
.mfoot-pad{padding:clamp(56px,7vw,100px) var(--pad) 30px}
.mfoot-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 1fr;gap:30px;padding-bottom:clamp(44px,5vw,72px)}
.mfoot-brand{display:flex;flex-direction:column;gap:16px;align-items:flex-start}
.mfoot-logo{font-family:var(--display);font-weight:800;font-size:24px;color:#fff}.mfoot-logo span{color:var(--lime)}
.mfoot-brand p{font-size:15px;font-weight:500;color:rgba(255,255,255,.55);max-width:260px;line-height:1.5}
.btn.mfoot-join{background:#fff;color:var(--ink);margin-top:6px}.btn.mfoot-join:hover{background:#ededed}
.mfoot-col{display:flex;flex-direction:column;gap:14px}
.mfoot-col h4{color:rgba(255,255,255,.45);font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:5px}
.mfoot-col a{font-size:15px;font-weight:500;color:rgba(255,255,255,.72);transition:color .3s,transform .3s var(--ease)}.mfoot-col a:hover{color:#fff;transform:translateX(3px)}
.mfoot-bottom{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:28px;border-top:1px solid rgba(255,255,255,.12);font-size:14px;font-weight:500}
.mfoot-logo-sm{font-size:18px}
.mfoot-copy{color:rgba(255,255,255,.5)}
.mfoot-mini{display:flex;gap:24px}.mfoot-mini a{color:rgba(255,255,255,.6)}.mfoot-mini a:hover{color:#fff}
@media(max-width:920px){.mfoot-grid{grid-template-columns:1fr 1fr 1fr}.mfoot-brand{grid-column:1/-1}}
@media(max-width:560px){.mfoot-grid{grid-template-columns:1fr 1fr}}
`

const js = `(function(){
  var burger=document.querySelector('[data-burger]');
  if(burger){burger.addEventListener('click',function(){document.body.classList.toggle('nav-open');});}
  var dock=document.querySelector('[data-dock]');
  var dockBtn=document.querySelector('[data-dock-btn]');
  if(dock&&dockBtn){dockBtn.addEventListener('click',function(){dock.classList.toggle('is-open');});}
  var els=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el);});
  } else { for(var i=0;i<els.length;i++){els[i].classList.add('in');} }

  /* ---- buy buttons -> the React cart layer from embed.js ---- */
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('[data-buy]');
    if(!el) return;
    e.preventDefault();
    var item;
    try{ item=JSON.parse(el.getAttribute('data-buy')); }catch(err){ return; }
    function send(tries){
      if(window.CourtSyCart){
        window.CourtSyCart.add(item);
        window.CourtSyCart.open();
      } else if(tries>0){
        // embed.js is still booting — try again on the next frame
        setTimeout(function(){send(tries-1);},60);
      }
    }
    send(12);
  });

  /* ---- looping card deck ---- */
  document.querySelectorAll('[data-deck]').forEach(function(deck){
    var cards=[].slice.call(deck.querySelectorAll('[data-deck-card]'));
    var dots=[].slice.call(deck.querySelectorAll('[data-deck-dot]'));
    var n=cards.length; if(!n) return;
    var active=0;
    function paint(){
      cards.forEach(function(card,i){
        // signed shortest distance from the active card, so it wraps both ways
        var d=i-active;
        if(d>n/2) d-=n;
        if(d<-n/2) d+=n;
        card.setAttribute('data-pos',d);
        card.setAttribute('aria-hidden',d===0?'false':'true');
      });
      dots.forEach(function(dot,i){dot.classList.toggle('on',i===active);});
    }
    function go(step){active=(active+step+n)%n;paint();}
    deck.querySelector('[data-deck-prev]').addEventListener('click',function(){go(-1);});
    deck.querySelector('[data-deck-next]').addEventListener('click',function(){go(1);});
    dots.forEach(function(dot,i){dot.addEventListener('click',function(){active=i;paint();});});
    // click a side card to bring it to the centre
    cards.forEach(function(card,i){card.addEventListener('click',function(){if(i!==active){active=i;paint();}});});
    deck.setAttribute('tabindex','0');
    deck.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
      if(e.key==='ArrowRight'){e.preventDefault();go(1);}
    });
    paint();
  });
})();`

await writeFile(path.join(OUT, 'page.css'), css.trim())
await writeFile(path.join(OUT, 'page.js'), js)
for (const p of PAGES) {
  await writeFile(path.join(OUT, `${p.slug}.html`), applyBase(page(p)))
  console.log('wrote', `${p.slug}.html`)
}
console.log('done — ' + PAGES.length + ' unique pages + page.css')
