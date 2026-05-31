/**
 * sparkline — a word-sized inline line graphic (Tufte, Beautiful Evidence).
 *
 * No axes, no labels, no gridlines. Optional min/max/end dots and a paired
 * numeric value (start | sparkline | end). Pure SVG, zero dependencies,
 * no DOM access — safe to call in plain node or any server runtime.
 *
 * @param {Array<number|{v:number}|[any,number]>} data
 *        The series, oldest → newest. Accepts plain numbers, {v} objects,
 *        or [x, y] pairs (only y is used; x ordering is the caller's job).
 *        Non-finite points (null/NaN/Infinity) are treated as gaps: the pen
 *        lifts across them rather than inventing an interpolated value.
 *
 * @param {Object} [opts]
 * @param {number}  [opts.width=120]        Drawing width in viewBox units (the line band only).
 * @param {number}  [opts.height=20]        Drawing height (≈ x-height of body text).
 * @param {number}  [opts.strokeWidth=1]    Line weight; kept hairline by default.
 * @param {boolean} [opts.endDot=true]      Mark the final value with a dot.
 * @param {boolean} [opts.minMaxDots=false] Mark the min and max values with dots.
 * @param {boolean} [opts.band=false]       Draw a faint normal-range band (needs opts.normal).
 * @param {[number,number]} [opts.normal]   [lo, hi] reference band in data units, e.g. a target range.
 * @param {boolean} [opts.showValue=true]   Render the latest numeric value to the right of the line.
 * @param {boolean} [opts.showStart=false]  Render the first numeric value to the left of the line.
 * @param {number}  [opts.fontSize=12]      Type size for the inline numbers.
 * @param {(n:number)=>string} [opts.format] Number formatter for the paired values.
 * @param {[number,number]} [opts.domain]   Force the value range [min,max]; default is data extent.
 *                                          NOTE: sparklines show shape, not absolute level — the
 *                                          band is auto-fit by design. Pass a domain when stacking
 *                                          multiples that must share a scale (graphical integrity).
 *                                          When a domain is narrower than the data, the line band is
 *                                          clipped to its box so it never bleeds into surrounding text.
 * @param {string}  [opts.label]            Optional leading word/label set inline before the line.
 * @param {string}  [opts.ariaLabel]        Override the generated accessibility summary.
 * @returns {string} An <svg> string. role="img" with a <title> summary; scales via viewBox.
 *
 * Color/typography come from CSS custom properties so the graphic adopts its host:
 *   --tufte-ink (#111) line + latest value · --tufte-muted (#999) start value, band
 *   --tufte-accent (#c1351d) the end dot ONLY — the single point of attention
 *   --tufte-bg (transparent) · --tufte-font (inherit)
 */
function sparkline(data, opts) {
  opts = opts || {};

  // ---- normalize input to a flat array of numbers (NaN = gap) ----------
  var raw = Array.isArray(data) ? data : [];
  var ys = raw.map(function (d) {
    var n;
    if (d == null) n = NaN;
    else if (typeof d === 'number') n = d;
    else if (Array.isArray(d)) n = Number(d[d.length - 1]);
    else if (typeof d === 'object' && 'v' in d) n = Number(d.v);
    else n = Number(d);
    return Number.isFinite(n) ? n : NaN;
  });
  var finite = ys.filter(Number.isFinite);

  // ---- options with sane defaults --------------------------------------
  var W = num(opts.width, 120);
  var H = num(opts.height, 20);
  var sw = num(opts.strokeWidth, 1);
  var fontSize = num(opts.fontSize, 12);
  var endDot = opts.endDot !== false;
  var minMaxDots = opts.minMaxDots === true;
  var showValue = opts.showValue !== false && finite.length > 0;
  var showStart = opts.showStart === true && finite.length > 0;
  var band = opts.band === true && Array.isArray(opts.normal);
  var fmt = typeof opts.format === 'function' ? opts.format : defaultFormat;

  // ---- value scale (graphical integrity: lengths ∝ values) -------------
  var dataMin = finite.length ? Math.min.apply(null, finite) : 0;
  var dataMax = finite.length ? Math.max.apply(null, finite) : 1;
  var userDomain = Array.isArray(opts.domain);
  var lo, hi;
  if (userDomain) {
    lo = Number(opts.domain[0]);
    hi = Number(opts.domain[1]);
  } else {
    lo = dataMin;
    hi = dataMax;
    if (band) { lo = Math.min(lo, opts.normal[0]); hi = Math.max(hi, opts.normal[1]); }
  }
  if (!(hi > lo)) { hi = lo + 1; } // flat series: a centred horizontal line, no false amplitude

  // vertical padding so dots/strokes never clip at the band edges
  var pad = Math.max(sw, 2);
  var top = pad, bot = H - pad;
  function x(i) {
    if (ys.length <= 1) return W / 2;
    return (i / (ys.length - 1)) * W;
  }
  function y(v) {
    return bot - ((v - lo) / (hi - lo)) * (bot - top);
  }

  // ---- inline numbers (set horizontally, on the data, no legend) -------
  var startTxt = showStart ? fmt(firstFinite(ys)) : '';
  var endTxt = showValue ? fmt(lastFinite(ys)) : '';
  var labelTxt = opts.label != null ? String(opts.label) : '';

  var charW = fontSize * 0.62;        // tabular-ish advance estimate
  var gap = fontSize * 0.5;
  var labelW = labelTxt ? labelTxt.length * charW + gap : 0;
  var startW = startTxt ? startTxt.length * charW + gap : 0;
  var endW = endTxt ? gap + endTxt.length * charW : 0;

  var totalW = labelW + startW + W + endW;
  var lineX0 = labelW + startW;       // x origin of the line band
  var baseline = H / 2 + fontSize * 0.35; // optical centring of text

  // ---- index of the terminal (end-dot) point ---------------------------
  var iEnd = lastFiniteIndex(ys);

  // ---- build path with honest gaps -------------------------------------
  var d = '';
  var penDown = false;
  for (var i = 0; i < ys.length; i++) {
    if (Number.isFinite(ys[i])) {
      var px = round(lineX0 + x(i));
      var py = round(y(ys[i]));
      d += (penDown ? 'L' : 'M') + px + ' ' + py + ' ';
      penDown = true;
    } else {
      penDown = false; // lift the pen across missing data; do not interpolate
    }
  }
  d = d.trim();

  // ---- a stable clip id for the (optionally) clipped line band ---------
  // When the caller forces a domain narrower than the data, coordinates can
  // fall outside the box; clip the band so nothing bleeds into running text.
  var clipId = 'sl-clip-' + clipSeq();
  var needClip = userDomain;

  // ---- assemble layers (primary data dominates; refs recede) -----------
  var parts = [];

  // faint normal-range band — secondary, recedes (layering)
  if (band) {
    var by = round(y(opts.normal[1]));
    var bh = round(y(opts.normal[0]) - y(opts.normal[1]));
    if (bh > 0) {
      parts.push(
        '<rect x="' + round(lineX0) + '" y="' + by + '" width="' + round(W) +
        '" height="' + bh + '" fill="var(--tufte-muted, #999)" fill-opacity="0.14"/>'
      );
    }
  }

  if (labelTxt) {
    parts.push(text(0, baseline, labelTxt, 'var(--tufte-muted, #999)', fontSize, 'start'));
  }
  if (startTxt) {
    parts.push(text(labelW, baseline, startTxt, 'var(--tufte-muted, #999)', fontSize, 'start', true));
  }

  // The data line + its dots share one (optionally clipped) group, so when a
  // domain is forced an out-of-range value cannot draw outside the line band.
  var innerParts = [];

  // primary data: the line
  if (d) {
    innerParts.push(
      '<path d="' + d + '" fill="none" stroke="var(--tufte-ink, #111)" stroke-width="' +
      sw + '" stroke-linejoin="round" stroke-linecap="round"/>'
    );
  }

  // min / max dots — quiet, ink-coloured (these are data, not decoration).
  // Suppress the dot that coincides with the terminal point: the accent end
  // dot already marks it, and two stacked circles is redundant ink that
  // contradicts the single-point-of-attention rule.
  if (minMaxDots && finite.length) {
    var iMin = indexOfExtreme(ys, dataMin);
    var iMax = indexOfExtreme(ys, dataMax);
    var endTaken = endDot; // the end dot owns iEnd when present
    if (!(endTaken && iMax === iEnd)) {
      innerParts.push(dot(lineX0 + x(iMax), y(ys[iMax]), sw + 0.6, 'var(--tufte-ink, #111)'));
    }
    if (iMin !== iMax && !(endTaken && iMin === iEnd)) {
      innerParts.push(dot(lineX0 + x(iMin), y(ys[iMin]), sw + 0.6, 'var(--tufte-ink, #111)'));
    }
  }

  // the single accent: the latest value — the moment of attention
  if (endDot && finite.length) {
    innerParts.push(dot(lineX0 + x(iEnd), y(ys[iEnd]), sw + 1, 'var(--tufte-accent, #c1351d)'));
  }

  if (needClip && innerParts.length) {
    parts.push(
      '<clipPath id="' + clipId + '"><rect x="' + round(lineX0) + '" y="0" width="' +
      round(W) + '" height="' + round(H) + '"/></clipPath>' +
      '<g clip-path="url(#' + clipId + ')">' + innerParts.join('') + '</g>'
    );
  } else {
    parts.push.apply(parts, innerParts);
  }

  if (endTxt) {
    parts.push(text(lineX0 + W + gap, baseline, endTxt, 'var(--tufte-ink, #111)', fontSize, 'start', true));
  }

  // ---- accessibility summary -------------------------------------------
  var summary = opts.ariaLabel || buildAria(finite, fmt, labelTxt);

  return (
    '<svg xmlns="http://www.w3.org/2000/svg" role="img" ' +
    'viewBox="0 0 ' + round(totalW) + ' ' + round(H) + '" ' +
    'width="' + round(totalW) + '" height="' + round(H) + '" ' +
    'preserveAspectRatio="xMidYMid meet" ' +
    'style="display:inline-block;vertical-align:-' + round(H * 0.25) +
    'px;font-family:var(--tufte-font, inherit);background:var(--tufte-bg, transparent);' +
    'font-variant-numeric:tabular-nums" ' +
    'aria-label="' + esc(summary) + '">' +
    '<title>' + esc(summary) + '</title>' +
    parts.join('') +
    '</svg>'
  );

  // ---- helpers ----------------------------------------------------------
  function dot(cx, cy, r, fill) {
    return '<circle cx="' + round(cx) + '" cy="' + round(cy) + '" r="' +
      round(r) + '" fill="' + fill + '"/>';
  }
  function text(tx, ty, str, fill, fs, anchor, tabular) {
    return '<text x="' + round(tx) + '" y="' + round(ty) + '" font-size="' + fs +
      '" fill="' + fill + '" text-anchor="' + anchor + '"' +
      (tabular ? ' font-variant-numeric="tabular-nums"' : '') +
      '>' + esc(str) + '</text>';
  }
}

// ---- pure utilities (no closures over opts) -----------------------------
var _clipSeq = 0;
function clipSeq() { _clipSeq = (_clipSeq + 1) % 1000000; return _clipSeq; }
function num(v, dflt) { return Number.isFinite(Number(v)) ? Number(v) : dflt; }
function round(n) { return Math.round(n * 100) / 100; }
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function defaultFormat(n) {
  if (!Number.isFinite(n)) return '';
  var a = Math.abs(n);
  if (a >= 1000) return n.toLocaleString('en-US');
  if (a !== 0 && a < 1) return n.toFixed(2);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
function firstFinite(a) { for (var i = 0; i < a.length; i++) if (Number.isFinite(a[i])) return a[i]; return NaN; }
function lastFinite(a) { for (var i = a.length - 1; i >= 0; i--) if (Number.isFinite(a[i])) return a[i]; return NaN; }
function lastFiniteIndex(a) { for (var i = a.length - 1; i >= 0; i--) if (Number.isFinite(a[i])) return i; return -1; }
// Tolerant extreme finder: float === is brittle. Return the LAST index whose
// value is within a relative epsilon of the target extreme, so repeated
// extreme values resolve to the most recent (intuitive) point and never
// land on a stale early duplicate.
function indexOfExtreme(a, target) {
  var eps = (Math.abs(target) || 1) * 1e-9;
  var idx = -1;
  for (var i = 0; i < a.length; i++) {
    if (Number.isFinite(a[i]) && Math.abs(a[i] - target) <= eps) idx = i;
  }
  return idx >= 0 ? idx : 0;
}
function buildAria(finite, fmt, label) {
  if (!finite.length) return (label ? label + ': ' : '') + 'no data';
  var first = finite[0], last = finite[finite.length - 1];
  var min = Math.min.apply(null, finite), max = Math.max.apply(null, finite);
  var dir = last > first ? 'rising' : last < first ? 'falling' : 'flat';
  return (label ? label + ': ' : '') +
    'sparkline of ' + finite.length + ' points, ' + dir +
    ' from ' + fmt(first) + ' to ' + fmt(last) +
    ' (min ' + fmt(min) + ', max ' + fmt(max) + ').';
}

// Dual-use export: CommonJS/node require() and browser global `sparkline`.
if (typeof module !== 'undefined' && module.exports) module.exports = { sparkline: sparkline };
