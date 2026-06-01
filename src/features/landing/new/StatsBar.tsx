import { FadeIn, StaggerContainer } from './Animations';

const stats = [
  { value: "400+", label: "SA Careers catalogued" },
  { value: "245+", label: "Bursaries searchable" },
  { value: "35", label: "Study topics available" },
  { value: "26", label: "TVET Colleges mapped" },
  { value: "100%", label: "Free, always" }
];

export const StatsBar = () => {
  return (
    <section className="bg-brand-dark py-24 px-6 overflow-hidden border-y border-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-around items-center gap-x-12 gap-y-16">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1} direction="up" className="text-center">
              <div className="text-white font-mono font-bold text-[clamp(2rem,5vw,2.8rem)] tracking-tight mb-3 leading-none opacity-90">
                {stat.value}
              </div>
              <div className="text-stone-500 font-bold uppercase tracking-[0.2em] text-[10px] max-w-[15ch] mx-auto leading-tight">
                {stat.label}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
