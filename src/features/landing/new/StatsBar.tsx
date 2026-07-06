import { FadeIn, CountUp } from './Animations';

const stats = [
  { value: 400, suffix: '+', label: 'SA Careers' },
  { value: 245, suffix: '+', label: 'Bursaries' },
  { value: 35,  suffix: '',  label: 'Study Topics' },
  { value: 26,  suffix: '',  label: 'TVET Colleges' },
  { value: 100, suffix: '%', label: 'Free · Always' },
];

export const StatsBar = () => {
  return (
    <section className="relative bg-brand-bg py-14 px-5 border-y border-brand-border/60">
      <div className="relative max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-8">
          {stats.map((stat, i) => (
            <FadeIn
              key={i}
              delay={i * 0.08}
              direction="up"
              className={`text-center px-4 ${i === stats.length - 1 ? 'col-span-2 sm:col-span-1' : ''} ${i > 0 ? 'sm:border-l sm:border-brand-border/60' : ''}`}
            >
              <div className="text-brand-dark font-mono font-black text-[clamp(1.75rem,4vw,2.25rem)] tracking-tight leading-none">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate-400 font-black uppercase tracking-[0.18em] text-[9px] mt-2">
                {stat.label}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
