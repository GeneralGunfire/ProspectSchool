import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, CalendarDays, ClipboardList, CheckCircle2,
  ChevronRight, Megaphone, BookOpen, Plus,
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

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const EVENT_TYPE_PILL: Record<string, string> = {
  homework:   'bg-blue-50 text-blue-700',
  assessment: 'bg-emerald-50 text-emerald-700',
  exam:       'bg-red-50 text-red-700',
  other:      'bg-stone-100 text-stone-600',
};
const EVENT_DOT: Record<string, string> = {
  homework:   'bg-blue-500',
  assessment: 'bg-emerald-500',
  exam:       'bg-red-500',
  other:      'bg-stone-400',
};

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
        <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1C1917] rounded-full animate-spin" />
      </div>
    );
  }

  const nextEvent = upcomingEvents[0] ?? null;

  return (
    <div className="p-5 md:p-8 max-w-6xl w-full pb-20 md:pb-8">

      {/* ── Page header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mb-6 md:mb-8"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Overview</p>
        <h1 className="font-display font-black text-[#1C1917] text-2xl md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Welcome back, {session.name}.
        </h1>
        <p className="text-sm text-stone-400 mt-1">{session.school_name}</p>
      </motion.div>

      {/* ── 4 stat cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

        {/* Card 1 — Next Event (dark) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.04 }}
          className="bg-[#1C1917] rounded-2xl p-5 flex flex-col justify-between min-h-[130px]"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Next Event</p>
          {nextEvent ? (
            <>
              <span className={`self-start text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${EVENT_TYPE_PILL[nextEvent.event_type] ?? 'bg-stone-700 text-stone-300'}`}>
                {nextEvent.event_type}
              </span>
              <div className="mt-2">
                <p className="font-black text-white text-base leading-tight mb-1">{nextEvent.title}</p>
                <p className="text-stone-500 text-xs">{formatDate(nextEvent.event_date)}</p>
              </div>
              <button onClick={() => onNavigate('calendar')}
                className="self-start mt-2 text-[11px] font-black text-white/50 hover:text-white transition-colors border border-stone-700 rounded-lg px-2.5 py-1">
                View in Calendar
              </button>
            </>
          ) : (
            <p className="text-stone-600 text-sm font-bold mt-auto">No upcoming events</p>
          )}
        </motion.div>

        {/* Card 2 — Total Students */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.08 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between min-h-[130px] hover:border-stone-300 transition-colors"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">My Students</p>
          <div>
            <p className="font-black text-4xl text-[#1C1917]">{studentCount}</p>
            <p className="text-stone-400 text-sm mt-0.5">enrolled students</p>
          </div>
          <button onClick={() => onNavigate('classes')}
            className="self-start text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors mt-2 flex items-center gap-0.5">
            View Classes <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Card 3 — Pending Marks */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.12 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between min-h-[130px] hover:border-stone-300 transition-colors"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Mark Sheets</p>
          <div>
            <p className="font-black text-4xl text-[#1C1917]">
              {recentSheets.reduce((acc, g) => acc + g.sheets.length, 0)}
            </p>
            <p className="text-stone-400 text-sm mt-0.5">active sheets</p>
          </div>
          <button onClick={() => onNavigate('marks')}
            className="self-start text-[11px] font-black text-emerald-600 hover:text-emerald-800 transition-colors mt-2 flex items-center gap-0.5">
            Enter Marks <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Card 4 — Upcoming Events count */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.16 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between min-h-[130px] hover:border-stone-300 transition-colors"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Upcoming Events</p>
          <div>
            <p className="font-black text-4xl text-[#1C1917]">{upcomingEvents.length}</p>
            <p className="text-stone-400 text-sm mt-0.5">this month</p>
          </div>
          <button onClick={() => onNavigate('calendar')}
            className="self-start text-[11px] font-black text-amber-600 hover:text-amber-800 transition-colors mt-2 flex items-center gap-0.5">
            View Calendar <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      {/* ── Two-column grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT — Recent Homework Completion */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          className="bg-white rounded-2xl border border-stone-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Homework Completion</p>
            <button onClick={() => onNavigate('calendar')}
              className="text-xs text-stone-400 hover:text-stone-600 font-bold transition-colors flex items-center gap-0.5">
              View Calendar <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {homeworkStats.length === 0 ? (
            <div className="flex items-center gap-2 py-4">
              <CheckCircle2 className="w-8 h-8 text-stone-200" />
              <p className="text-sm font-bold text-stone-300">No recent homework events.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {homeworkStats.map((stat, i) => {
                const pct = stat.totalStudents > 0
                  ? Math.round((stat.completionCount / stat.totalStudents) * 100)
                  : 0;
                const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';
                return (
                  <motion.div key={stat.event.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-bold text-stone-900 truncate flex-1 pr-2">{stat.event.title}</p>
                      <span className="text-xs font-black text-stone-500 shrink-0">
                        {stat.completionCount}/{stat.totalStudents}
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${barColor}`}
                      />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">{formatDate(stat.event.event_date)} · {pct}% submitted</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* RIGHT — Recent Mark Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.24 }}
          className="bg-white rounded-2xl border border-stone-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Recent Mark Sheets</p>
            <button onClick={() => onNavigate('marks')}
              className="text-xs text-stone-400 hover:text-stone-600 font-bold transition-colors flex items-center gap-0.5">
              View Marks <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {recentSheets.length === 0 ? (
            <div className="flex items-center gap-2 py-4">
              <ClipboardList className="w-8 h-8 text-stone-200" />
              <p className="text-sm font-bold text-stone-300">No mark sheets yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSheets.map((group, i) => (
                <motion.div key={group.key}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1C1917] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-stone-900">{group.subject_label}</p>
                    <p className="text-xs text-stone-400">
                      Grade {group.grade} · {group.sheets.length} sheet{group.sheets.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0 truncate max-w-[100px]">
                    {group.sheets[0]?.title}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick actions row */}
          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2">
            {[
              { label: 'Add student',    page: 'classes',      icon: Users },
              { label: 'Post announcement', page: 'announcements', icon: Megaphone },
              { label: 'Create event',   page: 'calendar',     icon: CalendarDays },
              { label: 'Enter marks',    page: 'marks',        icon: ClipboardList },
            ].map(action => {
              const Icon = action.icon;
              return (
                <button key={action.page} onClick={() => onNavigate(action.page)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors text-left">
                  <Icon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-xs font-black text-stone-700">{action.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events strip */}
        {upcomingEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.28 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Upcoming Events</p>
              <button onClick={() => onNavigate('calendar')}
                className="flex items-center gap-1 text-xs font-black text-stone-400 hover:text-stone-600 transition-colors">
                <Plus className="w-3 h-3" /> Create Event
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {upcomingEvents.map((ev, i) => (
                <motion.div key={ev.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${EVENT_DOT[ev.event_type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">{ev.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{formatDate(ev.event_date)}</p>
                    <span className={`inline-block mt-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${EVENT_TYPE_PILL[ev.event_type]}`}>
                      {ev.event_type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
