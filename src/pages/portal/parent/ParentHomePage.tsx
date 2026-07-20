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

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Overview</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {child.name} {child.surname}
            </h1>
            <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">
              Grade {child.grade}{child.cohort_name ? ` · ${child.cohort_name}` : ''}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

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
              <Activity className="w-3.5 h-3.5 text-stone-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">This Month</p>
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-1">Attendance (Month)</p>
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-1">Behaviour (Net)</p>
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
            <Zap className="w-3.5 h-3.5 text-stone-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Quick Links</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="paper-card rounded p-4 flex flex-col items-center gap-2 hover:bg-[var(--color-paper-raise)] transition-colors"
              >
                <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: 'var(--color-paper-raise)' }}>
                  <Icon className="w-4 h-4 text-brand-dark" />
                </div>
                <span className="text-xs font-bold text-brand-dark">{label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
