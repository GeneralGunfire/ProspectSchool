import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, ClipboardList, Megaphone, CheckCircle2, Circle, ChevronRight, Pin } from 'lucide-react';
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
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl w-full space-y-4 md:space-y-5">

      {/* Greeting */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Dashboard</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome, {session.name}.
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {session.school_name} · Grade {session.grade}{session.cohort_name ? ` ${session.cohort_name}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

        {/* ── Pending Homework ─────────────────────────────── */}
        <Section
          icon={<Circle className="w-4 h-4" />}
          title="Pending Homework"
          linkLabel="View calendar"
          onLink={() => onNavigate('calendar')}
          accent="blue"
        >
          {pendingHomework.length === 0 ? (
            <div className="flex items-center gap-2 py-3 text-sm text-slate-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              All caught up!
            </div>
          ) : (
            <div className="space-y-1">
              {pendingHomework.map((ev, i) => {
                const toggling = togglingId === ev.id;
                const done = completions.has(ev.id);
                return (
                  <motion.div key={ev.id}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 py-2">
                    <button
                      onClick={() => handleToggleDone(ev)}
                      disabled={toggling}
                      className="shrink-0 disabled:opacity-40 transition-colors"
                    >
                      {done
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        : <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {ev.title}
                      </p>
                      <p className="text-[11px] text-slate-400">{formatDate(ev.event_date)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── Upcoming Events ──────────────────────────────── */}
        <Section
          icon={<CalendarDays className="w-4 h-4" />}
          title="Coming Up"
          linkLabel="View calendar"
          onLink={() => onNavigate('calendar')}
          accent="slate"
        >
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold py-3">Nothing scheduled.</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((ev, i) => {
                const c = EVENT_COLORS[ev.event_type];
                return (
                  <motion.div key={ev.id}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 py-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{ev.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                          {EVENT_LABELS[ev.event_type]}
                        </span>
                        <span className="text-[11px] text-slate-400">{formatDate(ev.event_date)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── Recent Marks ─────────────────────────────────── */}
        <Section
          icon={<ClipboardList className="w-4 h-4" />}
          title="Recent Marks"
          linkLabel="View all marks"
          onLink={() => onNavigate('marks')}
          accent="slate"
        >
          {recentMarks.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold py-3">No marks yet.</p>
          ) : (
            <div className="space-y-2">
              {recentMarks.map((r, i) => {
                const pct = Math.round((r.mark! / r.total) * 100);
                const g = gradeLabel(r.mark!, r.total);
                return (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 py-1.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{r.title}</p>
                      <p className="text-[11px] text-slate-400">{r.subject_label}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-slate-900">{r.mark}/{r.total}</p>
                      <p className={`text-[11px] font-black ${g.color}`}>{pct}%</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── Announcements ────────────────────────────────── */}
        <Section
          icon={<Megaphone className="w-4 h-4" />}
          title="Announcements"
          linkLabel="View all"
          onLink={() => onNavigate('announcements')}
          accent="amber"
        >
          {announcements.length === 0 ? (
            <p className="text-sm text-slate-400 font-bold py-3">No announcements.</p>
          ) : (
            <div className="space-y-2">
              {announcements.map((a, i) => (
                <motion.div key={a.id}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="py-1.5">
                  <div className="flex items-start gap-2">
                    {a.pinned && <Pin className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{a.title}</p>
                      {a.body && <p className="text-xs text-slate-500 truncate">{a.body}</p>}
                      <p className="text-[10px] text-slate-300 mt-0.5">{timeAgo(a.created_at)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────

const accentMap = {
  blue:  'text-blue-600',
  slate: 'text-slate-600',
  amber: 'text-amber-600',
  green: 'text-emerald-600',
};

function Section({ icon, title, linkLabel, onLink, accent = 'slate', children }: {
  icon: React.ReactNode;
  title: string;
  linkLabel: string;
  onLink: () => void;
  accent?: keyof typeof accentMap;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest ${accentMap[accent]}`}>
          {icon}{title}
        </div>
        <button onClick={onLink}
          className="flex items-center gap-0.5 text-[11px] font-black text-slate-400 hover:text-slate-700 transition-colors">
          {linkLabel}<ChevronRight className="w-3 h-3" />
        </button>
      </div>
      {children}
    </motion.div>
  );
}
