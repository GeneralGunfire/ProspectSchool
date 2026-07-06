import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, AlertCircle, Eye, EyeOff, School, BadgeCheck } from 'lucide-react';
import { adminLogin } from '../../lib/auth';

const REMEMBER_KEY = 'prospect_admin_remember';

export default function AdminLogin({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [showPin, setShowPin]     = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData]   = useState({ schoolCode: '', adminCode: '', pin: '' });

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
    <div className="relative min-h-screen flex items-center justify-center px-5 py-12 overflow-hidden">
      {/* Full-bleed photo — the SA flag, fitting for the "for schools/official"
          admin login. It's a sparse image (mostly sky), so it's positioned to
          keep the flag itself in frame rather than centering on empty sky. */}
      <img
        src="/images/sa-flag.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '30% 70%' }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(28,25,23,0.8) 0%, rgba(28,25,23,0.6) 45%, rgba(28,25,23,0.88) 100%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 25%, transparent), transparent)' }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 sm:px-10 h-16 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-sm tracking-tight">Prospect</span>
        </div>
        <button
          onClick={() => onNavigate('portal')}
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Portal
        </button>
      </div>

      {/* Floating glass card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-white/15 bg-black/25 backdrop-blur-2xl shadow-2xl shadow-black/40 px-7 py-8 sm:px-9 sm:py-10"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200/80 mb-3">For Schools</p>
        <h1 className="font-black text-white text-2xl leading-tight" style={{ letterSpacing: '-0.03em' }}>
          Sign in to your account
        </h1>
        <p className="text-white/50 text-[13px] mt-2">Enter your school and administrator credentials.</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-7">

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 p-3.5 bg-red-500/15 border border-red-400/30 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
              <p className="text-red-100 text-[13px] leading-snug">{error}</p>
            </motion.div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">School Code</label>
            <div className="relative">
              <input
                type="text" required
                value={formData.schoolCode}
                onChange={e => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 pr-11 bg-white/8 border border-white/20 rounded-xl text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all tracking-widest"
                placeholder="e.g. GHS001"
                autoCapitalize="characters" autoCorrect="off"
              />
              <School className="w-4 h-4 text-white/30 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Admin Code</label>
            <div className="relative">
              <input
                type="text" required
                value={formData.adminCode}
                onChange={e => setFormData({ ...formData, adminCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 pr-11 bg-white/8 border border-white/20 rounded-xl text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all tracking-widest"
                placeholder="e.g. ADM-001"
                autoCapitalize="characters" autoCorrect="off"
              />
              <BadgeCheck className="w-4 h-4 text-white/30 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">PIN</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'} required
                inputMode="numeric" maxLength={10}
                value={formData.pin}
                onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 pr-11 bg-white/8 border border-white/20 rounded-xl text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all tracking-widest"
                placeholder="10-digit PIN"
              />
              <button
                type="button"
                onClick={() => setShowPin(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-white/35 mt-1.5">Assigned by your platform administrator</p>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox" checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 accent-accent cursor-pointer"
            />
            <span className="text-[11px] font-bold text-white/50">Remember school &amp; admin code</span>
          </label>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full text-accent-foreground font-black py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-black/30"
            style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 100%, white 15%), var(--color-accent))' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
