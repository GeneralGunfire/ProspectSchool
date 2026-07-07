import { motion, useReducedMotion } from 'motion/react';
import { FadeIn } from './Animations';

const EASE = [0.23, 1, 0.32, 1] as const;

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden lg:min-h-[92vh] flex items-center justify-center pt-28 pb-14 lg:pt-20 lg:pb-16 px-5 bg-white">
      {/* Soft blue glow accents on the white hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-40 w-[600px] h-[600px] rounded-full bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] blur-[96px] opacity-60" />
        <div className="absolute top-10 right-[-10%] w-[480px] h-[480px] rounded-full bg-[color-mix(in_srgb,var(--color-brand-pale)_60%,transparent)] blur-[80px] opacity-70" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-10 items-center justify-items-center">

        {/* Left — copy */}
        <div className="relative z-10 text-center lg:text-left w-full max-w-xl">
          <FadeIn delay={0.08}>
            <h1 className="text-brand-dark text-[clamp(2.05rem,6.8vw,4.35rem)] leading-[1.1] lg:leading-[1.05] tracking-[-0.02em] font-medium text-balance" style={{ fontFamily: 'var(--font-brand-heading)' }}>
              The platform your school has been{' '}
              <motion.em
                initial={reduced ? undefined : { opacity: 0, y: 10, rotate: -2 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                className="italic inline-block"
                style={{ color: 'var(--color-accent)' }}
              >
                waiting
              </motion.em> for.
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-5 lg:mt-7 text-brand-eyebrow text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.55] max-w-[38ch] mx-auto lg:mx-0 font-normal text-pretty" style={{ fontFamily: 'var(--font-brand-body)' }}>
              Career discovery, matric study support, teacher tools, and school management — one platform for every South African school.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-7 lg:mt-9 w-full" style={{ fontFamily: 'var(--font-brand-body)' }}>
              <button
                onClick={() => onNavigate('quiz')}
                className="w-full sm:w-auto rounded-xl px-8 py-3.5 font-bold text-[14px] tracking-wide bg-brand-dark text-white hover:bg-brand-dark/90 active:scale-[0.97] transition-all cursor-pointer"
              >
                Start Career Quiz →
              </button>
              <button
                onClick={() => onNavigate('library')}
                className="w-full sm:w-auto rounded-xl px-8 py-3.5 font-bold text-[14px] tracking-wide border border-brand-border text-brand-dark hover:bg-brand-dark/5 active:scale-[0.97] transition-all cursor-pointer"
              >
                Study Library
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Right — original product shot, angled per reference, with floating badge */}
        <FadeIn delay={0.2} direction="left" className="hidden lg:flex relative w-full items-center justify-center">
          <div className="relative w-full max-w-none">
            <motion.div
              initial={reduced ? undefined : { rotate: 0 }}
              animate={reduced ? undefined : { rotate: -4 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="relative"
            >
              <img
                src="/hero-devices.webp"
                alt="Prospect dashboard shown on a laptop and phone"
                className="relative w-full h-auto drop-shadow-[0_45px_90px_-25px_rgba(0,0,0,0.55)]"
                width={1800}
                height={1171}
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>

            {/* Floating circular badge */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, scale: 0.6 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              className="absolute bottom-8 left-4 w-28 h-28 rounded-full bg-white border border-brand-border shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] grid place-items-center z-10"
            >
              <div className="w-21 h-21 rounded-full grid place-items-center" style={{ background: 'var(--color-accent)' }}>
                <span className="text-white font-black text-[15px] leading-tight text-center">100%<br />Free</span>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
