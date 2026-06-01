import { FadeIn } from './Animations';

export const QuoteSection = () => {
  return (
    <section className="bg-brand-dark py-20 px-5">
      <div className="max-w-xl mx-auto text-center">
        <FadeIn>
          <p className="text-white text-[clamp(1.4rem,3vw,2rem)] font-black leading-relaxed tracking-tight">
            "Education is the most powerful weapon which you can use to change the world."
          </p>
          <span className="block mt-8 text-stone-600 font-black uppercase tracking-[0.2em] text-[9px]">
            — Nelson Mandela
          </span>
        </FadeIn>
      </div>
    </section>
  );
};
