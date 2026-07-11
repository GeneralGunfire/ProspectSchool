import type { CSSProperties } from 'react';
import { motion } from 'motion/react';

export function Shimmer({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded ${className}`} style={{ background: 'var(--color-paper-raise)', ...style }}>
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
