import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { platformLogin } from '../../lib/auth';

export default function PlatformLogin({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await platformLogin(name, password);
    if (!result.success) { setError(result.error); setLoading(false); return; }
    onNavigate('platform-dashboard');
  };

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #FAFAFA 0%, #F1F0EC 55%, #FAFAFA 100%)' }}
    >
      <div className="relative z-10 flex items-center justify-between px-8 h-16 border-b border-brand-border">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.jpg" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
          <span className="text-brand-dark font-black text-sm tracking-tight">Prospect</span>
        </button>
        <button
          onClick={() => onNavigate('portal')}
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-brand-eyebrow hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Portal
        </button>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md bg-white rounded-3xl border border-brand-border shadow-xl shadow-stone-900/5 px-8 py-10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-3">Platform</p>
          <h1 className="font-black text-brand-dark text-[clamp(1.75rem,3vw,2.25rem)] leading-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
            Owner access.
          </h1>
          <p className="text-stone-500 text-[14px] font-medium mb-8">
            Restricted to platform administrators.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 text-[13px] leading-snug">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 mb-2">Name</label>
              <input
                type="text" required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm font-bold text-brand-dark placeholder:text-stone-300 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                placeholder="Your name"
                autoCorrect="off"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-white border border-brand-border rounded-xl text-sm font-bold text-brand-dark placeholder:text-stone-300 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                  placeholder="Password"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-dark text-white font-black py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10 hover:brightness-110"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <p className="text-center text-[11px] text-stone-400 font-medium mt-8">
            © {new Date().getFullYear()} Prospect South Africa
          </p>
        </motion.div>
      </div>
    </div>
  );
}
