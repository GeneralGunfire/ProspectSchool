import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, ChevronDown } from 'lucide-react';
import { fetchStudentResults, computeFinalMark, type StudentResult } from '../../../lib/marks';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

function Ring({ pct, size = 44, stroke = 4, trackColor = 'rgba(31,36,33,0.08)' }: { pct: number; size?: number; stroke?: number; trackColor?: string }) {
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

interface ParentMarksPageProps {
  session: ParentSession;
  child: ParentChild;
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

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ParentMarksPage({ session, child }: ParentMarksPageProps) {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSubject, setOpenSubject] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchStudentResults(child.student_id, session.school_id).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [child.student_id, session.school_id]);

  const grouped = new Map<string, StudentResult[]>();
  for (const r of results) {
    if (!grouped.has(r.subject_label)) grouped.set(r.subject_label, []);
    grouped.get(r.subject_label)!.push(r);
  }

  const markedResults = results.filter((r) => r.mark !== null);
  const overallAvg = markedResults.length > 0
    ? markedResults.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / markedResults.length
    : null;

  const subjectAverages = Array.from(grouped.entries()).map(([subject, items]) => {
    const marked = items.filter((r) => r.mark !== null);
    return {
      subject,
      avg: marked.length ? marked.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / marked.length : -1,
    };
  }).filter((s) => s.avg >= 0).sort((a, b) => b.avg - a.avg);
  const bestSubject = subjectAverages[0] ?? null;
  const worstSubject = subjectAverages[subjectAverages.length - 1] ?? null;
  const showStrengthBanner = bestSubject && worstSubject && bestSubject.subject !== worstSubject.subject;

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
          className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
            <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                  Marks
                </span>
                <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                  <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </div>
          {overallAvg !== null && (
            <div className="shrink-0 flex items-center gap-3 border border-brand-border bg-white/70 rounded px-4 py-2.5">
              <div className="relative shrink-0">
                <Ring pct={Math.round(overallAvg)} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-brand-dark leading-none">{Math.round(overallAvg)}%</span>
                </div>
              </div>
              <div>
                <p className="text-[12px] text-muted-2">Overall</p>
                <p className="text-[13px] font-semibold text-brand-dark whitespace-nowrap">{markedResults.length} tracked</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {loading ? (
        <div className="space-y-5">
          <div className="paper-card rounded p-5 sm:p-6 space-y-2">
            <Shimmer className="h-3 w-1/3" />
            <Shimmer className="h-8 w-1/4" />
          </div>
          <div className="space-y-2.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="paper-card rounded p-5 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Shimmer className="h-4" style={{ width: `${50 - i * 6}%` }} />
                  <Shimmer className="h-3 w-1/4" />
                </div>
                <Shimmer className="h-8 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="paper-card rounded flex flex-col items-center justify-center py-24 text-center">
          <ClipboardList className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No results yet.</p>
          <p className="text-xs text-stone-400 mt-1">Marks will appear here once teachers have recorded them.</p>
        </div>
      ) : (
        <>
          {showStrengthBanner && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.04 }}
              className="grid grid-cols-2 gap-3">
              <div className="paper-card rounded p-4" style={{ borderLeft: '3px solid #10b981' }}>
                <p className="text-[12px] text-muted-2 mb-1">Strongest</p>
                <p className="font-black text-brand-dark text-sm leading-tight truncate">{bestSubject!.subject}</p>
                <p className="text-emerald-600 font-black text-2xl mt-1">{bestSubject!.avg.toFixed(0)}%</p>
              </div>
              <div className="paper-card rounded p-4" style={{ borderLeft: '3px solid #f59e0b' }}>
                <p className="text-[12px] text-muted-2 mb-1">Needs attention</p>
                <p className="font-black text-brand-dark text-sm leading-tight truncate">{worstSubject!.subject}</p>
                <p className="text-amber-600 font-black text-2xl mt-1">{worstSubject!.avg.toFixed(0)}%</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-3">
            {Array.from(grouped.entries()).map(([subject, items], gi) => {
              const markedItems = items.filter((r) => r.mark !== null);
              const subjectAvg = markedItems.length > 0
                ? markedItems.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / markedItems.length
                : null;
              const gl = subjectAvg !== null ? gradeLabel(subjectAvg, 100) : null;
              const isOpen = openSubject === subject;

              const termGroups = new Map<number, StudentResult[]>();
              for (const r of items) {
                if (!termGroups.has(r.term)) termGroups.set(r.term, []);
                termGroups.get(r.term)!.push(r);
              }
              const termFinals = Array.from(termGroups.entries())
                .map(([term, termItems]) => ({
                  term,
                  ...computeFinalMark(termItems.map((r) => ({ weight: r.weight, mark: r.mark, total: r.total }))),
                }))
                .filter((t) => t.weightTotal > 0)
                .sort((a, b) => a.term - b.term);

              return (
                <motion.div key={subject}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05 }}
                  className="paper-card rounded overflow-hidden">
                  <button
                    onClick={() => setOpenSubject(isOpen ? null : subject)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-brand-dark">{subject}</p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {items.length} assessment{items.length !== 1 ? 's' : ''}{gl && ` · ${gl.label}`}
                      </p>
                    </div>
                    {subjectAvg !== null && gl && (
                      <p className={`text-xl font-black ${gl.color}`}>{subjectAvg.toFixed(0)}%</p>
                    )}
                    <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden"
                      >
                        <div className="border-t border-brand-border/60">
                          {termFinals.length > 0 && (
                            <div className="px-5 pt-4 pb-1 flex flex-wrap gap-2">
                              {termFinals.map((t) => (
                                <div key={t.term} className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-bold ${
                                  t.isComplete ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-stone-50 text-stone-500 border-brand-border/60'
                                }`}>
                                  <span className="font-black">Term {t.term}</span>
                                  <span className="opacity-50">·</span>
                                  {t.isComplete ? <span>Final: {t.finalMark}%</span> : <span>{t.weightTotal}% weight used</span>}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="px-5 py-4 space-y-3">
                            {[...items]
                              .sort((a, b) => new Date(b.marked_at ?? b.created_at).getTime() - new Date(a.marked_at ?? a.created_at).getTime())
                              .map((r) => {
                                const g = gradeLabel(r.mark, r.total);
                                const p = r.mark !== null ? pctNum(r.mark, r.total) : null;
                                return (
                                  <div key={r.sheet_id} className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-sm font-bold text-brand-dark truncate">{r.sheet_title}</p>
                                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                        {r.sheet_scope && <span className="text-[10px] font-bold text-stone-500">{r.sheet_scope}</span>}
                                        {r.marked_at && <span className="text-[10px] text-stone-400">{formatDate(r.marked_at)}</span>}
                                      </div>
                                      {r.note && (
                                        <p className="text-xs text-stone-500 mt-1 bg-stone-50 rounded px-2 py-1">{r.note}</p>
                                      )}
                                    </div>
                                    <div className="shrink-0 text-right">
                                      {r.mark !== null ? (
                                        <>
                                          <p className="text-base font-black text-brand-dark leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                            {r.mark}<span className="text-xs font-bold text-stone-500">/{r.total}</span>
                                          </p>
                                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${g.bg} ${g.color}`}>{p}%</span>
                                        </>
                                      ) : (
                                        <span className="text-xs font-bold text-stone-400">Pending</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
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
    </div>
  );
}
