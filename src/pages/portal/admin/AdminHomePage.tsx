import { useEffect, useState } from 'react';
import {
  Users, GraduationCap, Megaphone, ChevronRight, ListChecks, ShieldAlert, ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { fetchSchoolTeachers } from '../../../lib/teachers';
import { fetchAnnouncements } from '../../../lib/announcements';
import { fetchAdminSelections } from '../../../lib/subjectSelection';
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
  openSafetyFlags: number;
  pendingSelections: number;
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

function currentIntakeYear(): number {
  return new Date().getFullYear() + 1;
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function AdminHomePage({ session, onNavigate }: AdminHomePageProps) {
  const [stats, setStats] = useState<Stats>({ teachers: 0, students: 0, openSafetyFlags: 0, pendingSelections: 0 });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session.school_id) return;
    (async () => {
      try {
        const [teachers, announcs, pendingSelections] = await Promise.all([
          fetchSchoolTeachers(session.school_id!),
          fetchAnnouncements(session.school_id!),
          fetchAdminSelections(session.school_id!, currentIntakeYear()),
        ]);
        const { count: studentCount } = await supabaseAdmin
          .from('students')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', session.school_id);

        const { data: schoolStudents } = await supabaseAdmin
          .from('students')
          .select('id')
          .eq('school_id', session.school_id);
        const studentIds = (schoolStudents ?? []).map(s => s.id);

        let openSafetyFlags = 0;
        if (studentIds.length > 0) {
          const { count } = await supabaseAdmin
            .from('wellbeing_safety_flags')
            .select('id', { count: 'exact', head: true })
            .in('student_id', studentIds)
            .is('acknowledged_at', null);
          openSafetyFlags = count ?? 0;
        }

        setStats({
          teachers: teachers.length,
          students: studentCount ?? 0,
          openSafetyFlags,
          pendingSelections: pendingSelections.filter(s => s.status === 'teacher_approved').length,
        });
        setAnnouncements(announcs.slice(0, 5));
      } catch (_) {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [session.school_id]);

  const heroDate = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  })();

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">
            {session.school_name} · {heroDate}
          </p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                {greeting}, {session.name}.
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </motion.div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {/* ── Attention-needed banner ─────────────────────────────── */}
      {!loading && (stats.openSafetyFlags > 0 || stats.pendingSelections > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="paper-card rounded p-4 sm:p-5"
        >
          <p className="text-[15px] text-brand-dark mb-3" style={{ fontWeight: 600 }}>Needs your attention</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stats.openSafetyFlags > 0 && (
              <button
                onClick={() => onNavigate('students')}
                className="flex items-center gap-3 p-3 rounded border border-red-100 bg-red-50/60 text-left"
              >
                <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-brand-dark">
                    {stats.openSafetyFlags} unacknowledged safety flag{stats.openSafetyFlags !== 1 ? 's' : ''}
                  </span>
                  <span className="block text-xs text-stone-500">A homeroom teacher needs to acknowledge these in Wellbeing</span>
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              </button>
            )}
            {stats.pendingSelections > 0 && (
              <button
                onClick={() => onNavigate('subject-selection')}
                className="flex items-center gap-3 p-3 rounded border border-brand-border bg-sky-50/60 text-left"
              >
                <ListChecks className="w-4.5 h-4.5 shrink-0" style={{ color: 'var(--color-navy)' }} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-brand-dark">
                    {stats.pendingSelections} subject selection{stats.pendingSelections !== 1 ? 's' : ''} awaiting your review
                  </span>
                  <span className="block text-xs text-stone-500">Teacher-approved, ready for admin sign-off</span>
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ── stat cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: 'Total students',
            value: loading ? '—' : stats.students,
            sub: 'across all grades',
            delay: 0.04,
          },
          {
            label: 'Total teachers',
            value: loading ? '—' : stats.teachers,
            sub: 'active educators',
            delay: 0.08,
          },
          {
            label: 'Open safety flags',
            value: loading ? '—' : stats.openSafetyFlags,
            sub: stats.openSafetyFlags > 0 ? 'awaiting acknowledgement' : 'all clear',
            delay: 0.12,
          },
        ].map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: card.delay }}
            className="paper-card rounded p-5"
          >
            <p className="text-[12px] text-muted-2 mb-3">{card.label}</p>
            <p className="font-black text-brand-dark text-4xl">{card.value}</p>
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
          <p className="text-[15px] text-brand-dark mb-4" style={{ fontWeight: 600 }}>Quick actions</p>
          <div className="space-y-2">
            {[
              {
                title: 'Manage teachers',
                description: 'Add, edit, or remove teacher accounts',
                icon: GraduationCap,
                page: 'teachers',
              },
              {
                title: 'Post announcement',
                description: 'Broadcast a message to all students',
                icon: Megaphone,
                page: 'announcements',
              },
              {
                title: 'View students',
                description: 'Browse and manage enrolled students',
                icon: Users,
                page: 'students',
              },
              {
                title: 'Subject selection queue',
                description: 'Review submissions awaiting sign-off',
                icon: ListChecks,
                page: 'subject-selection',
              },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.page}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.16 + i * 0.04 }}
                  onClick={() => onNavigate(action.page)}
                  className="paper-card w-full flex items-center gap-3 p-4 rounded cursor-pointer text-left group"
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" style={{ color: 'var(--color-navy)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-dark">{action.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{action.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors shrink-0" />
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
            <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>Recent announcements</p>
            <button onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold transition-colors flex items-center gap-0.5" style={{ color: 'var(--color-navy)' }}>
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
            className="flex items-center gap-1 mt-4 text-[14px] font-semibold transition-colors"
            style={{ color: 'var(--color-navy)' }}
          >
            Post new announcement <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
