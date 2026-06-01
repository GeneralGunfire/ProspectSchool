import { FadeIn } from './Animations';
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

export const StudyLibrary = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-brand-bg py-24 px-5">
      <div className="max-w-6xl mx-auto">

        <FadeIn className="text-center mb-12">
          <span className="eyebrow">SCHOOL ASSIST</span>
          <h2 className="text-brand-dark text-[clamp(1.9rem,3.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Study smarter, not harder.
          </h2>
          <p className="mt-4 text-stone-500 text-[15px] leading-relaxed max-w-[48ch] mx-auto font-medium">
            Curriculum-aligned lessons for Grade 10–12. Interactive steps, worked examples, practice questions, and instant feedback.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {subjects.map((subject, i) => {
            const Icon = subject.icon;
            return (
              <FadeIn key={subject.name} delay={i * 0.04}>
                <button
                  onClick={() => onNavigate('library')}
                  className="w-full bg-white rounded-2xl border border-brand-border p-6 text-left transition-all duration-200 hover:shadow-md hover:border-stone-300 active:scale-[0.98] cursor-pointer group"
                >
                  <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="text-white w-4 h-4" />
                  </div>
                  <h4 className="text-brand-dark font-black text-[13px] leading-snug tracking-tight">{subject.name}</h4>
                  <p className="text-stone-400 text-[10px] mt-1 font-black uppercase tracking-widest">{subject.topics} topics</p>
                </button>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.35} className="text-center mt-10">
          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-stone-400 bg-stone-200/50 rounded-full px-5 py-1.5">
            Grade 11 & 12 content coming soon
          </span>
        </FadeIn>

      </div>
    </section>
  );
};
