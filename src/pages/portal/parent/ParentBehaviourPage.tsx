import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Award } from 'lucide-react';
import { fetchStudentBehaviour, type BehaviourEntry } from '../../../lib/behaviour';
import type { ParentChild } from '../../../lib/parents';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ParentBehaviourPageProps { child: ParentChild; }

export default function ParentBehaviourPage({ child }: ParentBehaviourPageProps) {
  const [entries, setEntries] = useState<BehaviourEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchStudentBehaviour(child.student_id);
      setEntries(data);
      setLoading(false);
    };
    load();
  }, [child.student_id]);

  const meritPoints = entries.filter((e) => e.type === 'merit').reduce((sum, e) => sum + e.points, 0);
  const demeritPoints = entries.filter((e) => e.type === 'demerit').reduce((sum, e) => sum + e.points, 0);
  const netPoints = meritPoints - demeritPoints;

  const categoryCounts = new Map<string, { count: number; type: 'merit' | 'demerit' }>();
  for (const e of entries) {
    const existing = categoryCounts.get(e.category);
    categoryCounts.set(e.category, { count: (existing?.count ?? 0) + 1, type: e.type });
  }
  const topCategories = Array.from(categoryCounts.entries())
    .map(([category, d]) => ({ category, ...d }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Merits &amp; demerits
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </motion.div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

        {loading ? (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="paper-card rounded p-4 text-center">
                  <Shimmer className="h-6 w-10 mx-auto mb-2" />
                  <Shimmer className="h-3 w-14 mx-auto" />
                </div>
              ))}
            </div>
            <div className="paper-card rounded overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                <Shimmer className="h-4 w-24 mb-2" />
                <Shimmer className="h-3 w-56" />
              </div>
              <div className="p-5 space-y-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <Shimmer className="w-8 h-8 rounded shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Shimmer className="h-3.5" style={{ width: `${50 - i * 5}%` }} />
                      <Shimmer className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
              className="grid grid-cols-3 gap-3">
              <div className="paper-card rounded p-4 text-center">
                <p className="text-[24px] font-black text-emerald-600">{meritPoints}</p>
                <p className="text-[12px] text-muted-2 mt-1">Merits</p>
              </div>
              <div className="paper-card rounded p-4 text-center">
                <p className={`text-[24px] font-black ${demeritPoints > 0 ? 'text-red-500' : 'text-stone-300'}`}>{demeritPoints}</p>
                <p className="text-[12px] text-muted-2 mt-1">Demerits</p>
              </div>
              <div className="paper-card rounded p-4 text-center" style={{ borderColor: netPoints >= 0 ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)' }}>
                <p className={`text-[24px] font-black ${netPoints >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {netPoints > 0 ? '+' : ''}{netPoints}
                </p>
                <p className="text-[12px] text-muted-2 mt-1">Net</p>
              </div>
            </motion.div>

            {topCategories.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.08 }}
                className="paper-card rounded p-5">
                <p className="text-[12px] text-muted-2 mb-3">Most common</p>
                <div className="flex flex-wrap gap-2">
                  {topCategories.map(({ category, count, type }) => (
                    <span key={category} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
                      type === 'merit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {category} <span className="opacity-60">× {count}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.14 }}
              className="paper-card rounded overflow-hidden">
              <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                <h2 className="text-[16px] font-semibold text-brand-dark">Timeline</h2>
                <p className="text-[13px] text-stone-500 mt-0.5">All recorded behaviour points, most recent first.</p>
              </div>

              {entries.length === 0 ? (
                <div className="p-12 flex flex-col items-center text-center">
                  <Award className="w-9 h-9 text-stone-200 mb-4" />
                  <p className="text-[16px] font-semibold text-brand-dark mb-1">No entries yet</p>
                  <p className="text-[13px] text-stone-500">Merits and demerits from teachers will appear here.</p>
                </div>
              ) : (
                <div>
                  {entries.map((e, i) => (
                    <div key={e.id} className="flex items-start gap-3 px-5 sm:px-6 py-4"
                      style={i === entries.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}>
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                        e.type === 'merit' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-500 border-red-200'
                      }`}>
                        {e.type === 'merit' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[14px] font-semibold text-brand-dark">{e.category}</p>
                          <span className="text-[12px] text-[rgba(31,36,33,0.35)] whitespace-nowrap">{formatDate(e.created_at)}</span>
                        </div>
                        {e.reason && <p className="text-[13px] text-stone-600 font-medium mt-0.5">{e.reason}</p>}
                        <p className="text-[12px] text-[rgba(31,36,33,0.4)] mt-0.5">{e.teacher_name ?? 'Teacher'} {e.teacher_surname ?? ''}</p>
                        {e.note && <p className="text-[13px] text-stone-600 mt-1.5">{e.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
