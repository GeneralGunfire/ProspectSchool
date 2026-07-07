import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, AlertCircle, School, BadgeCheck } from 'lucide-react';
import { parentLogin } from '../../lib/auth';
import { AuthShell, AuthNavbar, AuthCard } from './shared/AuthShell';
import { CodeField } from './shared/CodeField';
import { PinInput } from './shared/PinInput';

const REMEMBER_KEY = 'prospect_parent_remember';

export default function ParentLogin({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [showPin, setShowPin]       = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData]     = useState({ schoolCode: '', parentCode: '', pin: '' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const { schoolCode, parentCode } = JSON.parse(saved);
        setFormData(f => ({ ...f, schoolCode: schoolCode ?? '', parentCode: parentCode ?? '' }));
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await parentLogin(formData.schoolCode, formData.parentCode, formData.pin);
    if (!result.success) { setError(result.error); setLoading(false); return; }
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ schoolCode: formData.schoolCode, parentCode: formData.parentCode }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
    onNavigate('parent-dashboard');
  };

  return (
    <AuthShell>
      <AuthNavbar onNavigate={onNavigate} />
      <AuthCard>
        <h1 className="font-black text-brand-dark text-[clamp(1.6rem,5vw,2.25rem)] leading-tight mb-7" style={{ letterSpacing: '-0.03em' }}>
          Welcome back.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-[13px] leading-snug">{error}</p>
            </motion.div>
          )}

          <CodeField
            label="School Code"
            icon={School}
            placeholder="e.g. GHS001"
            value={formData.schoolCode}
            onChange={v => setFormData({ ...formData, schoolCode: v })}
            autoComplete="organization"
          />

          <CodeField
            label="Parent Code"
            icon={BadgeCheck}
            placeholder="e.g. PAR-0001"
            value={formData.parentCode}
            onChange={v => setFormData({ ...formData, parentCode: v })}
            autoComplete="username"
          />

          <PinInput
            value={formData.pin}
            onChange={pin => setFormData({ ...formData, pin })}
            visible={showPin}
            onToggleVisible={() => setShowPin(s => !s)}
          />

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="check"
            />
            <span className="text-[12px] font-medium text-brand-eyebrow">Remember school &amp; parent code</span>
          </label>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-accent text-accent-foreground font-black py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:brightness-105"
          >
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        <p className="text-center text-[11px] text-brand-eyebrow/60 font-medium mt-8">
          © {new Date().getFullYear()} Prospect South Africa
        </p>
      </AuthCard>
    </AuthShell>
  );
}
