# CourtSy (ModernityRay)

Semestrální práce pro předmět **KTWA2**.

## O projektu

CourtSy je webová prezentace a objednávkový systém fiktivního soukromého
sportovního klubu. Klub nabízí tenisové kurty, golfové hřiště, posilovnu
s regeneračním centrem a krytý bazén.

Návštěvník si na webu může:

* porovnat pět úrovní členství od jednodenní vstupenky po firemní tarif
  a prohlédnout si detail každé z nich,
* projít areály klubu a rezervovat si konkrétní termín, třeba hodinu na
  centrálním kurtu nebo trénink s koučem,
* prohlédnout kalendář klubových akcí (turnaje, ligy, kliniky, společenské
  večery) a přihlásit se na ně,
* projít objednávkou ve čtyřech krocích s kompletní validací vstupů,
* spravovat svůj profil, nastavení a historii objednávek.

Celá aplikace běží pouze na straně prohlížeče. Žádný backend neexistuje:
obsah je uložený jako datové moduly v `src/data/`, stav aplikace (košík,
profil, objednávky, nastavení) se ukládá do `localStorage`. Platba je
simulovaná, nikam se nic neodesílá.

## Použité technologie

| Technologie | K čemu v projektu slouží |
|---|---|
| **React 18** | Uživatelské rozhraní rozdělené na komponenty. Hook `useSyncExternalStore` napojuje React na stav uložený mimo něj. |
| **Vite 5** | Vývojový server s okamžitým promítnutím změn a nástroj pro sestavení produkční verze včetně dělení kódu. |
| **React Router 6** | Navigace mezi obrazovkami bez znovunačtení stránky, obnova pozice scrollu a chybové hranice. |
| **Framer Motion 11** | Animace a efekty řízené scrollem. Umí respektovat systémové omezení pohybu. |
| **Vitest** | Rychlý spouštěč jednotkových testů, nastavením kompatibilní s Vite. |
| **React Testing Library** | Testování komponent z pohledu uživatele, tedy podle toho, co je vidět na obrazovce. |
| **Playwright** | End to end testy, které ovládají skutečný prohlížeč a projdou aplikaci jako návštěvník. |
| **Sharp** | Zpracování fotografií: zmenšení a převod do formátu WebP. |
| **Lighthouse** | Měření výkonu, přístupnosti a SEO. |

## Živá verze

[denysovski.github.io/ModernityRay](https://denysovski.github.io/ModernityRay/)

![Úvodní stránka aplikace CourtSy](docs/screenshot-home.jpg)

## Spuštění

Slouží ke spuštění aplikace na vlastním počítači, ať už kvůli vývoji,
prohlédnutí kódu nebo spuštění testů. Vyžaduje Node.js 22 nebo novější.

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

Poznámky k testům:

* Chromium je open source prohlížeč, na kterém stojí Chrome i Edge.
  Playwright v něm testy spouští, aby ověřil chování aplikace ve skutečném
  prohlížeči, ne jen v simulovaném prostředí.
* Chromium si Playwright stahuje jednorázově příkazem
  `npx playwright install chromium`.
* `npm run test:e2e` si potřebný build i náhledový server spustí sám,
  takže stačí jeden terminál.

## Další příkazy

```bash
npm run audit             # Lighthouse: měření výkonu a přístupnosti
npm run check:routes      # rychlá kontrola všech rout ve skutečném prohlížeči
npm run docs:pdf          # vygeneruje docs/dokumentace.pdf z docs/dokumentace.md
npm run images:responsive # vygeneruje WebP varianty fotografií
npm run images:optimize   # znovu zkomprimuje fotografie v public/img
npm run images:ingest     # zpracuje nové fotografie ze složky assets/source
```

Poznámky k těmto příkazům:

* `npm run audit` a `npm run check:routes` potřebují běžící server. Audit
  očekává `npm run preview`, kontrola rout `npm run dev`. Jinou adresu lze
  předat jako argument.
* Příkazy začínající `images:` pracují s obrazovou sadou a ke spuštění
  aplikace nejsou potřeba.
* Originály fotografií (složka `assets/source`, zhruba 52 MB) nejsou
  součástí repozitáře. V projektu jsou jen hotové zmenšené soubory
  v `public/img`, které web používá.

## Struktura projektu

```
src/
  main.jsx              vstupní bod, StoreProvider nad RouterProviderem
  App.jsx               tabulka rout, dělení kódu, nastavení routeru
  routes.js             jediné místo s definicí URL cest
  layouts/
    RootLayout.jsx      společný rám všech rout (navbar, košík, patička)
  views/                devět obrazovek, každá vlastní komponenta
  components/
    layout/             navbar, patička, sociální dock, hlavička podstránky
    sections/           sekce domovské stránky
    commerce/           košík a formulářové pole
    ui/                 sdílené prvky (Icon, Img, SmartLink, motion)
  context/
    StoreContext.jsx    React Context nad externím storem
  lib/
    store.js            stav aplikace a localStorage
    validation.js       validace vstupů a sanitizace
    format.js           formátování dat kalendáře
  data/                 obsah webu (ceny, areály, kalendář, navigace)
  styles/               návrhové tokeny a styly po sekcích
tests/
  setup.js              společné prostředí testů
  unit/                 Vitest a React Testing Library
  e2e/                  Playwright
scripts/                zpracování obrázků, audit, kontrola rout, export PDF
docs/                   technická dokumentace a Lighthouse reporty
vite.config.js          build, dělení chunků, generování 404.html
vitest.config.js        unit a komponentové testy
playwright.config.js    e2e testy nad produkčním buildem
```

## Obrazovky (views)

| Cesta | Komponenta | Co dělá |
|---|---|---|
| `/` | `Home` | Úvodní stránka s dlouhým scrollem a postupně odkrývanými sekcemi. |
| `/memberships` | `Memberships` | Přehled pěti úrovní členství, filtrování a řazení. |
| `/memberships/:slug` | `MembershipDetail` | Detail jedné úrovně členství. |
| `/courts` | `Courts` | Přehled areálů s fulltextovým hledáním. |
| `/courts/:slug` | `CourtDetail` | Detail areálu, galerie a rezervovatelné termíny. |
| `/events` | `Events` | Kalendář akcí s filtrem, hledáním a seskupením po měsících. |
| `/events/:slug` | `EventDetail` | Detail jedné akce. |
| `/checkout` | `Checkout` | Čtyřkrokový objednávkový formulář s validací. |
| `/account` | `Account` | Profil, historie objednávek a nastavení. |
| cokoli jiného | `NotFound` | Stránka 404. |

Podrobnosti o architektuře, správě stavu a testování jsou v
[docs/dokumentace.md](docs/dokumentace.md) a ve stejnojmenném PDF.

## Nasazení

Aplikace je publikovaná na GitHub Pages. O nasazení se stará GitHub
Actions: po každém pushi do větve `main` spustí testy, sestaví produkční
build a publikuje ho. Pokud testy neprojdou, nasazení se neprovede.

Aplikace neběží v kořeni domény, ale v podsložce `/ModernityRay/`. Kvůli
tomu jsou potřeba dvě nastavení:

* Při sestavení se nastaví proměnná `BASE_PATH`. Vite ji uloží do
  `import.meta.env.BASE_URL` a router ji použije jako svůj `basename`,
  takže všechny odkazy míří do správné podsložky.
* Build vytvoří soubor `404.html` jako kopii `index.html`. GitHub Pages
  poskytuje pouze statické soubory, takže na adrese `/ModernityRay/events`
  žádný odpovídající soubor nenajde a vrátí `404.html`. Tím se načte
  aplikace, která si adresu zpracuje sama a zobrazí správnou obrazovku.
  Díky tomu mohou být adresy čisté a není nutné routování přes znak `#`.
