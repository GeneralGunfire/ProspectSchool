import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, AlertCircle, Eye, EyeOff, School, BadgeCheck } from 'lucide-react';
import { adminLogin } from '../../lib/auth';

const REMEMBER_KEY = 'prospect_admin_remember';

export default function AdminLogin({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [showPin, setShowPin]       = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData]     = useState({ schoolCode: '', adminCode: '', pin: '' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const { schoolCode, adminCode } = JSON.parse(saved);
        setFormData(f => ({ ...f, schoolCode: schoolCode ?? '', adminCode: adminCode ?? '' }));
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await adminLogin(formData.schoolCode, formData.adminCode, formData.pin);
    if (!result.success) { setError(result.error); setLoading(false); return; }
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ schoolCode: formData.schoolCode, adminCode: formData.adminCode }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
    onNavigate('admin-dashboard');
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&fit=crop"
        alt="" aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div aria-hidden className="absolute inset-0"
        style={{ background: 'linear-gradient(145deg, rgba(15,23,42,0.88) 0%, rgba(30,58,138,0.75) 50%, rgba(15,23,42,0.90) 100%)' }}
      />

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between px-8 h-16 border-b border-white/10">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center">
            <span className="text-white font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-sm tracking-tight">Prospect</span>
        </button>
        <button
          onClick={() => onNavigate('portal')}
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Portal
        </button>
      </div>

      {/* Glass card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md rounded-3xl border border-white/15 shadow-2xl shadow-black/40 px-8 py-10"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(28px) saturate(160%)' }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-3">For Schools</p>
          <h1 className="font-black text-white text-[clamp(1.75rem,3vw,2.25rem)] leading-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
            Welcome back.
          </h1>
          <p className="text-white/50 text-[14px] font-medium mb-8">
            Enter your school and administrator credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-3.5 bg-red-500/15 border border-red-400/25 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                <p className="text-red-200 text-[13px] leading-snug">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-white/45 mb-2">School Code</label>
              <div className="relative">
                <input
                  type="text" required
                  value={formData.schoolCode}
                  onChange={e => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 pr-11 border border-white/15 rounded-xl text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15 transition-all tracking-widest"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  placeholder="e.g. GHS001"
                  autoCapitalize="characters" autoCorrect="off"
                />
                <School className="w-4 h-4 text-white/20 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-white/45 mb-2">Admin Code</label>
              <div className="relative">
                <input
                  type="text" required
                  value={formData.adminCode}
                  onChange={e => setFormData({ ...formData, adminCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 pr-11 border border-white/15 rounded-xl text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15 transition-all tracking-widest"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  placeholder="e.g. ADM-001"
                  autoCapitalize="characters" autoCorrect="off"
                />
                <BadgeCheck className="w-4 h-4 text-white/20 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-white/45 mb-2">PIN</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'} required
                  inputMode="numeric" maxLength={10}
                  value={formData.pin}
                  onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-3 pr-11 border border-white/15 rounded-xl text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15 transition-all tracking-widest"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  placeholder="10-digit PIN"
                />
                <button type="button" onClick={() => setShowPin(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/70 transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-white/30 mt-1.5">Assigned by your platform administrator</p>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/25 accent-accent cursor-pointer"
              />
              <span className="text-[12px] font-medium text-white/45">Remember school &amp; admin code</span>
            </label>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-accent text-white font-black py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent/30 hover:brightness-105"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <p className="text-center text-[11px] text-white/25 font-medium mt-8">
            © {new Date().getFullYear()} Prospect South Africa
          </p>
        </motion.div>
      </div>
    </div>
  );
}
