import { FadeIn } from './Animations';
import { Compass, TrendingUp, Award } from './icons';

export const StudentDeepDive = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-white py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left Column — Sticky Text */}
        <div className="lg:sticky lg:top-32 self-start">
          <FadeIn>
            <span className="eyebrow">CAREER GUIDE</span>
            <h2 className="text-brand-dark text-[clamp(2.2rem,4vw,3.2rem)] tracking-tight mt-4 leading-[1.2]">
              Know exactly where you're going.
            </h2>
            <p className="mt-8 text-brand-eyebrow text-[16px] leading-relaxed max-w-[42ch] font-medium opacity-90">
              Prospect's career engine combines your personality profile, APS score, subject choices, and province to generate a personalised career roadmap.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-10">
              {["RIASEC Quiz", "Match Score %", "Salary Ranges", "University Matching", "TVET Pathways", "Bursary Links"].map(pill => (
                <span key={pill} className="bg-stone-100 text-stone-600 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wider border border-stone-200/50">
                  {pill}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Right Column — Feature Cards */}
        <div className="space-y-6">
          <FadeIn delay={0.1} className="group">
            <div className="bg-brand-dark rounded-[24px] p-10 transition-all duration-300 hover:shadow-xl shadow-brand-dark/10">
              <Compass className="text-amber-400 w-8 h-8 opacity-90" />
              <h4 className="text-white font-bold text-xl mt-6 tracking-tight">Career Quiz</h4>
              <p className="text-stone-400 text-[15px] mt-3 leading-relaxed font-medium">
                48 questions. RIASEC scoring. Instant career matches with compatibility scores.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="group">
            <div className="bg-brand-bg border border-brand-border rounded-[24px] p-10 transition-all duration-300 hover:shadow-md">
              <TrendingUp className="text-brand-dark w-8 h-8 opacity-80" />
              <h4 className="text-brand-dark font-bold text-xl mt-6 tracking-tight">My Future Dashboard</h4>
              <p className="text-brand-eyebrow text-[15px] mt-3 leading-relaxed font-medium">
                Your APS, career matches, study progress, and saved bursaries — all in one place.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="group">
            <div className="bg-brand-bg border border-brand-border rounded-[24px] p-10 transition-all duration-300 hover:shadow-md">
              <Award className="text-brand-dark w-8 h-8 opacity-80" />
              <h4 className="text-brand-dark font-bold text-xl mt-6 tracking-tight">Bursary Finder</h4>
              <p className="text-brand-eyebrow text-[15px] mt-3 leading-relaxed font-medium">
                245+ bursaries searchable by field, income, and province. Bookmark and track applications.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
