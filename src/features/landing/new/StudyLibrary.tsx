import { FadeIn } from './Animations';
import { Calculator, Atom, FlaskConical, BookOpen, Briefcase, TrendingUp, Monitor, Pencil } from './icons';

const subjects = [
  { name: "Mathematics", icon: Calculator, topics: 2 },
  { name: "Physical Sciences", icon: Atom, topics: 5 },
  { name: "Life Sciences", icon: FlaskConical, topics: 4 },
  { name: "Accounting", icon: BookOpen, topics: 6 },
  { name: "Business Studies", icon: Briefcase, topics: 4 },
  { name: "Economics", icon: TrendingUp, topics: 5 },
  { name: "CAT", icon: Monitor, topics: 4 },
  { name: "EGD", icon: Pencil, topics: 1 }
];

export const StudyLibrary = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-brand-bg py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="eyebrow">SCHOOL ASSIST</span>
          <h2 className="text-brand-dark text-[clamp(2rem,4vw,3.2rem)] tracking-tight mt-4 leading-[1.2]">
            Study smarter, not harder.
          </h2>
          <p className="mt-6 text-brand-eyebrow text-[16px] leading-relaxed max-w-[56ch] mx-auto font-medium opacity-90">
            Curriculum-aligned lessons for every major Grade 10–12 subject. Interactive steps, worked examples, practice questions, and instant feedback.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-16">
          {subjects.map((subject, i) => (
            <FadeIn key={subject.name} delay={i * 0.05} className="group">
              <div className="bg-white rounded-[24px] border border-brand-border p-8 h-full transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center overflow-hidden mb-6 opacity-90">
                  <subject.icon className="text-white w-6 h-6" />
                </div>
                <h4 className="text-brand-dark font-bold text-base leading-tight tracking-tight">{subject.name}</h4>
                <p className="text-stone-400 text-[12px] mt-2 font-bold uppercase tracking-widest">{subject.topics} topics</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="text-center mt-16">
          <div className="inline-block bg-stone-200/50 rounded-full px-6 py-2">
            <p className="text-stone-500 text-[13px] font-bold uppercase tracking-wider">Grade 11 and 12 content coming soon</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
