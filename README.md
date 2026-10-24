# CourtSy (ModernityRay)

Semestrální práce pro předmět **KTWA2** · Daniel Svoboda

**Dokumentace:**
[Semestrální práce – plná verze (PDF)](docs/KTWA2%20-%20Semestr%C3%A1ln%C3%AD%20pr%C3%A1ce%20Daniel%20Svoboda.pdf) ·
[Technická dokumentace, 2 stránky (PDF)](docs/KTWA2,%20Svoboda%20Daniel%20-%20Technick%C3%A1%20dokumentace%20%282%20str%C3%A1nky%29.pdf)

## O projektu

CourtSy je webová prezentace a objednávkový systém fiktivního soukromého
sportovního klubu. Klub nabízí tenisové kurty, golfové hřiště, posilovnu
s regeneračním centrem a krytý bazén.

Návštěvník si na webu může:

* porovnat pět úrovní členství od jednodenní vstupenky po firemní tarif
  a prohlédnout si detail každé z nich,
* projít areály klubu a rezervovat si konkrétní termín, třeba hodinu na
  centrálním kurtu nebo trénink s koučem,
* projít devět tréninkových programů od tenisové přípravy po plavání,
  každý s vlastní stránkou, rozpisem bloku a trenéry, kteří ho vedou,
* prohlédnout kalendář klubových akcí (turnaje, ligy, kliniky, společenské
  večery) a přihlásit se na ně,
* nakoupit v klubovém e-shopu vybavení a doplňky značky CourtSy,
* podívat se do klubové restaurace: tři sály, otevírací doba a menu,
* zapsat se na prohlídku klubu, zažádat o studentskou slevu nebo koupit
  dárkový poukaz,
* projít objednávkou ve čtyřech krocích s kompletní validací vstupů,
* spravovat svůj profil, nastavení a historii objednávek, případně svůj
  účet celý smazat.

Celá aplikace běží pouze na straně prohlížeče. Žádný backend neexistuje:
obsah je uložený jako datové moduly v `src/data/`, stav aplikace (košík,
profil, objednávky, nastavení) se ukládá do `localStorage`. Platba je
simulovaná, nikam se nic neodesílá.

## Živá verze

[denysovski.github.io/ModernityRay](https://denysovski.github.io/ModernityRay/)

![Úvodní stránka aplikace CourtSy](docs/screenshot-home.jpg)

## Použité technologie

| Technologie | K čemu v projektu slouží |
|---|---|
| **React 18** | Uživatelské rozhraní rozdělené na komponenty. Hook `useSyncExternalStore` napojuje React na stav uložený mimo něj. |
| **Vite 5** | Vývojový server s okamžitým promítnutím změn a nástroj pro sestavení produkční verze včetně dělení kódu. |
| **React Router 6** | Navigace mezi obrazovkami bez znovunačtení stránky, obnova pozice scrollu a chybové hranice. |
| **Framer Motion 11** | Animace a efekty řízené scrollem. Umí respektovat systémové omezení pohybu. |
| **Vitest** | Spouštěč jednotkových a komponentových testů. |
| **React Testing Library** | Testování komponent z pohledu uživatele, tedy podle toho, co je vidět na obrazovce. |
| **Playwright** | End-to-end testy, které ovládají skutečný prohlížeč a projdou aplikaci jako návštěvník. |
| **Sharp** | Zpracování fotografií: zmenšení a převod do formátu WebP. |
| **Lighthouse** | Měření výkonu, přístupnosti, osvědčených postupů a SEO. |

## Spuštění

Postup ve **Visual Studio Code**. Stačí udělat jednou, při dalším spuštění
už jen krok 5.

1. **Nainstalujte Node.js 22 nebo novější** z [nodejs.org](https://nodejs.org/)
   (verze LTS). Instalace přidá i nástroj `npm`.
2. **Stáhněte projekt.** Buď na GitHubu *Code → Download ZIP* a rozbalte,
   nebo v terminálu:
   ```bash
   git clone https://github.com/denysovski/ModernityRay.git
   ```
3. **Otevřete složku ve VS Code:** *File → Open Folder…* a vyberte složku
   `ModernityRay`.
4. **Otevřete terminál** (*Terminal → New Terminal*, nebo `Ctrl` + `` ` ``)
   a nainstalujte závislosti. Trvá to zhruba minutu a vytvoří se složka
   `node_modules`:
   ```bash
   npm install
   ```
   Pro kontrolu verze Node.js můžete napsat `node -v` (má vypsat `v22…`
   nebo vyšší).
5. **Spusťte aplikaci:**
   ```bash
   npm run dev
   ```
   V terminálu se objeví adresa `http://localhost:5173`. Otevřete ji
   v prohlížeči (nebo na ni klikněte se stisknutým `Ctrl`). Změny v kódu
   se projeví okamžitě.
6. **Ukončení:** v terminálu stiskněte `Ctrl` + `C`.

Volitelně si můžete vyzkoušet i produkční verzi, tedy přesně to, co běží
na GitHub Pages:

```bash
npm run build      # sestaví aplikaci do složky dist/
npm run preview    # spustí ji na http://localhost:4173
```

## Testy

Všechny příkazy se píší do terminálu ve VS Code ve složce projektu
(po kroku 4 ze Spuštění). Testy nepotřebují běžící aplikaci.

Projekt má dva druhy testů:

* **Unit a komponentové testy** – unit (jednotkový) test ověřuje jednu
  funkci samostatně, například že validace odmítne neplatný e-mail.
  Komponentový test vykreslí jednu komponentu (třeba formulář pokladny)
  a ovládá ji jako uživatel, ale bez skutečného prohlížeče.
* **End-to-end (e2e) testy** – projdou celou aplikaci od začátku do konce
  tak, jak by ji používal návštěvník: otevřou stránku, klikají, vyplňují
  formuláře a kontrolují výsledek. Ověřují tak, že spolu správně fungují
  všechny části najednou.

**Krok 1 – jednotkové a komponentové testy (Vitest).**

```bash
npm test
```

Spustí 102 testů ze složky `tests/unit/` a vypíše výsledek, např.
`Tests 102 passed`.

**Krok 2 – end-to-end testy (Playwright).** Chromium je open source
prohlížeč, na kterém stojí Google Chrome i Microsoft Edge. Playwright v něm
e2e testy spouští, aby aplikaci ověřil ve skutečném prohlížeči. Poprvé je
potřeba ho stáhnout (jen jednou):

```bash
npx playwright install chromium
```

Potom samotné testy:

```bash
npm run test:e2e
```

Spustí 43 testů ze složky `tests/e2e/`. Příkaz si sám sestaví aplikaci,
spustí ji a projde ji ve skutečném prohlížeči. Trvá zhruba 1–2 minuty
a na konci vypíše `43 passed`.

**Další testovací příkazy:**

| Příkaz | Co dělá |
|---|---|
| `npm test` | jednorázově spustí 102 unit a komponentových testů |
| `npm run test:watch` | totéž, ale hlídá změny a testy spouští znovu po každém uložení souboru (ukončení klávesou `q`) |
| `npm run test:coverage` | spustí unit testy a změří pokrytí kódu; tabulku vypíše do terminálu, podrobný report uloží do `coverage/index.html` |
| `npm run test:e2e` | spustí 43 end-to-end testů v prohlížeči Chromium |
| `npm run test:all` | spustí oboje za sebou (unit i e2e) |

**Měření výkonu (Lighthouse)** – volitelné, potřebuje dva terminály:

1. v prvním terminálu sestavte a spusťte produkční verzi:
   ```bash
   npm run build
   npm run preview
   ```
2. otevřete druhý terminál (ikona **+** v panelu terminálu) a spusťte:
   ```bash
   npm run audit
   ```

Vypíše skóre výkonu, přístupnosti, Best Practices a SEO pro tři stránky
(úvodní, přehled členství, detail kurtu). S parametrem
`npm run audit -- --save` uloží HTML reporty do `docs/lighthouse/`.

## Další příkazy

Ke spuštění aplikace ani testů nejsou potřeba. Jde jen o doplňkové
informace pro případ, že by se hodily.

```bash
npm run check:routes      # rychlá kontrola všech stránek ve skutečném prohlížeči (potřebuje běžící npm run dev)
npm run images:responsive # vygeneruje WebP varianty fotografií
npm run images:optimize   # znovu zkomprimuje fotografie v public/img
npm run images:ingest     # zpracuje nové fotografie ze složky assets/source
```

Příkazy `images:` pracují s originály fotografií, které v repozitáři nejsou
(web používá jen hotové zmenšené soubory v `public/img`).

## Požadavky

Jak projekt splňuje jednotlivé body zadání a kde to lze ověřit.

### Data a jejich simulace

| Možnost ze zadání | Použito | Jak a kde |
|---|---|---|
| Mockovaná data (JSON server, MockAPI, lokální data) | Ano (lokální data) | Veškerý obsah webu (členství, areály, programy, akce, e-shop, restaurace, právní texty) je v JavaScriptových modulech ve složce [`src/data/`](src/data/), např. [`membership.js`](src/data/membership.js), [`courts.js`](src/data/courts.js), [`events.js`](src/data/events.js), [`shop.js`](src/data/shop.js). JSON server ani MockAPI se nepoužívají. |
| Client-side úložiště – LocalStorage | Ano | Košík, profil, objednávky a nastavení ukládá [`src/lib/store.js`](src/lib/store.js) pod klíči `courtsy.*`. Zápisy na prohlídku ukládá [`src/views/PrivateTour.jsx`](src/views/PrivateTour.jsx) (`courtsy.tours`). |
| Client-side úložiště – SessionStorage | Ano | Příznak, že návštěvník už viděl úvodní animaci ([`src/components/layout/Intro.jsx`](src/components/layout/Intro.jsx), klíč `courtsy.intro.seen`). |
| Client-side úložiště – IndexedDB | Ne | Nepoužívá se, objem dat je malý. |
| Jiná simulace | Ano (simulovaná platba a účet) | Objednávka se „zaplatí“ jen uložením do `localStorage`, přihlášení je jen jméno a e-mail v prohlížeči. Nic se neodesílá. |

**Jak ověřit:** v prohlížeči otevřete DevTools (`F12`) → záložka
*Application* → *Local Storage* / *Session Storage*. Po přidání položky do
košíku nebo dokončení objednávky se tam objeví klíče `courtsy.*`.

### Technické požadavky

| Požadavek | Co je použito | Kde to najít / jak ověřit |
|---|---|---|
| SPA s komponentovým přístupem | React 18, každá obrazovka i prvek rozhraní je komponenta | [`src/views/`](src/views/), [`src/components/`](src/components/), [`src/layouts/`](src/layouts/) |
| Routování | React Router 6 (data router), obrazovky se načítají až při otevření | [`src/App.jsx`](src/App.jsx) (tabulka všech cest), [`src/routes.js`](src/routes.js). Při klikání se mění adresa, ale stránka se znovu nenačítá; hlídá to test v [`tests/e2e/navigation.spec.js`](tests/e2e/navigation.spec.js). |
| Správa stavu | vlastní řešení: React Context nad externím storem (`useSyncExternalStore`), dočasný stav v `useState` | [`src/lib/store.js`](src/lib/store.js), [`src/context/StoreContext.jsx`](src/context/StoreContext.jsx); viz [Správa stavu a dat](#správa-stavu-a-dat) |
| Práce s daty na straně klienta | lokální data + LocalStorage + SessionStorage | viz [Data a jejich simulace](#data-a-jejich-simulace) |
| Zabezpečení a validace vstupů | čisté validační funkce, sanitizace před uložením, heslo ani číslo karty se neukládají, žádné `dangerouslySetInnerHTML` | [`src/lib/validation.js`](src/lib/validation.js), [`src/components/commerce/Field.jsx`](src/components/commerce/Field.jsx). Ověření: na stránce `/checkout` zadejte neplatný e-mail nebo číslo karty. Testy: [`tests/unit/validation.test.js`](tests/unit/validation.test.js). |
| Minimálně 5 zobrazení | 21 adres, 19 komponent obrazovek (přehled, detail, formulář, profil, nastavení…) | [`src/views/`](src/views/), přehled v sekci [Obrazovky](#obrazovky-views) |

### Logika a práce s daty

| Požadavek | Co je použito | Kde to najít |
|---|---|---|
| Správa a přenos dat | Obsah se z `src/data/` importuje do obrazovek. Uživatelská data tečou přes hook `useStore()`: např. pokladna zavolá `placeOrder()`, store objednávku uloží do `localStorage` a stránka účtu ji hned zobrazí. | [`src/lib/store.js`](src/lib/store.js), [`src/views/Checkout.jsx`](src/views/Checkout.jsx), [`src/views/Account.jsx`](src/views/Account.jsx) |
| TypeScript (doporučeno) | Ne. Datové struktury a funkce jsou místo toho popsané typovými komentáři JSDoc. | např. [`src/data/courts.js`](src/data/courts.js), [`src/lib/validation.js`](src/lib/validation.js) |
| Validace dat na straně klienta | e-mail, jméno, heslo, telefon, adresa, PSČ podle země, platební karta (Luhnův algoritmus, platnost, CVC); data načtená z úložiště se také znovu validují | [`src/lib/validation.js`](src/lib/validation.js), [`src/lib/store.js`](src/lib/store.js) |
| Práce se stavem aplikace | trvalý stav ve storu, dočasný v komponentách | viz [Správa stavu a dat](#správa-stavu-a-dat) |

### Testování a výkon

| Požadavek | Co je použito | Kde to najít / jak spustit |
|---|---|---|
| Jednotkové testy | Vitest (87 testů) | [`tests/unit/`](tests/unit/) – `validation`, `store`, `format`; spuštění `npm test` |
| Komponentové testy | Vitest + React Testing Library (15 testů) | [`tests/unit/Checkout.test.jsx`](tests/unit/Checkout.test.jsx), [`tests/unit/Field.test.jsx`](tests/unit/Field.test.jsx); spuštění `npm test` |
| E2E testy | Playwright, prohlížeč Chromium (43 testů) | [`tests/e2e/`](tests/e2e/); spuštění `npm run test:e2e` |
| Profilování a optimalizace | Lighthouse nad produkčním buildem v emulaci mobilu | skript [`scripts/lighthouse.mjs`](scripts/lighthouse.mjs), reporty v [`docs/lighthouse/`](docs/lighthouse/); spuštění viz [Testy](#testy) |

Výsledky Lighthouse před optimalizací a po ní:

| Stránka | Výkon | Přístupnost | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 70 → **88** | 90 → **100** | **100** | **100** |
| `/memberships` | 68 → **92** | 94 → **100** | **100** | **100** |
| `/courts/centre-court` | 57 → **89** | 96 → **100** | **100** | **100** |

Hlavní optimalizace: dělení kódu podle stránek (`lazy`), fotografie ve
formátu WebP v několika velikostech, písmo přímo v buildu místo Google
Fonts a opravy přístupnosti (kontrast, pořadí nadpisů, velikost ovládacích
prvků).

## Technická dokumentace (stručně)

Celá verze je v [PDF na 2 stránky](docs/KTWA2,%20Svoboda%20Daniel%20-%20Technick%C3%A1%20dokumentace%20%282%20str%C3%A1nky%29.pdf).

### Framework a struktura projektu

React 18 + Vite 5, routování React Router 6. Přehled technologií je
v sekci [Použité technologie](#použité-technologie), rozložení složek
v [Struktura projektu](#struktura-projektu).

### Architektura komponent

Aplikace má čtyři vrstvy, kde každá vykresluje tu následující:

1. **Vstup a routování** – [`main.jsx`](src/main.jsx) spustí aplikaci a obalí
   ji stavem a routerem, [`App.jsx`](src/App.jsx) obsahuje tabulku adres.
2. **Rám aplikace** – [`RootLayout`](src/layouts/RootLayout.jsx) drží
   navigaci, košík a patičku; při navigaci se nemění, proto košík přežije
   přechod mezi stránkami.
3. **Obrazovky** – [`src/views/`](src/views/), vždy jedna podle adresy.
4. **Sdílené komponenty** – `Field`, `SmartLink`, `Img`, `SelectMenu`,
   `ConfirmDialog` a další v [`src/components/`](src/components/).

### Správa stavu a dat

| Stav | Kde je | Kam se ukládá | Po obnovení stránky |
|---|---|---|---|
| košík, profil, objednávky, nastavení | [`src/lib/store.js`](src/lib/store.js) | `localStorage` | zůstane |
| otevřený / zavřený košík | [`src/context/StoreContext.jsx`](src/context/StoreContext.jsx) | paměť (`useState`) | zmizí |
| krok a hodnoty pokladny | [`src/views/Checkout.jsx`](src/views/Checkout.jsx) | paměť (`useState`) | zmizí |
| filtry, řazení, hledání | jednotlivé obrazovky | paměť (`useState`) | zmizí |
| zápisy na prohlídku | [`src/views/PrivateTour.jsx`](src/views/PrivateTour.jsx) | `localStorage` | zůstane |
| zhlédnutá úvodní animace | [`src/components/layout/Intro.jsx`](src/components/layout/Intro.jsx) | `sessionStorage` | do zavření karty |
| obsah webu | [`src/data/`](src/data/) | soubory projektu | neměnný |

Komponenty čtou trvalý stav přes jediný hook `useStore()`. Redux není
použit, protože stav tvoří jen košík, profil a tři přepínače bez
asynchronních operací.

### Použité nástroje a metody testování

Vitest (jednotkové testy logiky), React Testing Library (komponenty
z pohledu uživatele), Playwright (e2e testy v prohlížeči proti produkčnímu
buildu) a Lighthouse (výkon). Podrobně v sekcích [Testy](#testy)
a [Testování a výkon](#testování-a-výkon).

## Struktura projektu

```
src/
  main.jsx              vstupní bod, StoreProvider nad RouterProviderem
  App.jsx               tabulka rout, dělení kódu, nastavení routeru
  routes.js             jediné místo s definicí URL cest
  layouts/
    RootLayout.jsx      společný rám všech rout (navbar, košík, patička)
  views/                obrazovky aplikace, každá vlastní komponenta
  components/
    layout/             navbar, patička, sociální dock, hlavička podstránky
    sections/           sekce domovské stránky
    commerce/           košík a formulářové pole
    ui/                 sdílené prvky (Icon, Img, SmartLink, motion,
                        SelectMenu, ConfirmDialog, CoachSocials)
  context/
    StoreContext.jsx    React Context nad externím storem
  lib/
    store.js            stav aplikace a localStorage
    validation.js       validace vstupů a sanitizace
    format.js           formátování dat kalendáře
    seo.js              titulek, popis, kanonická adresa a Open Graph
  data/                 obsah webu (ceny, areály, programy, kalendář,
                        e-shop, restaurace, navigace, právní stránky)
  styles/               návrhové tokeny a styly po sekcích
tests/
  setup.js              společné prostředí testů
  unit/                 Vitest a React Testing Library
  e2e/                  Playwright
scripts/                zpracování obrázků, audit, kontrola rout
docs/                   dokumentace (PDF, DOCX) a Lighthouse reporty
vite.config.js          build, dělení chunků, 404.html a sitemap.xml
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
| `/programmes` | `Programmes` | Přehled tréninkových programů a časová osa trenérů. |
| `/programmes/:slug` | `ProgrammeDetail` | Detail programu: rozpis bloku, fakta, trenéři. |
| `/events` | `Events` | Kalendář akcí s filtrem, hledáním a seskupením po měsících. |
| `/events/:slug` | `EventDetail` | Detail jedné akce. |
| `/shop` | `Shop` | Klubový e-shop, filtrování podle kategorie. |
| `/dining` | `Dining` | Klubová restaurace: tři sály a menu. |
| `/join` | `Join` | Co členství obnáší, než dojde na ceník. |
| `/private-tour` | `PrivateTour` | Zápis na prohlídku klubu. |
| `/students` | `Students` | Studentská sleva. |
| `/gift` | `Gift` | Dárkové poukazy. |
| `/checkout` | `Checkout` | Čtyřkrokový objednávkový formulář s validací. |
| `/account` | `Account` | Profil, historie objednávek, nastavení a smazání účtu. |
| `/terms`, `/privacy`, `/cookies` | `Legal` | Podmínky, soukromí a cookies — jedna komponenta nad třemi texty. |
| cokoli jiného | `NotFound` | Stránka 404. |

## SEO

Každá stránka má vlastní titulek, popis, kanonickou adresu a náhled pro
sdílení. Nastavuje je hook `useSeo()` ([`src/lib/seo.js`](src/lib/seo.js)).
Pokladna, účet a stránka 404 mají `noindex` a mapa webu se generuje při
buildu.

Jak se to ověřilo:

* **Lighthouse** – příkaz `npm run audit` změří úvodní stránku, přehled
  členství a detail kurtu. Kategorie SEO i přístupnost vyšly na všech třech
  na **100** (výsledky v [`docs/lighthouse/`](docs/lighthouse/)).
* **Testy** – čtyři testy v [`tests/e2e/seo.spec.js`](tests/e2e/seo.spec.js)
  projdou všechny stránky a kontrolují, že žádná metadata nechybí ani se
  neopakují.

## Nasazení

Po každém pushi do větve `main` spustí GitHub Actions testy, sestaví build
a publikuje ho na GitHub Pages (při neúspěšném testu se nenasadí). Aplikace
běží v podsložce `/ModernityRay/`, proto build nastavuje `BASE_PATH`
a vytváří `404.html`, díky kterému fungují i přímé odkazy na podstránky.

## Navigace

**Dokumentace**

* [Semestrální práce – plná verze (PDF)](docs/KTWA2%20-%20Semestr%C3%A1ln%C3%AD%20pr%C3%A1ce%20Daniel%20Svoboda.pdf) · [DOCX](docs/KTWA2%20-%20Semestr%C3%A1ln%C3%AD%20pr%C3%A1ce%20Daniel%20Svoboda.docx)
* [Technická dokumentace, 2 stránky (PDF)](docs/KTWA2,%20Svoboda%20Daniel%20-%20Technick%C3%A1%20dokumentace%20%282%20str%C3%A1nky%29.pdf) · [DOCX](docs/KTWA2,%20Svoboda%20Daniel%20-%20Technick%C3%A1%20dokumentace%20%282%20str%C3%A1nky%29.docx)
* [Požadavky – jak projekt splňuje zadání](#požadavky)
* [Technická dokumentace (stručně)](#technická-dokumentace-stručně)

**Testy a měření**

* [Jak spustit testy](#testy)
* [Jednotkové a komponentové testy – `tests/unit/`](tests/unit/)
* [End-to-end testy – `tests/e2e/`](tests/e2e/)
* [Lighthouse reporty – `docs/lighthouse/`](docs/lighthouse/) ([souhrn](docs/lighthouse/summary.json))
* [Skript pro měření Lighthouse – `scripts/lighthouse.mjs`](scripts/lighthouse.mjs)
