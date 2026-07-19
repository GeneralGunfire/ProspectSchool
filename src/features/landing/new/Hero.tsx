import { motion, useReducedMotion } from 'motion/react';
import { FadeIn } from './Animations';

const EASE = [0.23, 1, 0.32, 1] as const;

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Full-bleed video background — dark, moody, edge-to-edge behind the
          whole hero (navbar included), with a dark scrim so white text
          stays legible over the moving footage. */}
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'contrast(1.08) saturate(1.12) brightness(1.03)' }}
        poster="/hero-full.png"
      >
        <source src="/videos/hero-bg-2.mp4" type="video/mp4" />
      </video>
      {/* Faint vignette gives the footage more depth/polish, on top of the
          contrast/saturation boost applied directly to the video above. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 50% 30%, transparent 40%, rgba(0,0,0,0.35) 100%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/45"
      />

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 14 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <FadeIn delay={0.1}>
          <h1
            className="text-white text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] leading-[1.08] tracking-[-0.02em] font-extrabold text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Welcome to Prospect
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-5 text-white/80 text-[16px] sm:text-[18px] leading-relaxed max-w-xl mx-auto">
            The platform your school has been waiting for — marks, homework, and the road ahead, all in one place.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <button
            onClick={() => onNavigate('portal')}
            className="mt-9 inline-flex items-center justify-center bg-white text-brand-dark font-bold text-[14px] px-7 py-3.5 rounded-full hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
          >
            Get Started
          </button>
        </FadeIn>
      </motion.div>
    </section>
  );
};
