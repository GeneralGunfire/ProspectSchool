import { useMemo } from 'react';

// Magic UI's BorderBeam effect: a light "comet" that appears to travel
// around the card's border. Implemented as a rotating conic-gradient
// layer masked down to a thin ring (via padding + mask-composite), which
// is the standard reliable technique — the earlier offset-path: rect(...)
// approach isn't valid CSS syntax and rendered as an unclipped rectangular
// block instead of a border animation. Pure CSS @keyframes (scoped via a
// unique class in an inline <style> tag), no global stylesheet changes.
interface BorderBeamProps {
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

let beamIdCounter = 0;

export const BorderBeam = ({
  duration = 8,
  delay = 0,
  colorFrom = '#38bdf8',
  colorTo = '#2563eb',
  borderWidth = 1.5,
}: BorderBeamProps) => {
  const id = useMemo(() => `dl-beam-${beamIdCounter++}`, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <style>{`
        @keyframes ${id} {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          padding: borderWidth,
          WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      >
        <div
          className="absolute inset-[-50%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 260deg, ${colorFrom} 300deg, ${colorTo} 330deg, transparent 360deg)`,
            animation: `${id} ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      </div>
    </div>
  );
};
