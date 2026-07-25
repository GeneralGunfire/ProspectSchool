// ── FunctionGraph — shared interactive Cartesian-plane plotter ───────────────
// New for Term 2 (Functions/Trigonometry graphs) — the lesson engine had no
// graph-rendering component before this. Per
// .planning/research/LIBRARY_ALGEBRA_TERM2_RESEARCH.md Part B, interactive
// graph manipulation (parameter sliders, labelled features) is close to
// essential for teaching graph-based content, not decoration — so this is a
// real plotter, not a static image. Content files supply a plain function
// value (fn) plus feature/asymptote metadata; this component owns all
// rendering. Handles discontinuities (e.g. hyperbolas) by splitting the plot
// into separate line segments around each break point.

import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceDot, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { GraphSpec } from '../../data/library/types';

export function FunctionGraph({
  fn, domain, yDomain, discontinuities = [], features = [], asymptotes = [], slider, height = 240,
}: GraphSpec & { height?: number }) {
  const [sliderValue, setSliderValue] = useState(slider?.initial ?? 0);

  const segments = useMemo(() => {
    const [xMin, xMax] = domain;
    const steps = 200;
    const boundaries = [xMin, ...discontinuities.slice().sort((a, b) => a - b), xMax];
    const segs: { x: number; y: number }[][] = [];
    for (let i = 0; i < boundaries.length - 1; i++) {
      const segStart = boundaries[i];
      const segEnd = boundaries[i + 1];
      const pad = (segEnd - segStart) * 0.02;
      const s = segStart + (i > 0 ? pad : 0);
      const e = segEnd - (i < boundaries.length - 2 ? pad : 0);
      const pts: { x: number; y: number }[] = [];
      for (let j = 0; j <= steps; j++) {
        const x = s + (e - s) * (j / steps);
        const y = fn(x, sliderValue);
        if (Number.isFinite(y)) pts.push({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
      }
      segs.push(pts);
    }
    return segs;
  }, [fn, domain, discontinuities, sliderValue]);

  return (
    <div className="paper-card rounded overflow-hidden my-4">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart margin={{ top: 14, right: 24, bottom: 6, left: 0 }}>
            <CartesianGrid stroke="#eee" />
            <XAxis type="number" dataKey="x" domain={domain} allowDataOverflow tick={{ fontSize: 11 }} />
            <YAxis type="number" domain={yDomain ?? ['auto', 'auto']} tick={{ fontSize: 11 }} />
            <ReferenceLine x={0} stroke="#94a3b8" />
            <ReferenceLine y={0} stroke="#94a3b8" />
            {asymptotes.map((a, i) =>
              a.axis === 'x' ? (
                <ReferenceLine key={i} x={a.value} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: a.label, fontSize: 10, fill: '#b45309', position: 'top' }} />
              ) : (
                <ReferenceLine key={i} y={a.value} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: a.label, fontSize: 10, fill: '#b45309', position: 'right' }} />
              )
            )}
            {segments.map((seg, i) => (
              <Line key={i} data={seg} dataKey="y" type="monotone" dot={false} stroke="#1e293b" strokeWidth={2} isAnimationActive={false} />
            ))}
            {features.map((f, i) => (
              <ReferenceDot key={i} x={f.x} y={f.y} r={4} fill="#10b981" stroke="none" label={{ value: f.label, position: 'top', fontSize: 10, fill: '#047857' }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {slider && (
        <div className="px-4 py-3 border-t border-stone-100 bg-stone-50/60">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-bold text-stone-500">{slider.label}</p>
            <p className="text-[12px] font-black text-[#1e293b]">{sliderValue}</p>
          </div>
          <input
            type="range" min={slider.min} max={slider.max} step={slider.step} value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full accent-[#1e293b]"
          />
        </div>
      )}
    </div>
  );
}
