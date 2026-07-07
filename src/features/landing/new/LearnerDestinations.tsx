import { FadeIn } from './Animations';
import { HoverExpand } from './HoverExpand';

// Mirrors the real student portal nav in src/pages/portal/StudentDashboard.tsx
// — these are account features behind login, not the public career-guide
// tools (Career Quiz, Bursary Finder, etc. are covered elsewhere). Marks,
// Timetable, and Topic Tests are covered by LearnerFeatureCards above, so
// this list sticks to the remaining distinct nav items.
// Reuses the exact same Unsplash photo IDs as CareerPaths.tsx (confirmed
// rendering elsewhere on this page) rather than untested IDs or the
// deprecated source.unsplash.com redirect service, which didn't load.
const buildDestinations = (onNavigate: (p: string) => void) => [
  {
    label: 'Resources',
    sublabel: 'From Teachers',
    description: 'Files and materials your teachers upload, ready to download',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&fit=crop',
    onClick: () => onNavigate('portal'),
  },
  {
    label: 'Past Papers',
    sublabel: 'Exam Prep',
    description: 'Past exam papers uploaded by your school, organised by subject',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80&fit=crop',
    onClick: () => onNavigate('portal'),
  },
  {
    label: 'Announcements',
    sublabel: 'Stay Updated',
    description: 'School-wide and class announcements from teachers and admin',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&fit=crop',
    onClick: () => onNavigate('portal'),
  },
  {
    label: 'Behaviour',
    sublabel: 'Merits & Demerits',
    description: 'A timeline of merits and demerits logged by your teachers',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=80&fit=crop',
    onClick: () => onNavigate('portal'),
  },
  {
    label: 'My Future',
    sublabel: 'One Dashboard',
    description: 'APS score, career matches, and study progress in one place',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80&fit=crop',
    onClick: () => onNavigate('portal'),
  },
];

export const LearnerDestinations = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const items = buildDestinations(onNavigate).map(d => ({ ...d, imageAlt: d.label }));

  return (
    <section className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-12">
          <span className="eyebrow">STUDENT PORTAL</span>
          <h2 className="text-brand-dark text-[clamp(2rem,4vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Your account, once you're logged in.
          </h2>
          <p className="mt-4 text-brand-eyebrow text-[15px] leading-relaxed max-w-[48ch] mx-auto font-medium">
            Hover any row to preview where it takes you.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-3xl overflow-hidden card-premium">
            <HoverExpand items={items} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
