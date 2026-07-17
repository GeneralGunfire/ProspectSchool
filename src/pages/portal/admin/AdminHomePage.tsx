import { useEffect, useState } from 'react';
import {
  Users, GraduationCap, Megaphone, ChevronRight, Settings,
} from 'lucide-react';
import { motion } from 'motion/react';
import { fetchSchoolTeachers } from '../../../lib/teachers';
import { fetchAnnouncements } from '../../../lib/announcements';
import type { AdminSession } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';
import { Shimmer } from '../../../shared/components/Shimmer';

interface AdminHomePageProps {
  session: AdminSession;
  onNavigate: (page: string) => void;
}

interface Stats {
  teachers: number;
  students: number;
  announcements: number;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function AdminHomePage({ session, onNavigate }: AdminHomePageProps) {
  const [stats, setStats] = useState<Stats>({ teachers: 0, students: 0, announcements: 0 });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!session.school_id) return;
    (async () => {
      try {
        const [teachers, announcs] = await Promise.all([
          fetchSchoolTeachers(session.school_id!),
          fetchAnnouncements(session.school_id!),
        ]);
        const { count: studentCount } = await supabaseAdmin
          .from('students')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', session.school_id);

        setStats({
          teachers: teachers.length,
          students: studentCount ?? 0,
          announcements: announcs.length,
        });
        setAnnouncements(announcs.slice(0, 5));
      } catch (_) {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [session.school_id]);

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-emblem.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0) 0%, transparent 45%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Dashboard</p>
          <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
            style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
            Welcome back, {session.name}.
          </h1>
          <p className="text-[11px] text-white/60 mt-1.5 font-medium">{session.school_name}</p>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {/* ── 3 stat cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: 'Total Students',
            value: loading ? '—' : stats.students,
            sub: 'across all grades',
            delay: 0.04,
          },
          {
            label: 'Total Teachers',
            value: loading ? '—' : stats.teachers,
            sub: 'active educators',
            delay: 0.08,
          },
          {
            label: 'Your School',
            value: session.school_name,
            sub: 'administrator view',
            delay: 0.12,
            isText: true,
          },
        ].map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: card.delay }}
            className="paper-card rounded p-5"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">{card.label}</p>
            <p className={`font-black text-brand-dark ${card.isText ? 'text-lg leading-tight' : 'text-4xl'}`}>
              {card.value}
            </p>
            <p className="text-sm text-stone-500 mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Two-column grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT — Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.16 }}
          className="paper-card rounded p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">Quick Actions</p>
          <div className="space-y-2">
            {[
              {
                title: 'Manage Teachers',
                description: 'Add, edit, or remove teacher accounts',
                icon: GraduationCap,
                page: 'teachers',
              },
              {
                title: 'Post Announcement',
                description: 'Broadcast a message to all students',
                icon: Megaphone,
                page: 'announcements',
              },
              {
                title: 'View Students',
                description: 'Browse and manage enrolled students',
                icon: Users,
                page: 'students',
              },
              {
                title: 'Settings',
                description: 'School profile and configuration',
                icon: Settings,
                page: 'settings',
              },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.page}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.16 + i * 0.04 }}
                  onClick={() => onNavigate(action.page)}
                  className="paper-card w-full flex items-start gap-4 p-4 rounded cursor-pointer text-left group"
                >
                  <div className="w-9 h-9 bg-brand-dark text-white rounded flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-brand-dark">{action.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{action.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors mt-0.5 shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT — Recent Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Recent Announcements</p>
            <button onClick={() => onNavigate('announcements')}
              className="text-xs text-stone-500 hover:text-stone-600 font-bold transition-colors flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Shimmer className="h-3 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex items-center gap-2 py-4">
              <Megaphone className="w-8 h-8 text-stone-200" />
              <p className="text-sm font-bold text-stone-400">No announcements yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <motion.div key={a.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                  className="flex items-start gap-3 py-2 border-b border-brand-border/60 last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate">{a.title}</p>
                    {a.body && <p className="text-xs text-stone-500 truncate mt-0.5">{a.body}</p>}
                  </div>
                  <span className="text-[11px] text-stone-400 shrink-0">{timeAgo(a.created_at)}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Post announcement CTA */}
          <button
            onClick={() => onNavigate('announcements')}
            className="w-full mt-4 py-2.5 rounded bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors"
          >
            Post New Announcement
          </button>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
