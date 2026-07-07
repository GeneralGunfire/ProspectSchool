import { motion, useReducedMotion } from 'motion/react';
import { FadeIn } from './Animations';

const EASE = [0.23, 1, 0.32, 1] as const;

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-40 pb-24 lg:pb-16 px-5">
      {/* Decorative grey accent blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-40 w-[600px] h-[600px] rounded-full bg-slate-200/50 blur-[72px]" />
        <div className="absolute top-20 right-[-10%] w-[480px] h-[480px] rounded-full bg-slate-300/35 blur-[64px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-slate-200/40 blur-[56px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-6 items-center">

        {/* Left — copy */}
        <div className="relative z-10 text-center lg:text-left">
          <FadeIn delay={0.05}>
            <h1 className="font-instrument text-brand-dark text-[clamp(3rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] font-extrabold text-balance">
              The platform your school has been{' '}
              <motion.em
                initial={reduced ? undefined : { opacity: 0, y: 10, rotate: -2 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                className="font-serif-accent text-accent not-italic inline-block"
              >
                waiting
              </motion.em> for.
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-8 text-slate-500 text-[19px] md:text-[21px] leading-[1.5] max-w-[42ch] mx-auto lg:mx-0 font-medium text-pretty">
              Career discovery, matric study support, teacher tools, and school management — one platform for every South African school.
            </p>
          </FadeIn>
        </div>

        {/* Right — product mockup. Background was keyed out in post so the
            devices sit directly on the page (no visible photo rectangle);
            the crop is allowed to overflow its grid column and bleed toward
            the viewport edge for an editorial feel rather than a boxed-in
            graphic. Hidden below lg — at narrower widths the devices would
            either get too small to read or force the column to fight the
            copy for space, and the text stands fine alone there.

            Static once settled — only the FadeIn entrance animates; no idle
            float or mouse-parallax on the image itself. */}
        <FadeIn delay={0.2} direction="left" className="hidden lg:block relative">
          <div className="relative lg:-mr-12 xl:-mr-20 lg:w-[108%] xl:w-[116%]">
            <img
              src="/hero-devices.webp"
              alt="Prospect dashboard shown on a laptop and phone"
              className="relative w-full h-auto drop-shadow-[0_45px_70px_-20px_rgba(15,23,42,0.35)]"
              width={1800}
              height={1171}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
