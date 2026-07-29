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
const NavContent = ({ onNavigate, logoSrc, textClass, linkClass, ctaClass, glowClass }: {
  onNavigate: (p: string) => void;
  logoSrc: string;
  textClass: string;
  linkClass: string;
  ctaClass: string;
  glowClass: string;
}) => (
  <div className="h-13 flex items-center px-2 sm:px-2.5">
    <div className="w-full flex justify-between items-center gap-1.5">
      {/* Logo */}
      <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2.5 cursor-pointer group shrink-0">
        <img src={logoSrc} alt="Prospect" className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover shrink-0 transition-transform group-hover:scale-105" />
        <span className={`font-serif-accent text-base sm:text-lg leading-none ${textClass}`}>Prospect</span>
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

      {/* CTAs */}
      <div className="flex items-center gap-1 sm:gap-2 mr-0.5 sm:mr-1 shrink-0">
        <div className="relative">
          <div className={`absolute inset-0 rounded-full blur-md opacity-40 -z-10 ${glowClass}`} aria-hidden="true" />
          <button
            onClick={() => onNavigate('download')}
            className={`rounded-full px-2.5 sm:px-5 py-1.5 sm:py-2 text-[10.5px] sm:text-[12px] font-bold tracking-wide whitespace-nowrap active:scale-[0.97] transition-all cursor-pointer ${ctaClass}`}
          >
            Downloads
          </button>
        </div>
        <div className="relative">
          <div className={`absolute inset-0 rounded-full blur-md opacity-40 -z-10 ${glowClass}`} aria-hidden="true" />
          <button
            onClick={() => onNavigate('portal')}
            className={`rounded-full px-2.5 sm:px-5 py-1.5 sm:py-2 text-[10.5px] sm:text-[12px] font-bold tracking-wide whitespace-nowrap active:scale-[0.97] transition-all cursor-pointer ${ctaClass}`}
          >
            Portal Login
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const Navbar = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  // Single light-glass pill for both mobile and desktop — the mobile hero
  // switched from a dark full-bleed video to the same light background
  // desktop uses, so the dark mobile nav variant this used to have no
  // longer matches anything beneath it. Uses the same styling as
  // AuthNavbar (src/pages/auth/shared/AuthShell.tsx) for consistency
  // with the rest of the site (login pages, portal entry, etc.).
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className="max-w-3xl mx-auto bg-white border border-white/60 shadow-lg shadow-slate-900/8 rounded-full">
        <NavContent
          onNavigate={onNavigate}
          logoSrc="/logo3.png"
          textClass="text-brand-dark"
          linkClass="text-brand-eyebrow hover:text-brand-dark hover:bg-brand-dark/5"
          ctaClass="bg-linear-to-r from-sky-500 via-sky-600 to-blue-600 text-white hover:brightness-110 shadow-[0_6px_16px_-4px_rgba(37,99,235,0.35)]"
          glowClass="bg-linear-to-r from-sky-500 to-blue-600"
        />
      </nav>
    </div>
  );
};
