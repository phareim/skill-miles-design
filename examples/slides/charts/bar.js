/**
 * minimalBarChart — a Tufte-correct bar chart.
 *
 * Renders thin bars on a mandatory zero baseline, with each value printed
 * directly on the bar (no legend, no axis box, no gridlines). Optional faint
 * reference lines are erased INTO the bars (white) rather than drawn over them,
 * so the only grid-ink is negative space — there is no muted background grid
 * layer, and the empty gutters between bars carry no decoration at all. One bar
 * may be flagged for emphasis and is drawn in the accent colour at the moment
 * of attention.
 *
 * Pure function: no DOM, zero dependencies, deterministic. Runs in plain node.
 *
 * @typedef {Object} Datum
 * @property {string}  label        Category name (printed by each bar).
 * @property {number}  value        Magnitude. Bars start at zero; length is proportional to value.
 * @property {boolean} [emphasis]   If true, this bar + its value are drawn in --tufte-accent.
 *
 * @typedef {Object} Options
 * @property {number}  [width=640]        viewBox width in user units.
 * @property {number}  [height=320]       viewBox height in user units.
 * @property {string}  [title]            Chart title; also seeds the accessible name.
 * @property {string}  [unit='']          Suffix appended to value labels (e.g. '%', 'k').
 * @property {boolean} [horizontal=false] Lay bars out horizontally (good for long labels).
 * @property {number}  [gridStep]         If set, erase faint reference lines at multiples of this
 *                                        value INTO the bars (white) for legibility. No ink is
 *                                        drawn outside the bars.
 * @property {(n:number)=>string} [format] Value formatter. Defaults to en-US grouping.
 * @property {string}  [baselineLabel]    Optional caption printed at the zero baseline.
 *
 * @param {Datum[]} data  Non-empty array of categories.
 * @param {Options} [opts]
 * @returns {string} A complete, standalone <svg> string.
 */
function minimalBarChart(data, opts) {
  opts = opts || {};
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('minimalBarChart: data must be a non-empty array');
  }

  var W = opts.width != null ? opts.width : 640;
  var H = opts.height != null ? opts.height : 320;
  var title = opts.title || '';
  var unit = opts.unit || '';
  var horizontal = !!opts.horizontal;
  var gridStep = opts.gridStep;
  var baselineLabel = opts.baselineLabel || '';
  var fmt = typeof opts.format === 'function'
    ? opts.format
    : function (n) { return n.toLocaleString('en-US'); };

  // ---- escaping (no DOM available) -------------------------------------
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function num(n) { return (Math.round(n * 100) / 100).toString(); } // terse SVG
  function lbl(v) { return fmt(v) + unit; }

  // ---- integrity: domain MUST include zero -----------------------------
  var values = data.map(function (d) { return +d.value; });
  var maxV = Math.max.apply(null, values);
  var minV = Math.min.apply(null, values);
  var domainMax = Math.max(0, maxV); // zero baseline is mandatory
  var domainMin = Math.min(0, minV);
  var span = domainMax - domainMin || 1; // guard all-zero data

  // ---- layout -----------------------------------------------------------
  var m = horizontal
    ? { top: title ? 34 : 14, right: 56, bottom: baselineLabel ? 34 : 16, left: 96 }
    : { top: title ? 34 : 22, right: 16, bottom: baselineLabel ? 44 : 30, left: 14 };

  var plotW = W - m.left - m.right;
  var plotH = H - m.top - m.bottom;
  var n = data.length;

  // Thin bars: a slim bar inside a generous gutter. ~40% of band, capped at
  // 28u so wide charts stay hairline-thin and the gutter dominates.
  var band = (horizontal ? plotH : plotW) / n;
  var barThick = Math.max(3, Math.min(band * 0.4, 28));
  var bandPad = (band - barThick) / 2;

  function scale(v) { // value -> pixel along the measurement axis
    var t = (v - domainMin) / span; // 0..1
    return horizontal ? t * plotW : plotH - t * plotH;
  }
  var zeroPx = scale(0); // baseline position on the measurement axis

  var parts = [];

  // ---- reference lines, computed once ----------------------------------
  // These are never drawn as ink. They exist only as white gaps erased into
  // the bars below — the grid is negative space, never decoration in the gutters.
  var gridLines = [];
  if (gridStep && gridStep > 0) {
    var g = Math.ceil(domainMin / gridStep) * gridStep;
    for (; g <= domainMax + 1e-9; g += gridStep) {
      if (Math.abs(g) < 1e-9) continue; // zero is the baseline itself
      gridLines.push(g);
    }
  }

  // ---- bars + direct value labels + category labels --------------------
  data.forEach(function (d, i) {
    var v = +d.value;
    var bandStart = (horizontal ? m.top : m.left) + i * band + bandPad;
    var vPx = scale(v);
    var emphasis = !!d.emphasis;
    var fill = emphasis ? 'var(--tufte-accent, #c1351d)' : 'var(--tufte-ink, #111)';

    var x, y, w, h;
    if (horizontal) {
      y = bandStart; h = barThick;
      x = m.left + Math.min(zeroPx, vPx); w = Math.abs(vPx - zeroPx);
    } else {
      x = bandStart; w = barThick;
      y = m.top + Math.min(zeroPx, vPx); h = Math.abs(zeroPx - vPx);
    }

    parts.push('<rect x="' + num(x) + '" y="' + num(y) + '" width="' + num(w) +
      '" height="' + num(h) + '" fill="' + fill + '"/>');

    // erase reference lines INTO this bar (white) so the grid is negative space
    gridLines.forEach(function (gv) {
      var p = scale(gv);
      if (horizontal) {
        var gx = m.left + p;
        if (gx > x + 0.5 && gx < x + w - 0.5) {
          parts.push('<line x1="' + num(gx) + '" y1="' + num(y) +
            '" x2="' + num(gx) + '" y2="' + num(y + h) +
            '" stroke="var(--tufte-bg, #fff)" stroke-width="0.75"/>');
        }
      } else {
        var gy = m.top + p;
        if (gy > y + 0.5 && gy < y + h - 0.5) {
          parts.push('<line x1="' + num(x) + '" y1="' + num(gy) +
            '" x2="' + num(x + w) + '" y2="' + num(gy) +
            '" stroke="var(--tufte-bg, #fff)" stroke-width="0.75"/>');
        }
      }
    });

    // value label: directly on/above the bar, tabular numerals
    var valColor = emphasis ? 'var(--tufte-accent, #c1351d)' : 'var(--tufte-ink, #111)';
    if (horizontal) {
      var lx = m.left + vPx + (v >= 0 ? 5 : -5);
      var anchor = v >= 0 ? 'start' : 'end';
      parts.push('<text x="' + num(lx) + '" y="' + num(y + h / 2) +
        '" text-anchor="' + anchor + '" dominant-baseline="middle" font-size="11" ' +
        'font-variant-numeric="tabular-nums" fill="' + valColor + '">' + esc(lbl(v)) + '</text>');
      parts.push('<text x="' + num(m.left - 8) + '" y="' + num(y + h / 2) +
        '" text-anchor="end" dominant-baseline="middle" font-size="11" ' +
        'fill="var(--tufte-muted, #999)">' + esc(d.label) + '</text>');
    } else {
      var ly = v >= 0 ? (m.top + vPx - 5) : (m.top + vPx + 13);
      parts.push('<text x="' + num(x + w / 2) + '" y="' + num(ly) +
        '" text-anchor="middle" font-size="11" font-variant-numeric="tabular-nums" ' +
        'fill="' + valColor + '">' + esc(lbl(v)) + '</text>');
      parts.push('<text x="' + num(x + w / 2) + '" y="' + num(m.top + plotH + 14) +
        '" text-anchor="middle" font-size="11" fill="var(--tufte-muted, #999)">' +
        esc(d.label) + '</text>');
    }
  });

  // ---- the zero baseline: the single structural stroke we keep ---------
  if (horizontal) {
    parts.push('<line x1="' + num(m.left + zeroPx) + '" y1="' + num(m.top - 2) +
      '" x2="' + num(m.left + zeroPx) + '" y2="' + num(m.top + plotH + 2) +
      '" stroke="var(--tufte-ink, #111)" stroke-width="1"/>');
  } else {
    parts.push('<line x1="' + num(m.left) + '" y1="' + num(m.top + zeroPx) +
      '" x2="' + num(m.left + plotW) + '" y2="' + num(m.top + zeroPx) +
      '" stroke="var(--tufte-ink, #111)" stroke-width="1"/>');
  }
  if (baselineLabel) {
    if (horizontal) {
      parts.push('<text x="' + num(m.left + zeroPx) + '" y="' + num(m.top + plotH + 16) +
        '" text-anchor="middle" font-size="10" fill="var(--tufte-muted, #999)">' +
        esc(baselineLabel) + '</text>');
    } else {
      parts.push('<text x="' + num(m.left) + '" y="' + num(H - 8) +
        '" text-anchor="start" font-size="10" fill="var(--tufte-muted, #999)">' +
        esc(baselineLabel) + '</text>');
    }
  }

  // ---- title (integrated, flush left, not in a box) --------------------
  if (title) {
    parts.push('<text x="' + num(m.left) + '" y="18" text-anchor="start" ' +
      'font-size="13" fill="var(--tufte-ink, #111)">' + esc(title) + '</text>');
  }

  // ---- accessible summary ----------------------------------------------
  var summaryBits = data.map(function (d) { return d.label + ' ' + lbl(+d.value); });
  var aria = (title ? title + '. ' : 'Bar chart. ') + summaryBits.join(', ') + '.';

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + num(W) + ' ' + num(H) +
    '" role="img" aria-label="' + esc(aria) + '" ' +
    'font-family="var(--tufte-font, inherit)" style="background:var(--tufte-bg, transparent)">' +
    '<title>' + esc(aria) + '</title>' + parts.join('') + '</svg>';
}

// Dual-use export: CommonJS/node require() and browser global `minimalBarChart`.
if (typeof module !== 'undefined' && module.exports) module.exports = { minimalBarChart: minimalBarChart };
