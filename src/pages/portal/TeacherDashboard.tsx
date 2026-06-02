import { useEffect, useState } from 'react';
import { LogOut, Home, Users, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone } from 'lucide-react';
import { getTeacherSession, teacherLogout, type TeacherSession } from '../../lib/auth';
import ClassesPage from './teacher/ClassesPage';
import CalendarPage from './teacher/CalendarPage';
import MarksPage from './teacher/MarksPage';
import StudentProgressPage from './teacher/StudentProgressPage';
import ResourcesPage from './teacher/ResourcesPage';
import AnnouncementsPage from './teacher/AnnouncementsPage';
import TeacherHomePage from './teacher/TeacherHomePage';

type ActivePage = 'home' | 'classes' | 'calendar' | 'marks' | 'library' | 'resources' | 'announcements';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [session, setSession] = useState<TeacherSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');

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

  const mobileNavItems = navItems.slice(0, 5);
  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">

      {/* ── Sidebar (desktop only) ─────────────────────────── */}
      <aside className="hidden md:flex w-52 shrink-0 h-full bg-white border-r border-stone-100 flex-col">

        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-stone-100 shrink-0">
          <div className="w-6 h-6 rounded-md bg-brand-dark flex items-center justify-center">
            <span className="text-white font-black text-[10px]">P</span>
          </div>
          <span className="text-sm font-black text-brand-dark tracking-tight">Prospect</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 ${
                  active
                    ? 'bg-brand-dark text-white'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + sign out */}
        <div className="border-t border-stone-100 p-2 space-y-1 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-stone-50">
            <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
              <span className="text-stone-600 font-black text-[10px]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-stone-900 truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] text-stone-400 truncate">{session.school_name}</p>
            </div>
          </div>
          <button
            onClick={() => { teacherLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-12 bg-white border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-brand-dark flex items-center justify-center">
              <span className="text-white font-black text-[9px]">P</span>
            </div>
            <span className="text-sm font-black text-brand-dark tracking-tight">Prospect</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
              <span className="text-stone-600 font-black text-[10px]">{initials}</span>
            </div>
            <button
              onClick={() => { teacherLogout(); onNavigate('portal'); }}
              className="text-stone-400 hover:text-red-500 transition-colors px-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {activePage === 'home'          && <TeacherHomePage session={session} onNavigate={p => setActivePage(p as ActivePage)} />}
          {activePage === 'announcements' && <AnnouncementsPage session={session} />}
          {activePage === 'classes'       && <ClassesPage session={session} />}
          {activePage === 'calendar'      && <CalendarPage session={session} />}
          {activePage === 'marks'         && <MarksPage session={session} />}
          {activePage === 'resources'     && <ResourcesPage session={session} />}
          {activePage === 'library'       && <StudentProgressPage session={session} />}
        </div>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex items-center z-40"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {mobileNavItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className="relative flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
              >
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-brand-dark rounded-full" />
                )}
                <Icon className={`w-5 h-5 ${active ? 'text-brand-dark' : 'text-stone-400'}`} />
                <span className={`text-[9px] font-black uppercase tracking-wide ${active ? 'text-brand-dark' : 'text-stone-400'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
