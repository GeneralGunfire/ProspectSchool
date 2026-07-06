import { FadeIn, useSpotlight, SpotlightGlow } from './Animations';
import { GraduationCap, BookOpen, Building2, LucideIcon } from './icons';

const cards = [
  {
    id: 'student',
    icon: GraduationCap,
    eyebrow: 'For Students',
    heading: 'Your future, mapped out.',
    body: 'Explore 400+ careers, find bursaries, and track your progress.',
    features: ['Career Quiz & Matching', 'Study Library — 35 topics', 'Bursary Finder', 'APS Calculator', 'My Future Dashboard'],
    cta: 'Start Learning',
  },
  {
    id: 'teacher',
    icon: BookOpen,
    eyebrow: 'For Teachers',
    heading: 'Everything you need to teach.',
    body: 'Classes, marks, resources, and announcements — one dashboard.',
    features: ['Student Progress Tracking', 'Mark Sheets & Grades', 'Resource Uploads', 'Class Calendar', 'Past Papers'],
    cta: 'Teacher Portal',
  },
  {
    id: 'school',
    icon: Building2,
    eyebrow: 'For Schools',
    heading: 'One platform. Zero cost.',
    body: 'Student, teacher, and admin dashboards — no subscription.',
    features: ['Admin Dashboard', 'School Announcements', 'Teacher Management', 'Student Accounts', 'Completely Free'],
    cta: 'Set Up Your School',
  },
];

interface AudienceCardProps {
  card: typeof cards[number];
  light: boolean;
  onNavigate: (p: string) => void;
}

const AudienceCard = ({ card, light, onNavigate }: AudienceCardProps) => {
  const Icon: LucideIcon = card.icon;
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`group group/spot relative overflow-hidden p-8 md:p-9 h-full flex flex-col ${
        light
          ? 'card-premium bg-white border border-brand-border hover:border-accent/50'
          : 'card-premium-dark bg-brand-dark'
      }`}
    >
      <SpotlightGlow tone={light ? 'accent' : 'white'} />

      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${light ? 'bg-brand-dark/5' : 'bg-white/10 shadow-inner shadow-black/30'}`}>
        <Icon className={`w-5 h-5 ${light ? 'text-brand-dark' : 'text-accent'}`} />
      </div>

      <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-7 ${light ? 'text-slate-400' : 'text-brand-eyebrow'}`}>{card.eyebrow}</span>

      <h3 className={`text-lg font-black mt-2 leading-snug tracking-tight ${light ? 'text-brand-dark' : 'text-white'}`}>{card.heading}</h3>

      <p className={`text-[14px] leading-relaxed mt-3 font-medium ${light ? 'text-brand-eyebrow' : 'text-slate-400'}`}>{card.body}</p>

      <ul className="mt-6 space-y-2.5 mb-8 flex-1">
        {card.features.map(item => (
          <li key={item} className="flex items-center gap-2.5 text-[13px] font-medium">
            <div className={`w-1 h-1 rounded-full shrink-0 ${light ? 'bg-brand-dark/25' : 'bg-white/25'}`} />
            <span className={light ? 'text-brand-eyebrow' : 'text-white/65'}>{item}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onNavigate(card.id === 'student' ? 'quiz' : 'portal')}
        className={`relative mt-auto w-full rounded-xl py-3.5 font-black text-[13px] tracking-wide transition-all hover:brightness-105 active:scale-[0.97] cursor-pointer ${
          light ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark'
        }`}
      >
        {card.cta}
      </button>
    </div>
  );
};

export const AudienceSection = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section id="for-students" className="py-28 px-5">
      <div className="max-w-6xl mx-auto">

        <FadeIn className="text-center mb-14">
          <span className="eyebrow">WHO IT'S FOR</span>
          <h2 className="text-brand-dark text-[clamp(2rem,4vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Built for everyone in the classroom.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <FadeIn key={card.id} delay={i * 0.1} className="h-full">
              <AudienceCard card={card} light={i === 1} onNavigate={onNavigate} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
