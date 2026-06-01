import { FadeIn } from './Animations';
import { Compass, TrendingUp, Award } from './icons';

const features = [
  {
    icon: Compass,
    heading: 'Career Quiz',
    body: '48 questions. RIASEC scoring. Instant career matches with compatibility percentages.',
    dark: true,
  },
  {
    icon: TrendingUp,
    heading: 'My Future Dashboard',
    body: 'APS score, career matches, study progress, and saved bursaries — all unified.',
    dark: false,
  },
  {
    icon: Award,
    heading: 'Bursary Finder',
    body: '245+ bursaries searchable by field, income, and province. Bookmark what matters.',
    dark: false,
  },
];

const pills = ['RIASEC Quiz', 'Match Score %', 'Salary Ranges', 'TVET Pathways', 'Bursary Links'];

export const StudentDeepDive = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-white py-24 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left — sticky text */}
        <div className="lg:sticky lg:top-28 self-start">
          <FadeIn>
            <span className="eyebrow">CAREER GUIDE</span>
            <h2 className="text-brand-dark text-[clamp(1.9rem,3.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
              Know exactly where you're going.
            </h2>
            <p className="mt-5 text-stone-500 text-[15px] leading-relaxed max-w-[40ch] font-medium">
              Prospect combines your personality profile, APS score, and subject choices to build a personalised career roadmap.
            </p>
            <div className="flex flex-wrap gap-2 mt-7">
              {pills.map(pill => (
                <span key={pill} className="bg-stone-100 text-stone-600 rounded-full px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider border border-stone-200/60">
                  {pill}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate('quiz')}
              className="mt-8 bg-brand-dark text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-stone-800 active:scale-[0.97] transition-all cursor-pointer"
            >
              Take the Quiz →
            </button>
          </FadeIn>
        </div>

        {/* Right — feature cards */}
        <div className="space-y-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.heading} delay={i * 0.1}>
                <div className={`rounded-2xl p-7 transition-all duration-300 ${
                  f.dark
                    ? 'bg-brand-dark hover:shadow-xl shadow-stone-900/10'
                    : 'bg-brand-bg border border-brand-border hover:shadow-sm'
                }`}>
                  <Icon className={`w-6 h-6 ${f.dark ? 'text-amber-400' : 'text-brand-dark opacity-70'}`} />
                  <h4 className={`font-black text-[17px] mt-4 tracking-tight ${f.dark ? 'text-white' : 'text-brand-dark'}`}>
                    {f.heading}
                  </h4>
                  <p className={`text-[14px] mt-2 leading-relaxed font-medium ${f.dark ? 'text-stone-400' : 'text-brand-eyebrow'}`}>
                    {f.body}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
