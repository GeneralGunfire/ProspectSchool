import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, useMotionValue, useAnimationFrame } from 'motion/react';

interface WaveBackgroundProps extends React.ComponentProps<'div'> {
  fill?: string;
  background?: string;
  direction?: 'down' | 'up';
  variant?: 'scroll' | 'ambient';
  height?: number;
  speed?: number;
  amplitude?: number;
}

// Builds a smooth wave path across a 0..1200 viewBox width. `phase` shifts the
// crest left/right, `amp` controls peak-to-trough height. The crest sits near
// one edge of the container and the fill extends to the opposite edge — so
// the shape reads as a curved edge of a solid block, not a thin ribbon
// floating in an otherwise-empty box. `direction="up"` is computed directly
// (crest near the bottom, fill extending up) rather than rotating the SVG,
// since rotating only the <svg> left the container's own CSS `background`
// unrotated and out of alignment with the curve, producing a visible seam.
function wavePath(amp: number, phase: number, h: number, direction: 'down' | 'up') {
  const base = direction === 'down' ? h * 0.35 : h * 0.65;
  const farEdge = direction === 'down' ? h : 0;
  const c1x = 300 + phase;
  const c2x = 900 + phase;
  return `M0,${base} C${c1x},${base - amp} ${c2x},${base + amp} 1200,${base} L1200,${farEdge} L0,${farEdge} Z`;
}

export const WaveBackground = ({
  fill = 'var(--color-brand-dark)',
  background = 'transparent',
  direction = 'down',
  variant = 'scroll',
  height = 64,
  speed = 1,
  amplitude = 12,
  className = '',
  ...props
}: WaveBackgroundProps) => {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Scroll-driven morph — tracks the section's position through the viewport
  // and eases the crest amplitude/phase with a spring so it settles rather
  // than snapping frame to frame. Writes the `d` attribute straight to the
  // DOM via the path ref instead of React state — a setState per scroll tick
  // would re-render this component on every frame of every scroll event on
  // the page, which is what was making the whole page feel janky.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const ampMV = useTransform(smooth, [0, 0.5, 1], [amplitude * 0.3, amplitude, amplitude * 0.3]);
  const phaseMV = useTransform(smooth, [0, 1], [-60, 60]);

  useEffect(() => {
    if (variant !== 'scroll' || reduced || !pathRef.current) return;
    pathRef.current.setAttribute('d', wavePath(ampMV.get(), phaseMV.get(), height, direction));
    const unsubAmp = ampMV.on('change', (amp) => {
      pathRef.current?.setAttribute('d', wavePath(amp, phaseMV.get(), height, direction));
    });
    const unsubPhase = phaseMV.on('change', (phase) => {
      pathRef.current?.setAttribute('d', wavePath(ampMV.get(), phase, height, direction));
    });
    return () => { unsubAmp(); unsubPhase(); };
  }, [variant, reduced, ampMV, phaseMV, height, direction]);

  // Ambient looping mode — continuous sine-driven phase via rAF, writing
  // straight to the DOM (no setState), paused off-screen via
  // IntersectionObserver so it costs nothing when scrolled away.
  const [ambientActive, setAmbientActive] = useState(false);

  useEffect(() => {
    if (variant !== 'ambient' || reduced) return;
    const el = containerRef.current;
    const observer = new IntersectionObserver(([entry]) => setAmbientActive(entry.isIntersecting));
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [variant, reduced]);

  useAnimationFrame((t) => {
    if (variant !== 'ambient' || reduced || !ambientActive || !pathRef.current) return;
    const phase = Math.sin((t / 1000) * speed) * 90;
    pathRef.current.setAttribute('d', wavePath(amplitude, phase, height, direction));
  });

  // Reduced motion / static variants: one-time static mid-morph shape.
  const staticPath = useMotionValue(wavePath(amplitude * 0.6, 0, height, direction));

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden leading-[0] ${className}`}
      style={{ height, background }}
      {...props}
    >
      <svg viewBox={`0 0 1200 ${height}`} preserveAspectRatio="none" className="w-full h-full">
        <motion.path ref={pathRef} d={reduced ? staticPath : undefined} fill={fill} />
      </svg>
    </div>
  );
};
