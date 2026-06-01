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

export const FadeIn = ({ children, delay = 0, direction = 'up', className = '', viewportOnce = true }: FadeInProps) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, className = '', delayStep = 0.05, initialDelay = 0 }: { children: ReactNode, className?: string, delayStep?: number, initialDelay?: number }) => {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <FadeIn key={i} delay={initialDelay + (i * delayStep)}>
              {child}
            </FadeIn>
          ))
        : children}
    </div>
  );
};
