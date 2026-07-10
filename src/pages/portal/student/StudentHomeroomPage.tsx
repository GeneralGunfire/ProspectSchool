import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, X as XIcon, Thermometer, CalendarOff, UserRound } from 'lucide-react';
import { Shimmer } from './StudentHomePage';
import type { StudentSession } from '../../../lib/auth';
import {
  fetchCohortHomeroomTeacher, fetchStudentAttendanceHistory,
  type HomeroomTeacherInfo, type AttendanceRecord, type AttendanceStatus,
} from '../../../lib/homeroom';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentHomeroomPageProps { session: StudentSession; }

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: typeof Check; className: string }> = {
  present:        { label: 'Present',        icon: Check,       className: 'bg-green-50 text-green-700' },
  late:           { label: 'Late',           icon: Clock,       className: 'bg-amber-50 text-amber-700' },
  absent:         { label: 'Absent',         icon: XIcon,       className: 'bg-red-50 text-red-700' },
  excused:        { label: 'Sick',           icon: Thermometer, className: 'bg-sky-50 text-sky-700' },
  non_school_day: { label: 'No School',      icon: CalendarOff, className: 'bg-stone-100 text-stone-600' },
};

export default function StudentHomeroomPage({ session }: StudentHomeroomPageProps) {
  const [teacher, setTeacher] = useState<HomeroomTeacherInfo | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

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

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═══════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[150px] sm:min-h-[190px] lg:min-h-[210px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-homeroom.png" alt=""
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
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">My Class</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Homeroom
            </h1>
            <p className="text-[13px] text-white/60 mt-2.5 font-medium">
              {session.cohort_name ?? `Grade ${session.grade}`} · your teacher and attendance record.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

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
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-0.5">
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
                <div className="p-12 text-center">
                  <p className="text-[16px] font-semibold text-brand-dark mb-1">No attendance recorded yet</p>
                  <p className="text-[13px] text-stone-500">Your homeroom teacher marks attendance each school day.</p>
                </div>
              ) : (
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
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
