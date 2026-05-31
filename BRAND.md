# Miles brand system — full reference

> Companion to `SKILL.md`. Read this before producing any Miles-branded UI in a production codebase.
> Sources: *Miles Brand Guide 2025* (PDF, Marketing Dept) + *Miles template 2026.pptx* (official PowerPoint master).

Miles is a Norwegian IT consultancy founded ~2005, **soon to be 300 employees** across **Oslo, Bergen, Trondheim, Stavanger, Ålesund, Haugesund, Innlandet, and Lithuania** (Litauen). Brand positioning: **"the reliable technology partner that challenges"** — value-driven, competent, engaged, inclusive, open, curious, inspiring, responsible.

Brand stance: **"Professional authority and warmth"** (*faglig autoritet og varme*) — corporate credibility without corporate coldness.

---

## 1. Content fundamentals

### Language — bilingual, by audience
Miles operates in Norway and Lithuania, so output is genuinely bilingual. **There is no single default.** Pick by audience:

- **Norwegian (Bokmål)** for internal communication, Norwegian clients, miles.no, recruiting in Norway, SoMe targeting the Nordic market, internal brochures and flyers.
- **English** for cross-team / Lithuania-facing material, international clients, the global brand guide itself, conference content, technical writing.

If you don't know, **ask**. Do not default-translate; the two languages have slightly different voice patterns (Norwegian leans warmer and more colloquial, English leans crisper).

### Voice: *authentic and clear, professional yet friendly*

The brand identity table (from the guide):

| Identity     | How it shows in language                                                                                          |
|--------------|-------------------------------------------------------------------------------------------------------------------|
| Competent    | Clear, solution-oriented, confident, open — never opinionated or dogmatic.                                        |
| Engaged      | Active language with good energy; show emotion and that we care.                                                  |
| Including    | Respect that people are different; treat diversity as a strength.                                                 |
| Open & curious | Encourage open dialogue; learn the how and why; keep evolving.                                                 |
| Inspiring    | Show through words and actions that what we create can genuinely improve people's lives.                          |
| Responsible  | Be an honest, reliable workplace; acknowledge that what we do impacts people and society.                         |

### Real voice patterns (use as templates)

- Hero: *"Vi elsker å løse utfordringer!"* / *"We love solving challenges!"*
- About: *"Vi er et verdidrevet konsulentselskap med lidenskap for teknologi og varme for hverandre."* / *"A value-driven consulting company with a passion for technology and a heart for each other."*
- Welcome page in brand guide: *"Hi, and thank you for caring!"*
- Workshop titles, single warm words: *Velkommen* / *Hei!* / *Lykke til* / *Vi gleder oss* / *We are Miles* / *Thank you so much for your time! :)*
- Closing: *"Takk for tiden din!"* / *"Thank you so much for your time!"*

### Pronouns
- **"Vi"** / **"we"** for Miles. Not "our team," not "the company."
- **"Du / dere"** / **"you"** for clients — informal second person, never the formal *De*.

### Emphasis
- One word per heading rendered in Miles-rød inside an otherwise burgundy Gelica heading. *"Vi **meet** people with professional authority and warmth."* / *"Smart, robust, and lasting solutions are created in **collaboration** with others."*
- Never emphasize more than one word per line. **Never bold inside Gelica** — use colour.

### Casing
**Sentence case everywhere.** Headings, buttons, nav chips, kickers, slide titles. Never Title Case. Never ALL CAPS except for optional tiny sans-serif labels with wide tracking (≤12px, 0.08em letter-spacing). Norwegian capitalization rules apply for Norwegian copy.

### Emoji & symbols — sparing, deliberate
The brand guide itself uses `:)` in body copy and *one* 😊 on a contact page. Brand-aligned use:

- **Text smileys (`:)` `:-)` ❤️)** in friendly contexts — closings, SoMe captions, "thanks" moments. **One per artefact, max.**
- **The heart-M ("Milestone") symbol** for any "warmth" beat; this is a brand mark, not an emoji.
- **Sanctioned unicode hearts (❤️)** on social media when the post is literally about care/love.
- **Forbidden:** emoji chains (`🚀🔥✨`), checkmark/arrow emoji as bullets, animal/food emoji, decorative skin-tone variants, anything cute that isn't on-brand for a consultancy. Illustrations and the hand-drawn icon set carry the warmth — don't outsource it to emoji.

### Don'ts
- **No corporate buzzwords:** *synergy, disruption, next-gen, cutting-edge, unlock, supercharge, leverage*.
- **No exclamation inflation.** One `!` per headline; never `!!` or `!?`.
- **No em-dash-driven sentences.** Short, direct clauses. Em-dashes appear in the brand guide but are used surgically (one per paragraph at most).
- **No fake urgency**, no countdown timers, no "limited spots".
- **No language-policing.** The voice is guidance, not a cage; the brand guide explicitly says *"we're not here to be language police."*

---

## 2. Visual foundations

### Colour system — 60 / 30 / 10

The dominant ratio, in order, is cream → burgundy → Miles-rød.

| Role            | Token         | Hex       | Usage                                                                                       |
|-----------------|---------------|-----------|---------------------------------------------------------------------------------------------|
| Foundation      | `--krem`      | `#fbf0e5` | Canvas. Every slide / page / screen starts cream. Non-negotiable.                           |
| Structure       | `--burgunder` | `#450d21` | Body text, headings, inverse surfaces, line work, stroke colour. **Never `#000`.**         |
| Energy          | `--miles-rod` | `#ff303b` | Logo, kickers, single-word emphasis, CTAs, accent surfaces. ~10% of any composition.        |
| Warm accent    | `--gul`       | `#ffd9a1` | Optimistic accent; can flood a full surface for playful/internal pieces (use sparingly).    |
| Tech / knowledge | `--morkilla`  | `#3d1436` | "Dark purple" — knowledge-base, technical content, deep moods.                              |
| Deeper red      | `--deep-red`  | `#b72318` | Print/duotone alternate red, and the PowerPoint theme's `accent1` + hyperlink colour. Rare on screen in web work — use only when `--miles-rod` is the wrong context. Note: in the `.pptx` theme `#ff303b` is `accent6`, so PowerPoint-generated objects may default to `#b72318`; recolour to Miles-rød for true brand-red moments. |

**Tints** (5-step pink scale + 4-step dark-purple scale) are built into `colors_and_type.css` as `--miles-rod-tint-1..4`, `--burgunder-tint-1..4`, `--morkilla-tint-1..2`.

#### Tech accent — *sanctioned exception*
The official PowerPoint theme ships with `#004047` (dark teal) and `#78e8db` (bright teal) **as the technical/code accent pair.** They are real brand colours, but **strictly contextual**:

- **OK:** code blocks, technical diagrams that need a second hue, the "Sky, teknologi og plattform" service slide, syntax highlighting, dev-tool screenshots.
- **Not OK:** hero blocks, marketing prose, illustrations, anywhere alongside Miles-rød as a peer accent.

Treat teal like a museum exhibit — out for the topic that needs it, then back in the case. If a layout wants teal "for variety", the answer is no; the brand uses warm contrast (cream / burgundy / red), not chromatic contrast.

#### Hard-no palette
**Never** introduce: cyan as a marketing accent, mint, lime, hot pink, magenta, blue (except in client logos already containing it), purple (except `--morkilla` in tech contexts), generic Material-design greys. Neutrals are tints of burgundy.

**Never** `#000` and **never** `#fff` on cream. White is reserved for printable t-shirts / on-red text where cream would muddy.

Full tokens (light + dark) in `colors_and_type.css`. **Always reference custom properties; never hard-code hex in component code.**

### Dark mode
Activate with `data-theme="dark"` on `<html>`:
- `--miles-rod` nudged to `#ff4752` so it pops on near-black.
- Canvas `--bg-1: #1a0810` (Natt), raised `--bg-2: #2a1019` (Dyp Burgunder).
- Text `--fg-1: #ead6c2` (warm cream).
- Teal/dark-teal stay roughly the same — they already work on dark.

Dark mode is an **explicit opt-in** via `data-theme="dark"` on `<html>`. On a system-dark machine with no attribute set, the CSS only matches `color-scheme` (so native controls theme); the brand palette stays light until the host opts in. To auto-follow the OS, set the attribute from `prefers-color-scheme` (recipe in `colors_and_type.css`). **Components must route structural strokes/fills through `--border-strong` / `--surface-strong`, not raw `var(--burgunder)`** — otherwise they invert to light pink in dark mode (since `--burgunder` becomes a foreground colour there).

### Typography
- **Gelica** (serif, proprietary, Monotype) — display, headings, hero, ingress, quotes, callout numbers. Round and friendly.
- **DM Sans** (sans, open source) — body, labels, captions, data, nav, buttons, tables.
- **Manrope** — **PPTX-only fallback** for Gelica. Gelica's EULA does not allow embedding in `.pptx`, so the official Miles 2026 PowerPoint template uses Manrope (Bold/SemiBold) for headings. Manrope is not interchangeable with Gelica on web/print — only swap when the artefact is a `.pptx` that will be opened on un-licensed machines.
- **Modular scale 1.333** (perfect fourth), base 16px.
- **Hero moments** reach 3–5× body size (~50–90px desktop).
- **Weights:** Gelica Regular/Medium dominate; SemiBold/Bold only for rare big-display moments. DM Sans Regular/SemiBold.
- **Line-height:** 1.08 display, 1.15 h3, 1.5–1.55 body.
- **Letter-spacing:** -0.02em to -0.01em on display; zero elsewhere.
- **text-wrap:** `balance` for headings, `pretty` for body.
- **Long Gelica body paragraphs are on-brand** — the brand guide itself sets paragraphs of 4–8 lines in Gelica Regular at ~28px on cream. Do not be afraid of large serif body copy in editorial / about-page contexts.

### Backgrounds & surfaces
- **Solid cream is the default**, full stop. The brand guide is ~95% solid `#fbf0e5`.
- **Red split panels** (one half full Miles-rød with cream text, other half cream with burgundy text) for high-contrast comparison slides.
- **Burgundy floods** for chapter dividers, closing slides, and the dark variant of a cover.
- **Yellow floods** are allowed for warm/internal pieces (e.g. summer-party flyer) — restrain to one such surface per artefact.
- **Cream blob shapes** (slightly deeper cream — `#f3e3d0`) sit behind illustrations as organic backgrounds; never geometric, never gradients.
- **No gradients as backgrounds, no textures, no grain/noise overlays, no glass/frost/blur**. Surfaces are solid.

### Hand-drawn outlined frame — *brand signature, currently most-missed motif*
Across brochures, A-format flyers, phone mockups, document templates, social-media cards, and the slide template, Miles consistently uses **a thin burgundy outlined rectangle** around content: cards, mockups, mini-tile previews, even the letterhead. Some have a deliberate slightly-imperfect stroke (the "hand-drawn" feel), others are crisp.

Spec:
- 1.5–2px solid `var(--burgunder)`
- 8–16px corner radius
- No fill (or `var(--bg-2)`)
- No drop shadow
- Optional: ~0.4–0.8° rotation and 0.5–1px stroke wobble (achievable with SVG, or `transform: rotate(0.5deg)` + slight irregular border-radius like `16px 18px 14px 16px`) for the "hand-drawn" variant
- Pairs naturally with a small kicker label at top-left and the Miles wordmark at top-right inside the frame

This is *the* card pattern for Miles. The current default "1px subtle border with a soft shadow" is correct for product UI, but **for marketing/editorial surfaces, prefer the hand-drawn frame.**

### Illustration style
Hand-drawn, organic line art (see `assets/illustrations/`):
- Burgundy `#450d21` ink for line work and solid fills (hair, pants, shadows).
- Cream `#fbf0e5` or white for skin and clothing body.
- Miles-rød accents — a dot, a beating heart, a single red cloud, a word in a speech bubble (*Hei!* / *Oisann..* / *Slapp av! Dette kan jeg*).
- Subjects: people collaborating, handshakes, meetings, desks, laptops, coffee, small celebratory moments, lightbulbs, tangled cables (problem-solving), nets/catching ideas.
- Ground: soft cream-deep ellipse, not a cast shadow.
- No drop shadows on illustrations, no outlines around the whole scene, no backgrounds — float on cream, optionally inside a cream blob.

**Use the supplied illustrations. Do not invent or redraw them with AI; the hand-drawn imperfection is the point.** If you genuinely need a new illustration, commission one or ask the user; do not have Claude draw one as SVG.

### Speech bubble pattern
A recurring motif — a hand-drawn outlined bubble (burgundy stroke, cream fill) with a tail, containing either a short red Norwegian phrase (*Hei!* / *Oisann..*) or a deliberately-too-long absurd block of text that the design then contrasts with a smaller bubble saying *"Err, okay?"*. Use for editorial humour and to soften technical content.

### Photography
- Warm overall — cream/beige/burgundy dominate the colour palette of the images.
- Real Miles employees, natural light, workplace moments (workshops, conferences, lounges, coffee).
- Lanyards with the Miles heart-M visible — this is brand-on-brand.
- Photo cards / portrait tiles in slides typically have **12–16px corner radius** (slightly more generous than UI cards).
- Photo collages: rectangular tiles in a tight, slightly-irregular grid; the cream backdrop extends past the photos to create a "cream mat" border.
- **No stock photography. No glossy corporate imagery. No AI-generated faces.**
- A photo over which text sits should have either a cream text-panel anchoring the copy, or a burgundy 70% overlay if text is over the image.

### Animation & motion
- **Easing:** `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart). The only easing UI should use.
- **Duration:** 150–300ms; 220ms is the house default.
- **No bounce, elastic, or spring** on UI elements. Energy lives in red and in copy, not in motion.
- **Typing demos:** 30–50ms per character with slight randomness.
- **Fades preferred** over translations; when translating, ≤12px.

### Interaction states
- **Hover:** darken fill (`--miles-rod-hover: #e8252f`), or burgundy to `--burgunder-hover`. Outlined pill nav becomes filled.
- **Press:** darker still (`--miles-rod-press`), no shrink/scale.
- **Focus:** 2px Miles-rød outline, 2px offset — visible, accessible, on-brand.
- **Disabled:** 50% opacity, no pointer events.

### Borders
- `1px solid rgba(69,13,33,0.14)` default subtle divider (product UI).
- `1.5–2px solid var(--burgunder)` for the hand-drawn-frame marketing card.
- `2px solid var(--miles-rod)` around callouts, vision-statement boxes, and tag-pills.
- Dashed burgundy `2px dashed var(--miles-rod)` (with red title cut into the top edge) for the "Tips & tricks" sticker that appears in the slide template.
- No dotted borders.

### Corner radii
- **≤12px** default cap on product cards.
- **12–16px** on photo cards / portrait tiles / phone mockups.
- **Pill buttons:** `300px` (website CTA) and `30px` (outlined nav pill).
- **Inputs:** 8px. **Small chips:** 8px. **Logo / image containers:** 0 or 4px.

### Shadows
Restrained. Brand explicitly rejects deep, harsh, and glassmorphic shadows. The signal of a "deep" shadow here is **alpha and colour, not blur radius**: a wide-but-faint shadow is fine; a dense or black one is not. Three approved tiers:
- `--shadow-1: 0 1px 2px rgba(69,13,33,0.08)` — hairline lift
- `--shadow-2: 0 4px 12px rgba(69,13,33,0.09)` — card elevation
- `--shadow-soft: 0 10px 30px rgba(69,13,33,0.06)` — hero / feature (wide blur, but only 6% alpha, so it stays a whisper)

Keep alpha ≤15% on any single shadow. Shadow colour is **always burgundy-tinted, never black** — this holds in dark mode too (use a burgundy-tinted near-black like `#0d0408`, never `#000`). **No inset shadows. No coloured glows.**

### Buttons & CTAs
Three flavours, each tied to a specific moment:

1. **Primary pill (web CTA)** — full Miles-rød fill, cream text, 300px radius, ~16px y / 28px x padding. Inside: optional left red arrow (when on cream) or right arrow.
2. **Outlined pill nav (web nav, slide nav)** — burgundy 2px stroke, transparent fill, burgundy text, 30px radius. On hover, fills.
3. **Inverse pill on red** — cream pill with red arrow + burgundy text. This is the pattern on the closing slide ("← Cover page", "← Innholdsoversikten") and on the red-fill A-format flyer ("Scan for mer info!").

### Cards
- Cream surface on a slightly warmer cream body (`--bg-2` on `--bg-1`).
- 12px radius, 1px `--border-1`, optional `--shadow-2`. (Product UI.)
- Marketing/editorial card: see the **hand-drawn outlined frame** spec above.
- **No coloured left-border-accent cards.** Explicitly off-brand / AI-slop.

### Layout rules
- **Miles logo top-right** of every slide / page (small red wordmark — or cream on red/burgundy floods).
- **Hamburger menu icon top-left** of slides and brand-guide pages — 3 burgundy lines (`assets/icons/hamburger-menu.svg`). Decorative even when not interactive.
- **Kicker → heading → body → illustration-right** is the canonical content pattern for slides; the right ~40% carries illustration or photography.
- **Generous whitespace.** 16:9 slides usually use only the left 50–60% for text.
- **Max web container width:** 1200px.

### TOC / navigation card pattern
The brand guide's table-of-contents page uses three large cream cards with thin burgundy borders. Each card has a burgundy filled pill at top with white text ("Part 1: Get to know Miles"), and a vertical stack of small outlined nav-pills inside (each one a click-target like "Our values" / "Logo usage"). This is *the* pattern for grouped navigation on Miles surfaces.

### "Tips & tricks!" sticker
In the PowerPoint template's documentation pages, instructional callouts appear as **a dashed-red 2px outlined rectangle**, with the words *"Tips & tricks!"* in Miles-rød Gelica italic cut into the top stroke (centered, with cream `background` so the dashes flow around the label). Body text inside is burgundy DM Sans. Use this for inline "how to use this template" / "behind-the-scenes" notes.

### Accessibility — the red is a brand colour, not a body-text colour

Burgundy on cream is the workhorse and is excellent: `#450d21` on `#fbf0e5` ≈ **14:1**. The accent red is where contrast gets tight, and this is inherent to the brand — design around it, don't fight it:

- **Cream (or white) on Miles-rød ≈ 3.3:1.** That clears WCAG AA only for **large text** (≥24px, or ≥18.66px bold). So a red CTA is fine for a chunky pill label, but don't set small print cream-on-red. When you need AA-normal on red, use the **pressed red `#c81d26`** (cream-on-it ≈ 5.1:1) as the surface, or make the label large+bold.
- **Red text on cream ≈ 3.3:1** (and only ~2.9:1 on `--krem-deep`). Kickers at `--scale-2`+ qualify as large text and pass; **inline red links and `.em-red` words inside body copy do not.** For body links, keep an underline as the affordance (don't rely on colour alone), or set link text in burgundy with a red underline.
- **Dark mode is tighter still:** cream on the lightened red `#ff4752` ≈ 2.4:1. Keep on-red text large, or darken the red surface behind any small text.
- **Single-red-word emphasis** inside a burgundy heading is a *display-size* device — at hero/heading sizes the 3.3:1 is acceptable (large-text threshold). Don't carry that emphasis pattern down into body-size text.
- Focus rings (2px Miles-rød, 2px offset) are present on CTAs, nav pills, and links — keep them; they are the accessible keyboard affordance.

---

## 3. Iconography

Three icon surfaces, each with a clear role. **Do not mix them.**

### 3.1 Hand-drawn SVG brand icons (`assets/icons/`)
30 icons, Norwegian-named (`alfakroll`, `bruker`, `hjerte-fylt`, `desktop-koding`, `feiring`, `fjell`, `robot`, etc.). **Style:** burgundy line-art with Miles-rød accents and a slightly-sketchy stroke. **Editorial / narrative** icons — section markers, about-us tiles, celebration moments. **Not UI affordances.**

**Full filename → meaning → use index for every icon and illustration is in [`ASSETS.md`](ASSETS.md).** Usage: inline at 32–96px. Don't recolour — the palette is baked in.

### 3.2 Service-area icons (`assets/service-icons/`)
Five marks, each in regular and circle variants. The Norwegian names are canonical; English is for international contexts.

| Norwegian (canonical)           | English                              | File                              |
|---------------------------------|--------------------------------------|-----------------------------------|
| Teknologi, sky og plattform     | Technology, Cloud and Platform       | `cloud[-circle].png`              |
| Data og AI                      | Data & AI                            | `data-and-ai[-circle].png`        |
| Strategisk IT                   | Strategic IT                         | `strategic-it[-circle].png`       |
| Transformasjon og mennesker     | Transformation and People            | `transformation-and-people[...].png` |
| Brukeropplevelse og innovasjon  | User Experience and Innovation       | `ux-and-innovation[-circle].png`  |

Use the **circle** variant on cream backgrounds; the **non-circle** variant inside an existing container or grid cell.

### 3.3 Decorative group illustrations (`assets/illustrations/`)
`group-*.svg` — larger scene illustrations. Treat as **hero imagery**, not icons. PNG versions exist for raster targets.

### 3.4 UI micro-icons (functional)
The brand does **not** ship a functional UI icon set beyond hamburger, delete arrows, and the small inline arrow-pills. For general UI work:
- **Preferred:** extend the hand-drawn style (commission new SVGs at ~2–3px burgundy stroke).
- **Substitution:** **Lucide icons** (https://lucide.dev) at 1.5–2px stroke, recoloured to `var(--burgunder)` or `var(--miles-rod)`. Lucide's rounded stroke is the closest CDN match. **Flag the substitution to the user.**

---

## 4. Logo

- The wordmark "Miles" in Gelica-derived custom letterforms (rounded, ink-trap M). Files in `assets/logos/`:
  - `miles-logo-red.png` — default on cream
  - `miles-logo-cream.png` — on red / burgundy / photos
  - `miles-logo-white.png` — on red / dark / photos when cream would muddy
  - `miles-logo-burgundy.png` — on yellow, on cream secondary lockup
  - `m-icon-1..4.png` — circular M-mark variants
  - `MilestoneBurgundy.png` — the **heart-M ("Milestone")** mark, used in any "warmth" beat (closings, internal SoMe, t-shirt graphic)
- **Placement:** top-right of every artefact, small. Big-logo placements (cover slides, flags, apparel) place it centre.
- **Don't:** stretch, squash, shadow, gradient, recolour to off-brand red, place on busy photography without contrast, embed in a tagline lockup. The logo stands alone.

---

## 5. Explicit anti-patterns

If your output contains any of these, you've drifted off-brand:

- Cyan as a marketing accent, bluish-purple gradients
- Glassmorphism, frosted blur backgrounds, noise textures
- Dense or black drop shadows (>15% alpha, or any `#000`-based shadow), coloured glows
- Generic flat icons, emoji chains, stock illustrations, AI-generated faces
- Rounded corners >16px on structural cards
- Bold inside Gelica (use red colour for emphasis instead)
- Title Case headings, exclamation inflation, em-dash-driven prose
- Coloured left-border-accent cards
- Pure black `#000` text or pure white `#fff` on cream
- Em-dash-as-decoration, buzzwords (*synergy, unlock, supercharge*)
- Teal / dark-teal anywhere outside a *technical* context — and **never** alongside Miles-rød as a peer accent

---

## 6. Worked patterns (reference)

These are the recurring layout recipes from the brand guide + PowerPoint master. See `presentation-patterns.md` for slide-specific blueprints and `components.css` for ready-to-port CSS.

| Pattern                              | Where it appears                                                     |
|--------------------------------------|----------------------------------------------------------------------|
| Cover slide (red flood, cream, burgundy flood — 3 variants)             | PPTX `Forsider` |
| Chapter divider (red / burgundy / cream — title inside outlined frame)  | PPTX `Chapter Pages` |
| Brochure card (hand-drawn frame, kicker top-left, year top-right, big serif title, single line-icon centre, "Digital Brochure" + logo bottom) | A4 brochure series, service-area covers |
| TOC card (cream card + filled pill header + stack of outlined nav-pills) | Brand guide TOC page |
| Service-area intro (big serif title left, circle service-icon right, sub-list of skills at bottom) | PPTX service-area pages |
| Two-text-column on cream             | Welcome / "Hi and thank you for caring" pages |
| Photo collage with cream-mat border  | "Well-being and Innovation" image style page |
| Photo + cream text-panel overlay     | "We are a value-driven consulting company" |
| Red split panel (red half + cream half) | "A lot is new : A lot remains" |
| Phone mockup (hand-drawn burgundy outline) carrying SoMe content        | SoMe / digital section |
| Closing pill-nav slide (red flood, cream Miles + huge title + bottom row of cream pills with red arrows) | PPTX closings |
| Letterhead (hand-drawn outlined frame, logo top-right, address footer with 6–7 office columns) | Documents and Letters page |

---

## 7. Working with this skill

- Tokens live in `colors_and_type.css`. Port them to the host system rather than hard-coding hex.
- Component recipes live in `components.css` — copy as-is or translate to the host's styling system.
- Slide layouts (PPTX-derived) are in `presentation-patterns.md`.
- Fonts are bundled in `fonts/` — self-host; Gelica must not be CDN-linked.
- Brand assets are in `assets/` — copy referenced files into the host repo at build time; never runtime-link to this skill folder.

When in doubt:
1. Cream first.
2. Fewer, larger, calmer elements.
3. Illustration over photography, hand-drawn over flat, serif display over sans display.
4. If you're about to add a gradient, a 16px+ shadow, an emoji chain, Title Case, or a teal CTA — **stop**.
