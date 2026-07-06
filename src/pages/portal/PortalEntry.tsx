import { motion } from 'motion/react';
import { ArrowLeft, Shield, GraduationCap, BookOpen, ChevronRight, LucideIcon } from 'lucide-react';
import { Grain } from '../../shared/components/Grain';
import { useSpotlight, SpotlightGlow } from '../../features/landing/new/Animations';

type Page = string;

const roles = [
  {
    id: 'student-login',
    icon: BookOpen,
    label: 'Learner',
    eyebrow: 'For Students',
  },
  {
    id: 'teacher-login',
    icon: GraduationCap,
    label: 'Teacher',
    eyebrow: 'For Teachers',
  },
  {
    id: 'admin-login',
    icon: Shield,
    label: 'Admin',
    eyebrow: 'For Schools',
  },
];

interface RoleButtonProps {
  role: typeof roles[number];
  index: number;
  onNavigate: (page: Page) => void;
}

const RoleButton = ({ role, index, onNavigate }: RoleButtonProps) => {
  const Icon: LucideIcon = role.icon;
  const { ref, onMouseMove } = useSpotlight<HTMLButtonElement>();
  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onClick={() => onNavigate(role.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.12 } }}
      whileTap={{ scale: 0.98 }}
      className="group group/spot relative overflow-hidden w-full text-left bg-white/55 backdrop-blur-md rounded-2xl border border-white/70 px-5 py-5 flex items-center gap-5 shadow-sm shadow-stone-900/5 hover:bg-amber-950/15 hover:border-accent hover:ring-2 hover:ring-accent hover:shadow-lg hover:shadow-stone-900/10 transition-all"
    >
      <SpotlightGlow tone="white" />
      <div className="w-13 h-13 rounded-2xl bg-linear-to-br from-stone-700 to-brand-dark shadow-inner shadow-black/30 flex items-center justify-center shrink-0 group-hover:from-accent group-hover:to-amber-500 transition-colors">
        <Icon className="w-5 h-5 text-white group-hover:text-accent-foreground transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400 mb-1">{role.eyebrow}</p>
        <p className="font-black text-brand-dark text-[17px] leading-tight">{role.label}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-accent group-hover:translate-x-0.5 shrink-0 transition-all" />
    </motion.button>
  );
};

export default function PortalEntry({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #FBF2E2 0%, #F5F0E8 40%, #EAF0EE 100%)' }}>

      {/* Left — branding panel (desktop only) */}
      <div
        className="relative hidden lg:flex flex-col justify-between w-95 shrink-0 px-10 py-10 overflow-hidden"
        style={{ background: '#1C1917' }}
      >
        <Grain />
        {/* Same topographic texture as the right panel, but blended for a dark
            surface — screen instead of multiply, so the contour lines read as
            a faint light etching rather than vanishing into the black. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-screen"
          style={{
            backgroundImage: "url('/images/hero_topography_1779608850775.png')",
            backgroundSize: '220% auto',
            backgroundPosition: '20% 40%',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent)',
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-base tracking-tight">Prospect</span>
        </div>

        <div className="relative">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-200/80 mb-3">School Portal</p>
          <h2
            className="text-white font-black leading-[1.1] mb-5"
            style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.5rem)', letterSpacing: '-0.03em' }}
          >
            Everything your school needs.
          </h2>
          <p className="text-stone-400 text-[14px] leading-relaxed max-w-[28ch]">
            Students, teachers, and admins — each with their own dashboard. Free for every South African school.
          </p>
        </div>

        <p className="relative text-stone-600 text-[10px] font-black uppercase tracking-widest">Free · Always</p>
      </div>

      {/* Right — role selection */}
      <div className="relative flex-1 flex flex-col overflow-hidden">

        {/* Topographic contour texture — same asset the old homepage hero used,
            never carried over to the redesign. Ties into the "find your path"
            idea instead of leaving the panel a flat colour. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
          style={{
            backgroundImage: "url('/images/hero_topography_1779608850775.png')",
            backgroundSize: '260% auto',
            backgroundPosition: '100% 30%',
          }}
        />

        {/* Cool glow — a clear, glassy counterpoint to the warm left panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] w-xl h-144 rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(125,211,252,0.35), rgba(125,211,252,0) 70%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-15%] left-[8%] w-104 h-104 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(94,234,212,0.3), rgba(94,234,212,0) 70%)' }}
        />

        {/* Top bar */}
        <div className="relative flex items-center px-6 h-14 border-b border-stone-200/50 backdrop-blur-sm">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="mb-9">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Portal Login</p>
                <h1
                  className="font-black text-brand-dark leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.375rem)', letterSpacing: '-0.03em' }}
                >
                  Pick your portal.
                </h1>
                <p className="text-stone-400 text-[14px] mt-2">Every role gets its own dashboard — choose yours to sign in.</p>
              </div>

              <div className="space-y-3">
                {roles.map((role, i) => (
                  <RoleButton key={role.id} role={role} index={i} onNavigate={onNavigate} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
