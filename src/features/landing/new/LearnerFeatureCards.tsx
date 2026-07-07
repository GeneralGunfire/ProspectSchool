import { FadeIn } from './Animations';
import { useSpotlight, SpotlightGlow } from './Animations';
import {
  ClipboardList, CalendarClock, ClipboardCheck, Bell,
  FolderOpen, Award, Sparkles, FileText, LucideIcon,
} from './icons';

// The complete real student portal nav — src/pages/portal/StudentDashboard.tsx
// navItems: Home, Announcements, Behaviour, Timetable, Calendar, My Marks,
// Resources, Past Papers, Library, Topic Tests, APS & Unis, My Future. Home
// and Library are covered elsewhere on the page (StudyLibrary section, quiz
// funnel), so this grid covers the remaining 8 account-specific items with
// copy that says what the feature actually does, not just its name.
interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: 'My Marks',
    description: 'Every mark sheet your teacher enters, term by term, with weighted final marks calculated for you automatically.',
    icon: ClipboardList,
  },
  {
    title: 'Timetable',
    description: 'Your full weekly class schedule, built by your school admin — which subject, which room, every period.',
    icon: CalendarClock,
  },
  {
    title: 'Topic Tests',
    description: 'Timed tests your teacher assigns per topic. Multiple-choice questions grade instantly; written answers get marked and returned.',
    icon: ClipboardCheck,
  },
  {
    title: 'Calendar',
    description: 'Homework due dates, assessments, and school events from every teacher you have, in one place.',
    icon: CalendarClock,
  },
  {
    title: 'Announcements',
    description: 'School-wide notices from admin and class-specific updates from your teachers, newest first.',
    icon: Bell,
  },
  {
    title: 'Resources',
    description: 'Worksheets, slides, and study material your teachers upload — download anytime, no waiting on WhatsApp groups.',
    icon: FolderOpen,
  },
  {
    title: 'Past Papers',
    description: 'Exam papers your school has uploaded, organised by subject and grade, for exam revision.',
    icon: FileText,
  },
  {
    title: 'Behaviour',
    description: 'A running timeline of merits and demerits your teachers log, so you always know where you stand.',
    icon: Award,
  },
  {
    title: 'My Future',
    description: 'Your APS score, career matches from the quiz, and study progress, pulled into one dashboard.',
    icon: Sparkles,
  },
];

const FeatureTile = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;
  const { ref, onMouseEnter, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      className="group group/spot relative overflow-hidden rounded-2xl bg-white border border-brand-border p-6 hover:border-accent/40 transition-colors"
    >
      <SpotlightGlow tone="accent" />
      <div className="w-10 h-10 rounded-xl bg-brand-dark/8 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
        <Icon className="w-4.5 h-4.5 text-brand-dark" />
      </div>
      <h4 className="font-black text-[14px] tracking-tight text-brand-dark">{feature.title}</h4>
      <p className="text-[13px] leading-relaxed font-medium text-brand-eyebrow mt-2">{feature.description}</p>
    </div>
  );
};

export const LearnerFeatureCards = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="py-16 lg:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-10 lg:mb-14">
          <span className="eyebrow">STUDENT ACCOUNT</span>
          <h2 className="text-brand-dark text-[clamp(1.75rem,5.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Everything school, in one login.
          </h2>
          <p className="mt-4 text-brand-eyebrow text-[14px] sm:text-[15px] leading-relaxed max-w-[52ch] mx-auto font-medium">
            The same account your teacher and school use — marks, timetable, tests, and every announcement, all in your dashboard.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.05}>
              <FeatureTile feature={feature} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3} className="text-center mt-10">
          <button
            onClick={() => onNavigate('portal')}
            className="bg-brand-dark text-white rounded-xl px-8 py-3.5 font-black text-[13px] tracking-wide hover:bg-brand-dark/90 active:scale-[0.97] transition-all cursor-pointer"
          >
            Student Portal Login →
          </button>
        </FadeIn>
      </div>
    </section>
  );
};
