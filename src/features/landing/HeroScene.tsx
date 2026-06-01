import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  type MotionValue,
} from 'motion/react';

interface HeroSceneProps {
  onNavigate: (page: string) => void;
}

// Each image card — parallax depth layer
const images = [
  { src: '/images/students.webp',    alt: 'Students',     x: '52%',  y: '2%',   w: 280, rotate: 5,   z: 1,   delay: 0.1  },
  { src: '/images/engineer.webp',    alt: 'Engineer',     x: '72%',  y: '0%',   w: 230, rotate: -4,  z: 2,   delay: 0.18 },
  { src: '/images/nurse.webp',       alt: 'Nurse',        x: '84%',  y: '28%',  w: 200, rotate: 3,   z: 3,   delay: 0.26 },
  { src: '/images/electrician.webp', alt: 'Electrician',  x: '62%',  y: '50%',  w: 240, rotate: -6,  z: 2,   delay: 0.2  },
  { src: '/images/teacher.webp',     alt: 'Teacher',      x: '80%',  y: '55%',  w: 210, rotate: 4,   z: 4,   delay: 0.32 },
];

// Floating card with mouse parallax + bob
function FloatingCard({
  src, alt, x, y, w, rotate, z, delay, mouseX, mouseY,
}: {
  src: string; alt: string; x: string; y: string; w: number;
  rotate: number; z: number; delay: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  // Mouse parallax — deeper z = more movement
  const parallaxStrength = z * 6;
  const cardX = useTransform(mouseX, [-1, 1], [-parallaxStrength, parallaxStrength]);
  const cardY = useTransform(mouseY, [-1, 1], [-parallaxStrength, parallaxStrength]);

  const springX = useSpring(cardX, { stiffness: 60, damping: 20 });
  const springY = useSpring(cardY, { stiffness: 60, damping: 20 });

  // Bob animation via animationFrame
  const bobY = useMotionValue(0);
  const timeRef = useRef(Math.random() * Math.PI * 2);
  useAnimationFrame((t) => {
    timeRef.current = t / 1000;
    bobY.set(Math.sin(timeRef.current * 0.6 + delay * 10) * 8);
  });

  // Composite Y
  const finalY = useTransform([springY, bobY], ([sy, by]) => (sy as number) + (by as number));

  const depth = 1 - (z - 1) / 4; // 1.0 → 0.75 opacity based on z

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: depth, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        x: springX,
        y: finalY,
        rotate,
        zIndex: z,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: `0 ${8 + z * 6}px ${24 + z * 16}px rgba(28,25,23,${0.12 + z * 0.04})`,
          aspectRatio: '3/4',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="eager"
        />
      </div>
    </motion.div>
  );
}

export default function HeroScene({ onNavigate }: HeroSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven exit
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY       = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const imagesOpacity  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imagesY        = useTransform(scrollYProgress, [0, 0.6], [0, -120]);

  // Mouse tracking — normalised -1 to 1
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: '#F5F0E8',
      }}
    >
      {/* Topography texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/hero_topography_1779608850775.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />


      {/* Floating image cards */}
      <motion.div
        style={{ opacity: imagesOpacity, y: imagesY, position: 'absolute', inset: 0 }}
      >
        {images.map((img) => (
          <FloatingCard
            key={img.src}
            {...img}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </motion.div>

      {/* DOM overlay — left bottom anchor */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {/* Dateline */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}
        >
          <div style={{ width: 32, height: 1, background: '#A8A29E' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.2em', color: '#78716C', fontWeight: 500, textTransform: 'uppercase' }}>
            Prospect · SA · 2026
          </span>
        </motion.div>

        {/* Giant headline — word by word */}
        <h1 style={{ lineHeight: 0.94, marginBottom: 40 }}>
          {[
            { words: ['Built', 'for'], delay: 0.35 },
            { words: ['South', 'Africa.'], delay: 0.55, muted: true },
          ].map(({ words, delay, muted }) => (
            <div
              key={words.join('')}
              style={{ overflow: 'hidden', marginBottom: '0.02em' }}
            >
              <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                {words.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ y: '105%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.09 }}
                    style={{
                      display: 'block',
                      fontSize: 'clamp(3.5rem, 9.5vw, 8rem)',
                      fontWeight: 900,
                      letterSpacing: '-0.045em',
                      color: muted ? '#A89880' : '#1C1917',
                      marginRight: i < words.length - 1 ? '0.22em' : 0,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </h1>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
          style={{ display: 'flex', gap: 12, alignItems: 'center', pointerEvents: 'auto' }}
        >
          <motion.button
            onClick={() => onNavigate('quiz')}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            style={{
              background: '#1C1917',
              color: '#FAFAF9',
              border: 'none',
              borderRadius: 9999,
              padding: '14px 28px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 12px 40px rgba(28,25,23,0.28)',
            }}
          >
            Career Guide <span style={{ fontSize: 16 }}>→</span>
          </motion.button>

          <motion.button
            onClick={() => onNavigate('library')}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            style={{
              background: 'rgba(245,240,232,0.7)',
              color: '#1C1917',
              border: '1.5px solid #D6D3D1',
              borderRadius: 9999,
              padding: '14px 28px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            School Assist
          </motion.button>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ fontSize: 12, color: '#A8A29E', marginLeft: 8 }}
          >
            Free · No account needed
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        style={{
          position: 'absolute',
          bottom: 40,
          right: 'clamp(1.5rem, 5vw, 5rem)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: '#A8A29E',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', repeatDelay: 0.3 }}
          style={{
            width: 1,
            height: 40,
            background: '#A8A29E',
            transformOrigin: 'top',
          }}
        />
      </motion.div>
    </section>
  );
}
