import { FadeIn } from './Animations';
import { Users, ClipboardList, FolderOpen, CalendarDays, Building2, AlertTriangle, Award, ClipboardCheck, LucideIcon } from './icons';

interface StaticRow {
  label: string;
  sublabel: string;
  description: string;
  icon: LucideIcon;
}

// Mirrors the real navigation in src/pages/portal/TeacherDashboard.tsx —
// Classes, Homeroom, Behaviour, Timetable, Marks, Resources, Past Papers,
// Topic Tests, and At-Risk are all built and live, not aspirational copy.
const teacherRows: StaticRow[] = [
  { label: 'Classes & Homeroom', sublabel: 'Teachers', description: 'Class rosters, homeroom attendance, and student assignment.', icon: Users },
  { label: 'Marks & Mark Sheets', sublabel: 'Teachers', description: 'Enter marks per term with weighted final-mark calculation.', icon: ClipboardList },
  { label: 'Topic Tests', sublabel: 'Teachers', description: 'Author timed tests with auto-graded MCQs and manual marking.', icon: ClipboardCheck },
  { label: 'Behaviour & Timetable', sublabel: 'Teachers', description: 'Log merits/demerits and manage the weekly class timetable.', icon: CalendarDays },
  { label: 'At-Risk Tracking', sublabel: 'Teachers', description: 'Flags students who need intervention based on marks and attendance.', icon: AlertTriangle },
  { label: 'Resources & Past Papers', sublabel: 'Teachers', description: 'Upload files and papers — students get them instantly.', icon: FolderOpen },
];

// Mirrors src/pages/portal/AdminDashboard.tsx — Teachers, Students, Parents,
// Classes, Timetable, and Assignments management.
const schoolRows: StaticRow[] = [
  { label: 'Teacher & Student Accounts', sublabel: 'Admin', description: 'Create and manage every teacher and student account for the school.', icon: Building2 },
  { label: 'Parent Accounts', sublabel: 'Admin', description: 'Link parents to their children for read-only progress access.', icon: Users },
  { label: 'Class & Teacher Assignment', sublabel: 'Admin', description: 'Assign students to teachers and build the school timetable.', icon: Award },
];

// Static, non-interactive counterpart to LearnerDestinations — no hover
// expand/collapse, just a flat labelled list. Teacher/school features are
// admin-facing utilities, not exploratory destinations, so a quieter
// presentation reads more appropriately than the learner's hover-reveal rows.
const StaticRowList = ({ rows }: { rows: StaticRow[] }) => (
  <div className="rounded-3xl border border-brand-border overflow-hidden bg-white">
    {rows.map((row) => {
      const Icon = row.icon;
      return (
        <div key={row.label} className="flex items-center gap-4 px-6 py-5 border-b border-brand-border/60 last:border-b-0">
          <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-[14px] tracking-tight text-brand-dark">{row.label}</h4>
            <p className="text-[13px] mt-0.5 leading-relaxed font-medium text-brand-eyebrow">{row.description}</p>
          </div>
        </div>
      );
    })}
  </div>
);

export const RoleDestinations = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="py-16 lg:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-10 lg:mb-12">
          <span className="eyebrow">FOR TEACHERS & SCHOOLS</span>
          <h2 className="text-brand-dark text-[clamp(1.75rem,5.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Built for the whole staff room too.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <FadeIn delay={0.05}>
            <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-eyebrow mb-3">Teacher Portal</h3>
            <StaticRowList rows={teacherRows} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-eyebrow mb-3">Admin Portal</h3>
            <StaticRowList rows={schoolRows} />
          </FadeIn>
        </div>

        <FadeIn delay={0.18} className="text-center mt-8">
          <button
            onClick={() => onNavigate('portal')}
            className="bg-brand-dark text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-brand-dark/90 active:scale-[0.97] transition-all cursor-pointer"
          >
            Teacher & Admin Portal →
          </button>
        </FadeIn>
      </div>
    </section>
  );
};
