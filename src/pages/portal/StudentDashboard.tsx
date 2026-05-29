import { useEffect, useState, lazy, Suspense } from 'react';
import { LogOut, Home, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone } from 'lucide-react';
import { getStudentSession, studentLogout, type StudentSession } from '../../lib/auth';
import StudentHomePage from './student/StudentHomePage';
import StudentCalendarPage from './student/StudentCalendarPage';
import StudentMarksPage from './student/StudentMarksPage';
import StudentResourcesPage from './student/StudentResourcesPage';
import StudentAnnouncementsPage from './student/StudentAnnouncementsPage';

const LibraryPage = lazy(() => import('./student/LibraryPage'));

type ActivePage = 'home' | 'calendar' | 'marks' | 'resources' | 'announcements' | 'library';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [session, setSession] = useState<StudentSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  // innerPage tracks which learning page or 'library' hub is shown
  const [innerPage, setInnerPage] = useState<string>('library');

  useEffect(() => {
    const s = getStudentSession();
    if (!s) { onNavigate('student-login'); return; }
    setSession(s);
  }, []);

  if (!session) return null;

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  const navItems = [
    { id: 'home'          as ActivePage, label: 'Home',          icon: Home },
    { id: 'announcements' as ActivePage, label: 'Announcements', icon: Megaphone },
    { id: 'calendar'      as ActivePage, label: 'Calendar',      icon: CalendarDays },
    { id: 'marks'         as ActivePage, label: 'My Marks',      icon: ClipboardList },
    { id: 'resources'     as ActivePage, label: 'Resources',     icon: FolderOpen },
    { id: 'library'       as ActivePage, label: 'Library',       icon: BookOpen },
  ];

  // When library navigates internally (to a learning page or back)
  function handleLibraryNavigate(page: string) {
    if (page === 'student-dashboard' || page === 'library') {
      setInnerPage('library');
    } else if (page.startsWith('learning-')) {
      setInnerPage(page);
    } else {
      // Any other navigation goes to App-level
      onNavigate(page);
    }
  }

  // When in a learning page, sidebar is hidden for full-screen immersion
  const inLearningPage = activePage === 'library' && innerPage.startsWith('learning-');

  if (inLearningPage) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(98.5% 0.005 80)' }}>
          <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
        </div>
      }>
        <LibraryPage
          session={session}
          innerPage={innerPage}
          onNavigate={handleLibraryNavigate}
        />
      </Suspense>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAF9F6] overflow-hidden">

      {/* Sidebar */}
      <div className="w-56 shrink-0 h-full bg-white border-r border-slate-200 flex flex-col">

        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="text-white font-black text-xs">P</span>
          </div>
          <span className="text-sm font-black text-slate-900 tracking-tight">Prospect</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (item.id === 'library') setInnerPage('library');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + logout */}
        <div className="border-t border-slate-100 p-2 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <span className="text-slate-700 font-black text-xs">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] text-slate-400 truncate">
                Gr {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { studentLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {activePage === 'home'          && <StudentHomePage session={session} onNavigate={page => setActivePage(page as ActivePage)} />}
        {activePage === 'announcements' && <StudentAnnouncementsPage session={session} />}
        {activePage === 'calendar'      && <StudentCalendarPage session={session} />}
        {activePage === 'marks'         && <StudentMarksPage session={session} />}
        {activePage === 'resources'     && <StudentResourcesPage session={session} />}
        {activePage === 'library'  && (
          <Suspense fallback={
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
            </div>
          }>
            <LibraryPage
              session={session}
              innerPage={innerPage}
              onNavigate={handleLibraryNavigate}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
