import { useEffect, useState, lazy, Suspense } from 'react';
import { LogOut, Home, CalendarDays, ClipboardList, BookOpen } from 'lucide-react';
import { getStudentSession, studentLogout, type StudentSession } from '../../lib/auth';
import StudentCalendarPage from './student/StudentCalendarPage';
import StudentMarksPage from './student/StudentMarksPage';

const LibraryPage = lazy(() => import('./student/LibraryPage'));

type ActivePage = 'home' | 'calendar' | 'marks' | 'library';

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
    { id: 'home'     as ActivePage, label: 'Home',      icon: Home },
    { id: 'calendar' as ActivePage, label: 'Calendar',  icon: CalendarDays },
    { id: 'marks'    as ActivePage, label: 'My Marks',  icon: ClipboardList },
    { id: 'library'  as ActivePage, label: 'Library',   icon: BookOpen },
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
      <div className="min-h-screen bg-white">
        <Suspense fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
          </div>
        }>
          <LibraryPage
            session={session}
            innerPage={innerPage}
            onNavigate={handleLibraryNavigate}
          />
        </Suspense>
      </div>
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
        {activePage === 'home' && (
          <div className="p-8">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Dashboard</p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
              Welcome, {session.name}.
            </h1>
            <p className="text-sm text-slate-400">{session.school_name}</p>
          </div>
        )}
        {activePage === 'calendar' && <StudentCalendarPage session={session} />}
        {activePage === 'marks'    && <StudentMarksPage session={session} />}
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
