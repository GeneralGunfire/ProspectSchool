import { useEffect, useState, lazy, Suspense } from 'react';
import { LogOut, Home, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone, Sparkles, GraduationCap, FileText } from 'lucide-react';
import { getStudentSession, studentLogout, type StudentSession } from '../../lib/auth';
import StudentHomePage from './student/StudentHomePage';
import StudentCalendarPage from './student/StudentCalendarPage';
import StudentMarksPage from './student/StudentMarksPage';
import StudentResourcesPage from './student/StudentResourcesPage';
import StudentAnnouncementsPage from './student/StudentAnnouncementsPage';
import StudentPastPapersPage from './student/StudentPastPapersPage';
import ApsCalculatorPage from './student/ApsCalculatorPage';
import NotificationBell from '../../shared/components/NotificationBell';

const LibraryPage  = lazy(() => import('./student/LibraryPage'));
const MyFuturePage = lazy(() => import('./student/MyFuturePage'));

type ActivePage = 'home' | 'calendar' | 'marks' | 'resources' | 'announcements' | 'pastpapers' | 'library' | 'aps' | 'future';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-5 h-5 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin" />
  </div>
);

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [session, setSession] = useState<StudentSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [innerPage, setInnerPage] = useState<string>('library');

  useEffect(() => {
    const s = getStudentSession();
    if (!s) { onNavigate('student-login'); return; }
    setSession(s);
  }, []);

  if (!session) return null;

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navItems: { id: ActivePage; label: string; icon: any; mobileLabel?: string }[] = [
    { id: 'home',          label: 'Home',          icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone,      mobileLabel: 'News' },
    { id: 'calendar',      label: 'Calendar',      icon: CalendarDays },
    { id: 'marks',         label: 'My Marks',      icon: ClipboardList,  mobileLabel: 'Marks' },
    { id: 'resources',     label: 'Resources',     icon: FolderOpen },
    { id: 'pastpapers',    label: 'Past Papers',   icon: FileText,       mobileLabel: 'Papers' },
    { id: 'library',       label: 'Library',       icon: BookOpen },
    { id: 'aps',           label: 'APS & Unis',    icon: GraduationCap,  mobileLabel: 'APS' },
    { id: 'future',        label: 'My Future',     icon: Sparkles,       mobileLabel: 'Future' },
  ];

  function handleLibraryNavigate(page: string) {
    if (page === 'student-dashboard' || page === 'library') {
      setInnerPage('library');
    } else if (page.startsWith('learning-')) {
      setInnerPage(page);
    } else {
      onNavigate(page);
    }
  }

  function setPage(id: ActivePage) {
    setActivePage(id);
    if (id === 'library') setInnerPage('library');
  }

  const inLearningPage = activePage === 'library' && innerPage.startsWith('learning-');

  if (inLearningPage) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
          <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin" />
        </div>
      }>
        <LibraryPage session={session} innerPage={innerPage} onNavigate={handleLibraryNavigate} />
      </Suspense>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">

      {/* ── Sidebar (desktop only) ─────────────────────────── */}
      <aside className="hidden md:flex w-52 shrink-0 h-full bg-white border-r border-stone-100 flex-col">

        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-4 h-14 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">P</span>
            </div>
            <span className="text-sm font-black text-stone-900 tracking-tight">Prospect</span>
          </div>
          <NotificationBell userType="student" userId={session.student_id} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + logout */}
        <div className="border-t border-stone-100 p-2 space-y-1 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-stone-50">
            <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
              <span className="text-stone-600 font-black text-[10px]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-stone-900 truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] text-stone-400 truncate">
                Gr {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { studentLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content area ──────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-12 bg-white border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-stone-900 flex items-center justify-center">
              <span className="text-white font-black text-[9px]">P</span>
            </div>
            <span className="text-sm font-black text-stone-900 tracking-tight">Prospect</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell userType="student" userId={session.student_id} />
            <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
              <span className="text-stone-600 font-black text-[10px]">{initials}</span>
            </div>
            <button
              onClick={() => { studentLogout(); onNavigate('portal'); }}
              className="text-[11px] font-black text-stone-400 hover:text-red-500 transition-colors px-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page content — scrollable, with bottom padding for mobile nav */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {activePage === 'home'          && <StudentHomePage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'announcements' && <StudentAnnouncementsPage session={session} />}
          {activePage === 'calendar'      && <StudentCalendarPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'marks'         && <StudentMarksPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'resources'     && <StudentResourcesPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'pastpapers'    && <StudentPastPapersPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'aps'           && <ApsCalculatorPage session={session} />}
          {activePage === 'future'        && (
            <Suspense fallback={<Spinner />}>
              <MyFuturePage session={session} onNavigate={p => {
                if (p === 'bursaries') { onNavigate('bursaries'); return; }
                if (p === 'quiz')      { onNavigate('quiz');      return; }
                setPage(p as ActivePage);
              }} />
            </Suspense>
          )}
          {activePage === 'library'       && (
            <Suspense fallback={<Spinner />}>
              <LibraryPage session={session} innerPage={innerPage} onNavigate={handleLibraryNavigate} />
            </Suspense>
          )}
        </div>

        {/* ── Mobile bottom nav ─────────────────────────────── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex items-center safe-bottom z-40"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Show 5 most important tabs on mobile */}
          {[
            { id: 'home'     as ActivePage, label: 'Home',    icon: Home },
            { id: 'library'  as ActivePage, label: 'Library', icon: BookOpen },
            { id: 'calendar' as ActivePage, label: 'Calendar',icon: CalendarDays },
            { id: 'marks'    as ActivePage, label: 'Marks',   icon: ClipboardList },
            { id: 'future'   as ActivePage, label: 'Future',  icon: Sparkles },
          ].map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                className="relative flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
              >
                {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-stone-900 rounded-full" />}
                <Icon className={`w-5 h-5 ${active ? 'text-stone-900' : 'text-stone-400'}`} />
                <span className={`text-[9px] font-black uppercase tracking-wide ${active ? 'text-stone-900' : 'text-stone-400'}`}>
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
