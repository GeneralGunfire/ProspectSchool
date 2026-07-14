import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Home, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone, Sparkles, FileText, Menu, X, ClipboardCheck, School, Award, CalendarClock, ListChecks, ShoppingBag } from 'lucide-react';
import { getStudentSession, studentLogout, type StudentSession } from '../../lib/auth';
import { fetchCohortHomeroomTeacher } from '../../lib/homeroom';
import SubjectSelectionPage from './student/SubjectSelectionPage';
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
import MarketplacePage from './shared/MarketplacePage';
import NotificationBell from '../../shared/components/NotificationBell';

const LibraryPage  = lazy(() => import('./student/LibraryPage'));
const MyFuturePage = lazy(() => import('./student/MyFuturePage'));

type ActivePage = 'home' | 'calendar' | 'marks' | 'resources' | 'announcements' | 'pastpapers' | 'library' | 'aps' | 'future' | 'topic-tests' | 'homeroom' | 'behaviour' | 'timetable' | 'subject-selection' | 'marketplace';

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
    { id: 'marketplace',   label: 'Marketplace',   icon: ShoppingBag },
    { id: 'future',        label: 'My Future',     icon: Sparkles,       mobileLabel: 'Future' },
    ...(session?.grade === 9 ? [{ id: 'subject-selection' as ActivePage, label: 'Subject Selection', icon: ListChecks }] : []),
  ];

  // Sidebar-only grouping — same items as navItems, split into labeled
  // sections so the nav reads as organized categories rather than one
  // flat list of 12+ items.
  const toolIds: ActivePage[] = ['library', 'marketplace', 'future'];
  const academicNavItems = navItems.filter(item => !toolIds.includes(item.id));
  const toolNavItems = navItems.filter(item => toolIds.includes(item.id));
  const navGroups: { label: string; items: typeof navItems }[] = [
    { label: 'Academic', items: academicNavItems },
    { label: 'Tools', items: toolNavItems },
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

      {/* ── Sidebar (desktop only) — one continuous panel, sized and
          textured to match the .paper-card recipe the rest of the
          student dashboard uses (soft layered shadow, faint top-to-
          bottom gradient, hairline border) instead of a flat white
          box with a barely-there shadow. ── */}
      <aside className="hidden md:flex w-72 shrink-0 h-full flex-col p-4" style={{ background: '#eeece5' }}>
        <div className="flex-1 min-h-0 flex flex-col rounded-[14px]"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)',
            border: '1px solid var(--color-brand-border)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(15,18,15,0.10), 0 10px 24px -6px rgba(15,18,15,0.20), 0 32px 56px -20px rgba(15,18,15,0.28)',
          }}>

          {/* Logo */}
          <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-brand-border shrink-0 rounded-t-[14px]">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 cursor-pointer">
              <img src="/logo3.png" alt="Prospect" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              <span className="font-serif-accent text-xl text-brand-dark leading-none">Prospect</span>
            </button>
            <NotificationBell userType="student" userId={session.student_id} />
          </div>

          {/* Nav — grouped into labeled sections rather than one flat list */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto">
            {navGroups.map((group, gi) => (
              <div key={group.label} className={gi > 0 ? 'mt-4' : ''}>
                <p className="px-4 mb-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map(({ id, label, icon: Icon }) => {
                    const active = activePage === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setPage(id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[13.5px] font-bold transition-all duration-150 ${
                          active
                            ? 'bg-brand-dark text-white'
                            : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                        }`}
                        style={active ? { boxShadow: '0 4px 10px -2px rgba(21,23,28,0.35)' } : undefined}
                      >
                        <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : ''}`} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Profile + logout */}
          <div className="p-3 shrink-0 border-t border-brand-border rounded-b-[14px]">
            <div className="flex items-center gap-3 px-2 pb-3 mb-1.5 border-b border-brand-border">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="text-accent-foreground font-black text-[12px]">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">
                  Gr {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => { studentLogout(); onNavigate('portal'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[14px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              Sign Out
            </button>
          </div>
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
                className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[82vw] flex flex-col p-3"
                style={{ background: '#eeece5' }}
              >
                <div className="flex-1 min-h-0 flex flex-col rounded-[14px] overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)',
                    border: '1px solid var(--color-brand-border)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(15,18,15,0.10), 0 10px 24px -6px rgba(15,18,15,0.20), 0 32px 56px -20px rgba(15,18,15,0.28)',
                  }}>

                  {/* Logo + close */}
                  <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-brand-border shrink-0">
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 cursor-pointer">
                      <img src="/logo3.png" alt="Prospect" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <span className="font-serif-accent text-xl text-brand-dark leading-none">Prospect</span>
                    </button>
                    <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1.5 rounded-lg text-stone-500 hover:text-brand-dark hover:bg-brand-bg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Nav — same grouped sections as the desktop sidebar */}
                  <nav className="flex-1 px-3 py-3 overflow-y-auto">
                    {navGroups.map((group, gi) => (
                      <div key={group.label} className={gi > 0 ? 'mt-4' : ''}>
                        <p className="px-4 mb-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">
                          {group.label}
                        </p>
                        <div className="space-y-1">
                          {group.items.map(({ id, label, icon: Icon }) => {
                            const active = activePage === id;
                            return (
                              <button
                                key={id}
                                onClick={() => setPage(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[13.5px] font-bold transition-all duration-150 ${
                                  active
                                    ? 'bg-brand-dark text-white'
                                    : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                                }`}
                                style={active ? { boxShadow: '0 4px 10px -2px rgba(21,23,28,0.35)' } : undefined}
                              >
                                <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : ''}`} />
                                <span>{label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </nav>

                  {/* Profile + logout */}
                  <div className="p-3 shrink-0 border-t border-brand-border"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                    <div className="flex items-center gap-3 px-2 pb-3 mb-1.5 border-b border-brand-border">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <span className="text-accent-foreground font-black text-[12px]">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">
                          Gr {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { studentLogout(); onNavigate('portal'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[14px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <LogOut className="w-4.5 h-4.5 shrink-0" />
                      Sign Out
                    </button>
                  </div>
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
          {activePage === 'marketplace'   && <MarketplacePage sellerType="student" sellerId={session.student_id} schoolId={session.school_id} studentGrade={session.grade} />}
          {activePage === 'subject-selection' && <SubjectSelectionPage session={session} />}
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
