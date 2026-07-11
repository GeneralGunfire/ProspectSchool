import { motion } from 'motion/react';
import { Shield, GraduationCap, BookOpen, Users, ChevronRight, ArrowLeft, LucideIcon } from 'lucide-react';

type Page = string;

const roles = [
  {
    id: 'student-login',
    icon: BookOpen,
    label: 'Learner',
    eyebrow: 'For Students',
    desc: 'Access your study library, marks & career tools.',
  },
  {
    id: 'parent-login',
    icon: Users,
    label: 'Parent',
    eyebrow: 'For Parents',
    desc: "Follow your child's attendance, marks & behaviour.",
  },
  {
    id: 'teacher-login',
    icon: GraduationCap,
    label: 'Teacher',
    eyebrow: 'For Teachers',
    desc: 'Manage classes, marks, resources & homework.',
  },
  {
    id: 'admin-login',
    icon: Shield,
    label: 'Admin',
    eyebrow: 'For Schools',
    desc: 'Oversee teachers, students & announcements.',
  },
];

const RoleButton = ({ role, index, onNavigate }: { role: typeof roles[number]; index: number; onNavigate: (p: Page) => void }) => {
  const Icon: LucideIcon = role.icon;
  return (
    <motion.button
      onClick={() => onNavigate(role.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ x: 3, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      className="group w-full text-left rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 flex items-center gap-3.5 sm:gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'color-mix(in srgb, white 55%, transparent)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        border: '1px solid color-mix(in srgb, white 60%, var(--color-brand-border))',
        boxShadow: '0 8px 24px -12px rgba(11,29,51,0.15)',
      }}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/50 group-hover:bg-accent/15 flex items-center justify-center shrink-0 transition-colors border border-white/60">
        <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-brand-dark/70 group-hover:text-brand-dark transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-brand-dark text-[15px] sm:text-[16px] leading-tight">{role.label}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-brand-eyebrow/50 group-hover:text-brand-dark shrink-0 transition-colors" />
    </motion.button>
  );
};

export default function PortalEntry({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-brand-bg">
      {/* Top nav — same floating glass pill as the landing page navbar, but
          with only the logo and a back button, since Students/Teachers/
          Pricing links and "Portal Login" don't apply on the portal
          entry page itself. */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4">
        <nav className="max-w-3xl mx-auto bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/60 shadow-lg shadow-slate-900/8 rounded-full">
          <div className="h-13 flex items-center justify-between px-2.5">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 pl-2.5 cursor-pointer">
              <img src="/logo3.png" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
              <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 mr-1 text-[12px] font-bold text-brand-eyebrow hover:text-brand-dark hover:bg-brand-dark/5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        </nav>
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-24 sm:pt-28 pb-10 sm:pb-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="font-black text-brand-dark text-[clamp(1.5rem,6vw,2.25rem)] leading-tight mb-6 sm:mb-9" style={{ letterSpacing: '-0.03em' }}>
              Welcome back.
            </h1>

            <div className="space-y-2.5 sm:space-y-3">
              {roles.map((role, i) => (
                <RoleButton key={role.id} role={role} index={i} onNavigate={onNavigate} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-center border-t border-brand-border">
        <p className="text-[10.5px] sm:text-[11px] text-brand-eyebrow/70 font-medium">
          © {new Date().getFullYear()} Prospect South Africa · Free for every school
        </p>
        <button
          onClick={() => onNavigate('platform-login')}
          className="text-[10.5px] sm:text-[11px] font-medium text-brand-eyebrow/50 hover:text-brand-eyebrow transition-colors"
        >
          Platform Administrator
        </button>
      </div>
    </div>
  );
}
