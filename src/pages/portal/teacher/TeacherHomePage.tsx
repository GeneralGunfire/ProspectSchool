import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, CalendarDays, ClipboardList, CheckCircle2,
  Clock, ChevronRight, AlertCircle,
} from 'lucide-react';
import { supabaseAdmin } from '../../../lib/supabase';
import { fetchSchoolEvents, fetchHomeworkCompletionCount, type SchoolEvent } from '../../../lib/events';
import { fetchTeacherStudents } from '../../../lib/students';
import { fetchTeacherMarkSheets, type MarkSheetGroup } from '../../../lib/marks';
import type { TeacherSession } from '../../../lib/auth';

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
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

interface HomeworkStat {
  event: SchoolEvent;
  completionCount: number;
  totalStudents: number;
}

interface TeacherHomePageProps {
  session: TeacherSession;
  onNavigate: (page: string) => void;
}

export default function TeacherHomePage({ session, onNavigate }: TeacherHomePageProps) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [studentCount, setStudentCount]   = useState<number>(0);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [homeworkStats, setHomeworkStats]  = useState<HomeworkStat[]>([]);
  const [recentSheets, setRecentSheets]   = useState<MarkSheetGroup[]>([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    async function load() {
      const [studentsResult, events, sheetsResult] = await Promise.all([
        fetchTeacherStudents(session.teacher_id, session.school_id),
        fetchSchoolEvents(session.school_id),
        fetchTeacherMarkSheets(session.teacher_id, session.school_id),
      ]);

      // Student count
      if (studentsResult.success) setStudentCount(studentsResult.students.length);

      // Upcoming events — next 4 from today
      const upcoming = events
        .filter(e => e.event_date >= todayStr)
        .slice(0, 4);
      setUpcomingEvents(upcoming);

      // Recent homework events (past 14 days) — fetch completion counts
      const cutoff = new Date(today);
      cutoff.setDate(cutoff.getDate() - 14);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const recentHomework = events
        .filter(e => e.event_type === 'homework' && e.event_date >= cutoffStr && e.event_date <= todayStr)
        .slice(0, 4);

      // Get total students per event based on target_type
      const allStudents = studentsResult.success ? studentsResult.students : [];

      const stats = await Promise.all(
        recentHomework.map(async ev => {
          const completionCount = await fetchHomeworkCompletionCount(ev.id);

          // Estimate total targeted students
          let totalStudents = allStudents.length;
          if (ev.target_type === 'grade') {
            totalStudents = allStudents.filter(s => ev.target_grades?.includes(s.grade)).length;
          } else if (ev.target_type === 'class') {
            totalStudents = allStudents.filter(s => s.cohort_id !== null && ev.target_cohort_ids?.includes(s.cohort_id!)).length;
          } else if (ev.target_type === 'specific') {
            totalStudents = ev.target_student_ids?.length ?? 0;
          }

          return { event: ev, completionCount, totalStudents };
        })
      );
      setHomeworkStats(stats);

      // Recent mark sheets — last 3
      setRecentSheets(sheetsResult.slice(0, 3));

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-6xl w-full space-y-5">

      {/* Greeting */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Overview</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome back, {session.name}.
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">{session.school_name}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="My Students"
          value={String(studentCount)}
          onClick={() => onNavigate('classes')}
        />
        <StatCard
          icon={<CalendarDays className="w-4 h-4" />}
          label="Upcoming Events"
          value={String(upcomingEvents.length)}
          onClick={() => onNavigate('calendar')}
        />
        <StatCard
          icon={<ClipboardList className="w-4 h-4" />}
          label="Mark Sheets"
          value={String(recentSheets.reduce((acc, g) => acc + g.sheets.length, 0))}
          onClick={() => onNavigate('marks')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Upcoming Events ──────────────────────────────── */}
        <Section title="Upcoming Events" icon={<CalendarDays className="w-4 h-4" />}
          linkLabel="View calendar" onLink={() => onNavigate('calendar')}>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold py-3">No upcoming events.</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((ev, i) => {
                const colors: Record<string, string> = {
                  homework: 'bg-blue-500', assessment: 'bg-amber-500',
                  exam: 'bg-red-500', other: 'bg-slate-400',
                };
                return (
                  <motion.div key={ev.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 py-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${colors[ev.event_type]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{ev.title}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(ev.event_date)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── Homework Completion ──────────────────────────── */}
        <Section title="Recent Homework" icon={<CheckCircle2 className="w-4 h-4" />}
          linkLabel="View calendar" onLink={() => onNavigate('calendar')}>
          {homeworkStats.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold py-3">No recent homework events.</p>
          ) : (
            <div className="space-y-3">
              {homeworkStats.map((stat, i) => {
                const pct = stat.totalStudents > 0
                  ? Math.round((stat.completionCount / stat.totalStudents) * 100)
                  : 0;
                const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';
                return (
                  <motion.div key={stat.event.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate flex-1 pr-2">{stat.event.title}</p>
                      <span className="text-xs font-black text-slate-500 shrink-0">
                        {stat.completionCount}/{stat.totalStudents}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${barColor}`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(stat.event.event_date)} · {pct}% submitted</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── Recent Mark Sheets ───────────────────────────── */}
        <Section title="Recent Mark Sheets" icon={<ClipboardList className="w-4 h-4" />}
          linkLabel="View marks" onLink={() => onNavigate('marks')}>
          {recentSheets.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold py-3">No mark sheets yet.</p>
          ) : (
            <div className="space-y-2">
              {recentSheets.map((group, i) => (
                <motion.div key={group.key} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 py-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{group.subject_label}</p>
                    <p className="text-[11px] text-slate-400">
                      Grade {group.grade} · {group.sheets.length} sheet{group.sheets.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-xs font-black text-slate-400 shrink-0">
                    {group.sheets[0]?.title}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        {/* ── Quick actions ────────────────────────────────── */}
        <Section title="Quick Actions" icon={<Clock className="w-4 h-4" />}
          linkLabel="" onLink={() => {}}>
          <div className="space-y-2 pt-1">
            {[
              { label: 'Add a student',        sub: 'Classes',   page: 'classes' },
              { label: 'Post an announcement', sub: 'Announcements', page: 'announcements' },
              { label: 'Create an event',      sub: 'Calendar',  page: 'calendar' },
              { label: 'Enter marks',          sub: 'Marks',     page: 'marks' },
            ].map(action => (
              <button key={action.page} onClick={() => onNavigate(action.page)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">{action.label}</p>
                  <p className="text-[11px] text-slate-400">{action.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </button>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────

function StatCard({ icon, label, value, onClick }: {
  icon: React.ReactNode; label: string; value: string; onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 p-5 text-left w-full transition-shadow hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-slate-400 mb-2">{icon}</div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-xs font-bold text-slate-400 mt-0.5">{label}</p>
    </motion.button>
  );
}

// ── Section card ──────────────────────────────────────────────

function Section({ title, icon, linkLabel, onLink, children }: {
  title: string; icon: React.ReactNode;
  linkLabel: string; onLink: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
          {icon}{title}
        </div>
        {linkLabel && (
          <button onClick={onLink}
            className="flex items-center gap-0.5 text-[11px] font-black text-slate-400 hover:text-slate-700 transition-colors">
            {linkLabel}<ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}
