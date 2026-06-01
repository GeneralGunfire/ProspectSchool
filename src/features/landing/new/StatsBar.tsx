import { FadeIn } from './Animations';

const stats = [
  { value: '400+', label: 'SA Careers' },
  { value: '245+', label: 'Bursaries' },
  { value: '35',   label: 'Study Topics' },
  { value: '26',   label: 'TVET Colleges' },
  { value: '100%', label: 'Free · Always' },
];

export const StatsBar = () => {
  return (
    <section className="bg-brand-dark py-14 px-5 border-y border-stone-800/60">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-around items-center gap-x-8 gap-y-10">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.08} direction="up" className="text-center">
              <div className="text-white font-mono font-black text-[clamp(1.75rem,4vw,2.25rem)] tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="text-stone-500 font-black uppercase tracking-[0.18em] text-[9px] mt-2">
                {stat.label}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
