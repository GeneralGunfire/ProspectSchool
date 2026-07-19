import { FadeIn, useSpotlight, SpotlightGlow } from './Animations';
import { Grain } from '../../../shared/components/Grain';
import { ArrowRight } from './icons';

export const FinalCTA = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const { ref, onMouseEnter, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <section className="pb-24 px-5">
      <FadeIn>
        <div
          ref={ref}
          onMouseEnter={onMouseEnter}
          onMouseMove={onMouseMove}
          className="group/spot relative overflow-hidden max-w-5xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] px-6 py-10 sm:px-8 md:px-16 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_12px_32px_-10px_rgba(0,0,0,0.45),0_32px_64px_-20px_rgba(0,0,0,0.35)]"
          style={{ background: 'linear-gradient(160deg, #050708 0%, #0a0d10 50%, #060809 100%)' }}
        >
          <Grain opacity={0.035} />
          <SpotlightGlow tone="white" />

          <div className="max-w-md text-center lg:text-left">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Get Started Today</span>
            <h2 className="text-white font-black text-[clamp(1.6rem,5.5vw,2.75rem)] tracking-tight mt-4 leading-[1.15] sm:leading-[1.1]">
              Ready to shape your future?
            </h2>
            <p className="mt-5 text-slate-400 text-[14px] sm:text-[15px] leading-relaxed font-medium max-w-[38ch]">
              Join South African students using Prospect to discover careers, find bursaries, and ace matric.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onNavigate('quiz')}
              className="bg-white text-brand-dark rounded-xl px-10 py-3.5 font-black text-[13px] tracking-wide hover:bg-slate-100 active:scale-[0.97] transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
            >
              Start Career Quiz <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="border border-slate-700 text-stone-500 rounded-xl px-10 py-3.5 font-black text-[13px] tracking-wide hover:text-white hover:border-slate-500 active:scale-[0.97] transition-all cursor-pointer"
            >
              School Portal Login
            </button>
          </div>

        </div>
      </FadeIn>
    </section>
  );
};
