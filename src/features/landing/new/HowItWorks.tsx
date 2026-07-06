import { FadeIn } from './Animations';

const steps = [
  {
    n: '01',
    title: 'Take the career quiz',
    body: '35 questions, RIASEC scored, matched against 400+ SA careers in minutes.',
  },
  {
    n: '02',
    title: 'Explore your matches',
    body: 'Salaries, APS requirements, bursaries, and TVET pathways for every result.',
  },
  {
    n: '03',
    title: 'Build your plan',
    body: 'Track your studies, save your goals, and get guidance built around them.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2 className="text-brand-dark text-[clamp(1.9rem,3.5vw,2.75rem)] tracking-tight mt-3 leading-[1.2] font-black">
            Three steps to your future.
          </h2>
        </FadeIn>

        <div className="divide-y divide-brand-border">
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.1}>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-7">
                <span className="font-mono text-[13px] font-black text-accent tracking-wide shrink-0 w-8">{step.n}</span>
                <h3 className="font-black text-brand-dark text-[19px] tracking-tight shrink-0 sm:w-64">{step.title}</h3>
                <p className="text-stone-500 text-[15px] leading-relaxed font-medium">{step.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
