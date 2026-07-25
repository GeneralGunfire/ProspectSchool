// ── BoxPlot — shared five-number-summary box-and-whisker renderer ────────────
// New for Term 3 (Statistics) — no data-visualisation component existed
// before this (see FunctionGraph.tsx for the equivalent Term 2 gap). Plain
// SVG, not recharts, since a box plot's shape (whiskers/box/median line) is
// simpler to draw directly than to force through a charting library.
// Supports multiple plots stacked for comparison (e.g. two classes' scores).

export interface BoxPlotData {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export function BoxPlot({
  plots, domain, height = 90,
}: {
  plots: BoxPlotData[];
  domain: [number, number];
  height?: number;
}) {
  const [domMin, domMax] = domain;
  const width = 560;
  const margin = { left: 90, right: 20, top: 16, bottom: 28 };
  const plotW = width - margin.left - margin.right;
  const rowH = height;
  const scaleX = (v: number) => margin.left + ((v - domMin) / (domMax - domMin)) * plotW;

  const ticks = 6;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => domMin + ((domMax - domMin) * i) / ticks);

  return (
    <div className="paper-card rounded overflow-hidden my-4 p-3">
      <svg viewBox={`0 0 ${width} ${rowH * plots.length + margin.top + margin.bottom}`} className="w-full h-auto">
        {tickVals.map((t, i) => (
          <g key={i}>
            <line x1={scaleX(t)} x2={scaleX(t)} y1={margin.top - 4} y2={rowH * plots.length + margin.top} stroke="#f1f5f9" strokeWidth={1} />
            <text x={scaleX(t)} y={rowH * plots.length + margin.top + 16} fontSize={10} fill="#78716c" textAnchor="middle">{Number(t.toFixed(1))}</text>
          </g>
        ))}
        {plots.map((p, i) => {
          const cy = margin.top + rowH * i + rowH / 2;
          const boxH = 26;
          return (
            <g key={p.label}>
              <text x={8} y={cy + 4} fontSize={11} fontWeight={700} fill="#1e293b">{p.label}</text>
              <line x1={scaleX(p.min)} x2={scaleX(p.q1)} y1={cy} y2={cy} stroke="#1e293b" strokeWidth={1.5} />
              <line x1={scaleX(p.q3)} x2={scaleX(p.max)} y1={cy} y2={cy} stroke="#1e293b" strokeWidth={1.5} />
              <line x1={scaleX(p.min)} x2={scaleX(p.min)} y1={cy - boxH / 3} y2={cy + boxH / 3} stroke="#1e293b" strokeWidth={1.5} />
              <line x1={scaleX(p.max)} x2={scaleX(p.max)} y1={cy - boxH / 3} y2={cy + boxH / 3} stroke="#1e293b" strokeWidth={1.5} />
              <rect x={scaleX(p.q1)} y={cy - boxH / 2} width={scaleX(p.q3) - scaleX(p.q1)} height={boxH} fill="#e0f2fe" stroke="#1e293b" strokeWidth={1.5} rx={2} />
              <line x1={scaleX(p.median)} x2={scaleX(p.median)} y1={cy - boxH / 2} y2={cy + boxH / 2} stroke="#0369a1" strokeWidth={2.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
