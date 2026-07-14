import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
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
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={handleOpen}
        className={`relative w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${
          dark
            ? 'border-white/15 text-white/70 hover:text-white hover:bg-white/10'
            : open
              ? 'border-brand-border bg-brand-bg text-brand-dark'
              : 'border-brand-border text-stone-400 hover:text-brand-dark hover:bg-brand-bg'
        }`}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" strokeWidth={2.25} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2"
            style={{ borderColor: dark ? 'transparent' : '#fdfcfa' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-0 mt-2 w-80 max-h-96 flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)',
            border: '1px solid var(--color-brand-border)',
            boxShadow: '0 1px 2px rgba(15,18,15,0.10), 0 10px 24px -6px rgba(15,18,15,0.20), 0 32px 56px -20px rgba(15,18,15,0.28)',
            zIndex: 100,
          }}
        >
          <div className="flex items-center justify-between px-4 py-3.5 border-b shrink-0" style={{ borderColor: 'var(--color-brand-border)' }}>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-[11px] font-bold transition-colors" style={{ color: 'var(--color-accent)' }}>
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 py-10 px-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-paper-raise)' }}>
                  <Bell className="w-4.5 h-4.5 text-stone-300" />
                </div>
                <p className="text-[13px] font-semibold text-stone-400 text-center">You're all caught up.<br />New notifications will land here.</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleMarkRead(n)}
                  className="w-full text-left px-4 py-3 border-b last:border-0 transition-colors hover:bg-(--color-paper-raise)"
                  style={{ borderColor: 'var(--color-brand-border)', background: !n.read ? 'color-mix(in srgb, var(--color-accent) 5%, transparent)' : undefined }}
                >
                  <div className="flex items-start gap-2.5">
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--color-accent)' }} />}
                    <div className={`flex-1 min-w-0 ${n.read ? 'ml-4' : ''}`}>
                      <p className="text-[13px] font-bold text-brand-dark leading-snug">{n.title}</p>
                      {n.body && <p className="text-[12px] text-[rgba(31,36,33,0.5)] mt-0.5 leading-snug">{n.body}</p>}
                      <p className="text-[10px] font-semibold text-[rgba(31,36,33,0.35)] mt-1 uppercase tracking-wide">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
