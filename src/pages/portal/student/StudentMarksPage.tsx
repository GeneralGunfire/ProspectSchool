import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  ReferenceLine, Cell,
} from 'recharts';
import { fetchStudentResults, type StudentResult } from '../../../lib/marks';
import type { StudentSession } from '../../../lib/auth';

// ── Helpers ───────────────────────────────────────────────────

function pct(mark: number | null, total: number): string {
  if (mark === null) return '—';
  return `${Math.round((mark / total) * 100)}%`;
}

function pctNum(mark: number, total: number): number {
  return Math.round((mark / total) * 100);
}

function gradeLabel(mark: number | null, total: number): { label: string; color: string; bg: string } {
  if (mark === null) return { label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-100' };
  const p = (mark / total) * 100;
  if (p >= 80) return { label: 'Outstanding', color: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (p >= 70) return { label: 'Merit',       color: 'text-blue-700',    bg: 'bg-blue-50' };
  if (p >= 60) return { label: 'Adequate',    color: 'text-sky-700',     bg: 'bg-sky-50' };
  if (p >= 50) return { label: 'Moderate',    color: 'text-amber-700',   bg: 'bg-amber-50' };
  if (p >= 40) return { label: 'Elementary',  color: 'text-orange-700',  bg: 'bg-orange-50' };
  return               { label: 'Not Achieved', color: 'text-red-700',   bg: 'bg-red-50' };
}

function barColor(p: number): string {
  if (p >= 80) return '#10b981'; // emerald
  if (p >= 70) return '#3b82f6'; // blue
  if (p >= 60) return '#0ea5e9'; // sky
  if (p >= 50) return '#f59e0b'; // amber
  if (p >= 40) return '#f97316'; // orange
  return '#ef4444';              // red
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Short label for chart x-axis
function shortTitle(title: string): string {
  return title.length > 12 ? title.slice(0, 11) + '…' : title;
}

// ── Custom tooltip ────────────────────────────────────────────

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl">
      <p className="font-black">{d.fullTitle}</p>
      <p className="text-white/70 mt-0.5">{d.mark}/{d.total} — {d.pct}%</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface StudentMarksPageProps {
  session: StudentSession;
}

export default function StudentMarksPage({ session }: StudentMarksPageProps) {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentResults(session.student_id, session.school_id).then(data => {
      setResults(data);
      setLoading(false);
    });
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

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Results</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Marks</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ClipboardList className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">No results yet.</p>
          <p className="text-xs text-slate-300 mt-1">Your marks will appear here once your teacher has recorded them.</p>
        </div>
      ) : (
        <>
          {/* Overall summary */}
          {overallAvg !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 text-white rounded-2xl p-5 mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-0.5">Overall Average</p>
                <p className="text-2xl font-black tracking-tight">{overallAvg.toFixed(1)}%</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-white/50 font-bold">{markedResults.length} result{markedResults.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-white/50 font-bold">{results.length - markedResults.length} pending</p>
              </div>
            </motion.div>
          )}

          {/* Results by subject */}
          <div className="space-y-4">
            {Array.from(grouped.entries()).map(([subject, items], gi) => {
              // Chart data — only marked items
              const chartData = items
                .filter(r => r.mark !== null)
                .map(r => ({
                  name:      shortTitle(r.sheet_title ?? ''),
                  fullTitle: r.sheet_title ?? '',
                  pct:       pctNum(r.mark!, r.total),
                  mark:      r.mark,
                  total:     r.total,
                }));

              // Subject average
              const subjectMarked = items.filter(r => r.mark !== null);
              const subjectAvg = subjectMarked.length > 0
                ? subjectMarked.reduce((s, r) => s + (r.mark! / r.total) * 100, 0) / subjectMarked.length
                : null;

              return (
                <motion.div key={subject}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.06 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

                  {/* Subject header */}
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-black text-slate-900">{subject}</p>
                    <div className="flex items-center gap-3">
                      {subjectAvg !== null && (
                        <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${gradeLabel(subjectAvg, 100).bg} ${gradeLabel(subjectAvg, 100).color}`}>
                          Avg {subjectAvg.toFixed(0)}%
                        </span>
                      )}
                      <p className="text-xs text-slate-400 font-bold">{items.length} assessment{items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Chart — only when 2+ marked results */}
                  {chartData.length >= 2 && (
                    <div className="px-5 pt-4 pb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Performance</p>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={chartData} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            axisLine={false} tickLine={false}
                          />
                          <YAxis
                            domain={[0, 100]} ticks={[0, 50, 100]}
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            axisLine={false} tickLine={false}
                          />
                          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                          <ReferenceLine y={50} stroke="#e2e8f0" strokeDasharray="3 3" />
                          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={index} fill={barColor(entry.pct)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Result rows */}
                  <div className="divide-y divide-slate-100">
                    {items.map((r, i) => {
                      const g = gradeLabel(r.mark, r.total);
                      return (
                        <motion.div key={r.sheet_id}
                          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: gi * 0.06 + i * 0.04 }}
                          className="px-5 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{r.sheet_title}</p>
                              {r.sheet_scope && <p className="text-xs text-slate-400 mt-0.5">{r.sheet_scope}</p>}
                              {r.marked_at && <p className="text-[10px] text-slate-300 mt-1">{formatDate(r.marked_at)}</p>}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <p className="text-lg font-black text-slate-900 leading-none">
                                  {r.mark !== null ? r.mark : '—'}
                                  <span className="text-xs font-bold text-slate-400">/{r.total}</span>
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-0.5">{pct(r.mark, r.total)}</p>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl ${g.bg} ${g.color}`}>
                                {g.label}
                              </span>
                            </div>
                          </div>
                          {r.note && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Teacher note</p>
                              <p className="text-xs text-slate-600 leading-relaxed">{r.note}</p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
