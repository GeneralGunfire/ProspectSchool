import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown, AlertTriangle, TrendingDown, Activity, CalendarClock,
  RefreshCw, CheckCircle2, Sparkles, Search, Info, ArrowRight, Gauge,
} from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { fetchTeacherStudentProgress, type StudentProgressSummary } from '../../../lib/studyProgress';
import { fetchStudentResults } from '../../../lib/marks';
import { fetchSchoolEvents } from '../../../lib/events';
import { getInterventions, getOutcomes, syncInterventionsFromRisk, type Intervention, type Outcome } from '../../../lib/interventions';
import { computeStudentInsights, type SubjectRisk, type RevisionRecommendation, type RiskLevel } from '../../../lib/studentInsights';

// ── Row state ──────────────────────────────────────────────────

interface RowData {
  student: StudentProgressSummary;
  overallRisk: RiskLevel;      // worst subject risk for this student
  riskSubjects: SubjectRisk[];
  revisionRecs: RevisionRecommendation[];
  loaded: boolean;
  loading: boolean;
  interventions: Intervention[];
  outcomes: Outcome[];
  syncing: boolean;
  lastSynced: string | null;
}

const RISK_ORDER: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2, none: 3 };

const RISK_STYLE: Record<RiskLevel, { bg: string; border: string; text: string; dot: string; label: string }> = {
  high:   { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'High Risk' },
  medium: { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-500',  label: 'Medium Risk' },
  low:    { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'Low Risk' },
  none:   { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'On Track' },
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
  const [filterRisk, setFilterRisk] = useState<RiskLevel | ''>('');
  const [showHow, setShowHow] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const students = await fetchTeacherStudentProgress(session.teacher_id, session.school_id);
      if (cancelled) return;

      // Fetch shared data once — used to detect exam proximity per student.
      const events = await fetchSchoolEvents(session.school_id, session.teacher_id);
      if (cancelled) return;

      const todayStr = new Date().toISOString().split('T')[0];

      const initial = new Map<number, RowData>();
      for (const s of students) {
        initial.set(s.student_id, {
          student: s,
          overallRisk: 'none',
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
        const marks = await fetchStudentResults(s.student_id, session.school_id);
        const insights = computeStudentInsights(marks, events, s.progress, { targetAps: null, targetCareer: null, updatedAt: '' }, todayStr);
        const worst = insights.examRiskSubjects.reduce<RiskLevel>(
          (acc, r) => RISK_ORDER[r.risk] < RISK_ORDER[acc] ? r.risk : acc,
          'none',
        );
        setRows(prev => {
          const next = new Map(prev);
          const row = next.get(s.student_id);
          if (!row) return prev;
          next.set(s.student_id, {
            ...row,
            overallRisk: worst,
            riskSubjects: insights.examRiskSubjects,
            revisionRecs: insights.revisionRecs,
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
      if (filterRisk && r.overallRisk !== filterRisk) return false;
      const q = search.toLowerCase();
      return `${r.student.student_surname} ${r.student.student_name} ${r.student.student_code}`.toLowerCase().includes(q);
    })
    .sort((a, b) => RISK_ORDER[a.overallRisk] - RISK_ORDER[b.overallRisk] || a.student.student_surname.localeCompare(b.student.student_surname));

  const counts = {
    high:   allRows.filter(r => r.overallRisk === 'high').length,
    medium: allRows.filter(r => r.overallRisk === 'medium').length,
    low:    allRows.filter(r => r.overallRisk === 'low').length,
    none:   allRows.filter(r => r.overallRisk === 'none').length,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-4">
        <span className="eyebrow">EARLY WARNING</span>
        <h1 className="text-2xl font-black text-brand-dark">At-Risk Students</h1>
        <p className="text-sm text-stone-500 mt-1">
          Live risk scoring from marks, trends and exam proximity. Expand a student to see exactly why they're flagged.
        </p>
        <button
          onClick={() => setShowHow(v => !v)}
          className="mt-2.5 flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          {showHow ? 'Hide how this works' : 'How does this work?'}
        </button>
      </div>

      <AnimatePresence>
        {showHow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-stone-50 border border-brand-border rounded-[24px] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">The Pipeline</p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-stretch mb-4">
                {[
                  { label: 'Marks & Events', detail: 'Every subject average, mark trend, and exam date' },
                  { label: 'Risk Rules',     detail: 'Thresholds flag subjects as high / medium / low risk' },
                  { label: 'Interventions',  detail: 'Auto-created coaching tasks per flagged subject' },
                  { label: 'Outcomes',       detail: 'Next mark measures if it actually helped' },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-center flex-1 gap-1">
                    <div className="flex-1 bg-white border border-brand-border rounded-xl px-3 py-2.5">
                      <p className="text-[11px] font-black text-stone-900">{step.label}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{step.detail}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 hidden sm:block" />}
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-[12px] text-stone-600 leading-relaxed">
                <p>
                  <span className="font-black text-stone-900">Risk badge</span> — each subject gets a risk level from a rule score, not a black box:
                  average below 50% (below pass), below 65% (needs improvement), a drop of more than 5% over the last 3 assessments
                  (declining), inconsistent marks (swings of 20%+), and an exam within 14 days while the average is still weak all count
                  as separate "reasons." 3+ reasons — or a sub-50% average with an exam in the next 2 weeks — makes it <b>High</b>;
                  2 reasons (or sub-60% with an exam in 3 weeks) makes it <b>Medium</b>; anything else with 1 reason is <b>Low</b>.
                  A student's overall badge on the list is just their single worst subject.
                </p>
                <p>
                  <span className="font-black text-stone-900">"Why Flagged" vs "Revision Priority"</span> — Why Flagged is the risk
                  assessment itself (the reasons above, per subject). Revision Priority is a separate, action-oriented ranking of which
                  subjects to study first right now, weighted more heavily toward exam closeness — it can repeat a subject from Why Flagged,
                  or add one that isn't "risky" yet but has an exam coming up soon.
                </p>
                <p>
                  <span className="font-black text-stone-900">Interventions</span> — these are not manually assigned by anyone. They're
                  auto-generated directly from the risk data above: a high/medium-risk subject with an exam ≤14 days away creates a
                  past-paper or revision task; a sub-60% average creates a library/revision/resource task. <b>Re-sync Interventions</b>{' '}
                  re-runs this generation for one student on demand — it won't duplicate an already-active task for the same subject+type.
                </p>
                <p>
                  <span className="font-black text-stone-900">Evidence text</span> (the <Sparkles className="w-3 h-3 inline -mt-0.5 text-blue-500" /> lines)
                  — when choosing which type of task to assign, the system checks this school's own history: which intervention type
                  actually improved marks in that subject before, and by how much. If there's no history yet for that subject, it falls
                  back to a sensible default and there's no evidence line.
                </p>
                <p>
                  <span className="font-black text-stone-900">Completed tasks</span> show a % change — that's the subject average
                  before the task was completed vs. the average after, calculated automatically the next time a mark is recorded.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full"
          />
        </div>
      ) : allRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No students linked to your classes yet.</p>
        </div>
      ) : (
        <>
          {/* Risk summary tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
            {(['high', 'medium', 'low', 'none'] as RiskLevel[]).map(level => {
              const style = RISK_STYLE[level];
              const active = filterRisk === level;
              return (
                <button
                  key={level}
                  onClick={() => setFilterRisk(active ? '' : level)}
                  className={`card-premium rounded-[24px] border p-4 text-left transition-all ${
                    active ? `${style.bg} ${style.border}` : 'bg-white border-brand-border hover:border-stone-300'
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm font-medium text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-accent/30 transition-all"
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
  const style = RISK_STYLE[row.overallRisk];
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
          <p className="text-sm font-black text-stone-900 truncate">
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

              {/* Why flagged — the engine's reasoning */}
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
                        <div key={risk.subjectId || risk.subject} className={`rounded-xl border px-3.5 py-3 ${rs.bg} ${rs.border}`}>
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
                <div className="flex items-center gap-2 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-3 mt-3">
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
                        <span className="font-black text-stone-900">{rec.subject}</span>
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
                      <div key={inv.id} className={`rounded-xl border px-3.5 py-3 ${
                        inv.reason === 'exam_soon' || inv.reason === 'below_pass' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[12px] font-black text-stone-900">{TYPE_LABEL[inv.type] ?? inv.type}</p>
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
                        <div key={inv.id} className={`rounded-xl border px-3.5 py-3 ${
                          outcome?.result === 'improved' ? 'border-emerald-200 bg-emerald-50' :
                          outcome?.result === 'declined' ? 'border-red-200 bg-red-50' :
                          'border-brand-border bg-stone-50'
                        }`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[12px] font-black text-stone-900">{TYPE_LABEL[inv.type] ?? inv.type}</p>
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
