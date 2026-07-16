# El Tigre — Venezuela Coffee Beans

A simple, fast, semantic three-page site (Home, Products, Contact) for a Venezuelan coffee
roastery, built as a single-page app: navigation swaps visible content instead of reloading
the page.

## Stack

- Plain HTML5 / SCSS / vanilla JS (ES6 classes, no framework, no Bootstrap)
- [Handlebars](https://handlebarsjs.com/) — used only for the product-card view, loaded from a CDN
- [json-server](https://github.com/typicode/json-server) — serves `src/db/app.json` as a REST API so product data is never hard-coded into the HTML
- Task runner: npm scripts (`sass`, `postcss`/`autoprefixer`, `eslint`, `stylelint`, `browser-sync`)

## Getting started

```bash
npm install
npm run watch
```

`npm run watch` builds the site into `dist/`, starts the json-server API on
`http://localhost:3131`, and serves `dist/` with browser-sync, rebuilding on every change to
`src/`.

## Structure

```
src/
  index.html         # markup for both views (home, contact) + the single Handlebars template
  sass/
    _normalize.scss  # normalize.css v8
    _variables.scss  # the 3-color palette + Source Sans Pro weights from the design cheatsheet
    _layout.scss     # .container (centered max-width) + .page (subpage vertical padding)
    _global.scss     # body defaults, .view (SPA show/hide), shared .btn
    _typography.scss # heading scale, .section-heading, .label-text, .text-quote
    _icons.scss      # self-hosted icon font (see "Icons" below)
    _header.scss, _hero.scss, _products.scss, _about.scss, _contact.scss, _footer.scss
  js/
    settings.js      # API base URL + DOM selectors, imported by script.js
    script.js        # App class (loaded as `type="module"`): initData(), nav, canvas logo, contact form
  db/app.json        # product data served by json-server (title, description, image, roasting, intensity, id)
  vendor/font/       # self-hosted icon webfont (see "Icons" below)
  images/            # design assets
```

## Notes

- Only the product cards are rendered from a template (Handlebars); everything else (hero,
  about, contact form) is static markup in `index.html`, per spec.
- The header logo is a small `<canvas>` animation (a tiger mark over a steaming cup) drawn and
  looped in `script.js` — no extra image asset needed for it.
- Responsive layout is hand-rolled with SCSS flexbox (**no Bootstrap** — grid/flex utilities live
  in `_layout.scss`), collapsing to a hamburger nav under ~900px.
- `.page` and `.view` are deliberately two different classes: `.page` (in `_layout.scss`) is a
  spacing utility (small padding top/bottom) applied to content sections; `.view` (in
  `_global.scss`) is what the JS toggles to show/hide the Home vs. Contact screen. Don't confuse
  the two — they solve different problems.

### Icons

The brief's workflow assumes a Fontello export (`font/` + `fontello.css`) dropped into
`vendor/` and `sass/_icons.scss`. Fontello itself isn't reachable from this environment, so the
*one* icon actually needed (the down-arrow on "Discover") was rebuilt the same way in spirit:
- Sourced from Font Awesome Free's Regular style (`arrow-alt-circle-down`, codepoint `f358`),
  which is the same icon shown in the design cheatsheet.
- **Subset** with `fonttools`/`pyftsubset` down to that single glyph, so `vendor/font/` ships a
  ~370–700 byte font per format instead of the whole icon set (which is exactly what the brief
  warns against: "cała paczka FontAwesome to setki ikon, a my potrzebujemy tylko jednej").
- `.eot`/`.svg` fallback formats were dropped (legacy IE/old iOS only); `woff2`/`woff`/`ttf`
  cover every current browser.
- Usage is identical to a real Fontello output: `<i class="icon-arrow"></i>`.

If you do get real access to fontello.com/Glyphter later, swap the files in `vendor/font/` and
`sass/_icons.scss` 1:1 — nothing else needs to change.
