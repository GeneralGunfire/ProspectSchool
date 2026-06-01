import { FadeIn } from './Animations';
import { Users, ClipboardList, FolderOpen, CalendarDays, ArrowRight } from './icons';

const features = [
  { icon: Users,         title: 'Student Profiles',  body: 'See each student\'s progress, marks, homework, and announcements at a glance.' },
  { icon: ClipboardList, title: 'Mark Sheets',        body: 'Create assessments, enter marks for your class, and track performance over time.' },
  { icon: FolderOpen,    title: 'Resources',          body: 'Upload notes, worksheets, and videos. Students access them instantly from their dashboard.' },
  { icon: CalendarDays,  title: 'Class Calendar',     body: 'Post homework, assessments, and events. Every student sees exactly what\'s due.' },
];

export const TeacherTools = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section id="for-teachers" className="bg-white py-24 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left — 2×2 feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 lg:order-1">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="bg-brand-bg rounded-2xl p-6 h-full border border-brand-border/50 transition-all duration-200 hover:shadow-sm">
                  <Icon className="text-brand-dark w-5 h-5 mb-4 opacity-70" />
                  <h4 className="text-brand-dark font-black text-[15px] leading-snug tracking-tight mb-2">{f.title}</h4>
                  <p className="text-brand-eyebrow text-[13px] leading-relaxed font-medium">{f.body}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Right — sticky text */}
        <div className="lg:sticky lg:top-28 self-start order-1 lg:order-2">
          <FadeIn>
            <span className="eyebrow">FOR TEACHERS</span>
            <h2 className="text-brand-dark text-[clamp(1.9rem,3.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
              Your class.<br />Under control.
            </h2>
            <p className="mt-5 text-stone-500 text-[15px] leading-relaxed max-w-[38ch] font-medium">
              Progress tracking, marks, resources, announcements, and homework — all replaced by one clean dashboard.
            </p>
            <button
              onClick={() => onNavigate('portal')}
              className="mt-8 bg-brand-dark text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-stone-800 active:scale-[0.97] transition-all cursor-pointer inline-flex items-center gap-2.5"
            >
              Teacher Portal <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
