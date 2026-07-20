import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown, AlertTriangle, TrendingDown, Activity, CalendarClock,
  RefreshCw, CheckCircle2, Sparkles, Search, Info, ArrowRight, Gauge,
} from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { Shimmer } from '../../../shared/components/Shimmer';
import { fetchTeacherStudentProgress, type StudentProgressSummary } from '../../../lib/studyProgress';
import { getInterventions, getOutcomes, syncInterventionsFromRisk, type Intervention, type Outcome } from '../../../lib/interventions';
import type { SubjectRisk, RevisionRecommendation } from '../../../lib/studentInsights';
import {
  fetchStudentRisk, profileToSubjectRisks, profileToRevisionRecs,
  type StudentRiskProfile, type RiskTier,
} from '../../../lib/riskEngine';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// ── Row state ──────────────────────────────────────────────────
// Tier is the unified ABC engine's tier — high / moderate / none.

interface RowData {
  student: StudentProgressSummary;
  overallTier: RiskTier;
  profile: StudentRiskProfile | null;
  riskSubjects: SubjectRisk[];
  revisionRecs: RevisionRecommendation[];
  loaded: boolean;
  loading: boolean;
  interventions: Intervention[];
  outcomes: Outcome[];
  syncing: boolean;
  lastSynced: string | null;
}

const RISK_ORDER: Record<RiskTier, number> = { high: 0, moderate: 1, none: 2 };

const RISK_STYLE: Record<RiskTier, { bg: string; border: string; text: string; dot: string; label: string }> = {
  high:     { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'High Risk' },
  moderate: { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-500',  label: 'Moderate Risk' },
  none:     { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'On Track' },
};

const TYPE_LABEL: Record<string, string> = {
  past_paper:      'Past Paper Practice',
  library_topic:   'Library Study',
  revision:        'Revision Session',
  resource_review: 'Resource Review',
};
const REASON_LABEL: Record<string, string> = {
  high_risk:        'High Risk',
  declining_trend:  'Declining Trend',
  exam_soon:        'Exam Soon',
  aps_gap:          'APS Gap',
  below_pass:       'Below Pass',
};

function initials(s: StudentProgressSummary) {
  return `${s.student_surname[0] ?? ''}${s.student_name[0] ?? ''}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface RiskEnginePageProps {
  session: TeacherSession;
}

export default function RiskEnginePage({ session }: RiskEnginePageProps) {
  const [rows, setRows] = useState<Map<number, RowData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskTier | ''>('');
  const [showHow, setShowHow] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const students = await fetchTeacherStudentProgress(session.teacher_id, session.school_id);
      if (cancelled) return;

      const todayStr = new Date().toISOString().split('T')[0];

      const initial = new Map<number, RowData>();
      for (const s of students) {
        initial.set(s.student_id, {
          student: s,
          overallTier: 'none',
          profile: null,
          riskSubjects: [],
          revisionRecs: [],
          loaded: false,
          loading: false,
          interventions: [],
          outcomes: [],
          syncing: false,
          lastSynced: null,
        });
      }
      setRows(initial);
      setLoading(false);

      // Compute risk for every student in the background so the list shows real
      // risk levels/sort order without waiting on each row's manual expand.
      for (const s of students) {
        if (cancelled) return;
        const profile = await fetchStudentRisk(s.student_id, session.school_id, todayStr);
        const riskSubjects = profileToSubjectRisks(profile);
        const revisionRecs = profileToRevisionRecs(profile);
        setRows(prev => {
          const next = new Map(prev);
          const row = next.get(s.student_id);
          if (!row) return prev;
          next.set(s.student_id, {
            ...row,
            overallTier: profile.tier,
            profile,
            riskSubjects,
            revisionRecs,
            loaded: true,
          });
          return next;
        });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [session.teacher_id, session.school_id]);

  async function loadInterventions(studentId: number) {
    setRows(prev => {
      const next = new Map(prev);
      const row = next.get(studentId);
      if (row) next.set(studentId, { ...row, loading: true });
      return next;
    });

    const [invs, outs] = await Promise.all([getInterventions(studentId), getOutcomes(studentId)]);

    setRows(prev => {
      const next = new Map(prev);
      const row = next.get(studentId);
      if (row) next.set(studentId, { ...row, interventions: invs, outcomes: outs, loading: false });
      return next;
    });
  }

  function toggleExpand(studentId: number) {
    const next = expanded === studentId ? null : studentId;
    setExpanded(next);
    if (next !== null) {
      const row = rows.get(next);
      if (row && row.interventions.length === 0 && row.outcomes.length === 0) {
        loadInterventions(next);
      }
    }
  }

  async function handleSync(studentId: number) {
    const row = rows.get(studentId);
    if (!row) return;

    setRows(prev => {
      const next = new Map(prev);
      next.set(studentId, { ...row, syncing: true });
      return next;
    });

    await syncInterventionsFromRisk(studentId, session.school_id, row.riskSubjects, row.revisionRecs);
    const [invs, outs] = await Promise.all([getInterventions(studentId), getOutcomes(studentId)]);

    setRows(prev => {
      const next = new Map(prev);
      const current = next.get(studentId);
      if (current) {
        next.set(studentId, {
          ...current,
          interventions: invs,
          outcomes: outs,
          syncing: false,
          lastSynced: new Date().toISOString(),
        });
      }
      return next;
    });
  }

  const allRows = Array.from(rows.values());
  const filtered = allRows
    .filter(r => {
      if (filterRisk && r.overallTier !== filterRisk) return false;
      const q = search.toLowerCase();
      return `${r.student.student_surname} ${r.student.student_name} ${r.student.student_code}`.toLowerCase().includes(q);
    })
    .sort((a, b) => RISK_ORDER[a.overallTier] - RISK_ORDER[b.overallTier] || a.student.student_surname.localeCompare(b.student.student_surname));

  const counts = {
    high:     allRows.filter(r => r.overallTier === 'high').length,
    moderate: allRows.filter(r => r.overallTier === 'moderate').length,
    none:     allRows.filter(r => r.overallTier === 'none').length,
  };

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Early Warning</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[40px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              At-Risk Students
            </h1>
            <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium max-w-md">
              Live risk scoring from attendance, behaviour, and course performance. Expand a student to see exactly why they're flagged.
            </p>
            <button
              onClick={() => setShowHow(v => !v)}
              className="mt-2.5 flex items-center gap-1.5 text-[11px] font-black text-stone-500 hover:text-accent transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              {showHow ? 'Hide how this works' : 'How does this work?'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

      <AnimatePresence>
        {showHow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden mb-6"
          >
            <div className="paper-card rounded p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">The Pipeline</p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-stretch mb-4">
                {[
                  { label: 'Attendance, Behaviour, Course', detail: 'Three independent domains, each scored 0-2' },
                  { label: 'Combined Score',  detail: 'Domains sum to a risk total; multiple weak domains required for High' },
                  { label: 'Interventions',  detail: 'Auto-created coaching tasks per flagged subject' },
                  { label: 'Outcomes',       detail: 'Next mark measures if it actually helped' },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-center flex-1 gap-1">
                    <div className="flex-1 bg-white border border-brand-border rounded px-3 py-2.5">
                      <p className="text-[11px] font-black text-brand-dark">{step.label}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{step.detail}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:block" />}
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-[12px] text-stone-600 leading-relaxed">
                <p>
                  <span className="font-black text-brand-dark">ABC model</span> — this engine follows early-warning-system research
                  (Chicago's On-Track Indicator; Balfanz/Herzog/Mac Iver's ABC model): a student rarely needs flagging from marks alone,
                  so <b>Attendance</b>, <b>Behaviour</b>, and <b>Course performance</b> are scored independently (0–2 each) and combined.
                  Attendance below 85% (last 6 weeks, weighted against term-to-date) scores 1; below 75% scores 2. Behaviour scores from
                  serious demerits (3+ points) this window — 1 serious incident scores 1, 2+ scores 2; a pattern of 4+ minor incidents
                  also scores 1. Course performance looks at each subject's last 4–6 assessments for a declining trend (slope) or high
                  volatility against the student's own prior-term baseline (or 50% if none exists) — the single worst subject drives the
                  student's Course score, since a strong overall average shouldn't hide one subject in real trouble.
                </p>
                <p>
                  <span className="font-black text-brand-dark">High vs Moderate</span> — <b>High</b> requires the combined total to reach
                  4+ AND at least two of the three domains to be non-zero (multiple corroborating signals, not just one bad subject) —
                  this is deliberate: it reduces false positives, but a single domain hitting its most severe level (2) on its own is
                  still surfaced as <b>Moderate</b>, so a serious single-domain problem is never silently missed.
                </p>
                <p>
                  <span className="font-black text-brand-dark">"Why Flagged" vs "Revision Priority"</span> — Why Flagged is the
                  subject-level detail behind the Course score above. Revision Priority is a separate, action-oriented ranking of which
                  subjects to study first right now.
                </p>
                <p>
                  <span className="font-black text-brand-dark">Interventions</span> — these are not manually assigned by anyone. They're
                  still auto-generated from flagged subjects (unchanged in this pass): a flagged subject creates a past-paper, revision,
                  or library task depending on severity. <b>Re-sync Interventions</b>{' '}
                  re-runs this generation for one student on demand — it won't duplicate an already-active task for the same subject+type.
                </p>
                <p>
                  <span className="font-black text-brand-dark">Evidence text</span> (the <Sparkles className="w-3 h-3 inline -mt-0.5 text-blue-500" /> lines)
                  — when choosing which type of task to assign, the system checks this school's own history: which intervention type
                  actually improved marks in that subject before, and by how much. If there's no history yet for that subject, it falls
                  back to a sensible default and there's no evidence line.
                </p>
                <p>
                  <span className="font-black text-brand-dark">Completed tasks</span> show a % change — that's the subject average
                  before the task was completed vs. the average after, calculated automatically the next time a mark is recorded.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="paper-card rounded p-3 flex items-center gap-3">
              <Shimmer className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-3" style={{ width: `${40 - i * 4}%` }} />
                <Shimmer className="h-2.5 w-1/4" />
              </div>
              <Shimmer className="h-5 w-16 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      ) : allRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No students linked to your classes yet.</p>
        </div>
      ) : (
        <>
          {/* Risk summary tiles */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
            {(['high', 'moderate', 'none'] as RiskTier[]).map(level => {
              const style = RISK_STYLE[level];
              const active = filterRisk === level;
              return (
                <button
                  key={level}
                  onClick={() => setFilterRisk(active ? '' : level)}
                  className={`paper-card rounded p-4 text-left transition-all ${
                    active ? `${style.bg} ${style.border}` : ''
                  }`}
                >
                  <p className={`text-2xl font-black leading-none ${style.text}`}>{counts[level]}</p>
                  <p className="text-[11px] font-bold text-stone-500 mt-1">{style.label}</p>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students…"
              className="w-full pl-10 pr-4 py-2.5 rounded border border-brand-border bg-white text-sm font-medium text-brand-dark placeholder:text-stone-500 focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-accent/30 transition-all"
            />
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-stone-500 text-center py-10">No students match.</p>
            ) : filtered.map((row, i) => (
              <RiskRow
                key={row.student.student_id}
                row={row}
                index={i}
                isExpanded={expanded === row.student.student_id}
                onToggle={() => toggleExpand(row.student.student_id)}
                onSync={() => handleSync(row.student.student_id)}
              />
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}

// ── Row ──────────────────────────────────────────────────────

function RiskRow({
  row, index, isExpanded, onToggle, onSync,
}: {
  row: RowData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSync: () => void;
}) {
  const style = RISK_STYLE[row.overallTier];
  const active = row.interventions.filter(i => i.status === 'recommended' || i.status === 'started');
  const completed = row.interventions.filter(i => i.status === 'completed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, ease: [0.23, 1, 0.32, 1] }}
      className={`bg-white rounded-2xl border overflow-hidden transition-colors ${
        isExpanded ? 'border-stone-300 shadow-sm' : 'border-brand-border hover:border-stone-300'
      }`}
    >
      {/* Row header — click to expand */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-stone-600">{initials(row.student)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-brand-dark truncate">
            {row.student.student_surname}, {row.student.student_name}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            Gr {row.student.grade}{row.student.cohort_name ? ` · ${row.student.cohort_name}` : ''} · {row.student.student_code}
          </p>
        </div>

        {!row.loaded ? (
          <div className="w-3.5 h-3.5 border-2 border-brand-border border-t-stone-500 rounded-full animate-spin shrink-0" />
        ) : (
          <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border ${style.bg} ${style.border} ${style.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {style.label}
            {row.riskSubjects.length > 0 && ` · ${row.riskSubjects.length}`}
          </span>
        )}

        <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded breakdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-brand-border space-y-4">

              {/* ABC breakdown — the unified engine's domain scores + plain-language reasons */}
              {row.profile && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 mt-3">
                    <Gauge className="w-3 h-3 text-stone-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Attendance · Behaviour · Course</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {([
                      ['Attendance', row.profile.attendance.score],
                      ['Behaviour',  row.profile.behaviour.score],
                      ['Course',     row.profile.course.score],
                    ] as [string, number][]).map(([label, score]) => (
                      <div key={label} className="rounded border border-brand-border bg-stone-50 px-2.5 py-2 text-center">
                        <p className="text-lg font-black text-brand-dark leading-none">{score}<span className="text-[10px] text-stone-500">/2</span></p>
                        <p className="text-[9px] font-bold text-stone-500 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                  {row.profile.reasons.length > 0 ? (
                    <ul className="space-y-1">
                      {row.profile.reasons.map((reason, ri) => (
                        <li key={ri} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0 text-stone-500" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-stone-500">No attendance, behaviour, or course-performance concerns detected.</p>
                  )}
                </div>
              )}

              {/* Why flagged — subject-level detail feeding the Course domain above */}
              {row.riskSubjects.length > 0 ? (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 mt-3">
                    <Gauge className="w-3 h-3 text-stone-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Why Flagged</p>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2 -mt-1">
                    Risk level per subject, from marks + trend + exam timing. See "How does this work?" above for the exact rules.
                  </p>
                  <div className="space-y-2">
                    {row.riskSubjects.map(risk => {
                      const rs = RISK_STYLE[risk.risk];
                      return (
                        <div key={risk.subjectId || risk.subject} className={`rounded border px-3.5 py-3 ${rs.bg} ${rs.border}`}>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <p className={`text-[13px] font-black ${rs.text}`}>{risk.subject}</p>
                            <span className="text-[11px] font-black text-stone-700">{risk.avg}% avg</span>
                          </div>
                          <ul className="space-y-1">
                            {risk.reasons.map((reason, ri) => (
                              <li key={ri} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0 text-stone-500" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                          {risk.examDays !== null && (
                            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mt-1.5">
                              <CalendarClock className="w-3 h-3 shrink-0" />
                              Exam in {risk.examDays} day{risk.examDays !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : row.loaded ? (
                <div className="flex items-center gap-2 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3.5 py-3 mt-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  No subjects currently flagged — on track.
                </div>
              ) : null}

              {/* Revision recommendations */}
              {row.revisionRecs.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown className="w-3 h-3 text-stone-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Revision Priority</p>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2 -mt-1">
                    A separate "what to study first" ranking — weighted toward exam closeness, so it can include subjects not listed above.
                  </p>
                  <div className="space-y-1.5">
                    {row.revisionRecs.map(rec => (
                      <div key={rec.subjectId || rec.subject} className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg bg-stone-50 border border-brand-border">
                        <TrendingDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="font-black text-brand-dark">{rec.subject}</span>
                        <span className="text-stone-500 flex-1">{rec.reason}</span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                          rec.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                          rec.urgency === 'high'     ? 'bg-amber-100 text-amber-700' :
                          'bg-stone-100 text-stone-500'
                        }`}>
                          {rec.urgency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interventions — active + completed with rationale + outcomes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-stone-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Interventions</p>
                  </div>
                  <button
                    onClick={onSync}
                    disabled={row.syncing}
                    className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${row.syncing ? 'animate-spin' : ''}`} />
                    {row.syncing ? 'Syncing…' : 'Re-sync Interventions'}
                  </button>
                </div>

                <p className="text-[11px] text-stone-500 mb-2">
                  Auto-generated coaching tasks — created directly from the flagged subjects above, not assigned by a teacher.
                  Re-sync re-checks the current risk data and adds any new tasks it implies (won't duplicate an active one).
                </p>

                {row.lastSynced && (
                  <p className="text-[10px] text-stone-500 mb-2">Last synced {formatDate(row.lastSynced)}</p>
                )}

                {row.loading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-4 h-4 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
                  </div>
                ) : row.interventions.length === 0 ? (
                  <p className="text-[11px] text-stone-500 py-2">
                    No interventions yet. Use Re-sync to auto-create coaching tasks from the risk data above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {active.map(inv => (
                      <div key={inv.id} className={`rounded border px-3.5 py-3 ${
                        inv.reason === 'exam_soon' || inv.reason === 'below_pass' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[12px] font-black text-brand-dark">{TYPE_LABEL[inv.type] ?? inv.type}</p>
                            <p className="text-[10px] text-stone-500 mt-0.5">{inv.subject}</p>
                          </div>
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/70 text-stone-700 shrink-0">
                            {REASON_LABEL[inv.reason] ?? inv.reason}
                          </span>
                        </div>
                        {inv.rationale && (
                          <p className="text-[10px] text-stone-500 italic mt-2 border-t border-black/5 pt-1.5 flex items-start gap-1">
                            <Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-blue-500" />
                            {inv.rationale}
                          </p>
                        )}
                        <p className="text-[10px] text-stone-500 mt-1.5">
                          {inv.status === 'started' ? 'In Progress' : 'Recommended'} · Created {formatDate(inv.createdAt)}
                        </p>
                      </div>
                    ))}

                    {completed.map(inv => {
                      const outcome = row.outcomes.find(o => o.interventionId === inv.id);
                      return (
                        <div key={inv.id} className={`rounded border px-3.5 py-3 ${
                          outcome?.result === 'improved' ? 'border-emerald-200 bg-emerald-50' :
                          outcome?.result === 'declined' ? 'border-red-200 bg-red-50' :
                          'border-brand-border bg-stone-50'
                        }`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[12px] font-black text-brand-dark">{TYPE_LABEL[inv.type] ?? inv.type}</p>
                              <p className="text-[10px] text-stone-500 mt-0.5">{inv.subject}</p>
                            </div>
                            {outcome && (
                              <span className={`text-[11px] font-black shrink-0 ${
                                outcome.result === 'improved' ? 'text-emerald-600' :
                                outcome.result === 'declined' ? 'text-red-500' : 'text-stone-500'
                              }`}>
                                {outcome.improvement > 0 ? `+${outcome.improvement}%` : `${outcome.improvement}%`}
                              </span>
                            )}
                          </div>
                          {inv.rationale && (
                            <p className="text-[10px] text-stone-500 italic mt-2 border-t border-black/5 pt-1.5 flex items-start gap-1">
                              <Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-blue-500" />
                              {inv.rationale}
                            </p>
                          )}
                          <p className="text-[10px] text-stone-500 mt-1.5">
                            Completed {inv.completedAt ? formatDate(inv.completedAt) : '—'}
                            {outcome && ` · ${outcome.previousAvg}% → ${outcome.newAvg}%`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
