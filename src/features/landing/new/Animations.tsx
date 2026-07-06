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
// The bounding rect is cached on enter (not re-read on every move — avoids a
// forced synchronous layout on each mousemove tick) and property writes are
// batched to one per animation frame via rAF.
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const onMouseEnter = () => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const flush = () => {
    rafRef.current = null;
    const el = ref.current;
    const pending = pendingRef.current;
    if (!el || !pending) return;
    el.style.setProperty('--spot-x', `${pending.x}px`);
    el.style.setProperty('--spot-y', `${pending.y}px`);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = rectRef.current ?? ref.current?.getBoundingClientRect();
    if (!rect) return;
    rectRef.current = rect;
    pendingRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(flush);
  };

  return { ref, onMouseEnter, onMouseMove };
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
// Rect is cached on enter and property writes are batched to one per frame
// via rAF, so a fast mousemove burst doesn't force a layout read/write per event.
export function useParallax<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ nx: number; ny: number } | null>(null);

  const onMouseEnter = () => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const flush = () => {
    rafRef.current = null;
    const el = ref.current;
    const pending = pendingRef.current;
    if (!el || !pending) return;
    el.style.setProperty('--mx', String(pending.nx));
    el.style.setProperty('--my', String(pending.ny));
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = rectRef.current ?? ref.current?.getBoundingClientRect();
    if (!rect) return;
    rectRef.current = rect;
    pendingRef.current = {
      nx: (e.clientX - rect.left) / rect.width - 0.5,
      ny: (e.clientY - rect.top) / rect.height - 0.5,
    };
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(flush);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    pendingRef.current = null;
    if (!el) return;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  };

  return { ref, onMouseEnter, onMouseMove, onMouseLeave };
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
