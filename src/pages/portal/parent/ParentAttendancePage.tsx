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

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              Attendance
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Present Rate</p>
                </div>
                {counts.map(({ status, count }) => {
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <div key={status} className="paper-card rounded p-4 text-center">
                      <p className={`text-xl font-black ${count === 0 ? 'text-stone-300' : 'text-brand-dark'}`}>{count}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">{cfg.label}</p>
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
