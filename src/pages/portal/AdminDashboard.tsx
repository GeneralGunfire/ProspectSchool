import { useEffect, useState } from 'react';
import { LogOut, Home, GraduationCap, Megaphone } from 'lucide-react';
import { getAdminSession, adminLogout, type AdminSession } from '../../lib/auth';
import TeachersPage from './admin/TeachersPage';
import AdminAnnouncementsPage from './admin/AdminAnnouncementsPage';

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

  const navItems = [
    { id: 'home'          as ActivePage, label: 'Home',          icon: Home },
    { id: 'announcements' as ActivePage, label: 'Announcements', icon: Megaphone },
    { id: 'teachers'      as ActivePage, label: 'Teachers',      icon: GraduationCap },
  ];

  return (
    <div className="flex h-screen bg-[#F5F0E8] overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 shrink-0 h-full bg-white border-r border-slate-200 flex flex-col">
        <div className="flex items-center gap-2 px-4 h-14 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="text-white font-black text-xs">P</span>
          </div>
          <span className="text-sm font-black text-slate-900 tracking-tight">Prospect</span>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${
                  active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-2 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <span className="text-slate-700 font-black text-xs">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{session.name} {session.surname}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{session.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={() => { adminLogout(); onNavigate('portal'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-all">
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {activePage === 'home' && (
          <div className="p-8">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Admin</p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Welcome, {session.name}.
            </h1>
            <p className="text-sm text-slate-400">{session.school_name}</p>
          </div>
        )}
        {activePage === 'announcements' && <AdminAnnouncementsPage session={session} />}
        {activePage === 'teachers'      && <TeachersPage session={session} />}
      </div>
    </div>
  );
}
