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

Same warm vignette throughout: burgundy ink, cream/white fills, a Miles-rød
accent, soft cream ellipse ground. Most ship as both `.svg` (prefer for web) and
`.png` (raster fallback); a few are single-format (noted below). Names are
semantic — captioned from the actual art.

### "Holding a sign" pieces — a single red phrase on a speech-bubble sign

Great for empty states, onboarding, section intros, and friendly status moments.

| File(s) | Reads / shows | Use for |
|---|---|---|
| `velkommen.jpg` | "Velkommen" | welcome / onboarding (2 people, on cream) |
| `lykke-til.jpg` | "Lykke til videre" | good-luck / sign-off (2 people, on cream) |
| `vi-gleder-oss.jpg` | "Vi gleder oss!" | anticipation / "looking forward to it" (2 people, on cream) |
| `not-ready.jpg` | "Dette området er ikke klart!" | **placeholder / unfinished-area** state (2 people, on cream) |
| `people-hei.png` | "Hei!" | hero greeting (3 people, **transparent** — png only) |
| `oisann.{svg,png}` | "Oisann.." (oops) | inline error / "whoops" reaction (1 person, transparent) |
| `two-people-sign-blank.{svg,png}` | blank sign | **drop-your-own-text template** (2 people, transparent) |
| `two-people-sign-red.svg` | red sign | bold greeting sign (2 people, svg only) |

### Desk / laptop scenes

| File(s) | Shows | Use for |
|---|---|---|
| `person-at-laptop.{svg,png}` | bespectacled person, plain dark laptop | neutral "at work" / focus |
| `person-at-laptop-plant-coffee.{svg,png}` | same + plant + coffee | cosy "deep work" desk |
| `person-at-laptop-red.{svg,png}` | person, red laptop, content | "building / shipping" beat |
| `person-at-laptop-red-coffee.{svg,png}` | red laptop + coffee | relaxed "working away" |
| `desk-jeg-forstaar.{svg,png}` | desk + confusion-scribble bubble → red *"Jeg forstår. Dette kan jeg!"* | problem → confidence (transparent) |
| `desk-jeg-forstaar-blob.{svg,png}` | the above inside a **cream blob**, *"…Dette kan vi!"* (we) | hero version of the same beat |

### Concept scenes (hero imagery — not icons)

| File(s) | Shows | Use for |
|---|---|---|
| `lightbulb-idea.{svg,png}` | person reclining on a glowing lightbulb, checkmark bubble | ideas / insight / "we've got it" |
| `catching-ideas-net.{svg,png}` | person running with a butterfly net chasing clouds (one red) | chasing / catching ideas, ambition |
| `tangled-cables.png` | two faces around a huge tangle of cables & plugs | the messy problem we untangle (png only) |
| `person-laptop-orbit.{svg,png}` | person with red laptop ringed by capability icons (cloud, chip, checklist, user) | "everything we do" / full-stack capability |
| `handshake.{svg,png}` | two people shaking hands | agreement / partnership |
| `handshake-meeting-room.{svg,png}` | handshake in a meeting room (chairs, lamp) | client meeting / hire / close |
| `kitchen-coffee-break.{svg,png}` | two colleagues by an office kitchen counter | culture / lounge / "bli kjent" |

> **Format gaps:** `people-hei.png`, `tangled-cables.png` are PNG-only;
> `two-people-sign-red.svg` is SVG-only. Don't assume every piece has both.
