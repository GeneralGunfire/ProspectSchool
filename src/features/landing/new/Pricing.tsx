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
            Free. Forever.
          </h2>
        </FadeIn>
      </div>

      {/* Matches FinalCTA's max-w-5xl below it — the two cards sit in the
          same vertical rhythm, so a narrower card here read as undersized
          next to it. */}
      <FadeIn delay={0.1} className="max-w-5xl mx-auto mt-10 lg:mt-14">
        <div className="relative overflow-hidden rounded-4xl shadow-[0_30px_80px_-20px_rgba(11,29,51,0.4)] card-premium-dark bg-brand-dark">
          {/* Photo strip — normal document flow, sized by its own aspect
              ratio rather than absolute-positioned inside a heightless
              parent (that was collapsing to near-nothing before). */}
          <div className="relative w-full aspect-[16/7] sm:aspect-[16/6]">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&q=80&fit=crop"
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-dark) 20%, transparent) 0%, var(--color-brand-dark) 100%)' }}
            />
          </div>

          {/* Glass panel — overlaps the bottom of the photo strip. Translucent
              + blurred where it sits over the image, so the photo bleeds
              through softly at the seam instead of a hard cut, then reads as
              a normal solid dark card for the rest of its height. */}
          <div
            className="relative -mt-16 sm:-mt-20 px-6 py-10 sm:px-12 sm:py-14 text-center"
            style={{
              background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-dark) 55%, transparent) 0%, var(--color-brand-dark) 45%)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            }}
          >
            <p className="text-white/75 text-[14px] sm:text-[15px] leading-relaxed font-medium max-w-md mx-auto">
              No trials. No freemium tiers. No hidden costs. Prospect is free for every South African school.
            </p>

            <ul className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-left max-w-md mx-auto">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-accent)' }} />
                  <span className="text-white/90 text-[13.5px] font-medium leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => onNavigate('portal')}
                className="w-full sm:w-auto bg-white text-brand-dark rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
              >
                Set Up Your School Free
              </button>
              <p className="mt-3.5 text-[10px] text-white/60 font-black uppercase tracking-widest">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};
