import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Home, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone, Sparkles, FileText, Menu, X, ClipboardCheck, School, Award, CalendarClock } from 'lucide-react';
import { getStudentSession, studentLogout, type StudentSession } from '../../lib/auth';
import { fetchCohortHomeroomTeacher } from '../../lib/homeroom';
import StudentHomePage from './student/StudentHomePage';
import StudentCalendarPage from './student/StudentCalendarPage';
import StudentMarksPage from './student/StudentMarksPage';
import StudentResourcesPage from './student/StudentResourcesPage';
import StudentAnnouncementsPage from './student/StudentAnnouncementsPage';
import StudentPastPapersPage from './student/StudentPastPapersPage';
import StudentTopicTestsPage from './student/StudentTopicTestsPage';
import StudentHomeroomPage from './student/StudentHomeroomPage';
import StudentBehaviourPage from './student/StudentBehaviourPage';
import StudentTimetablePage from './student/StudentTimetablePage';
import NotificationBell from '../../shared/components/NotificationBell';

const LibraryPage  = lazy(() => import('./student/LibraryPage'));
const MyFuturePage = lazy(() => import('./student/MyFuturePage'));

type ActivePage = 'home' | 'calendar' | 'marks' | 'resources' | 'announcements' | 'pastpapers' | 'library' | 'aps' | 'future' | 'topic-tests' | 'homeroom' | 'behaviour' | 'timetable';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-5 h-5 border-2 border-brand-border border-t-accent rounded-full animate-spin" />
  </div>
);

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [session, setSession] = useState<StudentSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [innerPage, setInnerPage] = useState<string>('library');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasHomeroom, setHasHomeroom] = useState(false);
  // APS & Unis now lives inside My Future — this tells MyFuturePage which
  // sub-view to open on mount when a link elsewhere in the portal targets 'aps'.
  const [futureSubView, setFutureSubView] = useState<'aps' | null>(null);

  useEffect(() => {
    const s = getStudentSession();
    if (!s) { onNavigate('student-login'); return; }
    setSession(s);
    if (s.cohort_id) {
      fetchCohortHomeroomTeacher(s.cohort_id).then((t) => setHasHomeroom(!!t));
    }
  }, []);

  if (!session) return null;

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navItems: { id: ActivePage; label: string; icon: any; mobileLabel?: string }[] = [
    { id: 'home',          label: 'Home',          icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone,      mobileLabel: 'News' },
    ...(hasHomeroom ? [{ id: 'homeroom' as ActivePage, label: 'Homeroom', icon: School }] : []),
    { id: 'behaviour',     label: 'Behaviour',     icon: Award,          mobileLabel: 'Behaviour' },
    { id: 'timetable',     label: 'Timetable',     icon: CalendarClock },
    { id: 'calendar',      label: 'Calendar',      icon: CalendarDays },
    { id: 'marks',         label: 'My Marks',      icon: ClipboardList,  mobileLabel: 'Marks' },
    { id: 'resources',     label: 'Resources',     icon: FolderOpen },
    { id: 'pastpapers',    label: 'Past Papers',   icon: FileText,       mobileLabel: 'Papers' },
    { id: 'library',       label: 'Library',       icon: BookOpen },
    { id: 'topic-tests',   label: 'Topic Tests',   icon: ClipboardCheck },
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
    if (id === 'aps') {
      // Legacy target from quick actions elsewhere in the portal — APS & Unis
      // now lives inside My Future rather than as its own sidebar page.
      setFutureSubView('aps');
      setActivePage('future');
      setMenuOpen(false);
      return;
    }
    setActivePage(id);
    if (id === 'library') setInnerPage('library');
    if (id === 'future')  setFutureSubView(null);
    setMenuOpen(false);
  }

  return (
    <div className="flex h-screen bg-dash-bg overflow-hidden">

      {/* ── Sidebar (desktop only) ─────────────────────────── */}
      <aside className="hidden md:flex w-56 shrink-0 h-full bg-white border-r border-brand-border flex-col">

        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-brand-border shrink-0">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.jpg" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
            <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
          </button>
          <NotificationBell userType="student" userId={session.student_id} />
        </div>

        {/* Nav */}
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
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + logout */}
        <div className="border-t border-brand-border p-3 space-y-1 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-brand-bg">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-accent-foreground font-black text-[10px]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] text-stone-500 truncate">
                Gr {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { studentLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all"
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
              <img src="/logo.jpg" alt="Prospect" className="w-6 h-6 rounded-md object-cover shrink-0" />
              <span className="font-serif-accent text-base text-brand-dark leading-none">Prospect</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell userType="student" userId={session.student_id} />
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-black text-[10px]">{initials}</span>
            </div>
            <button
              onClick={() => { studentLogout(); onNavigate('portal'); }}
              className="text-[11px] font-black text-stone-500 hover:text-red-500 transition-colors px-1"
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
                  <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
                    <img src="/logo.jpg" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                    <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect</span>
                  </button>
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
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
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
                      <p className="text-[10px] text-stone-500 truncate">
                        Gr {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { studentLogout(); onNavigate('portal'); }}
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

        {/* Page content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {activePage === 'home'          && <StudentHomePage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'announcements' && <StudentAnnouncementsPage session={session} />}
          {activePage === 'homeroom'      && <StudentHomeroomPage session={session} />}
          {activePage === 'behaviour'     && <StudentBehaviourPage session={session} />}
          {activePage === 'timetable'     && <StudentTimetablePage session={session} />}
          {activePage === 'calendar'      && <StudentCalendarPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'marks'         && <StudentMarksPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'resources'     && <StudentResourcesPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'pastpapers'    && <StudentPastPapersPage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'topic-tests'   && <StudentTopicTestsPage session={session} />}
          {activePage === 'future'        && (
            <Suspense fallback={<Spinner />}>
              <MyFuturePage
                session={session}
                initialSubView={futureSubView}
                onNavigate={p => {
                  if (p === 'bursaries') { onNavigate('bursaries'); return; }
                  if (p === 'quiz')      { onNavigate('quiz');      return; }
                  setPage(p as ActivePage);
                }}
              />
            </Suspense>
          )}
          {activePage === 'library'       && (
            <Suspense fallback={<Spinner />}>
              <LibraryPage session={session} innerPage={innerPage} onNavigate={handleLibraryNavigate} />
            </Suspense>
          )}
        </div>

      </div>
    </div>
  );
}
