import { motion } from 'motion/react';
import { FadeIn } from './Animations';
import { ChevronDown as ChevronIcon } from './icons';

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="pt-36 pb-24 px-5 bg-brand-bg">
      <div className="max-w-2xl mx-auto text-center">

        <FadeIn>
          <div className="inline-flex items-center border border-brand-border bg-white/70 rounded-full px-3.5 py-1 mb-8">
            <span className="text-[10px] uppercase tracking-[0.18em] font-black text-brand-eyebrow">
              Free · Every South African School
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="text-brand-dark text-[clamp(2.6rem,6vw,4rem)] leading-[1.1] tracking-tight font-black">
            The platform your school has been waiting&nbsp;for.
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="mt-6 text-stone-500 text-[16px] md:text-[17px] leading-relaxed max-w-[44ch] mx-auto font-medium">
            Career discovery, matric study support, teacher tools, and school management — in one place.
          </p>
        </FadeIn>

        <FadeIn delay={0.24} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('quiz')}
            className="w-full sm:w-auto bg-brand-dark text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-stone-800 active:scale-[0.97] transition-all cursor-pointer shadow-md shadow-stone-900/10"
          >
            Get Started Free
          </button>
          <button
            onClick={() => onNavigate('portal')}
            className="w-full sm:w-auto bg-white border border-brand-border text-brand-dark rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:border-stone-400 active:scale-[0.97] transition-all cursor-pointer"
          >
            Portal Login
          </button>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-20 flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronIcon className="w-6 h-6 text-stone-300" />
          </motion.div>
        </FadeIn>

      </div>
    </section>
  );
};
