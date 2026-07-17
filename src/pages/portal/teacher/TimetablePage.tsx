import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { CalendarClock } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { DAYS, fetchSchoolPeriods, fetchTeacherTimetable, type TimetablePeriod, type TimetableEntryDetailed } from '../../../lib/timetable';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface TimetablePageProps { session: TeacherSession; }

export default function TimetablePage({ session }: TimetablePageProps) {
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [entries, setEntries] = useState<TimetableEntryDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [p, e] = await Promise.all([
        fetchSchoolPeriods(session.school_id),
        fetchTeacherTimetable(session.teacher_id),
      ]);
      setPeriods(p);
      setEntries(e);
      setLoading(false);
    };
    load();
  }, [session.teacher_id, session.school_id]);

  const grid = useMemo(() => {
    const map = new Map<string, TimetableEntryDetailed[]>();
    for (const en of entries) {
      const key = `${en.day_of_week}-${en.period_number}`;
      const list = map.get(key) ?? [];
      list.push(en);
      map.set(key, list);
    }
    return map;
  }, [entries]);

  const todayDow = new Date().getDay();

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═══════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-timetable.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0.05) 0%, transparent 35%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">My Timetable</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Weekly Timetable
            </h1>
            <p className="text-[13px] text-white/60 mt-2.5 font-medium">
              Your classes and periods for the week ahead.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

        {loading ? (
          <div className="paper-card rounded overflow-hidden p-5">
            <div className="flex gap-2 mb-4">
              <Shimmer className="h-8 w-24" />
              {[0, 1, 2, 3, 4].map(i => <Shimmer key={i} className="h-8 flex-1" />)}
            </div>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <motion.div key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex gap-2"
                >
                  <Shimmer className="h-12 w-24" />
                  {[0, 1, 2, 3, 4].map(j => <Shimmer key={j} className="h-12 flex-1" />)}
                </motion.div>
              ))}
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="paper-card rounded p-12 flex flex-col items-center text-center">
            <CalendarClock className="w-9 h-9 text-stone-200 mb-4" />
            <p className="text-[16px] font-semibold text-brand-dark mb-1">No timetable set yet</p>
            <p className="text-[13px] text-stone-500">Your school admin hasn't built your timetable yet.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.06 }}
            className="paper-card rounded overflow-x-auto"
          >
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(31,36,33,0.45)] sticky left-0 z-10 min-w-[110px]"
                    style={{ borderBottom: '1px solid var(--color-brand-border)', borderRight: '1px solid var(--color-brand-border)', background: 'var(--color-paper-raise)' }}>
                    Period
                  </th>
                  {DAYS.map((d) => {
                    const isToday = d.value === todayDow;
                    return (
                      <th key={d.value} className={`text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] min-w-[160px] ${isToday ? 'text-brand-dark' : 'text-[rgba(31,36,33,0.45)]'}`}
                        style={{ borderBottom: '1px solid var(--color-brand-border)', background: isToday ? 'var(--color-paper-raise)' : undefined }}>
                        <span className="inline-flex items-center gap-1.5">
                          {d.label}
                          {isToday && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-accent)' }} />}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {periods.map((p, pi) => (
                  <motion.tr key={p.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(pi * 0.03, 0.2) }}
                    style={pi === periods.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}
                  >
                    <td className="px-4 py-3 font-semibold text-brand-dark sticky left-0"
                      style={{ borderRight: '1px solid var(--color-brand-border)', background: 'var(--color-paper-raise)' }}>
                      <p className="text-[12px] font-bold">{p.label}</p>
                      {p.start_time && p.end_time && (
                        <p className="text-[10px] text-[rgba(31,36,33,0.35)] mt-0.5">{p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}</p>
                      )}
                    </td>
                    {DAYS.map((d) => {
                      const slotEntries = grid.get(`${d.value}-${p.period_number}`) ?? [];
                      const isToday = d.value === todayDow;
                      return (
                        <td key={d.value} className="px-2 py-2 align-top"
                          style={{ borderLeft: '1px solid var(--color-paper-raise)', background: isToday ? 'rgba(31,36,33,0.02)' : undefined }}>
                          {slotEntries.length === 0 ? (
                            <span className="block text-center text-stone-200 text-xs py-2">—</span>
                          ) : (
                            <div className="space-y-1">
                              {slotEntries.map((e) => (
                                <div key={e.id} className="rounded px-2 py-1.5 border"
                                  style={{ background: isToday ? '#ffffff' : 'var(--color-paper-raise)', borderColor: isToday ? 'var(--color-accent)' : 'var(--color-brand-border)' }}>
                                  <p className="text-[11px] font-bold text-brand-dark leading-tight truncate">{e.subject_label}</p>
                                  <p className="text-[10px] text-[rgba(31,36,33,0.4)] leading-tight truncate">{e.cohort_name}{e.room ? ` · ${e.room}` : ''}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
