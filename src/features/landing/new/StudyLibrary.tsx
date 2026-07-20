import { FadeIn, useSpotlight, SpotlightGlow } from './Animations';
import { Calculator, Atom, FlaskConical, BookOpen, Briefcase, TrendingUp, Monitor, Pencil } from './icons';

const subjects = [
  { name: 'Mathematics',        icon: Calculator,   topics: 2 },
  { name: 'Physical Sciences',  icon: Atom,         topics: 5 },
  { name: 'Life Sciences',      icon: FlaskConical, topics: 4 },
  { name: 'Accounting',         icon: BookOpen,     topics: 6 },
  { name: 'Business Studies',   icon: Briefcase,    topics: 4 },
  { name: 'Economics',          icon: TrendingUp,   topics: 5 },
  { name: 'CAT',                icon: Monitor,      topics: 4 },
  { name: 'EGD',                icon: Pencil,       topics: 1 },
];

const SubjectCard = ({ subject, onNavigate }: { subject: typeof subjects[number]; onNavigate: (p: string) => void }) => {
  const Icon = subject.icon;
  const { ref, onMouseEnter, onMouseMove } = useSpotlight<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onClick={() => onNavigate('library')}
      className="group group/spot card-premium relative overflow-hidden w-full border border-brand-border p-6 text-left hover:border-accent/50 active:scale-[0.98] cursor-pointer"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)' }}
    >
      <SpotlightGlow tone="accent" />
      <div className="w-9 h-9 rounded-lg bg-linear-to-br from-stone-700 to-brand-dark shadow-inner shadow-black/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
        <Icon className="text-white w-4 h-4" />
      </div>
      <h4 className="text-brand-dark font-black text-[13px] leading-snug tracking-tight">{subject.name}</h4>
      <p className="text-slate-400 text-[10px] mt-1 font-black uppercase tracking-widest">{subject.topics} topics</p>
    </button>
  );
};

export const StudyLibrary = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="py-14 lg:py-20 px-5">
      <div className="relative max-w-6xl mx-auto">

        <FadeIn className="text-center mb-12">
          <span className="eyebrow">SCHOOL ASSIST</span>
          <h2 className="text-brand-dark text-[clamp(1.65rem,5.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Study smarter, not harder.
          </h2>
          <p className="mt-4 text-brand-eyebrow text-[14px] sm:text-[15px] leading-relaxed max-w-[48ch] mx-auto font-medium">
            Curriculum-aligned lessons for Grade 10–12. Interactive steps, worked examples, practice questions, and instant feedback.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {subjects.map((subject, i) => (
            <FadeIn key={subject.name} delay={i * 0.04}>
              <SubjectCard subject={subject} onNavigate={onNavigate} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.35} className="text-center mt-10">
          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-200/50 rounded-full px-5 py-1.5">
            Grade 11 & 12 content coming soon
          </span>
        </FadeIn>

      </div>
    </section>
  );
};
