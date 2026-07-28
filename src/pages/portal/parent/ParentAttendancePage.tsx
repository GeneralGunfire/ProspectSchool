import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, X as XIcon, Thermometer, CalendarOff, CalendarX2 } from 'lucide-react';
import { fetchStudentAttendanceHistory, type AttendanceRecord, type AttendanceStatus } from '../../../lib/homeroom';
import type { ParentChild } from '../../../lib/parents';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ParentAttendancePageProps { child: ParentChild; }

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: typeof Check; className: string }> = {
  present:        { label: 'Present',        icon: Check,       className: 'bg-green-50 text-green-700' },
  late:           { label: 'Late',           icon: Clock,       className: 'bg-amber-50 text-amber-700' },
  absent:         { label: 'Absent',         icon: XIcon,       className: 'bg-red-50 text-red-700' },
  excused:        { label: 'Sick',           icon: Thermometer, className: 'bg-sky-50 text-sky-700' },
  non_school_day: { label: 'No School',      icon: CalendarOff, className: 'bg-stone-100 text-stone-600' },
};

export default function ParentAttendancePage({ child }: ParentAttendancePageProps) {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const h = await fetchStudentAttendanceHistory(child.student_id, 60);
      setHistory(h);
      setLoading(false);
    };
    load();
  }, [child.student_id]);

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });

  const counts = (['present', 'late', 'absent', 'excused'] as const).map(status => ({
    status,
    count: history.filter(r => r.status === status).length,
  }));
  const schoolDays = history.filter(r => r.status !== 'non_school_day').length;
  const presentPct = schoolDays > 0
    ? Math.round((history.filter(r => r.status === 'present' || r.status === 'late').length / schoolDays) * 100)
    : null;

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Attendance
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </motion.div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

        {loading ? (
          <div className="paper-card rounded overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
              <Shimmer className="h-4 w-24 mb-2" />
              <Shimmer className="h-3 w-40" />
            </div>
            <div className="p-6 space-y-3">
              {[0, 1, 2, 3, 4].map(i => <Shimmer key={i} className="h-8" />)}
            </div>
          </div>
        ) : (
          <>
            {presentPct !== null && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
                className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="paper-card rounded p-4 text-center">
                  <p className={`text-xl font-black ${presentPct >= 90 ? 'text-emerald-600' : presentPct >= 75 ? 'text-amber-600' : 'text-red-500'}`}>{presentPct}%</p>
                  <p className="text-[12px] text-muted-2 mt-1">Present rate</p>
                </div>
                {counts.map(({ status, count }) => {
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <div key={status} className="paper-card rounded p-4 text-center">
                      <p className={`text-xl font-black ${count === 0 ? 'text-stone-300' : 'text-brand-dark'}`}>{count}</p>
                      <p className="text-[12px] text-muted-2 mt-1">{cfg.label}</p>
                    </div>
                  );
                })}
              </motion.div>
            )}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.06 }}
            className="paper-card rounded overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
              <h2 className="text-[16px] font-semibold text-brand-dark">History</h2>
              <p className="text-[13px] text-stone-500 mt-0.5">Last {history.length} recorded day{history.length === 1 ? '' : 's'}</p>
            </div>

            {history.length === 0 ? (
              <div className="p-12 flex flex-col items-center text-center">
                <CalendarX2 className="w-9 h-9 text-stone-200 mb-4" />
                <p className="text-[16px] font-semibold text-brand-dark mb-1">No attendance recorded yet</p>
                <p className="text-[13px] text-stone-500">The homeroom teacher marks attendance each school day.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {history.map((record, i) => {
                    const { label, icon: Icon, className } = STATUS_CONFIG[record.status];
                    return (
                      <tr key={record.date} style={i === history.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}>
                        <td className="px-6 py-3.5 font-semibold text-brand-dark">{formatDate(record.date)}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-full ${className}`}>
                            <Icon className="w-3 h-3" /> {label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-stone-500 text-xs">{record.note ?? ''}</td>
                      </tr>
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
