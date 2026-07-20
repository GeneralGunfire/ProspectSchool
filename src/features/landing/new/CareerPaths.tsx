import { FadeIn, useSpotlight, SpotlightGlow } from './Animations';

const paths = [
  {
    title: 'Engineering',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80&fit=crop',
  },
  {
    title: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&fit=crop',
  },
  {
    title: 'Education',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80&fit=crop',
  },
  {
    title: 'Trades & Technical',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80&fit=crop',
  },
  {
    title: 'Keep Learning',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&fit=crop',
  },
];

const PathCard = ({ path, onNavigate }: { path: typeof paths[number]; onNavigate: (p: string) => void }) => {
  const { ref, onMouseEnter, onMouseMove } = useSpotlight<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onClick={() => onNavigate('quiz')}
      className="group group/spot card-premium-dark relative overflow-hidden w-full aspect-4/5 cursor-pointer text-left bg-brand-dark"
    >
      <SpotlightGlow tone="white" />
      <img
        src={path.image}
        alt={path.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Gradient overlay + label */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-black text-[13px] tracking-tight leading-tight">{path.title}</p>
      </div>
    </button>
  );
};

export const CareerPaths = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-brand-bg py-16 lg:py-24 px-5">
      <div className="relative max-w-6xl mx-auto">
        <FadeIn className="text-center mb-10 lg:mb-12">
          <span className="eyebrow">REAL CAREERS, REAL PEOPLE</span>
          <h2 className="text-brand-dark text-[clamp(1.75rem,5.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Every path has a place to start.
          </h2>
          <p className="mt-4 text-brand-eyebrow text-[14px] sm:text-[15px] leading-relaxed max-w-[48ch] mx-auto font-medium">
            Engineering, healthcare, education, trades — explore the careers South Africa needs, with real salary and demand data behind every one.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {paths.map((path, i) => (
            <FadeIn key={path.title} delay={i * 0.07}>
              <PathCard path={path} onNavigate={onNavigate} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
