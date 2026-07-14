import { useEffect, useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays, ClipboardList, Megaphone, CheckCircle2, Circle,
  ChevronRight, BookOpen, TrendingUp, Activity, ArrowUpRight, Sparkles,
} from 'lucide-react';
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
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="student-home min-h-full pb-16 relative">
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-emblem.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.78 : 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.74) 0%, rgba(21,23,28,0.52) 35%, rgba(21,23,28,0.22) 62%, rgba(21,23,28,0.56) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0) 0%, transparent 38%, rgba(21,23,28,0.78) 100%)' }} />
        </div>
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut }}
            className="flex items-center gap-2 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 leading-none whitespace-nowrap">
              {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
            <p className="text-[11px] text-white/45 font-medium truncate">
              {session.school_name} · Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
            </p>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut, delay: 0.06 }}
            className="font-display font-extrabold text-white text-[32px] sm:text-[44px] mt-4 leading-[1.08]"
            style={{ letterSpacing: '-0.025em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
            {(() => {
              const h = new Date().getHours();
              return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
            })()}, {session.name}.
          </motion.h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="paper-card rounded p-5 sm:p-6">
          <Shimmer className="h-3 w-24 mb-4" />
          <Shimmer className="h-6 w-2/3 mb-2" />
          <Shimmer className="h-4 w-1/3" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.16 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[0, 1].map(i => (
            <div key={i} className="paper-card rounded p-5 h-full min-h-[160px]">
              <Shimmer className="h-3 w-16 mb-4" />
              <Shimmer className="h-8 w-1/2 mb-2" />
              <Shimmer className="h-3 w-2/3" />
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.22 }}
          className="paper-card rounded p-5 sm:p-7">
          <Shimmer className="h-3 w-20 mb-6" />
          <div className="flex items-center gap-8">
            <Shimmer className="w-32 h-32 rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-5/6" />
              <Shimmer className="h-3 w-2/3" />
            </div>
          </div>
        </motion.div>
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
  const [announcementExpanded, setAnnouncementExpanded] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [ringMetricIndex, setRingMetricIndex] = useState(0);
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

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">

        {/* Full-bleed emblem strip — the fabric/crest photo run edge-to-edge
            behind a light charcoal scrim, so the crest itself stays
            genuinely visible rather than buried under a near-opaque wash */}
        <div className="absolute inset-0 pointer-events-none">
          <img src="/images/nizamiye-emblem.png" alt=""
            className="w-full h-full object-cover opacity-[0.78]" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.74) 0%, rgba(21,23,28,0.52) 35%, rgba(21,23,28,0.22) 62%, rgba(21,23,28,0.56) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0) 0%, transparent 38%, rgba(21,23,28,0.78) 100%)' }} />
        </div>
        {/* Faint sapphire wash, low + far corner — institutional, not glowy */}
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">

          {/* Date row — quiet, single line, no longer competing with the greeting */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 leading-none whitespace-nowrap">{heroDate}</p>
            <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
            <p className="text-[11px] text-white/45 font-medium truncate">
              {session.school_name} · Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
            </p>
          </motion.div>

          {/* Greeting row — the dominant element, badge now sits beside it
              at the same visual weight instead of pulling focus upward.
              On mobile the badge drops below the greeting instead of
              disappearing, so APS/goal info isn't lost on small screens. */}
          <div className="flex flex-wrap items-end justify-between gap-3 mt-4">
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.06 }}
              className="font-display font-extrabold text-white text-[26px] sm:text-[44px] leading-[1.1] min-w-0"
              style={{ letterSpacing: '-0.025em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}
            >
              {greeting}, {session.name}.
            </motion.h1>

            {apsScore !== null ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.1 }}
                className="shrink-0 border border-white/15 bg-white/[0.06] rounded px-3.5 py-2 sm:px-4 sm:py-2.5 text-center sm:mb-1"
              >
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">APS</p>
                <p className="font-black text-base sm:text-xl leading-none mt-1 text-white">{apsScore}</p>
              </motion.div>
            ) : goals.targetCareer ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.1 }}
                className="shrink-0 border border-white/15 bg-white/[0.06] rounded px-3.5 py-2 sm:px-4 sm:py-2.5 text-center max-w-[140px] sm:mb-1"
              >
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">Goal</p>
                <p className="font-black text-white text-[11px] sm:text-xs leading-tight mt-1 truncate">{goals.targetCareer}</p>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ═══ Body — white page ═══════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-4 sm:space-y-6 pt-5 sm:pt-8">

        {/* Today's Focus — moved out of the hero into its own card so the
            banner stays a clean crest strip and this reads as a distinct,
            actionable module */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.08 }}
          className="paper-card focus-emphasis rounded p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(31,36,33,0.4)]">Today's Focus</p>
            <span className="flex-1 h-px" style={{ background: 'var(--color-brand-border)' }} />
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[rgba(31,36,33,0.4)] hidden sm:inline-flex">
              <CalendarDays className="w-3 h-3" />
              {heroDate}
            </span>
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-5 md:gap-8 md:items-center">
            <div className="min-w-0 md:border-r md:border-[var(--color-brand-border)] md:pr-8">
              {focusItem ? (
                <>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-[0.14em] mb-3 border ${
                    focusItem.type === 'urgent' ? 'border-red-200 bg-red-50 text-red-600'
                    : focusItem.type === 'soon' ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : focusItem.type === 'exam' ? 'border-violet-200 bg-violet-50 text-violet-700'
                    :                             'border-brand-border bg-[var(--color-paper-raise)] text-stone-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      focusItem.type === 'urgent' ? 'bg-red-500'
                      : focusItem.type === 'soon' ? 'bg-amber-500'
                      : focusItem.type === 'exam' ? 'bg-violet-500'
                      :                             'bg-stone-400'
                    }`} />
                    {focusItem.label} · {daysUntil(focusItem.event.event_date)}
                  </div>

                  <h2 className="font-display font-bold text-brand-dark text-xl sm:text-2xl leading-tight" style={{ letterSpacing: '-0.01em' }}>
                    {focusItem.event.title}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1.5">{formatDate(focusItem.event.event_date)}</p>

                  {(() => {
                    const eventTitle = focusItem.event.title.toLowerCase();
                    const matching = subjectProgress.find(s =>
                      eventTitle.includes(s.label.toLowerCase().split(' ')[0]) ||
                      s.label.toLowerCase().split(' ')[0].includes(eventTitle.split(' ')[0])
                    );
                    if (!matching) return null;
                    return (
                      <p className="text-stone-400 text-sm mt-1">
                        {matching.label} average:{' '}
                        <span className={`font-bold ${
                          matching.pct >= 70 ? 'text-emerald-600' : matching.pct >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>{matching.pct}%</span>
                      </p>
                    );
                  })()}

                  {pendingHomework.length > 1 && (
                    <div className="mt-4 border border-brand-border bg-[var(--color-paper-raise)] rounded px-4 py-3 space-y-1.5 max-w-md">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-1">Also pending</p>
                      {pendingHomework.slice(1, 4).map(hw => (
                        <div key={hw.id} className="flex items-center gap-2 text-stone-500 text-[13px]">
                          <span className="w-1 h-1 rounded-full bg-stone-300 shrink-0" />
                          <span className="truncate">{hw.title}</span>
                          <span className="text-stone-300 shrink-0 text-[11px] ml-auto">{daysUntil(hw.event_date)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <h2 className="font-display font-semibold text-brand-dark text-lg leading-tight" style={{ letterSpacing: '-0.01em' }}>
                    You're all caught up.
                  </h2>
                  <p className="text-[rgba(31,36,33,0.55)] text-[13px] mt-0.5 leading-relaxed">No urgent tasks — a good moment to study ahead.</p>
                </div>
              )}
            </div>

            {/* CTA column */}
            <div className="flex flex-col gap-2.5 shrink-0 md:min-w-44">
              {focusItem ? (
                <>
                  {(focusItem.type === 'urgent' || focusItem.type === 'soon') && (
                    <motion.button whileTap={tap} whileHover={{ y: -1 }} onClick={() => onNavigate('calendar')}
                      className="edge-glow group flex items-center justify-center gap-2 bg-accent text-white font-bold text-sm px-5 py-3 rounded transition-colors duration-200 hover:bg-[var(--color-accent-soft)]">
                      <CalendarDays className="w-4 h-4" />
                      View Calendar
                      <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  )}
                  {focusItem.type === 'exam' && (
                    <motion.button whileTap={tap} whileHover={{ y: -1 }} onClick={() => onNavigate('pastpapers')}
                      className="edge-glow group flex items-center justify-center gap-2 bg-accent text-white font-bold text-sm px-5 py-3 rounded transition-colors duration-200 hover:bg-[var(--color-accent-soft)]">
                      <BookOpen className="w-4 h-4" />
                      Practice Papers
                      <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  )}
                  <motion.button whileTap={tap} whileHover={{ y: -1 }} onClick={() => onNavigate('library')}
                    className="group flex items-center justify-center gap-2 bg-[var(--color-paper-raise)] text-brand-dark font-semibold text-sm px-5 py-3 rounded hover:bg-brand-border transition-colors duration-200 border border-brand-border shadow-[0_1px_2px_rgba(21,23,28,0.06),0_6px_16px_-8px_rgba(21,23,28,0.2)]">
                    <BookOpen className="w-4 h-4" />
                    Open Library
                    <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </>
              ) : (
                <motion.button whileTap={tap} whileHover={{ y: -1 }} onClick={() => onNavigate('library')}
                  className="edge-glow group flex items-center justify-center gap-2 bg-accent text-white font-bold text-sm px-5 py-3 rounded transition-colors duration-200 hover:bg-[var(--color-accent-soft)]">
                  <BookOpen className="w-4 h-4" />
                  Start Studying
                  <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              )}

              {totalHomework > 0 && (
                <div className="flex items-center gap-3 mt-1 pt-3 border-t border-brand-border">
                  <div className="relative shrink-0">
                    <Ring pct={hwCompletionPct} size={40} stroke={4} trackColor="rgba(21,23,28,0.08)" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-black text-brand-dark leading-none"><Counter value={hwCompletionPct} />%</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 leading-none">Homework</p>
                    <p className="text-[11px] font-bold text-stone-500 mt-1">{completions.size}/{totalHomework} done</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stat strip — two richer cards instead of four interchangeable
            tiles, each with its own internal layout so they don't read as
            the same template repeated. "Today" groups the two time/task
            signals (what's next, what's due); "Marks & News" groups the
            two check-in signals (how am I doing, what did I miss). */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

          {/* Today — upcoming event (top) + homework ring (bottom),
              split by a hairline divider inside one card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.12 }}
            className="paper-card rounded flex flex-col h-full overflow-hidden"
          >
            <div className="p-5 pb-4 flex-1">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Next up</p>
              </div>
              {upcomingEvents[0] ? (() => {
                const ev = upcomingEvents[0];
                const typeColors: Record<string, string> = {
                  homework: 'text-blue-600', assessment: 'text-emerald-600', exam: 'text-red-600', other: 'text-[rgba(31,36,33,0.5)]',
                };
                return (
                  <div className="flex items-center justify-between gap-4 mt-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-dark text-[16px] leading-snug truncate">{ev.title}</p>
                      <span className={`text-[11px] font-bold uppercase tracking-wide ${typeColors[ev.event_type] ?? typeColors.other}`}>
                        {EVENT_LABELS[ev.event_type]}
                      </span>
                    </div>
                    <span className="text-[rgba(31,36,33,0.45)] text-[12px] font-semibold shrink-0">{formatDate(ev.event_date)}</span>
                  </div>
                ) ;
              })() : (
                <p className="text-[rgba(31,36,33,0.5)] text-[14px] mt-3">Nothing scheduled — your upcoming events will appear here.</p>
              )}
            </div>

            <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}>
              <div className="flex items-center gap-3.5">
                {pendingHomework.length === 0 ? (
                  <>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-brand-dark font-semibold text-[13px]">Homework — all caught up</p>
                      <p className="text-[rgba(31,36,33,0.4)] text-[11px]">Nothing due this week.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative shrink-0">
                      <Ring pct={hwCompletionPct} size={40} stroke={4} trackColor="rgba(10,14,26,0.08)" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-black text-[13px] text-brand-dark leading-none"><Counter value={pendingHomework.length} /></span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-brand-dark leading-snug">
                        {hwToday.length > 0
                          ? <span className="text-red-600">{hwToday.length} homework due today</span>
                          : 'Homework — tasks remaining'}
                      </p>
                      <p className="text-[11px] text-[rgba(31,36,33,0.45)]">{completions.size}/{totalHomework} done</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Marks & News — average mark (with sparkline) on the left,
              announcement preview on the right; the two "check in on"
              signals share one card with a vertical divider on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            layout
            transition={{ duration: 0.45, ease, delay: 0.16 }}
            className="paper-card rounded flex flex-col sm:flex-row h-full overflow-hidden"
          >
            {/* Average */}
            <div className="p-5 flex-1 flex flex-col sm:border-r" style={{ borderColor: 'var(--color-brand-border)' }}>
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Average</p>
                {recentSorted.length >= 2 && (
                  <div className="flex items-end gap-[3px] h-5" title="Last 6 assessments">
                    {recentSorted.slice(0, 6).reverse().map((m, i) => {
                      const p = Math.round((m.mark! / m.total) * 100);
                      return (
                        <motion.div key={i}
                          className={`w-[3px] rounded-full ${p >= 70 ? 'bg-emerald-400' : p >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                          initial={{ height: 0 }} animate={{ height: `${Math.max(15, p)}%` }}
                          whileHover={{ scaleY: 1.15 }}
                          transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          style={{ maxHeight: '100%', transformOrigin: 'bottom' }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              {avgMark !== null ? (
                <div className="flex-1 flex flex-col justify-center mt-1">
                  <p className={`font-black text-4xl ${avgStatus?.colorClass ?? 'text-brand-dark'}`}><Counter value={avgMark} suffix="%" /></p>
                  {subjectProgress.length > 1 && highestSubject && lowestSubject ? (
                    <p className="text-[11px] text-[rgba(31,36,33,0.5)] mt-1 leading-snug">
                      Best <span className="text-[rgba(31,36,33,0.75)] font-bold">{highestSubject.label.split(' ')[0]}</span>
                      {' · '}
                      Weakest <span className="text-[rgba(31,36,33,0.75)] font-bold">{lowestSubject.label.split(' ')[0]}</span>
                    </p>
                  ) : (
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${avgStatus?.colorClass ?? 'text-[rgba(31,36,33,0.4)]'}`}>
                      {avgStatus?.label} · {allMarks.length} assessment{allMarks.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center py-2">
                  <p className="text-brand-dark font-semibold text-[15px]">No marks yet</p>
                  <p className="text-[rgba(31,36,33,0.4)] text-[12px] leading-snug mt-0.5">Appears once your first assessment is marked.</p>
                </div>
              )}
              <motion.button whileTap={tap} whileHover={{ y: -1 }} onClick={() => onNavigate('marks')}
                className="self-end mt-auto pt-3 inline-flex items-center gap-1 text-[12px] font-bold px-3 py-2 rounded transition-colors"
                style={{ color: 'var(--color-accent-foreground)', background: 'var(--color-accent)' }}>
                My marks <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Announcements */}
            <div
              className="p-5 flex-1 flex flex-col cursor-pointer"
              onClick={() => announcements.length > 0 && setAnnouncementExpanded(v => !v)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Announcements</p>
                {announcements.length > 0 && (
                  <motion.span animate={{ rotate: announcementExpanded ? 90 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronRight className="w-4 h-4 text-[rgba(31,36,33,0.35)]" />
                  </motion.span>
                )}
              </div>
              {announcements.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center py-2">
                  <p className="text-brand-dark font-semibold text-[15px]">Nothing new</p>
                  <p className="text-[rgba(31,36,33,0.4)] text-[12px] leading-snug mt-0.5">School announcements will land here.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center min-w-0 mt-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-black text-2xl text-brand-dark leading-none"><Counter value={announcements.length} /></p>
                    <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>unread</p>
                  </div>
                  <p className="text-[rgba(31,36,33,0.8)] text-[14px] font-bold mt-1.5 truncate">{announcements[0]?.title}</p>
                  <p className="text-[rgba(31,36,33,0.45)] text-[12px] mt-0.5">{timeAgo(announcements[0].created_at)}</p>
                  <AnimatePresence initial={false}>
                    {announcementExpanded && announcements[0]?.body && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25, ease }}
                        className="text-[rgba(31,36,33,0.6)] text-[13px] leading-relaxed overflow-hidden"
                        onClick={e => e.stopPropagation()}
                      >
                        {announcements[0].body}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
              <motion.button whileTap={tap} whileHover={{ y: -1 }} onClick={e => { e.stopPropagation(); onNavigate('announcements'); }}
                className="self-end mt-auto pt-3 inline-flex items-center gap-1 text-[12px] font-bold px-3 py-2 rounded transition-colors"
                style={{ color: 'var(--color-accent-foreground)', background: 'var(--color-accent)' }}>
                Read all <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ═══ Progress — the one consolidated panel ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.26 }}
          className="paper-card rounded p-5 sm:p-7"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Progress</p>
            <span className="flex-1 h-px bg-brand-border" />
            {markTrend !== null && (
              <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded ${
                markTrend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
              }`}>
                <TrendingUp className={`w-3 h-3 ${markTrend < 0 ? 'rotate-180' : ''}`} />
                {markTrend >= 0 ? '+' : ''}{markTrend.toFixed(1)}%
              </span>
            )}
          </div>

          <div className="grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-start">

            {/* Big ring — tap to cycle through average mark / homework% / APS,
                so the centrepiece is an interactive dial rather than a
                static readout. Dots below show which metric is active. */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 sm:gap-5 lg:gap-3 lg:pr-2">
              {(() => {
                const metrics = [
                  { key: 'avg' as const, pct: avgMark, label: 'average', show: avgMark !== null,
                    color: avgStatus?.colorClass ?? 'text-brand-dark', display: avgMark !== null ? `${avgMark}%` : '—' },
                  { key: 'hw' as const, pct: hwCompletionPct, label: 'homework', show: totalHomework > 0,
                    color: hwCompletionPct >= 70 ? 'text-emerald-600' : hwCompletionPct >= 40 ? 'text-amber-600' : 'text-red-500',
                    display: `${hwCompletionPct}%` },
                  { key: 'aps' as const, pct: apsScore !== null ? Math.round((apsScore / 42) * 100) : 0, label: 'APS score', show: apsScore !== null,
                    color: 'text-accent', display: apsScore !== null ? `${apsScore}` : '—' },
                ].filter(m => m.show);
                const active = metrics[ringMetricIndex % Math.max(1, metrics.length)] ?? metrics[0];
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => metrics.length > 1 && setRingMetricIndex(i => (i + 1) % metrics.length)}
                      className={`relative shrink-0 rounded-full ${metrics.length > 1 ? 'cursor-pointer' : 'cursor-default'}`}
                      aria-label="Cycle progress metric"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active?.key ?? 'empty'}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: 0.28, ease }}
                        >
                          <Ring pct={active?.pct ?? 0} size={128} stroke={10} trackColor="rgba(21,23,28,0.07)" />
                        </motion.div>
                      </AnimatePresence>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        {active ? (
                          <AnimatePresence mode="wait">
                            <motion.div key={active.key}
                              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.22 }}
                              className="flex flex-col items-center"
                            >
                              <span className={`font-black text-3xl leading-none ${active.color}`}>{active.display}</span>
                              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-stone-400 mt-1">{active.label}</span>
                            </motion.div>
                          </AnimatePresence>
                        ) : (
                          <span className="text-[13px] font-semibold text-stone-500 text-center px-5">No marks yet</span>
                        )}
                      </div>
                    </button>
                    {metrics.length > 1 && (
                      <div className="flex items-center gap-1.5">
                        {metrics.map((m, i) => (
                          <button key={m.key} type="button" onClick={() => setRingMetricIndex(i)}
                            aria-label={`Show ${m.label}`}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === ringMetricIndex % metrics.length ? 'bg-brand-dark w-4' : 'bg-stone-200 hover:bg-stone-300'}`} />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
              {academicStory.previousAvg !== null && academicStory.change !== null && academicStory.overallAvg !== null && (
                <div className="text-center">
                  <p className="text-[11px] text-stone-500">
                    was <span className="font-black text-stone-600">{academicStory.previousAvg}%</span>
                    <span className={`font-black ml-1.5 ${academicStory.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {academicStory.change >= 0 ? '↑' : '↓'} {Math.abs(academicStory.change)}%
                    </span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{academicStory.totalAssessments} assessments</p>
                </div>
              )}
            </div>

            {/* Right column — story, week stats, bars */}
            <div className="min-w-0 space-y-5">

              {/* Story bullets */}
              {(academicStory.strongestGrowth || academicStory.mostConsistent || academicStory.needsAttention) && (
                <div className="flex flex-wrap gap-2">
                  {academicStory.strongestGrowth && (
                    <motion.span whileHover={{ y: -1 }} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-700 bg-emerald-50 border border-emerald-100 rounded px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Growing: {academicStory.strongestGrowth}
                    </motion.span>
                  )}
                  {academicStory.mostConsistent && academicStory.mostConsistent !== academicStory.strongestGrowth && (
                    <motion.span whileHover={{ y: -1 }} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-700 bg-blue-50 border border-blue-100 rounded px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      Consistent: {academicStory.mostConsistent}
                    </motion.span>
                  )}
                  {academicStory.needsAttention && academicStory.needsAttention !== academicStory.strongestGrowth && (
                    <motion.span whileHover={{ y: -1 }} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-700 bg-amber-50 border border-amber-100 rounded px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Needs attention: {academicStory.needsAttention}
                    </motion.span>
                  )}
                </div>
              )}

              {/* This week — compact stat row */}
              {hasMomentum && (
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: 'HW done', value: completions.size, on: completions.size > 0 },
                    { label: 'Topics studied', value: thisWeekStarted, on: thisWeekStarted > 0 },
                    { label: 'Mastered', value: thisWeekMastered, on: thisWeekMastered > 0 },
                  ].map(s => (
                    <motion.div key={s.label} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
                      className="rounded px-3 py-2.5 text-center border"
                      style={{ background: s.on ? 'var(--color-paper-raise)' : 'transparent', borderColor: 'var(--color-brand-border)' }}>
                      <p className={`font-black text-lg leading-none ${s.on ? 'text-brand-dark' : 'text-stone-300'}`}>{s.value}</p>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mt-1">{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Bars: homework, library, APS */}
              <div className="space-y-3.5">
                {totalHomework > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-semibold text-stone-700">Homework completion</span>
                      <span className={`text-[14px] font-bold ${hwCompletionPct >= 70 ? 'text-emerald-600' : hwCompletionPct >= 40 ? 'text-amber-600' : 'text-red-500'}`}>{hwCompletionPct}%</span>
                    </div>
                    <HealthBar pct={hwCompletionPct} color={hwCompletionPct >= 70 ? 'bg-emerald-500' : hwCompletionPct >= 40 ? 'bg-amber-400' : 'bg-red-400'} />
                  </div>
                )}
                {studyProgress.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[13px] font-bold text-stone-600">Library — {topicsMastered} mastered, {topicsStarted - topicsMastered} in progress</span>
                      <span className="text-[13px] font-black text-stone-600">{topicsStarted}/{studyProgress.length}</span>
                    </div>
                    <HealthBar pct={libraryPct} color="bg-brand-dark" />
                  </div>
                )}
                {apsScore !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[13px] font-bold text-stone-600">APS score</span>
                      <span className="text-[13px] font-black text-accent">{apsScore}</span>
                    </div>
                    <HealthBar pct={Math.min(100, Math.round((apsScore / 42) * 100))} color="bg-accent" />
                    <p className="text-[11px] text-stone-400 mt-1">
                      {apsScore >= 35 ? 'Strong — qualifies for most programmes'
                       : apsScore >= 28 ? 'Good — qualifies for many programmes'
                       : apsScore >= 20 ? 'Building — keep improving marks'
                       : 'Getting started — every mark counts'}
                    </p>
                  </div>
                )}
              </div>

              {/* Workload line */}
              <p className="text-[13px] text-stone-600 pt-3 border-t leading-relaxed" style={{ borderColor: 'var(--color-brand-border)' }}>
                <span className={`font-bold ${upcomingAssessmentCount >= 3 ? 'text-red-500' : upcomingAssessmentCount >= 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {upcomingAssessmentCount}
                </span>{' '}
                upcoming assessment{upcomingAssessmentCount !== 1 ? 's' : ''} —{' '}
                {upcomingAssessmentCount === 0 ? 'nothing scheduled'
                  : upcomingAssessmentCount >= 3 ? 'high workload, plan your revision'
                  : 'manageable, stay on top of prep'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══ Homework + Subjects ═════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

          {pendingHomework.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.3 }}
              className="paper-card rounded p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(31,36,33,0.4)]">Pending Homework</p>
                <span className="flex-1 h-px bg-brand-border" />
                <span className="text-[11px] font-bold text-stone-400">{completions.size} done</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'var(--color-paper-raise)' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${hwCompletionPct}%` }}
                  transition={{ duration: 0.8, ease }}
                  className="h-full bg-accent rounded-full"
                />
              </div>
              <HomeworkGroup label="Due Today" items={hwToday} urgency="high" />
              <HomeworkGroup label="Due Tomorrow" items={hwTomorrow} urgency="mid" />
              <HomeworkGroup label="This Week" items={hwLater} urgency="low" />
            </motion.div>
          )}

          {subjectProgress.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.34 }}
              className="paper-card rounded p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(31,36,33,0.4)]">Subjects</p>
                <span className="flex-1 h-px bg-brand-border" />
                <motion.button whileTap={tap} onClick={() => onNavigate('marks')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-accent transition-colors">
                  All marks <ArrowUpRight className="w-3 h-3" />
                </motion.button>
              </div>
              <div className="space-y-1">
                {subjectProgress.map(s => {
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
                            <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-stone-500 transition-colors group-hover:text-accent"
                              style={{ background: 'var(--color-paper-raise)' }}>
                              {subjectIcon(s.label)}
                            </span>
                            <span className="text-sm font-bold text-stone-700">{s.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-400">{s.count} assessed</span>
                            <span className={`text-sm font-black ${s.pct >= 70 ? 'text-emerald-600' : s.pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                              {s.pct}%
                            </span>
                            <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronRight className="w-3 h-3 text-stone-300" />
                            </motion.span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-paper-raise)' }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                            transition={{ duration: 0.8, ease }}
                            className={`h-full rounded-full ${s.pct >= 70 ? 'bg-emerald-500' : s.pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                          />
                        </div>
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
          )}
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
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ Recent activity + quick actions ═════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.42 }}
          className="paper-card rounded p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Recent Activity</p>
            <motion.button whileTap={tap} onClick={() => onNavigate('marks')}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-stone-500 hover:text-accent transition-colors">
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
                  transition={{ duration: 0.4, ease, delay: 0.45 + i * 0.04 }}
                  className={`flex items-start gap-3 py-2 ${i > 0 ? 'border-t' : ''}`}
                  style={{ borderColor: 'var(--color-brand-border)' }}>
                  {item.kind === 'mark' ? (
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4 text-amber-600" />
                    </div>
                  )}
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
    </div>
  );
}
