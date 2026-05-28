import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Shield, GraduationCap, BookOpen } from 'lucide-react';

type Page = string;

const roles = [
  {
    id: 'admin-login',
    icon: Shield,
    label: 'Admin',
    desc: 'Platform & school administrators',
    available: true,
  },
  {
    id: 'teacher-login',
    icon: GraduationCap,
    label: 'Teacher',
    desc: 'Manage students, marks and cohorts',
    available: true,
  },
  {
    id: 'student-login',
    icon: BookOpen,
    label: 'Learner',
    desc: 'Access your dashboard and materials',
    available: true,
  },
];

export default function PortalEntry({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Back button */}
      <div className="px-6 py-5">
        <motion.button
          onClick={() => onNavigate('home')}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-12">
            <motion.div
              className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-5"
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="text-white font-black text-lg">P</span>
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">Select your account type to continue</p>
          </div>

          {/* Role cards */}
          <div className="space-y-3">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.button
                  key={role.id}
                  onClick={() => role.available && onNavigate(role.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                  whileHover={role.available ? { y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' } : {}}
                  whileTap={role.available ? { scale: 0.98 } : {}}
                  className={`group w-full flex items-center gap-4 bg-white border rounded-2xl px-6 py-5 text-left transition-all duration-200 ${
                    role.available
                      ? 'border-slate-200 hover:border-slate-300 cursor-pointer'
                      : 'border-slate-100 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all duration-200">
                    <Icon className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-[15px]">{role.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{role.desc}</p>
                  </div>
                  {role.available ? (
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors duration-200 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 shrink-0">Soon</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
