/**
 * dotplotClevelandTufte — a Cleveland/Tufte dot plot as a pure SVG string.
 *
 * A dot plot ranks categories along one common, zero-anchored value scale: one
 * dot per category, sorted by value, with the value set directly beside the
 * dot (no legend, no bars, no grid). It replaces the bar chart for ranking
 * because a dot carries the same single number as a bar with a fraction of the
 * ink, and a column of dots makes ranking effortless for the eye.
 *
 * Direct labelling, not a legend: when a baseline series is supplied, the two
 * dots are explained in-row on the first row (the value dot and the hollow
 * baseline dot each get a small word right where they sit), never as a detached
 * corner key. Pass `valueCaption`/`baselineLabel` as plain words ("2024" /
 * "2023") — leading legend glyphs are stripped; the chart draws the real dots.
 *
 * Pure function: no DOM, no globals, no dependencies. Runs in plain node.
 *
 * @typedef {Object} DotDatum
 * @property {string} label      Category name (set horizontally beside the dot).
 * @property {number} value      The quantity. Must be finite.
 * @property {number} [baseline] Optional comparison value (e.g. last year / target).
 *                               Rendered as a hollow reference dot + connecting
 *                               rule, turning each row into a "compared to what?"
 *                               before/after pair.
 * @property {boolean} [emphasis] If true, this row is drawn in the accent colour
 *                               (the single moment of attention). At most one is
 *                               expected; multiple are allowed but dilute focus.
 *
 * @typedef {Object} DotplotOpts
 * @property {number}  [width=560]        viewBox width in user units.
 * @property {number}  [rowHeight=22]     Vertical pitch per category row.
 * @property {number}  [marginTop=34]     Space above first row (title/scale).
 * @property {number}  [marginBottom=14]  Space below last row.
 * @property {number}  [marginRight]      Right gutter for the value labels.
 *                                        Defaults to a width measured from the
 *                                        widest formatted value so labels never
 *                                        overflow back across the dots; a supplied
 *                                        value is floored at the measured need.
 * @property {number}  [labelWidth]       Left gutter for category labels.
 *                                        Defaults to ~38% of width.
 * @property {string}  [title]            Accessible title + visible heading.
 * @property {string}  [valueFormat]      'number' | 'percent' | 'currency'.
 * @property {function(number):string} [format] Custom value formatter; wins
 *                                        over valueFormat if supplied.
 * @property {string}  [unit='']          Suffix appended to formatted values
 *                                        (ignored when format/valueFormat given).
 * @property {boolean} [sort=true]        Sort descending by value before plotting.
 * @property {number}  [min=0]            Scale floor. Tufte integrity: keep at 0
 *                                        so dot position is proportional to value.
 *                                        A non-zero floor truncates the scale and
 *                                        exaggerates differences; when you set one
 *                                        the chart draws a visible "scale truncated
 *                                        at N" warning so the distortion is never
 *                                        silent.
 * @property {number}  [max]              Scale ceiling. Defaults to nice max of data.
 * @property {number}  [dotRadius=3.2]    Primary dot radius.
 * @property {string}  [baselineLabel]    Plain-word name for the baseline series
 *                                        (e.g. "2023"); shown in-row on the first
 *                                        row beside its hollow dot, only if any
 *                                        baseline is set.
 * @property {string}  [valueCaption]     Plain-word name for the value series
 *                                        (e.g. "2024"); shown in-row on the first
 *                                        row beside its filled dot, only with
 *                                        baselineLabel.
 *
 * @param {DotDatum[]} data
 * @param {DotplotOpts} [opts]
 * @returns {string} A complete, standalone <svg> string.
 */
function dotplotClevelandTufte(data, opts) {
  opts = opts || {};
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('dotplotClevelandTufte: data must be a non-empty array');
  }

  var rows = data.map(function (d, i) {
    if (!d || typeof d.label !== 'string') {
      throw new TypeError('dotplotClevelandTufte: each datum needs a string label (index ' + i + ')');
    }
    var v = Number(d.value);
    if (!isFinite(v)) {
      throw new TypeError('dotplotClevelandTufte: value must be finite (index ' + i + ')');
    }
    var b = (d.baseline == null) ? null : Number(d.baseline);
    if (b != null && !isFinite(b)) b = null;
    return { label: d.label, value: v, baseline: b, emphasis: !!d.emphasis };
  });

  var width = num(opts.width, 560);
  var rowH = num(opts.rowHeight, 22);
  var mTop = num(opts.marginTop, 34);
  var mBot = num(opts.marginBottom, 14);
  var dotR = num(opts.dotRadius, 3.2);
  var sort = opts.sort !== false;
  var hasBaseline = rows.some(function (r) { return r.baseline != null; });

  if (sort) rows = rows.slice().sort(function (a, b) { return b.value - a.value; });

  // Scale: zero-anchored by default (graphical integrity — position ∝ value).
  var dataValues = [];
  rows.forEach(function (r) {
    dataValues.push(r.value);
    if (r.baseline != null) dataValues.push(r.baseline);
  });
  var dataMin = Math.min.apply(null, dataValues);
  var dataMax = Math.max.apply(null, dataValues);
  // Truncation: a caller-set floor above the natural zero/data floor distorts
  // position. Detect it so we can both clamp nothing yet warn loudly.
  var truncated = (opts.min != null && Number(opts.min) > Math.min(0, dataMin));
  var min = (opts.min == null) ? Math.min(0, dataMin) : Number(opts.min);
  var max = (opts.max == null) ? niceCeil(dataMax) : Number(opts.max);
  if (max <= min) max = min + 1;

  var fmt = makeFormatter(opts);

  // Right gutter: measure the widest formatted value rather than trusting a
  // fixed default, so a wide label (e.g. $1,234,567) can never overflow left
  // across the dot field. A caller-supplied marginRight is honoured but floored
  // at the measured need.
  var valueStrings = rows.map(function (r) { return fmt(r.value); });
  var widestValue = valueStrings.reduce(function (a, b) {
    return textWidth(b, 11) > textWidth(a, 11) ? b : a;
  }, valueStrings[0]);
  var measuredRight = Math.ceil(textWidth(widestValue, 11)) + 12;
  var mRight = (opts.marginRight == null)
    ? measuredRight
    : Math.max(num(opts.marginRight, measuredRight), measuredRight);

  var height = mTop + rows.length * rowH + mBot;
  var lblW = num(opts.labelWidth, Math.round(width * 0.38));
  var plotLeft = lblW + 8;
  var plotRight = width - mRight;
  var plotW = Math.max(1, plotRight - plotLeft);

  function x(v) {
    var t = (v - min) / (max - min);
    if (t < 0) t = 0; else if (t > 1) t = 1;
    return plotLeft + t * plotW;
  }

  // ---- Accessible summary ----
  var top = rows.reduce(function (a, b) { return b.value > a.value ? b : a; }, rows[0]);
  var bottom = rows.reduce(function (a, b) { return b.value < a.value ? b : a; }, rows[0]);
  var titleText = opts.title || 'Dot plot of ' + rows.length + ' categories';
  var desc = titleText + '. ' + rows.length + ' categories on a common scale from ' +
    fmt(min) + ' to ' + fmt(max) + '. Highest: ' + top.label + ' at ' + fmt(top.value) +
    '. Lowest: ' + bottom.label + ' at ' + fmt(bottom.value) + '.' +
    (truncated ? ' Scale truncated at ' + fmt(min) + ' — positions exaggerate differences.' : '');

  // ---- Scale reference: a quiet range-frame at top (min, mid, max + 0) ----
  // 0 is always marked when it lies inside the scale, so the integrity anchor
  // never disappears once data goes negative.
  var tickValues = [min, (min + max) / 2, max];
  if (0 > min && 0 < max) tickValues.push(0);
  var ticks = [];
  tickValues.forEach(function (t) {
    var dup = ticks.some(function (u) { return Math.abs(x(u) - x(t)) < 14 && u !== 0 && t !== 0; });
    if (!dup) ticks.push(t);
  });
  var axisY = mTop - 12;

  var parts = [];

  parts.push(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height + '" ' +
    'role="img" aria-label="' + esc(desc) + '" ' +
    'font-family="var(--tufte-font, inherit)" ' +
    'style="max-width:100%;height:auto;background:var(--tufte-bg, transparent)">'
  );
  parts.push('<title>' + esc(desc) + '</title>');

  // Visible heading (integrator: words live on the surface). It sits in the left
  // gutter at y=14; nothing is drawn end-anchored on the right at that y, so a
  // long title can no longer collide with a corner caption — the old legend is
  // gone entirely.
  if (opts.title) {
    parts.push(
      '<text x="0" y="14" font-size="13" font-weight="600" ' +
      'fill="var(--tufte-ink, #111)">' + esc(opts.title) + '</text>'
    );
  }

  // Range-frame scale: labels + minimal tick whiskers, no full axis line. The 0
  // tick (when present) is drawn darker and as a dashed full-height reference —
  // the integrity anchor for negative data.
  ticks.forEach(function (t) {
    var tx = x(t);
    var isZero = (t === 0 && 0 > min && 0 < max);
    var col = isZero ? 'var(--tufte-ink, #111)' : 'var(--tufte-muted, #999)';
    parts.push(
      '<text x="' + r2(tx) + '" y="' + r2(axisY) + '" font-size="10" text-anchor="middle" ' +
      'fill="' + col + '" font-variant-numeric="tabular-nums">' + esc(fmt(t)) + '</text>'
    );
    parts.push(
      '<line x1="' + r2(tx) + '" y1="' + r2(axisY + 3) + '" x2="' + r2(tx) + '" y2="' +
      r2(isZero ? height - mBot : axisY + 6) +
      '" stroke="' + col + '" stroke-width="0.5"' +
      (isZero ? ' stroke-dasharray="1 3"' : '') + '/>'
    );
  });

  // Truncation warning: a non-zero floor distorts position, so say so on the surface.
  if (truncated) {
    parts.push(
      '<text x="' + r2(plotLeft) + '" y="' + r2(height - 2) + '" font-size="9" ' +
      'fill="var(--tufte-accent, #c1351d)">scale truncated at ' + esc(fmt(min)) +
      ' — differences exaggerated</text>'
    );
  }

  // ---- Rows ----
  rows.forEach(function (row, i) {
    var cy = mTop + i * rowH + rowH / 2;
    var ink = row.emphasis ? 'var(--tufte-accent, #c1351d)' : 'var(--tufte-ink, #111)';

    // Category label, right-aligned into the value column (label on the data).
    parts.push(
      '<text x="' + r2(lblW) + '" y="' + r2(cy) + '" font-size="11" text-anchor="end" ' +
      'dominant-baseline="middle" fill="' + ink + '">' + esc(row.label) + '</text>'
    );

    var vx = x(row.value);

    // Baseline pair: faint connecting rule + hollow reference dot ("compared to what?").
    if (row.baseline != null) {
      var bx = x(row.baseline);
      parts.push(
        '<line x1="' + r2(Math.min(vx, bx)) + '" y1="' + r2(cy) + '" x2="' + r2(Math.max(vx, bx)) +
        '" y2="' + r2(cy) + '" stroke="var(--tufte-muted, #999)" stroke-width="0.75"/>'
      );
      parts.push(
        '<circle cx="' + r2(bx) + '" cy="' + r2(cy) + '" r="' + r2(dotR) + '" ' +
        'fill="var(--tufte-bg, #fff)" stroke="var(--tufte-muted, #999)" stroke-width="1"/>'
      );
    }

    // Primary dot.
    parts.push(
      '<circle cx="' + r2(vx) + '" cy="' + r2(cy) + '" r="' + r2(dotR) + '" fill="' + ink + '"/>'
    );

    // Direct in-row labelling of the two series on the FIRST row only — the dots
    // are named where they sit, replacing the old corner legend.
    if (i === 0 && hasBaseline) {
      var vcap = stripGlyph(opts.valueCaption);
      var bcap = stripGlyph(opts.baselineLabel);
      if (vcap) {
        parts.push(
          '<text x="' + r2(vx) + '" y="' + r2(cy - dotR - 3) + '" font-size="9" ' +
          'text-anchor="middle" fill="var(--tufte-muted, #999)">' + esc(vcap) + '</text>'
        );
      }
      if (bcap && row.baseline != null) {
        var bx0 = x(row.baseline);
        parts.push(
          '<text x="' + r2(bx0) + '" y="' + r2(cy - dotR - 3) + '" font-size="9" ' +
          'text-anchor="middle" fill="var(--tufte-muted, #999)">' + esc(bcap) + '</text>'
        );
      }
    }

    // Direct value label, in the right gutter sized to fit, tabular numerals.
    parts.push(
      '<text x="' + r2(width) + '" y="' + r2(cy) + '" font-size="11" text-anchor="end" ' +
      'dominant-baseline="middle" fill="' + ink + '" font-variant-numeric="tabular-nums">' +
      esc(fmt(row.value)) + '</text>'
    );
  });

  parts.push('</svg>');
  return parts.join('');
}

// ---- helpers (module-private) ----
function num(v, dflt) { v = Number(v); return isFinite(v) ? v : dflt; }
function r2(n) { return Math.round(n * 100) / 100; }

// Approximate text width without a DOM: per-glyph em fractions tuned for a
// proportional sans. Good enough to size the right gutter so value labels never
// overflow back across the dots.
function textWidth(s, fontSize) {
  s = String(s);
  var w = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    if (c === ',' || c === '.' || c === ' ' || c === "'") w += 0.28;
    else if (/[0-9]/.test(c)) w += 0.56;
    else if (/[%$]/.test(c)) w += 0.6;
    else if (/[iljt]/.test(c)) w += 0.34;
    else if (/[mwMW]/.test(c)) w += 0.86;
    else w += 0.58;
  }
  return w * fontSize;
}

// Strip a leading legend glyph (●, ○, •, etc.) so callers can pass either
// "2024" or the old "● 2024" — we label in-row with the word only.
function stripGlyph(s) {
  if (s == null) return '';
  return String(s).replace(/^[\s●○•▪■□∘∙·]+/, '').trim();
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function niceCeil(v) {
  if (v <= 0) return 1;
  var mag = Math.pow(10, Math.floor(Math.log10(v)));
  var n = v / mag;
  var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * mag;
}

function makeFormatter(opts) {
  if (typeof opts.format === 'function') return opts.format;
  var unit = opts.unit || '';
  var kind = opts.valueFormat || 'number';
  return function (v) {
    var s;
    if (kind === 'percent') s = trim(v) + '%';
    else if (kind === 'currency') s = '$' + group(trim(v));
    else s = group(trim(v));
    return unit ? s + unit : s;
  };
}
function trim(v) {
  var r = Math.round(v * 100) / 100;
  return (Math.abs(r - Math.round(r)) < 1e-9) ? String(Math.round(r)) : String(r);
}
function group(s) {
  var parts = String(s).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// Dual-use export: CommonJS/node require() and browser global `dotplotClevelandTufte`.
if (typeof module !== 'undefined' && module.exports) module.exports = { dotplotClevelandTufte: dotplotClevelandTufte };
