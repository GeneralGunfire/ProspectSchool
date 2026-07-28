import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';

// Magic UI's Meteors effect: diagonal falling light streaks, randomized
// per-mount. Pure CSS animation (keyframes injected via a <style> tag
// scoped with a unique class, not a global stylesheet edit) so this has
// no effect anywhere else in the app.
interface MeteorsProps {
  count?: number;
  className?: string;
  color?: string;
}

export const Meteors = ({ count = 16, className = '', color = '#38bdf8' }: MeteorsProps) => {
  const reduced = useReducedMotion();
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${5 + Math.random() * 4}s`,
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <style>{`
        @keyframes dl-meteor {
          0% { transform: rotate(35deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(35deg) translateX(-600px); opacity: 0; }
        }
      `}</style>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute top-0 h-0.5 w-0.5 rounded-full"
          style={{
            left: m.left,
            background: `linear-gradient(90deg, ${color}, transparent)`,
            animation: `dl-meteor ${m.duration} linear infinite`,
            animationDelay: m.delay,
          }}
        >
          <span
            className="absolute top-1/2 -translate-y-1/2 h-px w-12"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)`, right: 0 }}
          />
        </span>
      ))}
    </div>
  );
};
