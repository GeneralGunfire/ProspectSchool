import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, CalendarDays, ClipboardList, ChevronRight, ArrowUpRight,
  Megaphone, TrendingUp, AlertTriangle, CheckCircle2,
  Clock, Zap, BookOpen, FileText, UserPlus, School,
} from 'lucide-react';
import { supabaseAdmin } from '../../../lib/supabase';
import { fetchSchoolEvents, fetchHomeworkCompletionCount, type SchoolEvent } from '../../../lib/events';
import { fetchTeacherStudents } from '../../../lib/students';
import { fetchTeacherMarkSheets, type MarkSheetGroup } from '../../../lib/marks';
import {
  fetchTeacherHomerooms, fetchCohortRoster, fetchAttendanceForDate,
  type AttendanceRecord,
} from '../../../lib/homeroom';
import {
  fetchTeacherImpactSummary, fetchTeacherClassHealth,
  fetchTeacherInterventionROI,
  type TeacherImpactSummary, type TeacherSubjectHealth, type AtRiskStudent,
  type InterventionROIRow, type StaleIntervention, type AssessmentGap,
} from '../../../lib/teacherAnalytics';
import { fetchBestInterventionType } from '../../../lib/teacherAnalytics';
import { createIntervention } from '../../../lib/interventions';
import { syncTeacherActions, dismissAction, riskKey, gapKey } from '../../../lib/actionCenter';
import type { TeacherSession } from '../../../lib/auth';
import { X } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

function daysUntil(dateStr: string, todayStr: string): string {
  const diff = new Date(dateStr + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime();
  const d = Math.round(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  return `${d} days`;
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Animated count-up — same recipe as the student dashboard's stat rings,
// so the teacher home page's numbers land with the same premium reveal
// instead of appearing flat/instant.
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

// SVG progress ring — same recipe as the student dashboard's Progress
// card, ported here so the teacher home page's class-average snapshot
// shares the same premium visual language instead of a bare percentage.
function Ring({ pct, size = 64, stroke = 6, trackColor = 'rgba(56,65,79,0.10)', color = 'var(--color-accent)' }:
  { pct: number; size?: number; stroke?: number; trackColor?: string; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - clamped / 100) }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </svg>
  );
}

const EVENT_TYPE_COLORS: Record<string, { pill: string; dot: string }> = {
  homework:   { pill: 'bg-blue-50 text-blue-700',       dot: 'bg-blue-500' },
  assessment: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  exam:       { pill: 'bg-red-50 text-red-700',         dot: 'bg-red-500' },
  other:      { pill: 'bg-stone-100 text-stone-600',    dot: 'bg-stone-400' },
};

const TYPE_LABEL: Record<string, string> = {
  past_paper:      'Past Paper',
  library_topic:   'Library Study',
  revision:        'Revision',
  resource_review: 'Resource Review',
};

const TYPE_ICON: Record<string, typeof FileText> = {
  past_paper:      FileText,
  library_topic:   BookOpen,
  revision:        BookOpen,
  resource_review: BookOpen,
};

interface HomeworkStat {
  event: SchoolEvent;
  completionCount: number;
  totalStudents: number;
}

interface ClassGroup {
  cohortName: string;
  grade: number | null;
  studentCount: number;
}

interface AttendanceSnapshot {
  present: number;
  late: number;
  absent: number;
  excused: number;
  total: number;
}

// Per at-risk student: recommended type + rationale loaded lazily
interface AtRiskRec {
  type: string;
  rationale: string;
}

interface TeacherHomePageProps {
  session: TeacherSession;
  onNavigate: (page: string) => void;
}

export default function TeacherHomePage({ session, onNavigate }: TeacherHomePageProps) {
  const today    = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [studentCount,   setStudentCount]   = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [homeworkStats,  setHomeworkStats]  = useState<HomeworkStat[]>([]);
  const [recentSheets,   setRecentSheets]   = useState<MarkSheetGroup[]>([]);
  const [impact,         setImpact]         = useState<TeacherImpactSummary | null>(null);
  const [classHealth,    setClassHealth]    = useState<TeacherSubjectHealth[]>([]);
  const [atRisk,         setAtRisk]         = useState<AtRiskStudent[]>([]);
  const [roiRows,        setRoiRows]        = useState<InterventionROIRow[]>([]);
  const [stale,          setStale]          = useState<StaleIntervention[]>([]);
  const [gaps,           setGaps]           = useState<AssessmentGap[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [classGroups,    setClassGroups]    = useState<ClassGroup[]>([]);
  const [attendance,     setAttendance]     = useState<AttendanceSnapshot | null>(null);

  // Durable dismiss state — maps the same dedup key syncTeacherActions uses
  // (risk:studentId:subject / the intervention id itself / gap:subjectId:grade)
  // to the persisted teacher_actions row id, so a card can be dismissed once
  // and stays dismissed on the next visit instead of re-triaging every time.
  const [actionIdByKey, setActionIdByKey] = useState<Map<string, number>>(new Map());
  const [dismissed,     setDismissed]     = useState<Set<string>>(new Set());

  function dismiss(key: string) {
    const id = actionIdByKey.get(key);
    if (id === undefined) return; // sync hasn't landed yet — rare, just no-op
    setDismissed(prev => new Set(prev).add(key));
    dismissAction(id);
  }

  // Assign state per student (key = `${studentId}_${subject}`)
  const [recs,       setRecs]       = useState<Record<string, AtRiskRec>>({});
  const [assigning,  setAssigning]  = useState<Record<string, boolean>>({});
  const [assigned,   setAssigned]   = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const [studentsResult, events, sheetsResult] = await Promise.all([
        fetchTeacherStudents(session.teacher_id, session.school_id),
        fetchSchoolEvents(session.school_id, session.teacher_id),
        fetchTeacherMarkSheets(session.teacher_id, session.school_id),
      ]);

      if (studentsResult.success) {
        setStudentCount(studentsResult.students.length);

        // Quick Class Access — group the teacher's students by cohort so
        // classes are visible directly on the home page instead of only
        // as a bare headcount.
        const groupMap = new Map<string, ClassGroup>();
        for (const s of studentsResult.students) {
          const name = s.cohort?.name ?? `Grade ${s.grade}`;
          const existing = groupMap.get(name);
          if (existing) existing.studentCount += 1;
          else groupMap.set(name, { cohortName: name, grade: s.grade, studentCount: 1 });
        }
        setClassGroups(
          [...groupMap.values()].sort((a, b) => (a.grade ?? 0) - (b.grade ?? 0) || a.cohortName.localeCompare(b.cohortName)),
        );
      }

      const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 4);
      setUpcomingEvents(upcoming);

      const cutoff = new Date(today);
      cutoff.setDate(cutoff.getDate() - 14);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      const recentHomework = events
        .filter(e => e.event_type === 'homework' && e.event_date >= cutoffStr && e.event_date <= todayStr)
        .slice(0, 4);

      const allStudents = studentsResult.success ? studentsResult.students : [];
      const stats = await Promise.all(recentHomework.map(async ev => {
        const completionCount = await fetchHomeworkCompletionCount(ev.id);
        let totalStudents = allStudents.length;
        if (ev.target_type === 'grade')    totalStudents = allStudents.filter(s => ev.target_grades?.includes(s.grade)).length;
        if (ev.target_type === 'class')    totalStudents = allStudents.filter(s => s.cohort_id && ev.target_cohort_ids?.includes(s.cohort_id!)).length;
        if (ev.target_type === 'specific') totalStudents = ev.target_student_ids?.length ?? 0;
        return { event: ev, completionCount, totalStudents };
      }));
      setHomeworkStats(stats);
      setRecentSheets(sheetsResult.slice(0, 3));
      setLoading(false);

      // Non-blocking — today's attendance snapshot, scoped to the teacher's
      // homeroom cohort(s) if they have any. Hidden entirely on the page if
      // the teacher isn't a homeroom teacher (no attendance to show).
      fetchTeacherHomerooms(session.teacher_id).then(async homerooms => {
        if (homerooms.length === 0) return;
        const rosters = await Promise.all(homerooms.map(h => fetchCohortRoster(h.id)));
        const studentIds = rosters.flat().map(s => s.id);
        if (studentIds.length === 0) return;
        const records: Map<number, AttendanceRecord> = await fetchAttendanceForDate(studentIds, todayStr);
        const snapshot: AttendanceSnapshot = { present: 0, late: 0, absent: 0, excused: 0, total: studentIds.length };
        for (const id of studentIds) {
          const status = records.get(id)?.status;
          if (status === 'present') snapshot.present += 1;
          else if (status === 'late') snapshot.late += 1;
          else if (status === 'absent') snapshot.absent += 1;
          else if (status === 'excused') snapshot.excused += 1;
        }
        setAttendance(snapshot);
      });

      // Non-blocking analytics. syncTeacherActions wraps fetchAtRiskStudents /
      // fetchStaleInterventions / fetchAssessmentGaps and additionally persists
      // + dedupes them into teacher_actions so a dismissed card doesn't
      // resurface on the next visit while the underlying condition persists.
      Promise.all([
        fetchTeacherImpactSummary(session.teacher_id),
        fetchTeacherClassHealth(session.teacher_id, session.school_id),
        fetchTeacherInterventionROI(session.teacher_id),
        syncTeacherActions(session.teacher_id, session.school_id),
      ]).then(([imp, health, roi, actionData]) => {
        setImpact(imp);
        setClassHealth(health);
        setRoiRows(roi);
        setAtRisk(actionData.atRisk);
        setStale(actionData.stale);
        setGaps(actionData.gaps);

        const keyMap = new Map<string, number>();
        for (const a of actionData.actions) {
          if (a.interventionId) keyMap.set(a.interventionId, a.id);
        }
        setActionIdByKey(keyMap);

        const risk = actionData.atRisk;

        // Pre-load recommendations for at-risk students (non-blocking)
        risk.forEach(s => {
          if (s.reason !== 'below_pass') return;
          const key = `${s.studentId}_${s.subject}`;
          const eligible = s.avg < 50
            ? (['library_topic', 'revision', 'resource_review'] as const)
            : (['revision', 'past_paper'] as const);
          fetchBestInterventionType(session.school_id, s.subject, [...eligible])
            .then(best => {
              if (best) {
                setRecs(prev => ({ ...prev, [key]: { type: best.type, rationale: best.rationale } }));
              } else {
                const fallback = eligible[0];
                setRecs(prev => ({
                  ...prev,
                  [key]: { type: fallback, rationale: `Recommended: ${TYPE_LABEL[fallback] ?? fallback}` },
                }));
              }
            });
        });
      });
    }
    load();
  }, []);

  // ── One-click assign ────────────────────────────────────────────────────────
  async function handleAssign(s: AtRiskStudent) {
    const key = `${s.studentId}_${s.subject}`;
    if (assigning[key] || assigned[key]) return;

    const rec = recs[key];
    if (!rec) return;

    setAssigning(prev => ({ ...prev, [key]: true }));

    try {
      // Look up subjectId from teacher_students
      const { data: link } = await supabaseAdmin
        .from('teacher_students')
        .select('subject_id')
        .eq('student_id', s.studentId)
        .eq('teacher_id', session.teacher_id)
        .limit(1)
        .single();

      const subjectId = (link as any)?.subject_id as number ?? 0;

      const descMap: Record<string, string> = {
        library_topic:   `Study ${s.subject} in the library`,
        revision:        `Revise ${s.subject} core concepts`,
        resource_review: `Review ${s.subject} resources`,
        past_paper:      `Complete a ${s.subject} past paper`,
      };
      const pageMap: Record<string, string> = {
        library_topic: 'library', revision: 'library',
        resource_review: 'resources', past_paper: 'pastpapers',
      };

      await createIntervention(
        s.studentId,
        session.school_id,
        s.subject,
        subjectId,
        rec.type as any,
        s.avg < 50 ? 'below_pass' : 'high_risk',
        descMap[rec.type] ?? `Intervention for ${s.subject}`,
        pageMap[rec.type] ?? 'library',
        s.avg,
        rec.rationale,
      );

      setAssigned(prev => ({ ...prev, [key]: true }));
    } catch {
      // silently fail — teacher can retry
    } finally {
      setAssigning(prev => ({ ...prev, [key]: false }));
    }
  }

  const nextEvent = upcomingEvents[0] ?? null;
  const heroDate = today.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  })();

  // Upcoming Deadlines — exams/assessments only, separate from the general
  // Upcoming Events list further down the page.
  const deadlines = upcomingEvents.filter(e => e.event_type === 'exam' || e.event_type === 'assessment');

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero — sits inside the page, not stacked on top of it ═════
          Same recipe as the student dashboard home page: quiet eyebrow
          line, large Instrument Sans greeting, no crest image or blur
          band — the page's own photo background (set on the dashboard's
          scroll container) shows through instead. */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0"
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">
              {session.school_name} · {heroDate}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {greeting}, {session.name}.
          </motion.h1>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="paper-card rounded p-5">
              <Shimmer className="h-3 w-2/3 mb-3" />
              <Shimmer className="h-8 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
      <>
      {/* ── 4 stat cards — animated counters, matching the student
          dashboard's card recipe (consistent p-5, hover lift via
          .paper-card) with the same restrained, icon-free label style ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Next Event */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.04 }}
          className="paper-card rounded p-5 flex flex-col justify-between min-h-30"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Next Event</p>
          {nextEvent ? (
            <>
              <span className={`self-start mt-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${EVENT_TYPE_COLORS[nextEvent.event_type]?.pill ?? 'bg-stone-100 text-stone-500'}`}>
                {nextEvent.event_type}
              </span>
              <div className="mt-1">
                <p className="font-black text-brand-dark text-sm leading-tight">{nextEvent.title}</p>
                <p className="text-stone-400 text-[11px] mt-0.5">{formatDate(nextEvent.event_date)}</p>
              </div>
            </>
          ) : (
            <p className="text-stone-400 text-sm font-bold mt-auto">No upcoming events</p>
          )}
        </motion.div>

        {/* My Students */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.08 }}
          className="paper-card rounded p-5 flex flex-col justify-between min-h-30"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">My Students</p>
          <p className="font-black text-4xl text-brand-dark"><Counter value={studentCount} /></p>
          <button onClick={() => onNavigate('classes')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-accent transition-colors flex items-center gap-0.5 mt-1 group">
            View Classes <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>

        {/* Mark Sheets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.12 }}
          className="paper-card rounded p-5 flex flex-col justify-between min-h-30"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Mark Sheets</p>
          <p className="font-black text-4xl text-brand-dark">
            <Counter value={recentSheets.reduce((acc, g) => acc + g.sheets.length, 0)} />
          </p>
          <button onClick={() => onNavigate('marks')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-accent transition-colors flex items-center gap-0.5 mt-1 group">
            Enter Marks <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.16 }}
          className="paper-card rounded p-5 flex flex-col justify-between min-h-30"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Upcoming Events</p>
          <p className="font-black text-4xl text-brand-dark"><Counter value={upcomingEvents.length} /></p>
          <button onClick={() => onNavigate('calendar')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-accent transition-colors flex items-center gap-0.5 mt-1 group">
            View Calendar <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>

      {/* ── Attendance Snapshot + Quick Class Access — matched pair ─── */}
      {(attendance || classGroups.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {attendance && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.15 }}
              className="paper-card rounded p-5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Attendance Today</p>
                <span className="flex-1 h-px bg-brand-border" />
                <button onClick={() => onNavigate('homeroom')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-accent transition-colors shrink-0">
                  Homeroom <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-5">
                {(() => {
                  const presentPct = attendance.total > 0 ? Math.round((attendance.present / attendance.total) * 100) : 0;
                  const ringColor = presentPct >= 90 ? '#10b981' : presentPct >= 75 ? '#f59e0b' : '#ef4444';
                  return (
                    <div className="relative shrink-0">
                      <Ring pct={presentPct} size={80} stroke={7} color={ringColor} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-black text-lg text-brand-dark leading-none"><Counter value={presentPct} suffix="%" /></span>
                      </div>
                    </div>
                  );
                })()}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    { label: 'Present', value: attendance.present, dot: 'bg-emerald-500' },
                    { label: 'Late',    value: attendance.late,    dot: 'bg-amber-500' },
                    { label: 'Absent',  value: attendance.absent,  dot: 'bg-red-400' },
                    { label: 'Sick',    value: attendance.excused, dot: 'bg-sky-400' },
                  ].map(({ label, value, dot }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                      <span className="text-xs font-bold text-stone-600">{value} {label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {classGroups.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.18 }}
              className="paper-card rounded p-5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">My Classes</p>
                <span className="flex-1 h-px bg-brand-border" />
                <button onClick={() => onNavigate('classes')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-accent transition-colors shrink-0">
                  All classes <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {classGroups.slice(0, 4).map((g, i) => (
                  <motion.button key={g.cohortName}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease, delay: 0.22 + i * 0.05 }}
                    onClick={() => onNavigate('classes')}
                    className={`w-full flex items-center gap-3 py-2 text-left ${i > 0 ? 'border-t' : ''}`}
                    style={{ borderColor: 'var(--color-brand-border)' }}
                  >
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
                      <School className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-brand-dark truncate">{g.cohortName}</p>
                      <p className="text-[11px] text-stone-500">{g.studentCount} student{g.studentCount !== 1 ? 's' : ''}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ── Recent Mark Sheets ────────────────────────────────────── */}
      {recentSheets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.17 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Recent Mark Sheets</p>
            <span className="flex-1 h-px bg-brand-border" />
            <button onClick={() => onNavigate('marks')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-accent transition-colors shrink-0">
              All marks <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {recentSheets.map((group, i) => (
              <motion.div key={group.key}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease, delay: 0.2 + i * 0.05 }}
                className={`flex items-center gap-3 py-2.5 ${i > 0 ? 'border-t' : ''}`}
                style={{ borderColor: 'var(--color-brand-border)' }}
              >
                <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-brand-dark truncate">
                    {group.subject_label}
                    <span className="font-semibold text-[rgba(31,36,33,0.5)]"> · Gr {group.grade}</span>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {group.sheets.length} sheet{group.sheets.length !== 1 ? 's' : ''}
                    {group.sheets[0]?.title ? ` · ${group.sheets[0].title}` : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Students Requiring Attention (with Assign) ───────────── */}
      {atRisk.filter(s => !dismissed.has(riskKey(s.studentId, s.subject))).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.18 }}
          className="paper-card rounded p-5"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2.5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Student Alerts</p>
              <span className="flex-1 h-px bg-brand-border" />
              <span className="text-[11px] font-black text-stone-500 shrink-0">
                {atRisk.filter(s => !dismissed.has(riskKey(s.studentId, s.subject))).length} student{atRisk.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Recommended interventions — click Assign to activate</p>
          </div>
          <div className="space-y-2">
            {atRisk.filter(s => !dismissed.has(riskKey(s.studentId, s.subject))).slice(0, 6).map((s, i) => {
              const key = `${s.studentId}_${s.subject}`;
              const rec = recs[key];
              const isAssigning = assigning[key];
              const isDone = assigned[key];
              const RecIcon = rec ? (TYPE_ICON[rec.type] ?? BookOpen) : Zap;

              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease, delay: 0.2 + i * 0.04 }}
                  className={`rounded border ${
                  s.reason === 'below_pass' ? 'bg-amber-50 border-amber-100' : 'border-brand-border'
                }`} style={s.reason !== 'below_pass' ? { background: 'var(--color-paper-raise)' } : undefined}>
                  {/* Top row: avatar + name + avg + assign button */}
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black ${
                      s.reason === 'below_pass' ? 'bg-amber-500' : 'bg-stone-400'
                    }`}>
                      {s.name[0]}{s.surname[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-brand-dark">{s.surname}, {s.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{s.detail}</p>
                    </div>

                    <button
                      onClick={() => dismiss(riskKey(s.studentId, s.subject))}
                      className="shrink-0 p-1 rounded-lg hover:bg-black/5 text-stone-400 hover:text-stone-500 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Assign button — only for below_pass with a rec loaded */}
                    {s.reason === 'below_pass' && (
                      <button
                        onClick={() => handleAssign(s)}
                        disabled={isAssigning || isDone || !rec}
                        className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-700 cursor-default'
                            : !rec
                            ? 'bg-stone-100 text-stone-400 cursor-default'
                            : isAssigning
                            ? 'bg-stone-100 text-stone-500 cursor-default'
                            : 'bg-accent text-white hover:bg-accent-soft active:scale-95'
                        }`}
                      >
                        {isDone ? (
                          <><CheckCircle2 className="w-3 h-3" /> Assigned</>
                        ) : isAssigning ? (
                          <><div className="w-3 h-3 border border-stone-300 border-t-transparent rounded-full animate-spin" /> Working…</>
                        ) : !rec ? (
                          <><div className="w-3 h-3 border border-stone-300 border-t-transparent rounded-full animate-spin" /> Loading…</>
                        ) : (
                          <><Zap className="w-3 h-3" /> Assign</>
                        )}
                      </button>
                    )}

                    {s.reason !== 'below_pass' && (
                      <button
                        onClick={() => onNavigate('library')}
                        className="shrink-0 text-[10px] font-black text-stone-500 hover:text-stone-700 transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>

                  {/* Recommendation pill — shown once rec is loaded for below_pass */}
                  {s.reason === 'below_pass' && rec && !isDone && (
                    <div className="flex items-center gap-1.5 px-3 pb-2.5">
                      <RecIcon className="w-3 h-3 text-stone-500 shrink-0" />
                      <p className="text-[10px] text-stone-500 truncate">
                        <span className="font-black">{TYPE_LABEL[rec.type] ?? rec.type}</span>
                        {' '}recommended
                      </p>
                    </div>
                  )}
                  {s.reason === 'below_pass' && isDone && (
                    <div className="flex items-center gap-1.5 px-3 pb-2.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <p className="text-[10px] text-emerald-600 font-bold truncate">
                        {TYPE_LABEL[rec?.type ?? ''] ?? ''} intervention created — visible on student's home
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          {atRisk.length > 6 && (
            <p className="text-[11px] text-stone-500 text-center mt-3">
              +{atRisk.length - 6} more —{' '}
              <button onClick={() => onNavigate('library')} className="font-black text-stone-600 hover:text-brand-dark">
                View all
              </button>
            </p>
          )}
        </motion.div>
      )}

      {/* ── Intervention Follow-Up Queue ──────────────────────────── */}
      {stale.filter(inv => !dismissed.has(inv.interventionId)).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.20 }}
          className="paper-card rounded p-5"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2.5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Follow-Up Queue</p>
              <span className="flex-1 h-px bg-brand-border" />
              <span className="text-[11px] font-black text-amber-600 shrink-0">
                {stale.filter(inv => !dismissed.has(inv.interventionId)).length}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Stale or completed without an outcome recorded</p>
          </div>
          <div className="space-y-2">
            {stale.filter(inv => !dismissed.has(inv.interventionId)).map((inv, i) => (
              <div key={i} className={`flex items-center gap-3 rounded px-3 py-2.5 border ${
                inv.reason === 'awaiting_outcome'
                  ? 'bg-blue-50 border-blue-100'
                  : 'bg-amber-50 border-amber-100'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black ${
                  inv.reason === 'awaiting_outcome' ? 'bg-blue-500' : 'bg-amber-500'
                }`}>
                  {inv.studentSurname[0]}{inv.studentName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-brand-dark">{inv.studentSurname}, {inv.studentName}</p>
                  <p className="text-[10px] text-stone-500 truncate">
                    {inv.subject} · {inv.typeLabel} ·{' '}
                    {inv.reason === 'awaiting_outcome'
                      ? 'completed — record outcome'
                      : `active ${inv.staleDays}d — check in`}
                  </p>
                </div>
                <button
                  onClick={() => dismiss(inv.interventionId)}
                  className="shrink-0 p-1 rounded-lg hover:bg-black/5 text-stone-400 hover:text-stone-500 transition-colors"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigate('library')}
                  className={`shrink-0 text-[10px] font-black transition-colors ${
                    inv.reason === 'awaiting_outcome'
                      ? 'text-blue-500 hover:text-blue-700'
                      : 'text-amber-500 hover:text-amber-700'
                  }`}
                >
                  {inv.reason === 'awaiting_outcome' ? 'Outcome →' : 'View →'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Assessment Gap Detector ───────────────────────────────── */}
      {gaps.filter(g => !dismissed.has(gapKey(g.subjectId, g.grade))).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.22 }}
          className="paper-card rounded p-5"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2.5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">No Recent Assessments</p>
              <span className="flex-1 h-px bg-brand-border" />
              <span className="text-[11px] font-black text-orange-600 shrink-0">
                {gaps.filter(g => !dismissed.has(gapKey(g.subjectId, g.grade))).length}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Subjects with no mark sheet in the last 30 days</p>
          </div>
          <div className="space-y-2">
            {gaps.filter(g => !dismissed.has(gapKey(g.subjectId, g.grade))).slice(0, 5).map((gap, i) => (
              <div key={i} className="flex items-center gap-3 rounded px-3 py-2.5 bg-orange-50 border border-orange-100">
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-brand-dark">{gap.subject} · Gr {gap.grade}</p>
                  <p className="text-[10px] text-stone-500">
                    Last assessed {gap.daysSinceLast}d ago · {gap.sheetCount} sheet{gap.sheetCount !== 1 ? 's' : ''} total
                  </p>
                </div>
                <button
                  onClick={() => dismiss(gapKey(gap.subjectId, gap.grade))}
                  className="shrink-0 p-1 rounded-lg hover:bg-black/5 text-stone-500 hover:text-stone-600 transition-colors"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigate('marks')}
                  className="shrink-0 text-[10px] font-black text-orange-500 hover:text-orange-700 transition-colors"
                >
                  Add Sheet →
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Academic Impact Card ──────────────────────────────────── */}
      {impact && (impact.completedInterventions > 0 || impact.activeInterventions > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.24 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Academic Impact</p>
            <span className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-stone-50 rounded p-3 text-center">
              <p className="text-xl font-black text-brand-dark">{impact.completedInterventions}</p>
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">Completed</p>
            </div>
            <div className={`rounded p-3 text-center ${impact.successRate >= 70 ? 'bg-emerald-50' : impact.successRate >= 50 ? 'bg-amber-50' : 'bg-stone-50'}`}>
              <p className={`text-xl font-black ${impact.successRate >= 70 ? 'text-emerald-700' : impact.successRate >= 50 ? 'text-amber-700' : 'text-stone-500'}`}>
                {impact.successRate}%
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${impact.successRate >= 70 ? 'text-emerald-500' : impact.successRate >= 50 ? 'text-amber-500' : 'text-stone-500'}`}>
                Success
              </p>
            </div>
            <div className={`rounded p-3 text-center ${impact.avgImprovement > 0 ? 'bg-blue-50' : 'bg-stone-50'}`}>
              <p className={`text-xl font-black ${impact.avgImprovement > 0 ? 'text-blue-700' : 'text-stone-500'}`}>
                {impact.avgImprovement > 0 ? `+${impact.avgImprovement}%` : '—'}
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${impact.avgImprovement > 0 ? 'text-blue-400' : 'text-stone-500'}`}>
                Avg Gain
              </p>
            </div>
          </div>
          {impact.bestType && impact.bestTypeSuccessRate > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded px-3 py-2 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-800">
                <span className="font-black">Most effective:</span>{' '}
                {TYPE_LABEL[impact.bestType] ?? impact.bestType} — {impact.bestTypeSuccessRate}% success rate
              </p>
            </div>
          )}
          {impact.activeInterventions > 0 && (
            <p className="text-[11px] text-stone-500 mt-2 text-center">
              {impact.activeInterventions} intervention{impact.activeInterventions !== 1 ? 's' : ''} currently active
            </p>
          )}
        </motion.div>
      )}

      {/* ── Intervention ROI ─────────────────────────────────────── */}
      {roiRows.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.26 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">What Works Best</p>
            <span className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="space-y-2.5">
            {roiRows.map((row, i) => (
              <div key={row.type} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-stone-100">
                  <span className="text-[9px] font-black text-stone-500">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-black text-brand-dark">{row.label}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-black ${row.successRate >= 70 ? 'text-emerald-600' : row.successRate >= 50 ? 'text-amber-600' : 'text-stone-500'}`}>
                        {row.successRate}%
                      </span>
                      <span className={`text-[10px] font-black ${row.avgGain > 0 ? 'text-blue-600' : 'text-stone-400'}`}>
                        {row.avgGain > 0 ? `+${row.avgGain}%` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.avgGain > 5 ? 'bg-emerald-500' : row.avgGain > 0 ? 'bg-amber-400' : 'bg-stone-300'}`}
                      style={{ width: `${Math.min(100, Math.max(0, (row.avgGain / 15) * 100))}%` }}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 shrink-0 w-12 text-right">n={row.total}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-stone-400 mt-3 text-center">Success rate · Avg mark gain · n = completed interventions with outcomes</p>
        </motion.div>
      )}

      {/* ── Class Health Snapshot ─────────────────────────────────── */}
      {classHealth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.28 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Class Health</p>
            <span className="flex-1 h-px bg-brand-border" />
          </div>

          <div className="grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-start">
            {/* Overall ring — average across all subjects, same centerpiece
                treatment as the student dashboard's Progress card */}
            {(() => {
              const overallAvg = Math.round(classHealth.reduce((acc, h) => acc + h.classAvg, 0) / classHealth.length);
              const totalAtRisk = classHealth.reduce((acc, h) => acc + h.atRiskCount, 0);
              const ringColor = overallAvg >= 70 ? '#10b981' : overallAvg >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-3 shrink-0">
                  <div className="relative shrink-0">
                    <Ring pct={overallAvg} size={110} stroke={9} color={ringColor} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-black text-2xl text-brand-dark leading-none"><Counter value={overallAvg} suffix="%" /></span>
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 mt-1">class avg</span>
                    </div>
                  </div>
                  {totalAtRisk > 0 && (
                    <div className="text-center lg:text-center">
                      <p className="text-[11px] text-stone-500">
                        <span className="font-black text-red-500">{totalAtRisk}</span> student{totalAtRisk !== 1 ? 's' : ''} at risk
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">across {classHealth.length} subject{classHealth.length !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Per-subject bars */}
            <div className="min-w-0 space-y-3">
              {classHealth.slice(0, 6).map((h, i) => {
                const changeColor = h.recentChange === null ? 'text-stone-400'
                  : h.recentChange >= 2  ? 'text-emerald-500'
                  : h.recentChange <= -2 ? 'text-red-400'
                  : 'text-stone-500';
                const avgColor = h.classAvg >= 70 ? 'text-emerald-600' : h.classAvg >= 50 ? 'text-amber-600' : 'text-red-500';
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease, delay: 0.3 + i * 0.04 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-black text-brand-dark">{h.subject}</p>
                        <span className="text-[10px] font-bold text-stone-500">Gr {h.grade}</span>
                        {h.atRiskCount > 0 && (
                          <span className="text-[10px] font-black text-red-500">{h.atRiskCount} at risk</span>
                        )}
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${Math.min(h.classAvg, 100)}%` }}
                          transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.04 }}
                          className={`h-full rounded-full ${h.classAvg >= 70 ? 'bg-emerald-500' : h.classAvg >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                        />
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-sm font-black ${avgColor}`}>{h.classAvg}%</p>
                      {h.recentChange !== null && (
                        <p className={`text-[10px] font-bold ${changeColor}`}>
                          {h.recentChange > 0 ? `+${h.recentChange}%` : `${h.recentChange}%`}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Upcoming Deadlines — exams/assessments only, separate from
          the general Upcoming Events list further down ─────────────── */}
      {deadlines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.29 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Upcoming Deadlines</p>
            <span className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="space-y-1">
            {deadlines.map((ev, i) => {
              const colors = EVENT_TYPE_COLORS[ev.event_type] ?? EVENT_TYPE_COLORS.other;
              return (
                <motion.div key={ev.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease, delay: 0.31 + i * 0.04 }}
                  className={`flex items-center gap-3 py-2.5 ${i > 0 ? 'border-t' : ''}`}
                  style={{ borderColor: 'var(--color-brand-border)' }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-brand-dark truncate">{ev.title}</p>
                    <p className="text-[10px] text-stone-500">{formatDate(ev.event_date)}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${colors.pill}`}>
                    {daysUntil(ev.event_date, todayStr)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Homework Completion ───────────────────────────────────── */}
      {homeworkStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.30 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Homework Completion</p>
            <span className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="space-y-3">
            {homeworkStats.map(({ event, completionCount, totalStudents }, i) => {
              const pct = totalStudents > 0 ? Math.round((completionCount / totalStudents) * 100) : 0;
              const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';
              const textColor = pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-stone-700 truncate flex-1 mr-2">{event.title}</p>
                    <p className={`text-xs font-black shrink-0 ${textColor}`}>
                      {completionCount}/{totalStudents} · {pct}%
                    </p>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Quick Actions ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.32 }}
        className="paper-card rounded p-5"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Quick Actions</p>
          <span className="flex-1 h-px bg-brand-border" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Add Student',       icon: UserPlus,     page: 'classes' },
            { label: 'Post Announcement', icon: Megaphone,    page: 'announcements' },
            { label: 'Create Event',      icon: CalendarDays, page: 'calendar' },
            { label: 'Enter Marks',       icon: ClipboardList,page: 'marks' },
            { label: 'Past Papers',       icon: FileText,     page: 'past-papers' },
            { label: 'Class Library',     icon: BookOpen,     page: 'library' },
          ].map(({ label, icon: Icon, page }) => (
            <motion.button
              key={page}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(page)}
              className="flex items-center gap-2.5 px-3 py-3 rounded bg-stone-50 hover:bg-stone-100 border border-brand-border/60 transition-colors text-left"
            >
              <Icon className="w-4 h-4 shrink-0 text-stone-500" />
              <span className="text-[12px] font-black text-stone-700">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.34 }}
          className="paper-card rounded p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Upcoming Events</p>
            <span className="flex-1 h-px bg-brand-border" />
            <button onClick={() => onNavigate('calendar')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-accent transition-colors shrink-0">
              Calendar <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {upcomingEvents.map((ev, i) => {
              const colors = EVENT_TYPE_COLORS[ev.event_type] ?? EVENT_TYPE_COLORS.other;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease, delay: 0.36 + i * 0.04 }}
                  className="flex items-center gap-3 py-2.5 border-b border-brand-border last:border-0"
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-brand-dark truncate">{ev.title}</p>
                    <p className="text-[10px] text-stone-500">{formatDate(ev.event_date)}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${colors.pill}`}>
                    {ev.event_type}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
      </>
      )}
      </div>
    </div>
  );
}
