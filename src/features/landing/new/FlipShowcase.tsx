import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useParallax } from './Animations';
import { ChaosCollage } from './ChaosCollage';
import { DashboardPreview } from './DashboardPreview';

const EASE = [0.4, 0, 0.2, 1] as const;
const SWITCH_MS = 3000;

// Alternates the hero visual between a cluttered "before" collage and the
// clean dashboard "after" — a 3D flip (rotateY through 90deg, where the face
// swaps) sells the idea that the mess literally turns into the product.
export const FlipShowcase = () => {
  const [showClean, setShowClean] = useState(false);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotion();
  const { ref: parallaxRef, onMouseEnter, onMouseMove, onMouseLeave } = useParallax<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause the flip cycle (and the CSS float loop inside DashboardPreview,
  // via the `paused` class) once this leaves the viewport — otherwise the
  // 3D flip + backdrop-filter cards keep compositing every 3s forever,
  // even while the user has scrolled well past the hero.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setShowClean(v => !v), SWITCH_MS);
    return () => clearTimeout(t);
  }, [showClean, inView]);

  const setRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    parallaxRef.current = el;
  };

  return (
    <div
      ref={setRefs}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative w-full max-w-135 aspect-4/5 mx-auto ${!inView ? 'paused' : ''}`}
      style={{ perspective: 1600 }}
    >
      {/* Status pill */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={showClean ? 'after' : 'before'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg ${
              showClean ? 'bg-accent text-accent-foreground' : 'bg-white text-red-500 border border-red-200'
            }`}
          >
            {showClean ? 'With Prospect' : 'Before Prospect'}
          </motion.span>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {showClean ? (
          <motion.div
            key="clean"
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
            initial={reduced ? { opacity: 0 } : { rotateX: -90, opacity: 0.6 }}
            animate={reduced ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { rotateX: 90, opacity: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <DashboardPreview standalone={false} />
          </motion.div>
        ) : (
          <motion.div
            key="chaos"
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
            initial={reduced ? { opacity: 0 } : { rotateX: 90, opacity: 0.6 }}
            animate={reduced ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { rotateX: -90, opacity: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ChaosCollage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
