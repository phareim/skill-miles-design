---
name: miles-design
description: Use this skill when implementing, styling, or extending UI for Miles (Norwegian/Lithuanian IT consultancy — Miles AS) in a production codebase. Provides brand tokens (colors, type, spacing, radii, shadows, motion), fonts, logos, hand-drawn icons and illustrations, ready-to-port component recipes, slide-deck patterns, and rules of the visual + content system. Apply whenever the user mentions Miles, miles.no, the Miles brand, or asks for "Miles-styled" UI.
user-invocable: true
---

# Miles Design — Claude Code skill

You are implementing UI for **Miles**, a Norwegian/Lithuanian IT consultancy (~300 people, offices in Oslo, Bergen, Trondheim, Stavanger, Ålesund, Haugesund, Innlandet, and Lithuania). The brand stance is *professional authority and warmth* (*faglig autoritet og varme*) — warm, calm, deliberate, **never** corporate-cold and **never** trend-chasing.

## How to use this skill

1. **Read `BRAND.md`** before producing any Miles-branded UI. It is the full content + visual system, reconciled with the official *Brand Guide 2025* PDF and the *Miles template 2026.pptx*. The rules are opinionated and the brand has explicit anti-patterns.
2. **Copy `colors_and_type.css` into the host codebase** — or port its custom properties into the host's token system. It is the source of truth for colours (light + dark), type, scale, spacing, radii, shadows, and motion.
3. **Use `components.css`** for ready-to-port recipes of the brand's signature components — the hand-drawn outlined frame, primary / inverse pill CTAs, phone mockup, speech bubble, TOC pill-card, service-area circle, "Tips & tricks" sticker. Translate them into the host's styling system as needed.
4. **For slide decks, read `presentation-patterns.md`** — it captures the layout recipes from the official 2026 PowerPoint template (covers, chapter pages, service-area intros, team CVs, photo collages, closings).
5. **Copy the fonts** in `fonts/` into the host repo (typically `public/fonts/`). Keep the `@font-face` paths in sync. Gelica is proprietary — bundle the files, never link a CDN. For PPTX exports, **Manrope** is the sanctioned heading fallback (Gelica's EULA forbids `.pptx` embedding); that is the combination shipped in the official 2026 template.
6. **Copy any brand assets you reference** from `assets/` into the host repo. Do not link to this skill folder at runtime.
7. **Match the host codebase's framework + patterns.** React + Tailwind → port tokens into the Tailwind config. CSS Modules → import the stylesheet. Design-system package → express tokens there. **Never paste raw HTML prototypes** when a structured option exists.

If asked to design something with no other guidance, ask the user **what** they want to build, **which surface** (web, internal tool, slide deck, social post, print), and **which framework** — then act as an expert Miles-brand designer.

## Files in this skill

| Path                       | Purpose                                                                                |
|----------------------------|----------------------------------------------------------------------------------------|
| `SKILL.md`                 | This file — entry point                                                                |
| `BRAND.md`                 | Full brand system: content rules, colour, type, layout, animation, anti-patterns       |
| `colors_and_type.css`      | CSS custom properties + `@font-face` + semantic element styles. Light + dark mode.     |
| `components.css`           | Ready-to-port recipes for Miles' signature components                                  |
| `presentation-patterns.md` | Slide-deck layout patterns from the official 2026 PowerPoint template                  |
| `fonts/gelica/`            | Gelica (display serif) — 8 weights/styles, `.ttf`                                      |
| `fonts/dm-sans/`           | DM Sans (body sans) — 6 weights/styles, `.ttf`                                         |
| `assets/logos/`            | Wordmarks (red, white, cream, burgundy), M-mark squares, Milestone heart-M mark        |
| `assets/icons/`            | ~30 hand-drawn SVG brand icons, Norwegian-named                                        |
| `assets/service-icons/`    | Five service-area marks (regular + circle variants)                                    |
| `assets/illustrations/`    | Hand-drawn PNG/SVG people scenes                                                       |

## Non-negotiable rules (full version in BRAND.md)

- **Bilingual by audience.** Norwegian (Bokmål) for Norwegian audiences and internal Norway-facing pieces; English for international / Lithuania-facing / global. Don't auto-translate; ask when unsure. *There is no single default language.*
- **Sentence case only.** Never Title Case, never ALL CAPS.
- **60 / 30 / 10 colour split:** 60% krem `#fbf0e5`, 30% burgunder `#450d21`, 10% Miles-rød `#ff303b`. Krem is the canvas — every surface starts cream.
- **Type:** Gelica for display + headings, DM Sans for body. Modular scale 1.333, base 16px. Manrope is a PPTX-only Gelica fallback (web/print still get Gelica).
- **Emphasis:** a single red word inside a burgundy heading. Never bold inside Gelica; use colour.
- **Pill CTAs** (300px radius) on web; **outlined pill nav** (30px). Cards max **12px** radius; photo cards may go to **16px**. Pill flavours: filled red, outlined burgundy, and inverse (cream on red) — see `components.css`.
- **Hand-drawn outlined frame** is *the* card pattern for marketing/editorial — 1.5–2px solid burgundy stroke, no fill, no shadow. Used for brochure cards, mockup containers, document frames, slide-template tiles, phone mockups.
- **No emoji chains, no gradients as backgrounds, no glassmorphism, no deep shadows** (>12px blur or >15% alpha), **no left-border-accent cards**, **no mint/lime/hot-pink/magenta/cyan-as-marketing-accent**.
- **Teal `#004047` / `#78e8db` is sanctioned ONLY in technical/code contexts** (code blocks, the "Sky, teknologi og plattform" service slide, dev diagrams). Never as a marketing accent. Never alongside Miles-rød as a peer.
- **Use the included illustrations** — don't invent or AI-generate replacements. The hand-drawn imperfection is the point.
- **Easing:** `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart); 150–300ms; no bounce or spring.
- **Borders:** product UI uses `1px solid rgba(69,13,33,0.14)`; marketing uses the hand-drawn 1.5–2px burgundy frame. Shadow colour always burgundy-tinted, never black.
- **Emoji rule (softened from "none"):** text smileys `:)` `:-)` and the heart mark are on-brand in friendly closings — **one per artefact, max**. Forbidden: emoji chains, decorative checkmarks/arrows-as-type, animal/food/skin-tone emoji. The brand guide itself uses `:)` and a single 😊 — that's the ceiling, not the floor.
- **UI micro-icons not in the included set:** prefer the hand-drawn style; if substituting, use **Lucide** at 1.5–2px stroke recoloured to `var(--burgunder)` — and flag the substitution to the user.

## Dark mode

`colors_and_type.css` ships a dark-mode palette under `:root[data-theme="dark"]`. Brand red is nudged to `#ff4752` so it pops on near-black; surfaces move to a deep burgundy stack (`#1a0810` canvas, `#2a1019` raised); text uses warmed cream `#ead6c2`. The teal accent stays roughly the same — already dark-ready. Honour `prefers-color-scheme: dark` unless a parent forces a theme via `data-theme="light"`.

## Font fallbacks

- **Web/print:** Gelica → Georgia / Times New Roman. DM Sans → Arial / Helvetica.
- **PPTX exports:** Gelica → **Manrope** (Bold/SemiBold). This is the official 2026 template's choice; Gelica's licence forbids `.pptx` embedding. Manrope is NOT interchangeable with Gelica on web/print.
- **Google Fonts equivalents** (*Fraunces*, *Noto Serif* for Gelica): a compromise, not a match. Flag any substitution to the user.

## When in doubt

- Re-read `BRAND.md`.
- Prefer fewer, larger, calmer elements over many small ones.
- Prefer cream over white, burgundy over black, illustration over photography, hand-drawn icons over flat ones, serif display over sans display.
- If you're about to add a gradient, a 16px+ shadow, an emoji chain, a teal CTA, or Title Case — **stop**.
