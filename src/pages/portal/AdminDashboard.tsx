import { useEffect, useState } from 'react';
import { LogOut, Home, GraduationCap, Megaphone } from 'lucide-react';
import { getAdminSession, adminLogout, type AdminSession } from '../../lib/auth';
import TeachersPage from './admin/TeachersPage';
import AdminAnnouncementsPage from './admin/AdminAnnouncementsPage';
import AdminHomePage from './admin/AdminHomePage';

type ActivePage = 'home' | 'teachers' | 'announcements';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');

  useEffect(() => {
    const s = getAdminSession();
    if (!s) { onNavigate('admin-login'); return; }
    setSession(s);
  }, []);

  if (!session) return null;

  const initials = `${session.name[0]}${session.surname[0]}`.toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navItems: { id: ActivePage; label: string; icon: any }[] = [
    { id: 'home',          label: 'Home',          icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'teachers',      label: 'Teachers',      icon: GraduationCap },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar (desktop only) ─────────────────────────── */}
      <aside className="hidden md:flex w-52 shrink-0 h-full bg-white border-r border-slate-100 flex-col">

        <div className="flex items-center gap-2 px-4 h-14 border-b border-slate-100 shrink-0">
          <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center">
            <span className="text-white font-black text-[10px]">P</span>
          </div>
          <span className="text-sm font-black text-stone-900 tracking-tight">Prospect</span>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button key={id} onClick={() => setActivePage(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 ${
                  active ? 'bg-stone-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-2 space-y-1 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <span className="text-slate-600 font-black text-[10px]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-slate-900 truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{session.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={() => { adminLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-12 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-stone-900 flex items-center justify-center">
              <span className="text-white font-black text-[9px]">P</span>
            </div>
            <span className="text-sm font-black text-stone-900 tracking-tight">Prospect</span>
          </div>
          <div className="flex items-center gap-3">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActivePage(id)}
                className={`text-[11px] font-black transition-colors ${activePage === id ? 'text-stone-900' : 'text-slate-400 hover:text-stone-700'}`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <button onClick={() => { adminLogout(); onNavigate('portal'); }}
              className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activePage === 'home'          && <AdminHomePage session={session} onNavigate={p => setActivePage(p as ActivePage)} />}
          {activePage === 'announcements' && <AdminAnnouncementsPage session={session} />}
          {activePage === 'teachers'      && <TeachersPage session={session} />}
        </div>
      </div>
    </div>
  );
}
