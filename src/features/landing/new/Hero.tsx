import { FadeIn } from './Animations';
import { DashboardPreview } from './DashboardPreview';

export const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 px-5">
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">

        {/* Left — copy (unchanged) */}
        <div className="text-center lg:text-left">
          <FadeIn>
            <span className="eyebrow">Built for South Africa</span>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="text-brand-dark text-[clamp(2.75rem,5.5vw,4.25rem)] leading-[1.05] tracking-tight font-black mt-4">
              The platform your school has been{' '}
              <em className="font-serif-accent text-accent not-italic">waiting</em> for.
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-7 text-stone-500 text-[17px] md:text-[18px] leading-relaxed max-w-[46ch] mx-auto lg:mx-0 font-medium">
              Career discovery, matric study support, teacher tools, and school management — one platform for every South African school.
            </p>
          </FadeIn>

          <FadeIn delay={0.24} className="mt-9 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="w-full sm:w-auto bg-accent text-accent-foreground rounded-full px-8 py-4 font-black text-[13px] tracking-wide hover:brightness-105 hover:shadow-[0_8px_30px_-6px_var(--color-accent)] active:scale-[0.97] transition-all duration-300 cursor-pointer shadow-lg shadow-stone-900/10"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="w-full sm:w-auto bg-white border border-brand-border text-brand-dark rounded-full px-8 py-4 font-black text-[13px] tracking-wide hover:border-stone-400 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 cursor-pointer"
            >
              Portal Login
            </button>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-stone-400">
              No credit card · Free for every SA school
            </p>
          </FadeIn>
        </div>

        {/* Right — animated dashboard preview. The floating collage needs real
            width to breathe (11 overlapping cards read as cluttered/clipped
            below ~700px) — hidden on mobile/tablet rather than shipping a
            cramped version; the text side stands on its own there. */}
        <FadeIn delay={0.2} direction="left" className="hidden lg:block">
          <DashboardPreview />
        </FadeIn>
      </div>
    </section>
  );
};
