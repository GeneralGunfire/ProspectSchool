import { useState, useEffect } from 'react';
import { Check, Clock, X as XIcon, FileText, UserRound } from 'lucide-react';
import type { StudentSession } from '../../../lib/auth';
import {
  fetchCohortHomeroomTeacher, fetchStudentAttendanceHistory,
  type HomeroomTeacherInfo, type AttendanceRecord, type AttendanceStatus,
} from '../../../lib/homeroom';

interface StudentHomeroomPageProps { session: StudentSession; }

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: typeof Check; className: string }> = {
  present: { label: 'Present', icon: Check,    className: 'bg-green-50 text-green-700' },
  late:    { label: 'Late',    icon: Clock,    className: 'bg-amber-50 text-amber-700' },
  absent:  { label: 'Absent',  icon: XIcon,    className: 'bg-red-50 text-red-700' },
  excused: { label: 'Excused', icon: FileText, className: 'bg-stone-100 text-stone-600' },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full">
      <div className="mb-8">
        <span className="eyebrow">My Class</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Homeroom</h1>
      </div>

      {/* Teacher card */}
      <div className="card-premium bg-white border border-brand-border rounded-[24px] p-6 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shrink-0">
          <UserRound className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-0.5">
            {session.cohort_name ?? `Grade ${session.grade}`}
          </p>
          {teacher ? (
            <p className="text-lg font-black text-brand-dark">{teacher.name} {teacher.surname}</p>
          ) : (
            <p className="text-sm text-stone-500 font-medium">No homeroom teacher assigned yet</p>
          )}
        </div>
      </div>

      {/* Attendance history */}
      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border/60">
          <h2 className="text-sm font-black text-brand-dark">My Attendance</h2>
          <p className="text-xs text-stone-500 mt-0.5">Last {history.length} recorded day{history.length === 1 ? '' : 's'}</p>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-brand-dark mb-1">No attendance recorded yet</p>
            <p className="text-sm text-stone-500">Your homeroom teacher marks attendance each school day.</p>
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
