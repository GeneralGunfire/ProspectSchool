import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { FadeIn } from './Animations';

const EASE = [0.23, 1, 0.32, 1] as const;

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const reduced = useReducedMotion();

  const VideoLayer = ({ className = '' }: { className?: string }) => (
    <video
      aria-hidden="true"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      style={{ filter: 'contrast(1.05) saturate(1.15) brightness(1.25)' }}
      poster="/hero-full.png"
    >
      <source src="/videos/hero-bg-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
      <source src="/videos/hero-bg-desktop.mp4" type="video/mp4" />
    </video>
  );

  return (
    <section className="relative overflow-hidden min-h-screen bg-[#050708] md:bg-transparent">

      {/* ───────────────────────── Mobile / tablet (< md) ─────────────────────────
          Untouched from the previous version — full-bleed video, centered
          copy, left-to-right + top/bottom scrim. */}
      <div className="md:hidden relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <VideoLayer />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 100% at 50% 30%, transparent 40%, rgba(0,0,0,0.35) 100%)' }}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <FadeIn delay={0.1}>
            <h1
              className="text-white text-[2.5rem] leading-[1.08] tracking-[-0.02em] font-extrabold text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Welcome to Prospect
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-5 text-white/80 text-[16px] leading-relaxed max-w-xl mx-auto">
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
      </div>

      {/* ───────────────────────── Desktop (md+) ─────────────────────────
          Full-width title treatment — no video, no side panel. Light
          surface so the alternation sequence starts light → dark down
          the page (LearnerFeatureCards, immediately below, is dark). */}
      <div className="bg-brand-bg hidden md:flex relative min-h-screen items-center justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 60% at 50% 40%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)' }}
        />

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative z-10 max-w-4xl mx-auto px-10 text-center"
        >
          <FadeIn delay={0.15}>
            <h1
              className="text-brand-dark text-[4rem] xl:text-[5rem] leading-none tracking-[-0.03em] font-extrabold text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every mark, every lesson,{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                  one platform.
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 14"
                  className="absolute left-0 -bottom-3 w-full h-3 text-amber-500/70"
                  preserveAspectRatio="none"
                >
                  <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="mt-8 text-brand-eyebrow text-[18px] xl:text-[19px] leading-relaxed max-w-2xl mx-auto">
              Marks, homework, and career guidance — together in one place, so students, teachers, and parents always know where things stand.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('portal')}
                className="group inline-flex items-center justify-center gap-2 bg-brand-dark text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:bg-brand-dark/90 active:scale-[0.97] transition-all cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate('careers')}
                className="inline-flex items-center justify-center gap-2 text-brand-dark/85 font-bold text-[14px] px-5 py-3.5 rounded-full border border-brand-border hover:bg-brand-dark/5 hover:border-brand-dark/25 active:scale-[0.97] transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                Explore Careers
              </button>
            </div>
          </FadeIn>
        </motion.div>
      </div>
    </section>
  );
};
