# Miles presentation patterns

> Layout recipes drawn from the official *Miles template 2026.pptx* and the *Brand Guide 2025*. Use these when building a slide deck (PowerPoint, Google Slides, or HTML/Reveal/etc.). Each pattern is described in geometric terms so it can be translated into any presentation system.

For colour and type tokens see `colors_and_type.css`. For component CSS (frames, pills, mockups) see `components.css`. For the writing voice see `BRAND.md` § 1.

> **Buildable templates:** `examples/slides/` instantiates the patterns below as a ready-to-copy `deck.html` (16:9, arrow-key nav) and a real `miles-templates.pptx` (Manrope + DM Sans, embedded assets) — copy from those rather than building each slide from scratch.

Aspect ratio everywhere: **16:9**. Margin grid: ~6.5% of slide width on left/right, ~6% top/bottom.

---

## 1. Cover slides (three variants)

The official template ships **three editable cover variants** plus locked "spice-up" intros. The dominant pattern is the giant Gelica/Manrope wordmark with kickers in the corners.

### 1.1 Cream cover
- **Background:** krem `#fbf0e5`.
- **Top strip (small DM Sans labels, burgundy, ~14pt):**
  - Top-left: presentation title (e.g. *"Her kan du skrive tittel på presentasjon — Kundenavn/undertittel"*).
  - Top-right: speaker name / city, on the next line the date. Miles-rød on cream.
- **Centre/lower-left:** giant Miles wordmark in Miles-rød, height ~45–55% of slide.
- **No illustration.** This is the institutional opener.

### 1.2 Red flood cover
Same layout but `--miles-rod` background, cream Miles wordmark, cream tiny top labels. The Miles logo is in cream Gelica weight (different from the red-on-cream lockup).

### 1.3 Burgundy flood cover
Same layout but `--burgunder` background, cream Miles wordmark, cream labels. Heaviest / most formal.

### 1.4 Locked "Vi elsker å løse utfordringer!" cover (illustration cover)
- Background: cream.
- Top-right: Miles wordmark (small, red).
- Title in burgundy Gelica, ~3 lines, ~54pt: *"Vi elsker å løse utfordringer!"* / *"We love solving challenges!"*
- Right ~45%: one of the included illustrations (a person with a net catching ideas, or the tangled-cables vignette). Floats on cream.

---

## 2. Chapter pages

Three flavours (red / burgundy / cream). Title is centered inside a **hand-drawn outlined frame** (cream box with thin burgundy stroke when on red/burgundy; reversed on cream).

- Big Gelica/Manrope title (~54–66pt), one or two lines.
- Optional smaller subtitle pill underneath ("Klikk her for å legge inn undertittel").
- Miles wordmark top-right (colour inverted to match the background).
- Hamburger top-left.

A more editorial variant uses a **left-aligned huge title (e.g. "Examples, tips and tricks")** in burgundy Gelica with a single small line-icon at right (an outlined laptop, a coffee cup with M, a confetti popper).

---

## 3. Standard content slide ("kicker → heading → body → illustration")

The canonical Miles content slide.

- Left ~55% column:
  - Tiny Miles-rød kicker (Gelica italic at ~24pt OR DM Sans uppercase at ~12pt + 0.08em tracking).
  - Burgundy Gelica heading (~36–44pt).
  - Burgundy DM Sans body, ~18–22pt, line-height 1.55.
- Right ~45% column:
  - An illustration (preferred) floating on the cream canvas, optionally inside a soft cream-deep blob.
  - **Or** a service-area circle icon.
  - **Or** a single brand icon at 96–120px.

Hamburger top-left, Miles wordmark top-right.

---

## 4. Two-text-column page

For long-form editorial content (the "Hi, and thank you for caring" / "Brand Guide - What is it?" pages).

- Optional kicker (red, top-left).
- Big Gelica heading (~44pt), 1–2 lines.
- Two columns of DM Sans body, each ~28ch wide, gap ~5% of slide width.
- No illustration; whitespace carries the page.

---

## 5. Service-area intro slide

Used to introduce each of the five service areas. Norwegian names are canonical; English is for international decks.

- Left: small "Tjenesteområde" kicker (or "Service Area") in DM Sans, top-left.
- Centre-left: big burgundy Gelica title (e.g. *"Sky, teknologi og plattform"*), ~48pt.
- Right: the **regular (non-circle)** service-area line-icon at ~360px.
- Bottom-left: small DM Sans list of sub-disciplines in burgundy at ~12pt (e.g. *"Systemutvikling, arkitektur, devOPS, integrasjon, AWS, GCP, Azure, modernisering"*).
- Miles wordmark top-right; "Digital Brochure" tag bottom-left when the same layout is reused for an A4 brochure cover.

The full **service-area grid summary slide** shows all five **circle** variants in a row beneath their Norwegian labels.

---

## 6. Photo content slide

Two flavours.

### 6.1 Full-bleed photo with cream text-panel
- Photo spans entire slide.
- A cream rectangle (or `miles-frame`) bottom-left, ~38% wide × ~30% tall, holds a single burgundy Gelica heading (one short line).
- Optional: small Miles wordmark top-right in cream OR red, whichever contrasts.
- Use when the photo is the message; the panel anchors a 5–10 word headline.

### 6.2 Photo right, text left
- Left ~50%: kicker → heading → body, as in pattern §3.
- Right ~50%: one large photo at radius 12–16px, full-bleed within the column with ~6% margin from edges.

---

## 7. Photo collage page ("Well-being and Innovation")

- Title block in upper-left (kicker + 2-line Gelica heading + 1-paragraph DM Sans body + small "Link to our image archive" sans link).
- Right or below: an **irregular grid of 6–14 photos**, each at radius 12–16px, packed close with ~6–8px gutters.
- The cream canvas extends past the outermost photos to create a "cream mat" border (the brand guide's collage page has a deeper-cream pebble shape behind the cluster).
- Use for "this is who we are" / "well-being" / "team camp" pages.

---

## 8. Red split-panel page

Two halves, each carrying a different *kind* of content.

- Left half: Miles-rød flood, cream Gelica heading + cream Gelica bullet list (*"A lot is new:"* / *"Et lot er nytt:"*).
- Right half: cream flood, burgundy Gelica heading + burgundy bullet list (*"A lot remains"* / *"Mye består"*).
- Bullets: simple `·` glyph, not a custom icon.
- Closing line at the bottom of one column with the right-arrow icon points to the next slide.

---

## 9. Team / CV slides

### 9.1 Team for 1–3 people
- "Presentasjon av team 1–3 pers — Velg din tittel" kicker at top.
- 1–3 large circular photo wells (radius 50%) at ~180px, centred horizontally.
- Beneath each: a small filled red pill with "Senior/junior konsulent", then the name in burgundy DM Sans SemiBold, then a one-line role description in burgundy DM Sans Regular.

### 9.2 Team for 1–5 people
Same pattern, smaller circles (~120px), tighter horizontal spacing.

### 9.3 Personal CV (individual consultant slide)
- Top-left: small circular portrait (~80px).
- Top: name + role (Gelica heading + DM Sans subtitle).
- Two-column block: *"Hva trengte kunden hjelp til?"* / *"Hva var konsulentens rolle i prosjektet?"* with DM Sans body.
- Right: a small mockup-collage of phones/screens showing the consultant's work.
- Bottom: a discipline-tags row in DM Sans (e.g. *"UI/UX-design, innholdsdesign, merkevarestrategi, grafisk design, kommunikasjon"*).

---

## 10. Locked "Om Miles" info slides

The PPTX has locked, non-editable info pages the marketing team supplies. Don't redesign these in your decks; reuse them verbatim.

- **"Hva er vi?"** — Norwegian Gelica paragraph on cream. Inside a hand-drawn outlined frame.
- **"Hva jobber vi med?"** — same.
- **"Hvor holder vi til?"** — three variants: (a) text-only with city list, (b) text + outlined Norway/Lithuania map with city pills, (c) text + filled-red Norway/Lithuania map with city pills.
- **"Våre verdier er faglig autoritet og varme"** — large Gelica statement on cream, optionally paired with a photo box.
- **"Våre tjenesteområder"** — the five-circle service-area summary.

When generating a deck, **insert these slides via direct reuse from the official PPTX**, not by re-drawing them.

---

## 11. Image-page layouts (collage / single image / image + text)

The PPTX ships three editable image-page templates:

1. **Big collage** — 12-cell irregular grid for showing many photos.
2. **Header + 7-photo collage** — title at top-left, body text at bottom-left, photos packed in a 7-cell asymmetric grid filling the right two-thirds.
3. **Single big image + side text** — title and body on the left ~45%, one big image filling the right ~55%, plus a small image strip beneath the body if needed.

Each uses 8–12px corner radius on the image tiles and a tight ~8px gutter.

---

## 12. Closing slides

Three variants from the template, all locked:

### 12.1 Red flood "Takk for tiden din!"
- `--miles-rod` background, full bleed.
- Cream Miles wordmark top-left (~80px tall — bigger than the usual top-right placement).
- Big cream Gelica heading low-left: *"Thank you so much for your time! :)"* / *"Takk for tiden din!"*.
- Bottom row: a horizontal stack of **inverse pill nav buttons** (cream pill, red arrow, burgundy text) — *"← Cover page"*, *"← Innholdsoversikten"*, *"← Har du noe på hjertet?"*. Each links back into the deck.

### 12.2 Cream Miles + "Takk for tiden din!"
Same line in burgundy Gelica on cream; Miles wordmark in red centre.

### 12.3 Burgundy flood + cream Miles + "Takk for tiden din!"
Same in cream Gelica on burgundy.

---

## 13. The pill-nav bottom strip

Used on the red closing slide and on any "long deck with sections" navigation pattern. Each button is a `.miles-cta--inverse` pill (cream fill, burgundy text, red leftward arrow). Place 2–4 such pills in a horizontal flex row across the lower portion of the slide. Equal heights, equal vertical padding, generous horizontal padding (~28px).

---

## 14. The "Tips & tricks!" sticker

Throughout the documentation pages of the template, inline callouts appear as a **dashed red 2px outlined rectangle** with *"Tips & tricks!"* in Miles-rød Gelica italic cut into the top stroke. Body text inside is burgundy DM Sans. See `components.css` `.miles-tips`.

Use these sparingly in author-facing template/docs surfaces — they are NOT for client-facing slides.

---

## 15. The locked-page padlock badge

Locked template pages display a **small circular padlock icon** centred above the slide (burgundy outline circle with a padlock glyph inside, red keyhole). This is a *navigation* signifier for slide-deck authors — leave it on locked slides and remove it from editable slides. **This icon is not bundled** in `assets/icons/`; recreate it from this spec (a `.miles-service-circle`-style burgundy outline circle with a simple padlock glyph and a red keyhole dot), or lift it from the official `.pptx` master where it lives on the locked layouts (e.g. "Strategisk IT - LÅST").

---

## 16. Deck spine — recommended structure

When building a Miles deck from scratch:

1. **Cover** — choose cream / red / burgundy variant per audience formality.
2. **Locked "Vi elsker å løse utfordringer" intro** (optional, after the cover).
3. **Agenda / TOC** — use the TOC card pattern (`components.css` `.miles-toc-card`).
4. **Section dividers** — chapter pages (cream/red/burgundy as bookmarks).
5. **Content** — alternate kicker→heading→body slides with photo slides, red split panels, and service-area intros.
6. **Team slide** — 1–3 or 1–5 person variant near the end.
7. **Q&A / "Har du noe på hjertet?"** — bridge slide before close.
8. **Closing** — red-flood pill-nav closer is the strongest brand moment.

Keep total slide count low (the brand voice rewards restraint). Generous whitespace beats dense slides; one idea per slide is the house rule.

---

## 17. Norwegian ↔ English crib for slide labels

| Norwegian (canonical in PPTX)   | English equivalent                   |
|---------------------------------|--------------------------------------|
| Forside                         | Cover                                |
| Innholdsfortegnelse / Innholdsoversikt | Table of contents                    |
| Tjenesteområde                  | Service area                         |
| Hva er vi?                      | Who we are / What we are             |
| Hva jobber vi med?              | What we do                           |
| Hvor holder vi til?             | Where we are                         |
| Våre verdier                    | Our values                           |
| Våre tjenesteområder            | Our service areas                    |
| Presentasjon av team            | Team presentation                    |
| Klikk her for å legge inn tittel | Click here to add a title            |
| Klikk for å sette inn bilde     | Click to insert an image             |
| Tittel her                      | Title here                           |
| Takk for tiden din!             | Thank you so much for your time!     |
| Har du noe på hjertet?          | Do you have something on your mind?  |
| Vi elsker å løse utfordringer!  | We love solving challenges!          |

For decks aimed at a mixed audience, keep section dividers in English and let body copy follow the speaker's preference.
