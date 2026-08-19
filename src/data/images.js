/* Single source of truth for imagery paths.
   Files live in public/img and are produced by scripts/ingest-images.mjs from
   the originals in assets/source.

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
export const local = (name) => `/img/${name}`

/** Unsplash portrait, used only for member testimonial avatars. */
export const remote = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
