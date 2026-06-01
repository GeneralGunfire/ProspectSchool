import { FadeIn } from './Animations';

export const QuoteSection = () => {
  return (
    <section className="bg-brand-dark py-32 px-6">
      <div className="max-w-[800px] mx-auto text-center">
        <FadeIn>
          <div className="w-12 h-px bg-stone-700 mx-auto mb-12 opacity-50" />
          <p className="text-white text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-relaxed tracking-tight">
            "Education is the most powerful weapon which you can use to change the world."
          </p>
          <div className="mt-12">
            <span className="text-stone-500 font-bold uppercase tracking-[0.2em] text-[10px]">
              — Nelson Mandela
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
