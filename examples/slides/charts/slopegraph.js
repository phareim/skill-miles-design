/**
 * slopegraph — Tufte's two-column before/after for many items.
 *
 * Renders one straight line per item connecting its value at period A (left)
 * to its value at period B (right). Both ends carry a direct, horizontally-set
 * label ("Name  value"), so there is no legend and no axis furniture. The reader
 * sees, at a single glance, the level at each period, the rank order at each
 * period, the rank CHANGES (lines that cross), and the rate of change (slope).
 *
 * Graphical integrity: every endpoint is positioned by a single shared linear
 * map of its value onto one scale used for BOTH columns (`yOf`). Endpoints are
 * never nudged or clamped off that scale, so the visual slope of each line is
 * strictly proportional to its real change (lie factor 1) and an identical
 * value-unit maps to an identical pixel-distance in both columns — the
 * integrity guarantee that matters for slopes. There is no zero-baseline
 * requirement because a slopegraph encodes change-as-slope, not
 * magnitude-as-length. Legibility (label crowding) is handled by sizing the
 * plot height to give every item room, NOT by moving endpoints: the plot band
 * grows so the closest two values are at least one label-height apart on the
 * shared scale, which preserves the map instead of corrupting it.
 *
 * Data-ink: no border, no grid, no ticks, no legend, no fill. The only ink that
 * is not a datum is the period header at each column top and (optionally) a
 * single hairline connector — everything else is a value, a name, or a slope.
 *
 * @param {Array<{name:string, left:number, right:number, highlight?:boolean}>} data
 *        One object per item. `left` = value at period A, `right` = value at
 *        period B. Set `highlight:true` to draw that item in the accent colour
 *        (use sparingly — the "moment of attention"). Items with non-finite
 *        values are skipped.
 * @param {Object} [opts]
 * @param {string} [opts.leftLabel="Before"]  Header over the left column.
 * @param {string} [opts.rightLabel="After"]  Header over the right column.
 * @param {string} [opts.title]               Accessible title / aria-label. If
 *        omitted, a summary is generated from the data.
 * @param {(n:number)=>string} [opts.format]  Value formatter for labels.
 *        Default: locale integer-ish with thousands separators.
 * @param {number} [opts.width=420]           viewBox width in user units.
 * @param {number} [opts.rowGap=20]           Minimum vertical px between the two
 *        closest endpoints within a column (controls density / legibility).
 * @param {number} [opts.colInset=150]        Horizontal px from each edge to its
 *        column of endpoints (room for the "name value" labels).
 * @param {number} [opts.fontSize=12]         Base font size in px.
 * @param {boolean} [opts.connectors=true]    Draw the hairline slope lines.
 * @returns {string} A complete, standalone <svg> string.
 */
function slopegraph(data, opts = {}) {
  const o = {
    leftLabel: 'Before',
    rightLabel: 'After',
    title: undefined,
    format: (n) => {
      const r = Math.round(n * 100) / 100;
      return Number.isInteger(r)
        ? r.toLocaleString('en-US')
        : r.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    },
    width: 420,
    rowGap: 20,
    colInset: 150,
    fontSize: 12,
    connectors: true,
    ...opts,
  };

  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  // --- validate & clean -----------------------------------------------------
  const items = (Array.isArray(data) ? data : []).filter(
    (d) => d && Number.isFinite(d.left) && Number.isFinite(d.right)
  );

  const W = o.width;
  const fs = o.fontSize;
  const padTop = fs * 2.6;   // room for the period headers
  const padBottom = fs * 1.4;
  const xLeft = o.colInset;
  const xRight = W - o.colInset;

  if (items.length === 0) {
    const H = Math.round(padTop + padBottom + fs);
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ` +
      `role="img" aria-label="Slopegraph: no data" ` +
      `font-family="var(--tufte-font, inherit)" ` +
      `style="background:var(--tufte-bg, transparent)">` +
      `<title>Slopegraph: no data</title>` +
      `<text x="${W / 2}" y="${H / 2}" text-anchor="middle" ` +
      `font-size="${fs}" fill="var(--tufte-muted, #999)">No data</text></svg>`
    );
  }

  // --- shared scale ----------------------------------------------------------
  let lo = Infinity, hi = -Infinity;
  for (const d of items) {
    if (d.left < lo) lo = d.left;
    if (d.right < lo) lo = d.right;
    if (d.left > hi) hi = d.left;
    if (d.right > hi) hi = d.right;
  }
  const span = hi - lo || 1; // guard flat data

  // Plot height sized from the data so the band never collapses AND so that the
  // closest two endpoints in either column are at least one label-height apart
  // on the shared scale. Growing the band (rather than nudging endpoints) keeps
  // every point on the linear scale, preserving lie factor 1 and the identical
  // value -> identical pixel guarantee across both columns.
  const minGap = fs + 3;            // minimum legible vertical spacing per label
  // Smallest gap (in value units) between any two values within a column.
  let minValGap = Infinity;
  for (const side of ['left', 'right']) {
    const sorted = items.map((d) => d[side]).sort((a, b) => a - b);
    for (let k = 1; k < sorted.length; k++) {
      const g = sorted[k] - sorted[k - 1];
      if (g > 0 && g < minValGap) minValGap = g;
    }
  }
  // Height needed so that minValGap value-units render as >= minGap pixels.
  const gapDrivenH = Number.isFinite(minValGap) ? (span / minValGap) * minGap : 0;
  const plotH = Math.max(items.length * (fs + 6), 160, gapDrivenH);
  const yBot = padTop + plotH;
  const H = Math.round(yBot + padBottom);

  // value -> y (higher value = higher on screen). Single shared map for BOTH
  // columns — this is the integrity guarantee.
  const yOf = (v) => yBot - ((v - lo) / span) * plotH;

  // Endpoint y-positions come straight from the shared scale; no de-collision
  // nudging, no clamping — slopes stay truthful.
  const leftY = items.map((d) => yOf(d.left));
  const rightY = items.map((d) => yOf(d.right));

  // --- accessible summary ----------------------------------------------------
  const risers = items.filter((d) => d.right > d.left).length;
  const fallers = items.filter((d) => d.right < d.left).length;
  const summary =
    o.title ||
    `Slopegraph comparing ${items.length} item${items.length === 1 ? '' : 's'} from ` +
      `${o.leftLabel} to ${o.rightLabel}: ${risers} rose, ${fallers} fell.`;

  // --- emit ------------------------------------------------------------------
  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ` +
      `role="img" aria-label="${esc(summary)}" ` +
      `font-family="var(--tufte-font, inherit)" ` +
      `style="background:var(--tufte-bg, transparent)">`
  );
  parts.push(`<title>${esc(summary)}</title>`);

  // Period headers — column-aligned with the value labels beneath them.
  const headY = fs * 1.3;
  parts.push(
    `<text x="${xLeft}" y="${headY}" text-anchor="end" ` +
      `font-size="${fs}" font-weight="600" fill="var(--tufte-ink, #111)">${esc(o.leftLabel)}</text>`
  );
  parts.push(
    `<text x="${xRight}" y="${headY}" text-anchor="start" ` +
      `font-size="${fs}" font-weight="600" fill="var(--tufte-ink, #111)">${esc(o.rightLabel)}</text>`
  );

  const numFeat = "font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1";

  // Connectors first (sit behind labels).
  if (o.connectors) {
    items.forEach((d, i) => {
      const accent = d.highlight === true;
      const stroke = accent ? 'var(--tufte-accent, #c1351d)' : 'var(--tufte-muted, #999)';
      const sw = accent ? 1.4 : 0.75;
      parts.push(
        `<line x1="${xLeft}" y1="${leftY[i].toFixed(2)}" ` +
          `x2="${xRight}" y2="${rightY[i].toFixed(2)}" ` +
          `stroke="${stroke}" stroke-width="${sw}" />`
      );
    });
  }

  // Endpoint labels: "name  value" on the left (right-aligned into the gutter),
  // "value  name" on the right. Labels live on the data — no legend.
  items.forEach((d, i) => {
    const accent = d.highlight === true;
    const fill = accent ? 'var(--tufte-accent, #c1351d)' : 'var(--tufte-ink, #111)';
    const weight = accent ? '600' : '400';
    const valFill = accent ? fill : 'var(--tufte-muted, #999)';
    const ly = (leftY[i] + fs * 0.35).toFixed(2);
    const ry = (rightY[i] + fs * 0.35).toFixed(2);
    const gap = 6;

    // Left side: name then value, both right-anchored ending at xLeft-gap.
    parts.push(
      `<text x="${xLeft - gap}" y="${ly}" text-anchor="end" ` +
        `font-size="${fs}" font-weight="${weight}" fill="${fill}">` +
        `<tspan>${esc(d.name)}</tspan>` +
        `<tspan dx="8" style="${numFeat}" fill="${valFill}">${esc(o.format(d.left))}</tspan>` +
        `</text>`
    );
    // Right side: value then name, both left-anchored starting at xRight+gap.
    parts.push(
      `<text x="${xRight + gap}" y="${ry}" text-anchor="start" ` +
        `font-size="${fs}" font-weight="${weight}" fill="${fill}">` +
        `<tspan style="${numFeat}" fill="${valFill}">${esc(o.format(d.right))}</tspan>` +
        `<tspan dx="8">${esc(d.name)}</tspan>` +
        `</text>`
    );
  });

  parts.push('</svg>');
  return parts.join('');
}

// Dual-use export: CommonJS/node require() and browser global `slopegraph`.
if (typeof module !== 'undefined' && module.exports) module.exports = { slopegraph: slopegraph };
