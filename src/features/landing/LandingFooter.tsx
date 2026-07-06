type Page = string;

export default function LandingFooter({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <footer className="py-24 bg-[#F5F0E8] border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-16 md:mb-20">
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <img src="/logo.jpg" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
              <span className="text-sm font-black tracking-widest text-slate-900 uppercase">Prospect</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Building the infrastructure for the next generation of South African excellence.
            </p>
          </div>

          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Platform</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><button onClick={() => onNavigate('portal')} className="hover:text-slate-900 transition-colors">School Portal</button></li>
              <li><button onClick={() => onNavigate('quiz')} className="hover:text-slate-900 transition-colors">Career Guide</button></li>
              <li><button onClick={() => onNavigate('library')} className="hover:text-slate-900 transition-colors">School Assist</button></li>
              <li><button onClick={() => onNavigate('tvet')} className="hover:text-slate-900 transition-colors">TVET Pathways</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Portal</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><button onClick={() => onNavigate('student-login')} className="hover:text-slate-900 transition-colors">Student Login</button></li>
              <li><button onClick={() => onNavigate('teacher-login')} className="hover:text-slate-900 transition-colors">Teacher Login</button></li>
              <li><button onClick={() => onNavigate('school-admin-login')} className="hover:text-slate-900 transition-colors">Admin Login</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Support</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="mailto:hello@prospectsa.co.za" className="hover:text-slate-900 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <div>© 2026 Prospect Education South Africa. Free for every school.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
