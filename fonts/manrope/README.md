# Manrope — PPTX-only Gelica fallback (not bundled)

Gelica's licence forbids embedding in `.pptx`, so the official *Miles template
2026.pptx* uses **Manrope** (Bold / SemiBold) for headings + DM Sans for body.
This skill names Manrope as the sanctioned PowerPoint heading fallback but does
**not** ship the files — Manrope is open-source (SIL Open Font License 1.1), so
unlike proprietary Gelica it is safe to fetch and bundle yourself when you need it.

**When you actually need Manrope** (you're producing a `.pptx`, or an HTML deck
meant to mirror the PowerPoint master):

- Google Fonts: https://fonts.google.com/specimen/Manrope
- Source / OFL: https://github.com/sharanda/manrope
- Weights the template uses: **SemiBold (600)** and **Bold (700)**.

Drop the `.ttf`/`.woff2` here and add `@font-face` blocks if you want web
parity. On web/print, prefer real **Gelica** — Manrope is *not* an
interchangeable substitute there (it's a sans; Gelica is a serif). Use the
`--font-display-pptx` token (in `colors_and_type.css`) only in PowerPoint-mirror
contexts; the default `--font-display` web stack intentionally excludes Manrope
and falls back Gelica → Georgia → Times (serif → serif).
