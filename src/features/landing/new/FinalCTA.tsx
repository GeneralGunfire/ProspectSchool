import { FadeIn, useSpotlight, SpotlightGlow } from './Animations';
import { ArrowRight } from './icons';

export const FinalCTA = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <section className="pb-24 px-5">
      <FadeIn>
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          className="group/spot card-premium-dark relative overflow-hidden max-w-5xl mx-auto bg-brand-dark px-8 md:px-16 py-16 flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          <SpotlightGlow tone="white" />

          <div className="max-w-md text-center lg:text-left">
            <span className="text-stone-600 text-[9px] font-black uppercase tracking-[0.2em]">Get Started Today</span>
            <h2 className="text-white font-black text-[clamp(1.9rem,4vw,2.75rem)] tracking-tight mt-4 leading-[1.1]">
              Ready to shape your future?
            </h2>
            <p className="mt-5 text-stone-400 text-[15px] leading-relaxed font-medium max-w-[38ch]">
              Join South African students using Prospect to discover careers, find bursaries, and ace matric.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onNavigate('quiz')}
              className="bg-white text-brand-dark rounded-xl px-10 py-3.5 font-black text-[13px] tracking-wide hover:bg-stone-100 active:scale-[0.97] transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
            >
              Start Career Quiz <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="border border-stone-700 text-stone-500 rounded-xl px-10 py-3.5 font-black text-[13px] tracking-wide hover:text-white hover:border-stone-500 active:scale-[0.97] transition-all cursor-pointer"
            >
              School Portal Login
            </button>
          </div>

        </div>
      </FadeIn>
    </section>
  );
};
