import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, X as XIcon, Thermometer, ChevronLeft, ChevronRight, CalendarDays, CalendarOff, AlertCircle } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchTeacherHomerooms, fetchCohortRoster, fetchAttendanceForDate, markAttendance, markAttendanceBulk,
  markNonSchoolDay, fetchAttendanceSummary,
  type CohortWithHomeroom, type HomeroomStudent, type AttendanceRecord, type AttendanceStatus, type AttendanceSummary,
} from '../../../lib/homeroom';

interface HomeroomPageProps { session: TeacherSession; }

// Per-student marking buttons — non_school_day is deliberately excluded here,
// it's a whole-day action (see the "Not a School Day" button) not a per-student one.
type MarkableStatus = Exclude<AttendanceStatus, 'non_school_day'>;

const STATUS_CONFIG: Record<MarkableStatus, { label: string; icon: typeof Check; activeClass: string; dotClass: string }> = {
  present: { label: 'Present', icon: Check,       activeClass: 'bg-green-600 text-white border-green-600', dotClass: 'bg-green-600' },
  late:    { label: 'Late',    icon: Clock,        activeClass: 'bg-amber-500 text-white border-amber-500', dotClass: 'bg-amber-500' },
  absent:  { label: 'Absent',  icon: XIcon,        activeClass: 'bg-red-600 text-white border-red-600',     dotClass: 'bg-red-600' },
  excused: { label: 'Sick',    icon: Thermometer,  activeClass: 'bg-sky-500 text-white border-sky-500',     dotClass: 'bg-sky-500' },
};
const STATUS_ORDER: MarkableStatus[] = ['present', 'late', 'absent', 'excused'];

// All date math here stays in local time end-to-end — never round-trip
// through toISOString() (UTC), which silently shifts the date by a day in
// any timezone ahead of UTC (e.g. SAST/UTC+2) and made the date arrows
// jump by 2 days per click instead of 1.
function toLocalISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayISO(): string {
  return toLocalISO(new Date());
}

function addDays(iso: string, delta: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return toLocalISO(d);
}

function monthStartISO(): string {
  const d = new Date();
  d.setDate(1);
  return toLocalISO(d);
}

function attendancePercent(s: AttendanceSummary): number | null {
  const marked = s.present + s.late + s.absent + s.excused;
  if (marked === 0) return null;
  return Math.round(((s.present + s.late) / marked) * 100);
}

export default function HomeroomPage({ session }: HomeroomPageProps) {
  const [cohort, setCohort] = useState<CohortWithHomeroom | null>(null);
  const [roster, setRoster] = useState<HomeroomStudent[]>([]);
  const [attendance, setAttendance] = useState<Map<number, AttendanceRecord>>(new Map());
  const [date, setDate] = useState(todayISO());
  const [summary, setSummary] = useState<Map<number, AttendanceSummary>>(new Map());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingHoliday, setMarkingHoliday] = useState(false);
  const [confirmHoliday, setConfirmHoliday] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const homerooms = await fetchTeacherHomerooms(session.teacher_id);
    const first = homerooms[0] ?? null;
    setCohort(first);

    if (first) {
      const students = await fetchCohortRoster(first.id);
      setRoster(students);
      const ids = students.map((s) => s.id);
      const [att, summaryRows] = await Promise.all([
        fetchAttendanceForDate(ids, date),
        fetchAttendanceSummary(ids, monthStartISO(), todayISO()),
      ]);
      setAttendance(att);
      setSummary(new Map(summaryRows.map((r) => [r.student_id, r])));
    }
    setLoading(false);
  }, [session.teacher_id, date]);

  useEffect(() => { load(); }, [load]);

  const refreshSummary = async () => {
    const ids = roster.map((s) => s.id);
    const summaryRows = await fetchAttendanceSummary(ids, monthStartISO(), todayISO());
    setSummary(new Map(summaryRows.map((r) => [r.student_id, r])));
  };

  const handleMark = async (student_id: number, status: MarkableStatus) => {
    setSavingId(student_id);
    setSaveError(null);
    const result = await markAttendance(student_id, date, status, session.teacher_id);
    if (!result.success) {
      setSaveError(result.error);
      setSavingId(null);
      return;
    }
    setAttendance((prev) => {
      const next = new Map(prev);
      next.set(student_id, { student_id, date, status, note: null });
      return next;
    });
    await refreshSummary();
    setSavingId(null);
  };

  const handleMarkAllPresent = async () => {
    setMarkingAll(true);
    setSaveError(null);
    const ids = roster.map((s) => s.id);
    const result = await markAttendanceBulk(ids, date, 'present', session.teacher_id);
    if (!result.success) {
      setSaveError(result.error);
      setMarkingAll(false);
      return;
    }
    setAttendance(() => {
      const next = new Map<number, AttendanceRecord>();
      for (const id of ids) next.set(id, { student_id: id, date, status: 'present', note: null });
      return next;
    });
    await refreshSummary();
    setMarkingAll(false);
  };

  const handleMarkNonSchoolDay = async () => {
    setMarkingHoliday(true);
    setSaveError(null);
    const ids = roster.map((s) => s.id);
    const result = await markNonSchoolDay(ids, date, session.teacher_id);
    if (!result.success) {
      setSaveError(result.error);
      setMarkingHoliday(false);
      return;
    }
    setAttendance(() => {
      const next = new Map<number, AttendanceRecord>();
      for (const id of ids) next.set(id, { student_id: id, date, status: 'non_school_day', note: null });
      return next;
    });
    await refreshSummary();
    setMarkingHoliday(false);
    setConfirmHoliday(false);
  };

  const isToday = date === todayISO();
  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full mx-auto">
        <span className="eyebrow">Homeroom</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-4">Homeroom</h1>
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">You're not a homeroom teacher yet</p>
          <p className="text-sm text-stone-500">Ask your school admin to assign you to a class.</p>
        </div>
      </div>
    );
  }

  const presentCount = [...attendance.values()].filter((a) => a.status === 'present').length;
  const isNonSchoolDay = roster.length > 0 && roster.every((s) => attendance.get(s.id)?.status === 'non_school_day');

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <span className="eyebrow">Homeroom</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">{cohort.name}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {roster.length} students {isNonSchoolDay ? '· Not a school day' : `· ${presentCount} marked present`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setDate((d) => addDays(d, -1))}
            className="p-2.5 rounded-xl border border-brand-border bg-white hover:bg-stone-50 text-stone-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border bg-white min-w-[220px] justify-center">
            <CalendarDays className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-sm font-bold text-brand-dark whitespace-nowrap">{displayDate}</span>
          </div>
          <button onClick={() => setDate((d) => addDays(d, 1))} disabled={isToday}
            className="p-2.5 rounded-xl border border-brand-border bg-white hover:bg-stone-50 text-stone-600 transition-colors disabled:opacity-40 disabled:hover:bg-white">
            <ChevronRight className="w-4 h-4" />
          </button>
          {!isToday && (
            <button onClick={() => setDate(todayISO())}
              className="px-3 py-2.5 rounded-xl text-xs font-black text-stone-600 hover:text-brand-dark border border-brand-border bg-white hover:bg-stone-50 transition-colors">
              Today
            </button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm font-bold text-red-700">{saveError}</p>
        </div>
      )}

      {/* Legend — explains what each icon in the grid means */}
      {roster.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 px-1">
          {STATUS_ORDER.map((status) => {
            const { label, dotClass } = STATUS_CONFIG[status];
            return (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                <span className="text-xs font-bold text-stone-500">{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {roster.length > 0 && (
        <div className="flex justify-end gap-2 mb-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setConfirmHoliday(true)} disabled={markingHoliday}
            className="flex items-center gap-2 text-xs font-black text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <CalendarOff className="w-3.5 h-3.5" />
            Not a School Day
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllPresent} disabled={markingAll}
            className="flex items-center gap-2 text-xs font-black text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {markingAll
              ? <div className="w-3.5 h-3.5 border-2 border-green-700/30 border-t-green-700 rounded-full animate-spin" />
              : <Check className="w-3.5 h-3.5" />
            }
            Mark All Present
          </motion.button>
        </div>
      )}

      {isNonSchoolDay && (
        <div className="flex items-center gap-2.5 mb-3 px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl">
          <CalendarOff className="w-4 h-4 text-stone-500 shrink-0" />
          <p className="text-sm font-bold text-stone-600">
            {displayDate} is marked as not a school day. It won't count toward attendance percentages.
          </p>
        </div>
      )}

      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
        {roster.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-brand-dark mb-1">No students in this class</p>
            <p className="text-sm text-stone-500">Students appear here once they're placed in this cohort.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Student</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Code</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Month %</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((s, i) => {
                const record = attendance.get(s.id);
                const rowSummary = summary.get(s.id);
                const pct = rowSummary ? attendancePercent(rowSummary) : null;
                return (
                  <tr key={s.id} className={`border-b border-stone-50 ${i === roster.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-5 py-3.5 font-bold text-brand-dark">{s.surname}, {s.name}</td>
                    <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{s.student_code}</td>
                    <td className="px-5 py-3.5">
                      {pct === null ? (
                        <span className="text-xs text-stone-400">—</span>
                      ) : (
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                          pct >= 90 ? 'bg-green-50 text-green-700' : pct >= 75 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {pct}%
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {STATUS_ORDER.map((status) => {
                          const { label, icon: Icon, activeClass } = STATUS_CONFIG[status];
                          const active = record?.status === status;
                          return (
                            <motion.button
                              key={status}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleMark(s.id, status)}
                              disabled={savingId === s.id}
                              title={label}
                              aria-label={label}
                              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border transition-all disabled:opacity-50 ${
                                active ? activeClass : 'bg-stone-50 border-brand-border text-stone-400 hover:border-stone-300'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="hidden xl:inline text-[11px] font-black whitespace-nowrap">{label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm "Not a School Day" — overwrites the whole class's attendance for the date */}
      <AnimatePresence>
        {confirmHoliday && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmHoliday(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-4">
                  <AlertCircle className="w-5 h-5 text-stone-500" />
                </div>
                <h2 className="text-base font-black text-brand-dark mb-1">Mark {displayDate} as not a school day?</h2>
                <p className="text-sm text-stone-500 mb-6">
                  This replaces any attendance already marked for the whole class on this date, for example a public holiday or school closure. It won't count toward anyone's attendance percentage.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmHoliday(false)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleMarkNonSchoolDay} disabled={markingHoliday}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {markingHoliday
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'Confirm'
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
