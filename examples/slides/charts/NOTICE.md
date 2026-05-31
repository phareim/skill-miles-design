# Vendored Tufte chart recipes

These seven files are copied verbatim from the **`tufte-viz`** skill
(`assets/charts/`, MIT-licensed) so this examples folder is self-contained and
doesn't runtime-link another skill:

`sparkline.js` · `line.js` · `bar.js` · `dot-plot.js` · `slopegraph.js` ·
`scatter.js` · `small-multiples.js` (+ `index.js`, a CommonJS barrel).

Each is a pure `(data, opts) => svgString` function with zero dependencies. The
SVGs they emit read `--tufte-*` CSS custom properties for colour and type, so
they re-theme without edits. `build_charts.js` (one level up) renders them with
Miles sample data and a `:root` that maps the Tufte tokens onto the Miles
palette:

| Tufte token | Miles value | why |
|---|---|---|
| `--tufte-ink` | `var(--burgunder)` | data + labels — burgundy, never black |
| `--tufte-muted` | `var(--burgunder-tint-2)` | ticks, range-frames, rugs |
| `--tufte-faint` | `rgba(69,13,33,.16)` | the quietest reference rule |
| `--tufte-accent` | `var(--miles-rod)` | **the one accent** = Tufte's single moment of attention = Miles' single red |
| `--tufte-font` / `--tufte-num` | `var(--font-body)` (DM Sans) | brand body/data face |

The fit is exact: Tufte's "spend one accent" *is* the Miles 60/30/10 red rule.
To update the recipes, re-copy from the `tufte-viz` skill — don't fork them here.
