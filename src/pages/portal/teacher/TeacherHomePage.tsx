import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, CalendarDays, ClipboardList, ChevronRight,
  Megaphone, Plus, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Target, BookOpen,
} from 'lucide-react';
import { supabaseAdmin } from '../../../lib/supabase';
import { fetchSchoolEvents, fetchHomeworkCompletionCount, type SchoolEvent } from '../../../lib/events';
import { fetchTeacherStudents } from '../../../lib/students';
import { fetchTeacherMarkSheets, type MarkSheetGroup } from '../../../lib/marks';
import {
  fetchTeacherImpactSummary, fetchTeacherClassHealth, fetchAtRiskStudents,
  fetchTeacherInterventionROI,
  type TeacherImpactSummary, type TeacherSubjectHealth, type AtRiskStudent,
  type InterventionROIRow,
} from '../../../lib/teacherAnalytics';
import type { TeacherSession } from '../../../lib/auth';

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const EVENT_TYPE_COLORS: Record<string, { pill: string; dot: string }> = {
  homework:   { pill: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-500' },
  assessment: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  exam:       { pill: 'bg-red-50 text-red-700',      dot: 'bg-red-500' },
  other:      { pill: 'bg-stone-100 text-stone-600', dot: 'bg-stone-400' },
};

interface HomeworkStat {
  event: SchoolEvent;
  completionCount: number;
  totalStudents: number;
}

interface TeacherHomePageProps {
  session: TeacherSession;
  onNavigate: (page: string) => void;
}

export default function TeacherHomePage({ session, onNavigate }: TeacherHomePageProps) {
  const today    = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [studentCount,   setStudentCount]   = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [homeworkStats,  setHomeworkStats]  = useState<HomeworkStat[]>([]);
  const [recentSheets,   setRecentSheets]   = useState<MarkSheetGroup[]>([]);
  const [impact,         setImpact]         = useState<TeacherImpactSummary | null>(null);
  const [classHealth,    setClassHealth]    = useState<TeacherSubjectHealth[]>([]);
  const [atRisk,         setAtRisk]         = useState<AtRiskStudent[]>([]);
  const [roiRows,        setRoiRows]        = useState<InterventionROIRow[]>([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    async function load() {
      const [studentsResult, events, sheetsResult] = await Promise.all([
        fetchTeacherStudents(session.teacher_id, session.school_id),
        fetchSchoolEvents(session.school_id),
        fetchTeacherMarkSheets(session.teacher_id, session.school_id),
      ]);

      if (studentsResult.success) setStudentCount(studentsResult.students.length);

      const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 4);
      setUpcomingEvents(upcoming);

      const cutoff = new Date(today);
      cutoff.setDate(cutoff.getDate() - 14);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      const recentHomework = events
        .filter(e => e.event_type === 'homework' && e.event_date >= cutoffStr && e.event_date <= todayStr)
        .slice(0, 4);

      const allStudents = studentsResult.success ? studentsResult.students : [];
      const stats = await Promise.all(recentHomework.map(async ev => {
        const completionCount = await fetchHomeworkCompletionCount(ev.id);
        let totalStudents = allStudents.length;
        if (ev.target_type === 'grade')    totalStudents = allStudents.filter(s => ev.target_grades?.includes(s.grade)).length;
        if (ev.target_type === 'class')    totalStudents = allStudents.filter(s => s.cohort_id && ev.target_cohort_ids?.includes(s.cohort_id!)).length;
        if (ev.target_type === 'specific') totalStudents = ev.target_student_ids?.length ?? 0;
        return { event: ev, completionCount, totalStudents };
      }));
      setHomeworkStats(stats);
      setRecentSheets(sheetsResult.slice(0, 3));
      setLoading(false);

      // Non-blocking analytics
      Promise.all([
        fetchTeacherImpactSummary(session.teacher_id),
        fetchTeacherClassHealth(session.teacher_id, session.school_id),
        fetchAtRiskStudents(session.teacher_id, session.school_id),
        fetchTeacherInterventionROI(session.teacher_id),
      ]).then(([imp, health, risk, roi]) => {
        setImpact(imp);
        setClassHealth(health);
        setAtRisk(risk);
        setRoiRows(roi);
      });
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-stone-200 border-t-brand-dark rounded-full animate-spin" />
      </div>
    );
  }

  const nextEvent = upcomingEvents[0] ?? null;
  const typeLabel: Record<string, string> = { past_paper: 'Past Papers', library_topic: 'Library Study', revision: 'Revision', resource_review: 'Resources' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8 space-y-4">

      {/* ── Header ───────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Overview</p>
        <h1 className="font-black text-brand-dark text-2xl md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Welcome back, {session.name}.
        </h1>
        <p className="text-sm text-stone-400 mt-0.5">{session.school_name}</p>
      </motion.div>

      {/* ── 4 stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Next Event — dark card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.04 }}
          className="bg-brand-dark rounded-2xl p-4 flex flex-col justify-between min-h-[120px]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Next Event</p>
          {nextEvent ? (
            <>
              <span className={`self-start mt-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${EVENT_TYPE_COLORS[nextEvent.event_type]?.pill ?? 'bg-stone-700 text-stone-300'}`}>
                {nextEvent.event_type}
              </span>
              <div className="mt-1">
                <p className="font-black text-white text-sm leading-tight">{nextEvent.title}</p>
                <p className="text-stone-500 text-[11px] mt-0.5">{formatDate(nextEvent.event_date)}</p>
              </div>
            </>
          ) : (
            <p className="text-stone-600 text-sm font-bold mt-auto">No upcoming events</p>
          )}
        </motion.div>

        {/* My Students */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.08 }}
          className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between min-h-[120px]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">My Students</p>
          <p className="font-black text-4xl text-brand-dark">{studentCount}</p>
          <button onClick={() => onNavigate('classes')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-0.5 mt-1">
            View Classes <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Mark Sheets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.12 }}
          className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between min-h-[120px]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Mark Sheets</p>
          <p className="font-black text-4xl text-brand-dark">
            {recentSheets.reduce((acc, g) => acc + g.sheets.length, 0)}
          </p>
          <button onClick={() => onNavigate('marks')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-0.5 mt-1">
            Enter Marks <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.16 }}
          className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between min-h-[120px]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Upcoming Events</p>
          <p className="font-black text-4xl text-brand-dark">{upcomingEvents.length}</p>
          <button onClick={() => onNavigate('calendar')}
            className="self-start text-[11px] font-black text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-0.5 mt-1">
            View Calendar <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      {/* ── Academic Impact Card ──────────────────────────────────── */}
      {impact && (impact.completedInterventions > 0 || impact.activeInterventions > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.18 }}
          className="bg-white border border-stone-200 rounded-2xl p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-4">Academic Impact</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-brand-dark">{impact.completedInterventions}</p>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">Completed</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${impact.successRate >= 70 ? 'bg-emerald-50' : impact.successRate >= 50 ? 'bg-amber-50' : 'bg-stone-50'}`}>
              <p className={`text-xl font-black ${impact.successRate >= 70 ? 'text-emerald-700' : impact.successRate >= 50 ? 'text-amber-700' : 'text-stone-500'}`}>
                {impact.successRate}%
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${impact.successRate >= 70 ? 'text-emerald-500' : impact.successRate >= 50 ? 'text-amber-500' : 'text-stone-400'}`}>
                Success
              </p>
            </div>
            <div className={`rounded-xl p-3 text-center ${impact.avgImprovement > 0 ? 'bg-blue-50' : 'bg-stone-50'}`}>
              <p className={`text-xl font-black ${impact.avgImprovement > 0 ? 'text-blue-700' : 'text-stone-400'}`}>
                {impact.avgImprovement > 0 ? `+${impact.avgImprovement}%` : '—'}
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${impact.avgImprovement > 0 ? 'text-blue-400' : 'text-stone-400'}`}>
                Avg Gain
              </p>
            </div>
          </div>
          {impact.bestType && impact.bestTypeSuccessRate > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-sm">⭐</span>
              <p className="text-[11px] text-amber-800">
                <span className="font-black">Most effective:</span>{' '}
                {typeLabel[impact.bestType] ?? impact.bestType} — {impact.bestTypeSuccessRate}% success rate
              </p>
            </div>
          )}
          {impact.activeInterventions > 0 && (
            <p className="text-[11px] text-stone-400 mt-2 text-center">
              {impact.activeInterventions} intervention{impact.activeInterventions !== 1 ? 's' : ''} currently active
            </p>
          )}
        </motion.div>
      )}

      {/* ── Intervention ROI ─────────────────────────────────────── */}
      {roiRows.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.19 }}
          className="bg-white border border-stone-200 rounded-2xl p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-4">What Works Best</p>
          <div className="space-y-2.5">
            {roiRows.map((row, i) => (
              <div key={row.type} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-stone-100">
                  <span className="text-[9px] font-black text-stone-500">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-black text-stone-900">{row.label}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-black ${row.successRate >= 70 ? 'text-emerald-600' : row.successRate >= 50 ? 'text-amber-600' : 'text-stone-400'}`}>
                        {row.successRate}%
                      </span>
                      <span className={`text-[10px] font-black ${row.avgGain > 0 ? 'text-blue-600' : 'text-stone-300'}`}>
                        {row.avgGain > 0 ? `+${row.avgGain}%` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.avgGain > 5 ? 'bg-emerald-500' : row.avgGain > 0 ? 'bg-amber-400' : 'bg-stone-300'}`}
                      style={{ width: `${Math.min(100, Math.max(0, (row.avgGain / 15) * 100))}%` }}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-300 shrink-0 w-12 text-right">{row.total} done</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-stone-300 mt-3 text-center">Success % · Avg gain per completed intervention</p>
        </motion.div>
      )}

      {/* ── Students Requiring Attention ─────────────────────────── */}
      {atRisk.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          className="bg-white border border-stone-200 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Needs Attention</p>
            <span className="text-[11px] font-bold text-red-500">{atRisk.length} student{atRisk.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-2">
            {atRisk.slice(0, 5).map((s, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                s.reason === 'below_pass'     ? 'bg-red-50 border-red-100' :
                s.reason === 'declining'      ? 'bg-amber-50 border-amber-100' :
                                                'bg-orange-50 border-orange-100'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black ${
                  s.reason === 'below_pass' ? 'bg-red-500' :
                  s.reason === 'declining'  ? 'bg-amber-500' : 'bg-orange-500'
                }`}>
                  {s.name[0]}{s.surname[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-stone-900">{s.surname}, {s.name}</p>
                  <p className="text-[10px] text-stone-500 truncate">{s.detail}</p>
                </div>
                <button
                  onClick={() => onNavigate('library')}
                  className="shrink-0 text-[10px] font-black text-stone-400 hover:text-stone-700 transition-colors"
                >
                  View
                </button>
              </div>
            ))}
          </div>
          {atRisk.length > 5 && (
            <p className="text-[11px] text-stone-400 text-center mt-3">
              +{atRisk.length - 5} more — <button onClick={() => onNavigate('library')} className="font-black text-stone-600 hover:text-stone-900">View all</button>
            </p>
          )}
        </motion.div>
      )}

      {/* ── Class Health Snapshot ─────────────────────────────────── */}
      {classHealth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.22 }}
          className="bg-white border border-stone-200 rounded-2xl p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-4">Class Health</p>
          <div className="space-y-3">
            {classHealth.slice(0, 6).map((h, i) => {
              const changeColor = h.recentChange === null ? 'text-stone-300'
                : h.recentChange >= 2  ? 'text-emerald-500'
                : h.recentChange <= -2 ? 'text-red-400'
                : 'text-stone-400';
              const avgColor = h.classAvg >= 70 ? 'text-emerald-600' : h.classAvg >= 50 ? 'text-amber-600' : 'text-red-500';
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-black text-stone-900">{h.subject}</p>
                      <span className="text-[10px] font-bold text-stone-400">Gr {h.grade}</span>
                      {h.atRiskCount > 0 && (
                        <span className="text-[10px] font-black text-red-500">{h.atRiskCount} at risk</span>
                      )}
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${h.classAvg >= 70 ? 'bg-emerald-500' : h.classAvg >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                        style={{ width: `${Math.min(h.classAvg, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-black ${avgColor}`}>{h.classAvg}%</p>
                    {h.recentChange !== null && (
                      <p className={`text-[10px] font-bold ${changeColor}`}>
                        {h.recentChange > 0 ? `+${h.recentChange}%` : `${h.recentChange}%`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Homework Completion ───────────────────────────────────── */}
      {homeworkStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.24 }}
          className="bg-white border border-stone-200 rounded-2xl p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-4">Homework Completion</p>
          <div className="space-y-3">
            {homeworkStats.map(({ event, completionCount, totalStudents }, i) => {
              const pct = totalStudents > 0 ? Math.round((completionCount / totalStudents) * 100) : 0;
              const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400';
              const textColor = pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-stone-700 truncate flex-1 mr-2">{event.title}</p>
                    <p className={`text-xs font-black shrink-0 ${textColor}`}>
                      {completionCount}/{totalStudents} · {pct}%
                    </p>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Quick Actions ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.26 }}
        className="bg-white border border-stone-200 rounded-2xl p-5"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Add Student',        icon: Users,        page: 'classes',       color: 'text-blue-600' },
            { label: 'Post Announcement',  icon: Megaphone,    page: 'announcements', color: 'text-purple-600' },
            { label: 'Create Event',       icon: CalendarDays, page: 'calendar',      color: 'text-emerald-600' },
            { label: 'Enter Marks',        icon: ClipboardList,page: 'marks',         color: 'text-amber-600' },
          ].map(({ label, icon: Icon, page, color }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition-colors text-left"
            >
              <Icon className={`w-4 h-4 shrink-0 ${color}`} />
              <span className="text-[12px] font-black text-stone-700">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.28 }}
          className="bg-white border border-stone-200 rounded-2xl p-5"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-4">Upcoming Events</p>
          <div className="space-y-2">
            {upcomingEvents.map((ev, i) => {
              const colors = EVENT_TYPE_COLORS[ev.event_type] ?? EVENT_TYPE_COLORS.other;
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-stone-900 truncate">{ev.title}</p>
                    <p className="text-[10px] text-stone-400">{formatDate(ev.event_date)}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${colors.pill}`}>
                    {ev.event_type}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

    </div>
  );
}
