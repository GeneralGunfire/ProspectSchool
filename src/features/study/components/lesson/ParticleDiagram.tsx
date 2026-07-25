// ── ParticleDiagram — shared particle/atomic model renderer ──────────────────
// New for Physical Sciences (Chemistry: states of matter, atomic structure).
// Two modes: 'state' renders a particle-spacing model (solid/liquid/gas);
// 'atom' renders a simple nucleus + electron-shell model. Plain SVG.

import type { AtomModelSpec, ParticleDiagramSpec } from '../../data/library/types';

function StateModel({ state, particleCount = 12 }: { state: 'solid' | 'liquid' | 'gas'; particleCount?: number }) {
  const width = 200, height = 140;
  let positions: { x: number; y: number }[] = [];

  if (state === 'solid') {
    const cols = 4, rows = 3;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push({ x: 30 + c * 45, y: 25 + r * 45 });
      }
    }
  } else if (state === 'liquid') {
    // Semi-random but deterministic clustered layout, still touching.
    const seedPositions = [
      [30, 30], [65, 40], [100, 25], [140, 35], [170, 55],
      [40, 75], [80, 85], [120, 70], [155, 95], [35, 115], [90, 120], [150, 115],
    ];
    positions = seedPositions.slice(0, particleCount).map(([x, y]) => ({ x, y }));
  } else {
    const seedPositions = [
      [20, 20], [150, 30], [80, 15], [170, 100], [30, 110],
      [110, 60], [60, 130], [180, 60], [10, 70], [130, 120], [95, 95], [160, 15],
    ];
    positions = seedPositions.slice(0, particleCount).map(([x, y]) => ({ x, y }));
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-xs h-auto">
      <rect x={1} y={1} width={width - 2} height={height - 2} fill="none" stroke="#cbd5e1" strokeWidth={1} rx={6} />
      {positions.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={11} fill="#bae6fd" stroke="#0369a1" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

function AtomModel({ protons, neutrons, electronsPerShell, label }: AtomModelSpec) {
  const size = 220;
  const cx = size / 2, cy = size / 2;
  const shellGap = 26;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs h-auto">
      {electronsPerShell.map((_, i) => (
        <circle key={i} cx={cx} cy={cy} r={30 + i * shellGap} fill="none" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} />
      ))}
      <circle cx={cx} cy={cy} r={20} fill="#fde68a" stroke="#b45309" strokeWidth={1.5} />
      <text x={cx} y={cy - 2} fontSize={10} fontWeight={700} textAnchor="middle" fill="#78350f">{protons}p⁺</text>
      <text x={cx} y={cy + 10} fontSize={10} fontWeight={700} textAnchor="middle" fill="#78350f">{neutrons}n</text>
      {electronsPerShell.map((count, shellIdx) => {
        const radius = 30 + shellIdx * shellGap;
        return Array.from({ length: count }, (_, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2;
          const ex = cx + radius * Math.cos(angle);
          const ey = cy + radius * Math.sin(angle);
          return <circle key={`${shellIdx}-${i}`} cx={ex} cy={ey} r={5} fill="#0369a1" />;
        });
      })}
      {label && <text x={cx} y={size - 6} fontSize={12} fontWeight={700} textAnchor="middle" fill="#1e293b">{label}</text>}
    </svg>
  );
}

export function ParticleDiagram(props: ParticleDiagramSpec) {
  return (
    <div className="paper-card rounded overflow-hidden my-4 p-3 flex justify-center">
      {props.mode === 'state'
        ? <StateModel state={props.state} particleCount={props.particleCount} />
        : <AtomModel {...props} />}
    </div>
  );
}
