/**
 * minimalTimeSeriesLine — Tufte minimal multi-series time-series line chart.
 *
 * A single or few series plotted over time with:
 *   - NO legend: each line is labeled directly at its right-hand end.
 *   - NO boxed frame: only range-frame axes spanning the actual data extent.
 *   - Faint, optional gridlines (off by default).
 *   - Sparse tick labels at the data's true min/max (and optionally extremes).
 *   - One accent color reserved for a single "moment of attention".
 *
 * Pure function. No DOM, no dependencies. Runnable in plain node.
 *
 * @typedef {Object} Point
 * @property {number|string|Date} x  Time value. number (ms epoch or any numeric),
 *                                    Date, or ISO-8601 string. Mixed types are coerced.
 * @property {number} y              Numeric magnitude.
 *
 * @typedef {Object} Series
 * @property {string} name           Series label (drawn at the line end).
 * @property {Point[]} points        Ordered (or unordered; sorted by x internally) points.
 * @property {boolean} [accent]      If true, this series is drawn in the accent color.
 *
 * @typedef {Object} Marker
 * @property {number|string|Date} x  Time of the moment of attention.
 * @property {number} y              Value at that moment.
 * @property {string} [label]        Short annotation set horizontally next to the dot.
 * @property {string} [seriesName]   Optional: which series this marker belongs to (for a11y text).
 *
 * @typedef {Object} Opts
 * @property {number} [width=720]            viewBox width (chart scales responsively).
 * @property {number} [height=320]           viewBox height.
 * @property {{top:number,right:number,bottom:number,left:number}} [margin]
 *                                           Defaults leave room for end-labels (right) and y ticks (left).
 * @property {string} [title]                Accessible title + aria-label summary.
 * @property {string} [yLabel]               Short unit/label drawn quietly above the y-axis top.
 * @property {(v:number)=>string} [yFormat]  Formats y tick + end-label values. Default: compact number.
 * @property {(x:number)=>string} [xFormat]  Formats x tick labels. Default: year or short date.
 * @property {boolean} [zeroBaseline=false]  Force y domain to include 0 (honesty for magnitude reads).
 * @property {boolean} [gridlines=false]     Draw faint horizontal reference lines at y ticks.
 * @property {number} [yTicks=2]             Approx number of interior y reference values (min/max always shown).
 * @property {Marker} [marker]               A single moment-of-attention dot + label, drawn in accent.
 * @property {string} [fontFamily]           Overrides --tufte-font fallback.
 *
 * @param {Series[]|Point[]} data  Either an array of Series, or a bare Point[] (treated as one unnamed series).
 * @param {Opts} [opts]
 * @returns {string} A complete, standalone <svg> string.
 */
function minimalTimeSeriesLine(data, opts) {
  opts = opts || {};

  // ---- normalize input ------------------------------------------------------
  /** @type {Series[]} */
  let series;
  if (Array.isArray(data) && data.length && data[0] && Array.isArray(data[0].points)) {
    series = /** @type {Series[]} */ (data);
  } else {
    series = [{ name: '', points: /** @type {Point[]} */ (data || []) }];
  }

  const toNum = (x) => {
    if (x instanceof Date) return x.getTime();
    if (typeof x === 'number') return x;
    const d = new Date(x);
    const t = d.getTime();
    return Number.isNaN(t) ? Number(x) : t;
  };

  series = series.map((s) => ({
    name: s.name || '',
    accent: !!s.accent,
    points: (s.points || [])
      .map((p) => ({ x: toNum(p.x), y: +p.y }))
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
      .sort((a, b) => a.x - b.x),
  })).filter((s) => s.points.length > 0);

  const W = opts.width || 720;
  const H = opts.height || 320;
  const m = Object.assign({ top: 24, right: 96, bottom: 30, left: 46 }, opts.margin || {});
  const plotW = Math.max(1, W - m.left - m.right);
  const plotH = Math.max(1, H - m.top - m.bottom);

  // ---- domains --------------------------------------------------------------
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (const s of series) for (const p of s.points) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
  }
  if (!series.length) { xMin = 0; xMax = 1; yMin = 0; yMax = 1; }
  if (opts.zeroBaseline) { yMin = Math.min(yMin, 0); yMax = Math.max(yMax, 0); }
  if (xMin === xMax) { xMin -= 1; xMax += 1; }
  if (yMin === yMax) { yMin -= 1; yMax += 1; }

  const sx = (x) => m.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => m.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  // ---- formatters -----------------------------------------------------------
  const compact = (v) => {
    const a = Math.abs(v);
    if (a >= 1e9) return (v / 1e9).toFixed(a >= 1e10 ? 0 : 1).replace(/\.0$/, '') + 'B';
    if (a >= 1e6) return (v / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
    if (a >= 1e3) return (v / 1e3).toFixed(a >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'k';
    if (a !== 0 && a < 1) return String(Math.round(v * 100) / 100);
    return String(Math.round(v * 10) / 10).replace(/\.0$/, '');
  };
  const yFormat = opts.yFormat || compact;

  // x labels: if values look like epoch ms (large), show year or M/D; else raw number.
  const looksTemporal = xMax > 1e11; // ~ 1973+ in epoch ms
  const defaultXFormat = (x) => {
    if (!looksTemporal) return compact(x);
    const d = new Date(x);
    const spanDays = (xMax - xMin) / 86400000;
    if (spanDays > 720) return String(d.getUTCFullYear());
    if (spanDays > 60) {
      const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()];
      return mo + ' ' + d.getUTCFullYear();
    }
    return (d.getUTCMonth() + 1) + '/' + d.getUTCDate();
  };
  const xFormat = opts.xFormat || defaultXFormat;

  // ---- y reference values: always min & max (range-frame), plus interior ----
  const yTicks = Math.max(0, opts.yTicks == null ? 2 : opts.yTicks | 0);
  const yVals = [yMin, yMax];
  for (let i = 1; i <= yTicks; i++) {
    const v = yMin + ((yMax - yMin) * i) / (yTicks + 1);
    yVals.push(v);
  }
  if (opts.zeroBaseline && yMin < 0 && yMax > 0) yVals.push(0);
  const uniqY = Array.from(new Set(yVals.map((v) => +v.toFixed(6)))).sort((a, b) => a - b);

  // ---- helpers --------------------------------------------------------------
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const r2 = (n) => Math.round(n * 100) / 100;
  const ink = 'var(--tufte-ink, #111)';
  const muted = 'var(--tufte-muted, #999)';
  const accent = 'var(--tufte-accent, #c1351d)';
  const bg = 'var(--tufte-bg, transparent)';
  const font = opts.fontFamily || 'var(--tufte-font, inherit)';

  // ---- accessible summary ---------------------------------------------------
  const summaryParts = series.map((s) => {
    const first = s.points[0], last = s.points[s.points.length - 1];
    const dir = last.y > first.y ? 'rising' : last.y < first.y ? 'falling' : 'flat';
    return (s.name ? s.name + ': ' : '') + dir + ' from ' + yFormat(first.y) + ' to ' + yFormat(last.y);
  });
  const title = opts.title ||
    ('Time series of ' + series.length + ' series, x ' + xFormat(xMin) + '–' + xFormat(xMax) + '. ' + summaryParts.join('; ') + '.');

  // ---- build SVG pieces -----------------------------------------------------
  const parts = [];

  parts.push(`<rect width="${W}" height="${H}" fill="${bg}"/>`);

  // optional faint gridlines (whisper, don't shout)
  if (opts.gridlines) {
    for (const v of uniqY) {
      const y = r2(sy(v));
      parts.push(`<line x1="${r2(m.left)}" y1="${y}" x2="${r2(m.left + plotW)}" y2="${y}" stroke="${muted}" stroke-width="0.5" opacity="0.25"/>`);
    }
  }

  // range-frame y-axis: a line spanning only [yMin, yMax]
  parts.push(`<line x1="${r2(m.left)}" y1="${r2(sy(yMax))}" x2="${r2(m.left)}" y2="${r2(sy(yMin))}" stroke="${muted}" stroke-width="1"/>`);
  // range-frame x-axis: a line spanning only [xMin, xMax]
  const baseY = r2(sy(uniqY[0]));
  parts.push(`<line x1="${r2(sx(xMin))}" y1="${baseY}" x2="${r2(sx(xMax))}" y2="${baseY}" stroke="${muted}" stroke-width="1"/>`);

  // y tick labels (right-aligned, quiet, tabular)
  for (const v of uniqY) {
    const y = r2(sy(v));
    parts.push(`<text x="${r2(m.left - 6)}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="${muted}" font-variant-numeric="tabular-nums" font-feature-settings="'tnum' 1">${esc(yFormat(v))}</text>`);
  }
  if (opts.yLabel) {
    parts.push(`<text x="${r2(m.left)}" y="${r2(m.top - 10)}" text-anchor="start" font-size="10" fill="${muted}">${esc(opts.yLabel)}</text>`);
  }

  // x tick labels at the true extremes only (range-frame discipline)
  parts.push(`<text x="${r2(sx(xMin))}" y="${r2(m.top + plotH + 16)}" text-anchor="start" font-size="10" fill="${muted}" font-variant-numeric="tabular-nums" font-feature-settings="'tnum' 1">${esc(xFormat(xMin))}</text>`);
  parts.push(`<text x="${r2(sx(xMax))}" y="${r2(m.top + plotH + 16)}" text-anchor="end" font-size="10" fill="${muted}" font-variant-numeric="tabular-nums" font-feature-settings="'tnum' 1">${esc(xFormat(xMax))}</text>`);

  // de-collision of end labels: track used y positions
  const usedLabelY = [];
  const placeLabelY = (yWanted) => {
    let y = yWanted;
    const minGap = 12;
    usedLabelY.sort((a, b) => a - b);
    for (const u of usedLabelY) {
      if (Math.abs(y - u) < minGap) y = u + minGap;
    }
    usedLabelY.push(y);
    return y;
  };

  // the data lines themselves — the only ink that should dominate
  for (const s of series) {
    const stroke = s.accent ? accent : ink;
    const sw = s.accent ? 1.6 : 1.2;
    const d = s.points.map((p, i) =>
      (i === 0 ? 'M' : 'L') + r2(sx(p.x)) + ' ' + r2(sy(p.y))).join(' ');
    parts.push(`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`);

    // direct label at the line's right end (no legend)
    const last = s.points[s.points.length - 1];
    if (s.name) {
      const ly = placeLabelY(sy(last.y));
      const labelText = s.name + '  ' + yFormat(last.y);
      parts.push(`<text x="${r2(sx(last.x) + 6)}" y="${r2(ly)}" dominant-baseline="middle" font-size="11" fill="${stroke}" font-variant-numeric="tabular-nums" font-feature-settings="'tnum' 1">${esc(labelText)}</text>`);
    } else {
      // unnamed single series: still show terminal value directly
      const ly = placeLabelY(sy(last.y));
      parts.push(`<text x="${r2(sx(last.x) + 6)}" y="${r2(ly)}" dominant-baseline="middle" font-size="11" fill="${stroke}" font-variant-numeric="tabular-nums" font-feature-settings="'tnum' 1">${esc(yFormat(last.y))}</text>`);
    }
  }

  // single moment of attention: accent dot + horizontal annotation
  if (opts.marker) {
    const mx = sx(toNum(opts.marker.x));
    const my = sy(+opts.marker.y);
    parts.push(`<circle cx="${r2(mx)}" cy="${r2(my)}" r="3" fill="${accent}"/>`);
    if (opts.marker.label) {
      const above = my - m.top > 24;
      const ty = above ? my - 8 : my + 16;
      parts.push(`<text x="${r2(mx)}" y="${r2(ty)}" text-anchor="middle" font-size="10.5" fill="${accent}">${esc(opts.marker.label)}</text>`);
    }
  }

  // ---- assemble -------------------------------------------------------------
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ` +
    `role="img" aria-label="${esc(title)}" ` +
    `font-family="${font}" style="max-width:100%;height:auto">` +
    `<title>${esc(title)}</title>` +
    parts.join('') +
    `</svg>`
  );
}

// Dual-use export: CommonJS/node require() and browser global `minimalTimeSeriesLine`.
if (typeof module !== 'undefined' && module.exports) module.exports = { minimalTimeSeriesLine: minimalTimeSeriesLine };
