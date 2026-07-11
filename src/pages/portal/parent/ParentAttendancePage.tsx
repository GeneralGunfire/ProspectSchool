import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, X as XIcon, Thermometer, CalendarOff } from 'lucide-react';
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
  const [imgLoaded, setImgLoaded] = useState(false);

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

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═══════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-behaviour.png" alt=""
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">{child.name} {child.surname}</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Attendance
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

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
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            className="paper-card rounded overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
              <h2 className="text-[16px] font-semibold text-brand-dark">History</h2>
              <p className="text-[13px] text-stone-500 mt-0.5">Last {history.length} recorded day{history.length === 1 ? '' : 's'}</p>
            </div>

            {history.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[16px] font-semibold text-brand-dark mb-1">No attendance recorded yet</p>
                <p className="text-[13px] text-stone-500">The homeroom teacher marks attendance each school day.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {history.map((record, i) => {
                    const { label, icon: Icon, className } = STATUS_CONFIG[record.status];
                    return (
                      <tr key={record.date} style={i === history.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}>
                        <td className="px-6 py-3.5 font-semibold text-brand-dark">{formatDate(record.date)}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-lg ${className}`}>
                            <Icon className="w-3 h-3" /> {label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-stone-500 text-xs">{record.note ?? ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
