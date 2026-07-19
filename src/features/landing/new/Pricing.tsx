import { FadeIn } from './Animations';
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
  return (
    <section id="pricing" className="py-20 lg:py-28 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <span className="eyebrow">PRICING</span>
          <h2 className="text-brand-dark text-[clamp(1.9rem,5vw,2.75rem)] tracking-tight mt-3 leading-[1.1] font-black">
            One plan. Everything included.
          </h2>
          <p className="mt-4 text-brand-eyebrow text-[14px] sm:text-[15px] leading-relaxed max-w-md mx-auto font-medium">
            No trials, no freemium tiers, no hidden costs — Prospect is free for every South African school.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={0.1} className="max-w-md mx-auto mt-10 lg:mt-14">
        <div
          className="relative overflow-hidden rounded-4xl border border-brand-border p-8 sm:p-10 text-center"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(15,18,15,0.10), 0 24px 48px -16px rgba(15,18,15,0.16)',
          }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(160deg, #050708 0%, #0a0d10 100%)' }}>
            <span className="text-white font-black text-[15px] leading-none">P</span>
          </div>

          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-brand-eyebrow">School Plan</p>
          <p className="mt-2 text-brand-dark text-[3.25rem] font-black tracking-tight leading-none">
            R0
          </p>
          <p className="mt-1.5 text-[13px] text-brand-eyebrow font-medium">Forever, for the whole school</p>

          <ul className="mt-8 space-y-3 text-left max-w-70 mx-auto">
            {features.map(f => (
              <li key={f} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <span className="text-brand-dark/80 text-[13.5px] font-medium leading-snug">{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onNavigate('portal')}
            className="mt-8 w-full text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:opacity-90 active:scale-[0.97] transition-all cursor-pointer"
            style={{ background: 'linear-gradient(160deg, #050708 0%, #0a0d10 100%)' }}
          >
            Set Up Your School Free
          </button>
          <p className="mt-3.5 text-[10px] text-brand-eyebrow/60 font-black uppercase tracking-widest">
            No credit card required
          </p>
        </div>
      </FadeIn>
    </section>
  );
};
