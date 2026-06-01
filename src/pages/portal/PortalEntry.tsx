import { motion } from 'motion/react';
import { ArrowLeft, Shield, GraduationCap, BookOpen, ChevronRight } from 'lucide-react';

type Page = string;

const roles = [
  {
    id: 'student-login',
    icon: BookOpen,
    label: 'Learner',
    desc: 'Dashboard, study library, and career tools',
    eyebrow: 'For Students',
  },
  {
    id: 'teacher-login',
    icon: GraduationCap,
    label: 'Teacher',
    desc: 'Classes, marks, resources, and student progress',
    eyebrow: 'For Teachers',
  },
  {
    id: 'admin-login',
    icon: Shield,
    label: 'Admin',
    desc: 'School administration and management',
    eyebrow: 'For Schools',
  },
];

export default function PortalEntry({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#F5F0E8' }}>

      {/* Left — branding panel (desktop only) */}
      <div
        className="hidden lg:flex flex-col justify-between w-95 shrink-0 px-10 py-10"
        style={{ background: '#1C1917' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-base tracking-tight">Prospect</span>
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">School Portal</p>
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

        <p className="text-stone-600 text-[10px] font-black uppercase tracking-widest">Free · Always</p>
      </div>

      {/* Right — role selection */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center px-6 h-14 border-b border-stone-200/50" style={{ background: '#F5F0E8' }}>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-90">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="mb-8">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Portal Login</p>
                <h1
                  className="font-black text-brand-dark leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.03em' }}
                >
                  Who are you?
                </h1>
                <p className="text-stone-400 text-[13px] mt-1.5">Select your role to continue.</p>
              </div>

              <div className="space-y-2.5">
                {roles.map((role, i) => {
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => onNavigate(role.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, ease: [0.23, 1, 0.32, 1] }}
                      whileHover={{ y: -1.5, transition: { duration: 0.12 } }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left bg-white rounded-2xl border border-stone-200 px-4 py-4 flex items-center gap-4 hover:border-stone-400 hover:shadow-sm transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400 mb-0.5">{role.eyebrow}</p>
                        <p className="font-black text-brand-dark text-[15px] leading-tight">{role.label}</p>
                        <p className="text-[12px] text-stone-400 mt-0.5 leading-snug">{role.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 shrink-0 transition-colors" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
