import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, X as XIcon, Thermometer, CalendarOff, UserRound } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import type { StudentSession } from '../../../lib/auth';
import {
  fetchCohortHomeroomTeacher, fetchStudentAttendanceHistory,
  type HomeroomTeacherInfo, type AttendanceRecord, type AttendanceStatus,
} from '../../../lib/homeroom';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentHomeroomPageProps { session: StudentSession; }

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: typeof Check; className: string }> = {
  present:        { label: 'Present',        icon: Check,       className: 'bg-emerald-50 text-emerald-600' },
  late:           { label: 'Late',           icon: Clock,       className: 'bg-amber-50 text-amber-700' },
  absent:         { label: 'Absent',         icon: XIcon,       className: 'bg-red-50 text-red-700' },
  excused:        { label: 'Sick',           icon: Thermometer, className: 'bg-sky-50 text-sky-700' },
  non_school_day: { label: 'No School',      icon: CalendarOff, className: 'bg-stone-100 text-stone-600' },
};

export default function StudentHomeroomPage({ session }: StudentHomeroomPageProps) {
  const [teacher, setTeacher] = useState<HomeroomTeacherInfo | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (session.cohort_id) {
        const [t, h] = await Promise.all([
          fetchCohortHomeroomTeacher(session.cohort_id),
          fetchStudentAttendanceHistory(session.student_id, 30),
        ]);
        setTeacher(t);
        setHistory(h);
      }
      setLoading(false);
    };
    load();
  }, [session.cohort_id, session.student_id]);

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });

  const latestRecord = history[0] ?? null;

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header — same compact scale as Home/Announcements ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          Homeroom
        </h1>
        <p className="text-[14px] text-muted mt-1">{session.cohort_name ?? `Grade ${session.grade}`} · your teacher and attendance record.</p>

        {/* Quick status — same visual recipe as Home's focus block */}
        {!loading && latestRecord && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                latestRecord.status === 'present' ? 'bg-accent'
                : latestRecord.status === 'absent' ? 'bg-red-500'
                : latestRecord.status === 'late' ? 'bg-amber-500'
                :                                   'bg-stone-400'
              }`} />
              <span className="text-[12px] font-semibold text-muted">Last recorded · {formatDate(latestRecord.date)}</span>
            </div>
            <p className="text-brand-dark text-[20px] leading-snug" style={{ fontWeight: 600 }}>
              {STATUS_CONFIG[latestRecord.status].label}
            </p>
          </div>
        )}
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

        {loading ? (
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.06 }}
              className="paper-card rounded p-5 sm:p-6 flex items-center gap-4">
              <Shimmer className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-3 w-1/3" />
                <Shimmer className="h-5 w-1/2" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12 }}
              className="paper-card rounded overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                <Shimmer className="h-4 w-32 mb-2" />
                <Shimmer className="h-3 w-40" />
              </div>
              <div className="p-5 space-y-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Shimmer className="h-3 w-24" />
                    <Shimmer className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Teacher card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.06 }}
              className="paper-card rounded p-5 sm:p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent)' }}>
                <UserRound className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[12px] text-muted-2 mb-0.5">
                  {session.cohort_name ?? `Grade ${session.grade}`}
                </p>
                {teacher ? (
                  <p className="text-[18px] font-semibold text-brand-dark">{teacher.name} {teacher.surname}</p>
                ) : (
                  <p className="text-[14px] text-stone-500 font-medium">No homeroom teacher assigned yet</p>
                )}
              </div>
            </motion.div>

            {/* Attendance history */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.12 }}
              className="paper-card rounded overflow-hidden"
            >
              <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                <h2 className="text-[16px] font-semibold text-brand-dark">My Attendance</h2>
                <p className="text-[13px] text-stone-500 mt-0.5">Last {history.length} recorded day{history.length === 1 ? '' : 's'}</p>
              </div>

              {history.length === 0 ? (
                <div className="p-12 flex flex-col items-center text-center">
                  <CalendarOff className="w-9 h-9 text-stone-200 mb-4" />
                  <p className="text-[16px] font-semibold text-brand-dark mb-1">No attendance recorded yet</p>
                  <p className="text-[13px] text-stone-500">Your homeroom teacher marks attendance each school day.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {history.map((record, i) => {
                      const { label, icon: Icon, className } = STATUS_CONFIG[record.status];
                      return (
                        <motion.tr key={record.date}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.2) }}
                          className={i === history.length - 1 ? '' : ''}
                          style={i === history.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}
                        >
                          <td className="px-5 sm:px-6 py-3.5 font-semibold text-brand-dark text-[14px]">{formatDate(record.date)}</td>
                          <td className="px-5 sm:px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-bold rounded-full ${className}`}>
                              <Icon className="w-3 h-3" /> {label}
                            </span>
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-stone-500 text-[12px]">{record.note ?? ''}</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
