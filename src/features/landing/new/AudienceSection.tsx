import { FadeIn } from './Animations';
import { GraduationCap, BookOpen, Building2 } from './icons';

const cards = [
  {
    id: 'student',
    icon: GraduationCap,
    eyebrow: 'For Students',
    heading: 'Your future, mapped out.',
    body: 'Take the RIASEC career quiz, explore 400+ SA careers, find bursaries, study for matric, and track your progress.',
    features: ['Career Quiz & Matching', 'Study Library — 35 topics', 'Bursary Finder', 'APS Calculator', 'My Future Dashboard'],
    cta: 'Start Learning',
    dark: true,
  },
  {
    id: 'teacher',
    icon: BookOpen,
    eyebrow: 'For Teachers',
    heading: 'Everything you need to teach.',
    body: 'Manage classes, track student progress, record marks, upload resources, and post announcements — from one dashboard.',
    features: ['Student Progress Tracking', 'Mark Sheets & Grades', 'Resource Uploads', 'Class Calendar', 'Past Papers'],
    cta: 'Teacher Portal',
    dark: false,
  },
  {
    id: 'school',
    icon: Building2,
    eyebrow: 'For Schools',
    heading: 'One platform. Zero cost.',
    body: 'Give your entire school access — student dashboards, teacher tools, admin controls, and announcements. No subscription.',
    features: ['Admin Dashboard', 'School Announcements', 'Teacher Management', 'Student Accounts', 'Completely Free'],
    cta: 'Set Up Your School',
    dark: false,
  },
];

export const AudienceSection = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section id="for-students" className="bg-brand-bg py-24 px-5">
      <div className="max-w-6xl mx-auto">

        <FadeIn className="text-center mb-14">
          <span className="eyebrow">WHO IT'S FOR</span>
          <h2 className="text-brand-dark text-[clamp(2rem,4vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Built for everyone in the classroom.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <FadeIn key={card.id} delay={i * 0.1} className="h-full">
                <div className={`rounded-3xl p-8 md:p-9 h-full flex flex-col transition-all duration-300 ${
                  card.dark
                    ? 'bg-brand-dark hover:shadow-xl shadow-stone-900/10'
                    : 'bg-white border border-brand-border hover:shadow-md'
                }`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    card.dark ? 'bg-white/10' : 'bg-brand-dark'
                  }`}>
                    <Icon className={`w-5 h-5 ${card.dark ? 'text-white' : 'text-white'}`} />
                  </div>

                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-7 ${
                    card.dark ? 'text-stone-500' : 'text-brand-eyebrow'
                  }`}>{card.eyebrow}</span>

                  <h3 className={`text-lg font-black mt-2 leading-snug tracking-tight ${
                    card.dark ? 'text-white' : 'text-brand-dark'
                  }`}>{card.heading}</h3>

                  <p className={`text-[14px] leading-relaxed mt-3 font-medium ${
                    card.dark ? 'text-stone-400' : 'text-brand-eyebrow'
                  }`}>{card.body}</p>

                  <ul className="mt-6 space-y-2.5 mb-8 flex-1">
                    {card.features.map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-[13px] font-medium">
                        <div className={`w-1 h-1 rounded-full shrink-0 ${
                          card.dark ? 'bg-white/25' : 'bg-brand-dark/15'
                        }`} />
                        <span className={card.dark ? 'text-white/65' : 'text-brand-eyebrow'}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onNavigate(card.id === 'student' ? 'quiz' : 'portal')}
                    className={`mt-auto w-full rounded-xl py-3.5 font-black text-[13px] tracking-wide transition-all hover:opacity-90 active:scale-[0.97] cursor-pointer ${
                      card.dark
                        ? 'bg-white text-brand-dark'
                        : 'bg-brand-dark text-white'
                    }`}
                  >
                    {card.cta}
                  </button>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
