import { motion } from 'motion/react';
import { ArrowLeft, Shield, GraduationCap, BookOpen, ChevronRight, LucideIcon } from 'lucide-react';

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
      className="group w-full text-left bg-white border border-brand-border hover:border-stone-300 hover:shadow-md rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-200"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-bg group-hover:bg-accent/15 flex items-center justify-center shrink-0 transition-colors border border-brand-border">
        <Icon className="w-5 h-5 text-brand-dark/70 group-hover:text-brand-dark transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-eyebrow mb-0.5">{role.eyebrow}</p>
        <p className="font-black text-brand-dark text-[16px] leading-tight">{role.label}</p>
        <p className="text-[12px] text-stone-500 mt-0.5 font-medium leading-snug">{role.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-brand-dark shrink-0 transition-colors" />
    </motion.button>
  );
};

export default function PortalEntry({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #FAFAFA 0%, #F1F0EC 55%, #FAFAFA 100%)' }}
    >

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between px-8 h-16 border-b border-brand-border">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.jpg" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
          <span className="text-brand-dark font-black text-sm tracking-tight">Prospect</span>
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-brand-eyebrow hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </button>
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-3">School Portal</p>
            <h1 className="font-black text-brand-dark text-[clamp(1.75rem,3vw,2.25rem)] leading-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
              Welcome back.
            </h1>
            <p className="text-stone-500 text-[14px] font-medium mb-9">
              Choose your role to sign in to your dashboard.
            </p>

            <div className="space-y-3">
              {roles.map((role, i) => (
                <RoleButton key={role.id} role={role} index={i} onNavigate={onNavigate} />
              ))}
            </div>

            <p className="text-center text-[11px] text-stone-400 font-medium mt-8">
              Need access? Contact your school administrator.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 px-8 py-5 flex items-center justify-between border-t border-brand-border">
        <p className="text-[11px] text-stone-400 font-medium">
          © {new Date().getFullYear()} Prospect South Africa · Free for every school
        </p>
        <button
          onClick={() => onNavigate('platform-login')}
          className="text-[11px] font-medium text-stone-300 hover:text-stone-500 transition-colors"
        >
          Platform Administrator
        </button>
      </div>
    </div>
  );
}
