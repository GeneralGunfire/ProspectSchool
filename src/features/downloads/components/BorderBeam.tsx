import { motion } from 'motion/react';

// Magic UI's BorderBeam, adapted: a light "comet" traveling around the
// card's border on an SVG-offset-path animation. All styling is inline/
// component-scoped (no shadcn theme tokens), so this has zero effect
// outside wherever it's mounted — safe to use without touching the app's
// existing global design system.
interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export const BorderBeam = ({
  size = 180,
  duration = 8,
  delay = 0,
  colorFrom = '#38bdf8',
  colorTo = '#2563eb',
}: BorderBeamProps) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
    <motion.div
      className="absolute aspect-square"
      style={{
        width: size,
        offsetPath: `rect(0% auto auto 0% round ${size}px)`,
        background: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, transparent)`,
      }}
      initial={{ offsetDistance: '0%' }}
      animate={{ offsetDistance: '100%' }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  </div>
);
