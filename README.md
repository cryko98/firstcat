# The First Cat — $PROAILURUS

Static site for the Solana memecoin **The First Cat** (`$PROAILURUS`), styled after a
19th-century naturalist's monograph to match the engraved logo plate.

No build step, no dependencies. Three files do the work:

| File | Purpose |
| --- | --- |
| `index.html` | All markup, plus the inline SVG ornament / icon definitions |
| `styles.css` | The whole design system (aged-paper layers, engraved rules, plates) |
| `main.js` | Boot intro, copy-to-clipboard, scroll reveals, scroll-spy nav, mobile menu, hero parallax |

## The boot intro

A terminal-style overlay plays before the page (`<div class="boot">` at the top of the body).
It runs **once per browser session** — the flag lives in `sessionStorage` under
`proailurus-booted`, so a reload inside the same tab goes straight to the site. To watch it
again, open a new tab or run `sessionStorage.clear()` in the console.

It can be dismissed with the **skip intro** button, `Esc`, `Enter` or `Space`, closes itself
after ~2.5 s, and has a 9 s hard failsafe so the page can never stay locked. An inline script
in `<head>` decides before first paint whether to show it, which also means the overlay is
never rendered when scripting is off. Edit the log lines directly in `index.html`.

Images, all derived from `logo.png` (the source medallion, a disc on a white ground):

- `mark.png` — the round mark in the masthead, boot intro and footer. Transparent outside
  the disc, so nothing white can appear inside a `border-radius: 50%` frame.
- `seal.jpg` — hero plate: the same disc on the page's paper tone
- `favicon-32.png` / `favicon-180.png` / `favicon.ico` — favicons are drawn square, so these
  crop *inside* the disc (all brown, no white corners) while still holding the whole head
- `og-image.jpg` — 1200×630 social card

### Regenerating them

The disc is **not** centred in `logo.png` and is not perfectly round: measured centre
539.5 / 541, radii 506 horizontal and 514.5 vertical. Crop to a square smaller than the
larger radius and it visibly shaves the disc — that is easy to miss at favicon size and
obvious in the hero. The derivatives are built from a 1042 px square around that centre,
with `ImageAttributes.SetColorKey` keying 243–255 white to transparent, so the disc survives
whole and the background drops out. Re-measure before re-cropping if the source ever changes.

## Live market panel

The terminal panel at the top of Plate VI pulls price, 24h volume, liquidity and market cap
from the public [DexScreener](https://docs.dexscreener.com/api/reference) API — no key, no
build step. It reads the mint from `data-token` on `<section id="market">`:

- **Placeholder mint** (the `xxxx…` default) → it shows `awaiting`, em-dashes, and a disabled
  chart button. Nothing is requested from the network.
- **Real mint, no pool yet** → `no pool yet`.
- **Real mint with a pool** → fills in, badge turns green, the *Open chart* button points at
  the pair on DexScreener. Refreshes every 45 s, and stops polling while the tab is hidden.
- **API unreachable** → `offline`, last values stay on screen.

When several pools exist it picks the deepest by liquidity. Market cap falls back to FDV if
DexScreener does not report one.

## Before launch — three things to swap

1. **Contract address.** It appears in three places in `index.html`: the hero and Ledger
   copy blocks (each a `data-copy` attribute plus the visible `<code>` text) and the
   `data-token` on the market panel. Search for `xxxxxxxxxxxx` and replace every occurrence
   with the real mint address.

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
