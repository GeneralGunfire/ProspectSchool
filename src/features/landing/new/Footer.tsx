import { Facebook, Instagram, Twitter } from './icons';
import { FadeIn } from './Animations';

export const Footer = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border pt-16 pb-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 cursor-pointer mb-5">
              <div className="w-7 h-7 bg-brand-dark rounded-md flex items-center justify-center">
                <span className="text-white font-black text-sm leading-none">P</span>
              </div>
              <span className="font-black text-lg tracking-tight text-brand-dark">Prospect</span>
            </button>
            <p className="text-slate-400 text-[13px] leading-relaxed font-medium max-w-[26ch]">
              Free career discovery and matric study support for South African students.
            </p>
            <div className="flex gap-2 mt-6">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-dark hover:text-white transition-all cursor-pointer"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Students */}
          <div>
            <h5 className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-dark mb-5">Students</h5>
            <ul className="space-y-3.5">
              {['Career Quiz', 'Browse Careers', 'Bursary Finder', 'APS Calculator', 'Study Library'].map(link => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-brand-dark transition-colors text-[13px] font-medium">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Schools */}
          <div>
            <h5 className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-dark mb-5">Schools</h5>
            <ul className="space-y-3.5">
              {['Teacher Portal', 'Student Portal', 'Admin Portal', 'Set Up Free'].map(link => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-brand-dark transition-colors text-[13px] font-medium">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h5 className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-dark mb-5">Platform</h5>
            <ul className="space-y-3.5">
              {['How It Works', 'Grade 10', 'Grade 11 (Soon)', 'Grade 12 (Soon)', 'TVET Pathways'].map(link => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-brand-dark transition-colors text-[13px] font-medium">{link}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-14 pt-7 border-t border-brand-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-slate-400 font-medium">
          <p>© {year} Prospect South Africa. Free for every school.</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Built for learners across all 9 provinces
          </div>
        </div>
      </div>
    </footer>
  );
};
