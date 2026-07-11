import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

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
  <div className="relative min-h-screen flex flex-col overflow-hidden bg-brand-bg">
    {children}
  </div>
);

export const AuthCard = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-24 sm:pt-28 pb-10 sm:pb-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-md rounded-3xl px-5 py-8 sm:px-8 sm:py-16"
      style={{
        background: 'color-mix(in srgb, white 65%, transparent)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid color-mix(in srgb, white 60%, var(--color-brand-border))',
        boxShadow: '0 20px 60px -20px rgba(11,29,51,0.2)',
      }}
    >
      {children}
    </motion.div>
  </div>
);
