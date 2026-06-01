import { FadeIn } from './Animations';

const features = [
  'Unlimited students and teachers',
  'Full career guide and quiz',
  'Complete study library',
  'Student progress tracking',
  'Marks, resources, and past papers',
  'School-wide announcements',
];

export const Pricing = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section id="pricing" className="bg-brand-bg py-24 px-5">
      <div className="max-w-sm mx-auto text-center">

        <FadeIn>
          <span className="eyebrow">PRICING</span>
          <h2 className="text-brand-dark text-[clamp(2rem,4vw,2.75rem)] tracking-tight mt-3 leading-[1.1] font-black">
            Free. Forever.
          </h2>
          <p className="mt-4 text-stone-500 text-[15px] leading-relaxed font-medium">
            No trials. No freemium tiers. No hidden costs. Prospect is free for every South African school.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-8">
          <div className="bg-white border border-brand-border/70 rounded-2xl p-8 shadow-sm">
            <div className="flex items-baseline justify-center gap-1.5 mb-7">
              <span className="text-brand-dark font-mono font-black text-5xl tracking-tight">R0</span>
              <span className="text-stone-400 text-[13px] font-black tracking-tight">/month</span>
            </div>

            <ul className="text-left space-y-3 mb-8">
              {features.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-brand-dark/20 mt-2 shrink-0" />
                  <span className="text-brand-dark/65 text-[13px] font-medium leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onNavigate('portal')}
              className="w-full bg-brand-dark text-white rounded-xl py-3.5 font-black text-[13px] tracking-wide hover:bg-stone-800 active:scale-[0.97] transition-all cursor-pointer"
            >
              Set Up Your School Free
            </button>
            <p className="mt-3.5 text-[10px] text-stone-400 font-black uppercase tracking-widest">
              No credit card required
            </p>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};
