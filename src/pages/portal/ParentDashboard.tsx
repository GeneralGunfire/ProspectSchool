import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Home, CalendarDays, ClipboardList, Megaphone, Award, ClipboardCheck, Menu, X, ChevronDown, CalendarClock } from 'lucide-react';
import { getParentSession, parentLogout, type ParentSession } from '../../lib/auth';
import { fetchParentChildren, type ParentChild } from '../../lib/parents';
import ParentHomePage from './parent/ParentHomePage';
import ParentAttendancePage from './parent/ParentAttendancePage';
import ParentBehaviourPage from './parent/ParentBehaviourPage';
import ParentMarksPage from './parent/ParentMarksPage';
import ParentHomeworkPage from './parent/ParentHomeworkPage';
import ParentAnnouncementsPage from './parent/ParentAnnouncementsPage';
import ParentTimetablePage from './parent/ParentTimetablePage';

type ActivePage = 'home' | 'attendance' | 'behaviour' | 'marks' | 'homework' | 'announcements' | 'timetable';

interface ParentDashboardProps {
  onNavigate: (page: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navItems: { id: ActivePage; label: string; icon: any }[] = [
  { id: 'home',          label: 'Home',          icon: Home },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'attendance',    label: 'Attendance',    icon: CalendarDays },
  { id: 'behaviour',     label: 'Behaviour',     icon: Award },
  { id: 'marks',         label: 'Marks',         icon: ClipboardList },
  { id: 'homework',      label: 'Homework',      icon: ClipboardCheck },
  { id: 'timetable',     label: 'Timetable',     icon: CalendarClock },
];

export default function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const [session, setSession] = useState<ParentSession | null>(null);
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [activeChild, setActiveChild] = useState<ParentChild | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [childPickerOpen, setChildPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getParentSession();
    if (!s) { onNavigate('parent-login'); return; }
    setSession(s);
    fetchParentChildren(s.parent_id).then((kids) => {
      setChildren(kids);
      setActiveChild(kids[0] ?? null);
      setLoading(false);
    });
  }, []);

  if (!session || loading) return null;

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  function setPage(id: ActivePage) {
    setActivePage(id);
    setMenuOpen(false);
  }

  const ChildSwitcher = ({ compact }: { compact?: boolean }) => (
    <div className="relative">
      <button
        onClick={() => setChildPickerOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-brand-bg border border-brand-border text-left ${compact ? '' : ''}`}
      >
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Viewing</p>
          <p className="text-[13px] font-black text-brand-dark truncate">
            {activeChild ? `${activeChild.name} ${activeChild.surname}` : 'No child linked'}
          </p>
        </div>
        {children.length > 1 && <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {childPickerOpen && children.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-1.5 bg-white border border-brand-border rounded-2xl shadow-lg z-20 overflow-hidden"
          >
            {children.map((c) => (
              <button
                key={c.student_id}
                onClick={() => { setActiveChild(c); setChildPickerOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
                  activeChild?.student_id === c.student_id ? 'bg-brand-dark text-white' : 'text-stone-600 hover:bg-brand-bg'
                }`}
              >
                {c.name} {c.surname}
                <span className="block text-[10px] font-medium opacity-70">
                  Gr {c.grade}{c.cohort_name ? ` · ${c.cohort_name}` : ''}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex h-screen bg-dash-bg overflow-hidden">

      {/* ── Sidebar (desktop only) ─────────────────────────── */}
      <aside className="hidden md:flex w-64 shrink-0 h-full flex-col gap-3 p-3" style={{ background: '#eeece5' }}>

        {/* Logo card */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-[14px] bg-white shrink-0"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
            <img src="/logo3.png" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
            <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
          </button>
        </div>

        {/* Child switcher card */}
        <div className="px-3 pt-3 rounded-[14px] bg-white shrink-0"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', paddingBottom: '0.75rem' }}>
          <ChildSwitcher />
        </div>

        {/* Nav card */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto rounded-[14px] bg-white"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all duration-150 ${
                  active
                    ? 'bg-brand-dark text-white'
                    : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                }`}
                style={active ? { boxShadow: '0 4px 10px -2px rgba(21,23,28,0.35)' } : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + logout card */}
        <div className="p-2.5 shrink-0 rounded-[14px] bg-white"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2.5 px-1 pb-2.5 mb-1 border-b border-brand-border">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-accent-foreground font-black text-[11px]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">Parent</p>
            </div>
          </div>
          <button
            onClick={() => { parentLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content area ──────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-1.5 -ml-1.5 mr-0.5 rounded-lg text-stone-500 hover:text-brand-dark hover:bg-brand-bg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
              <img src="/logo3.png" alt="Prospect" className="w-6 h-6 rounded-lg object-cover shrink-0" />
              <span className="font-serif-accent text-base text-brand-dark leading-none">Prospect</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-black text-[10px]">{initials}</span>
            </div>
            <button
              onClick={() => { parentLogout(); onNavigate('portal'); }}
              className="text-[11px] font-black text-stone-500 hover:text-red-500 transition-colors px-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile child switcher */}
        <div className="md:hidden px-4 py-3 bg-white border-b border-brand-border shrink-0">
          <ChildSwitcher compact />
        </div>

        {/* ── Mobile nav drawer ── */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50"
              />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
                className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[82vw] flex flex-col gap-3 p-3"
                style={{ background: '#eeece5' }}
              >
                {/* Logo + close card */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-[14px] bg-white shrink-0"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
                    <img src="/logo3.png" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                    <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
                  </button>
                  <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1.5 rounded-lg text-stone-500 hover:text-brand-dark hover:bg-brand-bg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Child switcher card */}
                <div className="px-3 pt-3 rounded-[14px] bg-white shrink-0"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', paddingBottom: '0.75rem' }}>
                  <ChildSwitcher />
                </div>

                {/* Nav card */}
                <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto rounded-[14px] bg-white"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  {navItems.map(({ id, label, icon: Icon }) => {
                    const active = activePage === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setPage(id)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all duration-150 ${
                          active
                            ? 'bg-brand-dark text-white'
                            : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                        }`}
                        style={active ? { boxShadow: '0 4px 10px -2px rgba(21,23,28,0.35)' } : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Profile + logout card */}
                <div className="p-2.5 shrink-0 rounded-[14px] bg-white"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)', paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}>
                  <div className="flex items-center gap-2.5 px-1 pb-2.5 mb-1 border-b border-brand-border">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <span className="text-accent-foreground font-black text-[11px]">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">Parent</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { parentLogout(); onNavigate('portal'); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {!activeChild ? (
            <div className="px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full mx-auto">
              <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
                <p className="font-bold text-brand-dark mb-1">No children linked yet</p>
                <p className="text-sm text-stone-500">Ask your school admin to link your account to your child's profile.</p>
              </div>
            </div>
          ) : (
            <>
              {activePage === 'home'          && <ParentHomePage session={session} child={activeChild} onNavigate={p => setPage(p as ActivePage)} />}
              {activePage === 'attendance'    && <ParentAttendancePage child={activeChild} />}
              {activePage === 'behaviour'     && <ParentBehaviourPage child={activeChild} />}
              {activePage === 'marks'         && <ParentMarksPage session={session} child={activeChild} />}
              {activePage === 'homework'      && <ParentHomeworkPage session={session} child={activeChild} />}
              {activePage === 'timetable'     && <ParentTimetablePage session={session} child={activeChild} />}
              {activePage === 'announcements' && <ParentAnnouncementsPage session={session} child={activeChild} />}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
