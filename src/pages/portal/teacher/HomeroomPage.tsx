import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, X as XIcon, FileText, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchTeacherHomerooms, fetchCohortRoster, fetchAttendanceForDate, markAttendance, markAttendanceBulk,
  fetchAttendanceSummary,
  type CohortWithHomeroom, type HomeroomStudent, type AttendanceRecord, type AttendanceStatus, type AttendanceSummary,
} from '../../../lib/homeroom';

interface HomeroomPageProps { session: TeacherSession; }

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: typeof Check; activeClass: string }> = {
  present: { label: 'Present', icon: Check,   activeClass: 'bg-green-600 text-white border-green-600' },
  late:    { label: 'Late',    icon: Clock,   activeClass: 'bg-amber-500 text-white border-amber-500' },
  absent:  { label: 'Absent',  icon: XIcon,   activeClass: 'bg-red-600 text-white border-red-600' },
  excused: { label: 'Excused', icon: FileText, activeClass: 'bg-stone-500 text-white border-stone-500' },
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, delta: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function monthStartISO(): string {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
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

  const handleMark = async (student_id: number, status: AttendanceStatus) => {
    setSavingId(student_id);
    await markAttendance(student_id, date, status, session.teacher_id);
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
    const ids = roster.map((s) => s.id);
    await markAttendanceBulk(ids, date, 'present', session.teacher_id);
    setAttendance(() => {
      const next = new Map<number, AttendanceRecord>();
      for (const id of ids) next.set(id, { student_id: id, date, status: 'present', note: null });
      return next;
    });
    await refreshSummary();
    setMarkingAll(false);
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
      <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full">
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

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="eyebrow">Homeroom</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">{cohort.name}</h1>
          <p className="text-sm text-stone-500 mt-1">{roster.length} students &middot; {presentCount} marked present</p>
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

      {roster.length > 0 && (
        <div className="flex justify-end mb-3">
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
                        {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((status) => {
                          const { label, icon: Icon, activeClass } = STATUS_CONFIG[status];
                          const active = record?.status === status;
                          return (
                            <motion.button
                              key={status}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleMark(s.id, status)}
                              disabled={savingId === s.id}
                              title={label}
                              className={`p-2 rounded-lg border transition-all disabled:opacity-50 ${
                                active ? activeClass : 'bg-stone-50 border-brand-border text-stone-400 hover:border-stone-300'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
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
    </div>
  );
}
