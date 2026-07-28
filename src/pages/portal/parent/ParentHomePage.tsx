import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, Award, ClipboardList, Megaphone, Activity, Zap } from 'lucide-react';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';
import { fetchAttendanceSummary, type AttendanceSummary } from '../../../lib/homeroom';
import { fetchBehaviourSummary, type BehaviourStudentSummary } from '../../../lib/behaviour';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

function HealthBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden mt-1.5" style={{ background: 'var(--color-paper-raise)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

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
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Overview</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                {child.name} {child.surname}
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">
            Grade {child.grade}{child.cohort_name ? ` · ${child.cohort_name}` : ''}
          </p>
        </motion.div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1].map(i => (
              <div key={i} className="paper-card rounded p-5">
                <Shimmer className="h-3 w-28 mb-3" />
                <Shimmer className="h-7 w-16 mb-3" />
                <Shimmer className="h-1.5 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3.5 h-3.5" style={{ color: 'var(--color-navy)' }} />
              <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>This month</p>
            </div>

            {pct === null && !behaviour ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
                className="paper-card rounded p-8 flex flex-col items-center text-center">
                <Activity className="w-9 h-9 text-stone-200 mb-3" />
                <p className="text-[15px] font-semibold text-brand-dark">No records yet this month</p>
                <p className="text-[13px] text-stone-500 mt-1">Attendance and behaviour will appear here once recorded.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Attendance */}
                <div className="paper-card rounded p-5">
                  <p className="text-[12px] text-muted-2 mb-1">Attendance (month)</p>
                  {pct === null ? (
                    <p className="text-sm font-semibold text-stone-500 mt-2">No days recorded yet</p>
                  ) : (
                    <>
                      <p className="text-2xl font-black text-brand-dark">{pct}%</p>
                      <HealthBar pct={pct} color={pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-400'} />
                      <p className="text-[11px] text-stone-500 mt-1.5">
                        {attendance!.present} present · {attendance!.late} late · {attendance!.absent} absent
                        {attendance!.excused > 0 ? ` · ${attendance!.excused} excused` : ''}
                      </p>
                    </>
                  )}
                </div>

                {/* Behaviour */}
                <div className="paper-card rounded p-5">
                  <p className="text-[12px] text-muted-2 mb-1">Behaviour (net)</p>
                  {!behaviour || (behaviour.merit_points === 0 && behaviour.demerit_points === 0) ? (
                    <p className="text-sm font-semibold text-stone-500 mt-2">No records yet</p>
                  ) : (
                    <>
                      <p className={`text-2xl font-black ${
                        behaviour.net_points > 0 ? 'text-green-700' : behaviour.net_points < 0 ? 'text-red-700' : 'text-brand-dark'
                      }`}>
                        {behaviour.net_points > 0 ? `+${behaviour.net_points}` : behaviour.net_points}
                      </p>
                      <HealthBar
                        pct={behaviour.merit_points + behaviour.demerit_points > 0
                          ? Math.round((behaviour.merit_points / (behaviour.merit_points + behaviour.demerit_points)) * 100)
                          : 0}
                        color="bg-emerald-500"
                      />
                      <p className="text-[11px] text-stone-500 mt-1.5">
                        {behaviour.merit_points} merit · {behaviour.demerit_points} demerit
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--color-navy)' }} />
            <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>Quick links</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="paper-card rounded p-4 flex flex-col items-center gap-2 hover:bg-[var(--color-paper-raise)] transition-colors"
              >
                <Icon className="w-4.5 h-4.5" style={{ color: 'var(--color-navy)' }} />
                <span className="text-xs font-bold text-brand-dark">{label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
