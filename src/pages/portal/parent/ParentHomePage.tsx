import { useEffect, useState } from 'react';
import { CalendarDays, Award, ClipboardList, Megaphone } from 'lucide-react';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';
import { fetchAttendanceSummary, type AttendanceSummary } from '../../../lib/homeroom';
import { fetchBehaviourSummary, type BehaviourStudentSummary } from '../../../lib/behaviour';

interface ParentHomePageProps {
  session: ParentSession;
  child: ParentChild;
  onNavigate: (page: string) => void;
}

function monthStartISO(): string {
  const d = new Date();
  d.setDate(1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function attendancePercent(s: AttendanceSummary): number | null {
  const marked = s.present + s.late + s.absent + s.excused;
  if (marked === 0) return null;
  return Math.round(((s.present + s.late) / marked) * 100);
}

export default function ParentHomePage({ child, onNavigate }: ParentHomePageProps) {
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [behaviour, setBehaviour] = useState<BehaviourStudentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [attRows, behMap] = await Promise.all([
        fetchAttendanceSummary([child.student_id], monthStartISO(), todayISO()),
        fetchBehaviourSummary([child.student_id]),
      ]);
      setAttendance(attRows[0] ?? null);
      setBehaviour(behMap.get(child.student_id) ?? null);
      setLoading(false);
    };
    load();
  }, [child.student_id]);

  const pct = attendance ? attendancePercent(attendance) : null;

  const quickLinks = [
    { id: 'attendance', label: 'Attendance', icon: CalendarDays },
    { id: 'behaviour', label: 'Behaviour', icon: Award },
    { id: 'marks', label: 'Marks', icon: ClipboardList },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">Overview</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">
          {child.name} {child.surname}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Grade {child.grade}{child.cohort_name ? ` · ${child.cohort_name}` : ''}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-premium bg-white border border-brand-border rounded-2xl p-5">
            <p className="text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">Attendance (Month)</p>
            <p className="text-2xl font-black text-brand-dark">{pct === null ? '—' : `${pct}%`}</p>
          </div>
          <div className="card-premium bg-white border border-brand-border rounded-2xl p-5">
            <p className="text-[11px] font-black uppercase tracking-wider text-stone-500 mb-1">Behaviour (Net)</p>
            <p className={`text-2xl font-black ${
              !behaviour ? 'text-brand-dark' : behaviour.net_points > 0 ? 'text-green-700' : behaviour.net_points < 0 ? 'text-red-700' : 'text-brand-dark'
            }`}>
              {behaviour ? (behaviour.net_points > 0 ? `+${behaviour.net_points}` : behaviour.net_points) : '—'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="card-premium bg-white border border-brand-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-stone-300 hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-bg flex items-center justify-center">
              <Icon className="w-4 h-4 text-brand-dark" />
            </div>
            <span className="text-xs font-black text-brand-dark">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
