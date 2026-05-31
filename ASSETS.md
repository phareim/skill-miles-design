# Miles assets — catalog

> A filename → meaning → "when to use" index for the bundled assets. The brand
> rule is **use the supplied art; don't invent or AI-generate replacements** —
> so this catalog exists to help you pick the *right* existing asset.
> Companion to `BRAND.md` §2 (illustration style), §3 (iconography), §4 (logo).
> Style is uniform across the set: burgundy `#450d21` ink, cream/white fills,
> Miles-rød `#ff303b` accent word, soft cream-deep ellipse "ground" (no cast
> shadow), float on cream or inside a cream blob.

---

## Hand-drawn brand icons (`assets/icons/`, 30 × `.svg`)

Editorial / narrative marks — burgundy line-art with red accents. **Not UI
affordances** (except `hamburger-menu`). Don't recolour; the palette is baked in.
Use inline at 32–96px.

| File | Norwegian | Gloss / use |
|---|---|---|
| `alfakroll.svg` | alfakrøll | the "@" sign — email, handles, contact |
| `bruker.svg` | bruker | a single user / person |
| `brukere.svg` | brukere | multiple users / a group |
| `brukermappe.svg` | brukermappe | user folder / user files |
| `brukerprofil.svg` | brukerprofil | a user profile |
| `brukerprofil-notifikasjon.svg` | brukerprofil + varsel | user profile with a notification dot |
| `brukerreise.svg` | brukerreise | user journey / experience flow |
| `brukerundersokelse.svg` | brukerundersøkelse | user survey / research |
| `brus-pils.svg` | brus & pils | soda + beer — social / Friday / celebration |
| `dele.svg` | dele | share |
| `delete-hoyre.svg` | delete høyre | delete / dismiss (right-facing) |
| `delete-venstre.svg` | delete venstre | delete / dismiss (left-facing) |
| `desktop.svg` | desktop | a desktop screen / workstation |
| `desktop-koding.svg` | desktop koding | a screen showing code — developer / build |
| `digitalt-mote.svg` | digitalt møte | a digital / video meeting |
| `faglig-autoritet.svg` | faglig autoritet | the brand-stance mark ("professional authority") |
| `feiring.svg` | feiring | celebration |
| `fjell.svg` | fjell | mountain — ambition, the long view |
| `forsteplass.svg` | førsteplass | first place / podium / winning |
| `gjenbruk.svg` | gjenbruk | reuse / recycle / sustainability |
| `graf-linje-ned.svg` | graf linje ned | line graph trending **down** |
| `graf-linje-opp.svg` | graf linje opp | line graph trending **up** |
| `graf-soyler.svg` | graf søyler | bar chart |
| `hamburger-menu.svg` | meny | **the one functional UI icon** — 3 burgundy lines; nav menu (also decorative top-left chrome) |
| `hilse.svg` | hilse | greeting / a wave |
| `hjerte-fylt.svg` | hjerte fylt | filled heart (burgundy) |
| `hjerte-fylt-miles.svg` | hjerte fylt, Miles | filled heart, Milestone/heart-M variant — "warmth" beats |
| `hjerte-outline-miles.svg` | hjerte omriss, Miles | outline heart, Miles variant |
| `hjerte-outline-rod.svg` | hjerte omriss, rød | outline heart in red |

The four heart variants exist so you can match weight (filled/outline) and
flavour (plain / Miles heart-M) to context; for any "warmth" beat prefer the
`-miles` heart-M over a plain heart.

## Service-area icons (`assets/service-icons/`, 5 × {regular, `-circle`})

See `BRAND.md` §3.2 for the canonical NO/EN names. Use the **`-circle`** variant
on bare cream; the plain variant inside an existing container/grid cell.
`cloud`, `data-and-ai`, `strategic-it`, `transformation-and-people`,
`ux-and-innovation` — each as `*.png` and `*-circle.png`.

## Logos (`assets/logos/`)

See `BRAND.md` §4. `miles-logo-{red,cream,white,burgundy}.png`, `m-icon-1..4.png`
(circular M-marks), `MilestoneBurgundy.png` (the heart-M "Milestone" mark).
Red on cream is default; cream/white on red/burgundy/photos; burgundy on yellow.

---

## Illustrations (`assets/illustrations/`)

Two families. **Named JPG/PNG** are finished single-message pieces; **`group-*`**
are the source scenes (most ship as both `.svg` vector and `.png` raster —
prefer the `.svg` for web; use `.png` where vector isn't supported).

### Finished "people holding a sign" pieces (reusable as-is)

All use the same warm vignette: one-to-three people holding a large speech-bubble
sign with a single red phrase. Great for empty states, onboarding, section
intros, and friendly status moments.

| File | Sign reads | Use for |
|---|---|---|
| `velkommen.jpg` | "Velkommen" | welcome / onboarding (2 people, on cream) |
| `lykke-til.jpg` | "Lykke til videre" | good-luck / sign-off (2 people, on cream) |
| `vi-gleder-oss.jpg` | "Vi gleder oss!" | anticipation / "looking forward to it" (2 people, on cream) |
| `not-ready.jpg` | "Dette området er ikke klart!" | **placeholder / unfinished-area** state (2 people, on cream) |
| `people-hei.png` | "Hei!" | hero greeting (3 people, **transparent bg** — drops onto any cream surface) |

### `group-*` scenes

- **`group-1`…`group-7`** (`.svg` + `.png`, plus `group.svg`) — simple single-figure
  "person holding a sign" vignettes with short red interjections, e.g.
  `group-1` = *"Oisann.."* (oops). Transparent. Use for inline reactions / error
  and empty states. **Preview before placing** — the sign word differs per file.
- **`group-633755`, `-633756`, `-633786`, `-633824`, `-634118`, `-634119`,
  `-634123`, `-634124`** (Figma export IDs) — richer narrative desk scenes inside
  a **cream blob**, often pairing a "confusion" scribble bubble with a red
  confidence line, e.g. `group-633755` = a person at a laptop with a tangled-
  scribble bubble and *"Jeg forstår. Dette kan vi!"* (I understand — we can do
  this!). Treat as **hero imagery**, not icons. **Preview before placing.**

> **Pairing gaps:** `group.svg` has no PNG; `group-633786.png` and `people-hei.png`
> are PNG-only. Don't assume every illustration has both formats.
>
> **Follow-up:** the `group-63xxxx` filenames are raw Figma IDs — renaming them to
> semantic names (e.g. `desk-jeg-forstaar.svg`) would make this set far easier to
> use. Left as-is for now to avoid breaking any external references.
