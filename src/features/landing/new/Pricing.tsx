import { FadeIn } from './Animations';
import { CheckCircle2 } from './icons';

const features = [
  "Unlimited students and teachers",
  "Full career guide and quiz",
  "Complete study library",
  "Student progress tracking",
  "Marks, resources, and past papers",
  "School-wide announcements"
];

export const Pricing = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section id="pricing" className="bg-brand-bg py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <FadeIn className="text-center">
          <span className="eyebrow">PRICING</span>
          <h2 className="text-brand-dark text-[clamp(2.5rem,5vw,3.5rem)] tracking-tight mt-4 leading-[1.1]">
            Free. For every school. Forever.
          </h2>
          <p className="mt-6 text-brand-eyebrow text-lg md:text-[18px] leading-relaxed max-w-[540px] mx-auto font-medium opacity-90">
            Prospect will always be free for South African schools. No trials, no freemium tiers, no hidden costs.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="w-full mt-12">
          <div className="bg-white border border-brand-border/60 rounded-[20px] p-10 text-center max-w-[380px] mx-auto shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-brand-dark font-mono font-bold text-4xl tracking-tight">R0</span>
              <span className="text-brand-eyebrow text-[14px] font-bold tracking-tight opacity-60">/month</span>
            </div>

            <ul className="text-left space-y-3.5 max-w-[280px] mx-auto mb-10">
              {features.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/20 mt-1.5 shrink-0" />
                  <span className="text-brand-dark/70 text-[13px] font-medium leading-normal">{f}</span>
                </li>
              ))}
            </ul>

            <button onClick={() => onNavigate('portal')} className="w-full bg-brand-dark text-white rounded-lg py-3 font-bold text-[13px] hover:bg-brand-dark/90 transition-all cursor-pointer">
              Set Up Your School Free
            </button>
            <p className="mt-4 text-[10px] text-brand-eyebrow font-bold uppercase tracking-widest opacity-40">No credit card required</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
