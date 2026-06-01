import { motion } from 'motion/react';
import { FadeIn } from './Animations';
import { ChevronDown as ChevronIcon } from './icons';

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="pt-40 pb-20 px-6 bg-brand-bg">
      <div className="max-w-[800px] mx-auto text-center">
        <FadeIn>
          <div className="inline-flex items-center border border-brand-border bg-white rounded-full px-4 py-1.5 shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-brand-eyebrow">
              Free for every South African school
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-10 text-brand-dark text-[clamp(2.5rem,5vw,3.8rem)] leading-[1.15] md:leading-[1.1] tracking-tight">
            The platform your<br />
            school has been<br />
            waiting for.
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-brand-eyebrow text-[17px] md:text-[18px] leading-relaxed max-w-[500px] mx-auto font-medium opacity-80">
            Career discovery, matric study support, teacher tools, and school management — all in one place. Free.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('quiz')}
            className="w-full sm:w-auto bg-brand-dark text-white rounded-xl px-10 py-3.5 font-bold text-[14px] hover:scale-[1.02] transition-all cursor-pointer shadow-lg shadow-brand-dark/5"
          >
            Get Started Free
          </button>
          <button
            onClick={() => onNavigate('portal')}
            className="w-full sm:w-auto bg-white border border-brand-border text-brand-dark rounded-xl px-10 py-3.5 font-bold text-[14px] hover:scale-[1.02] transition-all cursor-pointer"
          >
            Portal Login
          </button>
        </FadeIn>

        <FadeIn delay={0.6} className="mt-24 md:mt-32 flex justify-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="cursor-pointer"
          >
            <ChevronIcon className="w-8 h-8 text-stone-300" />
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};
