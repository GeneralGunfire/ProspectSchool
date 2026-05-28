import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { adminLogin } from '../../lib/auth';

const REMEMBER_KEY = 'prospect_admin_remember';

interface AdminLoginProps {
  onNavigate: (page: string) => void;
}

export default function AdminLogin({ onNavigate }: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({ schoolCode: '', adminCode: '', pin: '' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const { schoolCode, adminCode } = JSON.parse(saved);
        setFormData((f) => ({ ...f, schoolCode: schoolCode ?? '', adminCode: adminCode ?? '' }));
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await adminLogin(formData.schoolCode, formData.adminCode, formData.pin);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({
        schoolCode: formData.schoolCode,
        adminCode: formData.adminCode,
      }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    onNavigate('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <div className="px-6 py-5">
        <motion.button onClick={() => onNavigate('portal')} whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-5">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Admin Login</h1>
            <p className="text-slate-500 text-sm">School administrator access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">School Code</label>
              <input type="text" required value={formData.schoolCode}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all tracking-widest"
                placeholder="e.g. GHS001" autoCapitalize="characters" autoCorrect="off" />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Admin Code</label>
              <input type="text" required value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all tracking-widest"
                placeholder="e.g. ADM-0001" autoCapitalize="characters" autoCorrect="off" />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">PIN</label>
              <input type="password" required inputMode="numeric" maxLength={10}
                value={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all tracking-widest"
                placeholder="10-digit PIN" />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer" />
              <span className="text-xs font-bold text-slate-500">Remember school & admin code</span>
            </label>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-900 text-white font-black py-3.5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
