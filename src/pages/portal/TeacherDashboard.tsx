import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Home, Users, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone, Menu, X, FileText, AlertTriangle, ClipboardCheck, School, Award, CalendarClock, ListChecks, ShoppingBag } from 'lucide-react';
import { getTeacherSession, teacherLogout, type TeacherSession } from '../../lib/auth';
import { fetchTeacherHomerooms } from '../../lib/homeroom';
import SubjectApprovalsPage from './teacher/SubjectApprovalsPage';
import ClassesPage from './teacher/ClassesPage';
import CalendarPage from './teacher/CalendarPage';
import MarksPage from './teacher/MarksPage';
import StudentProgressPage from './teacher/StudentProgressPage';
import ResourcesPage from './teacher/ResourcesPage';
import PastPapersPage from './teacher/PastPapersPage';
import AnnouncementsPage from './teacher/AnnouncementsPage';
import TeacherHomePage from './teacher/TeacherHomePage';
import RiskEnginePage from './teacher/RiskEnginePage';
import TopicTestsPage from './teacher/TopicTestsPage';
import HomeroomPage from './teacher/HomeroomPage';
import BehaviourPage from './teacher/BehaviourPage';
import TimetablePage from './teacher/TimetablePage';
import MarketplacePage from './shared/MarketplacePage';
import NotificationBell from '../../shared/components/NotificationBell';

type ActivePage = 'home' | 'classes' | 'calendar' | 'marks' | 'library' | 'resources' | 'past-papers' | 'announcements' | 'risk' | 'topic-tests' | 'homeroom' | 'behaviour' | 'timetable' | 'subject-approvals' | 'marketplace';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [session, setSession] = useState<TeacherSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHomeroom, setIsHomeroom] = useState(false);
  const [jumpToTestId, setJumpToTestId] = useState<number | null>(null);

  useEffect(() => {
    const s = getTeacherSession();
    if (!s) { onNavigate('teacher-login'); return; }
    setSession(s);
    fetchTeacherHomerooms(s.teacher_id).then((h) => setIsHomeroom(h.length > 0));
  }, []);

  if (!session) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navItems: { id: ActivePage; label: string; icon: any }[] = [
    { id: 'home',          label: 'Home',          icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'classes',       label: 'Classes',       icon: Users },
    ...(isHomeroom ? [{ id: 'homeroom' as ActivePage, label: 'Homeroom', icon: School }] : []),
    ...(isHomeroom ? [{ id: 'subject-approvals' as ActivePage, label: 'Subject Selection', icon: ListChecks }] : []),
    { id: 'behaviour',     label: 'Behaviour',     icon: Award },
    { id: 'timetable',     label: 'Timetable',     icon: CalendarClock },
    { id: 'calendar',      label: 'Calendar',      icon: CalendarDays },
    { id: 'marks',         label: 'Marks',         icon: ClipboardList },
    { id: 'resources',     label: 'Resources',     icon: FolderOpen },
    { id: 'past-papers',   label: 'Past Papers',   icon: FileText },
    { id: 'library',       label: 'Progress',      icon: BookOpen },
    { id: 'topic-tests',   label: 'Topic Tests',   icon: ClipboardCheck },
    { id: 'marketplace',   label: 'Marketplace',   icon: ShoppingBag },
    { id: 'risk',          label: 'At-Risk',       icon: AlertTriangle },
  ];

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  function setPage(id: ActivePage) {
    setActivePage(id);
    setMenuOpen(false);
  }

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
          <NotificationBell userType="teacher" userId={session.teacher_id} />
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

        {/* Profile + sign out card */}
        <div className="p-2.5 shrink-0 rounded-[14px] bg-white"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2.5 px-1 pb-2.5 mb-1 border-b border-brand-border">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-accent-foreground font-black text-[11px]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">{session.school_name}</p>
            </div>
          </div>
          <button
            onClick={() => { teacherLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all"
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
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
              <img src="/logo3.png" alt="Prospect" className="w-6 h-6 rounded-lg object-cover shrink-0" />
              <span className="font-serif-accent text-base text-brand-dark leading-none">Prospect</span>
            </button>
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
                  <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg text-stone-500 hover:text-brand-dark hover:bg-brand-bg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav card — same list as desktop sidebar, single column */}
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
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">{session.school_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { teacherLogout(); onNavigate('portal'); }}
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

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {activePage === 'home'          && <TeacherHomePage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'announcements' && <AnnouncementsPage session={session} />}
          {activePage === 'classes'       && <ClassesPage session={session} />}
          {activePage === 'homeroom'      && <HomeroomPage session={session} />}
          {activePage === 'subject-approvals' && <SubjectApprovalsPage session={session} />}
          {activePage === 'behaviour'     && <BehaviourPage session={session} />}
          {activePage === 'timetable'     && <TimetablePage session={session} />}
          {activePage === 'calendar'      && <CalendarPage session={session} />}
          {activePage === 'marks'         && <MarksPage session={session} />}
          {activePage === 'resources'     && <ResourcesPage session={session} />}
          {activePage === 'past-papers'   && <PastPapersPage session={session} />}
          {activePage === 'library'       && <StudentProgressPage session={session} onOpenTopicTest={(id) => { setJumpToTestId(id); setPage('topic-tests'); }} />}
          {activePage === 'topic-tests'   && <TopicTestsPage session={session} initialTestId={jumpToTestId} onConsumeInitialTestId={() => setJumpToTestId(null)} />}
          {activePage === 'marketplace'   && <MarketplacePage sellerType="teacher" sellerId={session.teacher_id} schoolId={session.school_id} />}
          {activePage === 'risk'          && <RiskEnginePage session={session} />}
        </div>
      </div>
    </div>
  );
}
