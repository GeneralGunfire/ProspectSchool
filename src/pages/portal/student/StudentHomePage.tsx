import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarDays, ClipboardList, Megaphone, CheckCircle2, Circle,
  ChevronRight, BookOpen, TrendingUp, Activity,
} from 'lucide-react';
import { fetchStudentAnnouncements, type Announcement } from '../../../lib/announcements';
import {
  fetchStudentEvents, fetchStudentCompletions, markHomeworkDone, unmarkHomeworkDone,
  EVENT_COLORS, EVENT_LABELS, type SchoolEvent,
} from '../../../lib/events';
import { fetchStudentResults, type StudentResult } from '../../../lib/marks';
import { fetchStudentProgress, type StudyProgress } from '../../../lib/studyProgress';
import { fetchApsScore } from '../../../lib/myFuture';
import { supabaseAdmin } from '../../../lib/supabase';
import { getStudentGoals } from '../../../lib/studentGoals';
import { computeStudentInsights } from '../../../lib/studentInsights';
import {
  getActiveInterventions, getCompletedInterventions, getOutcomes,
  syncInterventionsFromRisk, syncOutcomesFromMarks,
  startIntervention, completeIntervention, updateChecklistProgress,
  type Intervention, type Outcome, type InterventionType,
} from '../../../lib/interventions';
import { fetchInterventionTemplate, type InterventionTemplate } from '../../../lib/interventionTemplates';
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

// Animated count-up — real values only, no fabricated numbers, just a
// premium reveal instead of the digit appearing flat/instant.
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 900;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{display}{suffix}</>;
}

// SVG progress ring — same recipe as the landing page's dashboard preview,
// ported here so the real dashboard shares the same premium visual language.
function Ring({ pct, size = 64, stroke = 6, trackColor = 'rgba(255,255,255,0.12)' }: { pct: number; size?: number; stroke?: number; trackColor?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--color-accent)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - clamped / 100) }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </svg>
  );
}

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
  const goals = getStudentGoals(session.student_id);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [pendingHomework, setPendingHomework] = useState<SchoolEvent[]>([]);
  const [recentMarks, setRecentMarks] = useState<StudentResult[]>([]);
  const [allMarks, setAllMarks] = useState<StudentResult[]>([]);
  const [completions, setCompletions] = useState<Set<number>>(new Set());
  const [studyProgress, setStudyProgress] = useState<StudyProgress[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [apsScore, setApsScore] = useState<number | null>(null);
  const [completedInterventions, setCompletedInterventions] = useState<Intervention[]>([]);
  const [interventionOutcomes, setInterventionOutcomes]     = useState<Outcome[]>([]);
  const [activeInterventions, setActiveInterventions]       = useState<Intervention[]>([]);
  const [templates, setTemplates] = useState<Map<InterventionType, InterventionTemplate>>(new Map());

  useEffect(() => {
    async function load() {
      const { data: links } = await supabaseAdmin
        .from('teacher_students')
        .select('subject_id')
        .eq('student_id', session.student_id);
      const subjectIds = [...new Set((links ?? []).map((r: any) => r.subject_id as number))];

      const [announcs, events, comps, marks, progress] = await Promise.all([
        fetchStudentAnnouncements(session.school_id, session.student_id, session.grade, session.cohort_id, subjectIds),
        fetchStudentEvents(session.school_id, session.student_id, session.grade, session.cohort_id, subjectIds, today.getFullYear(), today.getMonth() + 1),
        fetchStudentCompletions(session.student_id, session.school_id),
        fetchStudentResults(session.student_id, session.school_id),
        fetchStudentProgress(session.student_id, session.school_id),
      ]);

      setAnnouncements(announcs.slice(0, 3));
      setCompletions(comps);
      setStudyProgress(progress);

      const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 3);
      setUpcomingEvents(upcoming);

      const pending = events
        .filter(e => e.event_type === 'homework' && e.event_date >= todayStr && !comps.has(e.id))
        .slice(0, 8);
      setPendingHomework(pending);

      const scoredMarks = marks.filter(m => m.mark !== null);
      setAllMarks(scoredMarks);
      setRecentMarks(scoredMarks.slice(0, 3));

      setLoading(false);

      // Non-blocking APS fetch
      fetchApsScore(session.student_id, session.school_id).then(d => {
        if (d) setApsScore(d.aps);
      });

      // Non-blocking intervention fetch — runs after page is visible
      const scoredForSync = marks.filter(m => m.mark !== null);
      syncInterventionsFromRisk(
        session.student_id, session.school_id,
        // examRiskSubjects and revisionRecs computed below after state is set;
        // we call sync again after engine runs in a separate effect
        [], [],
      ).then(async () => {
        await syncOutcomesFromMarks(session.student_id, session.school_id, scoredForSync);
        const [completed, outcomeRows, active] = await Promise.all([
          getCompletedInterventions(session.student_id),
          getOutcomes(session.student_id),
          getActiveInterventions(session.student_id),
        ]);
        setCompletedInterventions(completed);
        setInterventionOutcomes(outcomeRows);
        setActiveInterventions(active);

        // Load each distinct type's checklist template once, non-blocking.
        const types = [...new Set(active.map(i => i.type))];
        Promise.all(types.map(t => fetchInterventionTemplate(session.school_id, t))).then(results => {
          setTemplates(prev => {
            const next = new Map(prev);
            results.forEach((tpl, i) => { if (tpl) next.set(types[i], tpl); });
            return next;
          });
        });
      });
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
        <div className="w-5 h-5 border-2 border-brand-border border-t-brand-dark rounded-full animate-spin" />
      </div>
    );
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  // Subject averages from ALL marks
  const subjectMap = new Map<string, { sum: number; total: number; count: number }>();
  for (const m of allMarks) {
    if (m.mark === null) continue;
    const key = m.subject_label || 'Other';
    const e = subjectMap.get(key) ?? { sum: 0, total: 0, count: 0 };
    subjectMap.set(key, { sum: e.sum + m.mark, total: e.total + m.total, count: e.count + 1 });
  }
  const subjectProgress = Array.from(subjectMap.entries())
    .map(([label, d]) => ({ label, pct: Math.round((d.sum / d.total) * 100), count: d.count }))
    .sort((a, b) => b.pct - a.pct);

  const avgMark = allMarks.length > 0
    ? Math.round(allMarks.reduce((acc, m) => acc + (m.mark! / m.total) * 100, 0) / allMarks.length)
    : null;

  const highestSubject = subjectProgress[0] ?? null;
  const lowestSubject  = subjectProgress[subjectProgress.length - 1] ?? null;

  const avgStatus = avgMark === null ? null
    : avgMark >= 70 ? { label: 'Strong', colorClass: 'text-emerald-600' }
    : avgMark >= 50 ? { label: 'Watch',  colorClass: 'text-amber-600' }
    :                 { label: 'At Risk', colorClass: 'text-red-500' };

  // Homework grouping
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;

  const hwToday    = pendingHomework.filter(e => e.event_date === todayStr);
  const hwTomorrow = pendingHomework.filter(e => e.event_date === tomorrowStr);
  const hwLater    = pendingHomework.filter(e => e.event_date > tomorrowStr);

  const totalHomework = pendingHomework.length + completions.size;
  const hwCompletionPct = totalHomework > 0 ? Math.round((completions.size / totalHomework) * 100) : 0;

  // Library stats
  const topicsStarted  = studyProgress.filter(p => p.mastery_level !== 'not_started').length;
  const topicsMastered = studyProgress.filter(p => p.mastery_level === 'mastered').length;
  const totalTopics    = 35;
  const libraryPct     = Math.round((topicsStarted / totalTopics) * 100);

  // ── Student Intelligence Engine ───────────────────────────────────────────
  // completedInterventions + interventionOutcomes come from state (loaded async in useEffect)
  const insights_engine = computeStudentInsights(allMarks, upcomingEvents, studyProgress, goals, todayStr, completedInterventions, interventionOutcomes);
  const { academicStory, interventionImpact } = insights_engine;

  // Focus item
  const focusItem = (() => {
    const todayHw = pendingHomework.find(e => e.event_date === todayStr);
    if (todayHw) return { type: 'urgent' as const, event: todayHw, label: 'Due Today' };
    const tomorrowHw = pendingHomework.find(e => e.event_date === tomorrowStr);
    if (tomorrowHw) return { type: 'soon' as const, event: tomorrowHw, label: 'Due Tomorrow' };
    const nextExam = upcomingEvents.find(e => e.event_type === 'assessment' || e.event_type === 'exam');
    if (nextExam) return { type: 'exam' as const, event: nextExam, label: EVENT_LABELS[nextExam.event_type] };
    const nextHw = pendingHomework[0];
    if (nextHw) return { type: 'homework' as const, event: nextHw, label: 'Upcoming Homework' };
    return null;
  })();

  function daysUntil(dateStr: string): string {
    const diff = new Date(dateStr + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime();
    const d = Math.round(diff / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Tomorrow';
    return `${d} days`;
  }

  // Contextual quick actions
  const upcomingAssessmentCount = upcomingEvents.filter(
    e => e.event_type === 'exam' || e.event_type === 'assessment'
  ).length;

  const hasExamSoon = upcomingEvents.some(e =>
    (e.event_type === 'exam' || e.event_type === 'assessment') &&
    Math.round((new Date(e.event_date + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime()) / 86400000) <= 7
  );
  const isStruggling = avgMark !== null && avgMark < 60;
  const lowestSubjectName = lowestSubject && subjectProgress.length > 1 ? lowestSubject.label : null;

  // Recent activity
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

  // Week strip
  const weekDays: { label: string; num: number; dateStr: string; isToday: boolean }[] = [];
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    weekDays.push({ label: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i], num: d.getDate(), dateStr: ds, isToday: ds === todayStr });
  }

  const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

  // ── Momentum computations ─────────────────────────────────────────────────

  const thisWeekMastered = studyProgress.filter(p => {
    if (!p.last_accessed) return false;
    const d = new Date(p.last_accessed);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    return d >= weekAgo && p.mastery_level === 'mastered';
  }).length;

  const thisWeekStarted = studyProgress.filter(p => {
    if (!p.last_accessed) return false;
    const d = new Date(p.last_accessed);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    return d >= weekAgo && p.mastery_level !== 'not_started';
  }).length;

  const recentSorted = [...allMarks].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const last3    = recentSorted.slice(0, 3).map(m => (m.mark! / m.total) * 100);
  const prev3    = recentSorted.slice(3, 6).map(m => (m.mark! / m.total) * 100);
  const last3Avg = last3.length ? last3.reduce((a, b) => a + b, 0) / last3.length : null;
  const prev3Avg = prev3.length ? prev3.reduce((a, b) => a + b, 0) / prev3.length : null;
  const markTrend = last3Avg !== null && prev3Avg !== null ? last3Avg - prev3Avg : null;

  const hasMomentum = completions.size > 0 || thisWeekMastered > 0 || thisWeekStarted > 0 || markTrend !== null;

  // ── Action Queue ──────────────────────────────────────────────────────────

  type ActionQueueItem = {
    priority: 'high' | 'mid' | 'low';
    label: string;
    sublabel: string;
    page: string;
  };

  const actionQueue: ActionQueueItem[] = [];

  const urgentHw = pendingHomework.find(e => e.event_date <= tomorrowStr);
  if (urgentHw) {
    actionQueue.push({
      priority: 'high',
      label: urgentHw.title,
      sublabel: `Homework · ${urgentHw.event_date === todayStr ? 'Due today' : 'Due tomorrow'}`,
      page: 'calendar',
    });
  }

  const weakestSubject = subjectProgress.length > 0
    ? subjectProgress.reduce((a, b) => a.pct <= b.pct ? a : b)
    : null;
  if (weakestSubject && weakestSubject.pct < 65) {
    actionQueue.push({
      priority: 'mid',
      label: `Revise ${weakestSubject.label}`,
      sublabel: `Current average: ${weakestSubject.pct}% — open the library to improve`,
      page: 'library',
    });
  }

  const examSoon = upcomingEvents.find(e =>
    e.event_type === 'exam' &&
    Math.round((new Date(e.event_date + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime()) / 86400000) <= 10
  );
  if (examSoon) {
    const daysLeft = Math.round((new Date(examSoon.event_date + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime()) / 86400000);
    actionQueue.push({
      priority: 'high',
      label: `Prepare for ${examSoon.title}`,
      sublabel: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining — practice past papers`,
      page: 'pastpapers',
    });
  }

  if (announcements.length > 0) {
    actionQueue.push({
      priority: 'low',
      label: announcements[0].title,
      sublabel: `Announcement · ${timeAgo(announcements[0].created_at)}`,
      page: 'announcements',
    });
  }

  // Goal: if APS goal set and student is below it
  if (goals.targetAps && apsScore !== null && apsScore < goals.targetAps) {
    actionQueue.push({
      priority: 'mid',
      label: `APS Goal: ${apsScore} / ${goals.targetAps}`,
      sublabel: `${goals.targetAps - apsScore} points from your target — open APS planner`,
      page: 'aps',
    });
  }

  // Goal: career goal set — nudge toward My Future
  if (goals.targetCareer) {
    actionQueue.push({
      priority: 'low',
      label: `Career Goal: ${goals.targetCareer}`,
      sublabel: 'View your career roadmap and matches in My Future',
      page: 'future',
    });
  }

  const seenPages = new Set<string>();
  const dedupedQueue = actionQueue.filter(item => {
    if (seenPages.has(item.page)) return false;
    seenPages.add(item.page);
    return true;
  }).slice(0, 3);

  // ── Reusable bar component ────────────────────────────────────────────────
  function HealthBar({ pct, color }: { pct: number; color: string }) {
    return (
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    );
  }

  // ── Homework group renderer ───────────────────────────────────────────────
  function HomeworkGroup({ label, items, urgency }: { label: string; items: SchoolEvent[]; urgency: 'high' | 'mid' | 'low' }) {
    if (items.length === 0) return null;
    const labelColor = urgency === 'high' ? 'text-red-500' : urgency === 'mid' ? 'text-amber-600' : 'text-stone-500';
    const dotColor   = urgency === 'high' ? 'bg-red-400'   : urgency === 'mid' ? 'bg-amber-400'  : 'bg-stone-300';
    return (
      <div className="mb-3 last:mb-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${labelColor}`}>{label} · {items.length}</span>
        </div>
        <div className="space-y-0.5 pl-3.5">
          {items.map(ev => {
            const toggling = togglingId === ev.id;
            const done = completions.has(ev.id);
            return (
              <div key={ev.id} className="flex items-center gap-3 py-1.5">
                <button onClick={() => handleToggleDone(ev)} disabled={toggling}
                  className="shrink-0 disabled:opacity-40 transition-colors">
                  {done
                    ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                    : <Circle className="w-4.5 h-4.5 text-stone-400 hover:text-stone-500" />}
                </button>
                <p className={`flex-1 text-sm font-bold truncate ${done ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                  {ev.title}
                </p>
                {ev.description && (
                  <span className="text-[11px] text-stone-500 truncate max-w-30 hidden sm:block">{ev.description}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-6xl w-full mx-auto pb-10 space-y-5 sm:space-y-6">

      {/* ── Page header ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="flex items-start justify-between gap-4"
      >
        <div className="min-w-0">
          <span className="eyebrow">Dashboard</span>
          <h1 className="font-display font-black text-brand-dark text-2xl sm:text-3xl mt-1" style={{ letterSpacing: '-0.03em' }}>
            {(() => {
              const h = new Date().getHours();
              const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
              return <>{greeting}, <em className="font-serif-accent text-accent">{session.name}</em>.</>;
            })()}
          </h1>
          <p className="text-sm text-stone-500 mt-1.5">
            {session.school_name} · Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
          </p>
        </div>
        {apsScore !== null && (
          <div className="shrink-0 card-premium bg-white border border-brand-border rounded-[24px] px-4 py-3 text-center hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-0.5">APS</p>
            <p className="font-black text-accent text-2xl leading-none">{apsScore}</p>
          </div>
        )}
        {goals.targetCareer && !apsScore && (
          <div className="shrink-0 card-premium bg-white border border-brand-border rounded-[24px] px-4 py-3 text-center hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-0.5">Goal</p>
            <p className="font-black text-brand-dark text-sm leading-tight max-w-[120px] truncate">{goals.targetCareer}</p>
          </div>
        )}
      </motion.div>

      {/* ── Daily Focus Card ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="card-premium-dark bg-brand-dark rounded-[28px] p-6 md:p-8 relative overflow-hidden border border-white/[0.06]"
      >
        {/* Soft gold glow, top-right — same recipe as the landing hero glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(245,240,232,0.07) 0%, transparent 65%)' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Today's Focus</p>

            {focusItem ? (
              <>
                {/* Urgency badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 ${
                  focusItem.type === 'urgent' ? 'bg-red-500/20 text-red-300'
                  : focusItem.type === 'soon'   ? 'bg-amber-500/20 text-amber-300'
                  : focusItem.type === 'exam'   ? 'bg-violet-500/20 text-violet-300'
                  :                               'bg-stone-700 text-stone-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    focusItem.type === 'urgent' ? 'bg-red-400'
                    : focusItem.type === 'soon'   ? 'bg-amber-400'
                    : focusItem.type === 'exam'   ? 'bg-violet-400'
                    :                               'bg-stone-500'
                  }`} />
                  {focusItem.label} · {daysUntil(focusItem.event.event_date)}
                </div>

                <h2 className="font-display font-black text-white text-xl md:text-2xl leading-tight mb-3"
                  style={{ letterSpacing: '-0.02em' }}>
                  {focusItem.event.title}
                </h2>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-stone-500 text-sm font-medium">
                    {formatDate(focusItem.event.event_date)}
                  </span>
                </div>

                {/* Subject context — show matching subject average if available */}
                {(() => {
                  const eventTitle = focusItem.event.title.toLowerCase();
                  const matchingSubject = subjectProgress.find(s =>
                    eventTitle.includes(s.label.toLowerCase().split(' ')[0]) ||
                    s.label.toLowerCase().split(' ')[0].includes(eventTitle.split(' ')[0])
                  );
                  if (!matchingSubject) return null;
                  return (
                    <p className="text-stone-500 text-sm mt-1">
                      {matchingSubject.label} average:{' '}
                      <span className={
                        matchingSubject.pct >= 70 ? 'text-emerald-400 font-bold' :
                        matchingSubject.pct >= 50 ? 'text-amber-400 font-bold' :
                                                    'text-red-400 font-bold'
                      }>{matchingSubject.pct}%</span>
                    </p>
                  );
                })()}

                {/* Secondary tasks */}
                {pendingHomework.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-stone-800 space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-600 mb-2">Also pending</p>
                    {pendingHomework.slice(1, 4).map(hw => (
                      <div key={hw.id} className="flex items-center gap-2 text-stone-500 text-sm">
                        <span className="w-1 h-1 rounded-full bg-stone-700 shrink-0" />
                        <span className="truncate">{hw.title}</span>
                        <span className="text-stone-700 shrink-0 text-xs ml-auto">{daysUntil(hw.event_date)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="font-display font-black text-white text-xl md:text-2xl leading-tight mb-2"
                  style={{ letterSpacing: '-0.02em' }}>
                  You're all caught up.
                </h2>
                <p className="text-stone-500 text-sm">No urgent tasks. Use this time to study ahead.</p>
              </>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2.5 shrink-0 md:min-w-40 relative z-10">
            {focusItem ? (
              <>
                {(focusItem.type === 'urgent' || focusItem.type === 'soon') && (
                  <button onClick={() => onNavigate('calendar')}
                    className="group flex items-center justify-center gap-2 bg-white text-brand-dark font-black text-sm px-5 py-3 rounded-full active:scale-[0.96] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(255,255,255,0.35)] transition-all duration-300">
                    <CalendarDays className="w-4 h-4" />
                    View Calendar
                    <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                )}
                {focusItem.type === 'exam' && (
                  <button onClick={() => onNavigate('pastpapers')}
                    className="group flex items-center justify-center gap-2 bg-white text-brand-dark font-black text-sm px-5 py-3 rounded-full active:scale-[0.96] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(255,255,255,0.35)] transition-all duration-300">
                    <BookOpen className="w-4 h-4" />
                    Practice Papers
                    <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                )}
                <button onClick={() => onNavigate('library')}
                  className="group flex items-center justify-center gap-2 bg-white/10 text-white font-bold text-sm px-5 py-3 rounded-full active:scale-[0.96] hover:bg-white/20 hover:border-accent/40 transition-all duration-300 border border-white/10">
                  <BookOpen className="w-4 h-4" />
                  Open Library
                  <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </>
            ) : (
              <button onClick={() => onNavigate('library')}
                className="group flex items-center justify-center gap-2 bg-white text-brand-dark font-black text-sm px-5 py-3 rounded-full active:scale-[0.96] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(255,255,255,0.35)] transition-all duration-300">
                <BookOpen className="w-4 h-4" />
                Start Studying
                <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}

            {/* Homework completion ring — real data, quiet footer element */}
            {totalHomework > 0 && (
              <div className="flex items-center gap-3 mt-1 pt-3 border-t border-white/[0.08]">
                <div className="relative shrink-0">
                  <Ring pct={hwCompletionPct} size={40} stroke={4} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white leading-none"><Counter value={hwCompletionPct} />%</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-500 leading-none">Homework</p>
                  <p className="text-[11px] font-bold text-stone-400 mt-1">{completions.size}/{totalHomework} done</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stat cards row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Upcoming Event — dark, matches hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.04 }}
          className="card-premium-dark bg-brand-dark rounded-[24px] p-5 flex flex-col justify-between min-h-[150px] relative overflow-hidden border border-white/[0.06]"
        >
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none blur-2xl opacity-20"
            style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
          <p className="relative text-[10px] font-black uppercase tracking-[0.18em] text-stone-500 mb-2">Upcoming Event</p>
          {upcomingEvents[0] ? (() => {
            const ev = upcomingEvents[0];
            const typeColors: Record<string, string> = {
              homework: 'bg-blue-500/20 text-blue-300',
              assessment: 'bg-emerald-500/20 text-emerald-300',
              exam: 'bg-red-500/20 text-red-300',
              other: 'bg-stone-500/20 text-stone-500',
            };
            return (
              <>
                <span className={`relative self-start text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${typeColors[ev.event_type] ?? typeColors.other}`}>
                  {EVENT_LABELS[ev.event_type]}
                </span>
                <div className="relative">
                  <p className="font-black text-white text-base leading-tight mt-2 mb-1">{ev.title}</p>
                  <p className="text-stone-500 text-xs">{formatDate(ev.event_date)}</p>
                </div>
                <button onClick={() => onNavigate('calendar')}
                  className="relative self-start mt-2 text-[11px] font-black text-white/60 hover:text-accent transition-colors border border-white/10 hover:border-accent/40 rounded-lg px-2.5 py-1">
                  View in Calendar
                </button>
              </>
            );
          })() : (
            <p className="relative text-stone-600 text-sm font-bold mt-auto">No upcoming events</p>
          )}
        </motion.div>

        {/* Pending Homework — ring instead of flat number */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.08 }}
          className="card-premium bg-white border border-brand-border rounded-[24px] p-5 flex flex-col justify-between min-h-[150px]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">Pending Homework</p>
          {pendingHomework.length === 0 ? (
            <div>
              <p className="font-black text-4xl text-brand-dark"><Counter value={0} /></p>
              <p className="text-emerald-600 font-bold text-xs mt-1">All caught up</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Ring pct={hwCompletionPct} size={52} stroke={5} trackColor="rgba(28,25,23,0.08)" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-black text-lg text-brand-dark leading-none"><Counter value={pendingHomework.length} /></span>
                </div>
              </div>
              <div className="min-w-0">
                {hwToday.length > 0
                  ? <p className="text-red-500 font-black text-xs">{hwToday.length} due today</p>
                  : <p className="text-stone-500 text-xs font-bold">tasks remaining</p>
                }
              </div>
            </div>
          )}
          <button onClick={() => onNavigate('calendar')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-accent transition-colors mt-2">
            View Homework
          </button>
        </motion.div>

        {/* Average Mark — sparkline trend from real recent marks */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.12 }}
          className="card-premium bg-white border border-brand-border rounded-[24px] p-5 flex flex-col justify-between min-h-[150px]"
        >
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">Average Mark</p>
            {recentSorted.length >= 2 && (
              <div className="flex items-end gap-0.5 h-6">
                {recentSorted.slice(0, 6).reverse().map((m, i) => {
                  const p = Math.round((m.mark! / m.total) * 100);
                  return (
                    <motion.div key={i}
                      className={`w-1 rounded-full ${p >= 70 ? 'bg-emerald-400' : p >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                      initial={{ height: 0 }} animate={{ height: `${Math.max(15, p)}%` }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      style={{ maxHeight: '100%' }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          {avgMark !== null ? (
            <div>
              <p className={`font-black text-4xl ${avgStatus?.colorClass ?? 'text-brand-dark'}`}><Counter value={avgMark} suffix="%" /></p>
              {subjectProgress.length > 1 && highestSubject && lowestSubject ? (
                <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                  Best: <span className="text-stone-600 font-bold">{highestSubject.label.split(' ')[0]}</span>
                  {' · '}
                  Weakest: <span className="text-stone-600 font-bold">{lowestSubject.label.split(' ')[0]}</span>
                </p>
              ) : (
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${avgStatus?.colorClass ?? 'text-stone-500'}`}>
                  {avgStatus?.label} · {allMarks.length} assessment{allMarks.length !== 1 ? 's' : ''}
                </p>
              )}
              {apsScore !== null && (
                <p className="text-[10px] text-accent font-bold mt-0.5">APS {apsScore}</p>
              )}
            </div>
          ) : (
            <p className="text-stone-500 font-bold text-sm mt-auto">No marks yet</p>
          )}
          <button onClick={() => onNavigate('marks')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-accent transition-colors mt-2">
            View Marks
          </button>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.16 }}
          className="card-premium bg-white border border-brand-border rounded-[24px] p-5 flex flex-col justify-between min-h-[150px]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">Announcements</p>
          {announcements.length === 0 ? (
            <p className="text-stone-500 font-bold text-sm mt-auto">No announcements</p>
          ) : (
            <div>
              <p className="font-black text-4xl text-brand-dark"><Counter value={announcements.length} /></p>
              <p className="text-stone-500 text-sm mt-0.5 truncate">{announcements[0]?.title}</p>
            </div>
          )}
          <button onClick={() => onNavigate('announcements')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-accent transition-colors mt-2">
            View All
          </button>
        </motion.div>
      </div>

      {/* ── Academic Health + Calendar — two-col ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Academic Health */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-3.5 h-3.5 text-stone-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Academic Health</p>
          </div>

          <div className="space-y-4">
            {/* Homework completion */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-bold text-stone-700">Homework Completion</span>
                <span className={`text-sm font-black ${hwCompletionPct >= 70 ? 'text-emerald-600' : hwCompletionPct >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                  {hwCompletionPct}%
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-1">{completions.size} of {totalHomework} tasks done</p>
              <HealthBar pct={hwCompletionPct} color={hwCompletionPct >= 70 ? 'bg-emerald-500' : hwCompletionPct >= 40 ? 'bg-amber-400' : 'bg-red-400'} />
            </div>

            {/* Average mark */}
            {avgMark !== null && (
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-stone-700">Average Mark</span>
                  <span className={`text-sm font-black ${avgStatus?.colorClass ?? 'text-stone-700'}`}>{avgMark}%</span>
                </div>
                <p className="text-[11px] text-stone-500 mb-1">{avgStatus?.label} · {allMarks.length} assessments</p>
                <HealthBar pct={avgMark} color={avgMark >= 70 ? 'bg-emerald-500' : avgMark >= 50 ? 'bg-amber-400' : 'bg-red-400'} />
              </div>
            )}

            {/* Library progress */}
            {studyProgress.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-stone-700">Library Progress</span>
                  <span className="text-sm font-black text-stone-700">{topicsStarted}/{studyProgress.length}</span>
                </div>
                <p className="text-[11px] text-stone-500 mb-1">{topicsMastered} mastered · {topicsStarted - topicsMastered} in progress</p>
                <HealthBar pct={libraryPct} color="bg-brand-dark" />
              </div>
            )}

            {/* Upcoming assessments / workload */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-bold text-stone-700">Upcoming Assessments</span>
                <span className={`text-sm font-black ${upcomingAssessmentCount >= 3 ? 'text-red-500' : upcomingAssessmentCount >= 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {upcomingAssessmentCount}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {upcomingAssessmentCount === 0
                  ? 'No assessments or exams scheduled'
                  : upcomingAssessmentCount >= 3
                    ? 'High workload — plan your revision'
                    : 'Manageable — stay on top of prep'}
              </p>
            </div>

            {/* APS Score bar */}
            {apsScore !== null && (
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-stone-700">APS Score</span>
                  <span className="text-sm font-black text-stone-700">{apsScore}</span>
                </div>
                <p className="text-[11px] text-stone-500 mb-1">
                  {apsScore >= 35 ? 'Strong — qualifies for most programmes'
                   : apsScore >= 28 ? 'Good — qualifies for many programmes'
                   : apsScore >= 20 ? 'Building — keep improving marks'
                   : 'Getting started — every mark counts'}
                </p>
                <HealthBar pct={Math.min(100, Math.round((apsScore / 42) * 100))} color="bg-accent" />
              </div>
            )}
          </div>

          <button onClick={() => onNavigate('marks')}
            className="mt-5 text-xs text-stone-500 hover:text-stone-600 font-bold transition-colors flex items-center gap-0.5">
            View detailed marks <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Calendar Overview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.24 }}
          className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Calendar Overview</p>
            <button onClick={() => onNavigate('calendar')}
              className="text-xs text-stone-500 hover:text-stone-600 transition-colors font-bold flex items-center gap-0.5">
              Full Calendar <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Week strip */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <div key={day.dateStr} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-wide text-stone-500">{day.label}</span>
                <span className={`w-7 h-7 flex items-center justify-center text-xs font-black rounded-full transition-colors ${
                  day.isToday ? 'bg-brand-dark text-white' : 'text-stone-500'
                }`}>{day.num}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <div className="flex items-center gap-2 py-3">
                <CalendarDays className="w-8 h-8 text-stone-200" />
                <p className="text-sm font-bold text-stone-400">No upcoming events</p>
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
                    <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${typeStyle[ev.event_type]}`}>
                      {EVENT_LABELS[ev.event_type]}
                    </span>
                    <span className="text-xs text-stone-500 shrink-0">{daysUntil(ev.event_date)}</span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Homework + Subject Progress — two-col ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Homework grouped */}
        {pendingHomework.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.28 }}
            className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Pending Homework</p>
              <span className="text-[11px] font-bold text-stone-500">{completions.size} done</span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-stone-100 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hwCompletionPct}%` }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="h-full bg-brand-dark rounded-full"
              />
            </div>

            <HomeworkGroup label="Due Today" items={hwToday} urgency="high" />
            <HomeworkGroup label="Due Tomorrow" items={hwTomorrow} urgency="mid" />
            <HomeworkGroup label="This Week" items={hwLater} urgency="low" />
          </motion.div>
        )}

        {/* Subject Progress */}
        {subjectProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.32 }}
            className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Subject Breakdown</p>
              <button onClick={() => onNavigate('marks')}
                className="text-xs text-stone-500 hover:text-stone-600 font-bold transition-colors flex items-center gap-0.5">
                All Marks <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {subjectProgress.map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-stone-100 rounded-md flex items-center justify-center text-[10px] font-black text-stone-600">
                        {subjectIcon(s.label)}
                      </span>
                      <span className="text-sm font-bold text-stone-800">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-500">{s.count} assessed</span>
                      <span className={`text-sm font-black ${s.pct >= 70 ? 'text-emerald-600' : s.pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                        {s.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                      className={`h-full rounded-full ${s.pct >= 70 ? 'bg-emerald-500' : s.pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Academic Story Card ──────────────────────────────────── */}
      {academicStory.totalAssessments >= 3 && academicStory.overallAvg !== null && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.33 }}
          className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">
            Academic Story
          </p>

          {/* Main stat row */}
          <div className="flex items-end gap-3 mb-4">
            {academicStory.previousAvg !== null && academicStory.change !== null ? (
              <>
                <div className="text-center bg-stone-50 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Earlier</p>
                  <p className="font-black text-stone-500 text-2xl leading-none">{academicStory.previousAvg}%</p>
                </div>
                <div className={`font-black text-2xl pb-1 ${academicStory.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {academicStory.change >= 0 ? '↑' : '↓'}
                </div>
                <div className="text-center bg-stone-50 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Now</p>
                  <p className={`font-black text-2xl leading-none ${
                    academicStory.overallAvg >= 70 ? 'text-emerald-600' :
                    academicStory.overallAvg >= 50 ? 'text-amber-600' : 'text-red-500'
                  }`}>{academicStory.overallAvg}%</p>
                </div>
                <div className={`ml-1 px-3 py-1.5 rounded-xl text-sm font-black ${
                  academicStory.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  {academicStory.change >= 0 ? '+' : ''}{academicStory.change}%
                </div>
              </>
            ) : (
              <div className="text-center bg-stone-50 rounded-xl px-4 py-2.5">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Average</p>
                <p className={`font-black text-2xl leading-none ${
                  academicStory.overallAvg >= 70 ? 'text-emerald-600' :
                  academicStory.overallAvg >= 50 ? 'text-amber-600' : 'text-red-500'
                }`}>{academicStory.overallAvg}%</p>
              </div>
            )}
          </div>

          {/* Story bullets */}
          <div className="space-y-2">
            {academicStory.strongestGrowth && (
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-sm text-stone-600">
                  Strongest growth: <span className="font-black text-stone-900">{academicStory.strongestGrowth}</span>
                </p>
              </div>
            )}
            {academicStory.mostConsistent && academicStory.mostConsistent !== academicStory.strongestGrowth && (
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <p className="text-sm text-stone-600">
                  Most consistent: <span className="font-black text-stone-900">{academicStory.mostConsistent}</span>
                </p>
              </div>
            )}
            {academicStory.needsAttention && academicStory.needsAttention !== academicStory.strongestGrowth && (
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <p className="text-sm text-stone-600">
                  Needs attention: <span className="font-black text-stone-900">{academicStory.needsAttention}</span>
                </p>
              </div>
            )}
            <p className="text-[11px] text-stone-500 pt-1">
              Based on {academicStory.totalAssessments} assessment{academicStory.totalAssessments !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Academic Coaching Card ───────────────────────────────── */}
      {activeInterventions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.335 }}
          className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
        >
          {/* Header with impact stats */}
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Academic Coaching</p>
            {interventionImpact.totalCompleted > 0 && (
              <div className="text-right">
                <p className="text-[11px] font-black text-stone-700">{interventionImpact.totalCompleted} completed</p>
                <p className="text-[10px] font-bold text-stone-500">{interventionImpact.successRate}% success rate</p>
                {interventionImpact.avgImprovement > 0 && (
                  <p className="text-[10px] font-bold text-emerald-500">avg +{interventionImpact.avgImprovement}%</p>
                )}
              </div>
            )}
          </div>

          {/* Impact analytics row — shown once enough data exists */}
          {interventionImpact.totalCompleted >= 2 && (
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="bg-stone-50 rounded-xl p-2.5 text-center">
                <p className="text-base font-black text-stone-900">{interventionImpact.totalCompleted}</p>
                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">Completed</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                <p className="text-base font-black text-emerald-700">{interventionImpact.successRate}%</p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mt-0.5">Success</p>
              </div>
              <div className={`rounded-xl p-2.5 text-center ${interventionImpact.avgImprovement > 0 ? 'bg-blue-50' : 'bg-stone-50'}`}>
                <p className={`text-base font-black ${interventionImpact.avgImprovement > 0 ? 'text-blue-700' : 'text-stone-500'}`}>
                  {interventionImpact.avgImprovement > 0 ? `+${interventionImpact.avgImprovement}%` : '—'}
                </p>
                <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${interventionImpact.avgImprovement > 0 ? 'text-blue-400' : 'text-stone-500'}`}>Avg Gain</p>
              </div>
            </div>
          )}

          {/* Best action type — shown when data suggests a pattern */}
          {interventionImpact.bestType && interventionImpact.bestTypeGain > 0 && interventionImpact.typeEffectiveness.length >= 2 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
              <span className="text-sm">⭐</span>
              <p className="text-[11px] text-amber-800">
                <span className="font-black">Most effective for you:</span>{' '}
                {interventionImpact.bestType === 'past_paper' ? 'Past Papers' :
                 interventionImpact.bestType === 'library_topic' ? 'Library Study' :
                 interventionImpact.bestType === 'revision' ? 'Revision Sessions' : 'Resource Review'}
                {' '}(avg +{interventionImpact.bestTypeGain}%)
              </p>
            </div>
          )}

          {/* Active intervention cards */}
          <div className="space-y-3">
            {activeInterventions.slice(0, 3).map((inv) => {
              const isStarted = inv.status === 'started';
              return (
                <div key={inv.id} className={`rounded-xl border p-4 ${
                  inv.reason === 'exam_soon' || inv.reason === 'below_pass'
                    ? 'bg-red-50 border-red-200'
                    : inv.reason === 'high_risk' || inv.reason === 'declining_trend'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-stone-50 border-brand-border'
                }`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-black text-stone-900 text-sm">{inv.subject}</p>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          inv.reason === 'exam_soon' ? 'bg-red-100 text-red-700' :
                          inv.reason === 'below_pass' ? 'bg-red-100 text-red-700' :
                          inv.reason === 'high_risk' ? 'bg-amber-100 text-amber-700' :
                          'bg-stone-100 text-stone-500'
                        }`}>
                          {inv.reason === 'exam_soon' ? 'Exam Soon' :
                           inv.reason === 'below_pass' ? 'Below Pass' :
                           inv.reason === 'high_risk' ? 'High Risk' :
                           inv.reason === 'declining_trend' ? 'Declining' : 'APS Gap'}
                        </span>
                        {isStarted && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">{inv.description}</p>
                      {inv.rationale && (
                        <p className="text-[10px] text-stone-500 mt-1 italic">{inv.rationale}</p>
                      )}

                      {/* Checklist — only shown once the student has started, so
                          the card stays compact until they've committed to it */}
                      {isStarted && templates.get(inv.type) && (
                        <div className="mt-2.5 space-y-1.5">
                          {templates.get(inv.type)!.checklist.map((step, stepIdx) => {
                            const progress = inv.checklistProgress ?? templates.get(inv.type)!.checklist.map(() => false);
                            const done = progress[stepIdx] ?? false;
                            return (
                              <button
                                key={stepIdx}
                                onClick={async () => {
                                  const next = [...progress];
                                  next[stepIdx] = !done;
                                  setActiveInterventions(prev =>
                                    prev.map(i => i.id === inv.id ? { ...i, checklistProgress: next } : i)
                                  );
                                  await updateChecklistProgress(session.student_id, inv.id, next);
                                }}
                                className="flex items-start gap-2 text-left w-full group"
                              >
                                {done
                                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  : <Circle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5 group-hover:text-stone-500" />}
                                <span className={`text-[11px] ${done ? 'text-stone-500 line-through' : 'text-stone-600'}`}>
                                  {step}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await startIntervention(session.student_id, inv.id);
                        setActiveInterventions(prev =>
                          prev.map(i => i.id === inv.id ? { ...i, status: 'started' as const } : i)
                        );
                        onNavigate(inv.page);
                      }}
                      className="flex-1 py-2 rounded-xl bg-brand-dark text-white text-[11px] font-black hover:bg-stone-700 transition-colors"
                    >
                      {isStarted ? 'Continue' : 'Start'}
                    </button>
                    <button
                      onClick={async () => {
                        await completeIntervention(session.student_id, inv.id);
                        setActiveInterventions(prev => prev.filter(i => i.id !== inv.id));
                        const updated = await getCompletedInterventions(session.student_id);
                        setCompletedInterventions(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black hover:bg-emerald-100 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Intervention History Card ─────────────────────────────── */}
      {interventionOutcomes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.34 }}
          className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Improvement History</p>
          <div className="space-y-2">
            {interventionOutcomes.slice(-6).reverse().map(o => (
              <div key={o.interventionId} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                o.result === 'improved' ? 'bg-emerald-50 border-emerald-100' :
                o.result === 'declined' ? 'bg-red-50 border-red-100' :
                'bg-stone-50 border-brand-border/60'
              }`}>
                <span className={`text-base shrink-0 ${
                  o.result === 'improved' ? '' : o.result === 'declined' ? '' : ''
                }`}>
                  {o.result === 'improved' ? '✓' : o.result === 'declined' ? '↓' : '→'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-stone-900">{o.subject}</p>
                  <p className="text-[10px] text-stone-500">
                    {o.previousAvg}% → {o.newAvg}%
                  </p>
                </div>
                <span className={`text-xs font-black shrink-0 ${
                  o.result === 'improved' ? 'text-emerald-600' :
                  o.result === 'declined' ? 'text-red-500' : 'text-stone-500'
                }`}>
                  {o.improvement > 0 ? `+${o.improvement}%` : `${o.improvement}%`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Momentum Section ─────────────────────────────────────── */}
      {hasMomentum && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.34 }}
          className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">This Week</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              {
                label: 'Homework Done',
                value: completions.size,
                color: completions.size > 0 ? 'text-emerald-600' : 'text-stone-500',
              },
              {
                label: 'Topics Studied',
                value: thisWeekStarted,
                color: thisWeekStarted > 0 ? 'text-blue-600' : 'text-stone-500',
              },
              {
                label: 'Topics Mastered',
                value: thisWeekMastered,
                color: thisWeekMastered > 0 ? 'text-accent' : 'text-stone-500',
              },
              {
                label: 'Mark Trend',
                value: markTrend !== null
                  ? `${markTrend >= 0 ? '+' : ''}${markTrend.toFixed(1)}%`
                  : '—',
                color: markTrend === null ? 'text-stone-500'
                     : markTrend >= 0 ? 'text-emerald-600'
                     : 'text-red-500',
              },
            ].map(stat => (
              <div key={stat.label} className="bg-stone-50 rounded-xl px-3 py-3 text-center">
                <p className={`font-black text-xl leading-none ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {markTrend !== null && (
            <p className={`text-sm font-bold ${markTrend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {markTrend >= 2
                ? `Average trend is up ${markTrend.toFixed(1)}% — keep going.`
                : markTrend >= 0
                ? 'Average is stable — consistent effort is paying off.'
                : `Average trend is down ${Math.abs(markTrend).toFixed(1)}% — worth reviewing recent work.`}
            </p>
          )}
        </motion.div>
      )}

      {/* ── Action Queue ─────────────────────────────────────────── */}
      {dedupedQueue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.36 }}
          className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">Recommended Actions</p>
          <div className="space-y-2">
            {dedupedQueue.map((item, i) => (
              <button
                key={i}
                onClick={() => onNavigate(item.page)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors text-left group"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  item.priority === 'high' ? 'bg-red-500' :
                  item.priority === 'mid'  ? 'bg-amber-500' :
                                             'bg-stone-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-900 truncate">{item.label}</p>
                  <p className="text-xs text-stone-500 truncate">{item.sublabel}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Recent Activity + Quick Actions ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.4 }}
        className="card-premium bg-white rounded-[24px] border border-brand-border p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Recent Activity</p>
          <button onClick={() => onNavigate('marks')}
            className="text-xs text-stone-500 hover:text-stone-600 transition-colors font-bold flex items-center gap-0.5">
            View Marks <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {activity.length === 0 ? (
          <div className="flex items-center gap-2 py-3">
            <TrendingUp className="w-8 h-8 text-stone-200" />
            <p className="text-sm font-bold text-stone-400">No recent activity</p>
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
                      <p className="text-xs text-stone-500">
                        {Math.round((item.data.mark! / item.data.total) * 100)}% · {gradeLabel(item.data.mark!, item.data.total).label}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-stone-900 truncate">{item.data.title}</p>
                      <p className="text-xs text-stone-500">{timeAgo(item.ts)}</p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Contextual quick actions */}
        <div className="mt-4 pt-4 border-t border-brand-border/60 flex flex-wrap gap-2">
          {isStruggling ? (
            <>
              <button onClick={() => onNavigate('marks')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <ClipboardList className="w-3.5 h-3.5" /> Review Marks
              </button>
              <button onClick={() => onNavigate('library')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <BookOpen className="w-3.5 h-3.5" /> Open Library
              </button>
              {lowestSubjectName && (
                <button onClick={() => onNavigate('library')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[12px] font-bold transition-colors">
                  <TrendingUp className="w-3.5 h-3.5" /> {lowestSubjectName.split(' ')[0]} Resources
                </button>
              )}
            </>
          ) : hasExamSoon ? (
            <>
              <button onClick={() => onNavigate('pastpapers')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <BookOpen className="w-3.5 h-3.5" /> Practice Papers
              </button>
              <button onClick={() => onNavigate('calendar')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <CalendarDays className="w-3.5 h-3.5" /> Exam Calendar
              </button>
              <button onClick={() => onNavigate('library')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <BookOpen className="w-3.5 h-3.5" /> Revise Topics
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('marks')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <ClipboardList className="w-3.5 h-3.5" /> My Marks
              </button>
              <button onClick={() => onNavigate('library')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <BookOpen className="w-3.5 h-3.5" /> Library
              </button>
              <button onClick={() => onNavigate('future')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[12px] font-bold transition-colors">
                <TrendingUp className="w-3.5 h-3.5" /> My Future
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
