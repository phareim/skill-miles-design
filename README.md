# miles-design — a Claude Code skill

A Claude Code skill for designing UI in the **Miles** brand system. Miles is a Norwegian/Lithuanian IT consultancy; this skill packages the brand's tokens, fonts, illustrations, hand-drawn icons, component recipes, and slide patterns so Claude Code (and humans) can produce on-brand work in any framework.

> Brand stance: *professional authority and warmth* — warm, calm, deliberate. Never corporate-cold, never trend-chasing.

## What's in here

| Path | Purpose |
|---|---|
| `SKILL.md` | Skill manifest + entry point. Loaded by Claude Code when the skill activates. |
| `BRAND.md` | Full brand system reference — content rules, colour, type, layout, animation, anti-patterns. |
| `colors_and_type.css` | CSS custom properties + `@font-face` + semantic element styles. Light + dark mode. |
| `components.css` | Ready-to-port recipes for the brand's signature components. |
| `presentation-patterns.md` | Slide-deck patterns from the official 2026 PowerPoint master. |
| `fonts/gelica/` | Gelica (display serif) — 8 weights/styles. |
| `fonts/dm-sans/` | DM Sans (body sans) — 6 weights/styles. |
| `assets/logos/` | Wordmarks (red/white/cream/burgundy), M-mark squares, Milestone heart-M mark. |
| `assets/icons/` | ~30 hand-drawn SVG brand icons. |
| `assets/service-icons/` | Five service-area marks (regular + circle variants). |
| `assets/illustrations/` | Hand-drawn PNG/SVG people scenes. |

## Install as a Claude Code skill

Clone or symlink this repo into your local Claude Code skills directory:

```bash
git clone git@github.com:phareim/skill-miles-design.git ~/.claude/skills/miles-design
```

Then in any Claude Code session, the skill is auto-discovered and Claude can invoke it via the `Skill` tool. It also auto-activates when you mention Miles, miles.no, or "Miles-styled" UI.

## Use the assets in a host project

1. Copy `colors_and_type.css` (or port its tokens into your design system).
2. Copy `fonts/` into the host repo (typically `public/fonts/`) — keep the `@font-face` paths in sync.
3. Cherry-pick from `components.css` — translate to the host's styling system.
4. Reference assets from `assets/` by copying the files you need into the host repo. **Don't link to this repo at runtime.**

## Provenance

Reconciled from the *Miles Brand Guide 2025* (PDF) and the *Miles template 2026.pptx*. The Marketing Department at Miles is the source of truth; this skill is an unofficial packaging for easier programmatic use by Claude Code.

Gelica is a proprietary Monotype typeface bundled here for use inside Miles deliverables. Do not redistribute outside Miles work.

## Non-negotiable rules at a glance

- **Bilingual by audience** (Norwegian / English) — never default-translate.
- **Sentence case only.** No Title Case, no ALL CAPS.
- **60 / 30 / 10:** cream `#fbf0e5` / burgundy `#450d21` / Miles-rød `#ff303b`. Cream is the canvas.
- **Gelica** for display + headings, **DM Sans** for body. **Manrope** is the PPTX-only Gelica fallback.
- Emphasis = a single red word inside a burgundy Gelica heading. No bold-inside-Gelica.
- Pill CTAs (300px), outlined nav pills (30px). Cards max 12px, photo cards up to 16px.
- The **hand-drawn outlined frame** (1.5–2px burgundy stroke, no fill, no shadow) is the marketing/editorial card pattern.
- No gradients, no glassmorphism, no deep shadows (>12px / >15% alpha), no left-border-accent cards.
- Teal `#004047` / `#78e8db` is allowed **only** in technical/code contexts.
- Easing: `cubic-bezier(0.25, 1, 0.5, 1)`, 150–300ms, no bounce.

Full rules in `BRAND.md`. The brand has explicit anti-patterns — read it.

## License

This repository bundles assets that are © Miles AS. Use only for Miles deliverables. Gelica is licensed from Monotype; do not redistribute font files outside that context.
