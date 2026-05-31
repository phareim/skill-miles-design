/**
 * smallMultiples — a grid of tiny, identically-scaled line charts indexed by one
 * categorical variable (one panel per series). All panels share a single y-scale
 * so the eye compares magnitudes across the grid without re-reading axes.
 *
 * Tufte principles enforced:
 *  - Integrity: one shared (optionally zero-anchored) y-scale across every panel;
 *    a single lie factor for the whole grid; magnitudes strictly proportional.
 *  - Eraser: no panel borders, no tick boxes, no per-panel axes, no legend. The
 *    only non-data strokes are one hairline reference line and quiet labels.
 *  - Junk Hunter: no gridlines, gradients, shadows, 3D, or fills. Flat ink.
 *  - Densifier: repeated structure collapsed into a compact grid; many panels,
 *    each small but legible.
 *  - Comparison Architect: an optional shared reference (grand mean / target) is
 *    drawn faintly AND captioned in every panel as the "compared to what?".
 *  - Integrator: each panel is titled in place; the marked value is printed on
 *    the data, set horizontally, so number and mark are one object. The single
 *    point of attention per panel is the only crimson on the page, and its label
 *    is placed to never collide with the title, the reference caption, or the
 *    panel edges — flipping above/below and start/end as room demands.
 *
 * @param {Object} data
 * @param {string[]} data.x   Shared x labels, length N (e.g. months). Drives spacing.
 * @param {Array<{name:string, values:Array<number|null>}>} data.series  One object
 *        per panel; `values` aligns 1:1 with `data.x`. null/undefined = gap (line breaks).
 * @param {string} [data.xLabel]  Optional label for the shared x-axis (printed once).
 * @param {string} [data.unit]    Optional unit suffix on printed values (e.g. "%").
 *
 * @param {Object} [opts]
 * @param {number} [opts.columns]            Panels per row. Default ceil(sqrt(n)).
 * @param {number} [opts.panelWidth=180]     Inner width of one panel (viewBox units).
 * @param {number} [opts.panelHeight=64]     Inner height of one panel.
 * @param {number} [opts.gapX=28]            Horizontal gap between panels.
 * @param {number} [opts.gapY=34]            Vertical gap (room for in-place title).
 * @param {number} [opts.padding=16]         Outer padding around the grid.
 * @param {boolean} [opts.zeroBaseline=true] Anchor the shared y-scale at zero.
 * @param {"max"|"min"|"last"} [opts.mark="last"]  Which datum gets crimson dot+value.
 * @param {number} [opts.reference]          Shared reference value drawn in every panel.
 * @param {string} [opts.referenceLabel="ref"]  Label for the reference (printed in every panel).
 * @param {string} [opts.title]              Accessible figure title (<title>/aria-label).
 * @param {(v:number)=>string} [opts.format] Value formatter. Default: 3 sig digits.
 * @returns {string} A standalone, responsive SVG string. No DOM required.
 */
function smallMultiples(data, opts) {
  opts = opts || {};
  data = data || {};
  var x = Array.isArray(data.x) ? data.x : [];
  var series = Array.isArray(data.series) ? data.series : [];
  var N = x.length;

  var PW = num(opts.panelWidth, 180);
  var PH = num(opts.panelHeight, 64);
  var GX = num(opts.gapX, 28);
  var GY = num(opts.gapY, 34);
  var PAD = num(opts.padding, 16);
  var zeroBaseline = opts.zeroBaseline !== false;
  var markKind = opts.mark === "max" || opts.mark === "min" ? opts.mark : "last";
  var unit = typeof data.unit === "string" ? data.unit : "";
  var hasRef = typeof opts.reference === "number" && isFinite(opts.reference);
  var refVal = hasRef ? opts.reference : 0;
  var refLabel = typeof opts.referenceLabel === "string" ? opts.referenceLabel : "ref";

  var cols = opts.columns && opts.columns > 0
    ? Math.floor(opts.columns)
    : Math.max(1, Math.ceil(Math.sqrt(series.length)));
  var rows = Math.max(1, Math.ceil(series.length / cols));

  var fmt = typeof opts.format === "function" ? opts.format : defaultFormat;

  // ---- Shared y-domain across ALL panels (the heart of small multiples) ----
  var lo = Infinity, hi = -Infinity;
  for (var s = 0; s < series.length; s++) {
    var vs = series[s] && Array.isArray(series[s].values) ? series[s].values : [];
    for (var i = 0; i < vs.length; i++) {
      var v = vs[i];
      if (typeof v === "number" && isFinite(v)) {
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
  }
  if (!isFinite(lo) || !isFinite(hi)) { lo = 0; hi = 1; }
  if (hasRef) { if (refVal < lo) lo = refVal; if (refVal > hi) hi = refVal; }
  if (zeroBaseline && lo > 0) lo = 0;
  if (zeroBaseline && hi < 0) hi = 0;
  if (lo === hi) { hi = lo + 1; } // avoid divide-by-zero on flat data

  var domain = hi - lo;

  function px(i) { return N <= 1 ? 0 : (i / (N - 1)) * PW; }
  function py(v) { return PH - ((v - lo) / domain) * PH; }

  var totalW = PAD * 2 + cols * PW + (cols - 1) * GX;
  var totalH = PAD * 2 + rows * PH + (rows - 1) * GY;

  var ink = "var(--tufte-ink, #111)";
  var muted = "var(--tufte-muted, #999)";
  var accent = "var(--tufte-accent, #c1351d)";
  var font = "var(--tufte-font, inherit)";

  // Vertical headroom each panel reserves above its top edge (y=0) for the
  // in-place title baseline at y=-9 plus a couple px of cap-height. A mark
  // label placed above the dot must clear this band or it overplots the title.
  var TITLE_BAND = 7;        // px above y=0 occupied by the title row
  var LABEL_ASCENT = 9;      // px a 10px label rises above its baseline
  var LABEL_DROP = 11;       // baseline offset when the label sits below the dot

  var titleText = typeof opts.title === "string" && opts.title
    ? opts.title
    : buildAutoTitle(series, x, unit);

  var parts = [];
  parts.push(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      r2(totalW) + " " + r2(totalH) +
      '" role="img" aria-label="' + esc(titleText) +
      '" font-family="' + font +
      '" style="background:var(--tufte-bg, transparent)">'
  );
  parts.push("<title>" + esc(titleText) + "</title>");

  parts.push(
    '<g font-size="11" style="font-variant-numeric:tabular-nums;' +
      "-moz-font-feature-settings:'tnum';font-feature-settings:'tnum';" +
      'fill:' + ink + '">'
  );

  for (var pi = 0; pi < series.length; pi++) {
    var col = pi % cols;
    var row = Math.floor(pi / cols);
    var ox = PAD + col * (PW + GX);
    var oy = PAD + row * (PH + GY);
    var panel = series[pi] || { name: "", values: [] };
    var values = Array.isArray(panel.values) ? panel.values : [];

    parts.push('<g transform="translate(' + r2(ox) + "," + r2(oy) + ')">');

    // In-place panel title — label lives ON the data, not in a legend.
    parts.push(
      '<text x="0" y="-9" fill="' + ink + '" font-size="11.5">' +
        esc(String(panel.name)) + "</text>"
    );

    // Shared reference line (the "compared to what?") — faint, every panel.
    // We track its caption box so the mark label can de-conflict with it.
    var refCaptionLeft = Infinity, refCaptionRight = -Infinity;
    var refCaptionTop = Infinity, refCaptionBottom = -Infinity;
    var ry = 0, refDrawn = false;
    if (hasRef && refVal >= lo && refVal <= hi) {
      ry = py(refVal);
      refDrawn = true;
      parts.push(
        '<line x1="0" y1="' + r2(ry) + '" x2="' + r2(PW) + '" y2="' + r2(ry) +
          '" stroke="' + muted + '" stroke-width="0.75" stroke-dasharray="2 3"/>'
      );
      // Caption printed in EVERY panel so "compared to what?" is legible
      // everywhere, not just panel 0. Sit it just above the line at the right,
      // unless the line hugs the top edge — then drop it just below the line.
      var capAbove = ry - 2 >= LABEL_ASCENT + 1;
      var rcy = capAbove ? ry - 2 : ry + 9;
      var refW = approxTextWidth(refLabel, 9);
      refCaptionRight = PW;
      refCaptionLeft = PW - refW;
      refCaptionTop = rcy - (capAbove ? LABEL_ASCENT : 0);
      refCaptionBottom = rcy + (capAbove ? 0 : 2);
      parts.push(
        '<text x="' + r2(PW) + '" y="' + r2(rcy) +
          '" fill="' + muted + '" font-size="9" text-anchor="end">' +
          esc(refLabel) + "</text>"
      );
    }

    // The data line — broken across null gaps, no fill, single hairline.
    var d = buildPath(values, px, py);
    if (d) {
      parts.push(
        '<path d="' + d + '" fill="none" stroke="' + ink +
          '" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round"/>'
      );
    }

    // The single moment of attention per panel: one crimson dot + its value.
    var mIdx = pickMark(values, markKind);
    if (mIdx >= 0) {
      var mv = values[mIdx];
      var mx = px(mIdx);
      var my = py(mv);
      parts.push(
        '<circle cx="' + r2(mx) + '" cy="' + r2(my) +
          '" r="2.1" fill="' + accent + '"/>'
      );
      var label = fmt(mv) + unit;
      var lw = approxTextWidth(label, 10);

      // ---- Horizontal anchor: keep the whole label inside the panel ----
      // Prefer placing text to the right of the dot, but flip to the left if
      // that would clip the right edge; flip back to the right (or clamp) if a
      // left-anchored label would run off the left edge into the prior gap.
      var anchor, lx;
      var fitsRight = (mx + 4 + lw) <= PW;     // start-anchored label fits
      var fitsLeft = (mx - 4 - lw) >= 0;       // end-anchored label fits
      if (fitsRight) {
        anchor = "start"; lx = mx + 4;
      } else if (fitsLeft) {
        anchor = "end"; lx = mx - 4;
      } else {
        // Neither side fits cleanly (very wide label / dense grid): pin to
        // whichever edge leaves more room and clamp inside the panel.
        if (mx > PW / 2) { anchor = "end"; lx = PW; }
        else { anchor = "start"; lx = 0; }
      }

      // ---- Vertical placement: never overplot the in-place title ----
      // Default sits the label above the dot (baseline my - 4). If that band
      // would intrude on the title row at the top of the panel, drop the label
      // below the dot instead. This is the max-mark fix: a domain-max datum has
      // my ~ 0, so above-placement would land in the title.
      var ly = my - 4;
      var labelTop = ly - LABEL_ASCENT;
      if (labelTop < TITLE_BAND - PH) {
        // Above-placement would rise into (or above) the title band: go below.
        ly = my + LABEL_DROP;
        // If below would fall off the panel bottom, clamp back above the dot.
        if (ly > PH - 1) ly = Math.max(my - 4, LABEL_ASCENT);
      }

      // ---- De-conflict with the reference caption (top-right overlap) ----
      // Both the ref caption (end-anchored at x=PW) and a top/right mark label
      // can land near the top-right corner. If their boxes overlap, push the
      // mark label below its dot (or further down) to clear the caption.
      if (refDrawn) {
        var mlLeft = anchor === "end" ? lx - lw : lx;
        var mlRight = anchor === "end" ? lx : lx + lw;
        var mlTop = ly - LABEL_ASCENT;
        var mlBottom = ly;
        var overlapX = mlRight > refCaptionLeft - 1 && mlLeft < refCaptionRight + 1;
        var overlapY = mlBottom > refCaptionTop - 1 && mlTop < refCaptionBottom + 1;
        if (overlapX && overlapY) {
          ly = refCaptionBottom + LABEL_ASCENT + 2;
          if (ly > PH - 1) {
            // No room below the caption either: flip the label to the LEFT of
            // the dot at the dot's height, out from under the right-side caption.
            ly = clamp(my + 3, LABEL_ASCENT, PH - 1);
            anchor = "end";
            lx = Math.max(lw, mx - 4);
          }
        }
      }

      parts.push(
        '<text x="' + r2(lx) + '" y="' + r2(ly) +
          '" fill="' + accent + '" font-size="10" text-anchor="' + anchor + '">' +
          esc(label) + "</text>"
      );
    }

    parts.push("</g>"); // close this panel group
  }

  // Shared x-axis label, printed once under the grid (densify: no per-panel axes).
  if (data.xLabel || N > 0) {
    var capLeft = PAD;
    var capRight = PAD + cols * PW + (cols - 1) * GX;
    var capY = totalH - 4;
    var first = N > 0 ? String(x[0]) : "";
    var last = N > 0 ? String(x[N - 1]) : "";
    parts.push(
      '<text x="' + r2(capLeft) + '" y="' + r2(capY) +
        '" fill="' + muted + '" font-size="9">' + esc(first) + "</text>"
    );
    if (N > 1) {
      parts.push(
        '<text x="' + r2(capRight) + '" y="' + r2(capY) +
          '" fill="' + muted + '" font-size="9" text-anchor="end">' +
          esc(last) + "</text>"
      );
    }
    if (data.xLabel) {
      parts.push(
        '<text x="' + r2((capLeft + capRight) / 2) + '" y="' + r2(capY) +
          '" fill="' + muted + '" font-size="9" text-anchor="middle">' +
          esc(String(data.xLabel)) + "</text>"
      );
    }
  }

  parts.push("</g></svg>");
  return parts.join("");

  // ---- local helpers ----
  function buildPath(vals, fx, fy) {
    var seg = [], started = false, out = "";
    for (var k = 0; k < vals.length; k++) {
      var vv = vals[k];
      if (typeof vv === "number" && isFinite(vv)) {
        seg.push((started ? "L" : "M") + r2(fx(k)) + " " + r2(fy(vv)));
        started = true;
      } else {
        if (seg.length) out += seg.join(" ") + " ";
        seg = []; started = false;
      }
    }
    if (seg.length) out += seg.join(" ");
    return out.trim();
  }

  function pickMark(vals, kind) {
    var idx = -1, best = null;
    for (var k = 0; k < vals.length; k++) {
      var v = vals[k];
      if (typeof v !== "number" || !isFinite(v)) continue;
      if (kind === "last") { idx = k; continue; }
      if (best === null || (kind === "max" ? v > best : v < best)) { best = v; idx = k; }
    }
    return idx;
  }

  function defaultFormat(v) {
    if (!isFinite(v)) return "";
    var a = Math.abs(v);
    if (a !== 0 && (a >= 1e6 || a < 1e-3)) return String(Number(v.toPrecision(3)));
    return String(Number(v.toPrecision(3)));
  }

  function buildAutoTitle(ser, xs, u) {
    var n = ser.length;
    var span = xs.length > 1 ? (" from " + xs[0] + " to " + xs[xs.length - 1]) : "";
    return "Small multiples: " + n + " panel" + (n === 1 ? "" : "s") +
      ", shared scale" + span + (u ? " (" + u + ")" : "");
  }

  // Cheap, font-agnostic glyph-width estimate (DOM-free): average advance of
  // ~0.6em is a safe overestimate for proportional fonts, enough for layout
  // de-confliction without measuring real text.
  function approxTextWidth(str, fontSize) {
    return String(str).length * fontSize * 0.6;
  }

  function clamp(n2, min2, max2) {
    return n2 < min2 ? min2 : (n2 > max2 ? max2 : n2);
  }

  function num(val, dft) { return typeof val === "number" && isFinite(val) ? val : dft; }
  function r2(n2) { return Math.round(n2 * 100) / 100; }
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
}

// Dual-use export: CommonJS/node require() and browser global `smallMultiples`.
if (typeof module !== 'undefined' && module.exports) module.exports = { smallMultiples: smallMultiples };
