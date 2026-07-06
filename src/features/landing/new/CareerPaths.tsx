import { FadeIn, useSpotlight, SpotlightGlow } from './Animations';

// These images already have the icon badge + title + body baked in (design
// reference supplied as a single composite, cropped into per-card assets) —
// rendered as-is rather than re-drawing the same text as a live HTML overlay,
// which would either duplicate it or require pixel-perfect alignment against
// a raster image for no real benefit.
const paths = [
  { image: 'career-engineering.jpg', title: 'Engineering' },
  { image: 'career-healthcare.jpg',  title: 'Healthcare' },
  { image: 'career-education.jpg',   title: 'Education' },
  { image: 'career-trades.jpg',      title: 'Trades & Technical' },
  { image: 'career-learning.jpg',    title: 'Keep Learning' },
];

const PathCard = ({ path, onNavigate }: { path: typeof paths[number]; onNavigate: (p: string) => void }) => {
  const { ref, onMouseMove } = useSpotlight<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onClick={() => onNavigate('quiz')}
      className="group group/spot card-premium-dark relative overflow-hidden w-full aspect-4/5 cursor-pointer text-left bg-brand-dark"
    >
      <SpotlightGlow tone="white" />
      <img
        src={`/images/${path.image}`}
        alt={path.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </button>
  );
};

export const CareerPaths = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-12">
          <span className="eyebrow">REAL CAREERS, REAL PEOPLE</span>
          <h2 className="text-brand-dark text-[clamp(2rem,4vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Every path has a place to start.
          </h2>
          <p className="mt-4 text-stone-500 text-[15px] leading-relaxed max-w-[48ch] mx-auto font-medium">
            Engineering, healthcare, education, trades — explore the careers South Africa needs, with real salary and demand data behind every one.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
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
