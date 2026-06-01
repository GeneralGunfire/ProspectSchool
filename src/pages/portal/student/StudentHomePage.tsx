import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarDays, ClipboardList, Megaphone, CheckCircle2, Circle,
  ChevronRight, Pin, BookOpen, TrendingUp,
} from 'lucide-react';
import { fetchStudentAnnouncements, type Announcement } from '../../../lib/announcements';
import {
  fetchStudentEvents, fetchStudentCompletions, markHomeworkDone, unmarkHomeworkDone,
  EVENT_COLORS, EVENT_LABELS, type SchoolEvent,
} from '../../../lib/events';
import { fetchStudentResults, type StudentResult } from '../../../lib/marks';
import { supabaseAdmin } from '../../../lib/supabase';
import type { StudentSession } from '../../../lib/auth';

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

function formatDate(d: string) {
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
}

function gradeLabel(mark: number, total: number) {
  const p = (mark / total) * 100;
  if (p >= 80) return { label: 'Outstanding', color: 'text-emerald-600' };
  if (p >= 70) return { label: 'Merit',       color: 'text-blue-600' };
  if (p >= 60) return { label: 'Adequate',    color: 'text-sky-600' };
  if (p >= 50) return { label: 'Moderate',    color: 'text-amber-600' };
  if (p >= 40) return { label: 'Elementary',  color: 'text-orange-600' };
  return               { label: 'Not Achieved', color: 'text-red-600' };
}

// Subject icon map by keyword
function subjectIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('math'))    return '∑';
  if (l.includes('english')) return 'A';
  if (l.includes('sci'))     return '⚗';
  if (l.includes('hist'))    return '★';
  if (l.includes('geo'))     return '◉';
  if (l.includes('acc'))     return '$';
  if (l.includes('biz') || l.includes('bus')) return '◈';
  return '◆';
}

interface StudentHomePageProps {
  session: StudentSession;
  onNavigate: (page: string) => void;
}

export default function StudentHomePage({ session, onNavigate }: StudentHomePageProps) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [pendingHomework, setPendingHomework] = useState<SchoolEvent[]>([]);
  const [recentMarks, setRecentMarks] = useState<StudentResult[]>([]);
  const [completions, setCompletions] = useState<Set<number>>(new Set());
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Get subject IDs
      const { data: links } = await supabaseAdmin
        .from('teacher_students')
        .select('subject_id')
        .eq('student_id', session.student_id);
      const subjectIds = [...new Set((links ?? []).map((r: any) => r.subject_id as number))];

      const [announcs, events, comps, marks] = await Promise.all([
        fetchStudentAnnouncements(session.school_id, session.student_id, session.grade, session.cohort_id, subjectIds),
        fetchStudentEvents(session.school_id, session.student_id, session.grade, session.cohort_id, subjectIds, today.getFullYear(), today.getMonth() + 1),
        fetchStudentCompletions(session.student_id, session.school_id),
        fetchStudentResults(session.student_id, session.school_id),
      ]);

      setAnnouncements(announcs.slice(0, 3));
      setCompletions(comps);

      // Upcoming: next 3 events from today onwards
      const upcoming = events
        .filter(e => e.event_date >= todayStr)
        .slice(0, 3);
      setUpcomingEvents(upcoming);

      // Pending homework: homework events from today onwards not yet done
      const pending = events
        .filter(e => e.event_type === 'homework' && e.event_date >= todayStr && !comps.has(e.id))
        .slice(0, 5);
      setPendingHomework(pending);

      // Recent marks: last 3 marked results
      setRecentMarks(marks.filter(m => m.mark !== null).slice(0, 3));

      setLoading(false);
    }
    load();
  }, []);

  async function handleToggleDone(ev: SchoolEvent) {
    setTogglingId(ev.id);
    const done = completions.has(ev.id);
    if (done) {
      await unmarkHomeworkDone(ev.id, session.student_id);
      setCompletions(prev => { const s = new Set(prev); s.delete(ev.id); return s; });
      setPendingHomework(prev => [...prev, ev].sort((a, b) => a.event_date.localeCompare(b.event_date)));
    } else {
      await markHomeworkDone(ev.id, session.student_id, session.school_id);
      setCompletions(prev => new Set(prev).add(ev.id));
      setPendingHomework(prev => prev.filter(e => e.id !== ev.id));
    }
    setTogglingId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1C1917] rounded-full animate-spin" />
      </div>
    );
  }

  // Subject progress — group marks by subject
  const subjectMap = new Map<string, { total: number; sum: number; count: number }>();
  for (const m of recentMarks) {
    if (m.mark === null) continue;
    const key = m.subject_label ?? 'Other';
    const existing = subjectMap.get(key) ?? { total: 0, sum: 0, count: 0 };
    subjectMap.set(key, {
      total: existing.total + m.total,
      sum: existing.sum + m.mark,
      count: existing.count + 1,
    });
  }
  const subjectProgress = Array.from(subjectMap.entries()).map(([label, d]) => ({
    label,
    pct: Math.round((d.sum / d.total) * 100),
  }));

  const avgMark = recentMarks.length > 0
    ? Math.round(recentMarks.reduce((acc, m) => acc + (m.mark! / m.total) * 100, 0) / recentMarks.length)
    : null;

  // Recent activity: combine marks + announcements sorted by recency (max 5)
  type ActivityItem =
    | { kind: 'mark'; data: StudentResult; ts: string }
    | { kind: 'announcement'; data: Announcement; ts: string };

  const activity: ActivityItem[] = [
    ...recentMarks.map(m => ({ kind: 'mark' as const, data: m, ts: m.created_at ?? '' })),
    ...announcements.map(a => ({ kind: 'announcement' as const, data: a, ts: a.created_at })),
  ]
    .filter(x => x.ts)
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 5);

  // Week strip (Sun–Sat of current week)
  const weekDays: { label: string; num: number; dateStr: string; isToday: boolean }[] = [];
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    weekDays.push({
      label: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i],
      num: d.getDate(),
      dateStr: ds,
      isToday: ds === todayStr,
    });
  }

  const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

  return (
    <div className="p-5 md:p-8 max-w-6xl w-full pb-20 md:pb-8">

      {/* ── Page header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mb-6 md:mb-8"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Dashboard</p>
        <h1 className="font-display font-black text-[#1C1917] text-2xl md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Welcome back, {session.name}.
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          {session.school_name} · Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
        </p>
      </motion.div>

      {/* ── 4 stat cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

        {/* Card 1 — Upcoming Event (dark) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.04 }}
          className="bg-[#1C1917] rounded-2xl p-5 flex flex-col justify-between min-h-[130px]"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Upcoming Event</p>
          {upcomingEvents[0] ? (() => {
            const ev = upcomingEvents[0];
            const typeColors: Record<string, string> = {
              homework: 'bg-blue-500/20 text-blue-300',
              assessment: 'bg-emerald-500/20 text-emerald-300',
              exam: 'bg-red-500/20 text-red-300',
              other: 'bg-stone-500/20 text-stone-400',
            };
            return (
              <>
                <span className={`self-start text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${typeColors[ev.event_type] ?? typeColors.other}`}>
                  {EVENT_LABELS[ev.event_type]}
                </span>
                <div>
                  <p className="font-black text-white text-lg leading-tight mt-2 mb-1">{ev.title}</p>
                  <p className="text-stone-500 text-xs">{formatDate(ev.event_date)}</p>
                </div>
                <button onClick={() => onNavigate('calendar')}
                  className="self-start mt-2 text-[11px] font-black text-white/50 hover:text-white transition-colors border border-stone-700 rounded-lg px-2.5 py-1">
                  View in Calendar
                </button>
              </>
            );
          })() : (
            <p className="text-stone-600 text-sm font-bold mt-auto">No upcoming events</p>
          )}
        </motion.div>

        {/* Card 2 — Pending Homework */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.08 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between min-h-[130px] hover:border-stone-300 transition-colors"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Pending Homework</p>
          {pendingHomework.length === 0 ? (
            <div>
              <p className="font-black text-4xl text-[#1C1917]">0</p>
              <p className="text-emerald-600 font-bold text-xs mt-1">All caught up</p>
            </div>
          ) : (
            <div>
              <p className="font-black text-4xl text-[#1C1917]">{pendingHomework.length}</p>
              <p className="text-stone-400 text-sm mt-0.5">tasks due this week</p>
            </div>
          )}
          <button onClick={() => onNavigate('calendar')}
            className="self-start text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors mt-2">
            View Homework
          </button>
        </motion.div>

        {/* Card 3 — Average Mark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.12 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between min-h-[130px] hover:border-stone-300 transition-colors"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Average Mark</p>
          {avgMark !== null ? (
            <div>
              <p className="font-black text-4xl text-[#1C1917]">{avgMark}%</p>
              <p className="text-stone-400 text-sm mt-0.5">{gradeLabel(avgMark, 100).label}</p>
            </div>
          ) : (
            <p className="text-stone-400 font-bold text-sm mt-auto">No marks yet</p>
          )}
          <button onClick={() => onNavigate('marks')}
            className="self-start text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors mt-2">
            View Marks
          </button>
        </motion.div>

        {/* Card 4 — Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.16 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between min-h-[130px] hover:border-stone-300 transition-colors"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Announcements</p>
          {announcements.length === 0 ? (
            <p className="text-stone-400 font-bold text-sm mt-auto">No announcements</p>
          ) : (
            <div>
              <p className="font-black text-4xl text-[#1C1917]">{announcements.length}</p>
              <p className="text-stone-400 text-sm mt-0.5">new announcements</p>
            </div>
          )}
          <button onClick={() => onNavigate('announcements')}
            className="self-start text-[11px] font-black text-amber-600 hover:text-amber-800 transition-colors mt-2">
            View All
          </button>
        </motion.div>
      </div>

      {/* ── Two-column grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* LEFT — Calendar Overview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          className="bg-white rounded-2xl border border-stone-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Calendar Overview</p>
            <button onClick={() => onNavigate('calendar')}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors font-bold flex items-center gap-0.5">
              Go to Calendar <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Week strip */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <div key={day.dateStr} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-wide text-stone-400">{day.label}</span>
                <span className={`w-7 h-7 flex items-center justify-center text-xs font-black rounded-full transition-colors ${
                  day.isToday ? 'bg-[#1C1917] text-white' : 'text-stone-500'
                }`}>
                  {day.num}
                </span>
              </div>
            ))}
          </div>

          {/* Next 3 upcoming events */}
          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <div className="flex items-center gap-2 py-3">
                <CalendarDays className="w-8 h-8 text-stone-200" />
                <p className="text-sm font-bold text-stone-300">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map((ev, i) => {
                const c = EVENT_COLORS[ev.event_type];
                const typeStyle: Record<string, string> = {
                  homework: 'bg-blue-50 text-blue-700',
                  assessment: 'bg-emerald-50 text-emerald-700',
                  exam: 'bg-red-50 text-red-700',
                  other: 'bg-stone-100 text-stone-600',
                };
                return (
                  <motion.div key={ev.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                    className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                    <p className="flex-1 text-sm font-bold text-stone-900 truncate">{ev.title}</p>
                    <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${typeStyle[ev.event_type]}`}>
                      {EVENT_LABELS[ev.event_type]}
                    </span>
                    <span className="text-xs text-stone-400 shrink-0">{formatDate(ev.event_date)}</span>
                  </motion.div>
                );
              })
            )}
          </div>

          <button onClick={() => onNavigate('calendar')}
            className="w-full mt-4 text-center text-xs text-stone-400 hover:text-stone-600 font-bold transition-colors">
            View full calendar
          </button>
        </motion.div>

        {/* RIGHT — Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.24 }}
          className="bg-white rounded-2xl border border-stone-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Recent Activity</p>
            <button onClick={() => onNavigate('marks')}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors font-bold flex items-center gap-0.5">
              View all activity <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {activity.length === 0 ? (
            <div className="flex items-center gap-2 py-3">
              <TrendingUp className="w-8 h-8 text-stone-200" />
              <p className="text-sm font-bold text-stone-300">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                  className="flex items-start gap-3">
                  {item.kind === 'mark' ? (
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4 text-amber-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {item.kind === 'mark' ? (
                      <>
                        <p className="text-sm font-bold text-stone-900 truncate">
                          {item.data.subject_label}: {item.data.mark}/{item.data.total}
                        </p>
                        <p className="text-xs text-stone-400">
                          Marked · {Math.round((item.data.mark! / item.data.total) * 100)}%
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-stone-900 truncate">{item.data.title}</p>
                        <p className="text-xs text-stone-400">{timeAgo(item.ts)}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Subject Progress ────────────────────────────────────── */}
      {subjectProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.28 }}
          className="bg-white rounded-2xl border border-stone-200 p-5 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Subject Progress</p>
            <button onClick={() => onNavigate('marks')}
              className="text-xs text-stone-400 hover:text-stone-600 font-bold transition-colors flex items-center gap-0.5">
              View My Marks <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-1" style={{ minWidth: 'max-content' }}>
              {subjectProgress.map(s => (
                <div key={s.label} className="min-w-[140px] bg-stone-50 rounded-xl p-4">
                  <div className="w-7 h-7 bg-[#1C1917] text-white rounded-lg flex items-center justify-center text-xs font-black">
                    {subjectIcon(s.label)}
                  </div>
                  <p className="font-black text-sm text-stone-900 mt-3 mb-1">{s.label}</p>
                  <p className="font-black text-xl text-[#1C1917] mb-2">{s.pct}%</p>
                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1C1917] rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Pending Homework list ───────────────────────────────── */}
      {pendingHomework.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.32 }}
          className="bg-white rounded-2xl border border-stone-200 p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-4">Pending Homework</p>
          <div className="space-y-1">
            {pendingHomework.map((ev, i) => {
              const toggling = togglingId === ev.id;
              const done = completions.has(ev.id);
              return (
                <motion.div key={ev.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2">
                  <button
                    onClick={() => handleToggleDone(ev)}
                    disabled={toggling}
                    className="shrink-0 disabled:opacity-40 transition-colors"
                  >
                    {done
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      : <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                    }
                  </button>
                  <p className={`flex-1 text-sm font-bold truncate ${done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                    {ev.title}
                  </p>
                  <span className="text-xs text-stone-400 shrink-0">{formatDate(ev.event_date)}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
