// ── CircuitDiagram — shared electric circuit renderer ────────────────────────
// New for Physical Sciences (Physics: Electric Circuits). Plain SVG. Content
// authors place components at fixed coordinates and connect them with
// wires — a static, labelled circuit diagram (not a live simulator),
// matching the same "precise marked-up diagram" philosophy as
// GeometricDiagram, but with circuit-specific symbols.

import type { ReactNode } from 'react';
import type { CircuitComponentSpec, CircuitSpec } from '../../data/library/types';

function ComponentSymbol({ c }: { c: CircuitComponentSpec }) {
  const r = c.rotation ?? 0;
  const wrap = (children: ReactNode) => (
    <g transform={`translate(${c.x},${c.y}) rotate(${r})`}>{children}</g>
  );

  switch (c.type) {
    case 'cell':
      return wrap(
        <g>
          <line x1={-12} y1={0} x2={-4} y2={0} stroke="#1e293b" strokeWidth={1.5} />
          <line x1={-4} y1={-10} x2={-4} y2={10} stroke="#1e293b" strokeWidth={3} />
          <line x1={4} y1={-5} x2={4} y2={5} stroke="#1e293b" strokeWidth={1.5} />
          <line x1={4} y1={0} x2={12} y2={0} stroke="#1e293b" strokeWidth={1.5} />
        </g>
      );
    case 'resistor':
      return wrap(
        <g>
          <line x1={-14} y1={0} x2={-8} y2={0} stroke="#1e293b" strokeWidth={1.5} />
          <polyline points="-8,0 -6,-6 -2,6 2,-6 6,6 8,0" fill="none" stroke="#1e293b" strokeWidth={1.5} />
          <line x1={8} y1={0} x2={14} y2={0} stroke="#1e293b" strokeWidth={1.5} />
        </g>
      );
    case 'lamp':
      return wrap(
        <g>
          <line x1={-14} y1={0} x2={-8} y2={0} stroke="#1e293b" strokeWidth={1.5} />
          <circle cx={0} cy={0} r={8} fill="#fef3c7" stroke="#1e293b" strokeWidth={1.5} />
          <line x1={-5.5} y1={-5.5} x2={5.5} y2={5.5} stroke="#1e293b" strokeWidth={1.2} />
          <line x1={-5.5} y1={5.5} x2={5.5} y2={-5.5} stroke="#1e293b" strokeWidth={1.2} />
          <line x1={8} y1={0} x2={14} y2={0} stroke="#1e293b" strokeWidth={1.5} />
        </g>
      );
    case 'switch':
      return wrap(
        <g>
          <line x1={-14} y1={0} x2={-8} y2={0} stroke="#1e293b" strokeWidth={1.5} />
          <circle cx={-8} cy={0} r={2} fill="#1e293b" />
          <circle cx={8} cy={0} r={2} fill="#1e293b" />
          <line x1={-8} y1={0} x2={8} y2={c.closed ? 0 : -10} stroke="#1e293b" strokeWidth={1.5} />
          <line x1={8} y1={0} x2={14} y2={0} stroke="#1e293b" strokeWidth={1.5} />
        </g>
      );
    case 'ammeter':
      return wrap(
        <g>
          <line x1={-14} y1={0} x2={-9} y2={0} stroke="#1e293b" strokeWidth={1.5} />
          <circle cx={0} cy={0} r={9} fill="#e0f2fe" stroke="#1e293b" strokeWidth={1.5} />
          <text x={0} y={4} fontSize={10} fontWeight={700} textAnchor="middle" fill="#0369a1">A</text>
          <line x1={9} y1={0} x2={14} y2={0} stroke="#1e293b" strokeWidth={1.5} />
        </g>
      );
    case 'voltmeter':
      return wrap(
        <g>
          <line x1={-14} y1={0} x2={-9} y2={0} stroke="#1e293b" strokeWidth={1.5} />
          <circle cx={0} cy={0} r={9} fill="#fce7f3" stroke="#1e293b" strokeWidth={1.5} />
          <text x={0} y={4} fontSize={10} fontWeight={700} textAnchor="middle" fill="#be185d">V</text>
          <line x1={9} y1={0} x2={14} y2={0} stroke="#1e293b" strokeWidth={1.5} />
        </g>
      );
    default:
      return wrap(<circle cx={0} cy={0} r={2} fill="#1e293b" />);
  }
}

export function CircuitDiagram({ components, wires, viewBox }: CircuitSpec) {
  const map = new Map(components.map(c => [c.id, c]));
  const xs = components.map(c => c.x), ys = components.map(c => c.y);
  const vb = viewBox ?? [Math.min(...xs) - 30, Math.min(...ys) - 30, Math.max(...xs) - Math.min(...xs) + 60, Math.max(...ys) - Math.min(...ys) + 60];

  return (
    <div className="paper-card rounded overflow-hidden my-4 p-3 flex justify-center">
      <svg viewBox={vb.join(' ')} className="w-full max-w-sm h-auto">
        {wires.map((w, i) => {
          const a = map.get(w.from), b = map.get(w.to);
          if (!a || !b) return null;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#1e293b" strokeWidth={1.5} />;
        })}
        {components.map(c => <ComponentSymbol key={c.id} c={c} />)}
        {components.filter(c => c.label).map(c => (
          <text key={`${c.id}-label`} x={c.x} y={c.y - 16} fontSize={10} fontWeight={700} textAnchor="middle" fill="#1e293b">{c.label}</text>
        ))}
      </svg>
    </div>
  );
}
