import { FadeIn } from './Animations';
import { ArrowRight } from './icons';

export const FinalCTA = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-brand-bg pb-32 px-6">
      <FadeIn className="max-w-[1200px] mx-auto overflow-hidden rounded-[32px] border border-stone-800/50">
        <div className="bg-brand-dark px-10 md:px-20 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-[480px] text-center lg:text-left">
            <span className="text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em]">GET STARTED TODAY</span>
            <h2 className="text-white font-bold text-[clamp(2.2rem,5vw,3.2rem)] tracking-tight mt-6 leading-[1.1] mb-2 shrink-0">
              Ready to shape your future?
            </h2>
            <p className="mt-8 text-stone-400 text-[17px] leading-relaxed font-medium max-w-[42ch]">
              Join South African students using Prospect to discover careers, find bursaries, and ace matric.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onNavigate('quiz')}
              className="bg-white text-brand-dark rounded-xl px-12 py-4 font-bold text-[15px] hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              Start Career Quiz <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="bg-transparent border border-stone-800 text-stone-500 rounded-xl px-12 py-4 font-bold text-[15px] hover:text-white hover:border-stone-600 transition-all cursor-pointer whitespace-nowrap"
            >
              School Portal Login
            </button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};
