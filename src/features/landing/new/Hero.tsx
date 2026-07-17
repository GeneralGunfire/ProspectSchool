import { motion, useReducedMotion } from 'motion/react';
import { FadeIn } from './Animations';

const EASE = [0.23, 1, 0.32, 1] as const;

export const Hero = ({ onNavigate: _onNavigate }: { onNavigate: (p: string) => void }) => {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-10"
      style={{ background: '#fcfdfd' }}
    >
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 14 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative w-full max-w-[1400px] mx-auto h-150 sm:h-165 lg:h-160 rounded-4xl sm:rounded-[2.5rem] overflow-hidden border border-brand-border"
        style={{
          background: 'linear-gradient(160deg, #e7eaec 0%, #eef1f2 55%, #f4f6f7 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(15,18,15,0.10), 0 10px 24px -6px rgba(15,18,15,0.20), 0 32px 56px -20px rgba(15,18,15,0.28)',
        }}
      >
        {/* Mobile/tablet: image sits as a bottom band under the text, so
            nothing ever overlaps. Desktop (lg+): side-by-side panel with
            the sphere on the right, text on the left. */}
        <div className="relative flex flex-col lg:flex-row h-full lg:absolute lg:inset-0">

          {/* Text block — no fill of its own, so the card's cool grey-white
              tone (matching the hero image's background) shows through and
              the whole card reads as one continuous surface. */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-8 py-14 sm:px-12 sm:py-16 lg:py-0 lg:pl-16 lg:pr-8 lg:w-[46%] lg:flex-none lg:shrink-0">
            <FadeIn delay={0.15}>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-eyebrow mb-6">
                All-in-One School App
              </span>
              <h1
                className="text-brand-dark text-[2.5rem] sm:text-[3.4rem] lg:text-[3.85rem] leading-[1.04] tracking-[-0.025em] font-extrabold text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                The platform
                <br />
                your school has
                <br />
                been waiting for
              </h1>
              <p
                className="mt-5 text-[1.6rem] sm:text-[2rem] lg:text-[2.25rem] text-brand-dark/55"
                style={{ fontFamily: 'var(--font-brand-heading, Georgia)', fontStyle: 'italic', fontWeight: 400 }}
              >
                — Prospect.
              </p>
              <p className="mt-7 text-brand-slate text-[15px] sm:text-[16px] leading-[1.65] max-w-[34ch]">
                One place for marks, homework, and the road ahead — built for the way your school actually runs.
              </p>
            </FadeIn>
          </div>

          {/* Image panel — object-position keeps the sphere itself in frame
              at every width: centered-right on mobile/tablet where the
              panel is full-width, shifted further right on desktop where
              the panel is a narrower 54% column. */}
          <div className="relative h-80 sm:h-95 lg:h-auto lg:w-[54%] lg:absolute lg:inset-y-0 lg:right-0 shrink-0">
            <img
              src="/hero-full.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-[68%_50%] lg:object-[88%_52%]"
              loading="eager"
              fetchPriority="high"
            />
            {/* Soft fade on the inner edge only, on large screens, so the
                sphere hands off into the text panel without a hard seam —
                never covers the text since the two live in separate columns. */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute inset-y-0 left-0 w-28"
              style={{ background: 'linear-gradient(90deg, rgba(238,241,242,0.9) 0%, rgba(238,241,242,0) 100%)' }}
            />
            <div
              aria-hidden="true"
              className="lg:hidden absolute inset-x-0 top-0 h-16"
              style={{ background: 'linear-gradient(180deg, rgba(238,241,242,0.9) 0%, rgba(238,241,242,0) 100%)' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
