import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Home, GraduationCap, Megaphone, Menu, X, UsersRound, Users, School, Heart, CalendarClock, ListChecks, ShoppingBag, BookOpen, BookMarked, ChevronDown } from 'lucide-react';
import { getAdminSession, adminLogout, type AdminSession } from '../../lib/auth';
import TeachersPage from './admin/TeachersPage';
import AdminAnnouncementsPage from './admin/AdminAnnouncementsPage';
import AdminHomePage from './admin/AdminHomePage';
import StudentAssignmentsPage from './admin/StudentAssignmentsPage';
import ClassesAdminPage from './admin/ClassesAdminPage';
import StudentsDirectoryPage from './admin/StudentsDirectoryPage';
import ParentsAdminPage from './admin/ParentsAdminPage';
import TimetableAdminPage from './admin/TimetableAdminPage';
import SubjectSelectionAdminPage from './admin/SubjectSelectionAdminPage';
import SchoolSubjectsAdminPage from './admin/SchoolSubjectsAdminPage';
import MarketplacePage from './shared/MarketplacePage';
import SupplyGuideAdminPage from './admin/SupplyGuideAdminPage';

type ActivePage = 'home' | 'teachers' | 'announcements' | 'assignments' | 'classes' | 'students' | 'parents' | 'timetable' | 'subject-selection' | 'school-subjects' | 'marketplace' | 'supply-guide';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  // Accordion state for the sidebar's People/School groups — only one
  // open at a time, "People" open by default. Mirrors the student/teacher
  // dashboard sidebar's grouping behaviour.
  const [openGroup, setOpenGroup] = useState<string | null>('school');

  useEffect(() => {
    const s = getAdminSession();
    if (!s) { onNavigate('admin-login'); return; }
    setSession(s);
  }, []);

  if (!session) return null;

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type NavItem = { id: ActivePage; label: string; icon: any };

  const peopleItems: NavItem[] = [
    { id: 'teachers',      label: 'Teachers',      icon: GraduationCap },
    { id: 'students',      label: 'Students',      icon: Users },
    { id: 'parents',       label: 'Parents',       icon: Heart },
  ];
  const schoolItems: NavItem[] = [
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'classes',       label: 'Classes',       icon: School },
    { id: 'timetable',     label: 'Timetable',     icon: CalendarClock },
    { id: 'subject-selection', label: 'Subject Selection', icon: ListChecks },
    { id: 'school-subjects', label: 'Subjects by Grade', icon: BookMarked },
    { id: 'assignments',   label: 'Assignments',   icon: UsersRound },
    ...(session.school_id ? [{ id: 'marketplace' as ActivePage, label: 'Marketplace', icon: ShoppingBag }] : []),
    ...(session.school_id ? [{ id: 'supply-guide' as ActivePage, label: 'Supply Guide', icon: BookOpen }] : []),
  ];
  const navGroups: { key: string; label: string; items: NavItem[] }[] = [
    { key: 'school', label: 'School', items: schoolItems },
    { key: 'people', label: 'People', items: peopleItems },
  ];

  function setPage(id: ActivePage) {
    setActivePage(id);
    setMenuOpen(false);

    const owningGroup = navGroups.find(g => g.items.some(item => item.id === id));
    if (owningGroup) setOpenGroup(owningGroup.key);
  }

  function toggleGroup(key: string) {
    setOpenGroup(prev => (prev === key ? null : key));
  }

  return (
    <div className="flex h-screen bg-dash-bg overflow-hidden">

      {/* ── Sidebar (desktop only) — one continuous panel, sized and
          textured to match the .paper-card recipe the student/teacher
          dashboards use (soft layered shadow, faint top-to-bottom
          gradient, hairline border) instead of three flat white boxes. ── */}
      <aside className="hidden md:flex w-72 shrink-0 h-full flex-col p-4" style={{ background: '#eaebec' }}>
        <div className="flex-1 min-h-0 flex flex-col rounded-[14px]"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)',
            border: '1px solid var(--color-brand-border)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(15,18,15,0.10), 0 10px 24px -6px rgba(15,18,15,0.20), 0 32px 56px -20px rgba(15,18,15,0.28)',
          }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border shrink-0 rounded-t-[14px]">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 cursor-pointer">
              <img src="/logo3.png" alt="Prospect" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              <span className="font-serif-accent text-xl text-brand-dark leading-none">Prospect</span>
            </button>
          </div>

          {/* Nav — Home always visible as a top-level row; People/School
              collapse into an accordion (only one open at a time). */}
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
                <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">{session.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button onClick={() => { adminLogout(); onNavigate('portal'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[14px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
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
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-black text-[10px]">{initials}</span>
            </div>
            <button onClick={() => { adminLogout(); onNavigate('portal'); }}
              className="text-[11px] font-black text-stone-500 hover:text-red-500 transition-colors px-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Mobile nav drawer — slides in from the left ── */}
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

                  <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-brand-border shrink-0">
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 cursor-pointer">
                      <img src="/logo3.png" alt="Prospect" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <span className="font-serif-accent text-xl text-brand-dark leading-none">Prospect</span>
                    </button>
                    <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1.5 rounded-lg text-stone-500 hover:text-brand-dark hover:bg-brand-bg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Slightly denser rows than the desktop sidebar so all
                      groups fit without scrolling on most phone heights. */}
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
                                              ? 'bg-accent text-white'
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

                  <div className="p-3 shrink-0 border-t border-brand-border"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                    <div className="flex items-center gap-3 px-2 pb-3 mb-1.5 border-b border-brand-border">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <span className="text-accent-foreground font-black text-[12px]">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-black text-brand-dark truncate">{session.name} {session.surname}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400 truncate">{session.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <button onClick={() => { adminLogout(); onNavigate('portal'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[14px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                      <LogOut className="w-4.5 h-4.5 shrink-0" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto student-dashboard-bg">
          {activePage === 'home'          && <AdminHomePage session={session} onNavigate={p => setPage(p as ActivePage)} />}
          {activePage === 'announcements' && <AdminAnnouncementsPage session={session} />}
          {activePage === 'teachers'      && <TeachersPage session={session} />}
          {activePage === 'classes'       && <ClassesAdminPage session={session} />}
          {activePage === 'students'      && <StudentsDirectoryPage session={session} />}
          {activePage === 'parents'       && <ParentsAdminPage session={session} />}
          {activePage === 'timetable'     && <TimetableAdminPage session={session} />}
          {activePage === 'subject-selection' && <SubjectSelectionAdminPage session={session} />}
          {activePage === 'school-subjects' && <SchoolSubjectsAdminPage session={session} />}
          {activePage === 'assignments'   && <StudentAssignmentsPage session={session} />}
          {activePage === 'marketplace' && session.school_id && (
            <MarketplacePage sellerType="admin" sellerId={session.admin_id} schoolId={session.school_id} />
          )}
          {activePage === 'supply-guide' && session.school_id && (
            <SupplyGuideAdminPage session={session} />
          )}
        </div>
      </div>
    </div>
  );
}
