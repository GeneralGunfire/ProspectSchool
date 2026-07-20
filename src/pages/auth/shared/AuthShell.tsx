import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Sparkles, Users2 } from 'lucide-react';

// Shared chrome for every role's login page — flat blue-palette background,
// the same logo + back nav pill used on the portal entry page, and a
// glassmorphic card wrapper. Centralizing this once means all four login
// pages (and PortalEntry) stay visually identical without copy-pasting the
// same markup four times.
export const AuthNavbar = ({ onNavigate, backTo = 'portal', backLabel = 'Portal' }: { onNavigate: (p: string) => void; backTo?: string; backLabel?: string }) => (
  <div className="fixed top-4 left-0 right-0 z-50 px-4">
    <nav className="max-w-3xl mx-auto bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/60 shadow-lg shadow-slate-900/8 rounded-full">
      <div className="h-13 flex items-center justify-between px-2.5">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 pl-2.5 cursor-pointer">
          <img src="/logo3.png" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
          <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
        </button>
        <button
          onClick={() => onNavigate(backTo)}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 mr-1 text-[12px] font-bold text-brand-eyebrow hover:text-brand-dark hover:bg-brand-dark/5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {backLabel}
        </button>
      </div>
    </nav>
  </div>
);

export const AuthShell = ({ children }: { children: React.ReactNode }) => (
  <div className="auth-bg relative min-h-screen flex flex-col overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-bg/40 via-transparent to-brand-bg/60" />
    {children}
  </div>
);

// Desktop-only left panel — gives the huge empty stretch of background image
// beside the card on wide viewports an actual purpose instead of empty space.
// Purely presentational copy (role-agnostic), no functional change to the
// form beside it. Hidden below `lg:` so mobile/tablet are untouched.
const trustPoints = [
  { icon: ShieldCheck, text: 'Secure, code-based sign-in — no email required' },
  { icon: Users2,      text: 'Built for every role in the school, one login flow' },
  { icon: Sparkles,    text: 'Free for every South African school' },
];

const AuthIntroPanel = () => (
  <div className="hidden lg:flex flex-col justify-center max-w-sm shrink-0">
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="eyebrow">Prospect Portal</span>
      <h2 className="font-black text-brand-dark text-[2.5rem] leading-[1.1] mt-4" style={{ letterSpacing: '-0.03em' }}>
        One platform, every part of the school.
      </h2>
      <p className="mt-4 text-brand-eyebrow text-[15px] leading-relaxed max-w-[36ch]">
        Students, parents, teachers, and admins each get a dashboard built for them — sign in on the right to pick up where you left off.
      </p>
      <div className="mt-9 space-y-4">
        {trustPoints.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white/50 border border-white/60 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-brand-dark/70" />
            </div>
            <p className="text-[13.5px] font-medium text-brand-eyebrow">{text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export const AuthCard = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-10 flex-1 flex items-center justify-center px-4 lg:px-10 pt-24 sm:pt-28 pb-10 sm:pb-12">
    <div className="w-full max-w-md lg:max-w-5xl flex items-center justify-center lg:justify-between gap-16 xl:gap-24">
      <AuthIntroPanel />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md rounded-3xl px-5 py-8 sm:px-8 sm:py-10 lg:py-11 shrink-0"
        style={{
          background: 'linear-gradient(180deg, color-mix(in srgb, white 78%, transparent) 0%, color-mix(in srgb, white 68%, transparent) 100%)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid color-mix(in srgb, white 60%, var(--color-brand-border))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(15,18,15,0.08), 0 10px 24px -6px rgba(15,18,15,0.16), 0 32px 60px -20px rgba(15,18,15,0.24)',
        }}
      >
        {children}
      </motion.div>
    </div>
  </div>
);
