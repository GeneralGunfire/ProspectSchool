import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight, LucideIcon } from './icons';

export interface HeroCard {
  imageSrc?: string;
  imageAlt: string;
  badge: string;
  title: string;
  description: string;
  href: string;
  onClick?: () => void;
}

export interface FeatureCard {
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
  cardClassName?: string;
  iconClassName?: string;
  rotateClassName?: string;
}

interface StackedFeatureCardsProps {
  heroCard: HeroCard;
  featureCards: FeatureCard[];
  sectionTitle?: string;
  className?: string;
}

const FeatureRow = ({ card, index }: { card: FeatureCard; index: number }) => {
  const Icon = card.icon;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [40, 0]), { stiffness: 300, damping: 28 });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, top: 80 + index * 20 }}
      className={`relative rounded-3xl p-5 sm:p-7 md:p-8 lg:sticky ${card.rotateClassName ?? ''} ${card.cardClassName ?? 'bg-white text-brand-dark'}`}
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconClassName ?? 'bg-brand-dark/10 text-brand-dark'}`}>
          <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="font-mono text-[11px] font-bold opacity-50">{card.value}</span>
          <h4 className="font-black text-[15.5px] sm:text-[17px] tracking-tight mt-1">{card.title}</h4>
          <p className="text-[12.5px] sm:text-[13px] leading-relaxed font-medium opacity-70 mt-2">{card.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const StackedFeatureCards = ({ heroCard, featureCards, sectionTitle, className = '' }: StackedFeatureCardsProps) => {
  const Wrapper = heroCard.onClick ? 'button' : 'a';

  return (
    <section className={`py-16 lg:py-24 px-5 ${className}`}>
      <div className="max-w-5xl mx-auto">
        {sectionTitle && (
          <span className="eyebrow block w-fit mx-auto">{sectionTitle}</span>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5 lg:gap-10 mt-6 items-start">
          {/* Sticky hero card — compact, no dead space when there's no image */}
          <div className="lg:sticky lg:top-32 self-start">
            <Wrapper
              {...(heroCard.onClick ? { onClick: heroCard.onClick } : { href: heroCard.href })}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-brand-dark text-white p-6 sm:p-8 md:p-9 cursor-pointer card-premium-dark text-center lg:text-left items-center lg:items-start"
            >
              <span className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider">
                {heroCard.badge}
              </span>
              <h3 className="text-[clamp(1.35rem,4.5vw,2.1rem)] font-black tracking-tight mt-5 sm:mt-6 leading-[1.2] sm:leading-[1.15]">
                {heroCard.title}
              </h3>
              <p className="text-white/65 text-[13.5px] sm:text-[14px] leading-relaxed font-medium mt-3 max-w-[36ch]">
                {heroCard.description}
              </p>

              {heroCard.imageSrc && (
                <div className="mt-8 -mb-4 -mr-4 flex justify-end self-stretch">
                  <img
                    src={heroCard.imageSrc}
                    alt={heroCard.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-2/3 h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:-translate-y-1"
                  />
                </div>
              )}

              {/* Arrow button — two overlapping icons swap on hover */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 grid place-items-center overflow-hidden">
                <ArrowRight className="w-4 h-4 absolute transition-all duration-300 group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:opacity-0" />
                <ArrowRight className="w-4 h-4 absolute -translate-x-6 translate-y-6 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </div>
            </Wrapper>
          </div>

          {/* Stack of feature cards */}
          <div className="flex flex-col gap-5">
            {featureCards.map((card, i) => (
              <FeatureRow key={card.title} card={card} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
