import { Facebook, Instagram, Twitter } from './icons';
import { FadeIn } from './Animations';

export const Footer = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-bg border-t border-brand-border pt-32 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-16 md:gap-8">
          {/* COL 1 */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 bg-brand-dark rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-black text-2xl leading-none">P</span>
              </div>
              <span className="font-black text-2xl tracking-tight text-brand-dark">Prospect</span>
            </div>
            <p className="mt-8 text-brand-eyebrow text-base leading-relaxed max-w-[32ch] font-medium">
              Free career discovery and matric study support for South African students.
            </p>
            <div className="flex gap-3 mt-10">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-stone-200/50 flex items-center justify-center text-brand-eyebrow hover:bg-brand-dark hover:text-white transition-all cursor-pointer shadow-sm">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />

          {/* COL 2 */}
          <div className="col-span-1 md:col-span-2">
            <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-dark mb-8">Students</h5>
            <ul className="space-y-6">
              {["Career Quiz", "Browse Careers", "Bursary Finder", "APS Calculator", "TVET Pathways", "Study Library"].map(link => (
                <li key={link}>
                  <a href="#" className="text-brand-eyebrow hover:text-brand-dark transition-colors text-[14px] font-bold">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 */}
          <div className="col-span-1 md:col-span-2">
            <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-dark mb-8">Teachers & Schools</h5>
            <ul className="space-y-6">
              {["Teacher Portal", "Student Portal", "Admin Portal", "Set Up Your School"].map(link => (
                <li key={link}>
                  <a href="#" className="text-brand-eyebrow hover:text-brand-dark transition-colors text-[14px] font-bold">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4 */}
          <div className="col-span-1 md:col-span-2">
            <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-dark mb-8">Platform</h5>
            <ul className="space-y-6">
              {["How It Works", "Subjects Covered", "Grade 10", "Grade 11 (Soon)", "Grade 12 (Soon)"].map(link => (
                <li key={link}>
                  <a href="#" className="text-brand-eyebrow hover:text-brand-dark transition-colors text-[14px] font-bold">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-32 pt-10 border-t border-brand-border/40 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-stone-400 font-medium">
          <p>© {currentYear} Prospect South Africa. Free for every school.</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Built for learners across all 9 provinces.
          </div>
        </div>
      </div>
    </footer>
  );
};
