import { motion, useInView, useReducedMotion, animate } from 'motion/react';
import { ReactNode, Key, useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  viewportOnce?: boolean;
  key?: Key;
}

const EASE = [0.23, 1, 0.32, 1] as const;

export const FadeIn = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  viewportOnce = true,
}: FadeInProps) => {
  const offsets = {
    up:    { y: 16 },
    down:  { y: -16 },
    left:  { x: 16 },
    right: { x: -16 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Cursor-tracking spotlight glow — the "feels expensive" hover trick used by
// Linear/Vercel/Stripe. Mutates a CSS custom property directly via ref instead
// of React state, so the mousemove handler never triggers a re-render.
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };
  return { ref, onMouseMove };
}

// Drop as the first child of the element returned by useSpotlight. Relies on
// that element also carrying `group/spot` in its className.
export const SpotlightGlow = ({ tone = 'accent' }: { tone?: 'accent' | 'white' }) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-0 group-hover/spot:opacity-100 transition-opacity duration-500 rounded-[inherit]"
    style={{
      background: `radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${
        tone === 'white' ? 'rgba(255,255,255,0.14)' : 'color-mix(in srgb, var(--color-accent) 30%, transparent)'
      }, transparent 70%)`,
    }}
  />
);

// Animates a number counting up from 0 once it scrolls into view. Snaps
// straight to the final value under prefers-reduced-motion.
export const CountUp = ({ value, suffix = '', duration = 1.4 }: { value: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
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
};

// Mouse-parallax for a group of floating elements. Mutates CSS custom
// properties directly (no React state), matching useSpotlight's approach —
// each floating child reads --mx/--my with its own depth multiplier via
// `translate(calc(var(--mx) * <depth>px), calc(var(--my) * <depth>px))`.
export function useParallax<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--mx', String(nx));
    el.style.setProperty('--my', String(ny));
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  };
  return { ref, onMouseMove, onMouseLeave };
}

export const StaggerContainer = ({
  children,
  className = '',
  delayStep = 0.05,
  initialDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  delayStep?: number;
  initialDelay?: number;
}) => (
  <div className={className}>
    {Array.isArray(children)
      ? children.map((child, i) => (
          <FadeIn key={i} delay={initialDelay + i * delayStep}>
            {child}
          </FadeIn>
        ))
      : children}
  </div>
);
