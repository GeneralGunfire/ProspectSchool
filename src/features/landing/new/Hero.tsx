import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { FadeIn } from './Animations';

const EASE = [0.23, 1, 0.32, 1] as const;

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-[#0B0F14]">
      {/* Video sits behind only the right two-thirds of the hero, faded into
          the dark base color on the left so copy always reads on solid
          ground instead of fighting the footage for contrast. */}
      <div className="absolute inset-0">
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(1.15) brightness(1.25)' }}
          poster="/hero-full.png"
        >
          <source src="/videos/hero-bg-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/videos/hero-bg-desktop.mp4" type="video/mp4" />
        </video>
        {/* Left-to-right scrim: solid near-black behind the copy column,
            fading out toward the right so the video reads as a visual
            anchor rather than a wash over the whole section. */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, #0B0F14 0%, #0B0F14 34%, rgba(11,15,20,0.6) 54%, rgba(11,15,20,0.12) 76%, transparent 100%)' }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0F14] via-transparent to-[#0B0F14]/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-20">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <FadeIn delay={0.05}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold tracking-[0.08em] uppercase text-white/70">
              Built for South African schools
            </span>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1
              className="mt-6 text-white text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-[1.02] tracking-[-0.03em] font-extrabold text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every mark, every lesson,
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-300 via-sky-400 to-blue-500">
                one platform.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="mt-6 text-white/70 text-[17px] sm:text-[19px] leading-relaxed max-w-lg">
              Prospect brings marks, homework, and career guidance together — so students, teachers, and parents always know where things stand.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('portal')}
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#0B0F14] font-bold text-[14px] px-7 py-3.5 rounded-full hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate('careers')}
                className="inline-flex items-center justify-center gap-2 text-white/85 font-bold text-[14px] px-5 py-3.5 rounded-full border border-white/15 hover:bg-white/5 hover:border-white/25 active:scale-[0.97] transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                Explore Careers
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-white/50 text-[12px] font-semibold tracking-wide">
              <span>Free for every school</span>
              <span className="w-1 h-1 rounded-full bg-white/25" />
              <span>No setup fees</span>
              <span className="w-1 h-1 rounded-full bg-white/25" />
              <span>Built with SA teachers</span>
            </div>
          </FadeIn>
        </motion.div>
      </div>
    </section>
  );
};
