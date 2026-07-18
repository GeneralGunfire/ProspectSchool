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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0">
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">My Class</p>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Homeroom
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium">
            {session.cohort_name ?? `Grade ${session.grade}`} · your teacher and attendance record.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="inline-flex items-center gap-2 mt-4 border border-brand-border bg-white/70 rounded-full pl-3 pr-4 py-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(31,36,33,0.5)]">CLASS</span>
            <span className="font-black text-sm text-brand-dark">{session.cohort_name ?? `Grade ${session.grade}`}</span>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

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
