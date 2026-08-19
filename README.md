# ModernityRay

ModernityRay is a single-page private club showcase built to feel premium,
editorial, and kinetic. The experience combines a React homepage with generated
HTML subpages that all share the same real navbar, social dock, and commerce
behavior through an embed bundle.

## What It Includes

- A fixed, animated navigation system with desktop mega menus and a mobile drawer that stays consistent across the homepage and generated pages.
- A cinematic hero section with large type, motion-led reveals, and a clear entry point into the membership journey.
- Long-scroll storytelling sections for tailored training, events, wellness, testimonials, and club principles.
- A layered depth/parallax treatment where section blocks subtly react to scroll for a more dimensional feel.
- A lightweight commerce surface with cart button, drawer, and checkout flow mounted globally.
- Static generated subpages under `public/pages/` that still use the same React navigation and cart bridge.
- An image ingest and optimization pipeline so editorial assets can be added in a predictable way.

## Key Sections

- The hero section sets the visual tone with a high-contrast premium treatment and strong call-to-action framing.
- The tailored and endless sections focus on bespoke training and ongoing progression content.
- The gallery and elevate sections showcase environment, amenities, and experience through image-heavy layouts.
- The membership and events sections package offerings and calendar-style moments into actionable blocks.
- The principles and newsletter sections reinforce brand voice and retention touchpoints.
- The marquee and footer close the page with movement and utility links while preserving the same design language.

## Technologies

- React 18
- Vite 5
- Framer Motion
- Sharp (image ingestion and optimization scripts)
- Custom HTML generation scripts for static subpages and shared embed runtime

## Visual Style

The design language leans into modern private-club minimalism with strong
contrast and restrained accents:

- White, bone, and mist surfaces for clean editorial reading space.
- Deep charcoal/coal typography for structure and hierarchy.
- Bright lime and green accents for key actions, badges, and highlights.
- Rounded geometry, soft borders, and subtle shadow depth for premium UI texture.
- Smooth eased motion, staggered reveals, and scroll-reactive transitions to keep the page feeling alive.

## Project Structure

- `src/App.jsx` controls section order, global chrome, and scroll-progress behavior.
- `src/components/sections/` contains the homepage story sections (Hero, Tailored, Events, Membership, and others).
- `src/components/layout/` contains shared navigation, footer, and social dock elements.
- `src/components/commerce/` contains cart button, drawer, checkout, and cart state plumbing.
- `src/data/` stores site copy, menu structure, events, imagery references, and membership content.
- `src/styles/` contains global tokens plus per-section styling partials.
- `public/pages/` stores generated standalone subpages.
- `public/embed/embed.js` and `public/embed/embed.css` provide the shared navbar/cart runtime used by subpages.
- `scripts/build-pages.mjs` generates subpage HTML from structured content.
- `scripts/ingest-images.mjs` and `scripts/optimize-images.mjs` process project photography assets.

## Development

- `npm run dev` starts the local Vite development server.
- `npm run build` builds embed runtime, regenerates pages, then builds the app.
- `npm run build:app` builds only the React application.
- `npm run build:embed` builds the shared embed assets used by generated pages.
- `npm run build:pages` regenerates `public/pages/*.html`.
- `npm run preview` serves the production build locally.
- `npm run images:ingest` ingests assets from `assets/source` into `public/img`.
- `npm run images:optimize` recompresses existing images in `public/img`.

## Live Site

`https://<your-github-username>.github.io/ModernityRay/`
