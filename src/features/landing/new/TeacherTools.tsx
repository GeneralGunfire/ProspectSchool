import { FadeIn, CountUp, useSpotlight, SpotlightGlow } from './Animations';
import { Users, ClipboardList, FolderOpen, CalendarDays, ArrowRight } from './icons';

const features = [
  { icon: Users,         title: 'Student Profiles',  body: 'Progress, marks, and homework at a glance.' },
  { icon: ClipboardList, title: 'Mark Sheets',        body: 'Enter marks and track performance over time.' },
  { icon: FolderOpen,    title: 'Resources',          body: 'Upload files — students get them instantly.' },
  { icon: CalendarDays,  title: 'Class Calendar',     body: 'Post homework, assessments, and events.' },
];

const FeatureCard = ({ feature }: { feature: typeof features[number] }) => {
  const Icon = feature.icon;
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="group group/spot card-premium relative overflow-hidden bg-white p-5 h-full border border-brand-border hover:border-accent/50"
    >
      <SpotlightGlow tone="accent" />
      <Icon className="text-brand-dark w-4.5 h-4.5 mb-3 opacity-70 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
      <h4 className="text-brand-dark font-black text-[13px] leading-snug tracking-tight mb-1.5">{feature.title}</h4>
      <p className="text-brand-eyebrow text-[12px] leading-relaxed font-medium">{feature.body}</p>
    </div>
  );
};

export const TeacherTools = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section id="for-teachers" className="py-24 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left — stat panel + compact feature strip */}
        <div className="order-2 lg:order-1">
          <FadeIn direction="right">
            <div className="relative rounded-3xl bg-brand-dark px-8 py-10 flex items-center overflow-hidden aspect-16/10 shadow-lg shadow-stone-900/10">
              <div className="relative z-10 max-w-[40%]">
                <p className="text-white font-mono font-black text-[clamp(2.5rem,5.5vw,4rem)] leading-none tracking-tight">
                  <CountUp value={4} />
                </p>
                <p className="text-stone-400 font-black uppercase tracking-[0.16em] text-[11px] mt-3">
                  Tools replaced by one dashboard
                </p>
              </div>
              <img
                src="/images/stat-dashboard-graphic.jpg"
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="absolute -right-6 top-1/2 -translate-y-1/2 h-[135%] w-auto object-contain opacity-90"
              />
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-brand-dark via-brand-dark/80 to-transparent" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-3 mt-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={0.1 + i * 0.06}>
                <FeatureCard feature={f} />
              </FadeIn>
            ))}
          </div>
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
