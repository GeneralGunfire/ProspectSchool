import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Home, Users, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone, Menu, X } from 'lucide-react';
import { getTeacherSession, teacherLogout, type TeacherSession } from '../../lib/auth';
import ClassesPage from './teacher/ClassesPage';
import CalendarPage from './teacher/CalendarPage';
import MarksPage from './teacher/MarksPage';
import StudentProgressPage from './teacher/StudentProgressPage';
import ResourcesPage from './teacher/ResourcesPage';
import AnnouncementsPage from './teacher/AnnouncementsPage';
import TeacherHomePage from './teacher/TeacherHomePage';
import NotificationBell from '../../shared/components/NotificationBell';

type ActivePage = 'home' | 'classes' | 'calendar' | 'marks' | 'library' | 'resources' | 'announcements';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [session, setSession] = useState<TeacherSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const s = getTeacherSession();
    if (!s) { onNavigate('teacher-login'); return; }
    setSession(s);
  }, []);

  if (!session) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navItems: { id: ActivePage; label: string; icon: any }[] = [
    { id: 'home',          label: 'Home',          icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'classes',       label: 'Classes',       icon: Users },
    { id: 'calendar',      label: 'Calendar',      icon: CalendarDays },
    { id: 'marks',         label: 'Marks',         icon: ClipboardList },
    { id: 'resources',     label: 'Resources',     icon: FolderOpen },
    { id: 'library',       label: 'Progress',      icon: BookOpen },
  ];

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  function setPage(id: ActivePage) {
    setActivePage(id);
    setMenuOpen(false);
  }

  return (
    <div className="flex h-screen bg-dash-bg overflow-hidden">

      {/* ── Sidebar (desktop only) ─────────────────────────── */}
      <aside className="hidden md:flex w-56 shrink-0 h-full bg-white border-r border-brand-border flex-col">

        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-sm shrink-0">
              <span className="text-accent-foreground font-black text-xs">P</span>
            </div>
            <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
          </div>
          <NotificationBell userType="teacher" userId={session.teacher_id} />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-150 ${
                  active
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-accent' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + sign out */}
        <div className="border-t border-brand-border p-3 space-y-1 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-brand-bg">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-accent-foreground font-black text-[10px]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] text-stone-500 truncate">{session.school_name}</p>
            </div>
          </div>
          <button
            onClick={() => { teacherLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────── */}
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
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-sm shrink-0">
              <span className="text-accent-foreground font-black text-[10px]">P</span>
            </div>
            <span className="font-serif-accent text-base text-brand-dark leading-none">Prospect</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell userType="teacher" userId={session.teacher_id} />
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-black text-[10px]">{initials}</span>
            </div>
            <button
              onClick={() => { teacherLogout(); onNavigate('portal'); }}
              className="text-stone-500 hover:text-red-500 transition-colors px-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Mobile nav drawer — slides in from the left, mirrors desktop sidebar ── */}
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
                className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[82vw] bg-white border-r border-brand-border flex flex-col"
              >
                {/* Logo + close */}
                <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-brand-border shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-accent-foreground font-black text-xs">P</span>
                    </div>
                    <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
                  </div>
                  <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg text-stone-500 hover:text-brand-dark hover:bg-brand-bg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav — same list as desktop sidebar, single column */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                  {navItems.map(({ id, label, icon: Icon }) => {
                    const active = activePage === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setPage(id)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-150 ${
                          active
                            ? 'bg-brand-dark text-white shadow-sm'
                            : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-accent' : ''}`} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Profile + logout */}
                <div className="border-t border-brand-border p-3 space-y-1 shrink-0" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-brand-bg">
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <span className="text-accent-foreground font-black text-[10px]">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
                      <p className="text-[10px] text-stone-500 truncate">{session.school_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { teacherLogout(); onNavigate('portal'); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {activePage === 'home'          && <TeacherHomePage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'announcements' && <AnnouncementsPage session={session} />}
          {activePage === 'classes'       && <ClassesPage session={session} />}
          {activePage === 'calendar'      && <CalendarPage session={session} />}
          {activePage === 'marks'         && <MarksPage session={session} />}
          {activePage === 'resources'     && <ResourcesPage session={session} />}
          {activePage === 'library'       && <StudentProgressPage session={session} />}
        </div>
      </div>
    </div>
  );
}
