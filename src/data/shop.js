/* The club shop, and the clubhouse kitchen.
 *
 * Two small content areas that share a file because they are the same idea —
 * what the club sells you once you are through the gate. Shop products are
 * cart lines like any other: `id` is the cart key, `price` is a number, and
 * `shipped` is true because these are physical things that go in a box.
 */
import { local } from './images'

/**
 * @typedef {Object} Product
 * @property {string} id        cart line id, globally unique
 * @property {string} name
 * @property {string} meta      the line's secondary text in the cart
 * @property {number} price     USD
 * @property {string} category
 * @property {string} blurb     one sentence on the card
 * @property {string} img
 * @property {string} [tag]     badge on the card
 */

export const SHOP_CATEGORIES = ['Racket', 'Apparel', 'Gadgets', 'Clubhouse']

/** @type {Product[]} */
export const PRODUCTS = [
  {
    id: 'shop-sensor',
    name: 'CourtSy Swing Sensor',
    meta: 'Racket-mounted, 14 g',
    price: 149,
    category: 'Gadgets',
    tag: 'New',
    blurb:
      'Clips to the butt cap and logs every swing — spin, contact point and racket-head speed, straight into your account after the session.',
    img: local('rackets.jpg'),
  },
  {
    id: 'shop-band',
    name: 'CourtSy Training Band',
    meta: 'Heart rate & load, 5-day battery',
    price: 189,
    category: 'Gadgets',
    tag: 'Members’ pick',
    blurb:
      'The strap the coaching team actually uses. Reads heart rate at the forearm, which survives a forehand in a way a wrist does not.',
    img: local('strength.jpg'),
  },
  {
    id: 'shop-bottle',
    name: 'Insulated Club Bottle',
    meta: '750 ml, recycled steel',
    price: 38,
    category: 'Clubhouse',
    blurb:
      'Cold for eighteen hours, and refillable at every court-side station on the grounds. Engraved with your member number on request.',
    img: local('courtside.jpg'),
  },
  {
    id: 'shop-polo',
    name: 'Club Polo',
    meta: 'Unisex · XS to XXL',
    price: 85,
    category: 'Apparel',
    blurb:
      'Woven in a mercerised cotton piqué that holds its shape through a tournament and a wash cycle. Club mark embroidered, never printed.',
    img: local('player.jpg'),
  },
  {
    id: 'shop-jacket',
    name: 'All-Weather Court Jacket',
    meta: 'Unisex · wind and shower proof',
    price: 210,
    category: 'Apparel',
    tag: 'Winter',
    blurb:
      'Cut long at the back for serving, taped at the seams, and quiet enough that nobody will hear you move at the net.',
    img: local('bluesky.jpg'),
  },
  {
    id: 'shop-bag',
    name: 'Six-Racket Tour Bag',
    meta: 'Thermal lined, two compartments',
    price: 175,
    category: 'Racket',
    blurb:
      'Holds six frames, a pair of shoes and everything else you keep swearing you will take out of it. Thermal lining for the clay season.',
    img: local('rackets.jpg'),
  },
  {
    id: 'shop-strings',
    name: 'Stringing Service · 10 pack',
    meta: 'Any gut, fitted same day',
    price: 320,
    category: 'Racket',
    blurb:
      'Ten restrings, booked at the pro shop and done the same day. Tension logged against your racket so it is identical every time.',
    img: local('ball.jpg'),
  },
  {
    id: 'shop-towel',
    name: 'Clubhouse Towel Set',
    meta: 'Two towels, 600 gsm',
    price: 54,
    category: 'Clubhouse',
    blurb:
      'Heavy Portuguese cotton in the club’s coal and lime. One for the bag, one that never leaves the house.',
    img: local('palms.jpg'),
  },
  {
    id: 'shop-cap',
    name: 'Five-Panel Court Cap',
    meta: 'One size, adjustable',
    price: 42,
    category: 'Apparel',
    blurb:
      'Unstructured, washed cotton, with a sweatband that does its job for longer than a season on the hard courts.',
    img: local('courtlife.jpg'),
  },
]

export const SHOP_HERO = local('rackets.jpg')

/* ── the clubhouse kitchen ────────────────────────────────────────────── */

export const DINING_HERO = local('palms.jpg')

/** The three rooms you can eat in, each with its own hours and character. */
export const VENUES = [
  {
    slug: 'the-terrace',
    name: 'The Terrace',
    hours: '07:00 – 23:00, daily',
    seats: '90 covers',
    img: local('palms.jpg'),
    line: 'Lakeside, under the olive trees.',
    desc:
      'The room everyone means when they say they will meet you at the club. Breakfast from seven for the early courts, long lunches that run into the afternoon, and the best seats in the grounds once the floodlights come on.',
  },
  {
    slug: 'the-long-room',
    name: 'The Long Room',
    hours: '12:00 – 23:00, Tue – Sun',
    seats: '46 covers',
    img: local('courtlife.jpg'),
    line: 'The proper dinner, when it is that kind of evening.',
    desc:
      'Forty-six seats, an open pass and a menu that changes with what the growers bring on Tuesday. Reservations open to members fourteen days ahead, and to guests seven.',
  },
  {
    slug: 'the-pass',
    name: 'The Pass',
    hours: '06:30 – 20:00, daily',
    seats: 'Counter & takeaway',
    img: local('courtside.jpg'),
    line: 'Eat in twelve minutes, because you are back on court.',
    desc:
      'A counter beside the pavilion for the forty minutes between a session and the rest of your day. Bowls, toasted things, and coffee that a professional would drink on purpose.',
  },
]

/** A short, honest menu — enough to read, not a full carte. */
export const MENU_SECTIONS = [
  {
    heading: 'Morning',
    note: 'Served 06:30 until 11:30',
    items: [
      { name: 'Pavilion eggs', desc: 'Three eggs, cultured butter, sourdough from the Tuesday bake.', price: 14 },
      { name: 'Overnight oats', desc: 'Toasted oats, yoghurt, poached rhubarb and a lot of pistachio.', price: 11 },
      { name: 'Post-session bowl', desc: 'Forty grams of protein, built with the conditioning team. Not a smoothie.', price: 16 },
    ],
  },
  {
    heading: 'All day',
    note: 'The Terrace and The Pass',
    items: [
      { name: 'Club chicken sandwich', desc: 'Brined thigh, tarragon mayonnaise, pickled cucumber, milk bun.', price: 19 },
      { name: 'Lake trout, cold', desc: 'Cured on site, fennel, dill oil, new potatoes.', price: 26 },
      { name: 'Field greens', desc: 'Whatever is good this week, a sharp dressing, and no apology for the price.', price: 15 },
    ],
  },
  {
    heading: 'Evening',
    note: 'The Long Room, from 18:00',
    items: [
      { name: 'Aged sirloin, 300 g', desc: 'Forty days, over coals, with bone-marrow butter and watercress.', price: 48 },
      { name: 'Turbot on the bone', desc: 'For two. Brown butter, capers, and a half hour of nobody talking.', price: 74 },
      { name: 'Olive-oil cake', desc: 'Citrus, crème fraîche, and the only dessert that has never left the menu.', price: 12 },
    ],
  },
]

/** The three things members ask about the kitchen. */
export const DINING_FACTS = [
  {
    title: 'Charged to the member account',
    desc: 'No card at the table, in any room. Everything lands on your monthly statement with the session it followed.',
  },
  {
    title: 'The kitchen talks to the coaches',
    desc: 'Post-session bowls were written with the conditioning team, and the kitchen will build around an allergy or a plan if you tell them once.',
  },
  {
    title: 'Guests are welcome',
    desc: 'Two guests per member in The Terrace without booking, and in The Long Room with a reservation seven days ahead.',
  },
]
