import { FadeIn } from './Animations';
import { Grain } from '../../../shared/components/Grain';

export const QuoteSection = () => {
  return (
    <section className="section-dark-blue relative py-14 lg:py-20 px-5 overflow-hidden">
      <Grain />
      <div className="relative max-w-xl mx-auto text-center">
        <FadeIn>
          <p className="text-white text-[clamp(1.4rem,3vw,2rem)] font-black leading-relaxed tracking-tight">
            "Education is the most powerful weapon which you can use to change the world."
          </p>
          <span className="block mt-8 text-slate-500 font-black uppercase tracking-[0.2em] text-[9px]">
            — Nelson Mandela
          </span>
        </FadeIn>
      </div>
    </section>
  );
};
