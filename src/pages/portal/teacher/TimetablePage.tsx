import { useState, useEffect, useMemo } from 'react';
import type { TeacherSession } from '../../../lib/auth';
import { DAYS, fetchSchoolPeriods, fetchTeacherTimetable, type TimetablePeriod, type TimetableEntryDetailed } from '../../../lib/timetable';

interface TimetablePageProps { session: TeacherSession; }

export default function TimetablePage({ session }: TimetablePageProps) {
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [entries, setEntries] = useState<TimetableEntryDetailed[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">My Timetable</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Weekly Timetable</h1>
      </div>

      {entries.length === 0 ? (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">No timetable set yet</p>
          <p className="text-sm text-stone-500">Your school admin hasn't built your timetable yet.</p>
        </div>
      ) : (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-stone-500 border-b border-r border-brand-border/60 bg-stone-50 sticky left-0 z-10 min-w-[110px]">
                  Period
                </th>
                {DAYS.map((d) => (
                  <th key={d.value} className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-stone-500 border-b border-brand-border/60 min-w-[160px]">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.id} className="border-b border-stone-50 last:border-0">
                  <td className="px-4 py-3 font-bold text-brand-dark border-r border-brand-border/60 bg-stone-50 sticky left-0">
                    <p className="text-xs font-black">{p.label}</p>
                    {p.start_time && p.end_time && (
                      <p className="text-[10px] text-stone-400 mt-0.5">{p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}</p>
                    )}
                  </td>
                  {DAYS.map((d) => {
                    const slotEntries = grid.get(`${d.value}-${p.period_number}`) ?? [];
                    return (
                      <td key={d.value} className="px-2 py-2 align-top border-l border-stone-50">
                        {slotEntries.length === 0 ? (
                          <span className="block text-center text-stone-200 text-xs py-2">—</span>
                        ) : (
                          <div className="space-y-1">
                            {slotEntries.map((e) => (
                              <div key={e.id} className="bg-brand-bg border border-brand-border rounded-lg px-2 py-1.5">
                                <p className="text-[11px] font-black text-brand-dark leading-tight truncate">{e.subject_label}</p>
                                <p className="text-[10px] text-stone-500 leading-tight truncate">{e.cohort_name}{e.room ? ` · ${e.room}` : ''}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
