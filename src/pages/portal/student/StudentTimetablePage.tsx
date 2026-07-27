import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { CalendarClock, CalendarDays, Rows3 } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import type { StudentSession } from '../../../lib/auth';
import { DAYS, fetchSchoolPeriods, fetchStudentTimetable, type TimetablePeriod, type TimetableEntryDetailed } from '../../../lib/timetable';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentTimetablePageProps { session: StudentSession; }

export default function StudentTimetablePage({ session }: StudentTimetablePageProps) {
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [entries, setEntries] = useState<TimetableEntryDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [p, e] = await Promise.all([
        fetchSchoolPeriods(session.school_id),
        fetchStudentTimetable(session.student_id, session.cohort_id),
      ]);
      setPeriods(p);
      setEntries(e);
      setLoading(false);
    };
    load();
  }, [session.student_id, session.cohort_id, session.school_id]);

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

  // "Right now" strip — finds the current or next period today by comparing
  // wall-clock time against each period's start/end, so the page opens with
  // an at-a-glance answer instead of just a static grid.
  const todaySchedule = useMemo(() => {
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    return periods
      .filter(p => p.start_time && p.end_time)
      .map(p => {
        const slotEntries = grid.get(`${todayDow}-${p.period_number}`) ?? [];
        const start = toMinutes(p.start_time!);
        const end = toMinutes(p.end_time!);
        return { period: p, entries: slotEntries, start, end, isNow: nowMinutes >= start && nowMinutes < end };
      })
      .filter(row => row.entries.length > 0)
      .sort((a, b) => a.start - b.start);
  }, [periods, grid, todayDow]);

  const nowMinutesForNext = new Date().getHours() * 60 + new Date().getMinutes();
  const currentSlot = todaySchedule.find(s => s.isNow);
  const nextSlot = !currentSlot ? todaySchedule.find(s => s.start > nowMinutesForNext) : null;
  const highlightSlot = currentSlot ?? nextSlot;

  const todayLabel = DAYS.find(d => d.value === todayDow)?.label ?? '';
  const isSchoolDayToday = DAYS.some(d => d.value === todayDow);

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header — same compact scale as Home/Announcements ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
              Weekly Timetable
            </span>
            <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
              <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-[14px] text-muted mt-1">Your classes and periods for the week ahead.</p>

        {/* "Right now" status — same visual recipe as Home's focus block */}
        {!loading && highlightSlot && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: currentSlot ? 'var(--color-accent)' : 'var(--color-muted-2)' }} />
              <span className="text-[12px] font-semibold text-muted">
                {currentSlot ? 'Happening now' : 'Up next'} · {highlightSlot.period.label}
              </span>
            </div>
            <p className="text-brand-dark text-[20px] leading-snug" style={{ fontWeight: 600 }}>
              {highlightSlot.entries[0].is_break ? (highlightSlot.entries[0].break_label ?? 'Break') : highlightSlot.entries[0].subject_label}
            </p>
            {!highlightSlot.entries[0].is_break && (
              <p className="text-muted text-[14px] mt-0.5">
                {highlightSlot.entries[0].teacher_name} {highlightSlot.entries[0].teacher_surname}
                {highlightSlot.entries[0].room ? ` · ${highlightSlot.entries[0].room}` : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

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
            <p className="text-[13px] text-stone-500">Your school hasn't published a timetable yet.</p>
          </div>
        ) : (
          <>
            {/* View toggle — Today by default so students see what's relevant
                right now, Week available for the full picture. */}
            <div className="flex items-center rounded border p-0.5 gap-0.5 w-fit" style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}>
              <button
                onClick={() => setViewMode('today')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-bold transition-all ${
                  viewMode === 'today' ? 'text-white' : 'text-stone-500 hover:text-stone-700'
                }`}
                style={viewMode === 'today' ? { background: 'var(--color-accent)' } : undefined}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Today
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-bold transition-all ${
                  viewMode === 'week' ? 'text-white' : 'text-stone-500 hover:text-stone-700'
                }`}
                style={viewMode === 'week' ? { background: 'var(--color-accent)' } : undefined}
              >
                <Rows3 className="w-3.5 h-3.5" /> Week
              </button>
            </div>

            {viewMode === 'today' ? (
              !isSchoolDayToday ? (
                <div className="paper-card rounded p-12 flex flex-col items-center text-center">
                  <CalendarClock className="w-9 h-9 text-stone-200 mb-4" />
                  <p className="text-[16px] font-semibold text-brand-dark mb-1">No school today</p>
                  <p className="text-[13px] text-stone-500">Switch to Week to see your full schedule.</p>
                </div>
              ) : todaySchedule.length === 0 ? (
                <div className="paper-card rounded p-12 flex flex-col items-center text-center">
                  <CalendarClock className="w-9 h-9 text-stone-200 mb-4" />
                  <p className="text-[16px] font-semibold text-brand-dark mb-1">Nothing scheduled for {todayLabel}</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease, delay: 0.06 }}
                  className="paper-card rounded overflow-hidden"
                >
                  {todaySchedule.map((slot, i) => {
                    const entry = slot.entries[0];
                    return (
                      <div key={slot.period.id}
                        className="flex items-center gap-4 px-5 py-3.5"
                        style={{
                          borderBottom: i === todaySchedule.length - 1 ? undefined : '1px solid var(--color-paper-raise)',
                          background: slot.isNow ? 'var(--color-paper-raise)' : undefined,
                        }}
                      >
                        <div className="w-16 shrink-0">
                          <p className="text-[12px] font-semibold text-brand-dark">{slot.period.label}</p>
                          {slot.period.start_time && slot.period.end_time && (
                            <p className="text-[10.5px] text-muted-2 mt-0.5">{slot.period.start_time.slice(0, 5)}–{slot.period.end_time.slice(0, 5)}</p>
                          )}
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: slot.isNow ? 'var(--color-accent)' : 'var(--color-brand-border)' }} />
                        <div className="min-w-0 flex-1">
                          {entry.is_break ? (
                            <p className="text-[14px] font-semibold text-amber-700">{entry.break_label ?? 'Break'}</p>
                          ) : (
                            <>
                              <p className="text-[14px] font-semibold text-brand-dark truncate">{entry.subject_label}</p>
                              <p className="text-[12px] text-muted truncate">
                                {entry.teacher_name} {entry.teacher_surname}{entry.room ? ` · ${entry.room}` : ''}
                              </p>
                            </>
                          )}
                        </div>
                        {slot.isNow && (
                          <span className="text-[11px] font-semibold shrink-0" style={{ color: 'var(--color-accent-soft)' }}>Now</span>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: 0.06 }}
                className="paper-card rounded overflow-x-auto"
              >
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 text-[12px] text-muted-2 sticky left-0 z-10 min-w-[110px]"
                        style={{ fontWeight: 600, borderBottom: '1px solid var(--color-brand-border)', borderRight: '1px solid var(--color-brand-border)', background: 'var(--color-paper-raise)' }}>
                        Period
                      </th>
                      {DAYS.map((d) => {
                        const isToday = d.value === todayDow;
                        return (
                          <th key={d.value} className={`text-left px-4 py-3 text-[12px] min-w-[160px] ${isToday ? 'text-brand-dark' : 'text-muted-2'}`}
                            style={{ fontWeight: 600, borderBottom: '1px solid var(--color-brand-border)', background: isToday ? 'var(--color-paper-raise)' : undefined }}>
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
                            <p className="text-[10px] text-muted-2 mt-0.5">{p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}</p>
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
                                    <div key={e.id} className={`rounded px-2 py-1.5 border ${
                                      e.is_break ? 'bg-amber-50 border-amber-200' : ''
                                    }`}
                                    style={!e.is_break ? { background: isToday ? '#ffffff' : 'var(--color-paper-raise)', borderColor: isToday ? 'var(--color-accent)' : 'var(--color-brand-border)' } : undefined}>
                                      {e.is_break ? (
                                        <p className="text-[11px] font-bold text-amber-700 leading-tight truncate">{e.break_label ?? 'Break'}</p>
                                      ) : (
                                        <>
                                          <p className="text-[11px] font-bold text-brand-dark leading-tight truncate">{e.subject_label}</p>
                                          <p className="text-[10px] text-muted-2 leading-tight truncate">
                                            {e.teacher_name} {e.teacher_surname}{e.room ? ` · ${e.room}` : ''}
                                          </p>
                                        </>
                                      )}
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
          </>
        )}
      </div>
    </div>
  );
}
