import { useState } from 'react';
import { Menu, X } from './icons';

const LINKS = [
  { label: 'Students', href: '#for-students' },
  { label: 'Teachers', href: '#for-teachers' },
  { label: 'Pricing',  href: '#pricing' },
];

export const Navbar = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className={`max-w-3xl mx-auto bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/60 shadow-lg shadow-slate-900/8 transition-[border-radius] ${menuOpen ? 'rounded-3xl' : 'rounded-full'}`}>
        <div className="h-13 flex items-center px-2.5">
          <div className="w-full flex justify-between items-center">
            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 pl-2.5 cursor-pointer">
              <img src="/logo.jpg" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
              <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
            </button>

            {/* Nav links — desktop only */}
            <div className="hidden md:flex items-center gap-7">
              {LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-[12px] font-bold text-slate-500 hover:text-brand-dark transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {/* CTA */}
              <button
                onClick={() => onNavigate('portal')}
                className="rounded-full px-5 py-2 text-[12px] font-bold tracking-wide active:scale-[0.97] transition-all cursor-pointer bg-brand-dark text-white hover:bg-slate-800"
              >
                Portal Login
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-brand-dark hover:bg-brand-dark/5 transition-colors cursor-pointer"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="md:hidden px-5 py-2 border-t border-white/40">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[13px] font-bold text-brand-dark border-b border-brand-border/30 last:border-b-0"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};
