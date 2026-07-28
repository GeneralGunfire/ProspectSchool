import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

// Magic UI's MagicCard pattern: a mouse-tracking radial glow rendered as a
// gradient *border*, not just a background spotlight — gives cards a subtle
// "lit from within at the edge" feel on hover. Fully self-contained (inline
// styles + CSS vars scoped to this element), no global theme dependency.
interface MagicCardProps {
  children: ReactNode;
  className?: string;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientSize?: number;
}

export const MagicCard = ({
  children,
  className = '',
  gradientColor = '#38bdf8',
  gradientOpacity = 0.5,
  gradientSize = 240,
}: MagicCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [active, setActive] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative ${className}`}
    >
      {/* Border glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: active ? gradientOpacity : 0,
          background: `radial-gradient(${gradientSize}px circle at ${pos.x}px ${pos.y}px, ${gradientColor}, transparent 70%)`,
          WebkitMaskImage:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: 1.5,
        }}
      />
      {children}
    </div>
  );
};
