import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  fetchNotifications, markNotificationRead, markAllNotificationsRead,
  type AppNotification, type NotificationUserType,
} from '../../lib/notifications';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

interface NotificationBellProps {
  userType: NotificationUserType;
  userId:   number;
  dark?:    boolean;   // true when placed on a dark surface (e.g. mobile top bar variants)
}

export default function NotificationBell({ userType, userId, dark = false }: NotificationBellProps) {
  const [open,          setOpen]          = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loaded,        setLoaded]        = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications(userType, userId).then(data => {
      setNotifications(data);
      setLoaded(true);
    });
  }, [userType, userId]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && !loaded) {
      const data = await fetchNotifications(userType, userId);
      setNotifications(data);
      setLoaded(true);
    }
  }

  async function handleMarkRead(n: AppNotification) {
    if (n.read) return;
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    await markNotificationRead(n.id);
  }

  async function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await markAllNotificationsRead(userType, userId);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className={`relative p-1.5 rounded-lg transition-colors ${
          dark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
        }`}
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-h-96 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 shrink-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-[10px] font-black text-blue-500 hover:text-blue-700 transition-colors">
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-8">No notifications yet.</p>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleMarkRead(n)}
                  className={`w-full text-left px-4 py-3 border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                    <div className={`flex-1 min-w-0 ${n.read ? 'ml-3.5' : ''}`}>
                      <p className="text-[12px] font-black text-stone-900">{n.title}</p>
                      {n.body && <p className="text-[11px] text-stone-500 mt-0.5">{n.body}</p>}
                      <p className="text-[10px] text-stone-300 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
