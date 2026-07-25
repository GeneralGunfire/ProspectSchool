// ── VennDiagram — shared two-set Venn diagram renderer ───────────────────────
// New for Term 3 (Probability). Plain SVG; two overlapping circles with
// optional region highlighting and count/label display in each region.

export interface VennRegionCounts {
  onlyA?: number;
  onlyB?: number;
  both?: number;
  neither?: number;
}

export type VennHighlight = 'A' | 'B' | 'intersection' | 'union' | 'complement' | 'none';

export function VennDiagram({
  labelA, labelB, counts, highlight = 'none', height = 220,
}: {
  labelA: string;
  labelB: string;
  counts?: VennRegionCounts;
  highlight?: VennHighlight;
  height?: number;
}) {
  const width = 360;
  const cx1 = 150, cx2 = 210, cy = 110, r = 80;

  const fillFor = (region: 'A' | 'B' | 'intersection' | 'outside') => {
    const isHighlighted =
      (highlight === 'A' && region === 'A') ||
      (highlight === 'B' && region === 'B') ||
      (highlight === 'intersection' && region === 'intersection') ||
      (highlight === 'union' && (region === 'A' || region === 'B' || region === 'intersection')) ||
      (highlight === 'complement' && region === 'outside');
    return isHighlighted ? '#fde68a' : region === 'outside' ? 'transparent' : '#e0f2fe';
  };

  return (
    <div className="paper-card rounded overflow-hidden my-4 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <rect x={4} y={4} width={width - 8} height={height - 8} fill={fillFor('outside')} stroke="#cbd5e1" strokeWidth={1} rx={8} />
        <circle cx={cx1} cy={cy} r={r} fill={fillFor('A')} stroke="#1e293b" strokeWidth={1.5} opacity={0.85} />
        <circle cx={cx2} cy={cy} r={r} fill={fillFor('B')} stroke="#1e293b" strokeWidth={1.5} opacity={0.85} />
        {(highlight === 'intersection' || highlight === 'union') && (
          <clipPath id="vennClip">
            <circle cx={cx1} cy={cy} r={r} />
          </clipPath>
        )}
        {highlight === 'intersection' && (
          <circle cx={cx2} cy={cy} r={r} fill="#fde68a" clipPath="url(#vennClip)" />
        )}
        <text x={cx1 - 50} y={40} fontSize={12} fontWeight={700} fill="#1e293b">{labelA}</text>
        <text x={cx2 + 30} y={40} fontSize={12} fontWeight={700} fill="#1e293b">{labelB}</text>
        {counts?.onlyA !== undefined && <text x={cx1 - 30} y={cy} fontSize={13} fontWeight={700} textAnchor="middle" fill="#0369a1">{counts.onlyA}</text>}
        {counts?.onlyB !== undefined && <text x={cx2 + 30} y={cy} fontSize={13} fontWeight={700} textAnchor="middle" fill="#0369a1">{counts.onlyB}</text>}
        {counts?.both !== undefined && <text x={(cx1 + cx2) / 2} y={cy} fontSize={13} fontWeight={700} textAnchor="middle" fill="#0369a1">{counts.both}</text>}
        {counts?.neither !== undefined && <text x={width - 30} y={height - 16} fontSize={13} fontWeight={700} textAnchor="middle" fill="#0369a1">{counts.neither}</text>}
      </svg>
    </div>
  );
}
