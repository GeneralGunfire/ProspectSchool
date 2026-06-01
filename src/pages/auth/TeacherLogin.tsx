import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { teacherLogin } from '../../lib/auth';

const REMEMBER_KEY = 'prospect_teacher_remember';

export default function TeacherLogin({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [showPin, setShowPin]     = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData]   = useState({ schoolCode: '', teacherCode: '', pin: '' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const { schoolCode, teacherCode } = JSON.parse(saved);
        setFormData(f => ({ ...f, schoolCode: schoolCode ?? '', teacherCode: teacherCode ?? '' }));
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await teacherLogin(formData.schoolCode, formData.teacherCode, formData.pin);
    if (!result.success) { setError(result.error); setLoading(false); return; }
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ schoolCode: formData.schoolCode, teacherCode: formData.teacherCode }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
    onNavigate('teacher-dashboard');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F0E8' }}>

      {/* Left — dark branding panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-110 shrink-0 px-10 py-10"
        style={{ background: '#1C1917' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white font-black text-sm">P</span>
          </div>
          <span className="text-white font-black text-base tracking-tight">Prospect</span>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">For Teachers</p>
          <h2
            className="text-white font-black leading-[1.08] mb-6"
            style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)', letterSpacing: '-0.03em' }}
          >
            Your class, under control.
          </h2>
          <p className="text-stone-400 text-[15px] leading-relaxed max-w-[30ch]">
            Manage students, record marks, upload resources, and track every learner's progress from one dashboard.
          </p>
        </div>

        <p className="text-stone-600 text-xs font-bold uppercase tracking-widest">Free · Always</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col">

        <div className="flex items-center px-6 sm:px-10 h-16 border-b border-stone-200/60" style={{ background: '#F5F0E8' }}>
          <button
            onClick={() => onNavigate('portal')}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">Teacher Login</p>
              <h1 className="font-black text-[#1C1917] text-2xl" style={{ letterSpacing: '-0.03em' }}>
                Sign in to your account
              </h1>
              <p className="text-stone-500 text-sm mt-1.5">Enter the codes provided by your school administrator.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm leading-snug">{error}</p>
                </motion.div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-2">School Code</label>
                <input
                  type="text" required
                  value={formData.schoolCode}
                  onChange={e => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-bold text-[#1C1917] placeholder:text-stone-300 focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-stone-900/10 transition-all tracking-widest"
                  placeholder="e.g. GHS001"
                  autoCapitalize="characters" autoCorrect="off"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-2">Teacher Code</label>
                <input
                  type="text" required
                  value={formData.teacherCode}
                  onChange={e => setFormData({ ...formData, teacherCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-bold text-[#1C1917] placeholder:text-stone-300 focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-stone-900/10 transition-all tracking-widest"
                  placeholder="e.g. TCH-001"
                  autoCapitalize="characters" autoCorrect="off"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-2">PIN</label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'} required
                    inputMode="numeric" maxLength={10}
                    value={formData.pin}
                    onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-3 pr-11 bg-white border border-stone-200 rounded-xl text-sm font-bold text-[#1C1917] placeholder:text-stone-300 focus:outline-none focus:border-[#1C1917] focus:ring-2 focus:ring-stone-900/10 transition-all tracking-widest"
                    placeholder="10-digit PIN"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5">Assigned by your school administrator</p>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 accent-stone-900 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-stone-500">Remember school &amp; teacher code</span>
              </label>

              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-[#1C1917] text-white font-black py-3.5 rounded-xl hover:bg-stone-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
