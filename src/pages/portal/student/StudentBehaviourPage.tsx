import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Shimmer } from './StudentHomePage';
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
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero ═════════════════════════════════════════════════ */}
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="flex items-center gap-2 min-w-0">
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">My Behaviour</p>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Merits & Demerits
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium">
            Your conduct record, as logged by your teachers.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="inline-flex items-center gap-2 mt-4 border border-brand-border bg-white/70 rounded-full pl-3 pr-4 py-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(31,36,33,0.5)]">NET</span>
            <span className={`font-black text-sm ${netPoints >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {netPoints > 0 ? '+' : ''}{netPoints}
            </span>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

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
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.06 }}
                className="paper-card rounded p-4 text-center"
              >
                <p className="text-[22px] font-black text-green-700">{meritPoints}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(31,36,33,0.45)] mt-1">Merits</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.1 }}
                className="paper-card rounded p-4 text-center"
              >
                <p className="text-[22px] font-black text-red-700">{demeritPoints}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(31,36,33,0.45)] mt-1">Demerits</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.14 }}
                className="rounded p-4 text-center"
                style={{
                  background: 'var(--color-brand-dark)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.25), 0 10px 24px -8px rgba(0,0,0,0.35), 0 28px 48px -20px rgba(0,0,0,0.4)',
                }}
              >
                <p className={`text-[22px] font-black ${netPoints >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {netPoints > 0 ? '+' : ''}{netPoints}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40 mt-1">Net</p>
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.2 }}
              className="paper-card rounded overflow-hidden"
            >
              <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                <h2 className="text-[16px] font-semibold text-brand-dark">Timeline</h2>
                <p className="text-[13px] text-stone-500 mt-0.5">All recorded behaviour points, most recent first.</p>
              </div>

              {entries.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[16px] font-semibold text-brand-dark mb-1">No entries yet</p>
                  <p className="text-[13px] text-stone-500">Merits and demerits from your teachers will appear here.</p>
                </div>
              ) : (
                <div>
                  {entries.map((e, i) => (
                    <motion.div key={e.id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.2) }}
                      className="flex items-start gap-3 px-5 sm:px-6 py-4"
                      style={i === entries.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                        e.type === 'merit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
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
                    </motion.div>
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
