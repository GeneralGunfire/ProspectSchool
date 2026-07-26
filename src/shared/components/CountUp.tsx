import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

// Animates a number counting up from 0 once mounted — same recipe as the
// landing page's CountUp (src/features/landing/new/Animations.tsx), ported
// here for the student portal's stat numbers (marks, merits, streaks).
// Snaps straight to the final value under prefers-reduced-motion.
export function CountUp({ value, suffix = '', duration = 1 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setDisplay(value); return; }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration]);

  return <span ref={ref}>{display}{suffix}</span>;
}
