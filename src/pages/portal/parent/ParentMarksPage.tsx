import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, ChevronDown } from 'lucide-react';
import { fetchStudentResults, computeFinalMark, type StudentResult } from '../../../lib/marks';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';

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

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">{child.name} {child.surname}</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Marks</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ClipboardList className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No results yet.</p>
          <p className="text-xs text-stone-400 mt-1">Marks will appear here once teachers have recorded them.</p>
        </div>
      ) : (
        <>
          {overallAvg !== null && (
            <div className="card-premium-dark bg-brand-dark text-white rounded-[24px] p-6 mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400 mb-1">Overall Average</p>
              <p className="text-3xl font-black">{Math.round(overallAvg)}%</p>
              <p className="text-xs text-stone-400 mt-1">{markedResults.length} result{markedResults.length !== 1 ? 's' : ''} recorded</p>
            </div>
          )}

          <div className="space-y-3">
            {Array.from(grouped.entries()).map(([subject, items]) => {
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
                <div key={subject} className="card-premium bg-white rounded-[24px] border border-brand-border overflow-hidden">
                  <button
                    onClick={() => setOpenSubject(isOpen ? null : subject)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-stone-900">{subject}</p>
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
                                <div key={t.term} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
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
                                      <p className="text-sm font-bold text-stone-900 truncate">{r.sheet_title}</p>
                                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                        {r.sheet_scope && <span className="text-[10px] font-bold text-stone-500">{r.sheet_scope}</span>}
                                        {r.marked_at && <span className="text-[10px] text-stone-400">{formatDate(r.marked_at)}</span>}
                                      </div>
                                      {r.note && (
                                        <p className="text-xs text-stone-500 mt-1 bg-stone-50 rounded-lg px-2 py-1">{r.note}</p>
                                      )}
                                    </div>
                                    <div className="shrink-0 text-right">
                                      {r.mark !== null ? (
                                        <>
                                          <p className="text-base font-black text-stone-900 leading-none">
                                            {r.mark}<span className="text-xs font-bold text-stone-500">/{r.total}</span>
                                          </p>
                                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${g.bg} ${g.color}`}>{p}%</span>
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
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
