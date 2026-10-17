/* Single source of truth for imagery paths.
   Files live in public/img and are produced by scripts/ingest-images.mjs from
   the originals, which are kept locally rather than committed (52 MB of raw
   photography). Everything the site serves is in public/img.

   Inventory — keep uses spread across all of these:
     courts.jpg      open-air hard courts        aerial.jpg     court from above, estate
     clay.jpg        championship clay           woodcourt.jpg  court in woodland (portrait)
     golf.jpg        lakeside greens, aerial     courtside.jpg  shoes, racket & ball, hard court
     rackets.jpg     rackets / pro shop          baseline.jpg   shoes & ball on clay
     ball.jpg        ball on court, close up     courtlife.jpg  player seated courtside
     player.jpg      player mid-match            bluesky.jpg    player against blue sky (portrait)
     palms.jpg       grounds & terraces          fixture.jpg    floodlit match in play
     runners.jpg     runners at dusk             scrum.jpg      team locked in a scrum
     cycling.jpg     cyclist POV on the road     swim.jpg       butterfly, full stroke
     strength.jpg    conditioning, mono          lanes.jpg      swimmer in the lane
     floodlights.jpg sprinklers, floodlit pitch  yoga.jpg       studio mobility flow
     night.jpg       full floodlit arena         stretch.jpg    warm-up by the water (portrait)
     airborne.jpg    athlete mid-air

   Portrait sources (woodcourt, bluesky, stretch) suit near-square and card
   slots — keep them out of wide full-bleed banners. */

/** Club photography, served straight from public/img. */
export const local = (name) => `${import.meta.env.BASE_URL}img/${name}`

/** Unsplash portrait, used only for member testimonial avatars. */
export const remote = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

/* ── alternative text ──────────────────────────────────────────────────────
   What each photograph actually shows, written once, here.

   Keyed by file rather than by the thing it illustrates because most of
   these are reused: clay.jpg is Centre Court's main image, the first slide
   of its gallery and the "Clay courts" tile on the homepage. The picture is
   the same in all three, so the description should be too — and writing it
   per call site meant the same sentence maintained in three places, which
   is how alt text drifts into being wrong.

   These describe; they do not caption. "Centre Court" is already in the
   heading beside the image, so repeating it would make a screen reader say
   it twice; what it cannot see is the red clay and the empty stands.

   Where an image carries no information of its own — a face in an avatar
   stack, a thumbnail inside a link whose text already names the thing —
   the call site passes alt="" instead, which is the correct markup for a
   decorative image and keeps it out of the accessibility tree. */
const ALT = {
  'aerial.jpg':
    'A single tennis court from directly above, enclosed by clipped hedges, with the clubhouse roofs and a lake among the trees beyond.',
  'airborne.jpg': 'An athlete at the top of a jump, fully extended against an open sky.',
  'ball.jpg': 'A tennis ball at rest on the painted line of a hard court, lit from the side.',
  'baseline.jpg':
    'A racket propped against a tennis ball on red clay, behind the baseline, in low sun.',
  'bluesky.jpg': 'A player looking up to serve, shot from below against a cloudless blue sky.',
  'clay.jpg': 'A championship clay court, freshly rolled and marked, with empty seating behind.',
  'courtlife.jpg': 'A player sitting courtside between games, racket across the knees.',
  'courts.jpg':
    'Open-air hard courts in two banks, seen from above, ringed by mature trees.',
  'courtside.jpg': 'Court shoes, a racket and a ball laid out at the edge of a hard court.',
  'cycling.jpg': 'The rider’s view from a road bike, handlebars in frame, on an open road.',
  'fixture.jpg': 'A match in play under floodlights, the court bright against the dark.',
  'floodlights.jpg': 'Sprinklers watering a floodlit playing surface after dark.',
  'golf.jpg': 'The lakeside golf course from the air: fairways, bunkers and open water.',
  'lanes.jpg': 'A swimmer mid-stroke in a marked lane, seen from the side of the pool.',
  'night.jpg': 'A full arena under floodlights at night.',
  'palms.jpg': 'The club grounds: lawns and terraces under palms, with the lake behind.',
  'player.jpg': 'A player mid-match, weight forward, about to strike the ball.',
  'rackets.jpg': 'Rackets racked in the pro shop, strings and grips in close view.',
  'runners.jpg': 'Runners in silhouette on a path at dusk.',
  'scrum.jpg': 'A team locked together in a scrum on grass.',
  'strength.jpg':
    'A conditioning session in monochrome: hands gripping a loaded bar mid-lift.',
  'stretch.jpg': 'An athlete warming up beside the water in early light.',
  'swim.jpg': 'A swimmer at full extension in the butterfly stroke, shoulders clear of the water.',
  'woodcourt.jpg': 'A single court set in woodland, surrounded on every side by trees.',
  'yoga.jpg': 'A guided mobility flow in the studio, mats laid out across the floor.',
}

/**
 * Alternative text for one of the club photographs.
 *
 * Takes the same value `local()` returned, so call sites pass the image
 * they are already rendering rather than repeating its filename.
 *
 * @param {string} src  a URL produced by local()
 * @returns {string} the description, or '' for an unknown file — an empty
 *   alt is the safe default, because inventing a description of a
 *   photograph nobody has described is worse than describing nothing.
 */
export const describe = (src) => {
  if (typeof src !== 'string') return ''
  return ALT[src.split('/').pop()] ?? ''
}
