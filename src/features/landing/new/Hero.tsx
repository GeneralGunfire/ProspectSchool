import { motion, useReducedMotion } from 'motion/react';
import { FadeIn } from './Animations';
import { ArrowRight, Star, ClipboardList, CalendarClock } from './icons';

const EASE = [0.23, 1, 0.32, 1] as const;

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand-bg min-h-screen flex items-center py-20 px-6">
      {/* Warm paper wash + faint dot grid — same "premium paper" surface as
          the student dashboard (.student-home), so the marketing hero and
          the real product read as one brand instead of two palettes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 700px at 50% 0%, color-mix(in srgb, var(--color-accent) 4%, transparent), transparent 62%), var(--color-brand-bg)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(color-mix(in srgb, var(--color-brand-dark) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Two columns, fixed 45/55 split, never wraps on lg — grid-cols with
          explicit fr values rather than flex-wrap, so there is no width
          threshold at which the phone can fall below the text. */}
      <div className="relative w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-16 lg:gap-14 items-center">

        {/* Left column — text */}
        <div className="text-center lg:text-left">
          <FadeIn delay={0.04}>
            <span className="inline-block text-[12px] font-bold uppercase tracking-[0.16em] text-brand-eyebrow mb-6">
              All-in-One School App
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              className="text-brand-dark text-[3.1rem] sm:text-[3.9rem] lg:text-[4.4rem] leading-[1.06] tracking-[-0.02em] font-extrabold text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Take Control of Your School Year
            </h1>
          </FadeIn>

          <FadeIn delay={0.18}>
            <p className="mt-7 text-brand-slate text-[18px] sm:text-[20px] leading-[1.6] max-w-130 mx-auto lg:mx-0">
              Track marks, homework, and your career path with Prospect — the one place your whole school year lives.
            </p>
          </FadeIn>

          <FadeIn delay={0.26}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
              <button
                onClick={() => onNavigate('quiz')}
                className="group w-full sm:w-auto rounded-xl px-9 py-4.5 font-bold text-[17px] bg-brand-dark text-white hover:bg-brand-dark/90 active:scale-[0.97] transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('library')}
                className="w-full sm:w-auto rounded-xl px-9 py-4.5 font-bold text-[17px] border-2 border-brand-border text-brand-dark hover:border-brand-dark/25 hover:bg-white active:scale-[0.97] transition-all cursor-pointer"
              >
                Book a Demo
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.34}>
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-11">
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[15px] text-brand-slate font-semibold">
                Trusted by 10,000+ students
              </span>
            </div>
          </FadeIn>
        </div>

        {/* Right column — phone mockup, grounded in a soft rounded panel */}
        <FadeIn delay={0.2} direction="left" className="relative w-full">
          <div className="relative max-w-115 mx-auto lg:max-w-none lg:mx-0">
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="relative rounded-[2rem] overflow-hidden border border-brand-border shadow-[0_40px_90px_-24px_rgba(15,18,15,0.28)]"
              style={{ background: 'linear-gradient(160deg, var(--color-paper-raise, #f1efe9) 0%, var(--color-brand-bg) 100%)' }}
            >
              <img
                src="/hero-device.png"
                alt="Prospect student dashboard shown on a phone"
                className="w-full h-auto"
                width={1536}
                height={1024}
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>

            {/* Floating feature cards — overlap the container's bottom edge
                so the mockup reads as grounded/weighted, not floating in
                empty space. */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.92 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
              className="absolute -bottom-7 left-2 sm:-left-8 flex items-center gap-3 rounded-2xl border border-brand-border shadow-[0_18px_38px_-14px_rgba(15,18,15,0.32)] px-5 py-4"
              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)' }}>
                <ClipboardList className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div className="leading-tight text-left">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-brand-eyebrow">GPA Tracker</p>
                <p className="text-[15px] font-bold text-brand-dark">78% average</p>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.92 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
              className="absolute -bottom-7 right-2 sm:-right-8 flex items-center gap-3 rounded-2xl border border-brand-border shadow-[0_18px_38px_-14px_rgba(15,18,15,0.32)] px-5 py-4"
              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)' }}>
                <CalendarClock className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div className="leading-tight text-left">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-brand-eyebrow">Homework Due</p>
                <p className="text-[15px] font-bold text-brand-dark">2 tasks this week</p>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
