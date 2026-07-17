import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, TrendingUp, TrendingDown, Minus, ChevronDown, BookOpen, X, Lightbulb } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  ReferenceLine, Cell,
} from 'recharts';
import { Shimmer } from './StudentHomePage';
import { fetchStudentResults, computeFinalMark, type StudentResult } from '../../../lib/marks';
import type { StudentSession } from '../../../lib/auth';
import { getStudentGoals } from '../../../lib/studentGoals';
import { computeStudentInsights } from '../../../lib/studentInsights';
import { syncOutcomesFromMarks, getOutcomes, getCompletedInterventions, type Intervention, type Outcome } from '../../../lib/interventions';

// ── Helpers ───────────────────────────────────────────────────

function pct(mark: number | null, total: number): string {
  if (mark === null) return '—';
  return `${Math.round((mark / total) * 100)}%`;
}

function pctNum(mark: number, total: number): number {
  return Math.round((mark / total) * 100);
}

function gradeLabel(mark: number | null, total: number): { label: string; color: string; bg: string } {
  if (mark === null) return { label: 'Pending', color: 'text-stone-500', bg: 'bg-stone-100' };
  const p = (mark / total) * 100;
  if (p >= 80) return { label: 'Outstanding', color: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (p >= 70) return { label: 'Merit',       color: 'text-blue-700',    bg: 'bg-blue-50' };
  if (p >= 60) return { label: 'Adequate',    color: 'text-sky-700',     bg: 'bg-sky-50' };
  if (p >= 50) return { label: 'Moderate',    color: 'text-amber-700',   bg: 'bg-amber-50' };
  if (p >= 40) return { label: 'Elementary',  color: 'text-orange-700',  bg: 'bg-orange-50' };
  return               { label: 'Not Achieved', color: 'text-red-700',   bg: 'bg-red-50' };
}

function barColor(p: number): string {
  if (p >= 80) return '#10b981';
  if (p >= 70) return '#3b82f6';
  if (p >= 60) return '#0ea5e9';
  if (p >= 50) return '#f59e0b';
  if (p >= 40) return '#f97316';
  return '#ef4444';
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function shortTitle(title: string): string {
  return title.length > 12 ? title.slice(0, 11) + '…' : title;
}

// Animated count-up — same recipe as StudentHomePage's Counter.
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

// SVG progress ring — same recipe as StudentHomePage's Ring.
function Ring({ pct, size = 64, stroke = 6, trackColor = 'rgba(56,65,79,0.12)' }: { pct: number; size?: number; stroke?: number; trackColor?: string }) {
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

// ── Custom tooltip ────────────────────────────────────────────

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-brand-dark text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl">
      <p className="font-black">{d.fullTitle}</p>
      <p className="text-white/70 mt-0.5">{d.mark}/{d.total} — {d.pct}%</p>
    </div>
  );
}

// ── Performance zone bar ──────────────────────────────────────

const ZONES = [
  { from: 0,  to: 40,  color: '#fca5a5' },
  { from: 40, to: 50,  color: '#fdba74' },
  { from: 50, to: 70,  color: '#fcd34d' },
  { from: 70, to: 80,  color: '#93c5fd' },
  { from: 80, to: 100, color: '#6ee7b7' },
];

function PerformanceZoneBar({ avg }: { avg: number }) {
  const clamped = Math.max(0, Math.min(100, avg));
  return (
    <div className="px-5 pt-4 pb-2">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Zone</p>
      <div className="relative h-3 rounded-full overflow-hidden flex">
        {ZONES.map(z => (
          <div key={z.from} style={{ width: `${z.to - z.from}%`, background: z.color }} />
        ))}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-brand-dark rounded-full"
          style={{ left: `${clamped}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {[0, 40, 50, 70, 80, 100].map(v => (
          <span key={v} className="text-[9px] font-bold text-stone-400">{v}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface StudentMarksPageProps {
  session: StudentSession;
  onNavigate: (page: string) => void;
}

export default function StudentMarksPage({ session, onNavigate }: StudentMarksPageProps) {
  const goals = getStudentGoals(session.student_id);
  const [results, setResults]         = useState<StudentResult[]>([]);
  const [loading, setLoading]         = useState(true);
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [typeFilter, setTypeFilter]   = useState<Record<string, string>>({});
  const [drawerResult, setDrawerResult] = useState<StudentResult | null>(null);
  const [completedInv, setCompletedInv] = useState<Intervention[]>([]);
  const [allOutcomes, setAllOutcomes]   = useState<Outcome[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchStudentResults(session.student_id, session.school_id);
      setResults(data);
      setLoading(false);
      // Sync outcomes then load intervention data into state
      const marked = data.filter(r => r.mark !== null);
      await syncOutcomesFromMarks(session.student_id, session.school_id, marked);
      const [completed, outcomes] = await Promise.all([
        getCompletedInterventions(session.student_id),
        getOutcomes(session.student_id),
      ]);
      setCompletedInv(completed);
      setAllOutcomes(outcomes);
    }
    load();
  }, []);

  // Group by subject
  const grouped = new Map<string, StudentResult[]>();
  for (const r of results) {
    if (!grouped.has(r.subject_label)) grouped.set(r.subject_label, []);
    grouped.get(r.subject_label)!.push(r);
  }

  const markedResults = results.filter(r => r.mark !== null);
  const overallAvg = markedResults.length > 0
    ? markedResults.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / markedResults.length
    : null;

  // Subject averages + ranking
  const subjectAverages = Array.from(grouped.entries()).map(([subject, items]) => {
    const marked = items.filter(r => r.mark !== null);
    return {
      subject,
      avg: marked.length
        ? marked.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / marked.length
        : -1,
    };
  }).sort((a, b) => b.avg - a.avg);

  const subjectRank = new Map(subjectAverages.map((s, i) => [s.subject, i + 1]));
  const rankedCount = subjectAverages.filter(s => s.avg >= 0).length;

  // ── Intelligence engine ───────────────────────────────────────
  const todayStr = new Date().toISOString().slice(0, 10);
  const insights = computeStudentInsights(markedResults, [], [], goals, todayStr, completedInv, allOutcomes);
  const { examRiskSubjects } = insights;

  // ── Intervention outcomes per subject ─────────────────────────
  // Map subject → { completed, successful, avgImprovement }
  const subjectImpact = new Map<string, { completed: number; successful: number; avgImprovement: number }>();
  for (const inv of completedInv) {
    const outcome = allOutcomes.find(o => o.interventionId === inv.id);
    const key = inv.subject;
    const prev = subjectImpact.get(key) ?? { completed: 0, successful: 0, avgImprovement: 0 };
    subjectImpact.set(key, {
      completed:      prev.completed + 1,
      successful:     prev.successful + (outcome?.result === 'improved' ? 1 : 0),
      avgImprovement: outcome
        ? Math.round(((prev.avgImprovement * prev.completed + outcome.improvement) / (prev.completed + 1)) * 10) / 10
        : prev.avgImprovement,
    });
  }

  // ── Action items ──────────────────────────────────────────────
  type ActionItem = {
    type: 'weak-subject' | 'exam-soon' | 'aps-opportunity';
    subject?: string;
    avg?: number;
    trend?: number | null;
    actions: { label: string; page: string }[];
    headline: string;
    body: string;
  };

  const actionItems: ActionItem[] = [];

  const weakCandidates = subjectAverages.filter(s => s.avg >= 0 && s.avg < 65).slice(0, 1);
  for (const candidate of weakCandidates) {
    const subjectItems = grouped.get(candidate.subject) ?? [];
    const markedSorted = subjectItems
      .filter(r => r.mark !== null)
      .sort((a, b) => new Date(a.marked_at ?? a.created_at).getTime() - new Date(b.marked_at ?? b.created_at).getTime());
    const recent3  = markedSorted.slice(-3).map(r => (r.mark! / r.total) * 100);
    const prev3    = markedSorted.slice(-6, -3).map(r => (r.mark! / r.total) * 100);
    const recentAvg  = recent3.length ? recent3.reduce((a, b) => a + b, 0) / recent3.length : null;
    const prevAvg    = prev3.length   ? prev3.reduce((a, b)   => a + b, 0) / prev3.length   : null;
    const subjectTrend = recentAvg !== null && prevAvg !== null ? recentAvg - prevAvg : null;

    actionItems.push({
      type: 'weak-subject',
      subject: candidate.subject,
      avg: Math.round(candidate.avg),
      trend: subjectTrend,
      headline: 'Your Highest Impact Opportunity',
      body: `Improving ${candidate.subject} would have the largest effect on your overall average.${
        subjectTrend !== null && subjectTrend < -3
          ? ' Recent results show a decline — this needs attention now.'
          : ''
      }`,
      actions: [
        { label: 'Open Library', page: 'library' },
        { label: 'Practice Past Papers', page: 'pastpapers' },
      ],
    });
  }

  // High-risk subject from engine (exam within 14 days + low avg)
  const highRisk = examRiskSubjects.find(s => s.risk === 'high' && s.examDays !== null);
  if (highRisk && actionItems.length < 2 && highRisk.subject !== (weakCandidates[0]?.subject ?? '')) {
    actionItems.push({
      type: 'exam-soon' as const,
      subject: highRisk.subject,
      avg: highRisk.avg,
      trend: null,
      headline: 'Exam Risk',
      body: highRisk.reasons.join(' · '),
      actions: [
        { label: 'Practice Past Papers', page: 'pastpapers' },
        { label: 'Open Library', page: 'library' },
      ],
    });
  }

  // APS goal gap — only add if there's room
  if (goals.targetAps && overallAvg !== null && actionItems.length < 2) {
    actionItems.push({
      type: 'aps-opportunity' as const,
      headline: 'APS Goal',
      body: `Your target is APS ${goals.targetAps}. Improving your lowest subject has the biggest impact on your APS score.`,
      actions: [
        { label: 'Open APS Calculator', page: 'aps' },
      ],
    });
  }

  // ── Subject health scores ─────────────────────────────────────
  const subjectHealthScores = new Map<string, { score: number; label: string; color: string }>();
  for (const [subject, items] of grouped.entries()) {
    const marked = items.filter(r => r.mark !== null);
    if (marked.length < 2) continue;
    const avg = marked.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / marked.length;
    const hsorted = [...marked].sort((a, b) =>
      new Date(a.marked_at ?? a.created_at).getTime() - new Date(b.marked_at ?? b.created_at).getTime()
    );
    const hr3 = hsorted.slice(-3).map(r => (r.mark! / r.total) * 100);
    const hp3 = hsorted.slice(-6, -3).map(r => (r.mark! / r.total) * 100);
    const hrAvg = hr3.length ? hr3.reduce((a, b) => a + b, 0) / hr3.length : avg;
    const hpAvg = hp3.length ? hp3.reduce((a, b) => a + b, 0) / hp3.length : avg;
    const trendScore = Math.min(100, Math.max(0, 50 + (hrAvg - hpAvg) * 2));
    const pcts = marked.map(r => (r.mark! / r.total) * 100);
    const mean = pcts.reduce((a, b) => a + b, 0) / pcts.length;
    const stdDev = Math.sqrt(pcts.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / pcts.length);
    const consistencyScore = Math.min(100, Math.max(0, 100 - stdDev * 2));
    const healthScore = Math.round(avg * 0.5 + trendScore * 0.25 + consistencyScore * 0.25);
    const label = healthScore >= 80 ? 'Strong'
                : healthScore >= 65 ? 'Steady'
                : healthScore >= 50 ? 'Watch'
                :                     'Needs Attention';
    const color = healthScore >= 80 ? 'text-emerald-600'
                : healthScore >= 65 ? 'text-blue-600'
                : healthScore >= 50 ? 'text-amber-600'
                :                     'text-red-500';
    subjectHealthScores.set(subject, { score: healthScore, label, color });
  }

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — sits inside the page, not stacked on top of it ═════
          No buttons in this band (house rule). The overall-average ring
          is a static readout, not an action. */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #bcc5cb 0%, #cbd3d5 18%, #dde2e1 42%, #e8eae7 68%, #eaebec 92%, #eaebec 100%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.6]"
          style={{
            backgroundImage: 'repeating-linear-gradient(120deg, rgba(56,65,79,0.08) 0px, rgba(56,65,79,0.08) 1px, transparent 1px, transparent 28px)',
            maskImage: 'linear-gradient(180deg, black 0%, black 45%, transparent 92%)',
          }} />
        <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-[0.32] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-depth-soft), transparent 70%)' }} />
        <div className="absolute -top-12 left-1/4 w-[19rem] h-[19rem] rounded-full blur-3xl opacity-[0.16] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-depth), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-10 sm:pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0">
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">Results</p>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            My Marks
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium">
            How you're tracking across your subjects.
          </motion.p>

          {overallAvg !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="inline-flex items-center gap-3 mt-4 border border-brand-border bg-white/70 rounded-full pl-2.5 pr-4 py-1.5">
              <div className="relative shrink-0">
                <Ring pct={Math.round(overallAvg)} size={32} stroke={3} trackColor="rgba(56,65,79,0.12)" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-black text-brand-dark leading-none">{Math.round(overallAvg)}%</span>
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(31,36,33,0.5)]">Overall</span>
                <span className="ml-1.5 font-black text-sm text-brand-dark">{markedResults.length} tracked</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {loading ? (
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.06 }}
            className="paper-card rounded p-5 sm:p-6 flex items-center gap-5">
            <Shimmer className="w-16 h-16 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3 w-1/3" />
              <Shimmer className="h-5 w-1/2" />
            </div>
          </motion.div>
          <div className="space-y-2.5">
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 + i * 0.05, ease }}
                className="paper-card rounded p-5 flex items-center gap-4"
              >
                <div className="flex-1 space-y-2">
                  <Shimmer className="h-4" style={{ width: `${50 - i * 6}%` }} />
                  <Shimmer className="h-3 w-1/4" />
                </div>
                <Shimmer className="h-8 w-14 rounded" />
              </motion.div>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList className="w-9 h-9 text-stone-200 mb-4" />
          <p className="text-[16px] font-semibold text-brand-dark">No results yet.</p>
          <p className="text-[13px] text-[rgba(31,36,33,0.4)] mt-1">Your marks will appear here once your teacher has recorded them.</p>
        </div>
      ) : (
        <>
          {/* Subject Risk section — from intelligence engine */}
          {examRiskSubjects.filter(s => s.risk === 'high' || s.risk === 'medium').length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Subject Risk</p>
              <div className="space-y-2">
                {examRiskSubjects.filter(s => s.risk === 'high' || s.risk === 'medium').map(risk => (
                  <div key={risk.subject} className={`rounded border p-4 ${
                    risk.risk === 'high'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-stone-900 text-sm">{risk.subject}</p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          risk.risk === 'high'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                          {risk.risk === 'high' ? 'High Risk' : 'Watch'}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                          {risk.avg}% avg
                        </span>
                      </div>
                      {risk.examDays !== null && (
                        <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full ${
                          risk.examDays <= 7 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          Exam in {risk.examDays}d
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5 mb-3">
                      {risk.reasons.map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0" />
                          <p className="text-xs text-stone-600">{r}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onNavigate('pastpapers')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-dark text-white text-[11px] font-black hover:bg-stone-700 transition-colors">
                        Practice Papers
                      </button>
                      <button onClick={() => onNavigate('library')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-brand-border text-stone-700 text-[11px] font-black hover:bg-stone-50 transition-colors">
                        Open Library
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Performance Journey card */}
          {(() => {
            if (markedResults.length < 4) return null;
            const sortedAll = [...markedResults].sort((a, b) =>
              new Date(a.marked_at ?? a.created_at).getTime() - new Date(b.marked_at ?? b.created_at).getTime()
            );
            const half = Math.floor(sortedAll.length / 2);
            const firstHalf  = sortedAll.slice(0, half);
            const secondHalf = sortedAll.slice(half);
            const startAvg   = firstHalf.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / firstHalf.length;
            const currentAvg = secondHalf.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / secondHalf.length;
            const change     = currentAvg - startAvg;

            const subjectGrowth = Array.from(grouped.entries())
              .map(([subject, items]) => {
                const m = items.filter(r => r.mark !== null)
                  .sort((a, b) => new Date(a.marked_at ?? a.created_at).getTime() - new Date(b.marked_at ?? b.created_at).getTime());
                if (m.length < 2) return null;
                const first = (m[0].mark! / m[0].total) * 100;
                const last  = (m[m.length - 1].mark! / m[m.length - 1].total) * 100;
                return { subject, change: last - first };
              })
              .filter(Boolean) as { subject: string; change: number }[];

            const mostImproved = subjectGrowth.length ? subjectGrowth.reduce((a, b) => b.change > a.change ? b : a) : null;
            const mostDeclined = subjectGrowth.filter(s => s.change < 0).length
              ? subjectGrowth.filter(s => s.change < 0).reduce((a, b) => b.change < a.change ? b : a)
              : null;

            return (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="paper-card rounded p-5 mb-5"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">Performance Journey</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 text-center bg-stone-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Early</p>
                    <p className="font-black text-stone-700 text-xl">{startAvg.toFixed(0)}%</p>
                  </div>
                  <div className={`font-black text-2xl ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {change >= 0 ? '↑' : '↓'}
                  </div>
                  <div className="flex-1 text-center bg-stone-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Recent</p>
                    <p className="font-black text-stone-900 text-xl">{currentAvg.toFixed(0)}%</p>
                  </div>
                  <div className={`flex-1 text-center rounded-xl p-3 ${change >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-stone-500">Change</p>
                    <p className={`font-black text-xl ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </p>
                  </div>
                </div>
                {(mostImproved || mostDeclined) && (
                  <div className="space-y-2">
                    {mostImproved && mostImproved.change > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 text-xs font-black">↑</span>
                        <span className="text-xs font-bold text-stone-600 truncate">
                          Strongest growth: {mostImproved.subject} (+{mostImproved.change.toFixed(0)}%)
                        </span>
                      </div>
                    )}
                    {mostDeclined && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 text-xs font-black">↓</span>
                        <span className="text-xs font-bold text-stone-500 truncate">
                          Needs attention: {mostDeclined.subject} ({mostDeclined.change.toFixed(0)}%)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* Academic Action Center */}
          {actionItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                Recommended Actions
              </p>
              <div className="space-y-3">
                {actionItems.map((item, i) => (
                  <div key={i} className="paper-card rounded overflow-hidden">
                    <div className="px-5 pt-5 pb-4 border-b border-brand-border/60">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-1">
                        {item.headline}
                      </p>
                      {item.subject && item.avg !== undefined && (
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <p className="font-black text-stone-900 text-base">{item.subject}</p>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                            item.avg >= 70 ? 'bg-emerald-50 text-emerald-700' :
                            item.avg >= 50 ? 'bg-amber-50 text-amber-700' :
                                             'bg-red-50 text-red-600'
                          }`}>
                            {item.avg}% Average
                          </span>
                          {item.trend !== null && item.trend !== undefined && (
                            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                              item.trend > 1  ? 'bg-emerald-50 text-emerald-600' :
                              item.trend < -1 ? 'bg-red-50 text-red-500' :
                                                'bg-stone-100 text-stone-500'
                            }`}>
                              {item.trend > 1 ? 'Improving' : item.trend < -1 ? 'Declining' : 'Stable'}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-stone-500 leading-relaxed">{item.body}</p>
                    </div>
                    <div className="px-5 py-3 flex flex-wrap gap-2">
                      {item.actions.map((action, j) => (
                        <button
                          key={j}
                          onClick={() => onNavigate(action.page)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-colors ${
                            j === 0
                              ? 'bg-brand-dark text-white hover:bg-stone-700'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-brand-border'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Strength / Weakness Banner */}
          {subjectAverages.filter(s => s.avg >= 0).length >= 2 && (() => {
            const valid = subjectAverages.filter(s => s.avg >= 0);
            const best  = valid[0];
            const worst = valid[valid.length - 1];
            return best.subject !== worst.subject ? (
              <div className="grid grid-cols-2 gap-3 mb-6 sm:gap-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600 mb-1">Strongest</p>
                  <p className="font-black text-stone-900 text-sm leading-tight truncate">{best.subject}</p>
                  <p className="text-emerald-600 font-black text-2xl mt-1">{best.avg.toFixed(0)}%</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-600 mb-1">Needs Attention</p>
                  <p className="font-black text-stone-900 text-sm leading-tight truncate">{worst.subject}</p>
                  <p className="text-amber-600 font-black text-2xl mt-1">{worst.avg.toFixed(0)}%</p>
                </div>
              </div>
            ) : null;
          })()}

          {/* Subject panels */}
          <div className="space-y-3">
            {Array.from(grouped.entries()).map(([subject, items], gi) => {
              const markedItems = items.filter(r => r.mark !== null);

              // Weighted final mark per term (only shown once a term's weights sum to 100%)
              const termGroups = new Map<number, StudentResult[]>();
              for (const r of items) {
                if (!termGroups.has(r.term)) termGroups.set(r.term, []);
                termGroups.get(r.term)!.push(r);
              }
              const termFinals = Array.from(termGroups.entries())
                .map(([term, termItems]) => ({
                  term,
                  ...computeFinalMark(termItems.map(r => ({ weight: r.weight, mark: r.mark, total: r.total }))),
                }))
                .filter(t => t.weightTotal > 0)
                .sort((a, b) => a.term - b.term);

              const subjectAvg = markedItems.length > 0
                ? markedItems.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / markedItems.length
                : null;

              const chartData = [...markedItems]
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map(r => ({
                  name:      shortTitle(r.sheet_title ?? ''),
                  fullTitle: r.sheet_title ?? '',
                  pct:       pctNum(r.mark!, r.total),
                  mark:      r.mark,
                  total:     r.total,
                }));

              const sorted = [...markedItems].sort((a, b) =>
                new Date(a.marked_at ?? a.created_at).getTime() - new Date(b.marked_at ?? b.created_at).getTime()
              );
              const recent3   = sorted.slice(-3).map(r => (r.mark! / r.total) * 100);
              const prev3     = sorted.slice(-6, -3).map(r => (r.mark! / r.total) * 100);
              const recentAvg = recent3.length ? recent3.reduce((a, b) => a + b, 0) / recent3.length : null;
              const prevAvg   = prev3.length   ? prev3.reduce((a, b) => a + b, 0)   / prev3.length   : null;
              const trend     = recentAvg !== null && prevAvg !== null ? recentAvg - prevAvg : null;

              const typeMap = new Map<string, { sum: number; count: number; total: number }>();
              for (const r of markedItems) {
                const key = r.sheet_scope ?? 'Other';
                const e = typeMap.get(key) ?? { sum: 0, count: 0, total: 0 };
                typeMap.set(key, { sum: e.sum + r.mark!, count: e.count + 1, total: e.total + r.total });
              }
              const typeBreakdown = Array.from(typeMap.entries()).map(([type, d]) => ({
                type,
                avg: Math.round((d.sum / d.total) * 100),
                count: d.count,
              })).sort((a, b) => b.avg - a.avg);

              const strongestType    = typeBreakdown[0] ?? null;
              const weakestType      = typeBreakdown[typeBreakdown.length - 1] ?? null;
              const hasTypeBreakdown = typeBreakdown.length >= 2;

              const projectedAvg = (mark: number) =>
                markedItems.length > 0
                  ? (markedItems.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) + mark) / (markedItems.length + 1)
                  : mark;

              const activeType    = typeFilter[subject] ?? 'All';
              const filteredItems = activeType === 'All'
                ? items
                : items.filter(r => (r.sheet_scope ?? 'Other') === activeType);

              const pcts        = markedItems.map(r => pctNum(r.mark!, r.total));
              const highestMark = pcts.length ? Math.max(...pcts) : null;
              const bestImprove = (() => {
                if (sorted.length < 2) return null;
                let best = -Infinity;
                for (let i = 1; i < sorted.length; i++) {
                  const delta = (sorted[i].mark! / sorted[i].total - sorted[i - 1].mark! / sorted[i - 1].total) * 100;
                  if (delta > best) best = delta;
                }
                return best > 0 ? Math.round(best) : null;
              })();

              const isOpen = openSubject === subject;
              const rank   = subjectRank.get(subject);
              const gl     = subjectAvg !== null ? gradeLabel(subjectAvg, 100) : null;

              const trendUp   = trend !== null && trend > 1;
              const trendDown = trend !== null && trend < -1;
              const trendFlat = trend !== null && !trendUp && !trendDown;

              return (
                <motion.div key={subject}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05 }}
                  className="paper-card rounded overflow-hidden"
                >
                  {/* Panel header */}
                  <button
                    onClick={() => setOpenSubject(isOpen ? null : subject)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-stone-50 transition-colors"
                  >
                    {rank && rankedCount > 1 && (
                      <div className="shrink-0 flex flex-col items-center w-6">
                        <span className="text-[9px] font-black text-stone-400 leading-none">#{rank}</span>
                        <span className="text-[8px] font-bold text-stone-200 leading-none">of {rankedCount}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-black text-stone-900 leading-snug">{subject}</p>
                        {subjectHealthScores.has(subject) && (() => {
                          const h = subjectHealthScores.get(subject)!;
                          return (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full bg-stone-100 ${h.color}`}>
                              {h.score}/100
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {items.length} assessment{items.length !== 1 ? 's' : ''}
                        {gl && ` · ${gl.label}`}
                      </p>
                    </div>
                    {trend !== null && (
                      <div className={`shrink-0 flex flex-col items-center px-2.5 py-1.5 rounded-xl ${
                        trendUp   ? 'bg-emerald-50' :
                        trendDown ? 'bg-red-50'      :
                                    'bg-stone-100'
                      }`}>
                        {trendUp   && <TrendingUp  className="w-3.5 h-3.5 text-emerald-500 mb-0.5" />}
                        {trendDown && <TrendingDown className="w-3.5 h-3.5 text-red-400 mb-0.5" />}
                        {trendFlat && <Minus        className="w-3.5 h-3.5 text-stone-500 mb-0.5" />}
                        <span className={`text-[10px] font-black leading-none ${
                          trendUp   ? 'text-emerald-600' :
                          trendDown ? 'text-red-500'     :
                                      'text-stone-500'
                        }`}>
                          {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                        </span>
                        <span className={`text-[8px] font-bold leading-none mt-0.5 ${
                          trendUp   ? 'text-emerald-400' :
                          trendDown ? 'text-red-300'     :
                                      'text-stone-400'
                        }`}>
                          {trendUp ? 'Improving' : trendDown ? 'Declining' : 'Steady'}
                        </span>
                      </div>
                    )}
                    {subjectAvg !== null && gl && (
                      <div className="shrink-0 text-right">
                        <p className={`text-2xl font-black leading-none ${gl.color}`}>
                          {subjectAvg.toFixed(0)}%
                        </p>
                      </div>
                    )}
                    <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-brand-border/60">

                          {/* Subject Intelligence snapshot */}
                          <div className="px-5 pt-4 pb-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              {
                                label: 'Best Result',
                                value: markedItems.length > 0
                                  ? `${Math.round(Math.max(...markedItems.map(r => (r.mark! / r.total) * 100)))}%`
                                  : '—',
                              },
                              {
                                label: 'Assessments',
                                value: String(items.length),
                              },
                              {
                                label: 'Consistency',
                                value: (() => {
                                  if (markedItems.length < 3) return '—';
                                  const cp = markedItems.map(r => (r.mark! / r.total) * 100);
                                  const cm = cp.reduce((a, b) => a + b, 0) / cp.length;
                                  const cs = Math.sqrt(cp.reduce((s, p) => s + Math.pow(p - cm, 2), 0) / cp.length);
                                  return cs < 8 ? 'High' : cs < 16 ? 'Moderate' : 'Low';
                                })(),
                              },
                              {
                                label: 'Projected Range',
                                value: (() => {
                                  if (markedItems.length < 2) return '—';
                                  const lo = projectedAvg(50);
                                  const hi = projectedAvg(90);
                                  return `${lo.toFixed(0)}–${hi.toFixed(0)}%`;
                                })(),
                              },
                            ].map(stat => (
                              <div key={stat.label} className="bg-stone-50 rounded-xl px-3 py-2.5 text-center">
                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                <p className="font-black text-stone-900 text-sm">{stat.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Weighted final marks per term */}
                          {termFinals.length > 0 && (
                            <div className="px-5 pb-3 flex flex-wrap gap-2">
                              {termFinals.map(t => (
                                <div key={t.term} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                                  t.isComplete
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-stone-50 text-stone-500 border-brand-border/60'
                                }`}>
                                  <span className="font-black">Term {t.term}</span>
                                  <span className="opacity-50">·</span>
                                  {t.isComplete
                                    ? <span>Final: {t.finalMark}%</span>
                                    : <span>{t.weightTotal}% weight used</span>
                                  }
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Achievement chips */}
                          {(highestMark !== null || bestImprove !== null || markedItems.length > 0) && (
                            <div className="px-5 pt-4 pb-3 flex flex-wrap gap-2">
                              {highestMark !== null && (
                                <div className="flex items-center gap-1.5 bg-stone-50 border border-brand-border/60 rounded-xl px-3 py-1.5">
                                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Best</span>
                                  <span className="text-xs font-black text-stone-900">{highestMark}%</span>
                                </div>
                              )}
                              {bestImprove !== null && (
                                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
                                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Best jump</span>
                                  <span className="text-xs font-black text-emerald-700">+{bestImprove}%</span>
                                </div>
                              )}
                              {markedItems.length > 0 && (
                                <div className="flex items-center gap-1.5 bg-stone-50 border border-brand-border/60 rounded-xl px-3 py-1.5">
                                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Completed</span>
                                  <span className="text-xs font-black text-stone-900">{markedItems.length}</span>
                                </div>
                              )}
                              {(() => {
                                // Find impact for this subject (fuzzy match on first word)
                                const key = Array.from(subjectImpact.keys()).find(k =>
                                  k.toLowerCase().includes(subject.split(' ')[0].toLowerCase()) ||
                                  subject.toLowerCase().includes(k.split(' ')[0].toLowerCase())
                                );
                                const imp = key ? subjectImpact.get(key) : undefined;
                                if (!imp || imp.completed === 0) return null;
                                return (
                                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                                      {imp.completed} recommendation{imp.completed !== 1 ? 's' : ''} completed
                                    </span>
                                    {imp.avgImprovement > 0 && (
                                      <span className="text-xs font-black text-emerald-700">+{imp.avgImprovement}%</span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          {/* Performance zone bar */}
                          {subjectAvg !== null && (
                            <div className="border-t border-brand-border/60">
                              <PerformanceZoneBar avg={subjectAvg} />
                            </div>
                          )}

                          {/* Chart */}
                          {chartData.length >= 2 && (
                            <div className="px-5 pt-4 pb-2 border-t border-brand-border/60">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Performance</p>
                              <ResponsiveContainer width="100%" height={140}>
                                <BarChart data={chartData} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                                  <YAxis domain={[0, 100]} ticks={[0, 50, 70, 80, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f5f5f4' }} />
                                  <ReferenceLine y={80} stroke="#d1fae5" strokeDasharray="3 3" />
                                  <ReferenceLine y={70} stroke="#dbeafe" strokeDasharray="3 3" />
                                  <ReferenceLine y={50} stroke="#fef3c7" strokeDasharray="3 3" />
                                  <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                      <Cell key={index} fill={barColor(entry.pct)} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                          {/* Assessment type breakdown */}
                          {hasTypeBreakdown && (
                            <div className="px-5 py-4 border-t border-brand-border/60">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">By Type</p>
                              <div className="flex flex-wrap gap-2">
                                {typeBreakdown.map(({ type, avg, count }) => {
                                  const color = avg >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                              : avg >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100'
                                              :             'bg-red-50 text-red-700 border-red-100';
                                  return (
                                    <div key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${color}`}>
                                      <span className="font-black">{type}</span>
                                      <span className="opacity-50">·</span>
                                      <span>{avg}%</span>
                                      <span className="opacity-40 text-[10px]">({count})</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Grade Distribution */}
                          {markedItems.length >= 3 && (() => {
                            const gradeBands = [
                              { label: 'Outstanding', min: 80,  max: 101, color: 'bg-emerald-500' },
                              { label: 'Merit',       min: 70,  max: 80,  color: 'bg-blue-500' },
                              { label: 'Adequate',    min: 60,  max: 70,  color: 'bg-sky-500' },
                              { label: 'Moderate',    min: 50,  max: 60,  color: 'bg-amber-500' },
                              { label: 'Elementary',  min: 40,  max: 50,  color: 'bg-orange-500' },
                              { label: 'Not Achieved', min: 0,  max: 40,  color: 'bg-red-500' },
                            ];
                            const counts = gradeBands.map(g => ({
                              ...g,
                              count: markedItems.filter(r => {
                                const p = (r.mark! / r.total) * 100;
                                return p >= g.min && p < g.max;
                              }).length,
                            })).filter(g => g.count > 0);
                            if (counts.length === 0) return null;
                            const maxCount = Math.max(...counts.map(g => g.count));
                            return (
                              <div className="px-5 py-4 border-t border-brand-border/60">
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Grade Distribution</p>
                                <div className="space-y-2">
                                  {counts.map(g => (
                                    <div key={g.label} className="flex items-center gap-3">
                                      <span className="text-[11px] font-bold text-stone-500 w-24 shrink-0">{g.label}</span>
                                      <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${(g.count / maxCount) * 100}%` }}
                                          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                                          className={`h-full rounded-full ${g.color}`}
                                        />
                                      </div>
                                      <span className="text-[11px] font-black text-stone-600 w-4 text-right">{g.count}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Focus Area card */}
                          {hasTypeBreakdown && weakestType && strongestType && weakestType.type !== strongestType.type && (
                            <div className="mx-5 mb-4 bg-stone-50 rounded p-4 border border-brand-border/60">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Focus Area</p>
                              <p className="text-sm font-bold text-stone-900 mb-1">
                                Your {weakestType.type} average is {weakestType.avg}% vs {strongestType.avg}% for {strongestType.type}s.
                              </p>
                              <p className="text-xs text-stone-500 leading-relaxed">
                                Improving {weakestType.type.toLowerCase()} performance would raise your subject average fastest.
                              </p>
                            </div>
                          )}

                          {/* Smart Insights */}
                          {(() => {
                            if (subjectAvg === null) return null;
                            const insights: string[] = [];

                            const testType   = typeBreakdown.find(t => t.type.toLowerCase().includes('test'));
                            const assignType = typeBreakdown.find(t => t.type.toLowerCase().includes('assign'));
                            if (testType && assignType) {
                              const gap = testType.avg - assignType.avg;
                              if (Math.abs(gap) >= 10) {
                                insights.push(gap > 0
                                  ? `Test average is ${gap}% higher than assignments.`
                                  : `Assignment average is ${Math.abs(gap)}% higher than tests — check test preparation.`
                                );
                              }
                            }

                            if (trend !== null && Math.abs(trend) >= 5) {
                              insights.push(trend > 0
                                ? `Last 3 assessments are trending upward (+${trend.toFixed(0)}%).`
                                : `Recent assessments show a decline (${trend.toFixed(0)}%) — worth addressing.`
                              );
                            }

                            const nextAvg = projectedAvg(75);
                            if (nextAvg >= 70 && subjectAvg < 70) {
                              insights.push(`One more 75%+ result would move this subject into Merit.`);
                            } else if (nextAvg >= 80 && subjectAvg < 80) {
                              insights.push(`One more 75%+ result could push this into Outstanding.`);
                            }

                            const subPcts = markedItems.map(r => (r.mark! / r.total) * 100);
                            const stdDev = subPcts.length >= 3
                              ? Math.sqrt(subPcts.reduce((s, p) => s + Math.pow(p - subjectAvg, 2), 0) / subPcts.length)
                              : null;
                            if (stdDev !== null && stdDev < 8) {
                              insights.push(`Very consistent performance — low variation between results.`);
                            } else if (stdDev !== null && stdDev > 20) {
                              insights.push(`High variation between results — performance is inconsistent.`);
                            }

                            if (insights.length === 0) return null;

                            return (
                              <div className="px-5 py-4 border-t border-brand-border/60">
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Insights</p>
                                <div className="space-y-2">
                                  {insights.map((text, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0 mt-[7px]" />
                                      <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Three-scenario projection */}
                          {subjectAvg !== null && markedItems.length >= 2 && (
                            <div className="px-5 py-4 border-t border-brand-border/60">
                              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                                What If Next Result Is...
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {[50, 70, 90].map(mark => {
                                  const projected = projectedAvg(mark);
                                  const diff = projected - subjectAvg;
                                  return (
                                    <div key={mark} className="bg-stone-50 rounded-xl p-3 text-center border border-brand-border/60">
                                      <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">{mark}%</p>
                                      <p className="font-black text-stone-900 text-lg leading-none">{projected.toFixed(1)}%</p>
                                      <p className={`text-[10px] font-bold mt-1 ${diff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Type filter pills */}
                          {typeBreakdown.length >= 2 && (
                            <div className="px-5 pb-3 pt-1 border-t border-brand-border/60">
                              <div className="flex flex-wrap gap-1.5">
                                {['All', ...typeBreakdown.map(t => t.type)].map(type => (
                                  <button
                                    key={type}
                                    onClick={() => setTypeFilter(prev => ({ ...prev, [subject]: type }))}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                      activeType === type
                                        ? 'bg-brand-dark text-white'
                                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Assessment timeline */}
                          <div className="px-5 pb-5 pt-3 border-t border-brand-border/60">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">Results</p>
                            <div className="relative">
                              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-200" />
                              <div className="space-y-4">
                                {[...filteredItems]
                                  .sort((a, b) => new Date(b.marked_at ?? b.created_at).getTime() - new Date(a.marked_at ?? a.created_at).getTime())
                                  .map((r, i) => {
                                    const g = gradeLabel(r.mark, r.total);
                                    const p = r.mark !== null ? pctNum(r.mark, r.total) : null;
                                    return (
                                      <motion.div key={r.sheet_id}
                                        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="flex items-start gap-4 relative cursor-pointer"
                                        onClick={() => setDrawerResult(r)}
                                      >
                                        <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shrink-0 mt-1 z-10 ${
                                          p === null ? 'bg-stone-300' :
                                          p >= 80   ? 'bg-emerald-500' :
                                          p >= 70   ? 'bg-blue-500' :
                                          p >= 50   ? 'bg-amber-500' : 'bg-red-500'
                                        }`} />
                                        <div className="flex-1 min-w-0 flex items-start justify-between gap-3 hover:bg-stone-50 rounded-xl px-2 py-1 -mx-2 -my-1 transition-colors">
                                          <div className="min-w-0">
                                            <p className="text-sm font-bold text-stone-900 truncate">{r.sheet_title}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                              {r.sheet_scope && (
                                                <span className="text-[10px] font-bold text-stone-500">{r.sheet_scope}</span>
                                              )}
                                              {r.marked_at && (
                                                <span className="text-[10px] text-stone-400">{formatDate(r.marked_at)}</span>
                                              )}
                                            </div>
                                            {r.note && (
                                              <p className="text-xs text-stone-500 mt-1 bg-stone-50 rounded-lg px-2 py-1">
                                                {r.note}
                                              </p>
                                            )}
                                          </div>
                                          <div className="shrink-0 text-right">
                                            {r.mark !== null ? (
                                              <>
                                                <p className="text-base font-black text-stone-900 leading-none">
                                                  {r.mark}<span className="text-xs font-bold text-stone-500">/{r.total}</span>
                                                </p>
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${g.bg} ${g.color}`}>
                                                  {p}%
                                                </span>
                                              </>
                                            ) : (
                                              <span className="text-xs font-bold text-stone-400">Pending</span>
                                            )}
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
      </div>

      {/* Assessment Detail Drawer */}
      <AnimatePresence>
        {drawerResult && (() => {
          const r = drawerResult;
          const p = r.mark !== null ? pctNum(r.mark, r.total) : null;
          const g = gradeLabel(r.mark, r.total);

          const subjectResults = results
            .filter(x => x.subject_label === r.subject_label && x.mark !== null)
            .sort((a, b) => new Date(a.marked_at ?? a.created_at).getTime() - new Date(b.marked_at ?? b.created_at).getTime());
          const thisIndex  = subjectResults.findIndex(x => x.sheet_id === r.sheet_id);
          const leadingIn  = subjectResults.slice(Math.max(0, thisIndex - 3), thisIndex);
          const leadingAvg = leadingIn.length
            ? leadingIn.reduce((s, x) => s + (x.mark! / x.total) * 100, 0) / leadingIn.length
            : null;
          const leadingDiff = p !== null && leadingAvg !== null ? p - leadingAvg : null;

          const insight = (() => {
            if (p === null) return null;
            if (p >= 80) return 'Outstanding result — this lifted your subject average.';
            if (leadingDiff !== null && leadingDiff >= 10) return `Up ${leadingDiff.toFixed(0)}% from your recent trend — strong improvement.`;
            if (leadingDiff !== null && leadingDiff <= -10) return `Down ${Math.abs(leadingDiff).toFixed(0)}% from your recent trend — worth reviewing.`;
            if (p >= 70) return 'Solid result — consistent with your profile.';
            if (p < 50) return 'Below pass mark — check teacher notes and revisit the topic.';
            return 'On track — keep building on this.';
          })();

          return (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={() => setDrawerResult(null)}
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 bg-stone-200 rounded-full" />
                </div>

                <div className="px-6 pb-8 pt-3">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-1">
                        {r.subject_label} · {r.sheet_scope ?? 'Assessment'}
                      </p>
                      <h2 className="font-black text-stone-900 text-xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                        {r.sheet_title}
                      </h2>
                      {r.marked_at && (
                        <p className="text-xs text-stone-500 mt-1">{formatDate(r.marked_at)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setDrawerResult(null)}
                      className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 hover:bg-stone-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-stone-500" />
                    </button>
                  </div>

                  {/* Score hero */}
                  {p !== null ? (
                    <div className={`rounded p-5 mb-5 ${g.bg}`}>
                      <div className="flex items-end gap-3">
                        <p className={`font-black leading-none ${g.color}`} style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}>
                          {p}%
                        </p>
                        <div className="mb-1">
                          <p className={`font-black text-lg leading-none ${g.color}`}>{g.label}</p>
                          <p className="text-sm text-stone-500 mt-0.5">{r.mark} / {r.total} marks</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-stone-100 rounded p-5 mb-5 text-center">
                      <p className="font-black text-stone-500 text-lg">Pending</p>
                      <p className="text-xs text-stone-500 mt-1">Mark not yet recorded</p>
                    </div>
                  )}

                  {/* Insight */}
                  {insight && (
                    <div className="bg-brand-dark text-white rounded px-4 py-3 mb-5 flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm font-bold leading-relaxed">{insight}</p>
                    </div>
                  )}

                  {/* Leading trend mini chart */}
                  {leadingIn.length > 0 && (
                    <div className="bg-stone-50 rounded p-4 mb-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                        Trend Leading In
                      </p>
                      <div className="flex items-end gap-2">
                        {leadingIn.map((x, i) => {
                          const xp = pctNum(x.mark!, x.total);
                          return (
                            <div key={x.sheet_id} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[10px] font-bold text-stone-500">{xp}%</span>
                              <div className="w-full rounded-t-sm" style={{
                                height: `${Math.max(8, xp * 0.5)}px`,
                                background: barColor(xp),
                                opacity: 0.6 + (i / leadingIn.length) * 0.4,
                              }} />
                              <span className="text-[9px] text-stone-400 truncate w-full text-center">
                                {x.sheet_title.slice(0, 8)}
                              </span>
                            </div>
                          );
                        })}
                        {p !== null && (
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black text-stone-900">{p}%</span>
                            <div className="w-full rounded-t-sm border-2 border-brand-dark" style={{
                              height: `${Math.max(8, p * 0.5)}px`,
                              background: barColor(p),
                            }} />
                            <span className="text-[9px] font-black text-stone-600 truncate w-full text-center">This</span>
                          </div>
                        )}
                      </div>
                      {leadingDiff !== null && (
                        <p className={`text-xs font-bold mt-2 ${leadingDiff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {leadingDiff >= 0 ? '+' : ''}{leadingDiff.toFixed(1)}% vs your recent average
                        </p>
                      )}
                    </div>
                  )}

                  {/* Teacher note */}
                  {r.note && (
                    <div className="border border-amber-200 bg-amber-50 rounded p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-600 mb-2">Teacher Note</p>
                      <p className="text-sm text-stone-700 leading-relaxed">{r.note}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
