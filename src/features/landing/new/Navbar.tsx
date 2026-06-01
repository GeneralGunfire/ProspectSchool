export const Navbar = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[64px] bg-brand-bg/95 backdrop-blur-sm z-50 flex items-center px-6 md:px-12 border-b border-brand-border/30">
      <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center">
        {/* Left: Logo */}
        <div onClick={() => onNavigate('home')} className="flex items-center gap-3 group cursor-pointer">
          <div className="w-7 h-7 bg-brand-dark rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-base leading-none">P</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-brand-dark">Prospect</span>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'For Students', href: '#for-students' },
            { label: 'For Teachers', href: '#for-teachers' },
            { label: 'For Schools',  href: '#pricing' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-eyebrow hover:text-brand-dark transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right: Portal Login */}
        <button
          onClick={() => onNavigate('portal')}
          className="bg-brand-dark text-white rounded-lg px-6 py-2.5 text-[12px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Portal Login
        </button>
      </div>
    </nav>
  );
};
