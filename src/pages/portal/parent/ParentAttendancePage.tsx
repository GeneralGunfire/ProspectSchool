import { useState, useEffect } from 'react';
import { Check, Clock, X as XIcon, Thermometer, CalendarOff } from 'lucide-react';
import { fetchStudentAttendanceHistory, type AttendanceRecord, type AttendanceStatus } from '../../../lib/homeroom';
import type { ParentChild } from '../../../lib/parents';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">{child.name} {child.surname}</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Attendance</h1>
      </div>

      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border/60">
          <h2 className="text-sm font-black text-brand-dark">History</h2>
          <p className="text-xs text-stone-500 mt-0.5">Last {history.length} recorded day{history.length === 1 ? '' : 's'}</p>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-brand-dark mb-1">No attendance recorded yet</p>
            <p className="text-sm text-stone-500">The homeroom teacher marks attendance each school day.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {history.map((record, i) => {
                const { label, icon: Icon, className } = STATUS_CONFIG[record.status];
                return (
                  <tr key={record.date} className={`border-b border-stone-50 ${i === history.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-6 py-3.5 font-bold text-brand-dark">{formatDate(record.date)}</td>
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
      </div>
    </div>
  );
}
