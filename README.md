# The First Cat — $PROAILURUS

Static site for the Solana memecoin **The First Cat** (`$PROAILURUS`), styled after a
19th-century naturalist's monograph to match the engraved logo plate.

No build step, no dependencies. Three files do the work:

| File | Purpose |
| --- | --- |
| `index.html` | All markup, plus the inline SVG ornament / icon definitions |
| `styles.css` | The whole design system (aged-paper layers, engraved rules, plates) |
| `main.js` | Copy-to-clipboard, scroll reveals, scroll-spy nav, mobile menu, hero parallax |

Images: `firstcatlogo.png` (original), `seal.jpg` (compressed hero copy),
`favicon-32.png` / `favicon-180.png` (cropped from the logo), `og-image.jpg` (1200×630 social card).

## Before launch — three things to swap

1. **Contract address.** It appears in two places in `index.html`, each time as both a
   `data-copy` attribute and the visible `<code>` text. Search for `xxxxxxxxxxxx` and
   replace all four occurrences with the real mint address.

2. **Socials.** Search `index.html` for `x.com/proailurus` and `t.me/proailurus`
   (three occurrences each: masthead, hero, footer) and point them at the real accounts.

3. **Tokenomics.** The figures in the "Register of the Specimen" table under Plate VI —
   supply, tax, liquidity, mint authority — are placeholders. Edit the `<table class="ledger__table">`.

## Deploying to Vercel

Import the repo at [vercel.com/new](https://vercel.com/new). Vercel detects a static site;
leave the framework preset as **Other**, build command empty, output directory empty.
`vercel.json` only sets cache headers and clean URLs.

## Sources

The palaeontology on the page is drawn from, and linked to, these:

- [Evolution of the Cats — IUCN SSC Cat Specialist Group](https://www.catsg.org/evolution)
- [The Making of a Cat — Nature / PBS](https://www.pbs.org/wnet/nature/blog/the-making-of-a-cat/)
- [The Domesticated Cat — Tiny Matters / American Chemical Society](https://www.acs.org/pressroom/tiny-matters/the-domesticated-cat.html)
- [Prehistoric Cats — BBC Discover Wildlife](https://www.discoverwildlife.com/animal-facts/mammals/prehistoric-cats)
- [Proailurus — Wikipedia](https://en.wikipedia.org/wiki/Proailurus)
