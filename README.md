# CourtSy — ModernityRay

Frontendová single-page aplikace fiktivního soukromého sportovního klubu.
Semestrální práce pro předmět **KTWA2**.

React 18 + Vite 5 + React Router 6. Backend žádný — všechna data jsou
mockovaná v `src/data/`, veškerý stav aplikace žije v `localStorage`.

**Živá verze:** https://denysovski.github.io/ModernityRay/

![Úvodní stránka aplikace CourtSy](docs/screenshot-home.jpg)

---

## Spuštění

Vyžaduje Node.js 22 nebo novější — testovací prostředí jsdom přes undici
využívá zstd API, které starší Node nemá.

```bash
npm install          # instalace závislostí
npm run dev          # vývojový server na http://localhost:5173
```

Produkční build a jeho lokální náhled:

```bash
npm run build        # výstup do dist/ (včetně 404.html pro GitHub Pages)
npm run preview      # náhled buildu na http://localhost:4173
```

## Testy

```bash
npm test             # 101 unit a komponentových testů (Vitest + Testing Library)
npm run test:watch   # totéž v režimu sledování změn
npm run test:coverage# pokrytí kódu
npm run test:e2e     # 12 end-to-end testů (Playwright, Chromium)
npm run test:all     # obojí za sebou
```

`npm run test:e2e` si produkční build i náhledový server spustí sám, takže
nepotřebuje druhý terminál. Před prvním během je potřeba stáhnout prohlížeč:

```bash
npx playwright install chromium
```

## Další příkazy

```bash
npm run audit             # Lighthouse nad běžícím náhledem (--save uloží reporty do docs/)
npm run check:routes      # rychlá kontrola všech rout v reálném prohlížeči
npm run docs:pdf          # vygeneruje docs/dokumentace.pdf z docs/dokumentace.md
npm run images:responsive # vygeneruje WebP varianty fotografií + manifest
npm run images:optimize   # znovu zkomprimuje zdrojové JPEG v public/img
npm run images:ingest     # zpracuje nové fotografie z assets/source (viz níže)
```

Originály fotografií (`assets/source/`, ~52 MB) nejsou verzované — v repu
jsou jen zpracované soubory v `public/img`, které web skutečně servíruje.
`images:ingest` a `images:optimize` jsou tedy nástroje pro úpravu obrazové
sady, ne krok potřebný ke spuštění aplikace.

`npm run audit` a `npm run check:routes` potřebují běžící server
(`npm run preview`, resp. `npm run dev`) a očekávají ho na výchozím portu;
jiný lze předat argumentem.

---

## Struktura projektu

```
src/
  main.jsx              vstupní bod — StoreProvider nad RouterProviderem
  App.jsx               tabulka rout, dělení kódu, nastavení routeru
  routes.js             jediné místo s definicí URL cest
  layouts/
    RootLayout.jsx      společný rám všech rout (navbar, košík, patička)
  views/                devět obrazovek, každá vlastní komponenta
  components/
    layout/             navbar, patička, sociální dock, hlavička podstránky
    sections/           vyprávěcí sekce domovské stránky
    commerce/           košík, formulářové pole
    ui/                 sdílené primitivy (Icon, Img, SmartLink, motion)
  context/
    StoreContext.jsx    React Context nad externím storem
  lib/
    store.js            stav aplikace + localStorage
    validation.js       validace vstupů a sanitizace
    format.js           formátování dat kalendáře
  data/                 veškerý obsah webu (ceny, kurty, kalendář, navigace)
  styles/               návrhové tokeny a styly po sekcích
tests/
  setup.js              společné prostředí testů (jsdom, úklid localStorage)
  unit/                 Vitest + React Testing Library
  e2e/                  Playwright
scripts/                generování obrázků, audit, kontrola rout, export PDF
docs/                   technická dokumentace a Lighthouse reporty
vite.config.js          build, dělení chunků, generování 404.html
vitest.config.js        unit a komponentové testy
playwright.config.js    e2e testy nad produkčním buildem
```

## Obrazovky (views)

| Cesta | Komponenta | Co dělá |
|---|---|---|
| `/` | `Home` | úvodní stránka, dlouhý scroll s vyprávěcími sekcemi |
| `/memberships` | `Memberships` | přehled pěti úrovní členství, filtrování a řazení |
| `/memberships/:slug` | `MembershipDetail` | detail jedné úrovně |
| `/courts` | `Courts` | přehled areálů s fulltextovým hledáním |
| `/courts/:slug` | `CourtDetail` | detail areálu, galerie, rezervovatelné termíny |
| `/events` | `Events` | kalendář akcí — filtr, hledání, seskupení po měsících |
| `/events/:slug` | `EventDetail` | detail akce |
| `/checkout` | `Checkout` | čtyřkrokový objednávkový formulář s validací |
| `/account` | `Account` | profil, historie objednávek, nastavení |
| cokoli jiného | `NotFound` | stránka 404 |

## Použité technologie

- **React 18** — komponentová architektura, `useSyncExternalStore`
- **Vite 5** — vývojový server a build, dělení kódu
- **React Router 6** (data router) — routování, `ScrollRestoration`, chybové hranice
- **Framer Motion 11** — animace, `MotionConfig` pro omezení pohybu
- **Vitest + React Testing Library** — unit a komponentové testy
- **Playwright** — end-to-end testy
- **Sharp** — generování responzivních WebP variant
- **Lighthouse** — měření výkonu a přístupnosti

Podrobnosti o architektuře, správě stavu a testování jsou v
[docs/dokumentace.md](docs/dokumentace.md) (a ve stejnojmenném PDF).

## Poznámky k nasazení

Aplikace běží na GitHub Pages pod podcestou `/ModernityRay/`. Dvě věci to
zajišťují:

1. `BASE_PATH=/ModernityRay/` při buildu v GitHub Actions; Vite tuto hodnotu
   dá do `import.meta.env.BASE_URL` a router ji použije jako `basename`.
2. Build vytvoří `dist/404.html` jako kopii `index.html`. GitHub Pages servíruje
   statické soubory, takže požadavek na `/ModernityRay/events` by jinak skončil
   chybou 404 — tímto se místo toho načte aplikace, která si cestu odrouteje
   sama. Díky tomu mohou být adresy čisté a není potřeba hash routing.
