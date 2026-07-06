import { FadeIn } from './Animations';
import { Grain } from '../../../shared/components/Grain';

export const QuoteSection = () => {
  return (
    <section className="relative bg-brand-dark py-20 px-5 overflow-hidden">
      <Grain />
      {/* Handoff glow — same warm bleed used at the top of the page, so the
          dark-to-light transition reads as one continuous flow, not a cut. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent)',
        }}
      />
      <div className="relative max-w-xl mx-auto text-center">
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
