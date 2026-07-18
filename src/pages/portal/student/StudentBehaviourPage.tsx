import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Award } from 'lucide-react';
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
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero — wave-strip system, matches Home dashboard ═══ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #d6dbde 0%, #dee3e5 22%, #e4e8ea 45%, #e9ecec 68%, #eaebec 100%)' }} />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 100">
          <path d="M0,42 C220,32 380,49 600,40 C800,32 970,46 1200,38 L1200,0 L0,0 Z" fill="rgba(200,207,212,0.5)" />
          <path d="M0,50 C210,60 390,45 610,53 C800,60 960,47 1200,55" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <path d="M0,58 C220,50 380,66 600,57 C800,50 970,63 1200,55" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          <path d="M0,66 C210,74 400,60 620,68 C810,75 980,62 1200,70" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="1" />
          <path d="M0,74 C220,66 400,82 620,73 C820,65 990,79 1200,71" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <path d="M0,82 C220,90 380,75 600,84 C800,92 970,78 1200,86" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <path d="M0,90 C210,82 390,98 610,89 C800,82 960,95 1200,87" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
          <path d="M0,96 C220,90 400,100 620,94 C820,88 990,98 1200,93" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />
          <path d="M0,55 C240,65 400,48 620,58 C820,67 980,50 1200,60 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M0,72 C240,62 420,81 640,71 C830,62 1000,79 1200,69 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.55)" />
          <path d="M0,88 C230,98 410,82 630,92 C825,101 995,85 1200,95 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.65)" />
        </svg>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #b9c0c5 0%, #c9d0d4 30%, transparent 42%, transparent 55%, rgba(234,235,236,0.75) 80%, #eaebec 100%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="flex items-center gap-2 min-w-0">
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">My Behaviour</p>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Merits & Demerits
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2.5 font-medium">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

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
                className="paper-card rounded p-4 sm:p-5"
              >
                <div className="w-8 h-8 rounded flex items-center justify-center mb-3 bg-emerald-50 text-emerald-600">
                  <Plus className="w-4 h-4" />
                </div>
                <p className="text-[26px] sm:text-[28px] font-black text-emerald-700 leading-none">{meritPoints}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(31,36,33,0.45)] mt-2">Merits</p>
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
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(31,36,33,0.45)] mt-2">Demerits</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.14 }}
                className="rounded p-4 sm:p-5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(155deg, #4b5568 0%, #3c4657 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.12), 0 6px 14px -6px rgba(0,0,0,0.18)',
                }}
              >
                <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ background: netPoints >= 0 ? '#34d399' : '#f87171' }} />
                <div className={`relative w-8 h-8 rounded flex items-center justify-center mb-3 ${netPoints >= 0 ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'}`}>
                  <Award className="w-4 h-4" />
                </div>
                <p className={`relative text-[26px] sm:text-[28px] font-black leading-none ${netPoints >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {netPoints > 0 ? '+' : ''}{netPoints}
                </p>
                <p className="relative text-[11px] font-bold uppercase tracking-[0.08em] text-white/40 mt-2">Net Score</p>
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.2 }}
              className="paper-card rounded p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(31,36,33,0.4)]">Timeline</p>
                <span className="flex-1 h-px" style={{ background: 'var(--color-brand-border)' }} />
                <span className="text-[11px] font-bold text-stone-400">{entries.length} recorded</span>
              </div>

              {entries.length === 0 ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--color-paper-raise)' }}>
                    <Award className="w-5 h-5 text-stone-300" />
                  </div>
                  <p className="text-[15px] font-semibold text-brand-dark mb-1">No entries yet</p>
                  <p className="text-[13px] text-stone-500">Merits and demerits from your teachers will appear here.</p>
                </div>
              ) : (
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
                          <span className="text-[12px] text-[rgba(31,36,33,0.35)] whitespace-nowrap shrink-0">{formatDate(e.created_at)}</span>
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
