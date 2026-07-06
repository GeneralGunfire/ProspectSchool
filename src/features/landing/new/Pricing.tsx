import { FadeIn, useSpotlight, SpotlightGlow } from './Animations';
import { CheckCircle2 } from './icons';

const features = [
  'Unlimited students and teachers',
  'Full career guide and quiz',
  'Complete study library',
  'Student progress tracking',
  'Marks, resources, and past papers',
  'School-wide announcements',
];

export const Pricing = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <section id="pricing" className="py-28 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <span className="eyebrow">PRICING</span>
          <h2 className="text-brand-dark text-[clamp(2rem,4vw,2.75rem)] tracking-tight mt-3 leading-[1.1] font-black">
            Free. Forever.
          </h2>
        </FadeIn>
      </div>

      <FadeIn delay={0.1} className="max-w-lg mx-auto mt-10">
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          className="group/spot card-premium relative overflow-hidden bg-white border border-brand-border px-8 py-10 sm:px-10 sm:py-12 text-center"
        >
          <SpotlightGlow tone="accent" />
          <p className="text-brand-eyebrow text-[15px] leading-relaxed font-medium">
            No trials. No freemium tiers. No hidden costs. Prospect is free for every South African school.
          </p>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-left">
            {features.map(f => (
              <li key={f} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span className="text-brand-dark/70 text-[14px] font-medium leading-snug">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col items-center">
            <button
              onClick={() => onNavigate('portal')}
              className="w-full sm:w-auto bg-brand-dark text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-slate-800 active:scale-[0.97] transition-all cursor-pointer"
            >
              Set Up Your School Free
            </button>
            <p className="mt-3.5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              No credit card required
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};
