// ── GeometricDiagram — shared static labelled-diagram renderer ───────────────
// New for Geometry (Euclidean + Analytical). Plain SVG. Content authors
// supply point coordinates directly (in an arbitrary local diagram space,
// not the Cartesian plane) — this stays a "marked-up diagram" tool distinct
// from FunctionGraph, per the research's finding that proof/rider practice
// needs precise static diagrams with tick marks, not a Cartesian plot.

import type { ReactElement } from 'react';
import type { DiagramSpec } from '../../data/library/types';

function tickMarksOnSegment(x1: number, y1: number, x2: number, y2: number, count: number) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = -dy / len, perpY = dx / len;
  const spacing = 5;
  const marks: ReactElement[] = [];
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * spacing;
    const cx = mx + (dx / len) * offset, cy = my + (dy / len) * offset;
    marks.push(
      <line key={i} x1={cx - perpX * 5} y1={cy - perpY * 5} x2={cx + perpX * 5} y2={cy + perpY * 5} stroke="#1e293b" strokeWidth={1.5} />
    );
  }
  return marks;
}

export function GeometricDiagram({ points, segments, angles = [], viewBox }: DiagramSpec) {
  const pointMap = new Map(points.map(p => [p.id, p]));
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const vb = viewBox ?? [Math.min(...xs) - 20, Math.min(...ys) - 20, Math.max(...xs) - Math.min(...xs) + 40, Math.max(...ys) - Math.min(...ys) + 40];

  return (
    <div className="paper-card rounded overflow-hidden my-4 p-3 flex justify-center">
      <svg viewBox={vb.join(' ')} className="w-full max-w-sm h-auto">
        {segments.map((s, i) => {
          const p1 = pointMap.get(s.from), p2 = pointMap.get(s.to);
          if (!p1 || !p2) return null;
          return (
            <g key={i}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#1e293b" strokeWidth={1.5} strokeDasharray={s.dashed ? '4 3' : undefined} />
              {s.ticks ? tickMarksOnSegment(p1.x, p1.y, p2.x, p2.y, s.ticks) : null}
              {s.parallelMarks ? (
                <text x={(p1.x + p2.x) / 2} y={(p1.y + p2.y) / 2 - 8} fontSize={10} fill="#0369a1" textAnchor="middle">
                  {'>'.repeat(s.parallelMarks)}
                </text>
              ) : null}
            </g>
          );
        })}
        {angles.map((a, i) => {
          const at = pointMap.get(a.at), from = pointMap.get(a.from), to = pointMap.get(a.to);
          if (!at || !from || !to) return null;
          const angle1 = Math.atan2(from.y - at.y, from.x - at.x);
          const angle2 = Math.atan2(to.y - at.y, to.x - at.x);
          const r = 16;
          const midAngle = (angle1 + angle2) / 2;
          const labelX = at.x + Math.cos(midAngle) * (r + 10);
          const labelY = at.y + Math.sin(midAngle) * (r + 10);
          if (a.rightAngle) {
            const s = 10;
            const p1x = at.x + Math.cos(angle1) * s, p1y = at.y + Math.sin(angle1) * s;
            const p2x = at.x + Math.cos(angle2) * s, p2y = at.y + Math.sin(angle2) * s;
            const cornerX = p1x + p2x - at.x, cornerY = p1y + p2y - at.y;
            return (
              <polyline key={i} points={`${p1x},${p1y} ${cornerX},${cornerY} ${p2x},${p2y}`} fill="none" stroke="#1e293b" strokeWidth={1.2} />
            );
          }
          return (
            <g key={i}>
              <path d={`M ${at.x + Math.cos(angle1) * r} ${at.y + Math.sin(angle1) * r} A ${r} ${r} 0 0 1 ${at.x + Math.cos(angle2) * r} ${at.y + Math.sin(angle2) * r}`} fill="none" stroke="#0369a1" strokeWidth={1.2} />
              {a.label && <text x={labelX} y={labelY} fontSize={10} fill="#0369a1" textAnchor="middle">{a.label}</text>}
            </g>
          );
        })}
        {points.map(p => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r={2.5} fill="#1e293b" />
            <text x={p.x + (p.labelOffset?.[0] ?? 8)} y={p.y + (p.labelOffset?.[1] ?? -8)} fontSize={12} fontWeight={700} fill="#1e293b">
              {p.label ?? p.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
