import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Home, Users, CalendarDays, ClipboardList, BookOpen, FolderOpen, Megaphone, Menu, X, FileText, AlertTriangle, ClipboardCheck, School, Award, CalendarClock, ListChecks, ShoppingBag, HeartHandshake, ChevronDown } from 'lucide-react';
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
import HomeroomPage from './teacher/HomeroomPage';
import WellbeingHomeroomPage from './teacher/WellbeingHomeroomPage';
import TeacherWellbeingGuidancePage from './teacher/TeacherWellbeingGuidancePage';
import type { TeacherGuidanceTopicId } from '../../lib/wellbeingTeacherGuidance';
import BehaviourPage from './teacher/BehaviourPage';
import TimetablePage from './teacher/TimetablePage';
import TopicTestsV2Page from './teacher/TopicTestsV2Page';
import PeerTutoringPage from './teacher/PeerTutoringPage';
import MarketplacePage from './shared/MarketplacePage';
import NotificationBell from '../../shared/components/NotificationBell';

type ActivePage = 'home' | 'classes' | 'calendar' | 'marks' | 'library' | 'resources' | 'past-papers' | 'announcements' | 'risk' | 'topic-tests' | 'homeroom' | 'behaviour' | 'timetable' | 'subject-approvals' | 'marketplace' | 'wellbeing' | 'wellbeing-guidance' | 'peer-tutoring';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const [session, setSession] = useState<TeacherSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHomeroom, setIsHomeroom] = useState(false);
  const [jumpToTestId, setJumpToTestId] = useState<number | null>(null);
  const [guidanceTopic, setGuidanceTopic] = useState<TeacherGuidanceTopicId | null>(null);
  // Accordion state for the sidebar's Academic/Learning/Insights groups —
  // only one open at a time, "Academic" open by default on load. Mirrors
  // the student dashboard sidebar's grouping behaviour.
  const [openGroup, setOpenGroup] = useState<string | null>('academic');

  useEffect(() => {
    const s = getTeacherSession();
    if (!s) { onNavigate('teacher-login'); return; }
    setSession(s);
    fetchTeacherHomerooms(s.teacher_id).then((h) => setIsHomeroom(h.length > 0));
  }, []);

  if (!session) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type NavItem = { id: ActivePage; label: string; icon: any };

  // Desktop/mobile-drawer accordion groups — same structure as the student
  // dashboard sidebar. "Academic" starts open on load; opening another
  // group closes whichever one was open (accordion, not independent
  // toggles), handled by openGroup state below.
  const academicItems: NavItem[] = [
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'classes',       label: 'Classes',       icon: Users },
    ...(isHomeroom ? [{ id: 'homeroom' as ActivePage, label: 'Homeroom', icon: School }] : []),
    { id: 'behaviour',     label: 'Behaviour',     icon: Award },
    { id: 'timetable',     label: 'Timetable',     icon: CalendarClock },
    { id: 'calendar',      label: 'Calendar',      icon: CalendarDays },
    { id: 'marks',         label: 'Marks',         icon: ClipboardList },
    { id: 'marketplace',   label: 'Marketplace',   icon: ShoppingBag },
  ];
  const learningItems: NavItem[] = [
    { id: 'resources',     label: 'Resources',     icon: FolderOpen },
    { id: 'past-papers',   label: 'Past Papers',   icon: FileText },
    { id: 'library',       label: 'Progress',      icon: BookOpen },
    { id: 'topic-tests',   label: 'Topic Tests',   icon: ClipboardCheck },
    { id: 'peer-tutoring', label: 'Peer Tutoring', icon: Users },
  ];
  const insightsItems: NavItem[] = [
    { id: 'risk',          label: 'At-Risk',       icon: AlertTriangle },
    ...(isHomeroom ? [{ id: 'wellbeing' as ActivePage, label: 'Wellbeing', icon: HeartHandshake }] : []),
    ...(isHomeroom ? [{ id: 'subject-approvals' as ActivePage, label: 'Subject Selection', icon: ListChecks }] : []),
  ];
  const navGroups: { key: string; label: string; items: NavItem[] }[] = [
    { key: 'academic', label: 'Academic', items: academicItems },
    { key: 'learning', label: 'Learning', items: learningItems },
    { key: 'insights', label: 'Insights', items: insightsItems },
  ];

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  function setPage(id: ActivePage) {
    setActivePage(id);
    setMenuOpen(false);

    // Keep the sidebar in sync when navigation comes from outside the
    // sidebar itself (e.g. a quick action on Home) — open whichever
    // group contains the page being navigated to.
    const owningGroup = navGroups.find(g => g.items.some(item => item.id === id));
    if (owningGroup) setOpenGroup(owningGroup.key);
  }

  function toggleGroup(key: string) {
    setOpenGroup(prev => (prev === key ? null : key));
  }

  return (
    <div className="flex h-screen bg-dash-bg overflow-hidden">

      {/* ── Sidebar (desktop only) — one continuous panel, sized and
          textured to match the .paper-card recipe the student dashboard
          uses (soft layered shadow, faint top-to-bottom gradient,
          hairline border) instead of three flat white boxes. ── */}
      <aside className="hidden md:flex w-72 shrink-0 h-full flex-col p-4" style={{ background: '#eaebec' }}>
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
            <NotificationBell userType="teacher" userId={session.teacher_id} />
          </div>

          {/* Nav — Home always visible as a top-level row; Academic/
              Learning/Insights collapse into an accordion (only one open
              at a time) so the list reads as organized categories instead
              of one long flat list. */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
            <button
              onClick={() => setPage('home')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[13.5px] font-bold transition-all duration-150 ${
                activePage === 'home' ? 'bg-brand-dark text-white' : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
              }`}
              style={activePage === 'home' ? { boxShadow: '0 4px 10px -2px rgba(21,23,28,0.35)' } : undefined}
            >
              <Home className={`w-4.5 h-4.5 shrink-0 ${activePage === 'home' ? 'text-white' : ''}`} />
              <span>Home</span>
            </button>

            <div className="pt-2 space-y-1">
              {navGroups.map(group => {
                const isOpen = openGroup === group.key;
                return (
                  <div key={group.key}>
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-[10px] text-[11px] font-black uppercase tracking-[0.12em] text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {group.label}
                      <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 pb-1">
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
                                  <span className="flex-1 text-left">{label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Profile + logout */}
          <div className="p-3 shrink-0 border-t border-brand-border rounded-b-[14px]">
            <div className="flex items-center gap-3 px-2 pb-3 mb-1.5 border-b border-brand-border">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="text-accent-foreground font-black text-[12px]">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">{session.school_name}</p>
              </div>
            </div>
            <button
              onClick={() => { teacherLogout(); onNavigate('portal'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[14px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              Sign Out
            </button>
          </div>
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
                className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[82vw] flex flex-col p-3"
                style={{ background: '#eaebec' }}
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

                  {/* Nav — same Home-top-level + accordion structure as the
                      desktop sidebar, with slightly denser rows on mobile
                      so all groups fit without scrolling on most phones. */}
                  <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto space-y-0.5">
                    <button
                      onClick={() => setPage('home')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-[10px] text-[13px] font-bold transition-all duration-150 ${
                        activePage === 'home' ? 'bg-brand-dark text-white' : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                      }`}
                      style={activePage === 'home' ? { boxShadow: '0 4px 10px -2px rgba(21,23,28,0.35)' } : undefined}
                    >
                      <Home className={`w-4 h-4 shrink-0 ${activePage === 'home' ? 'text-white' : ''}`} />
                      <span>Home</span>
                    </button>

                    <div className="pt-1.5 space-y-0.5">
                      {navGroups.map(group => {
                        const isOpen = openGroup === group.key;
                        return (
                          <div key={group.key}>
                            <button
                              onClick={() => toggleGroup(group.key)}
                              className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-[0.12em] text-stone-400 hover:text-stone-600 transition-colors"
                            >
                              {group.label}
                              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-0.5 pb-1">
                                    {group.items.map(({ id, label, icon: Icon }) => {
                                      const active = activePage === id;
                                      return (
                                        <button
                                          key={id}
                                          onClick={() => setPage(id)}
                                          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-[10px] text-[13px] font-bold transition-all duration-150 ${
                                            active
                                              ? 'bg-brand-dark text-white'
                                              : 'text-stone-500 hover:bg-brand-bg hover:text-brand-dark'
                                          }`}
                                          style={active ? { boxShadow: '0 4px 10px -2px rgba(21,23,28,0.35)' } : undefined}
                                        >
                                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
                                          <span className="flex-1 text-left">{label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
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
                        <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">{session.school_name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { teacherLogout(); onNavigate('portal'); }}
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

        {/* Page content */}
        <div className="flex-1 overflow-y-auto student-dashboard-bg">
          {activePage === 'home'          && <TeacherHomePage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'announcements' && <AnnouncementsPage session={session} />}
          {activePage === 'classes'       && <ClassesPage session={session} />}
          {activePage === 'homeroom'      && <HomeroomPage session={session} />}
          {activePage === 'wellbeing'     && (
            <WellbeingHomeroomPage
              session={session}
              onOpenGuidance={(topicId) => { setGuidanceTopic(topicId); setActivePage('wellbeing-guidance'); }}
            />
          )}
          {activePage === 'wellbeing-guidance' && <TeacherWellbeingGuidancePage session={session} initialTopic={guidanceTopic} />}
          {activePage === 'subject-approvals' && <SubjectApprovalsPage session={session} />}
          {activePage === 'behaviour'     && <BehaviourPage session={session} />}
          {activePage === 'timetable'     && <TimetablePage session={session} />}
          {activePage === 'calendar'      && <CalendarPage session={session} />}
          {activePage === 'marks'         && <MarksPage session={session} />}
          {activePage === 'resources'     && <ResourcesPage session={session} />}
          {activePage === 'past-papers'   && <PastPapersPage session={session} />}
          {activePage === 'library'       && <StudentProgressPage session={session} onOpenTopicTest={(id) => { setJumpToTestId(id); setPage('topic-tests'); }} />}
          {activePage === 'topic-tests'   && <TopicTestsV2Page session={session} />}
          {activePage === 'peer-tutoring' && <PeerTutoringPage session={session} />}
          {activePage === 'marketplace'   && <MarketplacePage sellerType="teacher" sellerId={session.teacher_id} schoolId={session.school_id} />}
          {activePage === 'risk'          && <RiskEnginePage session={session} />}
        </div>
      </div>
    </div>
  );
}
