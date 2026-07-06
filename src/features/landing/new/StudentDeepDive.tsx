import { FadeIn, CountUp } from './Animations';
import { Compass, TrendingUp, Award } from './icons';

const features = [
  {
    icon: Compass,
    heading: 'Career Quiz',
    body: 'RIASEC scoring with instant career matches.',
  },
  {
    icon: TrendingUp,
    heading: 'My Future Dashboard',
    body: 'APS, career matches, and progress — unified.',
  },
  {
    icon: Award,
    heading: 'Bursary Finder',
    body: '245+ bursaries, searchable and bookmarkable.',
  },
];

const pills = ['RIASEC Quiz', 'Match Score %', 'Salary Ranges', 'TVET Pathways', 'Bursary Links'];

export const StudentDeepDive = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="py-24 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left — sticky text */}
        <div className="lg:sticky lg:top-28 self-start">
          <FadeIn>
            <span className="eyebrow">CAREER GUIDE</span>
            <h2 className="text-brand-dark text-[clamp(1.9rem,3.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
              Know exactly where you're going.
            </h2>
            <p className="mt-5 text-brand-eyebrow text-[15px] leading-relaxed max-w-[40ch] font-medium">
              Your personality, APS score, and subjects — combined into one career roadmap.
            </p>
            <div className="flex flex-wrap gap-2 mt-7">
              {pills.map(pill => (
                <span key={pill} className="bg-slate-100 text-slate-600 rounded-full px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider border border-slate-200/60">
                  {pill}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate('quiz')}
              className="mt-8 bg-brand-dark text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-slate-800 active:scale-[0.97] transition-all cursor-pointer"
            >
              Take the Quiz →
            </button>
          </FadeIn>
        </div>

        {/* Right — stat panel + compact feature list */}
        <div>
          <FadeIn delay={0.08} direction="left">
            <div className="relative rounded-3xl bg-brand-dark px-8 py-10 flex items-center overflow-hidden aspect-16/10 shadow-lg shadow-stone-900/10">
              <div className="relative z-10 max-w-[45%]">
                <p className="text-white font-mono font-black text-[clamp(2.5rem,5.5vw,4rem)] leading-none tracking-tight">
                  <CountUp value={400} suffix="+" />
                </p>
                <p className="text-slate-400 font-black uppercase tracking-[0.16em] text-[11px] mt-3">
                  SA careers mapped to your profile
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&fit=crop"
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="absolute -right-4 top-1/2 -translate-y-1/2 h-[130%] w-auto object-contain opacity-90"
              />
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-brand-dark via-brand-dark/80 to-transparent" />
            </div>
          </FadeIn>

          <div className="mt-5 divide-y divide-brand-border">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <FadeIn key={f.heading} delay={0.14 + i * 0.08}>
                  <div className="group flex items-start gap-4 py-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-accent">
                      <Icon className="w-4.5 h-4.5 text-accent transition-colors duration-300 group-hover:text-brand-dark" />
                    </div>
                    <div>
                      <h4 className="font-black text-[15px] tracking-tight text-brand-dark">{f.heading}</h4>
                      <p className="text-[13px] mt-1 leading-relaxed font-medium text-brand-eyebrow">{f.body}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
