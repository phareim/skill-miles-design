/**
 * Range-frame scatter with dot-dash rugs.
 *
 * A scatterplot whose axes are deleted and replaced by:
 *   - Range-frames: each axis line spans only data min..max (not arbitrary round
 *     numbers), so the frame itself reports the data extent. The two frames are
 *     anchored at a common corner (px0, py0) so they always meet — no floating gap.
 *   - Dot-dash rugs: every datum projects a short tick onto each axis, turning
 *     the two axes into the marginal 1-D distributions of x and y. Coincident
 *     values STACK outward so overplotted points stay individually visible and
 *     the rug reports density faithfully.
 * Quartile labels (min, Q1, median, Q3, max) sit ON the frame — the axis
 * multifunctions as a five-number summary. The summary is computed over the
 * in-frame (robustly-scaled) data so the printed numbers reconcile with the
 * point cloud; any clipped extreme is reported separately, in words.
 *
 * To keep a single far outlier from rubber-banding the display, the value scale
 * is clipped to a Tukey fence; points beyond the fence are pinned to the frame
 * edge and drawn with an explicit "off-scale" caret + their true value, so the
 * outlier is shown without surrendering a third of the frame to whitespace.
 *
 * A highlighted point ("the moment of attention") is encoded redundantly: it is
 * NOT distinguished by color alone. It carries a hollow accent ring around a
 * solid core (a shape the eye reads in grayscale) and a bold, ink-colored label,
 * so it survives desaturation and colorblind reading.
 *
 * Pure function: (data, opts) => svgString. No DOM, no deps. Runs in node.
 *
 * @typedef {Object} Datum
 * @property {number} x            - x value (horizontal variable)
 * @property {number} y            - y value (vertical variable)
 * @property {string} [label]      - optional point label, set horizontally near the dot
 * @property {boolean}[highlight]  - if true, drawn with a redundant ring marker (use sparingly)
 *
 * @typedef {Object} Opts
 * @property {number} [width=720]          - viewBox width in user units
 * @property {number} [height=520]         - viewBox height in user units
 * @property {string} [xLabel='x']         - name of the x variable
 * @property {string} [yLabel='y']         - name of the y variable
 * @property {string} [xUnit='']           - unit suffix for x tick labels (e.g. ' kg')
 * @property {string} [yUnit='']           - unit suffix for y tick labels
 * @property {(n:number)=>string} [xFormat] - formatter for x numbers (default trims)
 * @property {(n:number)=>string} [yFormat] - formatter for y numbers
 * @property {string} [title]              - accessible title + summary (aria-label)
 * @property {string} [source]             - provenance line, set quietly bottom-left
 * @property {number} [dotR=2.2]           - scatter dot radius
 * @property {boolean}[clipOutliers=true]  - clip scales to a Tukey fence so one
 *                                           far point cannot rubber-band the frame
 * @property {{top:number,right:number,bottom:number,left:number}} [margin]
 *
 * @param {Datum[]} data
 * @param {Opts} [opts]
 * @returns {string} a complete <svg> string
 */
function rangeFrameScatter(data, opts) {
  opts = opts || {};
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('rangeFrameScatter: data must be a non-empty array of {x,y}');
  }

  var W = opts.width || 720;
  var H = opts.height || 520;
  var m = Object.assign({ top: 28, right: 92, bottom: 56, left: 64 }, opts.margin || {});
  var xLabel = opts.xLabel || 'x';
  var yLabel = opts.yLabel || 'y';
  var xUnit = opts.xUnit || '';
  var yUnit = opts.yUnit || '';
  var dotR = opts.dotR == null ? 2.2 : opts.dotR;
  var clipOutliers = opts.clipOutliers !== false;

  // --- helpers -------------------------------------------------------------
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function trimNum(n) {
    if (!isFinite(n)) return String(n);
    var s = (Math.abs(n) >= 1000)
      ? n.toFixed(0)
      : (Math.round(n * 100) / 100).toString();
    return s;
  }
  var fx = opts.xFormat || trimNum;
  var fy = opts.yFormat || trimNum;

  function clean(arr) {
    return arr.filter(function (v) { return typeof v === 'number' && isFinite(v); });
  }
  // five-number summary via linear-interpolated quantiles
  function quantile(sorted, p) {
    if (sorted.length === 1) return sorted[0];
    var idx = (sorted.length - 1) * p;
    var lo = Math.floor(idx), hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  }
  function fiveNum(values) {
    var s = clean(values).slice().sort(function (a, b) { return a - b; });
    return {
      min: s[0], q1: quantile(s, 0.25), med: quantile(s, 0.5),
      q3: quantile(s, 0.75), max: s[s.length - 1], sorted: s
    };
  }
  // Tukey fences over a sorted summary; returns the scale window [lo, hi]
  // that excludes far outliers so one point cannot stretch the frame. The
  // fences are snapped IN to the nearest actual datum so the frame end is a
  // real observation (a range-frame must terminate on a datum, not an
  // abstract fence number).
  function fence(s) {
    var iqr = s.q3 - s.q1;
    var lo = s.q1 - 1.5 * iqr, hi = s.q3 + 1.5 * iqr;
    var inLo = s.min, inHi = s.max;
    for (var i = 0; i < s.sorted.length; i++) {
      if (s.sorted[i] >= lo) { inLo = s.sorted[i]; break; }
    }
    for (var j = s.sorted.length - 1; j >= 0; j--) {
      if (s.sorted[j] <= hi) { inHi = s.sorted[j]; break; }
    }
    return { lo: inLo, hi: inHi };
  }

  var xs = data.map(function (d) { return d.x; });
  var ys = data.map(function (d) { return d.y; });
  var sxFull = fiveNum(xs), syFull = fiveNum(ys);

  // Scale window: clip to Tukey fences (snapped to real data) when enabled,
  // otherwise use the full extent.
  var xWin = clipOutliers ? fence(sxFull) : { lo: sxFull.min, hi: sxFull.max };
  var yWin = clipOutliers ? fence(syFull) : { lo: syFull.min, hi: syFull.max };

  // The summary we PRINT is computed over the in-frame data only, so the
  // five-number labels reconcile with the point cloud the eye actually sees.
  function inWindow(d) {
    return d.x >= xWin.lo && d.x <= xWin.hi && d.y >= yWin.lo && d.y <= yWin.hi;
  }
  var inFrameData = data.filter(function (d) {
    return typeof d.x === 'number' && isFinite(d.x) &&
           typeof d.y === 'number' && isFinite(d.y) && inWindow(d);
  });
  var summaryData = inFrameData.length ? inFrameData : data;
  var sx = fiveNum(summaryData.map(function (d) { return d.x; }));
  var sy = fiveNum(summaryData.map(function (d) { return d.y; }));

  // Plot area
  var px0 = m.left, px1 = W - m.right;       // left..right
  var py0 = H - m.bottom, py1 = m.top;       // bottom..top (py0 > py1)

  // Guard against degenerate ranges (all-equal): pad by 1 so scale is finite.
  function span(lo, hi) { return (hi - lo) || 1; }
  var xSpan = span(xWin.lo, xWin.hi);
  var ySpan = span(yWin.lo, yWin.hi);

  // scaleX/scaleY map the *window* to the full plot edges, so the frame fills
  // the panel and corners meet exactly at (px0, py0) / (px1, py1).
  function scaleX(v) { return px0 + (v - xWin.lo) / xSpan * (px1 - px0); }
  function scaleY(v) { return py0 + (v - yWin.lo) / ySpan * (py1 - py0); }
  // Clamp for off-scale points so they pin to the frame edge.
  function clampX(v) { return Math.max(px0, Math.min(px1, scaleX(v))); }
  function clampY(v) { return Math.max(py1, Math.min(py0, scaleY(v))); }

  // CSS-var-driven palette
  var INK = 'var(--tufte-ink, #111)';
  var MUTED = 'var(--tufte-muted, #999)';
  var ACCENT = 'var(--tufte-accent, #c1351d)';
  var BG = 'var(--tufte-bg, transparent)';
  var FONT = 'var(--tufte-font, inherit)';

  var parts = [];

  // --- range-frames (axes = data extent of the in-frame window) ------------
  // Both frames share the corner (px0, py0): the x-frame runs along y=py0 from
  // px0 to px1; the y-frame runs along x=px0 from py0 to py1. Because the scale
  // maps the window edges onto exactly these pixel coordinates, the frame ends
  // ARE the data window extent and the two frames always meet — no floating gap.
  // x range-frame along the bottom, spanning the x window
  parts.push('<line x1="' + px0 + '" y1="' + py0 + '" x2="' + px1 + '" y2="' + py0 +
    '" stroke="' + INK + '" stroke-width="1" />');
  // y range-frame along the left, spanning the y window
  parts.push('<line x1="' + px0 + '" y1="' + py0 + '" x2="' + px0 + '" y2="' + py1 +
    '" stroke="' + INK + '" stroke-width="1" />');

  // --- dot-dash rugs: each datum projects a tick onto each axis ------------
  // Rugs are the marginal 1-D distributions; they sit just outside the frame.
  // Coincident values STACK outward (one tick-pitch per overplotted point) so
  // the rug reports density faithfully instead of collapsing duplicates.
  var RUG = 6;
  var STACK = 2.0; // outward pitch per coincident datum
  var rug = [];
  function bucketKey(px) { return Math.round(px); }
  var xSeen = {}, ySeen = {};
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    if (typeof d.x === 'number' && isFinite(d.x)) {
      var rxx = clampX(d.x);
      var kx = bucketKey(rxx);
      var nx = xSeen[kx] || 0;
      var y0x = py0 + 4 + nx * STACK;
      rug.push('<line x1="' + rxx + '" y1="' + y0x + '" x2="' + rxx + '" y2="' + (y0x + RUG) +
        '" stroke="' + MUTED + '" stroke-width="0.75" />');
      xSeen[kx] = nx + 1;
    }
    if (typeof d.y === 'number' && isFinite(d.y)) {
      var ryy = clampY(d.y);
      var ky = bucketKey(ryy);
      var ny = ySeen[ky] || 0;
      var x0y = px0 - 4 - ny * STACK;
      rug.push('<line x1="' + x0y + '" y1="' + ryy + '" x2="' + (x0y - RUG) + '" y2="' + ryy +
        '" stroke="' + MUTED + '" stroke-width="0.75" />');
      ySeen[ky] = ny + 1;
    }
  }
  parts.push('<g aria-hidden="true">' + rug.join('') + '</g>');

  // --- quartile labels ON the frame (the axis IS the five-number summary) --
  // Numerals are set quietly, tabular, just beyond the rug.
  function xTick(val) {
    var X = scaleX(val);
    var t = fx(val) + xUnit;
    return '<text x="' + X + '" y="' + (py0 + 4 + RUG + 12) + '" text-anchor="middle" ' +
      'font-size="10" fill="' + MUTED + '" font-variant-numeric="tabular-nums">' + esc(t) + '</text>';
  }
  function yTick(val) {
    var Y = scaleY(val);
    var t = fy(val) + yUnit;
    return '<text x="' + (px0 - 4 - RUG - 5) + '" y="' + (Y + 3.2) + '" text-anchor="end" ' +
      'font-size="10" fill="' + MUTED + '" font-variant-numeric="tabular-nums">' + esc(t) + '</text>';
  }
  // Only label the five summary points — they are the most informative ticks.
  // Tag each with a priority: interior quartiles (Q1/med/Q3) are more
  // informative than the min/max extremes, so when two ticks crowd, dedup
  // keeps the higher-priority one.
  var xTicks = [
    { v: sx.min, pri: 0 }, { v: sx.q1, pri: 2 }, { v: sx.med, pri: 3 },
    { v: sx.q3, pri: 2 }, { v: sx.max, pri: 0 }
  ];
  var yTicks = [
    { v: sy.min, pri: 0 }, { v: sy.q1, pri: 2 }, { v: sy.med, pri: 3 },
    { v: sy.q3, pri: 2 }, { v: sy.max, pri: 0 }
  ];
  // De-dup near-coincident labels. When a new tick collides with one already
  // kept, keep whichever has the higher priority (interior quartile beats the
  // extreme), rather than blindly keeping the first / dropping the interior.
  function dedup(ticks, toPx) {
    var sorted = ticks.slice().sort(function (a, b) { return toPx(a.v) - toPx(b.v); });
    var out = [];
    for (var k = 0; k < sorted.length; k++) {
      var t = sorted[k];
      var p = toPx(t.v);
      var collided = false;
      for (var q = 0; q < out.length; q++) {
        if (Math.abs(toPx(out[q].v) - p) < 22) {
          collided = true;
          if (t.pri > out[q].pri) { out[q] = t; } // prefer the more informative tick
          break;
        }
      }
      if (!collided) out.push(t);
    }
    return out.map(function (t) { return t.v; });
  }
  var tg = [];
  dedup(xTicks, scaleX).forEach(function (v) { tg.push(xTick(v)); });
  var keptYTicks = dedup(yTicks, scaleY);
  keptYTicks.forEach(function (v) { tg.push(yTick(v)); });
  parts.push('<g>' + tg.join('') + '</g>');

  // --- variable names, set horizontally, directly labeling each frame ------
  // x name centered under the x frame; y name at the top of the y frame.
  var xMid = (px0 + px1) / 2;
  parts.push('<text x="' + xMid + '" y="' + (H - 14) + '" text-anchor="middle" ' +
    'font-size="12" fill="' + INK + '">' + esc(xLabel) + '</text>');
  // Protect the y variable-name from colliding with the topmost y-tick. The
  // name (12px) sits with baseline at py1 - 12 by default; the topmost tick
  // (10px, baseline scaleY(max)+3.2) has its cap near scaleY(max) - 7. When the
  // max point is near the frame top the two text boxes crowd. Require the name's
  // baseline (its visual bottom) to clear the top tick's cap by GAP px; if not,
  // lift the name above it.
  var GAP = 6;
  var yNameBaseline = py1 - 12;
  var topTickBaseline = keptYTicks.length
    ? Math.min.apply(null, keptYTicks.map(function (v) { return scaleY(v) + 3.2; }))
    : py1;
  var topTickCap = topTickBaseline - 10; // ~cap height of a 10px tick label
  if (yNameBaseline > topTickCap - GAP) {
    yNameBaseline = topTickCap - GAP;
  }
  parts.push('<text x="' + (px0 - 4) + '" y="' + yNameBaseline + '" text-anchor="start" ' +
    'font-size="12" fill="' + INK + '">' + esc(yLabel) + '</text>');

  // --- scatter dots + on-data labels ---------------------------------------
  // Off-scale points (beyond the clip window) are pinned to the frame edge and
  // drawn with a caret + their true value, so the outlier is reported without
  // letting it rubber-band the scale.
  var dots = [], labels = [], hi = [], offscale = [];
  for (var j = 0; j < data.length; j++) {
    var p = data[j];
    if (!(typeof p.x === 'number' && isFinite(p.x) && typeof p.y === 'number' && isFinite(p.y))) continue;
    var off = !inWindow(p);
    var cx = clampX(p.x), cy = clampY(p.y);

    if (off) {
      var dirY = p.y > yWin.hi ? -1 : (p.y < yWin.lo ? 1 : 0);
      var dirX = p.x > xWin.hi ? 1 : (p.x < xWin.lo ? -1 : 0);
      var caret;
      if (dirY !== 0) {
        var ty = cy + dirY * 6;
        caret = '<polyline points="' + (cx - 4) + ',' + cy + ' ' + cx + ',' + ty + ' ' + (cx + 4) + ',' + cy +
          '" fill="none" stroke="' + (p.highlight ? ACCENT : INK) + '" stroke-width="1.4" />';
      } else {
        var tx = cx + dirX * 6;
        caret = '<polyline points="' + cx + ',' + (cy - 4) + ' ' + tx + ',' + cy + ' ' + cx + ',' + (cy + 4) +
          '" fill="none" stroke="' + (p.highlight ? ACCENT : INK) + '" stroke-width="1.4" />';
      }
      offscale.push(caret);
      var trueVal = (dirY !== 0 ? fy(p.y) + yUnit : fx(p.x) + xUnit);
      var annoTxt = (p.label ? p.label + ' ' : '') + trueVal + ' (off-scale)';
      var ax = cx + (dirX !== 0 ? dirX * 8 : dotR + 4);
      var ay = cy + (dirY < 0 ? 12 : (dirY > 0 ? -6 : 3.2));
      offscale.push('<text x="' + ax + '" y="' + ay + '" font-size="10" ' +
        'font-weight="' + (p.highlight ? 600 : 400) + '" fill="' + INK + '" ' +
        'text-anchor="' + (dirX > 0 ? 'start' : (dirX < 0 ? 'end' : 'middle')) + '">' +
        esc(annoTxt) + '</text>');
      continue;
    }

    if (p.highlight) {
      // Redundant encoding: a hollow accent ring around a solid ink core. The
      // ring is a SHAPE difference the eye reads in grayscale; color is not the
      // sole cue. Label is bold + ink (not accent-only).
      hi.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + (dotR + 3.2) +
        '" fill="none" stroke="' + ACCENT + '" stroke-width="1.6" />');
      hi.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + dotR + '" fill="' + INK + '" />');
      if (p.label) {
        labels.push('<text x="' + (cx + dotR + 6) + '" y="' + (cy + 3.2) + '" font-size="11" ' +
          'font-weight="600" fill="' + INK + '">' + esc(p.label) + '</text>');
      }
    } else {
      dots.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + dotR + '" fill="' + INK + '" />');
      if (p.label) {
        labels.push('<text x="' + (cx + dotR + 4) + '" y="' + (cy + 3.2) + '" font-size="10" ' +
          'fill="' + MUTED + '">' + esc(p.label) + '</text>');
      }
    }
  }
  parts.push('<g>' + dots.join('') + '</g>');
  parts.push('<g>' + hi.join('') + '</g>');        // highlight ring on top
  parts.push('<g>' + offscale.join('') + '</g>');  // off-scale carets + values
  parts.push('<g>' + labels.join('') + '</g>');

  // --- provenance (quiet, bottom-left) -------------------------------------
  if (opts.source) {
    parts.push('<text x="' + px0 + '" y="' + (H - 1) + '" font-size="9" fill="' + MUTED + '">' +
      esc(opts.source) + '</text>');
  }

  // --- accessibility summary -----------------------------------------------
  // Summary describes the in-frame distribution and notes clipped extremes.
  var clippedX = sxFull.max > xWin.hi || sxFull.min < xWin.lo;
  var clippedY = syFull.max > yWin.hi || syFull.min < yWin.lo;
  var clipNote = '';
  if (clipOutliers && (clippedX || clippedY)) {
    var notes = [];
    if (clippedY) notes.push(yLabel + ' has off-scale value(s) up to ' + fy(syFull.max) + yUnit);
    if (clippedX) notes.push(xLabel + ' has off-scale value(s) up to ' + fx(sxFull.max) + xUnit);
    clipNote = ' ' + notes.join('; ') + ' (shown pinned to the frame edge).';
  }
  var summary = opts.title ||
    (xLabel + ' vs ' + yLabel + ': ' + data.length + ' points; ' +
     xLabel + ' (in-frame) ranges ' + fx(sx.min) + xUnit + ' to ' + fx(sx.max) + xUnit + ', median ' + fx(sx.med) + xUnit + '; ' +
     yLabel + ' (in-frame) ranges ' + fy(sy.min) + yUnit + ' to ' + fy(sy.max) + yUnit + ', median ' + fy(sy.med) + yUnit + '.' +
     clipNote);

  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" ' +
    'role="img" aria-label="' + esc(summary) + '" ' +
    'style="font-family:' + FONT + ';background:' + BG + ';max-width:100%;height:auto" ' +
    'font-family="' + FONT + '">' +
    '<title>' + esc(summary) + '</title>' +
    parts.join('') +
    '</svg>';
  return svg;
}

// Dual-use export: CommonJS/node require() and browser global `rangeFrameScatter`.
if (typeof module !== 'undefined' && module.exports) module.exports = { rangeFrameScatter: rangeFrameScatter };
