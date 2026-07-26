import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Award } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import type { StudentSession } from '../../../lib/auth';
import { fetchStudentBehaviour, type BehaviourEntry } from '../../../lib/behaviour';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentBehaviourPageProps { session: StudentSession; }

export default function StudentBehaviourPage({ session }: StudentBehaviourPageProps) {
  const [entries, setEntries] = useState<BehaviourEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchStudentBehaviour(session.student_id);
      setEntries(data);
      setLoading(false);
    };
    load();
  }, [session.student_id]);

  const meritPoints = entries.filter((e) => e.type === 'merit').reduce((sum, e) => sum + e.points, 0);
  const demeritPoints = entries.filter((e) => e.type === 'demerit').reduce((sum, e) => sum + e.points, 0);
  const netPoints = meritPoints - demeritPoints;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header — same compact scale as Home/Announcements ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
              Merits &amp; Demerits
            </h1>
            <p className="text-[14px] text-muted mt-1">Your conduct record, as logged by your teachers.</p>
          </div>
          {entries.length > 0 && (
            <div className="text-right shrink-0">
              <p className="text-[12px] text-muted-2">Net score</p>
              <p className={`text-[20px] leading-none ${netPoints >= 0 ? 'text-success' : 'text-red-600'}`} style={{ fontWeight: 700 }}>
                {netPoints > 0 ? '+' : ''}{netPoints}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

        {loading ? (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 + i * 0.04 }}
                  className="paper-card rounded p-4 text-center"
                >
                  <Shimmer className="h-6 w-10 mx-auto mb-2" />
                  <Shimmer className="h-3 w-14 mx-auto" />
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.18 }}
              className="paper-card rounded overflow-hidden">
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
            </motion.div>
          </div>
        ) : entries.length === 0 ? (
          <>
            {/* Zero-data state — one compact readout row instead of three
                near-empty cards each showing a lone "0". Three big cards for
                three zeros reads as broken; one quiet row reads as "nothing
                logged yet," which is the actual, unremarkable truth. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="paper-card rounded px-5 py-4 flex items-center justify-center gap-8 sm:gap-12"
            >
              <div className="text-center">
                <p className="text-[20px] font-black text-stone-300 leading-none">0</p>
                <p className="text-[12px] text-muted-2 mt-1.5">Merits</p>
              </div>
              <span className="w-px h-8" style={{ background: 'var(--color-brand-border)' }} />
              <div className="text-center">
                <p className="text-[20px] font-black text-stone-300 leading-none">0</p>
                <p className="text-[12px] text-muted-2 mt-1.5">Demerits</p>
              </div>
              <span className="w-px h-8" style={{ background: 'var(--color-brand-border)' }} />
              <div className="text-center">
                <p className="text-[20px] font-black text-stone-300 leading-none">0</p>
                <p className="text-[12px] text-muted-2 mt-1.5">Net Score</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.08 }}
              className="paper-card rounded p-8 flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--color-paper-raise)' }}>
                <Award className="w-5 h-5 text-stone-300" />
              </div>
              <p className="text-[15px] font-semibold text-brand-dark mb-1">No entries yet</p>
              <p className="text-[13px] text-stone-500 max-w-xs">Merits and demerits from your teachers will appear here as they're logged.</p>
            </motion.div>
          </>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.06 }}
                className="paper-card rounded p-4 sm:p-5"
              >
                <div className="w-8 h-8 rounded flex items-center justify-center mb-3 bg-emerald-50 text-emerald-600">
                  <Plus className="w-4 h-4" />
                </div>
                <p className="text-[26px] sm:text-[28px] font-black text-emerald-700 leading-none">{meritPoints}</p>
                <p className="text-[12px] text-muted-2 mt-2">Merits</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.1 }}
                className="paper-card rounded p-4 sm:p-5"
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center mb-3 ${demeritPoints > 0 ? 'bg-red-50 text-red-600' : 'bg-[var(--color-paper-raise)] text-stone-300'}`}>
                  <Minus className="w-4 h-4" />
                </div>
                <p className={`text-[26px] sm:text-[28px] font-black leading-none ${demeritPoints > 0 ? 'text-red-700' : 'text-stone-300'}`}>{demeritPoints}</p>
                <p className="text-[12px] text-muted-2 mt-2">Demerits</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.14 }}
                className="paper-card rounded p-4 sm:p-5 relative overflow-hidden"
              >
                <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ background: netPoints >= 0 ? '#34d399' : '#f87171' }} />
                <div className={`relative w-8 h-8 rounded flex items-center justify-center mb-3 ${netPoints >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <Award className="w-4 h-4" />
                </div>
                <p className={`relative text-[26px] sm:text-[28px] font-black leading-none ${netPoints >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {netPoints > 0 ? '+' : ''}{netPoints}
                </p>
                <p className="relative text-[12px] text-muted-2 mt-2">Net Score</p>
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.2 }}
              className="paper-card rounded p-5 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[17px] text-brand-dark" style={{ fontWeight: 600 }}>Timeline</p>
                <span className="text-[13px] text-muted">{entries.length} recorded</span>
              </div>

              <div className="-mx-5 sm:-mx-6">
                  {entries.map((e, i) => (
                    <motion.div key={e.id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.2) }}
                      className="flex items-start gap-3 px-5 sm:px-6 py-4"
                      style={i === entries.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}
                    >
                      <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${
                        e.type === 'merit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {e.type === 'merit' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="text-[14px] font-semibold text-brand-dark truncate">{e.category}</p>
                            <span className={`shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded ${
                              e.type === 'merit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {e.type === 'merit' ? '+' : '-'}{e.points}
                            </span>
                          </div>
                          <span className="text-[12px] text-muted-2 whitespace-nowrap shrink-0">{formatDate(e.created_at)}</span>
                        </div>
                        {e.reason && <p className="text-[13px] text-stone-600 font-medium mt-0.5">{e.reason}</p>}
                        <p className="text-[12px] text-muted-2 mt-0.5">{e.teacher_name ?? 'Teacher'} {e.teacher_surname ?? ''}</p>
                        {e.note && <p className="text-[13px] text-stone-600 mt-1.5">{e.note}</p>}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
