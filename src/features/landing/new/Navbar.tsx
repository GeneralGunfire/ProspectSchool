const LINKS = [
  { label: 'Students', href: '#for-students' },
  { label: 'Teachers', href: '#for-teachers' },
  { label: 'Pricing',  href: '#pricing' },
];

// Mobile hamburger + slide-down panel were removed — the toggle wasn't
// opening on mobile devices. The nav links are anchor-scroll links to
// sections further down this same page, so on mobile the logo + Portal
// Login CTA is enough; the links stay desktop-only (md:flex below).
export const Navbar = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className="max-w-3xl mx-auto bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/60 shadow-lg shadow-slate-900/8 rounded-full">
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

            {/* CTA */}
            <button
              onClick={() => onNavigate('portal')}
              className="rounded-full px-5 py-2 text-[12px] font-bold tracking-wide active:scale-[0.97] transition-all cursor-pointer bg-brand-dark text-white hover:bg-slate-800"
            >
              Portal Login
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
