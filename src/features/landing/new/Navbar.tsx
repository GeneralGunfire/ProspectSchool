const LINKS = [
  { label: 'Students', href: '#for-students' },
  { label: 'Teachers', href: '#for-teachers' },
  { label: 'Pricing',  href: '#pricing' },
];

// Two variants, swapped at the `md` breakpoint to match the Hero underneath:
// mobile still has the dark full-bleed video hero, so a dark-glass pill stays
// there; desktop's hero is now a light surface, so the navbar switches to a
// light-glass pill to match. Mobile hamburger + slide-down panel were
// removed — the toggle wasn't opening on mobile devices. The nav links are
// anchor-scroll links to sections further down this same page, so on mobile
// the logo + Portal Login CTA is enough; the links stay desktop-only.
const NavContent = ({ onNavigate, logoSrc, textClass, linkClass, ctaClass }: {
  onNavigate: (p: string) => void;
  logoSrc: string;
  textClass: string;
  linkClass: string;
  ctaClass: string;
}) => (
  <div className="h-13 flex items-center px-2.5">
    <div className="w-full flex justify-between items-center">
      {/* Logo */}
      <button onClick={() => onNavigate('home')} className="flex items-center gap-2 pl-2.5 cursor-pointer group">
        <img src={logoSrc} alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0 transition-transform group-hover:scale-105" />
        <span className={`font-serif-accent text-lg leading-none ${textClass}`}>Prospect</span>
      </button>

      {/* Nav links — desktop only */}
      <div className="hidden md:flex items-center gap-1">
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition-colors ${linkClass}`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onNavigate('portal')}
        className={`rounded-full px-5 py-2 mr-1 text-[12px] font-bold tracking-wide active:scale-[0.97] transition-all cursor-pointer ${ctaClass}`}
      >
        Portal Login
      </button>
    </div>
  </div>
);

export const Navbar = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      {/* Mobile — dark glass, matches the dark video hero */}
      <nav
        className="md:hidden max-w-3xl mx-auto rounded-full"
        style={{
          background: 'color-mix(in srgb, #0B0F14 72%, transparent)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.3), 0 16px 40px -16px rgba(0,0,0,0.6)',
        }}
      >
        <NavContent
          onNavigate={onNavigate}
          logoSrc="/logo-dark-mode.png"
          textClass="text-white"
          linkClass="text-white/60 hover:text-white hover:bg-white/8"
          ctaClass="bg-white text-[#0B0F14] hover:bg-white/90 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]"
        />
      </nav>

      {/* Desktop — same light-glass pill as AuthNavbar (src/pages/auth/shared/AuthShell.tsx),
          matches the now-light desktop hero */}
      <nav className="hidden md:block max-w-3xl mx-auto bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/60 shadow-lg shadow-slate-900/8 rounded-full">
        <NavContent
          onNavigate={onNavigate}
          logoSrc="/logo3.png"
          textClass="text-brand-dark"
          linkClass="text-brand-eyebrow hover:text-brand-dark hover:bg-brand-dark/5"
          ctaClass="text-brand-eyebrow hover:text-brand-dark hover:bg-brand-dark/5"
        />
      </nav>
    </div>
  );
};
