#!/usr/bin/env node
/*
 * build_charts.js — generates charts.html, a Miles-branded slide deck of the
 * seven Tufte chart recipes (from the tufte-viz skill, vendored in ./charts/).
 *
 * Each recipe is a pure (data, opts) => svgString that reads --tufte-* CSS
 * custom properties for colour and type. We render the SVGs at build time
 * (Node require isolates each recipe's scope — no global collisions) and inline
 * them into a 16:9 deck whose :root maps --tufte-* onto the Miles palette:
 *   ink → burgunder (never black) · accent → Miles-rød (the single accent,
 *   which is exactly Tufte's "one moment of attention") · font → DM Sans.
 *
 * Run:  node build_charts.js   (no dependencies)
 */
const fs = require('fs');
const path = require('path');
const C = require('./charts/index.js');

const pct = n => n + '%';

// ---------------------------------------------------------------- data (illustrative)
const fmtYear = x => String(x);

const lineSeries = [
  { name: 'Data og AI', accent: true, points: [
    { x: 2019, y: 18 }, { x: 2020, y: 26 }, { x: 2021, y: 38 }, { x: 2022, y: 55 },
    { x: 2023, y: 74 }, { x: 2024, y: 96 }, { x: 2025, y: 121 }, { x: 2026, y: 148 } ] },
  { name: 'Sky og plattform', points: [
    { x: 2019, y: 64 }, { x: 2020, y: 71 }, { x: 2021, y: 78 }, { x: 2022, y: 84 },
    { x: 2023, y: 90 }, { x: 2024, y: 97 }, { x: 2025, y: 104 }, { x: 2026, y: 110 } ] },
  { name: 'Strategisk IT', points: [
    { x: 2019, y: 41 }, { x: 2020, y: 44 }, { x: 2021, y: 46 }, { x: 2022, y: 48 },
    { x: 2023, y: 49 }, { x: 2024, y: 51 }, { x: 2025, y: 52 }, { x: 2026, y: 54 } ] },
];

const revenueByArea = [
  { label: 'Sky og plattform', value: 206 },
  { label: 'Data og AI', value: 188, emphasis: true },
  { label: 'Strategisk IT', value: 142 },
  { label: 'Brukeropplevelse', value: 97 },
  { label: 'Transformasjon', value: 88 },
];

const consultantsByOffice = [
  { label: 'Oslo', value: 121, baseline: 112 },
  { label: 'Bergen', value: 58, baseline: 54 },
  { label: 'Trondheim', value: 34, baseline: 30 },
  { label: 'Stavanger', value: 29, baseline: 31 },
  { label: 'Litauen', value: 26, baseline: 14, emphasis: true },
  { label: 'Ålesund', value: 12, baseline: 11 },
  { label: 'Haugesund', value: 9, baseline: 9 },
  { label: 'Innlandet', value: 8, baseline: 6 },
];

const aiAdoption = [
  { name: 'Data og AI', left: 62, right: 91, highlight: true },
  { name: 'Sky og plattform', left: 28, right: 54 },
  { name: 'Strategisk IT', left: 12, right: 38 },
  { name: 'Brukeropplevelse', left: 9, right: 31 },
  { name: 'Transformasjon', left: 5, right: 22 },
];

// project duration vs team size (one highlighted "sweet spot")
const projects = [
  { x: 2, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 10 }, { x: 4, y: 9 }, { x: 4, y: 14 },
  { x: 5, y: 12 }, { x: 5, y: 16 }, { x: 6, y: 13 }, { x: 6, y: 20 }, { x: 7, y: 18 },
  { x: 7, y: 24 }, { x: 8, y: 19 }, { x: 8, y: 28 }, { x: 9, y: 26 }, { x: 10, y: 31 },
  { x: 5, y: 11, label: 'Referanseprosjekt', highlight: true }, { x: 11, y: 38 },
  { x: 12, y: 34 }, { x: 4, y: 8 }, { x: 9, y: 22 },
];

const smYears = ['21', '22', '23', '24', '25', '26'];
const smSeries = [
  { name: 'Oslo', values: [98, 104, 109, 112, 117, 121] },
  { name: 'Bergen', values: [44, 47, 50, 54, 56, 58] },
  { name: 'Trondheim', values: [22, 25, 27, 30, 32, 34] },
  { name: 'Stavanger', values: [27, 28, 30, 31, 30, 29] },
  { name: 'Litauen', values: [4, 7, 10, 14, 20, 26] },
  { name: 'Ålesund', values: [8, 9, 10, 11, 12, 12] },
  { name: 'Haugesund', values: [6, 7, 8, 9, 9, 9] },
  { name: 'Innlandet', values: [3, 4, 5, 6, 7, 8] },
];

// ---------------------------------------------------------------- render charts
function safe(name, fn) {
  try { return fn(); }
  catch (e) { return `<p style="color:var(--miles-rod);font-family:var(--font-body)">‹ ${name}: ${e.message} ›</p>`; }
}

const kpis = [
  { name: 'Kundetilfredshet', series: [4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.6, 4.7], val: '4,7 / 5' },
  { name: 'Ansatte totalt', series: [210, 228, 241, 255, 268, 279, 288, 297], val: '297' },
  { name: 'Beleggsgrad', series: [88, 90, 86, 91, 93, 89, 92, 94], val: '94 %' },
  { name: 'eNPS', series: [31, 35, 40, 42, 46, 49, 52, 54], val: '54' },
];
const kpiRows = kpis.map(k => `
  <tr>
    <td class="kpi-name">${k.name}</td>
    <td class="kpi-spark">${safe('spark', () => C.sparkline(k.series, { width: 160, height: 26, showValue: false, endDot: true }))}</td>
    <td class="kpi-val">${k.val}</td>
  </tr>`).join('');

const charts = {
  line: safe('line', () => C.minimalTimeSeriesLine(lineSeries, {
    width: 980, height: 420, yLabel: 'ansatte', xFormat: fmtYear, yTicks: 2,
    marker: { x: 2022, y: 55, label: 'AI-satsing', seriesName: 'Data og AI' },
  })),
  bar: safe('bar', () => C.minimalBarChart(revenueByArea, {
    width: 980, height: 420, unit: ' MNOK', horizontal: true, gridStep: 50,
  })),
  dot: safe('dot', () => C.dotplotClevelandTufte(consultantsByOffice, {
    width: 900, valueCaption: '2025', baselineLabel: '2024',
  })),
  slope: safe('slope', () => C.slopegraph(aiAdoption, {
    width: 560, leftLabel: '2023', rightLabel: '2025', format: pct,
  })),
  scatter: safe('scatter', () => C.rangeFrameScatter(projects, {
    width: 940, height: 460, xLabel: 'Teamstørrelse', yLabel: 'Varighet',
    yUnit: ' uker',
  })),
  small: safe('small', () => C.smallMultiples(
    { x: smYears, series: smSeries, xLabel: 'år', unit: '' },
    { columns: 4, panelWidth: 200, panelHeight: 76, mark: 'last' })),
};

// ---------------------------------------------------------------- slide assembly
function chrome(dark) {
  const logo = dark ? 'miles-logo-cream' : 'miles-logo-red';
  return `<div class="chrome">
      <div class="menu"><span></span><span></span><span></span></div>
      <img class="wm" src="../../assets/logos/${logo}.png" alt="Miles">
    </div>`;
}
function slide(kicker, title, body, cap, cls = '') {
  return `
    <section class="slide ${cls}">
      ${chrome(cls.includes('flood'))}
      <div class="pad">
        <p class="kicker">${kicker}</p>
        <h2 class="s-title">${title}</h2>
        <div class="chart-area">${body}</div>
        ${cap ? `<p class="cap">${cap}</p>` : ''}
      </div>
    </section>`;
}

const slides = [
  // intro
  `<section class="slide flood-burg">
     ${chrome(true)}
     <div class="pad center-pad">
       <p class="kicker" style="color:#fbf0e5">Datagrafikk · Tufte × Miles</p>
       <h1 class="s-title" style="font-size:52px;color:#fbf0e5;max-width:20ch">Vis dataene. Bruk <span style="color:var(--miles-rod)">én</span> rød aksent.</h1>
       <p style="color:#fbf0e5;font-size:19px;max-width:42ch;margin-top:18px;font-family:var(--font-body)">Krem lerret, burgunder blekk, én Miles-rød per figur — på det ene punktet som fortjener blikket. Sju diagramtyper, ingen pynt.</p>
     </div>
   </section>`,
  slide('Nøkkeltall', 'Siste 8 kvartaler', `<table class="kpi">${kpiRows}</table>`,
        'Sparklines — ordstore figurer som viser formen på et tall der tallet står. Illustrativ data.'),
  slide('Utvikling over tid', 'Vi vokser — <span class="em-red">Data og AI</span> raskest', charts.line,
        'Linjediagram: 1–6 serier, direkte merket ved enden, ingen forklaringsboks. Illustrativ data.'),
  slide('Sammenligning', 'Omsetning per <span class="em-red">tjenesteområde</span>', charts.bar,
        'Stolper fra null, verdien trykt på stolpen. Én uthevet. Illustrativ data.'),
  slide('Rangering', 'Konsulenter per kontor, <span class="em-red">2025</span> mot 2024', charts.dot,
        'Punktdiagram (Cleveland): rangerer mange kategorier med en brøkdel av blekket. Illustrativ data.'),
  slide('Før og etter', 'Prosjekter med <span class="em-red">AI-komponent</span>', charts.slope,
        'Skråningsgraf: nivå, rang og endringstakt i ett blikk. Illustrativ data.'),
  slide('Korrelasjon', 'Varighet vs. teamstørrelse', charts.scatter,
        'Range-frame scatter med rug-fordelinger i margene. Ett uthevet referansepunkt. Illustrativ data.'),
  slide('Mange serier', 'Vekst per kontor', charts.small,
        'Small multiples: én rute per kontor, felles skala. Illustrativ data.'),
];

// ---------------------------------------------------------------- page
const html = `<!DOCTYPE html>
<html lang="no" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Miles — datagrafikk-maler (Tufte × Miles)</title>
<link rel="stylesheet" href="../../colors_and_type.css">
<link rel="stylesheet" href="../../components.css">
<style>
  /* Map the tufte-viz tokens onto the Miles palette. Tufte's single accent IS
     the Miles single-red rule; ink is burgundy (never black); type is DM Sans. */
  :root {
    --tufte-ink: var(--burgunder);
    --tufte-muted: var(--burgunder-tint-2);
    --tufte-faint: rgba(69,13,33,0.16);
    --tufte-accent: var(--miles-rod);
    --tufte-bg: transparent;
    --tufte-font: var(--font-body);
    --tufte-num: var(--font-body);
    --tufte-size: 15px;
    --tufte-size-sm: 12.5px;
    --tufte-stroke-data: 1.75px;
    --slide-w: 1280px; --slide-h: 720px; --mx: 80px; --my: 52px;
  }
  html, body { margin: 0; height: 100%; }
  .viewport { position: fixed; inset: 0; display: grid; place-items: center; overflow: hidden; background: #160710; }
  .stage { position: relative; width: var(--slide-w); height: var(--slide-h); transform-origin: center center; }
  .slide { position: absolute; inset: 0; background: var(--krem); overflow: hidden; display: none; }
  .slide.active { display: block; }
  .slide.flood-burg { background: var(--burgunder); }
  .pad { position: absolute; inset: var(--my) var(--mx); display: flex; flex-direction: column; }
  .center-pad { justify-content: center; }
  .chrome { position: absolute; top: 30px; left: var(--mx); right: var(--mx); display: flex; align-items: center; justify-content: space-between; z-index: 5; }
  .chrome .menu { display: flex; flex-direction: column; gap: 4px; }
  .chrome .menu span { width: 26px; height: 2px; background: var(--burgunder); border-radius: 2px; }
  .flood-burg .chrome .menu span { background: #fbf0e5; }
  .chrome .wm { height: 22px; width: auto; }
  .slide .kicker { font-size: 20px; margin-bottom: 4px; }
  .s-title { font-family: var(--font-display); font-weight: 500; letter-spacing: -0.01em; line-height: 1.04; margin: 0 0 18px; font-size: 34px; }
  .chart-area { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; }
  .chart-area .tufte-figure, .chart-area > svg, .chart-area > div { max-width: 100%; }
  .chart-area svg { max-height: 470px; width: 100%; height: auto; }
  .cap { font-family: var(--font-body); font-size: 13px; color: var(--fg-2); margin: 14px 0 0; }

  /* KPI / sparkline table */
  table.kpi { width: 100%; border-collapse: collapse; font-family: var(--font-body); }
  table.kpi td { padding: 16px 8px; border-bottom: 1px solid var(--border-1); vertical-align: middle; }
  .kpi-name { font-size: 22px; color: var(--fg-1); width: 38%; }
  .kpi-spark { text-align: center; }
  .kpi-spark svg { vertical-align: middle; }
  .kpi-val { text-align: right; font-size: 26px; font-weight: 600; color: var(--fg-1); font-variant-numeric: tabular-nums; width: 22%; }

  .nav { position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 50; }
  .nav button { all: unset; cursor: pointer; width: 9px; height: 9px; border-radius: 50%; background: rgba(251,240,229,0.35); transition: background .2s; }
  .nav button.on { background: var(--miles-rod); }
  .count { position: fixed; bottom: 16px; right: 20px; z-index: 50; font-family: var(--font-body); font-size: 12px; color: rgba(251,240,229,0.6); }
  .hint { position: fixed; bottom: 16px; left: 20px; z-index: 50; font-family: var(--font-body); font-size: 12px; color: rgba(251,240,229,0.45); }
</style>
</head>
<body>
<div class="viewport"><div class="stage" id="stage">
${slides.join('\n')}
</div></div>
<div class="nav" id="nav"></div>
<div class="count" id="count"></div>
<div class="hint">← →  ·  klikk</div>
<script>
  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.getElementById('stage'), nav = document.getElementById('nav'), count = document.getElementById('count');
  let i = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1)) || 1) - 1));
  slides.forEach((_, n) => { const b = document.createElement('button'); b.onclick = () => go(n); nav.appendChild(b); });
  const dots = [...nav.children];
  function fit() { stage.style.transform = 'scale(' + Math.min(innerWidth / 1280, innerHeight / 720) + ')'; }
  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    count.textContent = (i + 1) + ' / ' + slides.length;
    history.replaceState(null, '', '#' + (i + 1));
  }
  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { go(i + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(i - 1); e.preventDefault(); }
  });
  addEventListener('click', e => { if (!e.target.closest('.nav')) go(i + (e.clientX > innerWidth / 2 ? 1 : -1)); });
  addEventListener('resize', fit); fit(); go(i);
</script>
</body>
</html>`;

const out = path.join(__dirname, 'charts.html');
fs.writeFileSync(out, html);
console.log('wrote', out, '—', slides.length, 'slides');
