import { motion } from 'motion/react';
import { ReactNode, Key } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  viewportOnce?: boolean;
  key?: Key;
}

const EASE = [0.23, 1, 0.32, 1] as const;

export const FadeIn = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  viewportOnce = true,
}: FadeInProps) => {
  const offsets = {
    up:    { y: 16 },
    down:  { y: -16 },
    left:  { x: 16 },
    right: { x: -16 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  className = '',
  delayStep = 0.05,
  initialDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  delayStep?: number;
  initialDelay?: number;
}) => (
  <div className={className}>
    {Array.isArray(children)
      ? children.map((child, i) => (
          <FadeIn key={i} delay={initialDelay + i * delayStep}>
            {child}
          </FadeIn>
        ))
      : children}
  </div>
);
