import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Calendar, List, Clock, Paperclip, X, CheckCircle2, Circle,
  Activity, ClipboardList, BookOpen, Palette,
} from 'lucide-react';
import { Shimmer } from './StudentHomePage';
import { supabaseAdmin } from '../../../lib/supabase';
import {
  fetchStudentEvents, getAttachmentDownloadUrl,
  markHomeworkDone, unmarkHomeworkDone, fetchStudentCompletions,
  EVENT_COLORS, EVENT_LABELS, type SchoolEvent,
} from '../../../lib/events';
import { fetchStudentResults, type StudentResult } from '../../../lib/marks';
import type { StudentSession } from '../../../lib/auth';
import { getStudentGoals } from '../../../lib/studentGoals';
import { computeStudentInsights } from '../../../lib/studentInsights';

// ── Helpers ───────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
function formatTime(t: string | null) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}
function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${parseInt(day)} ${MONTHS[parseInt(m)-1]} ${y}`;
}
function formatDayFull(d: string) {
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
}

const TYPE_PILL: Record<string, string> = {
  homework:   'bg-blue-50 text-blue-700',
  assessment: 'bg-emerald-50 text-emerald-700',
  exam:       'bg-red-50 text-red-700',
  other:      'bg-stone-100 text-stone-600',
};
const TYPE_CELL_BG: Record<string, string> = {
  homework:   'bg-blue-50 text-blue-700',
  assessment: 'bg-emerald-50 text-emerald-700',
  exam:       'bg-red-50 text-red-700',
  other:      'bg-stone-100 text-stone-600',
};

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentCalendarPageProps {
  session: StudentSession;
  onNavigate: (page: string) => void;
}

export default function StudentCalendarPage({ session, onNavigate }: StudentCalendarPageProps) {
  const goals = getStudentGoals(session.student_id);
  const today = new Date();
  const [year, setYear]     = useState(today.getFullYear());
  const [month, setMonth]   = useState(today.getMonth() + 1);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [monthKey, setMonthKey] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allMarks, setAllMarks] = useState<StudentResult[]>([]);

  // Homework completions
  const [completions, setCompletions] = useState<Set<number>>(new Set());
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Day panel (click a day)
  const [selectedDay, setSelectedDay]     = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [downloading, setDownloading]     = useState(false);

  const todayStr = toDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // Load student's subject IDs once
  useEffect(() => {
    supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', session.student_id)
      .then(({ data }) => {
        const ids = [...new Set((data ?? []).map((r: any) => r.subject_id as number))];
        setSubjectIds(ids);
      });
    // Load completions once
    fetchStudentCompletions(session.student_id, session.school_id)
      .then(setCompletions);
    // Load marks independently (non-blocking)
    fetchStudentResults(session.student_id, session.school_id).then(marks => {
      setAllMarks(marks.filter(m => m.mark !== null));
    });
  }, []);

  // Load events whenever month/year or subjectIds change
  useEffect(() => {
    setLoading(true);
    fetchStudentEvents(
      session.school_id,
      session.student_id,
      session.grade,
      session.cohort_id,
      subjectIds,
      year,
      month
    ).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [year, month, subjectIds]);

  // Calendar grid
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth     = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function eventsOnDay(day: number) {
    return events.filter(e => e.event_date === toDateStr(year, month, day));
  }

  function prevMonth() {
    setDirection(-1);
    setMonthKey(k => k - 1);
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    setDirection(1);
    setMonthKey(k => k + 1);
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  function handleDayClick(day: number) {
    const str = toDateStr(year, month, day);
    setSelectedDay(prev => prev === str ? null : str);
    setSelectedEvent(null);
  }

  async function handleDownload(ev: SchoolEvent) {
    if (!ev.attachment_url) return;
    setDownloading(true);
    const url = await getAttachmentDownloadUrl(ev.attachment_url);
    setDownloading(false);
    if (url) window.open(url, '_blank');
  }

  async function handleToggleDone(ev: SchoolEvent, e: React.MouseEvent) {
    e.stopPropagation();
    if (ev.event_type !== 'homework') return;
    setTogglingId(ev.id);
    const done = completions.has(ev.id);
    if (done) {
      await unmarkHomeworkDone(ev.id, session.student_id);
      setCompletions(prev => { const s = new Set(prev); s.delete(ev.id); return s; });
    } else {
      await markHomeworkDone(ev.id, session.student_id, session.school_id);
      setCompletions(prev => new Set(prev).add(ev.id));
    }
    setTogglingId(null);
  }

  const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 5);
  const dayEvents = selectedDay ? events.filter(e => e.event_date === selectedDay) : [];

  // List view: all events sorted by date
  const allSorted = [...events].sort((a, b) => a.event_date.localeCompare(b.event_date));

  // Group list events by date
  const grouped = allSorted.reduce<Record<string, SchoolEvent[]>>((acc, ev) => {
    (acc[ev.event_date] = acc[ev.event_date] ?? []).push(ev);
    return acc;
  }, {});

  // ── Derived computations for intelligence sections ────────────

  // All future events from today onwards
  const futureEvents = events.filter(e => e.event_date >= todayStr);

  // This week boundaries (Sun–Sat)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekStartStr = toDateStr(weekStart.getFullYear(), weekStart.getMonth() + 1, weekStart.getDate());
  const weekEndStr   = toDateStr(weekEnd.getFullYear(),   weekEnd.getMonth() + 1,   weekEnd.getDate());

  const thisWeekEvents      = events.filter(e => e.event_date >= weekStartStr && e.event_date <= weekEndStr);
  const thisWeekHomework    = thisWeekEvents.filter(e => e.event_type === 'homework');
  const thisWeekAssessments = thisWeekEvents.filter(e => e.event_type === 'assessment');
  const thisWeekExams       = thisWeekEvents.filter(e => e.event_type === 'exam');

  const estimatedHours = (
    thisWeekHomework.length * 0.5 +
    thisWeekAssessments.length * 1.5 +
    thisWeekExams.length * 2
  );

  const dayEventCounts = new Map<string, number>();
  for (const e of thisWeekEvents) {
    dayEventCounts.set(e.event_date, (dayEventCounts.get(e.event_date) ?? 0) + 1);
  }
  const busiestDay = dayEventCounts.size > 0
    ? Array.from(dayEventCounts.entries()).reduce((a, b) => b[1] > a[1] ? b : a)
    : null;
  const busiestDayLabel = busiestDay
    ? new Date(busiestDay[0] + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'long' })
    : null;

  const nextExam = futureEvents
    .filter(e => e.event_type === 'exam')
    .sort((a, b) => a.event_date.localeCompare(b.event_date))[0] ?? null;

  const nextAssessment = futureEvents
    .filter(e => e.event_type === 'assessment')
    .sort((a, b) => a.event_date.localeCompare(b.event_date))[0] ?? null;

  function daysUntil(dateStr: string): number {
    return Math.round(
      (new Date(dateStr + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime()) / 86400000
    );
  }

  const priorityDeadlines = futureEvents
    .filter(e => e.event_type !== 'other')
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .slice(0, 7);

  const conflictDays = Array.from(dayEventCounts.entries())
    .filter(([, count]) => count >= 3)
    .map(([date]) => ({
      date,
      count: dayEventCounts.get(date)!,
      label: new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short' }),
    }));

  const futureDaysThisWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }).filter(ds => ds >= todayStr);

  const lightestStudyDay = futureDaysThisWeek.length > 0
    ? futureDaysThisWeek.reduce((lightest, ds) =>
        (dayEventCounts.get(ds) ?? 0) < (dayEventCounts.get(lightest) ?? 0) ? ds : lightest
      )
    : null;

  const lightestDayLabel = lightestStudyDay
    ? new Date(lightestStudyDay + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'long' })
    : null;

  // ── Intelligence engine — replaces local revision logic ──────
  const calInsights = computeStudentInsights(allMarks, futureEvents, [], goals, todayStr, [], []);
  const revisionRecs = calInsights.revisionRecs.slice(0, 2);

  // Keep legacy shape for JSX compatibility — map engine recs to old format
  const revisionSuggestions = revisionRecs.map(rec => ({
    subject: rec.subject,
    avg:     rec.avg,
    event:   futureEvents.find(e =>
      (e.event_type === 'exam' || e.event_type === 'assessment') &&
      e.event_date >= todayStr &&
      e.title.toLowerCase().includes(rec.subject.split(' ')[0].toLowerCase())
    ) ?? futureEvents.find(e => e.event_type === 'exam' || e.event_type === 'assessment') ?? null,
    days:    rec.examDays,
    urgency: rec.urgency,
    reason:  rec.reason,
  })).filter(s => s.event !== null) as {
    subject: string; avg: number;
    event: SchoolEvent; days: number | null;
    urgency: string; reason: string;
  }[];

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero — wave-strip system, matches Home dashboard ═══
          No buttons in this band (house rule). Month-nav, today, and
          grid/list toggle live in the control bar in the body below. */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #d6dbde 0%, #dee3e5 22%, #e4e8ea 45%, #e9ecec 68%, #eaebec 100%)' }} />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 100">
          <path d="M0,42 C220,32 380,49 600,40 C800,32 970,46 1200,38 L1200,0 L0,0 Z" fill="rgba(200,207,212,0.5)" />
          <path d="M0,50 C210,60 390,45 610,53 C800,60 960,47 1200,55" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <path d="M0,58 C220,50 380,66 600,57 C800,50 970,63 1200,55" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          <path d="M0,66 C210,74 400,60 620,68 C810,75 980,62 1200,70" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="1" />
          <path d="M0,74 C220,66 400,82 620,73 C820,65 990,79 1200,71" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <path d="M0,82 C220,90 380,75 600,84 C800,92 970,78 1200,86" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <path d="M0,90 C210,82 390,98 610,89 C800,82 960,95 1200,87" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
          <path d="M0,96 C220,90 400,100 620,94 C820,88 990,98 1200,93" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />
          <path d="M0,55 C240,65 400,48 620,58 C820,67 980,50 1200,60 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M0,72 C240,62 420,81 640,71 C830,62 1000,79 1200,69 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.55)" />
          <path d="M0,88 C230,98 410,82 630,92 C825,101 995,85 1200,95 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.65)" />
        </svg>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #b9c0c5 0%, #c9d0d4 30%, transparent 42%, transparent 55%, rgba(234,235,236,0.75) 80%, #eaebec 100%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">

          {/* Eyebrow row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0"
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">Calendar</p>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            My Schedule
          </motion.h1>

          {/* Static month/event-count chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="inline-flex items-center gap-2 mt-4 border border-brand-border bg-white/70 rounded-full pl-3 pr-4 py-1.5"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(31,36,33,0.5)]">Viewing</span>
            <span className="font-black text-sm text-brand-dark">{MONTHS[month - 1]} {year}</span>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3 pb-20 md:pb-0">

      {/* ── Control bar: today / month nav / grid-list toggle ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="flex items-center gap-2 flex-wrap"
      >
        {/* Today button */}
        <button
          onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth() + 1); setSelectedDay(todayStr); }}
          className="px-3.5 py-2 text-[13px] font-bold text-stone-600 rounded transition-colors border"
          style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}
        >
          Today
        </button>

        {/* Month nav */}
        <div className="flex items-center rounded border overflow-hidden" style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}>
          <button onClick={prevMonth} aria-label="Previous month" className="p-2.5 hover:bg-black/[0.03] transition-colors" style={{ borderRight: '1px solid var(--color-brand-border)' }}>
            <ChevronLeft className="w-4 h-4 text-stone-600" />
          </button>
          <div className="relative overflow-hidden min-w-36 text-center px-1">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={monthKey}
                initial={{ y: direction > 0 ? 16 : -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? -16 : 16, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="block text-[14px] font-bold text-brand-dark py-1.5"
              >
                {MONTHS[month - 1]} {year}
              </motion.span>
            </AnimatePresence>
          </div>
          <button onClick={nextMonth} aria-label="Next month" className="p-2.5 hover:bg-black/[0.03] transition-colors" style={{ borderLeft: '1px solid var(--color-brand-border)' }}>
            <ChevronRight className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        {/* Grid/List toggle */}
        <div className="flex items-center rounded border p-0.5 gap-0.5" style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-bold transition-all ${
              viewMode === 'grid' ? 'text-white' : 'text-stone-500 hover:text-stone-700'
            }`}
            style={viewMode === 'grid' ? { background: 'var(--color-accent)' } : undefined}
          >
            <Calendar className="w-3.5 h-3.5" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-bold transition-all ${
              viewMode === 'list' ? 'text-white' : 'text-stone-500 hover:text-stone-700'
            }`}
            style={viewMode === 'list' ? { background: 'var(--color-accent)' } : undefined}
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
        </div>
      </motion.div>

      {/* ── Section 1: Workload Intelligence ────────────────── */}
      {thisWeekEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="paper-card rounded p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3.5 h-3.5 text-stone-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[rgba(31,36,33,0.45)]">This Week</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Homework',    value: thisWeekHomework.length,    color: 'text-blue-600' },
              { label: 'Assessments', value: thisWeekAssessments.length, color: 'text-emerald-600' },
              { label: 'Exams',       value: thisWeekExams.length,       color: 'text-red-600' },
              {
                label: 'Est. Hours',
                value: estimatedHours % 1 === 0 ? `${estimatedHours}h` : `${estimatedHours.toFixed(1)}h`,
                color: 'text-amber-600',
              },
            ].map(stat => (
              <div key={stat.label} className="rounded px-3 py-2.5 text-center" style={{ background: 'var(--color-paper-raise)' }}>
                <p className={`font-black text-xl leading-none ${stat.value === 0 ? 'text-stone-300' : stat.color}`}>{stat.value}</p>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          {busiestDayLabel && (
            <p className="text-xs text-[rgba(31,36,33,0.5)]">
              Busiest day: <span className="text-brand-dark font-bold">{busiestDayLabel}</span>
              {estimatedHours >= 6 && <span className="text-amber-600 font-bold ml-2">— Heavy week</span>}
              {estimatedHours >= 3 && estimatedHours < 6 && <span className="text-blue-600 font-bold ml-2">— Manageable</span>}
              {estimatedHours < 3 && <span className="text-emerald-600 font-bold ml-2">— Light week</span>}
            </p>
          )}
        </motion.div>
      )}

      {/* ── Section 2: Countdown cards ──────────────────────── */}
      {(nextExam || nextAssessment) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {([nextExam, nextAssessment] as (SchoolEvent | null)[]).filter(Boolean).map((ev, i) => {
            const days = daysUntil(ev!.event_date);
            const accentBorder = days <= 3 ? '#ef4444' : days <= 7 ? '#f59e0b' : 'var(--color-brand-border)';
            const daysColor    = days <= 3 ? 'text-red-600'
                               : days <= 7 ? 'text-amber-600'
                               :             'text-brand-dark';
            return (
              <motion.div key={ev!.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="paper-card rounded p-4"
                style={{ borderLeft: `3px solid ${accentBorder}` }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[rgba(31,36,33,0.45)] mb-1">
                  {ev!.event_type === 'exam' ? 'Next Exam' : 'Next Assessment'}
                </p>
                <p className="font-black text-brand-dark text-sm leading-tight mb-2">{ev!.title}</p>
                <div className="flex items-end gap-1.5">
                  <span className={`font-black text-3xl leading-none ${daysColor}`}>{days}</span>
                  <span className="text-sm font-bold text-[rgba(31,36,33,0.5)] mb-0.5">
                    {days === 1 ? 'day' : 'days'} remaining
                  </span>
                </div>
                <p className="text-xs text-[rgba(31,36,33,0.45)] mt-1">{formatDayFull(ev!.event_date)}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Section 3: Priority Deadlines ───────────────────── */}
      {priorityDeadlines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="paper-card rounded p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-3.5 h-3.5 text-stone-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Priority Deadlines</p>
          </div>
          <div className="space-y-2">
            {priorityDeadlines.map((ev) => {
              const days = daysUntil(ev.event_date);
              const urgency = days === 0 ? { dot: 'bg-red-500',   label: 'Today',        text: 'text-red-600' }
                            : days === 1 ? { dot: 'bg-red-400',   label: 'Tomorrow',     text: 'text-red-500' }
                            : days <= 3  ? { dot: 'bg-amber-500', label: `${days} days`, text: 'text-amber-600' }
                            : days <= 7  ? { dot: 'bg-blue-400',  label: `${days} days`, text: 'text-blue-600' }
                            :              { dot: 'bg-stone-300',  label: `${days} days`, text: 'text-stone-500' };
              const typeLabel = EVENT_LABELS[ev.event_type];
              return (
                <div key={ev.id} className="flex items-center gap-3 py-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${urgency.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate">{ev.title}</p>
                    <p className="text-[11px] text-stone-500">{typeLabel}</p>
                  </div>
                  <span className={`text-[11px] font-black shrink-0 ${urgency.text}`}>{urgency.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Section 4: Conflict Detection ───────────────────── */}
      {conflictDays.filter(d => d.date >= todayStr).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
          className="paper-card rounded p-4 mb-4"
          style={{ borderLeft: '3px solid #f59e0b' }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-600 mb-2">Schedule Warning</p>
          {conflictDays.filter(d => d.date >= todayStr).map(d => (
            <div key={d.date} className="flex items-start gap-2 mb-1 last:mb-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
              <p className="text-sm font-bold text-stone-700">
                {d.label} has {d.count} deadlines — consider starting work earlier this week.
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Section 5: Study Suggestion ─────────────────────── */}
      {lightestDayLabel && thisWeekEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, ease: [0.23, 1, 0.32, 1] }}
          className="paper-card rounded p-4 mb-4"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[rgba(31,36,33,0.45)] mb-1">Suggested Study Time</p>
          <p className="text-sm font-bold text-stone-700">
            <span className="text-brand-dark font-black">{lightestDayLabel}</span> is your lightest day this week — good time to study ahead.
            {goals.targetCareer && (
              <span className="text-stone-500"> Focus on subjects relevant to {goals.targetCareer}.</span>
            )}
          </p>
        </motion.div>
      )}

      {/* ── Section 6: Revision Suggestions ─────────────────── */}
      {revisionSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="paper-card rounded p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">
              {revisionSuggestions.some(s => s.urgency === 'critical') ? 'Critical Revision' : 'Recommended Revision'}
            </p>
          </div>
          <div className="space-y-3">
            {revisionSuggestions.map((s, i) => (
              <div key={i} className={`rounded p-3 ${
                s.urgency === 'critical' ? 'bg-red-50 border border-red-200' :
                s.urgency === 'high'     ? 'bg-amber-50 border border-amber-200' :
                                           'bg-stone-50 border border-brand-border'
              }`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-black text-brand-dark text-sm">{s.subject}</p>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        s.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                        s.urgency === 'high'     ? 'bg-amber-100 text-amber-700' :
                                                   'bg-stone-100 text-stone-500'
                      }`}>
                        {s.urgency === 'critical' ? 'Critical' : s.urgency === 'high' ? 'High Priority' : 'Recommended'}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500">
                        {s.avg}% avg
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{s.reason}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onNavigate('library')}
                      className="px-3 py-1.5 rounded bg-brand-dark text-white text-[11px] font-black hover:opacity-90 transition-opacity"
                    >
                      Library
                    </button>
                    <button
                      onClick={() => onNavigate('pastpapers')}
                      className="px-3 py-1.5 rounded text-stone-700 text-[11px] font-black hover:bg-brand-border transition-colors border border-brand-border"
                      style={{ background: 'var(--color-paper-raise)' }}
                    >
                      Papers
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Goal Reminder — shown when no revision suggestions and a goal is set ── */}
      {revisionSuggestions.length === 0 && (goals.targetAps || goals.targetCareer) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="paper-card rounded p-4 mb-4"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Your Goals</p>
          <div className="flex flex-wrap gap-2">
            {goals.targetAps && (
              <div className="flex items-center gap-2 bg-violet-50 rounded px-3 py-2 border border-violet-100">
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Target APS</span>
                <span className="font-black text-violet-700">{goals.targetAps}</span>
              </div>
            )}
            {goals.targetCareer && (
              <div className="flex items-center gap-2 bg-stone-50 rounded px-3 py-2 border border-brand-border">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Career</span>
                <span className="font-black text-stone-700 text-sm">{goals.targetCareer}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Calendar grid / list ─────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-5">
        <div className="flex-1 min-w-0">

          {/* LIST VIEW */}
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-5 h-5 border-2 border-brand-border border-t-brand-dark rounded-full animate-spin" />
                  </div>
                ) : allSorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Calendar className="w-8 h-8 text-stone-200 mb-3" />
                    <p className="text-sm font-bold text-stone-400">No events this month</p>
                    <p className="text-xs text-stone-300 mt-1">Homework, assessments and exams will appear here once scheduled.</p>
                  </div>
                ) : (
                  <div>
                    {Object.entries(grouped).map(([dateStr, dayEvs]) => (
                      <div key={dateStr}>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2 mt-4 first:mt-0">
                          {formatDate(dateStr)}
                        </p>
                        {dayEvs.map((ev, i) => {
                          const c = EVENT_COLORS[ev.event_type];
                          const isHomework = ev.event_type === 'homework';
                          const done = completions.has(ev.id);
                          const toggling = togglingId === ev.id;
                          return (
                            <motion.div
                              key={ev.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.03, duration: 0.2 }}
                              className={`bg-white rounded border border-brand-border px-4 py-3 flex items-center gap-3 mb-2 hover:border-stone-300 transition-colors ${done ? 'opacity-60' : ''}`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${done ? 'line-through text-stone-500' : 'text-brand-dark'}`}>
                                  {ev.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                                    {EVENT_LABELS[ev.event_type]}
                                  </span>
                                  {ev.start_time && (
                                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${TYPE_PILL[ev.event_type]}`}>
                                {EVENT_LABELS[ev.event_type]}
                              </span>
                              {isHomework && (
                                <button
                                  onClick={(e) => handleToggleDone(ev, e)}
                                  disabled={toggling}
                                  className="p-1 rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-40"
                                >
                                  {done
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    : <Circle className="w-5 h-5 text-stone-400" />
                                  }
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

            ) : (
              /* GRID VIEW */
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {!loading && allSorted.length === 0 && (
                  <div className="flex items-center gap-2 mb-3 text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <p className="text-xs font-bold">Nothing scheduled for {MONTHS[month - 1]} yet — check back once your teachers add events.</p>
                  </div>
                )}
                <div className="paper-card rounded overflow-hidden">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 border-b border-brand-border/60">
                    {DAYS.map(d => (
                      <div key={d} className="py-2.5 text-center text-[11px] font-black uppercase tracking-[0.15em] text-stone-500 border-b border-brand-border/60">
                        {d}
                      </div>
                    ))}
                  </div>

                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-brand-border border-t-brand-dark rounded-full animate-spin" />
                    </div>
                  ) : (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={monthKey}
                        initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="grid grid-cols-7"
                      >
                        {cells.map((day, idx) => {
                          if (!day) return (
                            <div key={`empty-${idx}`} className="border-r border-b border-brand-border/60 min-h-[90px]" />
                          );
                          const dateStr    = toDateStr(year, month, day);
                          const dayEvs     = eventsOnDay(day);
                          const isToday    = dateStr === todayStr;
                          const isSelected = dateStr === selectedDay;

                          return (
                            <div
                              key={day}
                              onClick={() => handleDayClick(day)}
                              className={`border-r border-b border-brand-border/60 last:border-r-0 min-h-[90px] p-2 cursor-pointer relative transition-colors hover:bg-stone-50 ${
                                isSelected ? 'bg-stone-50 ring-2 ring-inset ring-brand-dark' : ''
                              }`}
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                                  isToday
                                    ? 'bg-brand-dark text-white'
                                    : isSelected
                                    ? 'text-brand-dark'
                                    : 'text-stone-500'
                                }`}>
                                  {day}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                {dayEvs.slice(0, 2).map(ev => {
                                  const done = completions.has(ev.id);
                                  return (
                                    <div key={ev.id}
                                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate ${TYPE_CELL_BG[ev.event_type]} ${done ? 'opacity-50' : ''}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${EVENT_COLORS[ev.event_type].dot}`} />
                                      <span className={`truncate ${done ? 'line-through' : ''}`}>{ev.title}</span>
                                    </div>
                                  );
                                })}
                                {dayEvs.length > 2 && (
                                  <div className="text-[10px] font-bold text-stone-500 px-1.5">+{dayEvs.length - 2} more</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile/tablet day-detail sheet — the sidebar below is xl:only,
             so under 1280px this is the only way to see a selected day's events. ── */}
        <AnimatePresence>
          {selectedDay && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => { setSelectedDay(null); setSelectedEvent(null); }}
                className="xl:hidden fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ duration: 0.28, ease }}
                className="xl:hidden fixed inset-x-0 bottom-0 z-50 max-h-[75vh] flex flex-col rounded-t-2xl bg-white border-t border-brand-border overflow-hidden"
                style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border/60 shrink-0">
                  <div>
                    <p className="text-xs font-black text-brand-dark">{formatDayFull(selectedDay)}</p>
                    <p className="text-[10px] text-stone-500 font-bold mt-0.5">
                      {dayEvents.length === 0 ? 'No events' : `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <button onClick={() => { setSelectedDay(null); setSelectedEvent(null); }}
                    aria-label="Close"
                    className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                    <X className="w-3.5 h-3.5 text-stone-500" />
                  </button>
                </div>
                <div className="overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm font-bold text-stone-400">Nothing on this day.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {dayEvents.map((ev) => {
                        const c = EVENT_COLORS[ev.event_type];
                        const isOpen = selectedEvent?.id === ev.id;
                        const isHomework = ev.event_type === 'homework';
                        const done = completions.has(ev.id);
                        const toggling = togglingId === ev.id;
                        return (
                          <div key={ev.id}>
                            <div className="flex items-center">
                              <button
                                onClick={() => setSelectedEvent(isOpen ? null : ev)}
                                className="flex-1 text-left px-4 py-3 hover:bg-stone-50 transition-colors"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                                    {EVENT_LABELS[ev.event_type]}
                                  </span>
                                </div>
                                <p className={`text-sm font-bold truncate ${done ? 'line-through text-stone-500' : 'text-brand-dark'}`}>
                                  {ev.title}
                                </p>
                                {ev.start_time && (
                                  <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}
                                  </p>
                                )}
                              </button>
                              {isHomework && (
                                <button
                                  onClick={(e) => handleToggleDone(ev, e)}
                                  disabled={toggling}
                                  aria-label={done ? 'Mark homework not done' : 'Mark homework done'}
                                  className="px-3 py-3 hover:bg-stone-50 transition-colors disabled:opacity-40"
                                >
                                  {done
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    : <Circle className="w-5 h-5 text-stone-400" />
                                  }
                                </button>
                              )}
                            </div>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className={`mx-3 mb-3 p-3 rounded ${TYPE_PILL[ev.event_type]?.split(' ')[0] ?? 'bg-stone-50'}`}>
                                    {ev.description && (
                                      <p className="text-xs text-stone-600 leading-relaxed mb-2">{ev.description}</p>
                                    )}
                                    {ev.attachment_url && (
                                      <button onClick={() => handleDownload(ev)} disabled={downloading}
                                        className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50">
                                        <Paperclip className="w-3.5 h-3.5" />
                                        {downloading ? 'Opening…' : ev.attachment_name ?? 'Download'}
                                      </button>
                                    )}
                                    {!ev.description && !ev.attachment_url && (
                                      <p className="text-xs text-stone-500 italic">No additional details.</p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Right sidebar — Legend and Sync Calendar have no mobile
             equivalent, so they render at all widths; the Day-detail/
             Upcoming block stays xl-only since mobile already gets the
             day's events via the bottom sheet above. ── */}
        <div className="w-full xl:w-72 shrink-0 space-y-4">

          {/* Day detail or upcoming events — desktop only, mirrors the mobile bottom sheet */}
          <div className="hidden xl:block space-y-4">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
                className="paper-card rounded overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border/60">
                  <div>
                    <p className="text-xs font-black text-brand-dark">{formatDayFull(selectedDay)}</p>
                    <p className="text-[10px] text-stone-500 font-bold mt-0.5">
                      {dayEvents.length === 0 ? 'No events' : `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <button onClick={() => { setSelectedDay(null); setSelectedEvent(null); }}
                    className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                    <X className="w-3.5 h-3.5 text-stone-500" />
                  </button>
                </div>

                {dayEvents.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-bold text-stone-400">Nothing on this day.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {dayEvents.map((ev, i) => {
                      const c = EVENT_COLORS[ev.event_type];
                      const isOpen = selectedEvent?.id === ev.id;
                      const isHomework = ev.event_type === 'homework';
                      const done = completions.has(ev.id);
                      const toggling = togglingId === ev.id;
                      return (
                        <div key={ev.id}>
                          <div className="flex items-center">
                            <motion.button
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.18 }}
                              onClick={() => setSelectedEvent(isOpen ? null : ev)}
                              className="flex-1 text-left px-4 py-3 hover:bg-stone-50 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                                  {EVENT_LABELS[ev.event_type]}
                                </span>
                              </div>
                              <p className={`text-sm font-bold truncate ${done ? 'line-through text-stone-500' : 'text-brand-dark'}`}>
                                {ev.title}
                              </p>
                              {ev.start_time && (
                                <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}
                                </p>
                              )}
                            </motion.button>

                            {isHomework && (
                              <button
                                onClick={(e) => handleToggleDone(ev, e)}
                                disabled={toggling}
                                className="px-3 py-3 hover:bg-stone-50 transition-colors disabled:opacity-40"
                              >
                                {done
                                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  : <Circle className="w-5 h-5 text-stone-400" />
                                }
                              </button>
                            )}
                          </div>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <div className={`mx-3 mb-3 p-3 rounded ${TYPE_PILL[ev.event_type]?.split(' ')[0] ?? 'bg-stone-50'}`}>
                                  {ev.description && (
                                    <p className="text-xs text-stone-600 leading-relaxed mb-2">{ev.description}</p>
                                  )}
                                  {ev.attachment_url && (
                                    <button onClick={() => handleDownload(ev)} disabled={downloading}
                                      className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50">
                                      <Paperclip className="w-3.5 h-3.5" />
                                      {downloading ? 'Opening…' : ev.attachment_name ?? 'Download'}
                                    </button>
                                  )}
                                  {!ev.description && !ev.attachment_url && (
                                    <p className="text-xs text-stone-500 italic">No additional details.</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
                className="paper-card rounded p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Upcoming Events</p>
                  <button onClick={() => setViewMode('list')}
                    className="text-[11px] font-black text-stone-500 hover:text-stone-600 transition-colors">
                    View all
                  </button>
                </div>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-stone-400 font-bold">Nothing scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {upcoming.map((ev, i) => {
                      const c = EVENT_COLORS[ev.event_type];
                      const isHomework = ev.event_type === 'homework';
                      const done = completions.has(ev.id);
                      return (
                        <motion.div key={ev.id}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                          className="flex items-center gap-2"
                        >
                          <div className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded border border-brand-border/60 hover:border-brand-border transition-colors cursor-pointer ${done ? 'opacity-50' : ''}`}
                            onClick={() => {
                              const evYear  = parseInt(ev.event_date.split('-')[0]);
                              const evMonth = parseInt(ev.event_date.split('-')[1]);
                              if (evYear === year && evMonth === month) {
                                setSelectedDay(ev.event_date);
                                setSelectedEvent(ev);
                              }
                            }}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TYPE_PILL[ev.event_type]?.split(' ')[0] ?? 'bg-stone-100'}`}>
                              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold text-brand-dark truncate ${done ? 'line-through text-stone-500' : ''}`}>{ev.title}</p>
                              <p className="text-[11px] text-stone-500">{formatDate(ev.event_date)}</p>
                            </div>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${TYPE_PILL[ev.event_type]}`}>
                              {EVENT_LABELS[ev.event_type]}
                            </span>
                          </div>

                          {isHomework && (
                            <button
                              onClick={(e) => handleToggleDone(ev, e)}
                              disabled={togglingId === ev.id}
                              className="p-1.5 rounded hover:bg-stone-100 transition-colors disabled:opacity-40 shrink-0"
                            >
                              {done
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                : <Circle className="w-4 h-4 text-stone-400" />
                              }
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.15 }}
            className="paper-card rounded p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-3.5 h-3.5 text-stone-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Legend</p>
            </div>
            <div className="space-y-2">
              {(['homework','assessment','exam','other'] as const).map(type => {
                const c = EVENT_COLORS[type];
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className="text-xs font-bold text-stone-600">{EVENT_LABELS[type]}</span>
                    {type === 'homework' && (
                      <span className="text-[10px] text-stone-400 font-bold ml-auto">tap to mark done</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
}
