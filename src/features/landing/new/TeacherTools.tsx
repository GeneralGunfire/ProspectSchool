import { FadeIn } from './Animations';
import { Users, ClipboardList, FolderOpen, CalendarDays, ArrowRight } from './icons';

const teacherFeatures = [
  { icon: Users, title: "Student Profiles", body: "Click any student to see their full progress, marks, homework, and announcements." },
  { icon: ClipboardList, title: "Mark Sheets", body: "Create assessments, enter marks for your class, track performance over time." },
  { icon: FolderOpen, title: "Resources", body: "Upload notes, worksheets, and videos. Students access them instantly." },
  { icon: CalendarDays, title: "Calendar", body: "Post homework, assessments, and events. Students see what's due." }
];

export const TeacherTools = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-white py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left Column — 2x2 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 order-2 lg:order-1">
          {teacherFeatures.map((f, i) => (
            <FadeIn key={i} delay={i * 0.1} className="group">
              <div className="bg-brand-bg rounded-[24px] p-8 h-full transition-all duration-300 hover:shadow-sm border border-brand-border/40">
                <f.icon className="text-brand-dark w-8 h-8 mb-6 opacity-70" />
                <h4 className="text-brand-dark font-bold text-lg leading-tight mb-3 tracking-tight">{f.title}</h4>
                <p className="text-brand-eyebrow text-[14px] leading-relaxed font-medium">{f.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Right Column — Sticky Text */}
        <div className="lg:sticky lg:top-32 self-start order-1 lg:order-2">
          <FadeIn>
            <span className="eyebrow">FOR TEACHERS</span>
            <h2 className="text-brand-dark text-[clamp(2rem,4vw,3rem)] tracking-tight mt-4 leading-[1.2]">
              Your class. Under control.
            </h2>
            <p className="mt-8 text-brand-eyebrow text-[16px] leading-relaxed max-w-[42ch] font-medium opacity-90">
              Everything you used to do across five different tools — progress tracking, marks, resources, announcements, and homework — in one clean dashboard.
            </p>
            <button className="mt-10 bg-brand-dark text-white rounded-xl px-10 py-4 font-bold text-[15px] transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-3 shadow-lg shadow-brand-dark/5">
              Teacher Portal <ArrowRight className="w-5 h-5 opacity-70" />
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
