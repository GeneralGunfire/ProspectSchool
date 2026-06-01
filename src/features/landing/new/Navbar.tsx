export const Navbar = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-brand-bg/96 backdrop-blur-md z-50 flex items-center px-5 md:px-10 border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-6 h-6 bg-brand-dark rounded-md flex items-center justify-center">
            <span className="text-white font-black text-xs leading-none">P</span>
          </div>
          <span className="font-black text-base tracking-tight text-brand-dark">Prospect</span>
        </button>

        {/* Nav links — desktop only */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Students', href: '#for-students' },
            { label: 'Teachers', href: '#for-teachers' },
            { label: 'Pricing',  href: '#pricing' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-eyebrow hover:text-brand-dark transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onNavigate('portal')}
          className="bg-brand-dark text-white rounded-lg px-5 py-2 text-[11px] font-black tracking-wide hover:bg-stone-800 active:scale-[0.97] transition-all cursor-pointer"
        >
          Portal Login
        </button>
      </div>
    </nav>
  );
};
