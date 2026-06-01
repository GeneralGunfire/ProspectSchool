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

  const navItems = [
    { id: 'home'          as ActivePage, label: 'Home',          icon: Home },
    { id: 'announcements' as ActivePage, label: 'Announcements', icon: Megaphone },
    { id: 'classes'       as ActivePage, label: 'Classes',       icon: Users },
    { id: 'calendar'      as ActivePage, label: 'Calendar',      icon: CalendarDays },
    { id: 'marks'         as ActivePage, label: 'Marks',         icon: ClipboardList },
    { id: 'resources'     as ActivePage, label: 'Resources',     icon: FolderOpen },
    { id: 'library'       as ActivePage, label: 'Library',       icon: BookOpen },
  ];

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  return (
    <div className="flex h-screen bg-[#F5F0E8] overflow-hidden">

      {/* Sidebar — always visible, never collapsible */}
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
                onClick={() => setActivePage(item.id)}
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
              <p className="text-[10px] text-slate-400 truncate">{session.school_name}</p>
            </div>
          </div>
          <button
            onClick={() => { teacherLogout(); onNavigate('portal'); }}
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
          <TeacherHomePage session={session} onNavigate={page => setActivePage(page as ActivePage)} />
        )}
        {activePage === 'announcements' && <AnnouncementsPage session={session} />}
        {activePage === 'classes'       && <ClassesPage session={session} />}
        {activePage === 'calendar'      && <CalendarPage session={session} />}
        {activePage === 'marks'         && <MarksPage session={session} />}
        {activePage === 'resources'     && <ResourcesPage session={session} />}
        {activePage === 'library'       && <StudentProgressPage session={session} />}
      </div>

    </div>
  );
}
