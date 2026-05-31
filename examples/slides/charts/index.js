// tufte-viz · chart recipes barrel (CommonJS).
// Each chart is a pure (data, opts) => svgString function, zero dependencies.

const { sparkline } = require('./sparkline.js');
const { minimalTimeSeriesLine } = require('./line.js');
const { minimalBarChart } = require('./bar.js');
const { dotplotClevelandTufte } = require('./dot-plot.js');
const { slopegraph } = require('./slopegraph.js');
const { rangeFrameScatter } = require('./scatter.js');
const { smallMultiples } = require('./small-multiples.js');

module.exports = { sparkline, minimalTimeSeriesLine, minimalBarChart, dotplotClevelandTufte, slopegraph, rangeFrameScatter, smallMultiples };
