import { useEffect, useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays, ClipboardList, Megaphone, CheckCircle2, Circle,
  ChevronRight, BookOpen, TrendingUp, Activity, ArrowUpRight, Sparkles,
} from 'lucide-react';
import { CountUp } from '../../../shared/components/CountUp';
import { fetchStudentAnnouncements, type Announcement } from '../../../lib/announcements';
import {
  fetchStudentEvents, fetchStudentCompletions, markHomeworkDone, unmarkHomeworkDone,
  EVENT_LABELS, type SchoolEvent,
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

// Shimmer block — a moving highlight sweep rather than a flat gray box,
// used everywhere below in place of a full-page spinner so the hero
// (and its crest image) mount and start loading immediately instead of
// only appearing once data resolves.
export function Shimmer({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded ${className}`} style={{ background: 'var(--color-paper-raise)', ...style }}>
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

const easeOut = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Skeleton shown while the dashboard's data loads. Renders the same hero
// band (with the real crest image, so it starts downloading immediately
// on mount) plus shimmer placeholders shaped like the real card grid, so
// there's no jarring swap from "blank/spinner" to "fully populated" —
// the layout is stable and only the content fades/slides in once ready.
function StudentHomeSkeleton({ session }: { session: StudentSession }) {
  return (
    <div className="student-home min-h-full pb-16 relative">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easeOut }}
          className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          {(() => {
            const h = new Date().getHours();
            return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
          })()}, {session.name}.
        </motion.h1>
        <Shimmer className="h-3 w-24 mt-1.5" />
        <Shimmer className="h-4 w-48 mt-4" />
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1].map(i => (
            <div key={i} className="paper-card rounded p-4">
              <Shimmer className="h-3 w-16 mb-3" />
              <Shimmer className="h-6 w-2/3" />
            </div>
          ))}
        </div>
        <div className="paper-card rounded p-4 sm:p-5">
          <Shimmer className="h-3 w-32 mb-4" />
          <Shimmer className="h-3 w-full mb-2" />
          <Shimmer className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  );
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
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [pendingHomework, setPendingHomework] = useState<SchoolEvent[]>([]);
  const [recentMarks, setRecentMarks] = useState<StudentResult[]>([]);
  const [allMarks, setAllMarks] = useState<StudentResult[]>([]);
  const [completions, setCompletions] = useState<Set<number>>(new Set());
  const [studyProgress, setStudyProgress] = useState<StudyProgress[]>([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>([]);
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
        .select('subject_id, subjects(label)')
        .eq('student_id', session.student_id);
      const subjectIds = [...new Set((links ?? []).map((r: any) => r.subject_id as number))];
      const subjectLabels = [...new Set((links ?? []).map((r: any) => r.subjects?.label as string).filter(Boolean))].sort();
      setEnrolledSubjects(subjectLabels);

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
    return <StudentHomeSkeleton session={session} />;
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

  const upcomingAssessmentCount = upcomingEvents.filter(
    e => e.event_type === 'exam' || e.event_type === 'assessment'
  ).length;

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

  // ── Render ────────────────────────────────────────────────────────────────
  // "Institutional charcoal" — a crested ink hero with the Nizamiye emblem
  // embossed into the surface, flowing into a flat charcoal page. Sharp,
  // hairline-bordered cards replace soft/bubbly shadow-lift; sapphire is
  // reserved for CTAs and priority signals only.

  const heroDate = today.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  })();

  const tap = { scale: 0.97 };

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header + Today ═══════════════════════════════════════
          Level 1 (36px/600): the page title — about the student, not
          administrative metadata. School/grade/cohort now live in the
          sidebar profile instead of competing with the greeting here.
          Level 2 (20px/600): "You're all caught up" is the primary
          message this page exists to deliver — sized and weighted to
          read as the visual anchor, with the date as quiet metadata. */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          {greeting},{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
              {session.name}.
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 320 14"
              className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70"
              preserveAspectRatio="none"
            >
              <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-[12px] text-muted-2 mt-1">{heroDate}</p>

        <div className="mt-4">
          {focusItem ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  focusItem.type === 'urgent' ? 'bg-red-500'
                  : focusItem.type === 'soon' ? 'bg-amber-500'
                  : focusItem.type === 'exam' ? 'bg-violet-500'
                  :                             'bg-accent'
                }`} />
                <span className="text-[12px] font-semibold text-muted">{focusItem.label} · {daysUntil(focusItem.event.event_date)}</span>
              </div>
              <p className="text-brand-dark text-[20px] leading-snug" style={{ fontWeight: 600 }}>{focusItem.event.title}</p>
              <p className="text-muted text-[14px] mt-0.5">
                {formatDate(focusItem.event.event_date)}
                {pendingHomework.length > 1 && ` · +${pendingHomework.length - 1} more this week`}
              </p>
              <div className="flex items-center gap-4 mt-2.5">
                {(focusItem.type === 'urgent' || focusItem.type === 'soon') && (
                  <motion.button whileTap={tap} onClick={() => onNavigate('calendar')}
                    className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors"
                    style={{ color: 'var(--color-accent-soft)' }}>
                    View calendar <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                )}
                {focusItem.type === 'exam' && (
                  <motion.button whileTap={tap} onClick={() => onNavigate('pastpapers')}
                    className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors"
                    style={{ color: 'var(--color-accent-soft)' }}>
                    Practice papers <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-brand-dark text-[20px] leading-snug" style={{ fontWeight: 600 }}>You're all caught up.</p>
              <p className="text-muted text-[14px] mt-0.5">No homework due this week.</p>
              <motion.button whileTap={tap} onClick={() => onNavigate('library')}
                className="group inline-flex items-center gap-1 text-[14px] font-semibold transition-colors mt-2.5"
                style={{ color: 'var(--color-accent-soft)' }}>
                Start studying
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* ═══ Body — wide, horizontally-grouped, not one long column ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

        {/* Overview row — Upcoming / Academic average. Each label gets its
            own hand-drawn underline squiggle (same recipe as the greeting's
            amber stroke) instead of an icon badge — no icons here at all. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="paper-card rounded p-4">
            <span className="relative inline-block mb-2.5">
              <span className="text-[12px] text-muted-2">
                {upcomingEvents[0] ? "What's coming up" : 'Your week ahead'}
              </span>
              <svg aria-hidden="true" viewBox="0 0 140 8" className="absolute left-0 -bottom-1 w-full h-2 text-sky-400/60" preserveAspectRatio="none">
                <path d="M1 5C30 2 80 1 139 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            {upcomingEvents[0] ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-brand-dark text-[15px] truncate" style={{ fontWeight: 600 }}>{upcomingEvents[0].title}</p>
                <span className="text-muted-2 text-[12px] shrink-0">{formatDate(upcomingEvents[0].event_date)}</span>
              </div>
            ) : (
              <p className="text-brand-dark text-[15px]" style={{ fontWeight: 600 }}>Nothing on the horizon — clear sailing</p>
            )}
          </div>
          <div className="paper-card rounded p-4">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="relative inline-block">
                <span className="text-[12px] text-muted-2">Academic average</span>
                <svg aria-hidden="true" viewBox="0 0 140 8" className="absolute left-0 -bottom-1 w-full h-2 text-emerald-400/60" preserveAspectRatio="none">
                  <path d="M1 5C30 2 80 1 139 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              {markTrend !== null && (
                <span className={`text-[11px] font-semibold ${markTrend >= 0 ? '' : 'text-red-600'}`} style={markTrend >= 0 ? { color: 'var(--color-success)' } : undefined}>
                  {markTrend >= 0 ? '+' : ''}{markTrend.toFixed(1)}%
                </span>
              )}
            </div>
            {avgMark !== null ? (
              <div className="flex items-baseline gap-2">
                <p className="text-[28px] leading-none" style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                  <CountUp value={avgMark} suffix="%" />
                </p>
                <p className="text-muted text-[12px]">{avgStatus?.label} · {allMarks.length} assessment{allMarks.length !== 1 ? 's' : ''}</p>
              </div>
            ) : (
              <p className="text-brand-dark text-[15px]" style={{ fontWeight: 600 }}>Waiting on your first mark</p>
            )}
          </div>
        </div>

        {/* Academic progress — heading, then the important number grouped
            with its own label (not floated to the opposite corner), then
            supporting rows below a divider. */}
        <div className="paper-card rounded p-4 sm:p-5">
          <p className="text-[17px] text-brand-dark mb-3" style={{ fontWeight: 600 }}>Academic progress</p>

          {avgMark !== null && (
            <div className="mb-3">
              <p className="text-[12px] text-muted-2">Overall average</p>
              <p className="text-[32px] leading-none mt-0.5" style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                <CountUp value={avgMark} suffix="%" />
              </p>
            </div>
          )}

          <div className="divide-y divide-brand-border border-t border-brand-border">
            {(academicStory.strongestGrowth || academicStory.needsAttention) && (
              <div className="py-2.5 flex items-center justify-between gap-3">
                <span className="text-[13px] text-muted">Current focus</span>
                <span className="text-[13px] font-medium text-brand-dark text-right">
                  {academicStory.needsAttention ?? academicStory.strongestGrowth}
                </span>
              </div>
            )}
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-[13px] text-muted">Upcoming assessments</span>
              <span className="text-[13px] font-medium text-brand-dark">
                {upcomingAssessmentCount === 0 ? 'None scheduled' : `${upcomingAssessmentCount} scheduled`}
              </span>
            </div>
          </div>
        </div>

        {/* Recent announcements / Pending homework — matched pair when both
            exist; if homework is empty, announcements pairs with Recent
            Activity instead so the row never leaves a bare gap next to a
            lone half-width card. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="paper-card rounded p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[17px] text-brand-dark" style={{ fontWeight: 600 }}>Recent announcements</p>
              <motion.button whileTap={tap} onClick={() => onNavigate('announcements')}
                className="text-[13px] font-medium text-muted hover:text-accent-soft transition-colors">
                View all
              </motion.button>
            </div>
            {announcements.length === 0 ? (
              <p className="text-muted text-[14px] py-1">No announcements yet.</p>
            ) : (
              <div className="divide-y divide-brand-border">
                {announcements.slice(0, 3).map((a, i) => (
                  <button key={i} onClick={() => onNavigate('announcements')}
                    className="w-full text-left py-2.5 flex items-start justify-between gap-3 group">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-brand-dark truncate group-hover:text-accent-soft transition-colors">{a.title}</p>
                      {a.body && <p className="text-[13px] text-muted truncate mt-0.5">{a.body}</p>}
                    </div>
                    <span className="text-[12px] text-muted-2 shrink-0">{timeAgo(a.created_at)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {pendingHomework.length > 0 ? (
            <div className="paper-card rounded p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[17px] text-brand-dark" style={{ fontWeight: 600 }}>Pending homework</p>
                <span className="text-[13px] text-muted">{completions.size} done</span>
              </div>
              <HomeworkGroup label="Due Today" items={hwToday} urgency="high" />
              <HomeworkGroup label="Due Tomorrow" items={hwTomorrow} urgency="mid" />
              <HomeworkGroup label="This Week" items={hwLater} urgency="low" />
            </div>
          ) : (
            <div className="paper-card rounded p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[17px] text-brand-dark" style={{ fontWeight: 600 }}>Recent activity</p>
                <motion.button whileTap={tap} onClick={() => onNavigate('marks')}
                  className="text-[13px] font-medium text-muted hover:text-accent-soft transition-colors">
                  My marks
                </motion.button>
              </div>
              {activity.length === 0 ? (
                <p className="text-muted text-[14px] py-1">No recent activity.</p>
              ) : (
                <div className="divide-y divide-brand-border">
                  {activity.slice(0, 3).map((item, i) => (
                    <div key={i} className="py-2.5 flex items-start justify-between gap-3">
                      {item.kind === 'mark' ? (
                        <>
                          <p className="text-[14px] font-medium text-brand-dark truncate">
                            {item.data.subject_label}
                            <span className="text-muted font-normal"> · {gradeLabel(item.data.mark!, item.data.total).label}</span>
                          </p>
                          <span className="text-[12px] text-muted-2 shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {item.data.mark}/{item.data.total}
                          </span>
                        </>
                      ) : (
                        <>
                          <p className="text-[14px] font-medium text-brand-dark truncate">{item.data.title}</p>
                          <span className="text-[12px] text-muted-2 shrink-0">{timeAgo(item.ts)}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ Subjects + Recent Activity — matched pair ═════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

          {enrolledSubjects.length > 0 && (() => {
            // Union of every subject the student is actually enrolled in
            // (teacher_students — always accurate, even before any marks
            // exist) with subjectProgress (mark stats where available), so
            // subjects with no marks yet still show up instead of being
            // silently dropped.
            const progressByLabel = new Map(subjectProgress.map(s => [s.label, s]));
            const allSubjectRows = enrolledSubjects.map(label => progressByLabel.get(label) ?? { label, pct: 0, count: 0 });
            return (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.34 }}
              className="paper-card rounded p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(31,36,33,0.4)]">My Subjects</p>
                <span className="flex-1 h-px bg-brand-border" />
                <motion.button whileTap={tap} onClick={() => onNavigate('marks')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-accent-soft transition-colors">
                  All marks <ArrowUpRight className="w-3 h-3" />
                </motion.button>
              </div>
              <div className="space-y-1">
                {allSubjectRows.map(s => {
                  const hasMarks = s.count > 0;
                  const isOpen = expandedSubject === s.label;
                  const subjectMarks = allMarks
                    .filter(m => (m.subject_label || 'Other') === s.label)
                    .sort((a, b) => b.created_at.localeCompare(a.created_at));
                  return (
                    <div key={s.label} className="border-b border-brand-border last:border-0">
                      <button
                        type="button"
                        onClick={() => setExpandedSubject(isOpen ? null : s.label)}
                        className="w-full text-left py-2 group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-stone-500 transition-colors group-hover:text-accent-soft"
                              style={{ background: 'var(--color-paper-raise)' }}>
                              {subjectIcon(s.label)}
                            </span>
                            <span className="text-sm font-bold text-stone-700">{s.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasMarks ? (
                              <>
                                <span className="text-[11px] text-stone-400">{s.count} assessed</span>
                                <span className={`text-sm font-black ${s.pct >= 70 ? 'text-emerald-600' : s.pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                                  {s.pct}%
                                </span>
                              </>
                            ) : (
                              <span className="text-[11px] text-stone-400">No marks yet</span>
                            )}
                            <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronRight className="w-3 h-3 text-stone-300" />
                            </motion.span>
                          </div>
                        </div>
                        {hasMarks && (
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-paper-raise)' }}>
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                              transition={{ duration: 0.8, ease }}
                              className={`h-full rounded-full ${s.pct >= 70 ? 'bg-emerald-500' : s.pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                            />
                          </div>
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3 pl-7 space-y-1.5">
                              {subjectMarks.slice(0, 5).map((m, i) => (
                                <div key={i} className="flex items-center justify-between text-[12px]">
                                  <span className="text-stone-500 truncate">{m.sheet_title}</span>
                                  <span className="font-bold text-stone-600 shrink-0 ml-2">{m.mark}/{m.total}</span>
                                </div>
                              ))}
                              {subjectMarks.length === 0 && (
                                <p className="text-[12px] text-stone-400">No individual marks recorded</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            );
          })()}

          {/* Recent Activity — matched pair with My Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.38 }}
            className="paper-card rounded p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Recent Activity</p>
              <motion.button whileTap={tap} onClick={() => onNavigate('marks')}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-stone-500 hover:text-accent-soft transition-colors">
                My marks <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {activity.length === 0 ? (
              <div className="flex items-center gap-3 py-3">
                <TrendingUp className="w-8 h-8 text-stone-200" />
                <p className="text-[14px] font-semibold text-[rgba(31,36,33,0.45)]">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-1">
                {activity.map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.41 + i * 0.04 }}
                    className={`flex items-start gap-3 py-2 ${i > 0 ? 'border-t' : ''}`}
                    style={{ borderColor: 'var(--color-brand-border)' }}>
                    <div className="flex-1 min-w-0 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      {item.kind === 'mark' ? (
                        <>
                          <p className="text-[14px] font-bold text-brand-dark truncate">
                            {item.data.subject_label}
                            <span className="font-semibold text-[rgba(31,36,33,0.5)]"> · {gradeLabel(item.data.mark!, item.data.total).label}</span>
                          </p>
                          <p className="text-[13px] font-black shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {item.data.mark}<span className="text-[rgba(31,36,33,0.4)] font-bold">/{item.data.total}</span>
                            <span className="ml-1.5 text-[rgba(31,36,33,0.45)] font-bold">{Math.round((item.data.mark! / item.data.total) * 100)}%</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[14px] font-bold text-brand-dark truncate">{item.data.title}</p>
                          <p className="text-[12px] font-semibold text-[rgba(31,36,33,0.4)] shrink-0">{timeAgo(item.ts)}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ═══ Academic Coaching (+ history) ═══════════════════════ */}
        {(activeInterventions.length > 0 || interventionOutcomes.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.36 }}
            className="paper-card rounded p-5 sm:p-6"
          >
            <div className="flex items-start gap-2.5 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(31,36,33,0.4)]">Coaching</p>
              <span className="flex-1 h-px bg-brand-border mt-1" />
              {interventionImpact.totalCompleted > 0 && (
                <div className="text-right">
                  <p className="text-[11px] font-black text-stone-600">{interventionImpact.totalCompleted} completed · {interventionImpact.successRate}% success</p>
                  {interventionImpact.avgImprovement > 0 && (
                    <p className="text-[10px] font-bold text-emerald-600">avg +{interventionImpact.avgImprovement}%</p>
                  )}
                </div>
              )}
            </div>

            {interventionImpact.bestType && interventionImpact.bestTypeGain > 0 && interventionImpact.typeEffectiveness.length >= 2 && (
              <div className="rounded px-3.5 py-2.5 mb-4 flex items-center gap-2 border border-amber-100 bg-amber-50">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-800">
                  <span className="font-black">Most effective for you:</span>{' '}
                  {interventionImpact.bestType === 'past_paper' ? 'Past Papers' :
                   interventionImpact.bestType === 'library_topic' ? 'Library Study' :
                   interventionImpact.bestType === 'revision' ? 'Revision Sessions' : 'Resource Review'}
                  {' '}(avg +{interventionImpact.bestTypeGain}%)
                </p>
              </div>
            )}

            {/* Active interventions */}
            {activeInterventions.length > 0 && (
              <div className="space-y-3">
                {activeInterventions.slice(0, 3).map((inv) => {
                  const isStarted = inv.status === 'started';
                  return (
                    <div key={inv.id} className={`rounded border p-4 ${
                      inv.reason === 'exam_soon' || inv.reason === 'below_pass'
                        ? 'bg-red-50 border-red-100'
                        : inv.reason === 'high_risk' || inv.reason === 'declining_trend'
                        ? 'bg-amber-50 border-amber-100'
                        : 'border-brand-border'
                    }`} style={inv.reason !== 'exam_soon' && inv.reason !== 'below_pass' && inv.reason !== 'high_risk' && inv.reason !== 'declining_trend'
                        ? { background: 'var(--color-paper-raise)' } : undefined}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-black text-stone-800 text-sm">{inv.subject}</p>
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
                            <p className="text-[10px] text-stone-400 mt-1 italic">{inv.rationale}</p>
                          )}

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
                                      : <Circle className="w-3.5 h-3.5 text-stone-300 shrink-0 mt-0.5 group-hover:text-stone-400" />}
                                    <span className={`text-[11px] ${done ? 'text-stone-400 line-through' : 'text-stone-600'}`}>
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
                        <motion.button whileTap={tap}
                          onClick={async () => {
                            await startIntervention(session.student_id, inv.id);
                            setActiveInterventions(prev =>
                              prev.map(i => i.id === inv.id ? { ...i, status: 'started' as const } : i)
                            );
                            onNavigate(inv.page);
                          }}
                          className="flex-1 py-2 rounded bg-brand-dark text-white text-[11px] font-black hover:opacity-90 transition-opacity"
                        >
                          {isStarted ? 'Continue' : 'Start'}
                        </motion.button>
                        <motion.button whileTap={tap}
                          onClick={async () => {
                            await completeIntervention(session.student_id, inv.id);
                            setActiveInterventions(prev => prev.filter(i => i.id !== inv.id));
                            const updated = await getCompletedInterventions(session.student_id);
                            setCompletedInterventions(updated);
                          }}
                          className="px-3 py-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black hover:bg-emerald-100 transition-colors"
                        >
                          Done
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Folded-in history */}
            {interventionOutcomes.length > 0 && (
              <div className={activeInterventions.length > 0 ? 'mt-5 pt-4 border-t border-brand-border' : ''}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400 mb-2.5">History</p>
                <div className="space-y-1.5">
                  {interventionOutcomes.slice(-4).reverse().map(o => (
                    <motion.div key={o.interventionId} whileHover={{ x: 2 }} className="flex items-center gap-3 rounded px-3 py-2"
                      style={{ background: 'var(--color-paper-raise)' }}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        o.result === 'improved' ? 'bg-emerald-500' : o.result === 'declined' ? 'bg-red-400' : 'bg-stone-300'
                      }`} />
                      <p className="flex-1 min-w-0 text-xs font-bold text-stone-700 truncate">
                        {o.subject} <span className="text-stone-400 font-medium">{o.previousAvg}% → {o.newAvg}%</span>
                      </p>
                      <span className={`text-xs font-black shrink-0 ${
                        o.result === 'improved' ? 'text-emerald-600' : o.result === 'declined' ? 'text-red-500' : 'text-stone-400'
                      }`}>
                        {o.improvement > 0 ? `+${o.improvement}%` : `${o.improvement}%`}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ Recommended actions ═════════════════════════════════ */}
        {dedupedQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.38 }}
            className="paper-card rounded p-5 sm:p-6"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(31,36,33,0.4)]">Recommended</p>
              <span className="flex-1 h-px bg-brand-border" />
            </div>
            <div className="space-y-1">
              {dedupedQueue.map((item, i) => (
                <motion.button whileTap={tap}
                  key={i}
                  onClick={() => onNavigate(item.page)}
                  className="w-full flex items-center gap-3 p-3 rounded border border-transparent transition-all text-left group hover:bg-blue-50/40 hover:border-blue-100"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'mid'  ? 'bg-amber-500' :
                                               'bg-stone-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-800 truncate">{item.label}</p>
                    <p className="text-xs text-stone-400 truncate">{item.sublabel}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-accent-soft group-hover:translate-x-0.5 transition-all shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
