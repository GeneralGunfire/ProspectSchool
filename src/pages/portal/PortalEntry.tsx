import { motion } from 'motion/react';
import { ArrowLeft, Shield, GraduationCap, BookOpen, ChevronRight } from 'lucide-react';

type Page = string;

const roles = [
  {
    id: 'student-login',
    icon: BookOpen,
    label: 'Learner',
    desc: 'Access your dashboard, study library, and career tools',
    eyebrow: 'For Students',
  },
  {
    id: 'teacher-login',
    icon: GraduationCap,
    label: 'Teacher',
    desc: 'Manage classes, marks, resources, and student progress',
    eyebrow: 'For Teachers',
  },
  {
    id: 'admin-login',
    icon: Shield,
    label: 'Admin',
    desc: 'School administration and platform management',
    eyebrow: 'For Schools',
  },
];

export default function PortalEntry({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#F5F0E8' }}>

      {/* Left — branding panel (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 px-12 py-12"
        style={{ background: '#1C1917' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white font-black text-sm">P</span>
          </div>
          <span className="text-white font-black text-base tracking-tight">Prospect</span>
        </div>

        {/* Middle copy */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">
            School Portal
          </p>
          <h2
            className="text-white font-black leading-[1.08] mb-6"
            style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', letterSpacing: '-0.03em' }}
          >
            Everything your school needs.
          </h2>
          <p className="text-stone-400 text-[15px] leading-relaxed max-w-[32ch]">
            Students, teachers, and administrators — each with their own dashboard. Free for every South African school.
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-stone-600 text-xs font-bold uppercase tracking-widest">
          Free · Always
        </p>
      </div>

      {/* Right — role selection */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center px-6 sm:px-10 h-16 border-b border-stone-200/60" style={{ background: '#F5F0E8' }}>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Header */}
              <div className="mb-10">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">
                  Portal Login
                </p>
                <h1
                  className="font-black text-[#1C1917] leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', letterSpacing: '-0.03em' }}
                >
                  Who are you?
                </h1>
                <p className="text-stone-500 text-sm mt-2">
                  Select your role to continue to the correct login.
                </p>
              </div>

              {/* Role cards */}
              <div className="space-y-3">
                {roles.map((role, i) => {
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => onNavigate(role.id)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                      whileHover={{ y: -2, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left bg-white rounded-2xl border border-stone-200 px-5 py-4 flex items-center gap-4 hover:border-stone-400 hover:shadow-sm transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#1C1917] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400 mb-0.5">
                          {role.eyebrow}
                        </p>
                        <p className="font-black text-[#1C1917] text-sm">{role.label}</p>
                        <p className="text-xs text-stone-400 mt-0.5 leading-snug">{role.desc}</p>
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
